import { useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import * as THREE from 'three'

const PLAYERS = [
  // Goalkeepers
  { name: 'Marco Delgado', pos: 'GK', num: 1, nat: 'Spain', apps: 38, goals: 0, assists: 0 },
  { name: 'Samir Turk', pos: 'GK', num: 13, nat: 'Algeria', apps: 2, goals: 0, assists: 0 },
  // Defenders
  { name: 'Carlos Mendez', pos: 'CB', num: 4, nat: 'Argentina', apps: 35, goals: 3, assists: 1 },
  { name: 'Luca Bianchi', pos: 'CB', num: 5, nat: 'Italy', apps: 33, goals: 2, assists: 0 },
  { name: 'Ryota Yamamoto', pos: 'RB', num: 2, nat: 'Japan', apps: 36, goals: 1, assists: 8 },
  { name: 'Diego Pires', pos: 'LB', num: 3, nat: 'Brazil', apps: 34, goals: 0, assists: 6 },
  // Midfielders
  { name: 'Kevin De Vos', pos: 'CM', num: 6, nat: 'Belgium', apps: 38, goals: 7, assists: 12 },
  { name: 'Aleksei Petrov', pos: 'DM', num: 8, nat: 'Russia', apps: 30, goals: 2, assists: 4 },
  { name: 'Nabil Mansouri', pos: 'AM', num: 10, nat: 'Morocco', apps: 37, goals: 14, assists: 9 },
  { name: 'Javier Castillo', pos: 'CM', num: 14, nat: 'Mexico', apps: 28, goals: 5, assists: 7 },
  // Forwards
  { name: 'Thierry Mbeki', pos: 'ST', num: 9, nat: 'Ivory Coast', apps: 38, goals: 31, assists: 4 },
  { name: 'Paulo Ferreira', pos: 'RW', num: 7, nat: 'Portugal', apps: 35, goals: 18, assists: 11 },
  { name: 'Erik Lindqvist', pos: 'LW', num: 11, nat: 'Sweden', apps: 32, goals: 9, assists: 15 },
  { name: 'Omar Al-Rashid', pos: 'ST', num: 19, nat: 'Saudi Arabia', apps: 20, goals: 12, assists: 3 },
]

const POS_COLORS = {
  GK: '#c9a84c',
  CB: '#4a9', RB: '#4a9', LB: '#4a9',
  CM: '#5b8fcc', DM: '#5b8fcc', AM: '#5b8fcc',
  ST: '#c55', RW: '#c55', LW: '#c55',
}

function BgOrb() {
  const meshRef = useRef()

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = state.clock.getElapsedTime() * 0.1
      meshRef.current.rotation.y = state.clock.getElapsedTime() * 0.15
    }
  })

  return (
    <mesh ref={meshRef} position={[0, 0, -4]} scale={6}>
      <icosahedronGeometry args={[1, 2]} />
      <meshStandardMaterial
        color="#1a3a20"
        wireframe
        transparent
        opacity={0.15}
      />
    </mesh>
  )
}

function SquadBg() {
  return (
    <Canvas
      camera={{ position: [0, 0, 8], fov: 60 }}
      style={{ background: 'transparent' }}
      gl={{ alpha: true, antialias: true }}
    >
      <ambientLight intensity={0.5} />
      <pointLight position={[4, 4, 4]} intensity={0.8} color="#c9a84c" />
      <BgOrb />
    </Canvas>
  )
}

