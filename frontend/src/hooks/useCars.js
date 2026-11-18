import { useEffect, useState } from 'react';
import { fetchCars } from '../api.js';

export default function useCars() {
  const [state, setState] = useState({ cars: [], source: null, loading: true });
  useEffect(() => {
    let live = true;
    fetchCars().then((r) => live && setState({ ...r, loading: false }));
    return () => { live = false; };
  }, []);
  return state;
}
