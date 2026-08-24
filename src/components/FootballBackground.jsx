import { useRef, useEffect } from 'react'

/* ─────────────────────────────────────────────────────────────────────────────
   FOOTBALL POSTER BACKGROUND — pure Canvas 2D, no Three.js
──────────────────────────────────────────────────────────────────────────────*/

const RED   = '#CE1126'
const DARK  = '#18161a'
const RED_GLOW = 'rgba(206,17,38,'

/* ── helpers ──────────────────────────────────────────────────────────────── */

function hexPatch(ctx, cx, cy, r, fill, stroke) {
  ctx.beginPath()
  for (let i = 0; i < 6; i++) {
    const a = (Math.PI / 3) * i - Math.PI / 6
    const x = cx + r * Math.cos(a)
    const y = cy + r * Math.sin(a)
    i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y)
  }
  ctx.closePath()
  ctx.fillStyle = fill
  ctx.fill()
  ctx.strokeStyle = stroke
  ctx.lineWidth = 1.2
  ctx.stroke()
}

/* ── draw static elements once ───────────────────────────────────────────── */

function drawStatic(ctx, W, H) {
  /* 1 · background */
  ctx.fillStyle = DARK
  ctx.fillRect(0, 0, W, H)

  /* 2 · subtle grid texture */
  ctx.save()
  ctx.strokeStyle = 'rgba(255,255,255,0.025)'
  ctx.lineWidth = 0.5
  const gridStep = 40
  for (let x = 0; x < W; x += gridStep) {
    ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke()
  }
  for (let y = 0; y < H; y += gridStep) {
    ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke()
  }
  ctx.restore()

  /* 3 · light rays from top-left */
  ctx.save()
  ctx.globalCompositeOperation = 'screen'
  const rayCount = 7
  const rayOriginLX = W * 0.08
  const rayOriginLY = H * 0.02
  for (let i = 0; i < rayCount; i++) {
    const spread = 0.15 + i * 0.09
    const grad = ctx.createLinearGradient(
      rayOriginLX, rayOriginLY,
      rayOriginLX + W * spread, rayOriginLY + H * 0.85
    )
    grad.addColorStop(0,   RED_GLOW + '0.18)')
    grad.addColorStop(0.4, RED_GLOW + '0.07)')
    grad.addColorStop(1,   RED_GLOW + '0)')
    ctx.fillStyle = grad
    ctx.beginPath()
    ctx.moveTo(rayOriginLX, rayOriginLY)
    const angle1 = (spread - 0.04) * Math.PI * 0.55
    const angle2 = (spread + 0.04) * Math.PI * 0.55
    ctx.lineTo(
      rayOriginLX + Math.cos(angle1) * W * 1.2,
      rayOriginLY + Math.sin(angle1) * H * 1.1
    )
    ctx.lineTo(
      rayOriginLX + Math.cos(angle2) * W * 1.2,
      rayOriginLY + Math.sin(angle2) * H * 1.1
    )
    ctx.closePath()
    ctx.fill()
  }

  /* 4 · light rays from top-right */
  const rayOriginRX = W * 0.92
  const rayOriginRY = H * 0.02
  for (let i = 0; i < rayCount; i++) {
    const spread = 0.15 + i * 0.09
    const grad = ctx.createLinearGradient(
      rayOriginRX, rayOriginRY,
      rayOriginRX - W * spread, rayOriginRY + H * 0.85
    )
    grad.addColorStop(0,   RED_GLOW + '0.18)')
    grad.addColorStop(0.4, RED_GLOW + '0.07)')
    grad.addColorStop(1,   RED_GLOW + '0)')
    ctx.fillStyle = grad
    ctx.beginPath()
    ctx.moveTo(rayOriginRX, rayOriginRY)
    const angle1 = Math.PI - (spread - 0.04) * Math.PI * 0.55
    const angle2 = Math.PI - (spread + 0.04) * Math.PI * 0.55
    ctx.lineTo(
      rayOriginRX + Math.cos(angle1) * W * 1.2,
      rayOriginRY + Math.sin(angle1) * H * 1.1
    )
    ctx.lineTo(
      rayOriginRX + Math.cos(angle2) * W * 1.2,
      rayOriginRY + Math.sin(angle2) * H * 1.1
    )
    ctx.closePath()
    ctx.fill()
  }
  ctx.restore()

  /* 5 · stadium arc / bowl silhouette */
  const stadArcCX = W * 0.5
  const stadArcCY = H * 1.05
  const stadArcRX  = W * 0.72
  const stadArcRY  = H * 0.60

  ctx.save()

  // outer bowl glow
  const bowlGrad = ctx.createRadialGradient(stadArcCX, stadArcCY, stadArcRX * 0.6, stadArcCX, stadArcCY, stadArcRX * 1.05)
  bowlGrad.addColorStop(0,   'rgba(206,17,38,0.06)')
  bowlGrad.addColorStop(0.6, 'rgba(206,17,38,0.03)')
  bowlGrad.addColorStop(1,   'rgba(0,0,0,0)')
  ctx.fillStyle = bowlGrad
  ctx.ellipse(stadArcCX, stadArcCY, stadArcRX * 1.1, stadArcRY * 1.1, 0, Math.PI, 2 * Math.PI)
  ctx.fill()

  // stadium tiers — concentric arcs getting lighter toward outside
  const tierCount = 5
  for (let t = tierCount; t >= 0; t--) {
    const ratio = 1 - t / (tierCount + 2)
    const rx = stadArcRX * (0.42 + ratio * 0.58)
    const ry = stadArcRY * (0.42 + ratio * 0.58)
    const alpha = 0.06 + ratio * 0.12
    ctx.beginPath()
    ctx.ellipse(stadArcCX, stadArcCY, rx, ry, 0, Math.PI, 2 * Math.PI)
    ctx.strokeStyle = `rgba(80,60,65,${alpha})`
    ctx.lineWidth = 2 + ratio * 4
    ctx.stroke()
  }

  // dark solid bowl fill (masks lower half)
  ctx.beginPath()
  ctx.ellipse(stadArcCX, stadArcCY, stadArcRX, stadArcRY, 0, Math.PI, 2 * Math.PI)
  ctx.lineTo(W, H)
  ctx.lineTo(0, H)
  ctx.closePath()
  const bowlFill = ctx.createLinearGradient(stadArcCX, stadArcCY - stadArcRY, stadArcCX, H)
  bowlFill.addColorStop(0, 'rgba(20,14,18,0.0)')
  bowlFill.addColorStop(0.3, 'rgba(20,14,18,0.7)')
  bowlFill.addColorStop(1, 'rgba(14,10,12,1.0)')
  ctx.fillStyle = bowlFill
  ctx.fill()

  /* 6 · crowd silhouettes along stadium arc rim */
  const crowdArcTop = stadArcCY - stadArcRY * 0.98
  const crowdCount  = 180
  for (let i = 0; i < crowdCount; i++) {
    const t = i / (crowdCount - 1)
    const angle = Math.PI + t * Math.PI            // from 180° → 360°
    const headX = stadArcCX + stadArcRX * 0.97 * Math.cos(angle)
    const headY = stadArcCY + stadArcRY * 0.97 * Math.sin(angle)

    // skip heads that fall below visible area
    if (headY > H * 0.72) continue

    const headR = 3.5 + Math.random() * 2.5
    const bodyH = headR * 2.2
    const alpha = 0.55 + Math.random() * 0.3

    ctx.fillStyle = `rgba(28,18,22,${alpha})`
    // body
    ctx.beginPath()
    ctx.ellipse(headX, headY + headR + bodyH * 0.4, headR * 0.7, bodyH * 0.5, 0, 0, Math.PI * 2)
    ctx.fill()
    // head
    ctx.beginPath()
    ctx.arc(headX, headY, headR, 0, Math.PI * 2)
    ctx.fill()
  }
  ctx.restore()

  /* 7 · pitch lines at bottom */
  ctx.save()
  ctx.strokeStyle = 'rgba(255,255,255,0.10)'
  ctx.lineWidth   = 1.5

  const pitchY = H * 0.86
  // halfway line
  ctx.beginPath()
  ctx.moveTo(W * 0.1, pitchY)
  ctx.lineTo(W * 0.9, pitchY)
  ctx.stroke()

  // center circle (ellipse foreshortened)
  ctx.beginPath()
  ctx.ellipse(W * 0.5, pitchY, W * 0.14, H * 0.04, 0, 0, Math.PI * 2)
  ctx.stroke()

  // center spot
  ctx.beginPath()
  ctx.arc(W * 0.5, pitchY, 3, 0, Math.PI * 2)
  ctx.fillStyle = 'rgba(255,255,255,0.15)'
  ctx.fill()

  ctx.restore()

  /* 8 · large football */
  const ballCX = W * 0.5
  const ballCY = H * 0.41
  const ballR  = Math.min(W, H) * 0.185   // ~180px on a typical 900px tall canvas

  // ball shadow on pitch
  const shadowGrad = ctx.createRadialGradient(ballCX, ballCY + ballR * 1.05, 0, ballCX, ballCY + ballR, ballR * 1.3)
  shadowGrad.addColorStop(0,   'rgba(0,0,0,0.65)')
  shadowGrad.addColorStop(0.5, 'rgba(0,0,0,0.25)')
  shadowGrad.addColorStop(1,   'rgba(0,0,0,0)')
  ctx.save()
  ctx.scale(1, 0.28)
  ctx.beginPath()
  ctx.arc(ballCX, (ballCY + ballR * 1.18) / 0.28, ballR * 1.3, 0, Math.PI * 2)
  ctx.fillStyle = shadowGrad
  ctx.fill()
  ctx.restore()

  // red outer glow
  const outerGlow = ctx.createRadialGradient(ballCX, ballCY, ballR * 0.8, ballCX, ballCY, ballR * 1.5)
  outerGlow.addColorStop(0,   RED_GLOW + '0.0)')
  outerGlow.addColorStop(0.6, RED_GLOW + '0.18)')
  outerGlow.addColorStop(1,   RED_GLOW + '0.0)')
  ctx.beginPath()
  ctx.arc(ballCX, ballCY, ballR * 1.5, 0, Math.PI * 2)
  ctx.fillStyle = outerGlow
  ctx.fill()

  // clip to ball circle for all interior drawing
  ctx.save()
  ctx.beginPath()
  ctx.arc(ballCX, ballCY, ballR, 0, Math.PI * 2)
  ctx.clip()

  // base ball gradient (white → grey)
  const ballBase = ctx.createRadialGradient(
    ballCX - ballR * 0.28, ballCY - ballR * 0.32, ballR * 0.05,
    ballCX,                ballCY,                 ballR
  )
  ballBase.addColorStop(0,   '#f0eeee')
  ballBase.addColorStop(0.4, '#d8d5d5')
  ballBase.addColorStop(0.75, '#b0aaaa')
  ballBase.addColorStop(1,   '#5a5050')
  ctx.fillStyle = ballBase
  ctx.fillRect(ballCX - ballR, ballCY - ballR, ballR * 2, ballR * 2)

  // pentagon/hex patch pattern (classic Buckminster ball)
  const patches = [
    // center top pentagon
    { angle: -Math.PI / 2, dist: 0,           black: true },
    // ring of 5 hexagons
    { angle: -Math.PI / 2 + (Math.PI * 2) / 5 * 0, dist: 0.44, black: false },
    { angle: -Math.PI / 2 + (Math.PI * 2) / 5 * 1, dist: 0.44, black: false },
    { angle: -Math.PI / 2 + (Math.PI * 2) / 5 * 2, dist: 0.44, black: false },
    { angle: -Math.PI / 2 + (Math.PI * 2) / 5 * 3, dist: 0.44, black: false },
    { angle: -Math.PI / 2 + (Math.PI * 2) / 5 * 4, dist: 0.44, black: false },
    // outer ring pentagons
    { angle: -Math.PI / 2 + (Math.PI * 2) / 5 * 0.5, dist: 0.82, black: true },
    { angle: -Math.PI / 2 + (Math.PI * 2) / 5 * 1.5, dist: 0.82, black: true },
    { angle: -Math.PI / 2 + (Math.PI * 2) / 5 * 2.5, dist: 0.82, black: true },
    { angle: -Math.PI / 2 + (Math.PI * 2) / 5 * 3.5, dist: 0.82, black: true },
    { angle: -Math.PI / 2 + (Math.PI * 2) / 5 * 4.5, dist: 0.82, black: true },
    // far outer hexagons for coverage
    { angle: -Math.PI / 2 + (Math.PI * 2) / 5 * 0,   dist: 1.18, black: false },
    { angle: -Math.PI / 2 + (Math.PI * 2) / 5 * 1,   dist: 1.18, black: false },
    { angle: -Math.PI / 2 + (Math.PI * 2) / 5 * 2,   dist: 1.18, black: false },
    { angle: -Math.PI / 2 + (Math.PI * 2) / 5 * 3,   dist: 1.18, black: false },
    { angle: -Math.PI / 2 + (Math.PI * 2) / 5 * 4,   dist: 1.18, black: false },
    { angle: -Math.PI / 2 + (Math.PI * 2) / 10 * 1,  dist: 1.18, black: false },
    { angle: -Math.PI / 2 + (Math.PI * 2) / 10 * 3,  dist: 1.18, black: false },
    { angle: -Math.PI / 2 + (Math.PI * 2) / 10 * 5,  dist: 1.18, black: false },
    { angle: -Math.PI / 2 + (Math.PI * 2) / 10 * 7,  dist: 1.18, black: false },
    { angle: -Math.PI / 2 + (Math.PI * 2) / 10 * 9,  dist: 1.18, black: false },
  ]

  const patchR = ballR * 0.255
  patches.forEach(({ angle, dist, black }) => {
    const px = ballCX + Math.cos(angle) * ballR * dist
    const py = ballCY + Math.sin(angle) * ballR * dist
    // perspective-shrink patches near the edge
    const edgeDist = Math.hypot(px - ballCX, py - ballCY) / ballR
    const scale    = Math.max(0.35, 1 - edgeDist * 0.35)
    const fill = black
      ? 'rgba(18,10,12,0.88)'
      : 'rgba(238,232,232,0.0)'   // white patches are transparent (base shows)
    hexPatch(ctx, px, py, patchR * scale,
      fill,
      black ? 'rgba(0,0,0,0.5)' : 'rgba(100,90,90,0.35)'
    )
  })

  // dark shading on right/bottom
  const shadGrad = ctx.createRadialGradient(
    ballCX + ballR * 0.35, ballCY + ballR * 0.40, ballR * 0.1,
    ballCX + ballR * 0.2,  ballCY + ballR * 0.2,  ballR * 1.15
  )
  shadGrad.addColorStop(0,   'rgba(0,0,0,0.38)')
  shadGrad.addColorStop(0.5, 'rgba(0,0,0,0.18)')
  shadGrad.addColorStop(1,   'rgba(0,0,0,0)')
  ctx.fillStyle = shadGrad
  ctx.fillRect(ballCX - ballR, ballCY - ballR, ballR * 2, ballR * 2)

  // specular highlight top-left
  const specGrad = ctx.createRadialGradient(
    ballCX - ballR * 0.30, ballCY - ballR * 0.35, 0,
    ballCX - ballR * 0.25, ballCY - ballR * 0.30, ballR * 0.46
  )
  specGrad.addColorStop(0,   'rgba(255,255,255,0.82)')
  specGrad.addColorStop(0.25,'rgba(255,255,255,0.40)')
  specGrad.addColorStop(0.6, 'rgba(255,255,255,0.06)')
  specGrad.addColorStop(1,   'rgba(255,255,255,0)')
  ctx.fillStyle = specGrad
  ctx.fillRect(ballCX - ballR, ballCY - ballR, ballR * 2, ballR * 2)

  // secondary small highlight
  const spec2 = ctx.createRadialGradient(
    ballCX - ballR * 0.12, ballCY - ballR * 0.18, 0,
    ballCX - ballR * 0.10, ballCY - ballR * 0.15, ballR * 0.14
  )
  spec2.addColorStop(0,   'rgba(255,255,255,0.50)')
  spec2.addColorStop(1,   'rgba(255,255,255,0)')
  ctx.fillStyle = spec2
  ctx.fillRect(ballCX - ballR, ballCY - ballR, ballR * 2, ballR * 2)

  ctx.restore()  // end clip

  // ball rim (dark stroke)
  ctx.beginPath()
  ctx.arc(ballCX, ballCY, ballR, 0, Math.PI * 2)
  ctx.strokeStyle = 'rgba(0,0,0,0.55)'
  ctx.lineWidth   = 2.5
  ctx.stroke()

  /* 9 · header text — VORTEX FC */
  ctx.save()

  // text glow
  ctx.shadowColor  = RED
  ctx.shadowBlur   = 32

  ctx.fillStyle = '#ffffff'
  ctx.textAlign = 'center'
  ctx.textBaseline = 'alphabetic'

  const titleSize = Math.max(28, Math.min(72, W * 0.075))
  ctx.font = `900 ${titleSize}px "Arial Black", "Impact", sans-serif`
  ctx.letterSpacing = '0.12em'
  ctx.fillText('VORTEX FC', W * 0.5, H * 0.11)

  ctx.shadowBlur = 0

  // thin red rule under title
  const ruleW = titleSize * 5.2
  const ruleY = H * 0.115
  const ruleGrad = ctx.createLinearGradient(W * 0.5 - ruleW / 2, 0, W * 0.5 + ruleW / 2, 0)
  ruleGrad.addColorStop(0,   'rgba(206,17,38,0)')
  ruleGrad.addColorStop(0.2, RED)
  ruleGrad.addColorStop(0.8, RED)
  ruleGrad.addColorStop(1,   'rgba(206,17,38,0)')
  ctx.strokeStyle = ruleGrad
  ctx.lineWidth   = 1.5
  ctx.beginPath()
  ctx.moveTo(W * 0.5 - ruleW / 2, ruleY)
  ctx.lineTo(W * 0.5 + ruleW / 2, ruleY)
  ctx.stroke()

  // EST. 1994 subtitle
  const subSize = Math.max(10, Math.min(22, W * 0.022))
  ctx.font      = `700 ${subSize}px "Arial", sans-serif`
  ctx.fillStyle = RED
  ctx.shadowColor = RED
  ctx.shadowBlur  = 12
  ctx.fillText('EST. 1994', W * 0.5, H * 0.145)

  ctx.restore()
}

