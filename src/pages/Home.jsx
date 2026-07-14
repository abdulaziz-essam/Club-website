import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import FootballScene from '../components/FootballScene'

const STATS = [
  { num: '127', label: 'Years of History' },
  { num: '43', label: 'League Titles' },
  { num: '18', label: 'Champions Cups' },
  { num: '87K', label: 'Stadium Capacity' },
]

const NEWS = [
  {
    tag: 'Match Report',
    title: 'Atletico Crushes Rivals 4-0 In Stunning Derby',
    date: 'Jul 12, 2026',
  },
  {
    tag: 'Transfer',
    title: 'Club Signs World-Class Striker for Record Fee',
    date: 'Jul 10, 2026',
  },
  {
    tag: 'Training',
    title: 'Pre-Season Camp Underway In The Swiss Alps',
    date: 'Jul 8, 2026',
  },
]

export default function Home() {
  const [scrollY, setScrollY] = useState(0)
  const heroRef = useRef(null)

  useEffect(() => {
    const onScroll = () => setScrollY(window.scrollY)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const scrollProgress = Math.min(scrollY / (window.innerHeight || 800), 1)

  return (
    <div className="page">
      {/* Fixed 3D scene */}
      <div className="canvas-wrapper" style={{ zIndex: 1 }}>
        <FootballScene scrollProgress={scrollProgress} />
      </div>

      {/* Dark gradient overlay fading in at bottom */}
      <div style={{
        position: 'fixed',
        inset: 0,
        background: `linear-gradient(to bottom,
          rgba(4,9,8,0) 0%,
          rgba(4,9,8,0.3) 50%,
          rgba(4,9,8,0.85) 80%,
          rgba(4,9,8,1) 100%)`,
        zIndex: 1,
        pointerEvents: 'none',
      }} />

      {/* Hero */}
      <section className="hero-section" ref={heroRef} style={{ position: 'relative', zIndex: 2 }}>
        <div className="hero-content">
          <div className="hero-eyebrow initial-hidden anim-fade-up">
            Champions League · Season 2025/26
          </div>
          <h1 className="hero-title initial-hidden anim-fade-up anim-fade-up-delay-1">
            WE ARE
            <span>ATLETICO</span>
          </h1>
          <p className="hero-desc initial-hidden anim-fade-up anim-fade-up-delay-2">
            Forged in passion, defined by glory. A century of football excellence,
            written in gold and green.
          </p>
          <div className="hero-actions initial-hidden anim-fade-up anim-fade-up-delay-3">
            <Link to="/matches">
              <button className="btn-primary">
                <span>View Fixtures</span>
              </button>
            </Link>
            <Link to="/squad">
              <button className="btn-ghost">
                <span className="btn-ghost-arrow">→</span>
                Meet the Squad
              </button>
            </Link>
          </div>
        </div>

        <div className="scroll-indicator">
          <div className="scroll-line" />
          <span>Scroll</span>
        </div>

        {/* Decorative corner text */}
        <div style={{
          position: 'absolute',
          top: 120,
          right: 64,
          zIndex: 3,
          textAlign: 'right',
        }}>
          <div style={{
            fontFamily: "'Barlow Condensed', sans-serif",
            fontSize: 10,
            letterSpacing: '0.5em',
            textTransform: 'uppercase',
            color: 'var(--gold)',
            opacity: 0.6,
            marginBottom: 8,
          }}>Interact with the 3D scene</div>
          <div style={{
            fontFamily: "'Bebas Neue', sans-serif",
            fontSize: 64,
            lineHeight: 1,
            color: 'rgba(201,168,76,0.06)',
            letterSpacing: '0.05em',
          }}>ATLETICO</div>
        </div>

        {/* Stats bar */}
        <div className="hero-stats initial-hidden anim-fade-up anim-fade-up-delay-5">
          {STATS.map((s, i) => (
            <div key={i} className="hero-stat">
              <div className="stat-num">{s.num}</div>
              <div className="stat-label">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Content sections that scroll over the 3D scene */}
      <div style={{ position: 'relative', zIndex: 3, background: 'var(--black)' }}>
        {/* Marquee */}
        <div className="marquee-section">
          <div className="marquee-track">
            {Array.from({ length: 2 }).flatMap(() => [
              'Champions League', 'La Liga Champions', 'Copa Del Rey',
              'Supercopa de España', 'UEFA Super Cup', 'Premier League Cup',
              'World Cup Qualifiers', 'Season 2025/26',
            ]).map((item, i) => (
              <div key={i} className="marquee-item">{item}</div>
            ))}
          </div>
        </div>

        {/* About strip */}
        <div className="about-strip">
          <div className="about-big-num">127</div>
          <div className="about-strip-text">
            <div className="label" style={{ marginBottom: 16 }}>Our Story</div>
            <h2>A Legacy Written in<br />Gold and Glory</h2>
            <p style={{ marginTop: 16 }}>
              Founded in 1902, Atletico FC has been at the forefront of world football
              for over a century. Twelve consecutive league titles, three Champions League
              trophies, and a stadium that roars with the passion of 87,000 faithful supporters.
            </p>
          </div>
        </div>

        {/* Latest News */}
        <div style={{ padding: '120px 64px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 64 }}>
            <div>
              <div className="label" style={{ marginBottom: 12 }}>Latest</div>
              <h2 style={{
                fontFamily: "'Bebas Neue', sans-serif",
                fontSize: 'clamp(40px, 5vw, 64px)',
                lineHeight: 1,
                letterSpacing: '0.02em',
              }}>Club News</h2>
            </div>
            <Link to="/matches" style={{
              fontFamily: "'Barlow Condensed', sans-serif",
              fontSize: 12,
              letterSpacing: '0.25em',
              textTransform: 'uppercase',
              color: 'var(--gold)',
              borderBottom: '1px solid var(--gold-border)',
              paddingBottom: 4,
            }}>
              All News →
            </Link>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 2 }}>
            {NEWS.map((n, i) => (
              <div key={i} style={{
                background: 'var(--green)',
                padding: 40,
                borderBottom: '2px solid transparent',
                transition: 'border-color 0.3s, background 0.3s',
                cursor: 'none',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.borderColor = 'var(--gold)'
                e.currentTarget.style.background = 'var(--green-mid)'
              }}
              onMouseLeave={e => {
                e.currentTarget.style.borderColor = 'transparent'
                e.currentTarget.style.background = 'var(--green)'
              }}>
                <div style={{
                  fontFamily: "'Barlow Condensed', sans-serif",
                  fontSize: 10,
                  letterSpacing: '0.35em',
                  textTransform: 'uppercase',
                  color: 'var(--gold)',
                  marginBottom: 16,
                }}>{n.tag}</div>
                <h3 style={{
                  fontFamily: "'Bebas Neue', sans-serif",
                  fontSize: 26,
                  letterSpacing: '0.03em',
                  lineHeight: 1.1,
                  marginBottom: 24,
                }}>{n.title}</h3>
                <div style={{
                  fontSize: 12,
                  color: 'var(--gray)',
                  letterSpacing: '0.1em',
                }}>{n.date}</div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Banner */}
        <div style={{
          background: 'linear-gradient(135deg, var(--green) 0%, var(--green-mid) 100%)',
          borderTop: '1px solid var(--border)',
          borderBottom: '1px solid var(--border)',
          padding: '80px 64px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 40,
        }}>
          <div>
            <div className="label" style={{ marginBottom: 12 }}>Season 2025/26</div>
            <h2 style={{
              fontFamily: "'Bebas Neue', sans-serif",
              fontSize: 'clamp(40px, 6vw, 72px)',
              lineHeight: 1,
              letterSpacing: '0.02em',
            }}>Get Your Season Ticket</h2>
          </div>
          <div style={{ display: 'flex', gap: 16 }}>
            <Link to="/stadium">
              <button className="btn-primary" style={{ whiteSpace: 'nowrap' }}>
                <span>Explore Stadium</span>
              </button>
            </Link>
            <Link to="/squad">
              <button style={{
                fontFamily: "'Barlow Condensed', sans-serif",
                fontSize: 12,
                letterSpacing: '0.25em',
                textTransform: 'uppercase',
                padding: '16px 32px',
                border: '1px solid var(--gold-border)',
                color: 'var(--gold)',
                background: 'transparent',
                cursor: 'none',
                whiteSpace: 'nowrap',
              }}>
                Meet the Players
              </button>
            </Link>
          </div>
        </div>

        {/* Footer */}
        <footer>
          <div className="footer">
            <div className="footer-brand">
              <div className="nav-logo">
                <div className="nav-logo-badge" style={{ width: 44, height: 44 }}>FC</div>
                <div>
                  <div className="nav-logo-text">ATLETICO</div>
                  <div className="nav-logo-sub">Football Club · Est. 1902</div>
                </div>
              </div>
              <p>
                More than a club. A century of passion, history, and football excellence
                written in the hearts of millions.
              </p>
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
              <h4>Club</h4>
              <ul>
                <li><a href="#">History</a></li>
                <li><a href="#">Foundation</a></li>
                <li><a href="#">Youth Academy</a></li>
                <li><a href="#">Partnerships</a></li>
              </ul>
            </div>
          </div>
          <div className="footer-bottom">
            <p>© 2026 Atletico FC · All rights reserved</p>
            <p>Passion · Honor · Glory</p>
          </div>
        </footer>
      </div>
    </div>
  )
}
