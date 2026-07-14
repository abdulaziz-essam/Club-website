import { useEffect, useRef } from 'react'

export default function PageTransition({ children }) {
  const overlayRef = useRef(null)
  const contentRef = useRef(null)

  useEffect(() => {
    const overlay = overlayRef.current
    const content = contentRef.current
    if (!overlay || !content) return

    // Slide overlay out revealing content
    overlay.style.transform = 'scaleY(1)'
    overlay.style.transformOrigin = 'top'
    overlay.style.transition = 'none'
    content.style.opacity = '0'

    const t1 = setTimeout(() => {
      overlay.style.transition = 'transform 0.6s cubic-bezier(0.76, 0, 0.24, 1)'
      overlay.style.transform = 'scaleY(0)'
      content.style.opacity = '1'
      content.style.transition = 'opacity 0.4s ease 0.3s'
    }, 50)

    return () => {
      clearTimeout(t1)
    }
  }, [])

  return (
    <>
      <div
        ref={overlayRef}
        style={{
          position: 'fixed',
          inset: 0,
          background: 'var(--black)',
          zIndex: 200,
          transformOrigin: 'top',
          pointerEvents: 'none',
        }}
      />
      <div ref={contentRef}>
        {children}
      </div>
    </>
  )
}
