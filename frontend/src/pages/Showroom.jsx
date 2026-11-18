import { useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Search, LayoutGrid, Box } from 'lucide-react';
import CarCard from '../components/CarCard.jsx';
import CarViewer from '../components/CarViewer.jsx';
import FavButton from '../components/FavButton.jsx';
import DemoBanner from '../components/DemoBanner.jsx';
import useCars from '../hooks/useCars.js';
import { CATEGORIES } from '../data/colors.js';
import { money } from '../api.js';

export default function Showroom() {
  const { cars, source, loading } = useCars();
  const [params, setParams] = useSearchParams();
  const [q, setQ] = useState('');
  const [sort, setSort] = useState('name');
  const [mode, setMode] = useState('grid');
  const [selected, setSelected] = useState(null);
  const cat = params.get('category') || 'All';

  const list = useMemo(() => {
    const s = q.trim().toLowerCase();
    let r = cars.filter((c) => (cat === 'All' || c.category === cat) && (!s || `${c.name} ${c.brand}`.toLowerCase().includes(s)));
    r = [...r].sort((a, b) => (sort === 'price_asc' ? a.price - b.price : sort === 'price_desc' ? b.price - a.price : a.name.localeCompare(b.name)));
    return r;
  }, [cars, q, cat, sort]);

  const hall = list.slice(0, 5);
  const sel = hall.find((c) => c.id === selected?.id) || hall[0];

  return (
    <div className="container section">
      <p className="eyebrow">Explore</p>
      <h1 className="h2">Virtual Showroom</h1>
      <DemoBanner source={source} />

      <div className="toolbar">
        <div className="search"><Search size={16} /><input aria-label="Search cars" placeholder="Search by name or brand" value={q} onChange={(e) => setQ(e.target.value)} /></div>
        <select className="input" aria-label="Sort" value={sort} onChange={(e) => setSort(e.target.value)}>
          <option value="name">Name (A-Z)</option><option value="price_asc">Price: low to high</option><option value="price_desc">Price: high to low</option>
        </select>
        <div className="chips">
          <button className={`chip ${mode === 'grid' ? 'active' : ''}`} onClick={() => setMode('grid')}><LayoutGrid size={14} /> Grid</button>
          <button className={`chip ${mode === '3d' ? 'active' : ''}`} onClick={() => setMode('3d')}><Box size={14} /> 3D Showroom</button>
        </div>
      </div>
      <div className="chips scroll-x">
        {['All', ...CATEGORIES].map((c) => (
          <button key={c} className={`chip ${cat === c ? 'active' : ''}`} onClick={() => setParams(c === 'All' ? {} : { category: c })}>{c === 'Sports' ? 'Sports cars' : c === 'Luxury' ? 'Luxury cars' : c === 'Electric' ? 'Electric cars' : c === 'Supercar' ? 'Supercars' : c === 'SUV' ? 'SUVs' : c}</button>
        ))}
      </div>

      {loading && <p className="muted">Loading vehicles…</p>}
      {!loading && list.length === 0 && <div className="empty card pad center"><h3>No cars match your search</h3><button className="btn btn-ghost" onClick={() => { setQ(''); setParams({}); }}>Clear filters</button></div>}

      {!loading && list.length > 0 && mode === 'grid' && <div className="grid grid-4 mt">{list.map((c, i) => <CarCard key={c.id} car={c} index={i} />)}</div>}

      {!loading && list.length > 0 && mode === '3d' && (
        <div className="mt">
          <CarViewer hall={hall} selectedId={sel?.id} onSelect={setSelected} className="viewer-tall" />
          <div className="card pad row between wrap gap mt">
            <div><p className="muted small">{sel.brand} · {sel.category}</p><h3>{sel.name}</h3><p className="price">{money(sel.price)} <span className="muted tiny">*est.</span></p></div>
            <div className="row gap wrap"><FavButton carId={sel.id} /><Link to={`/cars/${sel.id}`} className="btn btn-ghost">Details</Link><Link to={`/customize/${sel.id}`} className="btn btn-primary">Customize</Link></div>
          </div>
          <p className="muted tiny">Tap/click a car to select it. Drag to look around. Showing the first {hall.length} results.</p>
        </div>
      )}
    </div>
  );
}
