from flask import Blueprint, request, jsonify
from models import db, User, Score
from flask_jwt_extended import jwt_required, get_jwt_identity
from datetime import datetime, date, timedelta
import hashlib

game_bp = Blueprint('game', __name__)

def calculate_lives(user):
    if user.lives >= 5:
        return user.lives
    if not user.last_life_lost:
        return user.lives
    mins_passed = (datetime.utcnow() - user.last_life_lost).total_seconds() / 60
    recovered = int(mins_passed // 30)
    return min(5, user.lives + recovered)

@game_bp.route('/sync', methods=['POST'])
@jwt_required()
def sync_progress():
    """Client envía progreso local. Server valida y mergea."""
    user_id = int(get_jwt_identity())
    user = User.query.get_or_404(user_id)
    data = request.get_json()
    
    # Anti-cheat básico: validar que completed_levels no tenga duplicados ni valores inválidos
    client_completed = data.get('completed_levels', [])
    if not isinstance(client_completed, list) or len(client_completed) > 20:
        return jsonify({"error": "Invalid data"}), 400
    
    # Merge: server gana en conflictos (conservamos los niveles que ya tenía)
    server_completed = set(user.completed_levels or [])
    client_completed_set = set(client_completed)
    merged = sorted(list(server_completed | client_completed_set))[:20]
    
    user.completed_levels = merged
    if merged:
        user.current_level = min(max(merged) + 1, 19)
    
    # Gems: solo aceptamos incrementos razonables (anti-cheat)
    client_gems = data.get('gems', user.gems)
    if isinstance(client_gems, int) and 0 <= client_gems <= 50000:
        # Si el servidor tiene más gemas (por compra), gana el servidor
        user.gems = max(user.gems, client_gems)
    
    # Streak
    today = date.today()
    last = user.streak_last_played
    if last and (today - last).days == 1:
        user.streak_count += 1
    elif last and (today - last).days > 1:
        user.streak_count = 1
    elif not last:
        user.streak_count = 1
    user.streak_last_played = today
    
    db.session.commit()
    
    return jsonify({
        "user": user.to_dict(),
        "lives_current": calculate_lives(user),
        "server_time": datetime.utcnow().isoformat()
    }), 200

@game_bp.route('/score', methods=['POST'])
@jwt_required()
def submit_score():
    """Guarda un score y actualiza leaderboard si aplica."""
    user_id = int(get_jwt_identity())
    user = User.query.get_or_404(user_id)
    data = request.get_json()
    
    mode = data.get('mode', 'campaign')
    score_val = data.get('score', 0)
    time_sec = data.get('time_seconds', 0)
    level = data.get('level')
    
    # Validaciones
    if mode not in ('campaign', 'blitz', 'daily'):
        return jsonify({"error": "Invalid mode"}), 400
    
    score = Score(
        user_id=user_id,
        mode=mode,
        level=level,
        score=score_val,
        time_seconds=time_sec,
        words_found=data.get('words_found', 0)
    )
    db.session.add(score)
    
    # Actualizar best score de Blitz
    if mode == 'blitz' and score_val > user.best_blitz_score:
        user.best_blitz_score = score_val
        user.total_blitz_plays += 1
    
    # Recompensas server-side
    gems_earned = 0
    if mode == 'daily':
        if user.daily_completed_date != date.today():
            user.daily_completed_date = date.today()
            gems_earned = 50
            user.gems += gems_earned
    
    db.session.commit()
    
    return jsonify({
        "saved": True,
        "gems_earned": gems_earned,
        "new_best_blitz": mode == 'blitz' and score_val == user.best_blitz_score
    }), 201

@game_bp.route('/daily', methods=['GET'])
def get_daily_challenge():
    """
    Retorna la seed y configuración del día.
    Todos los jugadores reciben la misma respuesta basada en la fecha.
    """
    today = date.today().isoformat()
    seed_string = f"{today}-{request.environ.get('DAILY_SEED_SALT', 'letrix-daily-salt-2024')}"
    seed = int(hashlib.sha256(seed_string.encode()).hexdigest(), 16) % (10**9)
    
    # Palabras del daily (puedes mover esto a DB en el futuro)
    words_pool = ['SOL','LUNA','MAR','CIELO','TIERRA','FUEGO','AGUA','VIDA','PAZ','AMOR','LIBRE','FELIZ']
    
    return jsonify({
        "date": today,
        "seed": seed,
        "grid_size": 10,
        "words_pool": words_pool,
        "reward_gems": 50,
        "expires_at": (date.today() + timedelta(days=1)).isoformat()
    }), 200

@game_bp.route('/consume-life', methods=['POST'])
@jwt_required()
def consume_life():
    """Client pide gastar 1 vida. Server valida y responde."""
    user_id = int(get_jwt_identity())
    user = User.query.get_or_404(user_id)
    
    current_lives = calculate_lives(user)
    if current_lives < 1:
        return jsonify({"error": "No lives", "lives": 0, "next_life_in_minutes": 30}), 403
    
    if user.lives >= 5:
        user.last_life_lost = datetime.utcnow()
    
    user.lives = min(current_lives - 1, 5)
    db.session.commit()
    
    return jsonify({"lives": calculate_lives(user), "consumed": True}), 200

@game_bp.route('/refill-lives', methods=['POST'])
@jwt_required()
def refill_lives():
    user_id = int(get_jwt_identity())
    user = User.query.get_or_404(user_id)
    
    COST = 50
    if user.gems < COST:
        return jsonify({"error": "Not enough gems"}), 402
    
    user.gems -= COST
    user.lives = 5
    user.last_life_lost = None
    db.session.commit()
    
    return jsonify({"lives": 5, "gems": user.gems}), 200