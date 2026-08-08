import { useEffect, useRef } from 'react'

const FOCUS_TRANSITION   = 'transform 1s cubic-bezier(0.25, 0.46, 0.45, 0.94)'
const RESTORE_TRANSITION = 'transform 0.9s cubic-bezier(0.25, 0.46, 0.45, 0.94)'
const CARD_SPACING = 204
const FOCUS_SCALE  = 1.6

function getDistanceToScreenCenter(el) {
  const rect = el.getBoundingClientRect()
  const dx = window.innerWidth  / 2 - (rect.left + rect.width  / 2)
  const dy = window.innerHeight / 2 - (rect.top  + rect.height / 2)
  return { dx, dy }
}

function animateToCenter(el, offset) {
  const { dx, dy } = getDistanceToScreenCenter(el)
  el.style.transition = FOCUS_TRANSITION
  el.style.transform  = `
    translateX(calc(${offset * CARD_SPACING}px + ${dx}px))
    translateY(${dy}px)
    translateZ(0px)
    rotateY(0deg)
    scale(${FOCUS_SCALE})
  `
}

function restoreArcPosition(el, offset, section) {
  el.style.transition = RESTORE_TRANSITION
  el.style.transform  = `
    translateX(${offset * CARD_SPACING}px)
    translateZ(${section.tz}px)
    rotateY(${section.rotY}deg)
  `
}

export function useCardFocus({ index, offset, section, focusedIndex }) {
  const cardRef = useRef(null)
  const isFocused = focusedIndex === index

  useEffect(() => {
    const el = cardRef.current
    if (!el) return

    if (isFocused) {
      animateToCenter(el, offset)
    } else {
      restoreArcPosition(el, offset, section)
    }
  }, [isFocused, focusedIndex])

  return { cardRef, isFocused }
}
