import { useRef, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import * as THREE from 'three'

// Animated football with hexagonal pattern
function Football({ scrollOffset }) {
  const meshRef = useRef()
  const groupRef = useRef()

  useFrame((state) => {
    const t = state.clock.getElapsedTime()
    if (meshRef.current) {
      meshRef.current.rotation.x += 0.003
      meshRef.current.rotation.y += 0.005
    }
    if (groupRef.current) {
      groupRef.current.position.y = Math.sin(t * 0.6) * 0.15
      groupRef.current.rotation.y = t * 0.1
      // Move based on scroll
      groupRef.current.position.x = scrollOffset * -3
      groupRef.current.position.z = scrollOffset * -1
    }
  })

  return (
    <group ref={groupRef} position={[2.5, 0, 0]}>
      {/* Main ball */}
      <mesh ref={meshRef} castShadow>
        <sphereGeometry args={[1.2, 64, 64]} />
        <meshStandardMaterial
          color="#f4f0e8"
          roughness={0.35}
          metalness={0.05}
        />
      </mesh>

      {/* Pentagon patches - dark */}
      {Array.from({ length: 12 }).map((_, i) => {
        const phi = Math.acos(-1 + (2 * i) / 11)
        const theta = Math.sqrt(12 * Math.PI) * phi
        const x = Math.sin(phi) * Math.cos(theta) * 1.22
        const y = Math.cos(phi) * 1.22
        const z = Math.sin(phi) * Math.sin(theta) * 1.22

        return (
          <mesh key={i} position={[x, y, z]}>
            <circleGeometry args={[0.22, 5]} />
            <meshStandardMaterial color="#050a07" roughness={0.5} />
          </mesh>
        )
      })}

      {/* Gold trim ring */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[1.24, 0.02, 8, 64]} />
        <meshStandardMaterial color="#c9a84c" metalness={0.9} roughness={0.1} emissive="#c9a84c" emissiveIntensity={0.3} />
      </mesh>
    </group>
  )
}

// Floating particles
function Particles() {
  const count = 80
  const mesh = useRef()

  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 20
      pos[i * 3 + 1] = (Math.random() - 0.5) * 10
      pos[i * 3 + 2] = (Math.random() - 0.5) * 8 - 2
    }
    return pos
  }, [])

  useFrame((state) => {
    if (mesh.current) {
      mesh.current.rotation.y = state.clock.getElapsedTime() * 0.02
    }
  })

  return (
    <points ref={mesh}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.025}
        color="#c9a84c"
        transparent
        opacity={0.6}
        sizeAttenuation
      />
    </points>
  )
}

// Pitch lines on the floor
function PitchLines() {
  const lines = useMemo(() => {
    const geometry = new THREE.BufferGeometry()
    const vertices = []

    // Center circle
    for (let i = 0; i <= 64; i++) {
      const angle = (i / 64) * Math.PI * 2
      vertices.push(Math.cos(angle) * 2, -1.8, Math.sin(angle) * 2)
    }
    // Half-line
    vertices.push(-8, -1.8, 0, 8, -1.8, 0)

    geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3))
    return geometry
  }, [])

  return (
    <line>
      <primitive object={lines} />
      <lineBasicMaterial color="#1e5c32" transparent opacity={0.5} />
    </line>
  )
}

export default function FootballScene({ scrollProgress = 0 }) {
  return (
    <Canvas
      camera={{ position: [0, 0, 6], fov: 55 }}
      style={{ background: 'transparent' }}
      gl={{ alpha: true, antialias: true }}
    >
      <ambientLight intensity={0.4} />
      <directionalLight
        position={[5, 8, 5]}
        intensity={1.2}
        color="#ffffff"
        castShadow
      />
      <pointLight position={[-3, 2, 3]} intensity={0.8} color="#c9a84c" />
      <pointLight position={[3, -2, -3]} intensity={0.4} color="#1e5c32" />

      <Particles />
      <PitchLines />

      <Football scrollOffset={scrollProgress} />
    </Canvas>
  )
}