/* ── particle system ─────────────────────────────────────────────────────── */

function initParticles(W, H, count = 90) {
  return Array.from({ length: count }, () => ({
    x:     Math.random() * W,
    y:     Math.random() * H,
    r:     Math.random() * 2.2 + 0.5,
    speed: Math.random() * 0.6 + 0.2,
    alpha: Math.random() * 0.55 + 0.15,
    drift: (Math.random() - 0.5) * 0.35,
  }))
}

function drawParticles(ctx, W, H, particles) {
  particles.forEach(p => {
    ctx.beginPath()
    ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
    ctx.fillStyle = `rgba(206,17,38,${p.alpha})`
    ctx.shadowColor = RED
    ctx.shadowBlur  = p.r * 4
    ctx.fill()
    ctx.shadowBlur = 0

    p.y     -= p.speed
    p.x     += p.drift
    p.alpha -= 0.0008

    if (p.y < -10 || p.alpha <= 0) {
      p.x     = Math.random() * W
      p.y     = H + 5
      p.alpha = Math.random() * 0.55 + 0.15
    }
  })
}

/* ── component ───────────────────────────────────────────────────────────── */

export default function FootballBackground() {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas    = canvasRef.current
    if (!canvas) return
    const dpr       = window.devicePixelRatio || 1
    const container = canvas.parentElement

    let animId
    let particles = []
    let offscreen = null   // static layer

    function resize() {
      const W = container.clientWidth
      const H = container.clientHeight

      canvas.width  = W * dpr
      canvas.height = H * dpr
      canvas.style.width  = W + 'px'
      canvas.style.height = H + 'px'

      const ctx = canvas.getContext('2d')
      ctx.scale(dpr, dpr)

      // (re)draw static layer onto offscreen canvas
      offscreen        = document.createElement('canvas')
      offscreen.width  = W * dpr
      offscreen.height = H * dpr
      const octx       = offscreen.getContext('2d')
      octx.scale(dpr, dpr)
      drawStatic(octx, W, H)

      particles = initParticles(W, H)
    }

    function animate() {
      const W = container.clientWidth
      const H = container.clientHeight
      const ctx = canvas.getContext('2d')

      // blit static layer
      ctx.clearRect(0, 0, W, H)
      ctx.drawImage(offscreen, 0, 0)

      // animate particles on top
      drawParticles(ctx, W, H, particles)

      animId = requestAnimationFrame(animate)
    }

    resize()
    animate()

    const ro = new ResizeObserver(resize)
    ro.observe(container)

    return () => {
      cancelAnimationFrame(animId)
      ro.disconnect()
    }
  }, [])

  return (
    <div className="absolute inset-0 z-0">
      <canvas
        ref={canvasRef}
        style={{ width: '100%', height: '100%', display: 'block' }}
      />

      {/* edge vignette overlay */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse at center, transparent 30%, rgba(12,0,4,0.85) 100%)',
        }}
      />
    </div>
  )
}
