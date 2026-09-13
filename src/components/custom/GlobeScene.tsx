import { Canvas, useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import type { Group } from "three";
function Globe() {
  const ref = useRef<Group>(null);
  const points = useMemo(() => {
    const data = new Float32Array(360 * 3);
    for (let i = 0; i < 360; i++) {
      const phi = Math.acos(1 - (2 * (i + 0.5)) / 360);
      const theta = Math.PI * (1 + Math.sqrt(5)) * i;
      data.set(
        [
          1.65 * Math.sin(phi) * Math.cos(theta),
          1.65 * Math.cos(phi),
          1.65 * Math.sin(phi) * Math.sin(theta),
        ],
        i * 3,
      );
    }
    return data;
  }, []);
  useFrame((state, delta) => {
    if (ref.current) {
      ref.current.rotation.y += delta * 0.08;
      ref.current.rotation.x = state.pointer.y * 0.12;
    }
  });
  return (
    <group ref={ref}>
      <mesh>
        <sphereGeometry args={[1.6, 24, 16]} />
        <meshBasicMaterial
          color="#a9c889"
          wireframe
          transparent
          opacity={0.07}
        />
      </mesh>
      <points>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[points, 3]} />
        </bufferGeometry>
        <pointsMaterial
          size={0.028}
          color="#c1de9a"
          transparent
          opacity={0.7}
        />
      </points>
    </group>
  );
}
export default function GlobeScene() {
  return (
    <Canvas
      camera={{ position: [0, 0, 4.5], fov: 48 }}
      dpr={[1, 1.3]}
      gl={{ antialias: false, alpha: true }}
    >
      <Globe />
    </Canvas>
  );
}
