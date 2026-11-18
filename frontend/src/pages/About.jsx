import { useState } from 'react';
import { Target, Eye } from 'lucide-react';
import { http, errMsg } from '../api.js';

const STACK = ['React + Vite', 'React Router', 'Three.js / R3F / Drei', 'Framer Motion', 'Recharts', 'Axios', 'Flask', 'SQLAlchemy', 'PostgreSQL', 'JWT', 'Netlify', 'Render'];
const OBJECTIVES = ['Deliver an interactive 3D car exploration experience in the browser', 'Demonstrate a full-stack architecture: React, Flask REST API and PostgreSQL', 'Implement secure authentication and per-user data', 'Show deployment with CI-style auto deploys on Netlify and Render'];

export default function About() {
  const [f, setF] = useState({ name: '', email: '', subject: '', message: '' });
  const [type, setType] = useState('Contact');
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState(null);
  const [busy, setBusy] = useState(false);
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    const er = {};
    if (f.name.trim().length < 2) er.name = 'Enter your name';
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(f.email)) er.email = 'Enter a valid email';
    if (f.subject.trim().length < 2) er.subject = 'Enter a subject';
    if (f.message.trim().length < 5) er.message = 'Message is too short';
    setErrors(er); setStatus(null);
    if (Object.keys(er).length) return;
    setBusy(true);
    try {
      const subject = type === 'Feedback' ? `[Feedback] ${f.subject}` : f.subject;
      const { data } = await http.post('/contact', { ...f, subject });
      setStatus({ ok: true, text: data.message });
      setF({ name: '', email: '', subject: '', message: '' });
    } catch (err) { setStatus({ ok: false, text: errMsg(err, 'Could not send message') }); setErrors(err.response?.data?.fields || {}); }
    setBusy(false);
  };

  const input = (k, label, type = 'text') => (
    <div className="field"><label className="label" htmlFor={k}>{label}</label>
      <input id={k} type={type} className="input" value={f[k]} onChange={set(k)} aria-invalid={!!errors[k]} />
      {errors[k] && <span className="error small">{errors[k]}</span>}</div>
  );

  return (
    <div className="container section">
      <p className="eyebrow">About</p>
      <h1 className="h2">About AutoVerse</h1>
      <p className="lead muted">AutoVerse is a college mini-project: an interactive 3D virtual car showroom where users explore vehicles, customize paint and wheels, compare specifications, and save their favourites.</p>

      <div className="grid grid-2 mt">
        <div className="card pad"><Target className="accent" /><h3>Mission</h3><p className="muted">Make exploring automobiles as immersive and detailed as a visit to a premium showroom, from any device.</p></div>
        <div className="card pad"><Eye className="accent" /><h3>Vision</h3><p className="muted">A future where configuring and comparing your next car happens in real-time 3D on the open web.</p></div>
      </div>

      <div className="grid grid-2 mt">
        <div className="card pad"><h3>Project objectives</h3><ul className="list">{OBJECTIVES.map((o) => <li key={o}>{o}</li>)}</ul></div>
        <div className="card pad"><h3>Technology stack</h3><div className="chips">{STACK.map((s) => <span key={s} className="chip static">{s}</span>)}</div>
          <h4>Development</h4><p className="muted small">Built incrementally: UI and 3D first, then Flask API, PostgreSQL schema, authentication, and deployment. Vehicle data is illustrative sample data, not official or live.</p></div>
      </div>

      <form className="card pad mt contact-form" onSubmit={submit} noValidate>
        <h3>Contact &amp; feedback</h3>
        <div className="chips">{['Contact', 'Feedback'].map((t) => <button type="button" key={t} className={`chip ${type === t ? 'active' : ''}`} onClick={() => setType(t)}>{t}</button>)}</div>
        <div className="grid grid-2">{input('name', 'Name')}{input('email', 'Email', 'email')}</div>
        {input('subject', 'Subject')}
        <div className="field"><label className="label" htmlFor="message">Message</label>
          <textarea id="message" className="input" rows={5} value={f.message} onChange={set('message')} aria-invalid={!!errors.message} />
          {errors.message && <span className="error small">{errors.message}</span>}</div>
        {status && <p className={status.ok ? 'ok' : 'error'} role="status">{status.text}</p>}
        <button className="btn btn-primary" disabled={busy}>{busy ? 'Sending…' : `Send ${type.toLowerCase()}`}</button>
      </form>
    </div>
  );
}
