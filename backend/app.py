from flask import Flask, jsonify
from config import Config
from extensions import db, migrate, jwt, cors


def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)

    db.init_app(app)
    migrate.init_app(app, db)
    jwt.init_app(app)
    origins = {app.config["FRONTEND_URL"].rstrip("/"), "http://localhost:5173", "http://127.0.0.1:5173"}
    cors.init_app(app, resources={r"/api/*": {"origins": list(origins)}})

    from routes.auth import bp as auth_bp
    from routes.cars import bp as cars_bp
    from routes.favorites import bp as fav_bp
    from routes.configurations import bp as conf_bp
    from routes.contact import bp as contact_bp
    for bp in (auth_bp, cars_bp, fav_bp, conf_bp, contact_bp):
        app.register_blueprint(bp, url_prefix="/api")

    @app.get("/")
    def frontend():
        return jsonify(status="ok", service="autoverse-api")

    @app.get("/api/health")
    def health():
        db.session.execute(db.text("SELECT 1"))
        return jsonify(status="ok")

    @app.errorhandler(404)
    def nf(_):
        return jsonify(error="Not found"), 404

    @app.errorhandler(405)
    def mna(_):
        return jsonify(error="Method not allowed"), 405

    @app.errorhandler(500)
    def err(_):
        db.session.rollback()
        return jsonify(error="Internal server error"), 500

    @jwt.unauthorized_loader
    def unauth(msg):
        return jsonify(error="Authentication required"), 401

    @jwt.invalid_token_loader
    def invalid(msg):
        return jsonify(error="Invalid token"), 401

    @jwt.expired_token_loader
    def expired(h, p):
        return jsonify(error="Token expired"), 401

    @app.cli.command("seed")
    def seed():
        """Create tables (if missing) and seed sample cars."""
        from seed_data import seed_cars
        db.create_all()
        print(f"Seeded {seed_cars()} cars")

    with app.app_context():
        from seed_data import seed_cars
        db.create_all()
        seed_cars()
    return app


app = create_app()

if __name__ == "__main__":
    app.run(debug=True, port=5000)
