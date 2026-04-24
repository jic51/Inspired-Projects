from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_jwt_extended import JWTManager
from flask_cors import CORS
from config import Config

from models import db
migrate = Migrate()
jwt = JWTManager()

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)
    
    CORS(app, origins=["https://letrix.app", "http://localhost:5000", "http://localhost:8000"], supports_credentials=True)
    
    db.init_app(app)
    migrate.init_app(app, db)
    jwt.init_app(app)
    
    from routes.auth import auth_bp
    from routes.game import game_bp
    from routes.leaderboard import lb_bp
    from routes.shop import shop_bp
    from routes.admin import admin_bp

    app.register_blueprint(admin_bp, url_prefix='/admin')
    app.register_blueprint(auth_bp, url_prefix='/api/auth')
    app.register_blueprint(game_bp, url_prefix='/api/game')
    app.register_blueprint(lb_bp, url_prefix='/api/leaderboard')
    app.register_blueprint(shop_bp, url_prefix='/api/shop')
    
    @app.route('/health')
    def health():
        return {"status": "ok", "version": "1.0.0"}, 200
    
    with app.app_context():
        db.create_all()
    
    return app

if __name__ == '__main__':
    app = create_app()
    app.run(host='0.0.0.0', port=5000, debug=False)