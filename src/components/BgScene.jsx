import { useRef, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

function Particles() {
  const meshRef = useRef();
  const count = 700;

  const [positions, sizes] = (() => {
    const pos = new Float32Array(count * 3);
    const sz = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 200;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 200;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 80;
      sz[i] = Math.random() * 0.6 + 0.2;
    }
    return [pos, sz];
  })();

  useFrame(({ clock }) => {
    if (meshRef.current) {
      meshRef.current.material.opacity = 0.25 + Math.sin(clock.elapsedTime * 0.4) * 0.08;
      meshRef.current.rotation.y = clock.elapsedTime * 0.02;
    }
  });

  return (
    <points ref={meshRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-size" args={[sizes, 1]} />
      </bufferGeometry>
      <pointsMaterial color="#c9a84c" size={0.3} transparent opacity={0.25} sizeAttenuation />
    </points>
  );
}

function GridLines() {
  const verts = [];
  for (let i = -12; i <= 12; i++) {
    verts.push(i * 8, -50, -20, i * 8, 50, -20);
    verts.push(-96, i * 8, -20, 96, i * 8, -20);
  }
  const positions = new Float32Array(verts);
  return (
    <lineSegments>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <lineBasicMaterial color="#1a4a2e" transparent opacity={0.12} />
    </lineSegments>
  );
}

function CameraScroll() {
  const { camera } = useThree();
  useFrame(() => {
    const target = -window.scrollY * 0.015;
    camera.position.y += (target - camera.position.y) * 0.05;
  });
  return null;
}

export default function BgScene() {
  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none',
    }}>
      <Canvas
        camera={{ position: [0, 0, 50], fov: 60 }}
        gl={{ alpha: true, antialias: true }}
        style={{ width: '100%', height: '100%' }}
      >
        <Particles />
        <GridLines />
        <CameraScroll />
      </Canvas>
    </div>
  );
}
