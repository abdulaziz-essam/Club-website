import { useState, useEffect } from 'react'

const CHANTS = [
  'ONE CITY · ONE CLUB',
  'WE BLEED RED & WHITE',
  'BORN TO FIGHT · BUILT TO WIN',
  'VORTEX TILL WE DIE',
]

const PHASES = [
  { id: 'title',  duration: 2000 },
  { id: 'chants', duration: 3500 },
  { id: 'shoot',  duration: 1800 },
  { id: 'done',   duration: 0    },
]

export default function IntroOverlay({ onDone }) {
  const [phaseIndex, setPhaseIndex] = useState(0)
  const [chantIndex, setChantIndex] = useState(0)
  const [visible, setVisible]       = useState(false)

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 80)
    return () => clearTimeout(t)
  }, [])

  useEffect(() => {
    const phase = PHASES[phaseIndex]
    if (phase.id === 'done') { onDone(); return }
    const t = setTimeout(() => setPhaseIndex(i => i + 1), phase.duration)
    return () => clearTimeout(t)
  }, [phaseIndex])

  useEffect(() => {
    if (PHASES[phaseIndex]?.id !== 'chants') return
    const t = setInterval(() => setChantIndex(i => (i + 1) % CHANTS.length), 820)
    return () => clearInterval(t)
  }, [phaseIndex])

  const phase = PHASES[phaseIndex]?.id

  return (
    <div
      className="absolute inset-0 z-20 flex flex-col items-center justify-center pointer-events-none select-none"
      style={{
        opacity: visible ? 1 : 0,
        transition: phase === 'done' ? 'opacity 0.8s ease' : 'opacity 0.6s ease',
        background: 'radial-gradient(ellipse at center, rgba(18,0,4,0.80) 0%, rgba(4,0,2,0.96) 100%)',
      }}
    >
      {/* Club badge line */}
      <div
        style={{
          fontFamily: "'Russo One', sans-serif",
          fontSize: 9,
          letterSpacing: '0.7em',
          color: 'rgba(206,17,38,0.55)',
          textTransform: 'uppercase',
          marginBottom: 24,
        }}
      >
        Vortex FC · Est. 1994
      </div>

      {/* Phase: title */}
      {phase === 'title' && (
        <div key="title" className="text-center" style={{ animation: 'introFadeUp 0.7s ease forwards' }}>
          <div
            className="text-white leading-none"
            style={{
              fontFamily: "'Russo One', sans-serif",
              fontSize: 'clamp(52px, 9vw, 110px)',
              letterSpacing: '-0.01em',
            }}
          >
            FEEL THE
          </div>
          <div
            style={{
              fontFamily: "'Russo One', sans-serif",
              fontSize: 'clamp(52px, 9vw, 110px)',
              letterSpacing: '-0.01em',
              WebkitTextStroke: '2px rgba(206,17,38,0.9)',
              WebkitTextFillColor: 'transparent',
              lineHeight: 1,
            }}
          >
            GAME
          </div>
        </div>
      )}

      {/* Phase: chants */}
      {phase === 'chants' && (
        <div key="chants" className="text-center px-8">
          <div
            key={chantIndex}
            className="text-white leading-tight"
            style={{
              fontFamily: "'Russo One', sans-serif",
              fontSize: 'clamp(28px, 5vw, 62px)',
              letterSpacing: '0.04em',
              animation: 'chantPop 0.35s cubic-bezier(0.34,1.5,0.64,1) forwards',
              textShadow: '0 0 40px rgba(206,17,38,0.55)',
            }}
          >
            {CHANTS[chantIndex]}
          </div>
          <div className="flex gap-2 justify-center mt-8">
            {CHANTS.map((_, i) => (
              <div
                key={i}
                className="w-1.5 h-1.5 rounded-full transition-all duration-300"
                style={{ background: i === chantIndex ? '#CE1126' : 'rgba(255,255,255,0.18)' }}
              />
            ))}
          </div>
        </div>
      )}

      {/* Phase: shoot */}
      {phase === 'shoot' && (
        <div key="shoot" className="text-center" style={{ animation: 'introFadeUp 0.4s ease forwards' }}>
          <div
            style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: 11,
              letterSpacing: '0.5em',
              textTransform: 'uppercase',
              color: 'rgba(255,255,255,0.35)',
              marginBottom: 16,
            }}
          >
            The moment arrives
          </div>
          <div
            className="text-white leading-none"
            style={{
              fontFamily: "'Russo One', sans-serif",
              fontSize: 'clamp(40px, 7vw, 88px)',
              letterSpacing: '0.02em',
              animation: 'shootPulse 0.6s ease infinite alternate',
            }}
          >
            SHOOT! 🔥
          </div>
        </div>
      )}
    </div>
  )
}
