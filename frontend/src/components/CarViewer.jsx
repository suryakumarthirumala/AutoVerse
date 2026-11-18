import { Canvas } from '@react-three/fiber';
import { Suspense } from 'react';
import ShowroomScene from './ShowroomScene.jsx';
import CarModel from './CarModel.jsx';
import LoadingScreen from './LoadingScreen.jsx';

const HALL_COLORS = ['#FF6B20', '#B3122B', '#10285C', '#F2F2F2', '#0F4D36'];

/** Reusable responsive 3D viewport. Pass `hall` (array of cars) for the multi-car showroom floor. */
export default function CarViewer({ car, bodyColor = '#FF6B20', wheelColor = '#D0D0D0', finish = 'metallic',
  autoRotate = true, zoom = true, hall = null, selectedId, onSelect, className = '' }) {
  return (
    <div className={`viewer ${className}`}>
      <Canvas shadows dpr={[1, 1.75]} camera={{ position: hall ? [0, 3.5, 14] : [5.5, 2.2, 6.5], fov: hall ? 40 : 38 }}
        gl={{ antialias: true, powerPreference: 'high-performance' }} aria-label="Interactive 3D car viewer">
        <Suspense fallback={null}>
          <ShowroomScene hall={!!hall} autoRotate={autoRotate && !hall} enableZoom={zoom}>
            {hall
              ? hall.map((c, i) => (
                <group key={c.id} position={[(i - (hall.length - 1) / 2) * 6, 0, 0]} scale={0.95}
                  onClick={(e) => { e.stopPropagation(); onSelect?.(c); }}
                  onPointerOver={() => (document.body.style.cursor = 'pointer')} onPointerOut={() => (document.body.style.cursor = 'auto')}>
                  <mesh position={[0, 0.04, 0]} receiveShadow>
                    <cylinderGeometry args={[3.1, 3.1, 0.08, 48]} />
                    <meshStandardMaterial color={selectedId === c.id ? '#ff6b20' : '#1d1d1d'} emissive={selectedId === c.id ? '#ff6b20' : '#000'} emissiveIntensity={0.6} metalness={0.6} roughness={0.4} />
                  </mesh>
                  <group position={[0, 0.08, 0]} rotation={[0, -0.5, 0]}>
                    <CarModel modelUrl={c.model_url} category={c.category} bodyColor={HALL_COLORS[i % HALL_COLORS.length]} />
                  </group>
                </group>
              ))
              : <CarModel modelUrl={car?.model_url} category={car?.category} bodyColor={bodyColor} wheelColor={wheelColor} finish={finish} />}
          </ShowroomScene>
        </Suspense>
      </Canvas>
      <LoadingScreen />
    </div>
  );
}
