export default function Navbar() {
  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-11 py-5 pointer-events-none"
      style={{ background: 'linear-gradient(to bottom, rgba(10,10,20,0.92) 0%, transparent 100%)' }}
    >
      <div className="flex items-center gap-3">
        <div
          className="w-10 h-10 rounded-sm flex items-center justify-center text-xs font-bold text-[#1a0e00]"
          style={{ background: 'linear-gradient(135deg,#f7971e,#ffd200)', fontFamily: "'Russo One',sans-serif" }}
        >
          FC
        </div>
        <div>
          <div
            className="text-white text-[17px] tracking-[0.22em] leading-none"
            style={{ fontFamily: "'Russo One',sans-serif" }}
          >
            VORTEX
          </div>
          <div className="text-[8px] tracking-[0.4em] uppercase text-yellow-300/60 mt-0.5">
            Football Club · Est. 1994
          </div>
        </div>
      </div>

      <div className="text-[10px] tracking-[0.25em] uppercase text-white/30">
        Hover &amp; Click to Explore
      </div>
    </nav>
  )
}