function PlayerCard({ player }) {
  const posColor = POS_COLORS[player.pos] || 'var(--gold)'

  return (
    <div className="player-card" style={{ cursor: 'none' }}>
      <div className="player-card-bg" style={{
        background: `radial-gradient(ellipse at 50% 20%, ${posColor}22 0%, var(--green) 55%, var(--black) 100%)`,
      }} />

      {/* Decorative number */}
      <div className="player-number">{player.num}</div>

      {/* Silhouette art (CSS shape) */}
      <div style={{
        position: 'absolute',
        top: '15%',
        left: '50%',
        transform: 'translateX(-50%)',
        width: 80,
        height: 140,
        opacity: 0.12,
        background: `linear-gradient(to bottom, ${posColor} 0%, transparent 100%)`,
        clipPath: 'polygon(35% 0%, 65% 0%, 70% 15%, 80% 15%, 85% 30%, 75% 55%, 70% 55%, 75% 70%, 80% 100%, 55% 100%, 55% 70%, 50% 60%, 45% 70%, 45% 100%, 20% 100%, 25% 70%, 30% 55%, 25% 55%, 15% 30%, 20% 15%, 30% 15%)',
        transition: 'opacity 0.4s',
      }} />

      <div className="player-card-inner">
        <div className="player-pos" style={{ color: posColor }}>{player.pos}</div>
        <div className="player-name">{player.name}</div>
        <div className="player-nat">{player.nat}</div>
        <div className="player-stats-row">
          <div className="player-mini-stat">
            <span>{player.apps}</span>
            <span>Apps</span>
          </div>
          <div className="player-mini-stat">
            <span>{player.goals}</span>
            <span>Goals</span>
          </div>
          <div className="player-mini-stat">
            <span>{player.assists}</span>
            <span>Assists</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function Squad() {
  return (
    <div className="page">
      {/* Subtle 3D bg */}
      <div className="canvas-wrapper" style={{ opacity: 0.6, zIndex: 0 }}>
        <SquadBg />
      </div>

      {/* Content */}
      <div style={{ position: 'relative', zIndex: 2, background: 'var(--black)' }}>
        <div style={{
          background: 'linear-gradient(to bottom, transparent, var(--black) 40%)',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: 400,
          pointerEvents: 'none',
          zIndex: -1,
        }} />

        <div className="page-header">
          <div className="label" style={{ marginBottom: 16 }}>2025/26 Season</div>
          <h1>
            The
            <em>Squad</em>
          </h1>
          <p style={{
            marginTop: 24,
            fontFamily: "'Barlow Condensed', sans-serif",
            fontSize: 15,
            color: 'var(--gray-light)',
            maxWidth: 500,
            lineHeight: 1.7,
          }}>
            Fourteen warriors. One mission. These are the men who carry the gold and green
            into every battle.
          </p>
        </div>

        {/* Position filter tabs */}
        <div style={{ padding: '0 64px 48px', display: 'flex', gap: 4 }}>
          {['All', 'GK', 'Defenders', 'Midfielders', 'Forwards'].map((f, i) => (
            <div key={f} style={{
              fontFamily: "'Barlow Condensed', sans-serif",
              fontSize: 11,
              letterSpacing: '0.3em',
              textTransform: 'uppercase',
              padding: '8px 20px',
              border: '1px solid var(--border)',
              color: i === 0 ? 'var(--black)' : 'var(--gray-light)',
              background: i === 0 ? 'var(--gold)' : 'transparent',
              cursor: 'none',
              transition: 'all 0.2s',
            }}>
              {f}
            </div>
          ))}
        </div>

        <div className="squad-grid">
          {PLAYERS.map((p, i) => (
            <PlayerCard key={i} player={p} />
          ))}
        </div>

        <footer>
          <div className="footer">
            <div className="footer-brand">
              <div className="nav-logo">
                <div className="nav-logo-badge">FC</div>
                <div>
                  <div className="nav-logo-text">ATLETICO</div>
                  <div className="nav-logo-sub">Football Club · Est. 1902</div>
                </div>
              </div>
            </div>
            <div className="footer-col">
              <h4>Navigate</h4>
              <ul>
                <li><a href="/">Home</a></li>
                <li><a href="/squad">Squad</a></li>
                <li><a href="/matches">Matches</a></li>
                <li><a href="/stadium">Stadium</a></li>
              </ul>
            </div>
            <div className="footer-col">
              <h4>Season 2025/26</h4>
              <ul>
                <li><a href="/matches">Fixtures & Results</a></li>
                <li><a href="#">League Table</a></li>
                <li><a href="#">Top Scorers</a></li>
              </ul>
            </div>
          </div>
          <div className="footer-bottom">
            <p>© 2026 Atletico FC</p>
            <p>Passion · Honor · Glory</p>
          </div>
        </footer>
      </div>
    </div>
  )
}
