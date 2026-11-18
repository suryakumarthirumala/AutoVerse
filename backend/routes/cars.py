from flask import Blueprint, request, jsonify
from sqlalchemy import or_
from extensions import db
from models import Car

bp = Blueprint("cars", __name__)
CATEGORIES = ["Sports", "Luxury", "SUV", "Electric", "Supercar"]


@bp.get("/cars")
def list_cars():
    q = Car.query
    s = (request.args.get("q") or "").strip()
    if s:
        like = f"%{s}%"
        q = q.filter(or_(Car.name.ilike(like), Car.brand.ilike(like)))
    cat = request.args.get("category")
    if cat:
        q = q.filter(Car.category == cat)
    sort = request.args.get("sort", "name")
    order = {"price_asc": Car.price.asc(), "price_desc": Car.price.desc(), "name": Car.name.asc()}.get(sort, Car.name.asc())
    q = q.order_by(order)
    try:
        page = max(int(request.args.get("page", 1)), 1)
        per_page = min(max(int(request.args.get("per_page", 12)), 1), 100)
    except ValueError:
        return jsonify(error="page and per_page must be integers"), 400
    p = q.paginate(page=page, per_page=per_page, error_out=False)
    return jsonify(items=[c.to_dict() for c in p.items], total=p.total, page=p.page, pages=p.pages)


@bp.get("/cars/<int:car_id>")
def get_car(car_id):
    car = db.session.get(Car, car_id)
    if not car:
        return jsonify(error="Car not found"), 404
    return jsonify(car.to_dict())


@bp.get("/categories")
def categories():
    return jsonify(CATEGORIES)
