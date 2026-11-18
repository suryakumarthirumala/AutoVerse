import { Link } from 'react-router-dom';
import { Github, Twitter, Instagram, Linkedin, Mail, MapPin } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container footer-grid">
        <div>
          <div className="logo">AUTO<span>VERSE</span></div>
          <p className="muted small">A college mini-project: 3D virtual car showroom. Sample data only; not affiliated with any manufacturer.</p>
          <div className="row gap socials">
            <a href="https://github.com" target="_blank" rel="noreferrer" aria-label="GitHub"><Github size={18} /></a>
            <a href="https://twitter.com" target="_blank" rel="noreferrer" aria-label="Twitter"><Twitter size={18} /></a>
            <a href="https://instagram.com" target="_blank" rel="noreferrer" aria-label="Instagram"><Instagram size={18} /></a>
            <a href="https://linkedin.com" target="_blank" rel="noreferrer" aria-label="LinkedIn"><Linkedin size={18} /></a>
          </div>
        </div>
        <div><h4>Explore</h4><Link to="/showroom">Showroom</Link><Link to="/customize">Customize</Link><Link to="/compare">Compare</Link></div>
        <div><h4>Company</h4><Link to="/about">About</Link><Link to="/account">My Account</Link></div>
        <div><h4>Contact</h4><p className="muted small"><Mail size={14} /> hello@autoverse.example</p><p className="muted small"><MapPin size={14} /> Hyderabad, India</p></div>
      </div>
      <p className="center muted tiny footer-copy">© {new Date().getFullYear()} AutoVerse. Prices marked * are illustrative.</p>
    </footer>
  );
}
