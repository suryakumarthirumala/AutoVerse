import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Trash2, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';
import useCars from '../hooks/useCars.js';
import CarImage from '../components/CarImage.jsx';
import { http, errMsg, getRecent, money } from '../api.js';

const EMAIL = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;

function AuthForms() {
  const { login, register } = useAuth();
  const [mode, setMode] = useState('login');
  const [f, setF] = useState({ full_name: '', email: '', password: '', confirm_password: '' });
  const [errors, setErrors] = useState({});
  const [busy, setBusy] = useState(false);
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    const er = {};
    if (mode === 'register' && f.full_name.trim().length < 2) er.full_name = 'Enter your full name';
    if (!EMAIL.test(f.email)) er.email = 'Enter a valid email';
    if (f.password.length < (mode === 'register' ? 8 : 1)) er.password = mode === 'register' ? 'At least 8 characters' : 'Enter your password';
    if (mode === 'register' && f.confirm_password !== f.password) er.confirm_password = 'Passwords do not match';
    setErrors(er);
    if (Object.keys(er).length) return;
    setBusy(true);
    try {
      if (mode === 'login') await login(f.email, f.password);
      else await register(f);
    } catch (err) { setErrors({ form: errMsg(err, 'Request failed'), ...(err.response?.data?.fields || {}) }); }
    setBusy(false);
  };

  const field = (k, label, type = 'text', auto) => (
    <div className="field">
      <label className="label" htmlFor={k}>{label}</label>
      <input id={k} className="input" type={type} value={f[k]} onChange={set(k)} autoComplete={auto} aria-invalid={!!errors[k]} />
      {errors[k] && <span className="error small">{errors[k]}</span>}
    </div>
  );

  return (
    <div className="container section auth-wrap">
      <form className="card pad auth-card" onSubmit={submit} noValidate>
        <div className="chips">
          <button type="button" className={`chip ${mode === 'login' ? 'active' : ''}`} onClick={() => { setMode('login'); setErrors({}); }}>Login</button>
          <button type="button" className={`chip ${mode === 'register' ? 'active' : ''}`} onClick={() => { setMode('register'); setErrors({}); }}>Register</button>
        </div>
        <h2>{mode === 'login' ? 'Welcome back' : 'Create your account'}</h2>
        {mode === 'register' && field('full_name', 'Full name', 'text', 'name')}
        {field('email', 'Email', 'email', 'email')}
        {field('password', 'Password', 'password', mode === 'login' ? 'current-password' : 'new-password')}
        {mode === 'register' && field('confirm_password', 'Confirm password', 'password', 'new-password')}
        {errors.form && <p className="error" role="alert">{errors.form}</p>}
        <button className="btn btn-primary" disabled={busy}>{busy ? 'Please wait…' : mode === 'login' ? 'Login' : 'Register'}</button>
      </form>
    </div>
  );
}

function Dashboard() {
  const { user, logout, favorites, toggleFavorite } = useAuth();
  const { cars } = useCars();
  const [configs, setConfigs] = useState(null);
  const [err, setErr] = useState('');
  useEffect(() => { http.get('/configurations').then((r) => setConfigs(r.data)).catch((e) => setErr(errMsg(e))); }, []);
  const recent = getRecent().map((id) => cars.find((c) => c.id === id)).filter(Boolean);

  const delConfig = async (id) => { try { await http.delete(`/configurations/${id}`); setConfigs((c) => c.filter((x) => x.id !== id)); } catch (e) { setErr(errMsg(e)); } };

  return (
    <div className="container section">
      <div className="row between wrap gap">
        <div><p className="eyebrow">Dashboard</p><h1 className="h2">Hello, {user.full_name}</h1><p className="muted">{user.email} · member since {new Date(user.created_at).toLocaleDateString()}</p></div>
        <button className="btn btn-ghost" onClick={logout}><LogOut size={16} /> Logout</button>
      </div>
      {err && <p className="error">{err}</p>}

      <h3 className="mt">Favourite vehicles</h3>
      {favorites.length === 0 ? <p className="muted">No favourites yet. <Link to="/showroom" className="link">Browse the showroom</Link></p> : (
        <div className="grid grid-3">{favorites.map((f) => (
          <div key={f.id} className="card mini-card"><CarImage car={f.car} /><div className="pad"><h4>{f.car.name}</h4>
            <div className="row gap"><Link to={`/cars/${f.car.id}`} className="btn btn-ghost sm">View</Link><button className="btn btn-ghost sm" onClick={() => toggleFavorite(f.car_id)}><Trash2 size={14} /> Remove</button></div></div></div>
        ))}</div>
      )}

      <h3 className="mt">Saved configurations</h3>
      {configs === null ? <p className="muted">Loading…</p> : configs.length === 0 ? <p className="muted">Nothing saved yet. <Link to="/customize" className="link">Open the customizer</Link></p> : (
        <div className="grid grid-3">{configs.map((c) => (
          <div key={c.id} className="card pad"><h4>{c.configuration_name}</h4><p className="muted small">{c.car.name} · {c.paint_finish}</p>
            <div className="row gap"><span className="swatch static" style={{ background: c.body_color }} /><span className="swatch static" style={{ background: c.wheel_color }} /></div>
            <div className="row gap mt"><Link className="btn btn-primary sm" to={`/customize/${c.car_id}?body=${c.body_color.slice(1)}&wheel=${c.wheel_color.slice(1)}&finish=${c.paint_finish}`}>Open</Link>
              <button className="btn btn-ghost sm" onClick={() => delConfig(c.id)}><Trash2 size={14} /> Delete</button></div></div>
        ))}</div>
      )}

      <h3 className="mt">Recently explored</h3>
      {recent.length === 0 ? <p className="muted">Open a car's details page and it will appear here.</p> : (
        <div className="chips">{recent.map((c) => <Link key={c.id} className="chip" to={`/cars/${c.id}`}>{c.name} · {money(c.price)}</Link>)}</div>
      )}
    </div>
  );
}

export default function Account() {
  const { user, loading } = useAuth();
  if (loading) return <div className="container section"><p className="muted">Loading…</p></div>;
  return user ? <Dashboard /> : <AuthForms />;
}
