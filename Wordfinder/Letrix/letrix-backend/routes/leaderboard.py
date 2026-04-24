from flask import Blueprint, request, jsonify
from models import db, User, Score
from sqlalchemy import func

lb_bp = Blueprint('leaderboard', __name__)

@lb_bp.route('/blitz', methods=['GET'])
def blitz_leaderboard():
    limit = min(int(request.args.get('limit', 50)), 100)
    
    # Top scores por usuario (solo su mejor)
    subq = db.session.query(
        Score.user_id,
        func.max(Score.score).label('best_score'),
        func.min(Score.time_seconds).label('best_time')
    ).filter(Score.mode == 'blitz').group_by(Score.user_id).subquery()
    
    results = db.session.query(User, subq.c.best_score, subq.c.best_time).\
        join(subq, User.id == subq.c.user_id).\
        order_by(subq.c.best_score.desc()).\
        limit(limit).all()
    
    return jsonify({
        "leaderboard": [
            {
                "rank": idx + 1,
                "user_id": u.id,
                "name": u.display_name,
                "country": u.country,
                "score": int(score),
                "time_seconds": int(time_sec) if time_sec else 0
            }
            for idx, (u, score, time_sec) in enumerate(results)
        ]
    }), 200

@lb_bp.route('/daily', methods=['GET'])
def daily_leaderboard():
    from datetime import date
    today = date.today().isoformat()
    
    scores = Score.query.filter(
        Score.mode == 'daily',
        func.date(Score.created_at) == date.today()
    ).order_by(Score.score.desc()).limit(50).all()
    
    return jsonify({
        "date": today,
        "leaderboard": [s.to_dict() for s in scores]
    }), 200

@lb_bp.route('/country', methods=['GET'])
def country_leaderboard():
    country = request.args.get('country', 'MX').upper()
    limit = min(int(request.args.get('limit', 20)), 100)
    
    results = User.query.filter_by(country=country).\
        order_by(User.best_blitz_score.desc()).\
        limit(limit).all()
    
    return jsonify({
        "country": country,
        "leaderboard": [
            {
                "rank": idx + 1,
                "name": u.display_name,
                "score": u.best_blitz_score
            }
            for idx, u in enumerate(results)
        ]
    }), 200