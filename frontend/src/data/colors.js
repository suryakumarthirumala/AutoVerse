export const BODY_COLORS = [
  { name: 'Racing Orange', hex: '#FF6B20' }, { name: 'Obsidian Black', hex: '#111111' },
  { name: 'Arctic White', hex: '#F2F2F2' }, { name: 'Ruby Red', hex: '#B3122B' },
  { name: 'Midnight Blue', hex: '#10285C' }, { name: 'Racing Green', hex: '#0F4D36' },
  { name: 'Silver', hex: '#A9ADB3' }, { name: 'Sunburst Yellow', hex: '#F2C200' },
];
export const WHEEL_COLORS = [
  { name: 'Chrome', hex: '#D0D0D0' }, { name: 'Gunmetal', hex: '#3A3A3F' },
  { name: 'Black', hex: '#0B0B0B' }, { name: 'Gold', hex: '#C9A227' }, { name: 'Orange', hex: '#FF6B20' },
];
export const FINISHES = {
  metallic: { label: 'Metallic', props: { metalness: 0.9, roughness: 0.25, clearcoat: 1, clearcoatRoughness: 0.1 } },
  matte: { label: 'Matte', props: { metalness: 0.1, roughness: 0.85, clearcoat: 0, clearcoatRoughness: 0.5 } },
  gloss: { label: 'Gloss', props: { metalness: 0.2, roughness: 0.08, clearcoat: 1, clearcoatRoughness: 0.03 } },
};
export const CATEGORIES = ['Sports', 'Luxury', 'SUV', 'Electric', 'Supercar'];
