import { useEffect, useState } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import CarCustomizer from '../components/CarCustomizer.jsx';
import useCars from '../hooks/useCars.js';

export default function Customize() {
  const { id } = useParams();
  const nav = useNavigate();
  const [sp] = useSearchParams();
  const { cars, loading } = useCars();
  const [carId, setCarId] = useState(null);
  useEffect(() => { if (cars.length) setCarId(id ? Number(id) : cars[0].id); }, [id, cars]);
  if (loading || !carId) return <div className="container section"><p className="muted">Loading customizer…</p></div>;
  const car = cars.find((c) => c.id === carId);
  if (!car) return <div className="container section center"><h2>Vehicle not found</h2></div>;
  const initial = {};
  if (sp.get('body')) initial.body = `#${sp.get('body')}`;
  if (sp.get('wheel')) initial.wheel = `#${sp.get('wheel')}`;
  if (sp.get('finish')) initial.finish = sp.get('finish');
  return <CarCustomizer car={car} cars={cars} initial={initial} onCarChange={(n) => { setCarId(n); nav(`/customize/${n}`); }} />;
}
