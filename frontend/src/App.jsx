import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { useEffect } from 'react';
import Navbar from './components/Navbar.jsx';
import Footer from './components/Footer.jsx';
import Home from './pages/Home.jsx';
import Showroom from './pages/Showroom.jsx';
import Customize from './pages/Customize.jsx';
import CarDetails from './pages/CarDetails.jsx';
import Compare from './pages/Compare.jsx';
import Account from './pages/Account.jsx';
import About from './pages/About.jsx';

function Page({ children }) {
  return (
    <motion.main initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}>
      {children}
    </motion.main>
  );
}

export default function App() {
  const location = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);
  const hideFooter = location.pathname.startsWith('/customize');
  return (
    <>
      <Navbar />
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<Page><Home /></Page>} />
          <Route path="/showroom" element={<Page><Showroom /></Page>} />
          <Route path="/customize" element={<Page><Customize /></Page>} />
          <Route path="/customize/:id" element={<Page><Customize /></Page>} />
          <Route path="/cars/:id" element={<Page><CarDetails /></Page>} />
          <Route path="/compare" element={<Page><Compare /></Page>} />
          <Route path="/account" element={<Page><Account /></Page>} />
          <Route path="/about" element={<Page><About /></Page>} />
          <Route path="*" element={<Page><div className="container section center"><h1>404</h1><p className="muted">Page not found.</p></div></Page>} />
        </Routes>
      </AnimatePresence>
      {!hideFooter && <Footer />}
    </>
  );
}
