export default function Navbar() {
  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-10 py-5 pointer-events-none"
      style={{ background: 'linear-gradient(to bottom, rgba(6,0,10,0.95) 0%, transparent 100%)' }}
    >
      {/* Logo */}
      <div className="flex items-center gap-3">
        <div
          className="w-10 h-10 rounded flex items-center justify-center text-xs font-bold"
          style={{
            background: 'linear-gradient(135deg, #CE1126, #8B0000)',
            color: '#fff',
            fontFamily: "'Russo One', sans-serif",
            boxShadow: '0 0 18px rgba(206,17,38,0.45)',
          }}
        >
          VFC
        </div>
        <div>
          <div
            className="text-white leading-none tracking-[0.22em]"
            style={{ fontFamily: "'Russo One', sans-serif", fontSize: 17 }}
          >
            VORTEX
          </div>
          <div
            className="text-[8px] tracking-[0.4em] uppercase mt-0.5"
            style={{ color: 'rgba(206,17,38,0.75)', fontFamily: "'DM Sans', sans-serif" }}
          >
            Football Club · Est. 1994
          </div>
        </div>
      </div>

      {/* Right hint */}
      <div
        className="text-[10px] tracking-[0.28em] uppercase"
        style={{ color: 'rgba(255,255,255,0.22)', fontFamily: "'DM Sans', sans-serif" }}
      >
        Hover &amp; Click to Explore
      </div>
    </nav>
  )
}
