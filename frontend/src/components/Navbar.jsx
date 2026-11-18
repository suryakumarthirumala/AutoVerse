import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';

const links = [['/', 'Home'], ['/showroom', 'Showroom'], ['/customize', 'Customize'], ['/compare', 'Compare'], ['/about', 'About'], ['/account', 'My Account']];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const { user } = useAuth();
  return (
    <header className="nav glass">
      <div className="container nav-inner">
        <Link to="/" className="logo" onClick={() => setOpen(false)}>AUTO<span>VERSE</span></Link>
        <nav className={`nav-links ${open ? 'open' : ''}`} aria-label="Main">
          {links.map(([to, label]) => (
            <NavLink key={to} to={to} end={to === '/'} onClick={() => setOpen(false)} className={({ isActive }) => (isActive ? 'active' : '')}>
              {to === '/account' && user ? user.full_name.split(' ')[0] : label}
            </NavLink>
          ))}
        </nav>
        <button className="icon-btn menu-btn" onClick={() => setOpen(!open)} aria-label="Toggle menu" aria-expanded={open}>{open ? <X /> : <Menu />}</button>
      </div>
    </header>
  );
}
