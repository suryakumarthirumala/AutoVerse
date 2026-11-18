from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from extensions import db
from models import Favorite, Car

bp = Blueprint("favorites", __name__)


@bp.get("/favorites")
@jwt_required()
def list_favs():
    uid = int(get_jwt_identity())
    favs = Favorite.query.filter_by(user_id=uid).order_by(Favorite.created_at.desc()).all()
    return jsonify([f.to_dict() for f in favs])


@bp.post("/favorites")
@jwt_required()
def add_fav():
    uid = int(get_jwt_identity())
    car_id = (request.get_json(silent=True) or {}).get("car_id")
    if not isinstance(car_id, int):
        return jsonify(error="car_id (integer) is required"), 400
    if not db.session.get(Car, car_id):
        return jsonify(error="Car not found"), 404
    existing = Favorite.query.filter_by(user_id=uid, car_id=car_id).first()
    if existing:
        return jsonify(existing.to_dict()), 200
    fav = Favorite(user_id=uid, car_id=car_id)
    db.session.add(fav)
    db.session.commit()
    return jsonify(fav.to_dict()), 201


@bp.delete("/favorites/<int:fav_id>")
@jwt_required()
def remove_fav(fav_id):
    fav = Favorite.query.filter_by(id=fav_id, user_id=int(get_jwt_identity())).first()
    if not fav:
        return jsonify(error="Favourite not found"), 404
    db.session.delete(fav)
    db.session.commit()
    return "", 204
