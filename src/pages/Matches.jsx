import { useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { Link } from 'react-router-dom'

const MATCHES = [
  { home: 'Atletico FC', away: 'Real Madrid', scoreH: 3, scoreA: 1, date: 'Jul 12, 2026', comp: 'La Liga', status: 'win' },
  { home: 'Barcelona', away: 'Atletico FC', scoreH: 0, scoreA: 2, date: 'Jul 5, 2026', comp: 'La Liga', status: 'win' },
  { home: 'Atletico FC', away: 'Man City', scoreH: 1, scoreA: 1, date: 'Jun 28, 2026', comp: 'Champions League', status: 'draw' },
  { home: 'Atletico FC', away: 'Sevilla', scoreH: 4, scoreA: 0, date: 'Jun 21, 2026', comp: 'La Liga', status: 'win' },
  { home: 'Valencia', away: 'Atletico FC', scoreH: 2, scoreA: 3, date: 'Jun 14, 2026', comp: 'La Liga', status: 'win' },
  { home: 'Atletico FC', away: 'PSG', scoreH: 0, scoreA: 1, date: 'Jun 7, 2026', comp: 'Champions League', status: 'loss' },
  { home: 'Atletico FC', away: 'Bilbao', scoreH: 2, scoreA: 0, date: 'May 31, 2026', comp: 'La Liga', status: 'win' },
]

const UPCOMING = [
  { home: 'Atletico FC', away: 'Inter Milan', date: 'Jul 19, 2026', comp: 'Champions League', status: 'upcoming', time: '20:45' },
  { home: 'Celta Vigo', away: 'Atletico FC', date: 'Jul 26, 2026', comp: 'La Liga', status: 'upcoming', time: '18:00' },
  { home: 'Atletico FC', away: 'Liverpool', date: 'Aug 2, 2026', comp: 'Champions League', status: 'upcoming', time: '21:00' },
]

function MatchBallBg() {
  const group = useRef()

  useFrame((state) => {
    if (group.current) {
      group.current.rotation.y = state.clock.getElapsedTime() * 0.1
      group.current.rotation.x = Math.sin(state.clock.getElapsedTime() * 0.05) * 0.2
    }
  })

  return (
    <group ref={group}>
      {/* Wireframe torus */}
      <mesh>
        <torusGeometry args={[3, 0.02, 8, 64]} />
        <meshBasicMaterial color="#c9a84c" transparent opacity={0.15} />
      </mesh>
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[3, 0.02, 8, 64]} />
        <meshBasicMaterial color="#c9a84c" transparent opacity={0.1} />
      </mesh>
      <mesh rotation={[0, Math.PI / 3, 0]}>
        <torusGeometry args={[3, 0.02, 8, 64]} />
        <meshBasicMaterial color="#1e5c32" transparent opacity={0.08} />
      </mesh>
      {/* Center sphere */}
      <mesh>
        <sphereGeometry args={[0.3, 32, 32]} />
        <meshStandardMaterial color="#c9a84c" emissive="#c9a84c" emissiveIntensity={0.5} />
      </mesh>
    </group>
  )
}

function MatchesBg() {
  return (
    <Canvas
      camera={{ position: [0, 0, 8], fov: 55 }}
      style={{ background: 'transparent' }}
      gl={{ alpha: true, antialias: true }}
    >
      <ambientLight intensity={0.4} />
      <pointLight position={[5, 3, 3]} intensity={0.6} color="#c9a84c" />
      <MatchBallBg />
    </Canvas>
  )
}

