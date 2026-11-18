import re
from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from extensions import db
from models import Configuration, Car

bp = Blueprint("configurations", __name__)
HEX = re.compile(r"^#[0-9a-fA-F]{6}$")
FINISHES = {"metallic", "matte", "gloss"}


@bp.get("/configurations")
@jwt_required()
def list_configs():
    rows = Configuration.query.filter_by(user_id=int(get_jwt_identity())).order_by(Configuration.created_at.desc()).all()
    return jsonify([c.to_dict() for c in rows])


@bp.post("/configurations")
@jwt_required()
def create_config():
    d = request.get_json(silent=True) or {}
    name = (d.get("configuration_name") or "").strip()
    errors = {}
    if not isinstance(d.get("car_id"), int): errors["car_id"] = "car_id (integer) required"
    if not (1 <= len(name) <= 120): errors["configuration_name"] = "Name required (max 120 chars)"
    if not HEX.match(d.get("body_color") or ""): errors["body_color"] = "Use #RRGGBB"
    if not HEX.match(d.get("wheel_color") or ""): errors["wheel_color"] = "Use #RRGGBB"
    if d.get("paint_finish") not in FINISHES: errors["paint_finish"] = "Must be metallic, matte or gloss"
    if errors:
        return jsonify(error="Validation failed", fields=errors), 400
    if not db.session.get(Car, d["car_id"]):
        return jsonify(error="Car not found"), 404
    c = Configuration(user_id=int(get_jwt_identity()), car_id=d["car_id"], body_color=d["body_color"],
                      wheel_color=d["wheel_color"], paint_finish=d["paint_finish"], configuration_name=name)
    db.session.add(c)
    db.session.commit()
    return jsonify(c.to_dict()), 201


@bp.delete("/configurations/<int:cid>")
@jwt_required()
def delete_config(cid):
    c = Configuration.query.filter_by(id=cid, user_id=int(get_jwt_identity())).first()
    if not c:
        return jsonify(error="Configuration not found"), 404
    db.session.delete(c)
    db.session.commit()
    return "", 204
