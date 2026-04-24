from flask_sqlalchemy import SQLAlchemy
from datetime import datetime

db = SQLAlchemy()

class User(db.Model):
    __tablename__ = 'users'
    
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(120), unique=True, nullable=False, index=True)
    password_hash = db.Column(db.String(255), nullable=False)
    display_name = db.Column(db.String(50), default='Player')
    country = db.Column(db.String(2), default='MX')
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    last_login = db.Column(db.DateTime, default=datetime.utcnow)
    
    # Game state (single source of truth para anti-cheat)
    gems = db.Column(db.Integer, default=100)
    lives = db.Column(db.Integer, default=5)
    last_life_lost = db.Column(db.DateTime, nullable=True)
    current_level = db.Column(db.Integer, default=0)
    completed_levels = db.Column(db.JSON, default=list)  # [0,1,2]
    streak_count = db.Column(db.Integer, default=0)
    streak_last_played = db.Column(db.Date, nullable=True)
    daily_completed_date = db.Column(db.Date, nullable=True)
    best_blitz_score = db.Column(db.Integer, default=0)
    total_blitz_plays = db.Column(db.Integer, default=0)
    
    # Monetization
    is_pro = db.Column(db.Boolean, default=False)
    pro_expires_at = db.Column(db.DateTime, nullable=True)
    
    # Relations
    scores = db.relationship('Score', backref='user', lazy=True, order_by="Score.created_at.desc()")
    
    def to_dict(self):
        return {
            'id': self.id,
            'email': self.email,
            'display_name': self.display_name,
            'country': self.country,
            'gems': self.gems,
            'lives': self.lives,
            'current_level': self.current_level,
            'completed_levels': self.completed_levels,
            'streak_count': self.streak_count,
            'best_blitz_score': self.best_blitz_score,
            'is_pro': self.is_pro
        }

class Score(db.Model):
    __tablename__ = 'scores'
    
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False, index=True)
    mode = db.Column(db.String(20), nullable=False, index=True)  # 'campaign', 'blitz', 'daily'
    level = db.Column(db.Integer, nullable=True)
    score = db.Column(db.Integer, default=0)
    time_seconds = db.Column(db.Integer, default=0)
    words_found = db.Column(db.Integer, default=0)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'display_name': self.user.display_name if self.user else 'Unknown',
            'country': self.user.country if self.user else '',
            'mode': self.mode,
            'level': self.level,
            'score': self.score,
            'time_seconds': self.time_seconds,
            'created_at': self.created_at.isoformat()
        }

class Purchase(db.Model):
    __tablename__ = 'purchases'
    
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    stripe_payment_id = db.Column(db.String(100), unique=True, nullable=True)
    item_type = db.Column(db.String(50), nullable=False)  # 'gems_100', 'gems_550', 'pro_monthly'
    amount_paid = db.Column(db.Integer, default=0)  # cents
    currency = db.Column(db.String(3), default='usd')
    status = db.Column(db.String(20), default='completed')  # completed, refunded
    created_at = db.Column(db.DateTime, default=datetime.utcnow)