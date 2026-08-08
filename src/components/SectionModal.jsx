import { X, ArrowRight } from 'lucide-react'

export default function SectionModal({ section, onClose }) {
  if (!section) return null

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center animate-fadein"
      style={{ background: 'rgba(8,8,16,0.85)', backdropFilter: 'blur(18px)' }}
      onClick={onClose}
    >
      <div
        className={`relative w-[90%] max-w-[500px] p-14 rounded-md animate-slideup bg-gradient-to-br ${section.grad}`}
        style={{ boxShadow: `0 40px 120px ${section.glow}` }}
        onClick={e => e.stopPropagation()}
      >
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 w-9 h-9 rounded-full flex items-center justify-center bg-black/25 hover:bg-black/40 transition-colors"
          style={{ color: section.fg }}
        >
          <X size={16} />
        </button>

        {/* Icon badge */}
        <div className="w-16 h-16 rounded-xl flex items-center justify-center bg-black/20 mb-6">
          <section.Icon size={32} strokeWidth={1.4} color={section.fg} />
        </div>

        <p
          className="text-[10px] tracking-[0.4em] uppercase mb-3 opacity-60"
          style={{ color: section.fg }}
        >
          {section.sub}
        </p>

        <h2
          className="text-[64px] leading-none mb-6"
          style={{ fontFamily: "'Russo One',sans-serif", color: section.fg }}
        >
          {section.label.toUpperCase()}
        </h2>

        <p
          className="text-[15px] leading-[1.8] opacity-70 mb-10 max-w-[340px]"
          style={{ color: section.fg }}
        >
          {section.desc}
        </p>

        <div className="flex gap-3">
          <button
            className="flex items-center gap-2 px-8 py-3.5 rounded-sm text-[11px] tracking-[0.15em] uppercase font-semibold text-white transition-opacity hover:opacity-80"
            style={{ background: section.fg, fontFamily: "'Russo One',sans-serif" }}
          >
            Enter <ArrowRight size={14} />
          </button>
          <button
            onClick={onClose}
            className="px-6 py-3.5 rounded-sm text-[11px] tracking-[0.15em] uppercase transition-opacity hover:opacity-70"
            style={{ background: 'rgba(0,0,0,0.18)', color: section.fg, border: `1px solid ${section.fg}44` }}
          >
            Back
          </button>
        </div>
      </div>
    </div>
  )
}
