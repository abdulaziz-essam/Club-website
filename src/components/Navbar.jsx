import { useState, useEffect } from 'react'
import { NavLink, Link } from 'react-router-dom'

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
      <Link to="/" className="nav-logo">
        <div className="nav-logo-badge">FC</div>
        <div>
          <div className="nav-logo-text">ATLETICO</div>
          <div className="nav-logo-sub">Football Club · Est. 1902</div>
        </div>
      </Link>

      <ul className="nav-links">
        {[
          { label: 'Home', to: '/' },
          { label: 'Squad', to: '/squad' },
          { label: 'Matches', to: '/matches' },
          { label: 'Stadium', to: '/stadium' },
        ].map(({ label, to }) => (
          <li key={to}>
            <NavLink
              to={to}
              end={to === '/'}
              className={({ isActive }) => isActive ? 'active' : ''}
            >
              {label}
            </NavLink>
          </li>
        ))}
      </ul>

      <button className="nav-cta">Get Tickets</button>
    </nav>
  )
}
