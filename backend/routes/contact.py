import re
from flask import Blueprint, request, jsonify
from extensions import db
from models import ContactMessage

bp = Blueprint("contact", __name__)
EMAIL_RE = re.compile(r"^[^@\s]+@[^@\s]+\.[^@\s]+$")


@bp.post("/contact")
def contact():
    d = request.get_json(silent=True) or {}
    v = {k: (d.get(k) or "").strip() for k in ("name", "email", "subject", "message")}
    errors = {}
    if not 2 <= len(v["name"]) <= 120: errors["name"] = "Name required"
    if not EMAIL_RE.match(v["email"]): errors["email"] = "Valid email required"
    if not 2 <= len(v["subject"]) <= 200: errors["subject"] = "Subject required"
    if not 5 <= len(v["message"]) <= 5000: errors["message"] = "Message must be 5-5000 characters"
    if errors:
        return jsonify(error="Validation failed", fields=errors), 400
    db.session.add(ContactMessage(**v))
    db.session.commit()
    return jsonify(message="Thanks! Your message has been received."), 201
