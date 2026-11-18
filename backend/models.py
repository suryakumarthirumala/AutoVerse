from datetime import datetime
from werkzeug.security import generate_password_hash, check_password_hash
from extensions import db


class User(db.Model):
    __tablename__ = "users"
    id = db.Column(db.Integer, primary_key=True)
    full_name = db.Column(db.String(120), nullable=False)
    email = db.Column(db.String(255), nullable=False, unique=True, index=True)
    password_hash = db.Column(db.String(255), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)
    favorites = db.relationship("Favorite", backref="user", cascade="all, delete-orphan")
    configurations = db.relationship("Configuration", backref="user", cascade="all, delete-orphan")

    def set_password(self, password):
        self.password_hash = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password_hash, password)

    def to_dict(self):
        return {"id": self.id, "full_name": self.full_name, "email": self.email,
                "created_at": self.created_at.isoformat()}


class Car(db.Model):
    __tablename__ = "cars"
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(120), nullable=False, index=True)
    brand = db.Column(db.String(80), nullable=False, index=True)
    category = db.Column(db.String(40), nullable=False, index=True)
    price = db.Column(db.Numeric(12, 2), nullable=False)
    engine = db.Column(db.String(160))
    horsepower = db.Column(db.Integer)
    torque = db.Column(db.Integer)          # Nm
    top_speed = db.Column(db.Integer)       # km/h
    acceleration = db.Column(db.Float)      # 0-100 km/h, seconds
    fuel_type = db.Column(db.String(40))
    transmission = db.Column(db.String(80))
    seats = db.Column(db.Integer)
    mileage = db.Column(db.String(60))      # economy or electric range
    description = db.Column(db.Text)
    image_url = db.Column(db.String(500))
    model_url = db.Column(db.String(500))
    created_at = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)

    def to_dict(self):
        return {"id": self.id, "name": self.name, "brand": self.brand, "category": self.category,
                "price": float(self.price), "engine": self.engine, "horsepower": self.horsepower,
                "torque": self.torque, "top_speed": self.top_speed, "acceleration": self.acceleration,
                "fuel_type": self.fuel_type, "transmission": self.transmission, "seats": self.seats,
                "mileage": self.mileage, "description": self.description,
                "image_url": self.image_url, "model_url": self.model_url}


class Favorite(db.Model):
    __tablename__ = "favorites"
    __table_args__ = (db.UniqueConstraint("user_id", "car_id", name="uq_favorite_user_car"),)
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    car_id = db.Column(db.Integer, db.ForeignKey("cars.id", ondelete="CASCADE"), nullable=False, index=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)
    car = db.relationship("Car")

    def to_dict(self):
        return {"id": self.id, "car_id": self.car_id, "created_at": self.created_at.isoformat(),
                "car": self.car.to_dict()}


class Configuration(db.Model):
    __tablename__ = "configurations"
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    car_id = db.Column(db.Integer, db.ForeignKey("cars.id", ondelete="CASCADE"), nullable=False, index=True)
    body_color = db.Column(db.String(9), nullable=False)
    wheel_color = db.Column(db.String(9), nullable=False)
    paint_finish = db.Column(db.String(20), nullable=False, default="metallic")
    configuration_name = db.Column(db.String(120), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)
    car = db.relationship("Car")

    def to_dict(self):
        return {"id": self.id, "car_id": self.car_id, "body_color": self.body_color,
                "wheel_color": self.wheel_color, "paint_finish": self.paint_finish,
                "configuration_name": self.configuration_name,
                "created_at": self.created_at.isoformat(), "car": self.car.to_dict()}


class ContactMessage(db.Model):
    __tablename__ = "contact_messages"
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(120), nullable=False)
    email = db.Column(db.String(255), nullable=False)
    subject = db.Column(db.String(200), nullable=False)
    message = db.Column(db.Text, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)
