import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { RotateCcw, Save, Play, Pause } from 'lucide-react';
import CarViewer from './CarViewer.jsx';
import { BODY_COLORS, WHEEL_COLORS, FINISHES } from '../data/colors.js';
import { http, errMsg, money } from '../api.js';
import { useAuth } from '../context/AuthContext.jsx';

const DEFAULTS = { body: '#FF6B20', wheel: '#D0D0D0', finish: 'metallic' };

export default function CarCustomizer({ car, cars, onCarChange, initial }) {
  const { user } = useAuth();
  const [cfg, setCfg] = useState({ ...DEFAULTS, ...initial });
  const [auto, setAuto] = useState(true);
  const [name, setName] = useState('');
  const [status, setStatus] = useState(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => setCfg({ ...DEFAULTS, ...initial }), [car?.id]); // eslint-disable-line

  const set = (k, v) => setCfg((c) => ({ ...c, [k]: v }));

  const save = async () => {
    if (!user) return setStatus({ type: 'error', text: 'Please log in to save configurations.' });
    if (!name.trim()) return setStatus({ type: 'error', text: 'Give your configuration a name.' });
    setSaving(true);
    try {
      await http.post('/configurations', { car_id: car.id, body_color: cfg.body, wheel_color: cfg.wheel, paint_finish: cfg.finish, configuration_name: name.trim() });
      setStatus({ type: 'ok', text: 'Configuration saved to your dashboard.' });
      setName('');
    } catch (e) { setStatus({ type: 'error', text: errMsg(e, 'Could not save configuration') }); }
    setSaving(false);
  };

  return (
    <div className="customizer">
      <div className="customizer-stage">
        <CarViewer car={car} bodyColor={cfg.body} wheelColor={cfg.wheel} finish={cfg.finish} autoRotate={auto} />
        <button className="btn btn-ghost stage-toggle" onClick={() => setAuto(!auto)} aria-label="Toggle auto rotation">
          {auto ? <Pause size={16} /> : <Play size={16} />} {auto ? 'Pause' : 'Rotate'}
        </button>
        <p className="stage-hint">Drag to rotate · Scroll / pinch to zoom</p>
      </div>

      <aside className="customizer-panel glass">
        <label className="label" htmlFor="carsel">Vehicle</label>
        <select id="carsel" className="input" value={car.id} onChange={(e) => onCarChange(Number(e.target.value))}>
          {cars.map((c) => <option key={c.id} value={c.id}>{c.brand} {c.name.replace(c.brand, '').trim()}</option>)}
        </select>
        <div className="info-box">
          <h3>{car.name}</h3>
          <p className="muted small">{car.category} · {car.horsepower} hp · {car.acceleration}s 0-100 · {money(car.price)}*</p>
          <Link to={`/cars/${car.id}`} className="link small">Full specifications →</Link>
        </div>

        <h4>Body colour</h4>
        <div className="swatches">
          {BODY_COLORS.map((c) => (
            <button key={c.hex} title={c.name} aria-label={c.name} className={`swatch ${cfg.body === c.hex ? 'active' : ''}`} style={{ background: c.hex }} onClick={() => set('body', c.hex)} />
          ))}
          <input type="color" aria-label="Custom body colour" value={cfg.body} onChange={(e) => set('body', e.target.value)} className="swatch-input" />
        </div>

        <h4>Paint finish</h4>
        <div className="chips">
          {Object.entries(FINISHES).map(([k, v]) => (
            <button key={k} className={`chip ${cfg.finish === k ? 'active' : ''}`} onClick={() => set('finish', k)}>{v.label}</button>
          ))}
        </div>

        <h4>Wheels</h4>
        <div className="swatches">
          {WHEEL_COLORS.map((c) => (
            <button key={c.hex} title={c.name} aria-label={`Wheels ${c.name}`} className={`swatch ${cfg.wheel === c.hex ? 'active' : ''}`} style={{ background: c.hex }} onClick={() => set('wheel', c.hex)} />
          ))}
        </div>

        <div className="row gap">
          <button className="btn btn-ghost" onClick={() => setCfg({ ...DEFAULTS })}><RotateCcw size={16} /> Reset</button>
        </div>

        <label className="label" htmlFor="cfgname">Save configuration</label>
        <input id="cfgname" className="input" placeholder="e.g. Track Day Orange" value={name} maxLength={120} onChange={(e) => setName(e.target.value)} />
        <button className="btn btn-primary" onClick={save} disabled={saving}><Save size={16} /> {saving ? 'Saving…' : 'Save configuration'}</button>
        {status && <p className={status.type === 'ok' ? 'ok' : 'error'} role="status">{status.text}{status.type === 'error' && !user && <> <Link to="/account" className="link">Log in</Link></>}</p>}
        <p className="muted tiny">*Illustrative price. Not an official quote.</p>
      </aside>
    </div>
  );
}
