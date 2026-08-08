import { useState } from 'react'
import { useCardFocus } from '../hooks/useCardFocus'

export default function SectionCard({ section, index, total, focusedIndex, onClick }) {
  const [hovered, setHovered] = useState(false)
  const { Icon } = section

  const center = (total - 1) / 2
  const offset = index - center
  const isUnfocused = focusedIndex !== null && focusedIndex !== index

  const { cardRef, isFocused } = useCardFocus({ index, offset, section, focusedIndex })

  const handleClick = () => {
    if (focusedIndex !== null) return // locked while something focused
    onClick()
  }

  return (
    <div
      ref={cardRef}
      className="relative flex-shrink-0"
      style={{
        width: 188,
        height: 278,
        // Default transform — overridden by useEffect
        transform: `translateX(${offset * 204}px) translateZ(${section.tz}px) rotateY(${section.rotY}deg)`,
        borderRadius: 6,
        overflow: 'hidden',
        border: '3px solid #000',
        opacity: isUnfocused ? 0 : 1,
        pointerEvents: isUnfocused ? 'none' : 'auto',
        zIndex: isFocused ? 100 : hovered ? 10 : total - Math.abs(Math.round(offset)),
        boxShadow: isFocused
          ? `0 40px 80px ${section.glow}, 0 0 0 2px rgba(255,255,255,0.8)`
          : hovered
          ? `0 28px 60px ${section.glow}, 0 0 0 2px rgba(255,255,255,0.65)`
          : `0 8px 28px rgba(0,0,0,0.55), 0 0 0 1.5px rgba(255,255,255,0.1)`,
        transition: 'opacity 0.5s ease, box-shadow 0.3s ease',
      }}
      onMouseEnter={() => { if (!isFocused) setHovered(true) }}
      onMouseLeave={() => setHovered(false)}
      onClick={handleClick}
    >
      {/* Gradient bg */}
      <div className={`absolute inset-0 bg-gradient-to-br ${section.grad}`} />

      {/* Shine */}
      <div
        className="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-black/15 pointer-events-none transition-opacity duration-300"
        style={{ opacity: hovered || isFocused ? 1 : 0 }}
      />

      {/* Stat badge */}
      <div className="absolute top-3 right-3 text-xs font-bold tracking-widest px-2.5 py-1 rounded-sm bg-black/30 text-white backdrop-blur-sm">
        {section.stat}
      </div>

      {/* Icon */}
      <div className="absolute inset-0 flex items-center justify-center" style={{ paddingBottom: 60 }}>
        <Icon
          color="#fff"
          style={{
            width: 70,
            height: 70,
            strokeWidth: 1.2,
            filter: 'drop-shadow(0 4px 18px rgba(0,0,0,0.35))',
            animation: hovered || isFocused
              ? 'float-hover 1.1s ease-in-out infinite alternate'
              : `float ${3 + index * 0.25}s ease-in-out infinite`,
          }}
        />
      </div>

      {/* Label + sub */}
      <div className="absolute bottom-0 left-0 right-0 px-4 pb-4 pt-8 bg-gradient-to-t from-black/65 to-transparent">
        <div
          className="text-white font-bold tracking-wide text-base leading-none mb-1"
          style={{ fontFamily: "'Russo One', sans-serif" }}
        >
          {section.label}
        </div>
        <div className="text-white/55 text-[10px] tracking-[0.18em] uppercase">
          {section.sub}
        </div>
      </div>
    </div>
  )
}
