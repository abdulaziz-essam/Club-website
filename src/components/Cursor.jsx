import { useCursorLoop } from '../hooks/useCursorLoop'

export default function Cursor() {
  const { cursorDotRef, cursorRingRef } = useCursorLoop()

  return (
    <>
      <div
        ref={cursorDotRef}
        className="fixed w-2 h-2 rounded-full bg-white pointer-events-none z-[9999] -translate-x-1/2 -translate-y-1/2 mix-blend-difference"
      />
      <div
        ref={cursorRingRef}
        className="fixed w-8 h-8 rounded-full border border-white/50 pointer-events-none z-[9998] -translate-x-1/2 -translate-y-1/2 transition-all duration-200"
      />
    </>
  )
}
