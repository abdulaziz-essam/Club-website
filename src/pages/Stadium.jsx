import { Link } from 'react-router-dom'
import StadiumScene from '../components/StadiumScene'

const SPECS = [
  { key: 'Capacity', val: '87,000' },
  { key: 'Year Built', val: '1966' },
  { key: 'Last Renovated', val: '2019' },
  { key: 'Playing Surface', val: 'Hybrid Grass' },
  { key: 'Dimensions', val: '105 × 68m' },
  { key: 'Stands', val: '4 Tier' },
]

const ZONES = [
  { name: 'Nord Stand', desc: 'The heart of Atletico supporters — the loudest end of the ground.', price: '€45' },
  { name: 'Main Stand', desc: 'Premium seating with the best view of the action and VIP facilities.', price: '€120' },
  { name: 'East Wing', desc: 'Family-friendly zone with dedicated facilities for younger fans.', price: '€65' },
  { name: 'West Terrace', desc: 'Classic standing area with an electric atmosphere on match days.', price: '€35' },
]

export default function Stadium() {
  return (
    <div className="page">
      {/* Full-screen 3D Stadium */}
      <div style={{
        height: '100vh',
        position: 'relative',
        overflow: 'hidden',
      }}>
        <div style={{
          position: 'absolute',
          inset: 0,
          zIndex: 0,
        }}>
          <StadiumScene />
        </div>

        {/* Overlay gradient */}
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(to bottom, rgba(4,9,8,0.6) 0%, rgba(4,9,8,0) 40%, rgba(4,9,8,0) 60%, rgba(4,9,8,1) 100%)',
          zIndex: 1,
          pointerEvents: 'none',
        }} />

        {/* Hero label - top left */}
        <div style={{
          position: 'absolute',
          top: 120,
          left: 64,
          zIndex: 2,
        }}>
          <div className="label" style={{ marginBottom: 12 }}>Interactive 3D</div>
          <div style={{
            fontFamily: "'Bebas Neue', sans-serif",
            fontSize: 'clamp(48px, 8vw, 100px)',
            lineHeight: 0.9,
            letterSpacing: '0.02em',
          }}>
            ESTADIO
            <span style={{
              display: 'block',
              background: 'linear-gradient(90deg, var(--gold-light), var(--gold))',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}>ATLETICO</span>
          </div>
        </div>

        {/* Interaction hint */}
        <div style={{
          position: 'absolute',
          bottom: 140,
          right: 64,
          zIndex: 2,
          textAlign: 'right',
        }}>
          <div style={{
            fontFamily: "'Barlow Condensed', sans-serif",
            fontSize: 11,
            letterSpacing: '0.35em',
            textTransform: 'uppercase',
            color: 'var(--gold)',
            opacity: 0.7,
            marginBottom: 8,
          }}>Drag to explore</div>
          <div style={{
            width: 48,
            height: 48,
            border: '1px solid var(--gold-border)',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginLeft: 'auto',
            fontSize: 20,
            color: 'var(--gold)',
            opacity: 0.6,
          }}>↻</div>
        </div>

        {/* Scroll down */}
        <div style={{
          position: 'absolute',
          bottom: 40,
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 2,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 8,
        }}>
          <div style={{
            fontFamily: "'Barlow Condensed', sans-serif",
            fontSize: 10,
            letterSpacing: '0.4em',
            textTransform: 'uppercase',
            color: 'var(--gray)',
          }}>Scroll for details</div>
          <div style={{
            width: 1,
            height: 40,
            background: 'linear-gradient(to bottom, var(--gold), transparent)',
            animation: 'scrollPulse 2s ease infinite',
          }} />
        </div>
      </div>

      {/* Stadium info content */}
      <div style={{ position: 'relative', zIndex: 2, background: 'var(--black)' }}>
        {/* Stats bar */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3,1fr)',
          borderTop: '1px solid var(--border)',
          borderBottom: '1px solid var(--border)',
        }}>
          {[
            { num: '87K', label: 'Capacity' },
            { num: '1966', label: 'Year Established' },
            { num: '60+', label: 'Years of Home Matches' },
          ].map((s, i) => (
            <div key={i} style={{
              padding: '40px 64px',
              borderRight: i < 2 ? '1px solid var(--border)' : 'none',
            }}>
              <div style={{
                fontFamily: "'Bebas Neue', sans-serif",
                fontSize: 56,
                color: 'var(--gold)',
                lineHeight: 1,
              }}>{s.num}</div>
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

        {/* Stadium details */}
        <div className="stadium-content">
          <div className="stadium-info">
            <div className="label" style={{ marginBottom: 16 }}>The Ground</div>
            <h1>
              Where Legends
              <em>Are Born</em>
            </h1>
            <p style={{ marginTop: 24 }}>
              Estadio Atletico is more than just a football ground. It is a cathedral of sport,
              a fortress where champions are forged and legends etched into history. With a
              capacity of 87,000 roaring supporters, the atmosphere on match night is unlike
              anything else in world football.
            </p>
            <p>
              Built in 1966 and thoroughly modernized in 2019, the stadium blends architectural
              heritage with cutting-edge facilities — from the iconic floodlight towers to the
              state-of-the-art hybrid pitch that plays faster than any surface in Europe.
            </p>

            {/* Specs grid */}
            <div className="stadium-specs" style={{ marginTop: 48 }}>
              {SPECS.map((s, i) => (
                <div key={i} className="spec-item">
                  <div className="spec-value">{s.val}</div>
                  <div className="spec-key">{s.key}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Seating zones */}
          <div>
            <div className="label" style={{ marginBottom: 24 }}>Seating Zones</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {ZONES.map((z, i) => (
                <div key={i} style={{
                  background: 'var(--green)',
                  padding: '28px 32px',
                  display: 'grid',
                  gridTemplateColumns: '1fr auto',
                  alignItems: 'start',
                  gap: 16,
                  borderLeft: '2px solid transparent',
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
                  <div>
                    <div style={{
                      fontFamily: "'Bebas Neue', sans-serif",
                      fontSize: 22,
                      letterSpacing: '0.05em',
                      color: 'var(--white)',
                      marginBottom: 8,
                    }}>{z.name}</div>
                    <div style={{
                      fontSize: 13,
                      color: 'var(--gray-light)',
                      lineHeight: 1.6,
                    }}>{z.desc}</div>
                  </div>
                  <div style={{
                    fontFamily: "'Bebas Neue', sans-serif",
                    fontSize: 28,
                    color: 'var(--gold)',
                    whiteSpace: 'nowrap',
                    flexShrink: 0,
                  }}>{z.price}</div>
                </div>
              ))}
            </div>

            <button className="btn-primary" style={{ marginTop: 24, width: '100%' }}>
              <span>Book Tickets</span>
            </button>
          </div>
        </div>

        {/* History timeline */}
        <div style={{
          padding: '80px 64px 120px',
          borderTop: '1px solid var(--border)',
        }}>
          <div className="label" style={{ marginBottom: 40 }}>Stadium Milestones</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 2 }}>
            {[
              { year: '1966', event: 'Estadio Atletico opens with 40,000 capacity' },
              { year: '1982', event: 'North stand expanded to 60,000 total' },
              { year: '2002', event: 'Centenary renovation, capacity reaches 75,000' },
              { year: '2019', event: 'Complete rebuild to 87,000 with hybrid pitch' },
            ].map((m, i) => (
              <div key={i} style={{
                background: 'var(--green)',
                padding: '32px 28px',
                borderTop: '2px solid var(--gold)',
              }}>
                <div style={{
                  fontFamily: "'Bebas Neue', sans-serif",
                  fontSize: 42,
                  color: 'var(--gold)',
                  lineHeight: 1,
                  marginBottom: 12,
                }}>{m.year}</div>
                <div style={{
                  fontSize: 14,
                  color: 'var(--gray-light)',
                  lineHeight: 1.6,
                }}>{m.event}</div>
              </div>
            ))}
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
              <p>The home of champions since 1966.</p>
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
              <h4>Visit Us</h4>
              <ul>
                <li><a href="#">Stadium Tours</a></li>
                <li><a href="#">Club Shop</a></li>
                <li><a href="#">Museum</a></li>
                <li><a href="#">Hospitality</a></li>
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
