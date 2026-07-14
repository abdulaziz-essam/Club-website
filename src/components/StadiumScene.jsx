import { useRef, useState, useCallback } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Environment } from '@react-three/drei';
import * as THREE from 'three';

function Pitch() {
  return (
    <group>
      {/* Base grass */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[42, 64, 1, 1]} />
        <meshStandardMaterial color="#1a5c2a" roughness={0.9} />
      </mesh>
      {/* Stripe pattern */}
      {Array.from({ length: 6 }, (_, i) => (
        <mesh key={i} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.005, -27 + i * 11]}>
          <planeGeometry args={[42, 11]} />
          <meshStandardMaterial
            color={i % 2 === 0 ? '#1a5c2a' : '#165022'}
            roughness={0.9}
          />
        </mesh>
      ))}
    </group>
  );
}

function FieldMarkings() {
  const lineMat = <lineBasicMaterial color="white" transparent opacity={0.75} />;

  const makeRectPoints = (w, h, z = 0) => {
    const hw = w / 2, hh = h / 2;
    return [
      [-hw, 0.05, -hh + z], [hw, 0.05, -hh + z],
      [hw, 0.05, hh + z], [-hw, 0.05, hh + z],
      [-hw, 0.05, -hh + z],
    ].map(p => new THREE.Vector3(...p));
  };

  const Line = ({ points }) => (
    <line>
      <bufferGeometry setFromPoints={points} />
      {lineMat}
    </line>
  );

  // Center circle
  const circlePoints = Array.from({ length: 65 }, (_, i) => {
    const a = (i / 64) * Math.PI * 2;
    return new THREE.Vector3(Math.cos(a) * 8.5, 0.05, Math.sin(a) * 8.5);
  });

  // Center line
  const centerLine = [new THREE.Vector3(-21, 0.05, 0), new THREE.Vector3(21, 0.05, 0)];

  return (
    <group>
      <Line points={makeRectPoints(42, 64)} />
      <Line points={makeRectPoints(24, 18, -23)} />
      <Line points={makeRectPoints(24, 18, 23)} />
      <Line points={makeRectPoints(12, 6, -29)} />
      <Line points={makeRectPoints(12, 6, 29)} />
      <line>
        <bufferGeometry setFromPoints={centerLine} />
        {lineMat}
      </line>
      <line>
        <bufferGeometry setFromPoints={circlePoints} />
        {lineMat}
      </line>
      {/* Center dot */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.06, 0]}>
        <circleGeometry args={[0.4, 16]} />
        <meshBasicMaterial color="white" />
      </mesh>
      {/* Penalty spots */}
      {[-24, 24].map(z => (
        <mesh key={z} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.06, z]}>
          <circleGeometry args={[0.3, 12]} />
          <meshBasicMaterial color="white" />
        </mesh>
      ))}
    </group>
  );
}

function Goal({ zDir }) {
  const mat = <meshStandardMaterial color="white" metalness={0.3} roughness={0.5} />;
  const z = zDir * 31;
  return (
    <group>
      {/* Posts */}
      {[-3.66, 3.66].map(x => (
        <mesh key={x} position={[x, 1.22, z]} castShadow>
          <cylinderGeometry args={[0.1, 0.1, 2.44, 8]} />
          {mat}
        </mesh>
      ))}
      {/* Crossbar */}
      <mesh position={[0, 2.44, z]} rotation={[0, 0, Math.PI / 2]} castShadow>
        <cylinderGeometry args={[0.08, 0.08, 7.32, 8]} />
        {mat}
      </mesh>
      {/* Back post */}
      <mesh position={[0, 1.22, z + zDir * 1.5]} castShadow>
        <cylinderGeometry args={[0.06, 0.06, 2.44, 8]} />
        {mat}
      </mesh>
    </group>
  );
}

