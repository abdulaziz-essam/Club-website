import { useEffect, useRef, useState } from 'react';

function Counter({ target, suffix = '+' }) {
  const [value, setValue] = useState(0);
  const ref = useRef();
  const started = useRef(false);

  useEffect(() => {
    const obs = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !started.current) {
        started.current = true;
        let start = 0;
        const step = target / 55;
        const timer = setInterval(() => {
          start += step;
          if (start >= target) {
            setValue(target);
            clearInterval(timer);
          } else {
            setValue(Math.floor(start));
          }
        }, 18);
      }
    }, { threshold: 0.5 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [target]);

  return <span ref={ref}>{value}{suffix}</span>;
}

const stats = [
  { number: 500, suffix: '+', label: 'Players Enrolled Yearly' },
  { number: 15, suffix: '+', label: 'Professional Coaches' },
  { number: 95, suffix: '%', label: 'Match-Ready Athletes' },
  { number: 12, suffix: '', label: 'Years of Excellence' },
];

export default function Stats() {
  return (
    <section style={{
      display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)',
      padding: '44px 56px',
      borderTop: '1px solid var(--border)',
      borderBottom: '1px solid var(--border)',
      background: 'rgba(5,10,7,0.75)',
      backdropFilter: 'blur(12px)',
      position: 'relative', zIndex: 2,
    }}>
      {stats.map((s, i) => (
        <div key={i} style={{
          padding: '0 28px',
          borderRight: i < 3 ? '1px solid var(--border)' : 'none',
        }}>
          <div style={{
            fontFamily: "'Bebas Neue', sans-serif",
            fontSize: 56, color: 'var(--gold)', lineHeight: 1,
          }}>
            <Counter target={s.number} suffix={s.suffix} />
          </div>
          <div style={{
            fontFamily: "'Barlow Condensed', sans-serif",
            fontSize: 10, letterSpacing: 3,
            textTransform: 'uppercase', color: 'var(--gray)',
            marginTop: 6,
          }}>{s.label}</div>
        </div>
      ))}
    </section>
  );
}
