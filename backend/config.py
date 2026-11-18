import os
from dotenv import load_dotenv

load_dotenv()


def _db_uri():
    uri = os.getenv("DATABASE_URL", "sqlite:///autoverse.db")  # sqlite only for quick local dev
    if uri.startswith("postgres://"):  # Render/Heroku style URL
        uri = uri.replace("postgres://", "postgresql://", 1)
    return uri


class Config:
    SECRET_KEY = os.getenv("SECRET_KEY", "dev-secret-change-me")
    JWT_SECRET_KEY = os.getenv("JWT_SECRET_KEY", "dev-jwt-secret-change-me-please-32chars")
    SQLALCHEMY_DATABASE_URI = _db_uri()
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    SQLALCHEMY_ENGINE_OPTIONS = {"pool_pre_ping": True}
    FRONTEND_URL = os.getenv("FRONTEND_URL", "http://localhost:5173")
