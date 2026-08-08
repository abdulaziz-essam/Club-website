import { useState, useEffect, useRef } from 'react'
import { SECTIONS } from '../constants/sections'
import AmbientBlobs from '../components/AmbientBlobs'
import Navbar from '../components/Navbar'
import SectionCard from '../components/SectionCard'

export default function Home() {
  const [focusedIndex, setFocusedIndex] = useState(null)
  const rowRef = useRef(null)
  const tiltRef = useRef(0)

  // Mouse tilt — disabled when focused
  useEffect(() => {
    const onMove = e => {
      if (focusedIndex !== null) return
      tiltRef.current = (e.clientX / window.innerWidth - 0.5) * -10
      if (rowRef.current) {
        rowRef.current.style.transition = 'transform 0.1s linear'
        rowRef.current.style.transform = `rotateY(${tiltRef.current}deg)`
      }
    }
    window.addEventListener('mousemove', onMove)
    return () => window.removeEventListener('mousemove', onMove)
  }, [focusedIndex])

  // When unfocusing, restore row tilt
  useEffect(() => {
    if (!rowRef.current) return
    if (focusedIndex === null) {
      rowRef.current.style.transition = 'transform 0.8s cubic-bezier(0.25,0.46,0.45,0.94)'
      rowRef.current.style.transform = `rotateY(${tiltRef.current}deg)`
    }
  }, [focusedIndex])

  return (
    <div className="w-screen h-screen relative overflow-hidden bg-[#0f1117]">
      <AmbientBlobs />
      <Navbar />

      {/* 3D Gallery */}
      <div
        className="absolute inset-0 flex items-center justify-center"
        style={{ perspective: '1100px', perspectiveOrigin: '50% 46%' }}
      >
        <div
          ref={rowRef}
          className="relative flex items-center"
          style={{ transformStyle: 'preserve-3d' }}
        >
          {SECTIONS.map((s, i) => (
            <SectionCard
              key={s.id}
              section={s}
              index={i}
              total={SECTIONS.length}
              focusedIndex={focusedIndex}
              onClick={() => setFocusedIndex(i)}
            />
          ))}
        </div>
      </div>

      {/* Floor fade */}
      <div
        className="absolute bottom-0 left-0 right-0 h-[38%] pointer-events-none"
        style={{ background: 'linear-gradient(to bottom, transparent, rgba(8,8,16,0.96))' }}
      />

      {/* Back button */}
      {focusedIndex !== null && (
        <button
          onClick={() => setFocusedIndex(null)}
          className="fixed bottom-10 left-1/2 -translate-x-1/2 z-[200] px-8 py-3 text-[11px] tracking-[0.3em] uppercase text-white/70 border border-white/20 rounded-sm hover:text-white hover:border-white/50 transition-all duration-300"
          style={{ backdropFilter: 'blur(8px)', background: 'rgba(0,0,0,0.3)' }}
        >
          ← Back
        </button>
      )}

      {focusedIndex === null && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 text-[9px] tracking-[0.45em] uppercase text-white/20 pointer-events-none">
          Move mouse to tilt · Click to enter
        </div>
      )}
    </div>
  )
}
