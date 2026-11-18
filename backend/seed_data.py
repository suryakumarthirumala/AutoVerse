"""Illustrative sample data. Prices/specs are approximate demo values, not live or official."""
from extensions import db
from models import Car

# name, brand, category, price(USD, illustrative), engine, hp, torque Nm, top km/h, 0-100 s, fuel, transmission, seats, mileage, description, slug
ROWS = [
    ("Porsche 911 Carrera", "Porsche", "Sports", 115000, "3.0L twin-turbo flat-6", 379, 450, 293, 4.2, "Petrol", "8-speed PDK", 4, "9.5 L/100km", "The rear-engined icon, refined over six decades. Balanced, precise and usable every day.", "porsche-911"),
    ("BMW M4 Competition", "BMW", "Sports", 84000, "3.0L twin-turbo inline-6", 503, 650, 290, 3.5, "Petrol", "8-speed automatic", 4, "10.2 L/100km", "Track-bred coupe with razor-sharp steering and explosive mid-range pull.", "bmw-m4"),
    ("Mercedes-AMG GT", "Mercedes-Benz", "Luxury", 150000, "4.0L twin-turbo V8", 577, 700, 318, 3.6, "Petrol", "9-speed AMG Speedshift", 2, "11.5 L/100km", "Hand-built V8 grand tourer combining long-bonnet drama with first-class comfort.", "amg-gt"),
    ("Lamborghini Huracán", "Lamborghini", "Supercar", 261000, "5.2L naturally aspirated V10", 631, 565, 325, 2.9, "Petrol", "7-speed dual-clutch", 2, "13.7 L/100km", "A screaming V10 wrapped in an angular, wind-cheating body.", "lamborghini-huracan"),
    ("Ferrari F8 Tributo", "Ferrari", "Supercar", 276000, "3.9L twin-turbo V8", 710, 770, 340, 2.9, "Petrol", "7-speed dual-clutch", 2, "11.8 L/100km", "A tribute to Ferrari's most powerful V8, sculpted by aerodynamics.", "ferrari-f8"),
    ("Tesla Model S", "Tesla", "Electric", 89000, "Dual-motor all-wheel drive", 670, 750, 250, 3.1, "Electric", "Single-speed", 5, "Up to 634 km range", "Silent, rapid and packed with technology. A benchmark electric liftback.", "tesla-model-s"),
    ("Range Rover Sport", "Land Rover", "SUV", 120000, "3.0L turbo inline-6 mild hybrid", 395, 550, 234, 5.8, "Petrol (Mild Hybrid)", "8-speed automatic", 5, "9.0 L/100km", "Dynamic luxury SUV with commanding presence and go-anywhere capability.", "range-rover-sport"),
    ("Audi R8", "Audi", "Supercar", 158000, "5.2L naturally aspirated V10", 602, 560, 331, 3.1, "Petrol", "7-speed S tronic", 2, "13.0 L/100km", "Everyday supercar with quattro grip and a mid-mounted V10 soundtrack.", "audi-r8"),
]


def seed_cars():
    if Car.query.count() > 0:
        return 0
    for r in ROWS:
        db.session.add(Car(name=r[0], brand=r[1], category=r[2], price=r[3], engine=r[4],
                           horsepower=r[5], torque=r[6], top_speed=r[7], acceleration=r[8],
                           fuel_type=r[9], transmission=r[10], seats=r[11], mileage=r[12],
                           description=r[13], image_url=f"/images/{r[14]}.jpg",
                           model_url=f"/models/{r[14]}.glb"))
    db.session.commit()
    return len(ROWS)
