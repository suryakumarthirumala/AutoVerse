import { useState } from 'react';

/** Photo with graceful fallback to a drawn silhouette if the image file is missing. */
export default function CarImage({ car, className = '' }) {
  const [failed, setFailed] = useState(false);
  if (!car.image_url || failed) {
    return (
      <div className={`car-fallback ${className}`} role="img" aria-label={`${car.name} placeholder`}>
        <svg viewBox="0 0 400 160" aria-hidden="true">
          <path d="M20 112 L40 84 Q70 70 130 66 L170 38 Q200 26 250 36 L292 66 Q340 72 372 92 L384 112 Z" fill="#1d1d1d" stroke="#ff6b20" strokeWidth="2" />
          <circle cx="104" cy="116" r="26" fill="#0b0b0b" stroke="#ff6b20" strokeWidth="2" /><circle cx="304" cy="116" r="26" fill="#0b0b0b" stroke="#ff6b20" strokeWidth="2" />
        </svg>
        <span>{car.brand}</span>
      </div>
    );
  }
  return <img src={car.image_url} alt={car.name} className={className} loading="lazy" onError={() => setFailed(true)} />;
}
