import { Heart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { errMsg } from '../api.js';

export default function FavButton({ carId, label = false }) {
  const { user, isFav, toggleFavorite } = useAuth();
  const nav = useNavigate();
  const active = isFav(carId);
  const click = async (e) => {
    e.preventDefault();
    if (!user) return nav('/account');
    try { await toggleFavorite(carId); } catch (err) { alert(errMsg(err, 'Could not update favourites (demo data cannot be favourited)')); }
  };
  return (
    <button className={`btn ${label ? 'btn-ghost' : 'icon-btn'} ${active ? 'fav-on' : ''}`} onClick={click} aria-pressed={active} aria-label={active ? 'Remove from favourites' : 'Add to favourites'}>
      <Heart size={18} fill={active ? 'currentColor' : 'none'} />{label && (active ? ' Favourited' : ' Add to favourites')}
    </button>
  );
}
