from flask import Blueprint, request, jsonify
from models import db, User
from flask_jwt_extended import create_access_token
import bcrypt
from datetime import datetime, date

migrate_bp = Blueprint('migrate', __name__)

# Límites anti-cheat para migración desde localStorage
MIGRATION_LIMITS = {
    "max_gems": 5000,           # Si tiene más de 5k gemas sin compras, es sospechoso
    "max_levels": 20,
    "max_streak": 100,          # Imposible tener 100 días seguidos en V1
    "max_blitz_score": 50000,
    "max_completed_levels": 20
}

def validate_local_payload(payload):
    """Valida que los datos del cliente no sean manipulados absurdamente."""
    errors = []
    
    gems = payload.get('gems', 0)
    if not isinstance(gems, int) or gems < 0 or gems > MIGRATION_LIMITS['max_gems']:
        errors.append(f"gems out of range (0-{MIGRATION_LIMITS['max_gems']})")
    
    completed = payload.get('completed_levels', [])
    if not isinstance(completed, list):
        errors.append("completed_levels must be list")
    elif len(completed) > MIGRATION_LIMITS['max_completed_levels']:
        errors.append("too many completed levels")
    elif any(not isinstance(x, int) or x < 0 or x >= 20 for x in completed):
        errors.append("invalid level indices")
    
    streak = payload.get('streak', {}).get('count', 0)
    if not isinstance(streak, int) or streak > MIGRATION_LIMITS['max_streak']:
        errors.append("invalid streak")
    
    blitz = payload.get('blitz', {})
    if blitz.get('best_score', 0) > MIGRATION_LIMITS['max_blitz_score']:
        errors.append("blitz score too high")
    
    return len(errors) == 0, errors

def merge_user_data(user, payload):
    """
    Estrategia de merge: SERVER gana en compras/gems mayores.
    CLIENT gana en progreso de niveles si es más avanzado.
    """
    local_gems = payload.get('gems', 0)
    local_completed = set(payload.get('completed_levels', []))
    server_completed = set(user.completed_levels or [])
    
    # Niveles: unión de ambos (max progreso)
    merged_levels = sorted(list(server_completed | local_completed))[:20]
    user.completed_levels = merged_levels
    if merged_levels:
        user.current_level = min(max(merged_levels) + 1, 19)
    
    # Gems: si el server tiene más (por compra), conservar server. Si local tiene más, tomar local pero capado.
    if local_gems > user.gems:
        user.gems = min(local_gems, MIGRATION_LIMITS['max_gems'])
    
    # Streak: solo si local es más reciente
    local_streak_date = payload.get('streak', {}).get('lastPlayed')
    server_streak_date = user.streak_last_played.isoformat() if user.streak_last_played else None
    
    if local_streak_date and (not server_streak_date or local_streak_date >= server_streak_date):
        user.streak_count = payload.get('streak', {}).get('count', 0)
        # Convertir string a date
        try:
            user.streak_last_played = datetime.fromisoformat(local_streak_date).date()
        except:
            pass
    
    # Blitz: mejor score gana
    local_best = payload.get('blitz', {}).get('bestScore', 0)
    if local_best > user.best_blitz_score:
        user.best_blitz_score = local_best
    
    # Daily
    local_daily = payload.get('lastDailyDate')
    if local_daily:
        try:
            local_daily_date = datetime.fromisoformat(local_daily).date()
            if not user.daily_completed_date or local_daily_date > user.daily_completed_date:
                user.daily_completed_date = local_daily_date
        except:
            pass
    
    # Settings/idioma (opcional, se puede ignorar)
    if payload.get('language') in ('es', 'en', 'pt'):
        # No guardamos idioma en DB por ahora, pero podríamos
        pass

@migrate_bp.route('/migrate', methods=['POST'])
def migrate():
    """
    Punto único de migración desde localStorage (Fase 1) a cuenta real (Fase 2).
    Crea usuario si no existe, o mergea si ya existe (login previo en otro dispositivo).
    """
    data = request.get_json()
    email = data.get('email', '').lower().strip()
    password = data.get('password', '')
    payload = data.get('local_data', {})
    
    if not email or not password:
        return jsonify({"error": "Email and password required"}), 400
    
    # Validar integridad de datos locales
    is_valid, errors = validate_local_payload(payload)
    if not is_valid:
        return jsonify({"error": "Invalid local data", "details": errors}), 422
    
    existing = User.query.filter_by(email=email).first()
    
    if existing:
        # Usuario ya existe → login + merge
        if not bcrypt.checkpw(password.encode('utf-8'), existing.password_hash.encode('utf-8')):
            return jsonify({"error": "Account exists, wrong password"}), 401
        
        merge_user_data(existing, payload)
        existing.last_login = datetime.utcnow()
        db.session.commit()
        
        token = create_access_token(identity=str(existing.id))
        return jsonify({
            "migrated": True,
            "merged": True,
            "user": existing.to_dict(),
            "token": token,
            "message": "Progreso fusionado con tu cuenta existente"
        }), 200
    
    else:
        # Nuevo usuario desde migración
        password_hash = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')
        user = User(
            email=email,
            password_hash=password_hash,
            display_name=data.get('display_name', 'Player'),
            country=data.get('country', 'MX'),
            gems=min(payload.get('gems', 100), MIGRATION_LIMITS['max_gems']),
            completed_levels=sorted(list(set(payload.get('completed_levels', []))))[:20],
            current_level=0,
            streak_count=payload.get('streak', {}).get('count', 0),
            best_blitz_score=payload.get('blitz', {}).get('bestScore', 0)
        )
        
        # Set streak date si viene
        streak_date = payload.get('streak', {}).get('lastPlayed')
        if streak_date:
            try:
                user.streak_last_played = datetime.fromisoformat(streak_date).date()
            except:
                pass
        
        # Set daily date
        daily_date = payload.get('lastDailyDate')
        if daily_date:
            try:
                user.daily_completed_date = datetime.fromisoformat(daily_date).date()
            except:
                pass
        
        if user.completed_levels:
            user.current_level = min(max(user.completed_levels) + 1, 19)
        
        db.session.add(user)
        db.session.commit()
        
        token = create_access_token(identity=str(user.id))
        
        return jsonify({
            "migrated": True,
            "merged": False,
            "user": user.to_dict(),
            "token": token,
            "message": "¡Progreso migrado exitosamente!"
        }), 201