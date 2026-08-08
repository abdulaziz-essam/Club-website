import { useEffect, useRef } from 'react'

const LERP_SPEED = 0.13

const offscreen = { x: -100, y: -100 }

function lerp(current, target) {
  return current + (target - current) * LERP_SPEED
}

function setPosition(el, x, y) {
  el.style.left = `${x}px`
  el.style.top  = `${y}px`
}

export function useCursorLoop() {
  const cursorDotRef  = useRef(null)
  const cursorRingRef = useRef(null)
  const mousePosition = useRef({ ...offscreen })
  const ringPosition  = useRef({ ...offscreen })

  useEffect(() => {
    const onMouseMove = e => {
      mousePosition.current.x = e.clientX
      mousePosition.current.y = e.clientY
    }

    const animate = () => {
      const { x: mx, y: my } = mousePosition.current
      const ring = ringPosition.current

      ring.x = lerp(ring.x, mx)
      ring.y = lerp(ring.y, my)

      if (cursorDotRef.current)  setPosition(cursorDotRef.current, mx, my)
      if (cursorRingRef.current) setPosition(cursorRingRef.current, ring.x, ring.y)

      frameId = requestAnimationFrame(animate)
    }

    let frameId = requestAnimationFrame(animate)
    window.addEventListener('mousemove', onMouseMove)

    return () => {
      window.removeEventListener('mousemove', onMouseMove)
      cancelAnimationFrame(frameId)
    }
  }, [])

  return { cursorDotRef, cursorRingRef }
}
