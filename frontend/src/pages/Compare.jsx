import { useMemo } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { X } from 'lucide-react';
import DemoBanner from '../components/DemoBanner.jsx';
import CarImage from '../components/CarImage.jsx';
import useCars from '../hooks/useCars.js';
import { money } from '../api.js';

const ROWS = [
  ['price', 'Price*', 'min', (v) => money(v)], ['horsepower', 'Horsepower', 'max', (v) => `${v} hp`],
  ['torque', 'Torque', 'max', (v) => `${v} Nm`], ['acceleration', '0-100 km/h', 'min', (v) => `${v} s`],
  ['top_speed', 'Top speed', 'max', (v) => `${v} km/h`], ['seats', 'Seating', 'max', (v) => `${v}`],
  ['fuel_type', 'Fuel type'], ['transmission', 'Transmission'], ['engine', 'Engine'], ['mileage', 'Mileage / range'],
];

function Chart({ title, data, dataKey, fmt }) {
  return (
    <div className="card pad">
      <h4>{title}</h4>
      <div style={{ height: 220 }}>
        <ResponsiveContainer>
          <BarChart data={data} margin={{ left: -10, right: 8 }}>
            <CartesianGrid stroke="#292929" vertical={false} />
            <XAxis dataKey="name" stroke="#A1A1A1" fontSize={11} tickLine={false} />
            <YAxis stroke="#A1A1A1" fontSize={11} tickLine={false} axisLine={false} />
            <Tooltip cursor={{ fill: '#ffffff08' }} contentStyle={{ background: '#191919', border: '1px solid #292929', borderRadius: 8 }} formatter={(v) => fmt(v)} />
            <Bar dataKey={dataKey} fill="#FF6B20" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default function Compare() {
  const { cars, source, loading } = useCars();
  const [params, setParams] = useSearchParams();
  const ids = (params.get('ids') || '').split(',').filter(Boolean).map(Number).slice(0, 3);
  const setIds = (arr) => setParams(arr.length ? { ids: arr.join(',') } : {});
  const selected = ids.map((i) => cars.find((c) => c.id === i)).filter(Boolean);
  const data = useMemo(() => selected.map((c) => ({ name: c.name.split(' ').slice(0, 2).join(' '), price: c.price, horsepower: c.horsepower, top_speed: c.top_speed, acceleration: c.acceleration })), [selected]);

  const best = (key, mode) => {
    if (selected.length < 2 || !mode) return null;
    const vals = selected.map((c) => c[key]);
    return mode === 'max' ? Math.max(...vals) : Math.min(...vals);
  };

  return (
    <div className="container section">
      <p className="eyebrow">Side by side</p>
      <h1 className="h2">Compare Cars</h1>
      <DemoBanner source={source} />
      {loading ? <p className="muted">Loading…</p> : (
        <>
          <div className="grid grid-3 mt">
            {[0, 1, 2].map((slot) => {
              const car = selected[slot];
              return car ? (
                <div key={slot} className="card pad compare-card">
                  <button className="icon-btn remove" aria-label={`Remove ${car.name}`} onClick={() => setIds(ids.filter((x) => x !== car.id))}><X size={16} /></button>
                  <CarImage car={car} className="compare-img" /><h3>{car.name}</h3><p className="muted small">{car.brand} · {car.category}</p>
                  <Link to={`/cars/${car.id}`} className="link small">Details →</Link>
                </div>
              ) : (
                <div key={slot} className="card pad compare-card empty-slot">
                  <label className="label" htmlFor={`slot${slot}`}>{slot < 2 ? `Select car ${slot + 1}` : 'Add a third car (optional)'}</label>
                  <select id={`slot${slot}`} className="input" value="" onChange={(e) => e.target.value && setIds([...ids, Number(e.target.value)])}>
                    <option value="">Choose…</option>
                    {cars.filter((c) => !ids.includes(c.id)).map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>
              );
            })}
          </div>

          {selected.length < 2 ? <p className="muted center mt">Select at least two vehicles to compare.</p> : (
            <>
              <div className="table-wrap mt">
                <table className="compare-table">
                  <thead><tr><th>Specification</th>{selected.map((c) => <th key={c.id}>{c.name}</th>)}</tr></thead>
                  <tbody>
                    {ROWS.map(([key, label, mode, fmt]) => {
                      const b = best(key, mode);
                      return (
                        <tr key={key}><th scope="row">{label}</th>
                          {selected.map((c) => <td key={c.id} className={mode && c[key] === b ? 'best' : ''}>{fmt ? fmt(c[key]) : c[key]}{mode && c[key] === b ? ' ★' : ''}</td>)}
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
              <p className="muted tiny">★ best value (highest power/speed/torque/seats, lowest price/0-100). *Illustrative prices.</p>
              <div className="grid grid-2 mt">
                <Chart title="Horsepower" data={data} dataKey="horsepower" fmt={(v) => `${v} hp`} />
                <Chart title="Top speed (km/h)" data={data} dataKey="top_speed" fmt={(v) => `${v} km/h`} />
                <Chart title="0-100 km/h (seconds, lower is better)" data={data} dataKey="acceleration" fmt={(v) => `${v} s`} />
                <Chart title="Price (USD)" data={data} dataKey="price" fmt={(v) => money(v)} />
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
}