function Stand({ position, rotation, width, depth }) {
  const tiers = 4;
  return (
    <group position={position} rotation={rotation}>
      {Array.from({ length: tiers }, (_, tier) => {
        const h = 2.8 + tier * 0.5;
        const d = depth + tier * 1.2;
        const y = tiers > 0 ? tier * 3.2 : 0;
        return (
          <group key={tier}>
            <mesh position={[0, y + h / 2, tier * 1.8]} castShadow receiveShadow>
              <boxGeometry args={[width, h, d]} />
              <meshStandardMaterial
                color={tier % 2 === 0 ? '#0d1f14' : '#112a1a'}
                roughness={0.8}
              />
            </mesh>
            {/* Seat rows */}
            {Array.from({ length: 5 }, (_, row) => {
              const seatColors = ['#1a3a8a', '#c9a84c', '#8a1a1a', '#1a3a8a', '#2d5c2d'];
              return (
                <mesh key={row} position={[0, y + h * 0.6 + row * 0.55, tier * 1.8 + row * 0.4]}>
                  <boxGeometry args={[width - 0.4, 0.08, 0.5]} />
                  <meshStandardMaterial
                    color={seatColors[row % seatColors.length]}
                    transparent opacity={0.75}
                    roughness={0.6}
                  />
                </mesh>
              );
            })}
          </group>
        );
      })}
    </group>
  );
}

function Stands() {
  return (
    <group>
      <Stand position={[0, 0, -37]} rotation={[-0.25, 0, 0]} width={48} depth={9} />
      <Stand position={[0, 0, 37]} rotation={[0.25, 0, 0]} width={48} depth={9} />
      <Stand position={[-26, 0, 0]} rotation={[0, 0.25, 0]} width={9} depth={70} />
      <Stand position={[26, 0, 0]} rotation={[0, -0.25, 0]} width={9} depth={70} />
    </group>
  );
}

function FloodlightTower({ x, z }) {
  const stemH = 24;
  return (
    <group position={[x, 0, z]}>
      {/* Stem */}
      <mesh position={[0, stemH / 2, 0]} castShadow>
        <cylinderGeometry args={[0.25, 0.45, stemH, 8]} />
        <meshStandardMaterial color="#5a5a45" metalness={0.6} roughness={0.4} />
      </mesh>
      {/* Light bank */}
      <mesh position={[0, stemH + 0.3, 0]}>
        <boxGeometry args={[4, 0.5, 2]} />
        <meshStandardMaterial
          color="#fffacc"
          emissive="#fffacc"
          emissiveIntensity={1.2}
        />
      </mesh>
      {/* Truss arm */}
      <mesh position={[0, stemH - 2, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.08, 0.08, 5, 6]} />
        <meshStandardMaterial color="#4a4a35" metalness={0.7} />
      </mesh>
    </group>
  );
}

function RoofTrusses() {
  const mat = <meshStandardMaterial color="#3a3a2a" metalness={0.7} roughness={0.3} />;
  const trusses = [];

  // North roof
  for (let i = -5; i <= 5; i++) {
    trusses.push(
      <group key={`n${i}`}>
        <mesh position={[i * 4.2, 14, -36.5]} rotation={[0, 0, 0]}>
          <cylinderGeometry args={[0.08, 0.08, 12, 6]} />
          {mat}
        </mesh>
        <mesh position={[i * 4.2, 20.5, -28]} rotation={[Math.PI / 5, 0, 0]}>
          <cylinderGeometry args={[0.06, 0.06, 9, 6]} />
          {mat}
        </mesh>
      </group>
    );
  }
  // South roof
  for (let i = -5; i <= 5; i++) {
    trusses.push(
      <group key={`s${i}`}>
        <mesh position={[i * 4.2, 14, 36.5]}>
          <cylinderGeometry args={[0.08, 0.08, 12, 6]} />
          {mat}
        </mesh>
        <mesh position={[i * 4.2, 20.5, 28]} rotation={[-Math.PI / 5, 0, 0]}>
          <cylinderGeometry args={[0.06, 0.06, 9, 6]} />
          {mat}
        </mesh>
      </group>
    );
  }
  return <group>{trusses}</group>;
}

