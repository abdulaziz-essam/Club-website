const items = [
  'Elite Training', 'World-Class Coaches', 'Professional Stadium',
  'Youth Development', 'UEFA Certified', 'Pro Pathway',
];

export default function Marquee() {
  const doubled = [...items, ...items];
  return (
    <div style={{
      background: 'var(--gold)', overflow: 'hidden',
      whiteSpace: 'nowrap', padding: '18px 0',
      position: 'relative', zIndex: 2,
    }}>
      <div style={{
        display: 'inline-flex',
        animation: 'marquee 22s linear infinite',
      }}>
        {doubled.map((item, i) => (
          <span key={i} style={{
            fontFamily: "'Bebas Neue', sans-serif",
            fontSize: 14, letterSpacing: 4,
            color: 'var(--black)', padding: '0 28px',
          }}>
            {item}
            <span style={{ opacity: 0.35, padding: '0 12px' }}>◆</span>
          </span>
        ))}
      </div>
      <style>{`
        @keyframes marquee {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
      `}</style>
    </div>
  );
}
