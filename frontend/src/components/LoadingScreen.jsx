import { useProgress } from '@react-three/drei';

export default function LoadingScreen() {
  const { active, progress } = useProgress();
  if (!active) return null;
  return (
    <div className="loading" role="status" aria-live="polite">
      <div className="loading-bar"><span style={{ width: `${progress}%` }} /></div>
      <p>Loading 3D model… {Math.round(progress)}%</p>
    </div>
  );
}
