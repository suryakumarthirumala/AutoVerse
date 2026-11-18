import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import CarImage from '../components/CarImage.jsx';
import CarViewer from '../components/CarViewer.jsx';
import FavButton from '../components/FavButton.jsx';
import DemoBanner from '../components/DemoBanner.jsx';
import { fetchCar, addRecent, money } from '../api.js';
import { BODY_COLORS } from '../data/colors.js';

export default function CarDetails() {
  const { id } = useParams();
  const [state, setState] = useState({ loading: true });
  useEffect(() => {
    setState({ loading: true });
    fetchCar(id).then((r) => { setState({ ...r, loading: false }); if (r.car) addRecent(r.car.id); });
  }, [id]);
  const { car, source, loading } = state;
  if (loading) return <div className="container section"><p className="muted">Loading vehicle…</p></div>;
  if (!car) return <div className="container section center"><h2>Vehicle not found</h2><Link to="/showroom" className="btn btn-ghost">Back to showroom</Link></div>;

  const specs = [['Engine', car.engine], ['Horsepower', `${car.horsepower} hp`], ['Torque', `${car.torque} Nm`], ['Top speed', `${car.top_speed} km/h`],
    ['0-100 km/h', `${car.acceleration} s`], ['Fuel type', car.fuel_type], ['Transmission', car.transmission], ['Seating', `${car.seats} seats`], ['Mileage / range', car.mileage]];
  return (
    <div className="container section">
      <Link to="/showroom" className="link row gap"><ArrowLeft size={16} /> Back to showroom</Link>
      <DemoBanner source={source} />
      <div className="details-grid mt">
        <div>
          <div className="card details-img"><CarImage car={car} /></div>
          <CarViewer car={car} className="viewer-sm mt" />
        </div>
        <div>
          <p className="muted">{car.brand} · {car.category}</p>
          <h1 className="h2">{car.name}</h1>
          <p className="price big">{money(car.price)} <span className="muted tiny">Illustrative price</span></p>
          <p className="muted">{car.description}</p>
          <div className="spec-grid">{specs.map(([k, v]) => <div key={k} className="spec"><span className="muted tiny">{k}</span><strong>{v}</strong></div>)}</div>
          <h4>Available colours</h4>
          <div className="swatches">{BODY_COLORS.map((c) => <span key={c.hex} className="swatch static" title={c.name} style={{ background: c.hex }} />)}</div>
          <div className="row gap wrap mt">
            <FavButton carId={car.id} label />
            <Link to={`/customize/${car.id}`} className="btn btn-primary">Customize this car</Link>
            <Link to={`/compare?ids=${car.id}`} className="btn btn-ghost">Compare this car</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
