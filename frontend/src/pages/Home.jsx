import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Box, Palette, GitCompare, ShieldCheck, Smartphone, Zap } from 'lucide-react';
import CarViewer from '../components/CarViewer.jsx';
import CarCard from '../components/CarCard.jsx';
import DemoBanner from '../components/DemoBanner.jsx';
import useCars from '../hooks/useCars.js';
import { CATEGORIES } from '../data/colors.js';

const fade = { initial: { opacity: 0, y: 30 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true }, transition: { duration: 0.6 } };

export default function Home() {
  const { cars, source, loading } = useCars();
  const hero = cars[3] || cars[0];
  const why = [
    [Box, 'Real 3D geometry', 'Every car is rendered live in WebGL with Three.js, not a flat picture.'],
    [Palette, 'Deep customization', 'Paint, finishes and wheels update instantly on the 3D model.'],
    [GitCompare, 'Smart comparison', 'Compare up to three cars with highlighted best values and charts.'],
    [ShieldCheck, 'Secure accounts', 'JWT authentication with hashed passwords on a Flask API.'],
    [Smartphone, 'Touch ready', 'Responsive layouts and touch gestures on every device.'],
    [Zap, 'Fast by design', 'Lazy loading, capped pixel ratio and optimized lighting.'],
  ];
  return (
    <>
      <section className="hero">
        <div className="hero-glow" />
        <div className="container hero-grid">
          <motion.div initial={{ opacity: 0, x: -40 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.7 }}>
            <p className="eyebrow">3D Virtual Showroom</p>
            <h1>DRIVE YOUR <span className="accent">DREAMS.</span></h1>
            <p className="lead">Discover exceptional automobiles. Explore every detail. Customize your dream machine.</p>
            <div className="row gap wrap">
              <Link to="/showroom" className="btn btn-primary">Explore Showroom</Link>
              <Link to="/compare" className="btn btn-ghost">Compare Cars</Link>
            </div>
          </motion.div>
          <motion.div className="hero-viewer" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.9, delay: 0.2 }}>
            <CarViewer car={hero} zoom={false} />
          </motion.div>
        </div>
      </section>

      <section className="container section">
        <DemoBanner source={source} />
        <motion.div {...fade}><p className="eyebrow">Featured collection</p><h2>Featured Automobiles</h2></motion.div>
        {loading ? <p className="muted">Loading cars…</p> : <div className="grid grid-4">{cars.slice(0, 4).map((c, i) => <CarCard key={c.id} car={c} index={i} />)}</div>}
        <div className="center mt"><Link to="/showroom" className="btn btn-ghost">View all vehicles</Link></div>
      </section>

      <section className="container section">
        <motion.div {...fade}><p className="eyebrow">Browse by type</p><h2>Popular Categories</h2></motion.div>
        <div className="grid grid-5">
          {CATEGORIES.map((c) => (
            <Link key={c} to={`/showroom?category=${c}`} className="card cat-card"><h3>{c}</h3><span className="muted small">{cars.filter((x) => x.category === c).length} models →</span></Link>
          ))}
        </div>
      </section>

      <section className="container section about-strip">
        <motion.div {...fade}>
          <p className="eyebrow">About AutoVerse</p>
          <h2>The showroom, rebuilt for the browser.</h2>
          <p className="muted">AutoVerse lets you walk a dark, cinematic showroom, orbit realistic 3D vehicles, personalise paint and wheels, and compare specs side by side, all without leaving your screen. Built as a full-stack project with React, Three.js, Flask and PostgreSQL.</p>
          <Link to="/about" className="btn btn-ghost">Learn more</Link>
        </motion.div>
      </section>

      <section className="container section">
        <motion.div {...fade}><p className="eyebrow">Why choose us</p><h2>Why AutoVerse</h2></motion.div>
        <div className="grid grid-3">
          {why.map(([Icon, t, d], i) => (
            <motion.div key={t} className="card pad" {...fade} transition={{ duration: 0.5, delay: i * 0.05 }}><Icon className="accent" /><h3>{t}</h3><p className="muted small">{d}</p></motion.div>
          ))}
        </div>
      </section>

      <section className="container section">
        <div className="stats">
          {[[cars.length || 8, 'Vehicles'], [5, 'Categories'], ['360°', 'Interactive views'], [7, 'Pages']].map(([n, l]) => (
            <div key={l}><strong>{n}</strong><span className="muted small">{l}</span></div>
          ))}
        </div>
      </section>
    </>
  );
}
