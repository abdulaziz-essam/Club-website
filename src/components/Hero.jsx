import { useEffect, useRef } from 'react';

export default function Hero() {
  const eyebrowRef = useRef();
  const titleRef = useRef();
  const subRef = useRef();
  const btnsRef = useRef();

  useEffect(() => {
    const els = [eyebrowRef, titleRef, subRef, btnsRef];
    els.forEach((ref, i) => {
      if (ref.current) {
        ref.current.style.opacity = '0';
        ref.current.style.transform = 'translateY(30px)';
        setTimeout(() => {
          if (ref.current) {
            ref.current.style.transition = 'opacity 0.9s ease, transform 0.9s ease';
            ref.current.style.opacity = '1';
            ref.current.style.transform = 'translateY(0)';
          }
        }, 400 + i * 200);
      }
    });
  }, []);

  return (
    <section id="hero" style={{
      height: '100vh',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'flex-end',
      padding: '0 56px 90px',
      position: 'relative',
      zIndex: 2,
    }}>
      {/* Gradient fade */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        background: 'linear-gradient(to top, rgba(5,10,7,0.95) 0%, rgba(5,10,7,0.4) 40%, transparent 100%)',
      }} />

      <p ref={eyebrowRef} style={{
        fontFamily: "'Barlow Condensed', sans-serif",
        fontSize: 11, fontWeight: 600, letterSpacing: 6,
        textTransform: 'uppercase', color: 'var(--gold)',
        marginBottom: 16, position: 'relative',
      }}>
        Est. 2010 &nbsp;·&nbsp; Elite Football Academy
      </p>

      <h1 ref={titleRef} style={{
        fontFamily: "'Bebas Neue', sans-serif",
        fontSize: 'clamp(72px, 13vw, 196px)',
        lineHeight: 0.88,
        color: 'var(--white)',
        position: 'relative',
      }}>
        FORGE<br />
        <span style={{ color: 'var(--gold)' }}>YOUR</span><br />
        LEGACY
      </h1>

      <p ref={subRef} style={{
        fontSize: 15, lineHeight: 1.8,
        color: 'var(--gray)', maxWidth: 380,
        marginTop: 28, position: 'relative',
      }}>
        Where raw talent meets world-class coaching inside a purpose-built stadium complex. Your journey to professional football starts here.
      </p>

      <div ref={btnsRef} style={{
        display: 'flex', gap: 32, marginTop: 48,
        alignItems: 'center', position: 'relative',
      }}>
        <a href="#programs" style={{
          display: 'inline-flex', alignItems: 'center', gap: 14,
          fontFamily: "'Barlow Condensed', sans-serif",
          fontSize: 12, fontWeight: 700, letterSpacing: 4,
          textTransform: 'uppercase', color: 'var(--black)',
          background: 'var(--gold)', padding: '15px 36px',
          transition: 'background 0.2s, transform 0.2s',
        }}
        onMouseEnter={e => { e.currentTarget.style.background = 'var(--gold-light)'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
        onMouseLeave={e => { e.currentTarget.style.background = 'var(--gold)'; e.currentTarget.style.transform = 'translateY(0)'; }}
        >
          Explore Programs <span style={{ fontSize: 18 }}>→</span>
        </a>
        <a href="#stadium" style={{
          fontFamily: "'Barlow Condensed', sans-serif",
          fontSize: 12, fontWeight: 600, letterSpacing: 3,
          textTransform: 'uppercase', color: 'var(--white)',
          opacity: 0.5, transition: 'opacity 0.2s',
          display: 'flex', alignItems: 'center', gap: 8,
        }}
        onMouseEnter={e => { e.currentTarget.style.opacity = 1; }}
        onMouseLeave={e => { e.currentTarget.style.opacity = 0.5; }}
        >
          ↓ &nbsp;View Stadium
        </a>
      </div>

      {/* Scroll indicator */}
      <div style={{
        position: 'absolute', right: 56, bottom: 80,
        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12,
      }}>
        <span style={{
          fontFamily: "'Barlow Condensed', sans-serif",
          fontSize: 9, letterSpacing: 4,
          textTransform: 'uppercase', color: 'var(--gray)',
          writingMode: 'vertical-rl', opacity: 0.5,
        }}>Scroll</span>
        <div style={{
          width: 1, height: 56,
          background: 'linear-gradient(to bottom, var(--gold), transparent)',
          animation: 'scrollPulse 2s ease-in-out infinite',
        }} />
      </div>

      <style>{`
        @keyframes scrollPulse {
          0%,100% { opacity: 0.3; }
          50% { opacity: 1; }
        }
      `}</style>
    </section>
  );
}
