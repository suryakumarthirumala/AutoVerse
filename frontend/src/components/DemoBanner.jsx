import { WifiOff, CheckCircle2 } from 'lucide-react';

export default function DemoBanner({ source }) {
  if (!source) return null;
  return source === 'demo' ? (
    <div className="banner warn" role="status"><WifiOff size={16} /> Demo data: the server is unreachable, so built-in sample cars are shown. Favourites, saving and contact need the API.</div>
  ) : (
    <div className="banner live" role="status"><CheckCircle2 size={16} /> Live data from the AutoVerse API</div>
  );
}
