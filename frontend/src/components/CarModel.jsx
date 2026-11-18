import { Component, useEffect, useMemo, useState } from 'react';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';
import { FINISHES } from '../data/colors.js';

/* ---------- Procedural fallback car (real 3D geometry, no external assets) ---------- */
const bodyShape = () => {
  const s = new THREE.Shape();
  s.moveTo(-2.15, 0.32); s.lineTo(-2.15, 0.72);
  s.quadraticCurveTo(-1.9, 0.92, -1.2, 0.95);
  s.quadraticCurveTo(-0.7, 1.4, 0.1, 1.38);
  s.quadraticCurveTo(0.7, 1.32, 1.15, 0.95);
  s.quadraticCurveTo(1.9, 0.88, 2.2, 0.68);
  s.lineTo(2.2, 0.32); s.lineTo(-2.15, 0.32);
  return s;
};
const glassShape = () => {
  const s = new THREE.Shape();
  [[-1.1, 0.98], [-0.65, 1.3], [0.05, 1.33], [0.6, 1.28], [1.0, 0.98]].forEach(([x, y], i) => (i ? s.lineTo(x, y) : s.moveTo(x, y)));
  s.closePath();
  return s;
};

function ProceduralCar({ bodyColor, wheelColor, finish, scaleY = 1 }) {
  const body = useMemo(() => new THREE.ExtrudeGeometry(bodyShape(), { depth: 1.7, bevelEnabled: true, bevelSize: 0.08, bevelThickness: 0.1, bevelSegments: 4, curveSegments: 24 }), []);
  const glass = useMemo(() => new THREE.ExtrudeGeometry(glassShape(), { depth: 1.96, bevelEnabled: false }), []);
  const f = FINISHES[finish]?.props || FINISHES.metallic.props;
  const wheels = [[1.35, 0.95], [-1.35, 0.95], [1.35, -0.95], [-1.35, -0.95]];
  return (
    <group scale={[1, scaleY, 1]}>
      <mesh geometry={body} position={[0, 0, -0.85]} castShadow receiveShadow>
        <meshPhysicalMaterial color={bodyColor} {...f} envMapIntensity={1.2} />
      </mesh>
      <mesh geometry={glass} position={[0, 0, -0.98]}>
        <meshPhysicalMaterial color="#07070b" metalness={0.9} roughness={0.05} clearcoat={1} />
      </mesh>
      <mesh position={[-2.0, 1.0, 0]} castShadow>
        <boxGeometry args={[0.3, 0.05, 1.7]} />
        <meshPhysicalMaterial color={bodyColor} {...f} />
      </mesh>
      {[0.55, -0.55].map((z) => (
        <group key={z}>
          <mesh position={[2.2, 0.62, z]}><boxGeometry args={[0.06, 0.1, 0.38]} /><meshStandardMaterial color="#fff" emissive="#fff" emissiveIntensity={2} /></mesh>
          <mesh position={[-2.2, 0.65, z]}><boxGeometry args={[0.06, 0.08, 0.4]} /><meshStandardMaterial color="#f00" emissive="#f00" emissiveIntensity={1.5} /></mesh>
        </group>
      ))}
      {wheels.map(([x, z]) => (
        <group key={`${x}${z}`} position={[x, 0.38, z]} rotation={[Math.PI / 2, 0, 0]}>
          <mesh castShadow><cylinderGeometry args={[0.38, 0.38, 0.3, 32]} /><meshStandardMaterial color="#0a0a0a" roughness={0.9} /></mesh>
          <mesh position={[0, z > 0 ? 0.01 : -0.01, 0]}><cylinderGeometry args={[0.26, 0.26, 0.31, 24]} /><meshStandardMaterial color={wheelColor} metalness={0.95} roughness={0.2} /></mesh>
        </group>
      ))}
    </group>
  );
}

/* ---------- GLB / GLTF loader ---------- */
function GltfCar({ url, bodyColor, wheelColor, finish }) {
  const { scene } = useGLTF(url);
  const model = useMemo(() => {
    const c = scene.clone(true);
    c.traverse((o) => {
      if (o.isMesh) { o.castShadow = true; o.receiveShadow = true; if (o.material) o.material = o.material.clone(); }
    });
    const box = new THREE.Box3().setFromObject(c);
    const size = box.getSize(new THREE.Vector3());
    c.scale.setScalar(4.4 / Math.max(size.x, size.z));
    box.setFromObject(c);
    const ctr = box.getCenter(new THREE.Vector3());
    c.position.set(-ctr.x, -box.min.y, -ctr.z);
    return c;
  }, [scene]);

  useEffect(() => {
    const f = FINISHES[finish]?.props || FINISHES.metallic.props;
    model.traverse((o) => {
      if (!o.isMesh) return;
      const n = `${o.name} ${o.material.name}`;
      if (/body|paint|carpaint/i.test(n)) { o.material.color.set(bodyColor); Object.assign(o.material, f); o.material.needsUpdate = true; }
      else if (/(wheel|rim)/i.test(n) && !/(tire|tyre)/i.test(n)) { o.material.color.set(wheelColor); }
    });
  }, [model, bodyColor, wheelColor, finish]);
  return <primitive object={model} />;
}

class Boundary extends Component {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  componentDidCatch(e) { console.warn('3D model failed, using fallback:', e?.message); }
  render() { return this.state.failed ? this.props.fallback : this.props.children; }
}

function useModelExists(url) {
  const [ok, setOk] = useState(false);
  useEffect(() => {
    if (!url) { setOk(false); return; }
    let live = true;
    fetch(url, { method: 'HEAD' })
      .then((r) => live && setOk(r.ok && !(r.headers.get('content-type') || '').includes('text/html')))
      .catch(() => live && setOk(false));
    return () => { live = false; };
  }, [url]);
  return ok;
}

/** Renders the GLB at car.model_url if it exists in /public/models, otherwise the built-in fallback car. */
export default function CarModel({ modelUrl, bodyColor = '#FF6B20', wheelColor = '#D0D0D0', finish = 'metallic', category }) {
  const exists = useModelExists(modelUrl);
  const fallback = <ProceduralCar bodyColor={bodyColor} wheelColor={wheelColor} finish={finish} scaleY={category === 'SUV' ? 1.2 : 1} />;
  if (!exists) return fallback;
  return (
    <Boundary fallback={fallback}>
      <GltfCar url={modelUrl} bodyColor={bodyColor} wheelColor={wheelColor} finish={finish} />
    </Boundary>
  );
}
