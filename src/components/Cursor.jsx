import { useEffect, useRef } from 'react'

export default function Cursor() {
  const dotRef = useRef(null)
  const ringRef = useRef(null)
  const mouse = useRef({ x: 0, y: 0 })
  const ring = useRef({ x: 0, y: 0 })
  const raf = useRef(null)

  useEffect(() => {
    const onMove = (e) => {
      mouse.current = { x: e.clientX, y: e.clientY }
    }
    window.addEventListener('mousemove', onMove)

    const animate = () => {
      ring.current.x += (mouse.current.x - ring.current.x) * 0.12
      ring.current.y += (mouse.current.y - ring.current.y) * 0.12

      if (dotRef.current) {
        dotRef.current.style.left = mouse.current.x + 'px'
        dotRef.current.style.top = mouse.current.y + 'px'
      }
      if (ringRef.current) {
        ringRef.current.style.left = ring.current.x + 'px'
        ringRef.current.style.top = ring.current.y + 'px'
      }
      raf.current = requestAnimationFrame(animate)
    }
    raf.current = requestAnimationFrame(animate)

    const hover = () => {
      if (ringRef.current) ringRef.current.style.width = '52px'
      if (ringRef.current) ringRef.current.style.height = '52px'
      if (ringRef.current) ringRef.current.style.background = 'rgba(201,168,76,0.08)'
    }
    const unhover = () => {
      if (ringRef.current) ringRef.current.style.width = '32px'
      if (ringRef.current) ringRef.current.style.height = '32px'
      if (ringRef.current) ringRef.current.style.background = 'transparent'
    }

    document.querySelectorAll('a, button').forEach(el => {
      el.addEventListener('mouseenter', hover)
      el.addEventListener('mouseleave', unhover)
    })

    return () => {
      window.removeEventListener('mousemove', onMove)
      cancelAnimationFrame(raf.current)
    }
  }, [])

  return (
    <>
      <div ref={dotRef} style={{
        position: 'fixed', width: 7, height: 7,
        background: 'var(--gold)', borderRadius: '50%',
        pointerEvents: 'none', zIndex: 9999,
        transform: 'translate(-50%,-50%)',
      }} />
      <div ref={ringRef} style={{
        position: 'fixed', width: 32, height: 32,
        border: '1px solid var(--gold)', borderRadius: '50%',
        pointerEvents: 'none', zIndex: 9998,
        transform: 'translate(-50%,-50%)',
        opacity: 0.7,
        transition: 'width 0.25s, height 0.25s, background 0.25s',
      }} />
    </>
  )
}
