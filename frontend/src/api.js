import axios from 'axios';
import { DEMO_CARS } from './data/demoCars.js';

export const http = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  timeout: 15000,
});

http.interceptors.request.use((cfg) => {
  const t = localStorage.getItem('av_token');
  if (t) cfg.headers.Authorization = `Bearer ${t}`;
  return cfg;
});

export const errMsg = (e, fallback = 'Something went wrong') =>
  e?.response?.data?.error || (e?.code === 'ERR_NETWORK' ? 'Cannot reach the server' : fallback);

let carsCache = null;
export async function fetchCars() {
  if (carsCache) return carsCache;
  try {
    const { data } = await http.get('/cars', { params: { per_page: 100 } });
    carsCache = { cars: data.items, source: 'server' };
  } catch {
    return { cars: DEMO_CARS, source: 'demo' }; // not cached so we retry next time
  }
  return carsCache;
}

export async function fetchCar(id) {
  try {
    const { data } = await http.get(`/cars/${id}`);
    return { car: data, source: 'server' };
  } catch (e) {
    if (e.response?.status === 404) return { car: null, source: 'server' };
    return { car: DEMO_CARS.find((c) => c.id === Number(id)) || null, source: 'demo' };
  }
}

export const getRecent = () => JSON.parse(localStorage.getItem('av_recent') || '[]');
export function addRecent(id) {
  const list = [id, ...getRecent().filter((x) => x !== id)].slice(0, 6);
  localStorage.setItem('av_recent', JSON.stringify(list));
}

export const money = (n) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(n);
