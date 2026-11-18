import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import CarImage from './CarImage.jsx';
import FavButton from './FavButton.jsx';
import { money } from '../api.js';

export default function CarCard({ car, index = 0 }) {
  return (
    <motion.article className="card car-card" initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-40px' }} transition={{ delay: (index % 4) * 0.06, duration: 0.45 }}>
      <div className="car-card-img">
        <CarImage car={car} />
        <span className="badge">{car.category}</span>
        <div className="fav-slot"><FavButton carId={car.id} /></div>
      </div>
      <div className="car-card-body">
        <p className="muted small">{car.brand}</p>
        <h3>{car.name}</h3>
        <p className="price">{money(car.price)}<span className="muted tiny"> *est.</span></p>
        <div className="row gap wrap">
          <Link to={`/cars/${car.id}`} className="btn btn-ghost sm">Details</Link>
          <Link to={`/customize/${car.id}`} className="btn btn-primary sm">Customize</Link>
        </div>
      </div>
    </motion.article>
  );
}