function Scoreboard() {
  return (
    <group position={[0, 10, -37]}>
      <mesh castShadow>
        <boxGeometry args={[12, 5, 0.6]} />
        <meshStandardMaterial
          color="#0a120c"
          emissive="#c9a84c"
          emissiveIntensity={0.08}
          roughness={0.7}
        />
      </mesh>
      {/* LED strip */}
      <mesh position={[0, -2.6, 0.35]}>
        <boxGeometry args={[12, 0.15, 0.1]} />
        <meshStandardMaterial color="#c9a84c" emissive="#c9a84c" emissiveIntensity={2} />
      </mesh>
    </group>
  );
}

function Ball() {
  const ref = useRef();
  useFrame(({ clock }) => {
    if (ref.current) {
      ref.current.position.y = 0.6 + Math.abs(Math.sin(clock.elapsedTime * 0.8)) * 0.3;
      ref.current.rotation.x = clock.elapsedTime * 0.5;
      ref.current.rotation.z = clock.elapsedTime * 0.3;
    }
  });
  return (
    <mesh ref={ref} position={[0, 0.6, 0]} castShadow>
      <sphereGeometry args={[0.55, 24, 24]} />
      <meshStandardMaterial color="white" roughness={0.4} metalness={0.05} />
    </mesh>
  );
}

function Lights() {
  const goldRef = useRef();
  useFrame(({ clock }) => {
    if (goldRef.current) {
      goldRef.current.intensity = 1.2 + Math.sin(clock.elapsedTime * 0.7) * 0.3;
    }
  });

  return (
    <>
      <ambientLight intensity={0.4} color="#1a3a2a" />
      <pointLight ref={goldRef} position={[0, 12, 0]} color="#c9a84c" intensity={1.2} distance={50} />
      <spotLight position={[-24, 26, -26]} color="#fff8e0" intensity={4} angle={Math.PI / 5} penumbra={0.5} castShadow shadow-mapSize={[1024, 1024]} target-position={[0, 0, 0]} />
      <spotLight position={[24, 26, -26]} color="#fff8e0" intensity={4} angle={Math.PI / 5} penumbra={0.5} castShadow shadow-mapSize={[1024, 1024]} target-position={[0, 0, 0]} />
      <spotLight position={[-24, 26, 26]} color="#fff8e0" intensity={3} angle={Math.PI / 5} penumbra={0.5} castShadow target-position={[0, 0, 0]} />
      <spotLight position={[24, 26, 26]} color="#fff8e0" intensity={3} angle={Math.PI / 5} penumbra={0.5} castShadow target-position={[0, 0, 0]} />
    </>
  );
}

export default function StadiumScene() {
  return (
    <Canvas
      camera={{ position: [0, 22, 45], fov: 52 }}
      gl={{ antialias: true, alpha: false }}
      style={{ background: '#050a07' }}
      shadows
    >
      <fog attach="fog" args={['#050a07', 60, 130]} />
      <Lights />
      <Pitch />
      <FieldMarkings />
      <Goal zDir={1} />
      <Goal zDir={-1} />
      <Stands />
      <FloodlightTower x={-26} z={-36} />
      <FloodlightTower x={26} z={-36} />
      <FloodlightTower x={-26} z={36} />
      <FloodlightTower x={26} z={36} />
      <RoofTrusses />
      <Scoreboard />
      <Ball />
      <OrbitControls
        enablePan={false}
        minDistance={20}
        maxDistance={90}
        minPolarAngle={0.1}
        maxPolarAngle={Math.PI / 2.2}
        autoRotate
        autoRotateSpeed={0.6}
        makeDefault
      />
    </Canvas>
  );
}
