import re
from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from extensions import db
from models import User

bp = Blueprint("auth", __name__)
EMAIL_RE = re.compile(r"^[^@\s]+@[^@\s]+\.[^@\s]+$")


def _token(user):
    return create_access_token(identity=str(user.id))


@bp.post("/auth/register")
def register():
    d = request.get_json(silent=True) or {}
    name = (d.get("full_name") or "").strip()
    email = (d.get("email") or "").strip().lower()
    pw, confirm = d.get("password") or "", d.get("confirm_password")
    errors = {}
    if len(name) < 2 or len(name) > 120: errors["full_name"] = "Name must be 2-120 characters"
    if not EMAIL_RE.match(email) or len(email) > 255: errors["email"] = "Enter a valid email"
    if len(pw) < 8: errors["password"] = "Password must be at least 8 characters"
    if confirm is not None and confirm != pw: errors["confirm_password"] = "Passwords do not match"
    if errors:
        return jsonify(error="Validation failed", fields=errors), 400
    if User.query.filter_by(email=email).first():
        return jsonify(error="Email already registered", fields={"email": "Email already registered"}), 409
    user = User(full_name=name, email=email)
    user.set_password(pw)
    db.session.add(user)
    db.session.commit()
    return jsonify(access_token=_token(user), user=user.to_dict()), 201


@bp.post("/auth/login")
def login():
    d = request.get_json(silent=True) or {}
    email = (d.get("email") or "").strip().lower()
    user = User.query.filter_by(email=email).first()
    if not user or not user.check_password(d.get("password") or ""):
        return jsonify(error="Invalid email or password"), 401
    return jsonify(access_token=_token(user), user=user.to_dict())


@bp.get("/auth/me")
@jwt_required()
def me():
    user = db.session.get(User, int(get_jwt_identity()))
    if not user:
        return jsonify(error="User not found"), 404
    return jsonify(user=user.to_dict())
