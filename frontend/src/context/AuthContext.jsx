import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { http } from '../api.js';

const Ctx = createContext(null);
export const useAuth = () => useContext(Ctx);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(!!localStorage.getItem('av_token'));

  const loadFavs = useCallback(async () => {
    try { setFavorites((await http.get('/favorites')).data); } catch { setFavorites([]); }
  }, []);

  useEffect(() => {
    if (!localStorage.getItem('av_token')) return;
    http.get('/auth/me')
      .then(({ data }) => { setUser(data.user); loadFavs(); })
      .catch((e) => { if (e.response?.status === 401) localStorage.removeItem('av_token'); })
      .finally(() => setLoading(false));
  }, [loadFavs]);

  const finish = useCallback((data) => {
    localStorage.setItem('av_token', data.access_token);
    setUser(data.user);
    loadFavs();
  }, [loadFavs]);
  const login = useCallback(async (email, password) => finish((await http.post('/auth/login', { email, password })).data), [finish]);
  const register = useCallback(async (payload) => finish((await http.post('/auth/register', payload)).data), [finish]);
  const logout = () => { localStorage.removeItem('av_token'); setUser(null); setFavorites([]); };

  const isFav = (carId) => favorites.some((f) => f.car_id === carId);
  const toggleFavorite = async (carId) => {
    const existing = favorites.find((f) => f.car_id === carId);
    if (existing) {
      await http.delete(`/favorites/${existing.id}`);
      setFavorites((f) => f.filter((x) => x.id !== existing.id));
    } else {
      const { data } = await http.post('/favorites', { car_id: carId });
      setFavorites((f) => [data, ...f]);
    }
  };

  return <Ctx.Provider value={{ user, loading, favorites, login, register, logout, isFav, toggleFavorite }}>{children}</Ctx.Provider>;
}