function MatchRow({ match }) {
  const isAtletico = (team) => team === 'Atletico FC'
  const isHome = isAtletico(match.home)

  return (
    <div className="match-item">
      <div className="match-team home">
        <div className="match-team-name" style={{
          color: isHome ? 'var(--gold)' : 'var(--white)',
        }}>{match.home}</div>
        <div className="match-team-league">{match.comp}</div>
      </div>

      <div className="match-center">
        {match.status !== 'upcoming' ? (
          <>
            <div className={`match-status ${match.status}`}>
              {match.status === 'win' ? 'Win' : match.status === 'draw' ? 'Draw' : 'Loss'}
            </div>
            <div className="match-score">{match.scoreH} — {match.scoreA}</div>
            <div className="match-date">{match.date}</div>
          </>
        ) : (
          <>
            <div className="match-status upcoming">Upcoming</div>
            <div className="match-score" style={{ fontSize: 36, color: 'var(--gray-light)' }}>
              {match.time}
            </div>
            <div className="match-date">{match.date}</div>
          </>
        )}
      </div>

      <div className="match-team">
        <div className="match-team-name" style={{
          color: !isHome ? 'var(--gold)' : 'var(--white)',
        }}>{match.away}</div>
        <div className="match-team-league">{match.comp}</div>
      </div>
    </div>
  )
}

export default function Matches() {
  const wins = MATCHES.filter(m => m.status === 'win').length
  const draws = MATCHES.filter(m => m.status === 'draw').length
  const losses = MATCHES.filter(m => m.status === 'loss').length
  const goals = MATCHES.reduce((acc, m) => {
    return acc + (m.home === 'Atletico FC' ? m.scoreH : m.scoreA)
  }, 0)

  return (
    <div className="page">
      <div className="canvas-wrapper" style={{ opacity: 0.5 }}>
        <MatchesBg />
      </div>

      <div style={{ position: 'relative', zIndex: 2, background: 'var(--black)' }}>
        <div className="page-header">
          <div className="label" style={{ marginBottom: 16 }}>Season 2025/26</div>
          <h1>
            Fixtures
            <em>& Results</em>
          </h1>
        </div>

        {/* Season Stats */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4,1fr)',
          gap: 2,
          padding: '0 64px 80px',
        }}>
          {[
            { label: 'Wins', val: wins, color: '#4a9' },
            { label: 'Draws', val: draws, color: 'var(--gold)' },
            { label: 'Losses', val: losses, color: '#c55' },
            { label: 'Goals Scored', val: goals, color: 'var(--white)' },
          ].map((s, i) => (
            <div key={i} style={{
              background: 'var(--green)',
              padding: '32px 28px',
              borderTop: `2px solid ${s.color}`,
            }}>
              <div style={{
                fontFamily: "'Bebas Neue', sans-serif",
                fontSize: 56,
                color: s.color,
                lineHeight: 1,
              }}>{s.val}</div>
              <div style={{
                fontFamily: "'Barlow Condensed', sans-serif",
                fontSize: 10,
                letterSpacing: '0.35em',
                textTransform: 'uppercase',
                color: 'var(--gray)',
                marginTop: 8,
              }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Upcoming */}
        <div style={{ padding: '0 64px', marginBottom: 80 }}>
          <div className="label" style={{ marginBottom: 40 }}>Next Matches</div>
          <div className="matches-list" style={{ padding: 0 }}>
            {UPCOMING.map((m, i) => <MatchRow key={i} match={m} />)}
          </div>
        </div>

        {/* Results */}
        <div style={{ padding: '0 64px', marginBottom: 120 }}>
          <div className="label" style={{ marginBottom: 40 }}>Recent Results</div>
          <div className="matches-list" style={{ padding: 0 }}>
            {MATCHES.map((m, i) => <MatchRow key={i} match={m} />)}
          </div>
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
                <li><Link to="/">Home</Link></li>
                <li><Link to="/squad">Squad</Link></li>
                <li><Link to="/matches">Matches</Link></li>
                <li><Link to="/stadium">Stadium</Link></li>
              </ul>
            </div>
            <div className="footer-col">
              <h4>Season 2025/26</h4>
              <ul>
                <li><a href="#">League Table</a></li>
                <li><a href="#">Statistics</a></li>
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
