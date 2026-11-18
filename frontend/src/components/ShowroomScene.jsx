import { ContactShadows, Environment, Lightformer, MeshReflectorMaterial, OrbitControls } from '@react-three/drei';

/** Dark architectural showroom: reflective floor, pillars, light strips, studio lighting + orbit controls. */
export default function ShowroomScene({ children, hall = false, autoRotate = true, enableZoom = true }) {
  const span = hall ? 40 : 18;
  return (
    <>
      <color attach="background" args={['#090909']} />
      <fog attach="fog" args={['#090909', 14, hall ? 55 : 34]} />
      <ambientLight intensity={0.25} />
      <spotLight position={[6, 9, 4]} angle={0.5} penumbra={0.8} intensity={hall ? 120 : 90} castShadow shadow-mapSize={[1024, 1024]} />
      <spotLight position={[-6, 7, -4]} angle={0.6} penumbra={1} intensity={50} color="#ff8c42" />
      <Environment resolution={256} frames={1}>
        <Lightformer form="rect" intensity={3} position={[0, 6, -4]} scale={[14, 2, 1]} />
        <Lightformer form="rect" intensity={2} position={[-8, 3, 2]} rotation-y={Math.PI / 2} scale={[8, 2, 1]} />
        <Lightformer form="rect" intensity={2} position={[8, 3, 2]} rotation-y={-Math.PI / 2} scale={[8, 2, 1]} />
        <Lightformer form="ring" color="#ff6b20" intensity={2} position={[0, 4, 6]} scale={3} />
      </Environment>

      {/* floor */}
      <mesh rotation-x={-Math.PI / 2} position={[0, -0.01, 0]} receiveShadow>
        <planeGeometry args={[span * 2, span * 2]} />
        <MeshReflectorMaterial blur={[300, 100]} resolution={512} mixBlur={1} mixStrength={35} roughness={1} depthScale={1.1}
          minDepthThreshold={0.4} maxDepthThreshold={1.4} color="#101010" metalness={0.5} mirror={0} />
      </mesh>
      {/* back wall + pillars + light strips */}
      <mesh position={[0, 4, -span / 2]}><boxGeometry args={[span * 2, 8, 0.4]} /><meshStandardMaterial color="#0d0d0d" roughness={0.8} /></mesh>
      <mesh position={[0, 0.05, -span / 2 + 0.3]}><boxGeometry args={[span * 2, 0.08, 0.05]} /><meshStandardMaterial color="#ff6b20" emissive="#ff6b20" emissiveIntensity={2.5} /></mesh>
      {[-1, 1].map((s) => [0.45, 0.8].map((k) => (
        <mesh key={`${s}${k}`} position={[s * span * k, 4, -span / 2 + 2]}><boxGeometry args={[1, 8, 1]} /><meshStandardMaterial color="#141414" roughness={0.6} metalness={0.3} /></mesh>
      )))}

      {children}
      <ContactShadows position={[0, 0.01, 0]} opacity={0.6} scale={hall ? 40 : 12} blur={2.5} far={4} />
      <OrbitControls makeDefault enablePan={false} enableZoom={enableZoom} autoRotate={autoRotate} autoRotateSpeed={1.2}
        minDistance={hall ? 6 : 4} maxDistance={hall ? 24 : 14} maxPolarAngle={Math.PI / 2.05} target={[0, hall ? 0.8 : 0.7, 0]} />
    </>
  );
}
