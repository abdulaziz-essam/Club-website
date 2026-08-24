import { useRef, useState, useEffect, Suspense, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { CHAPTERS } from '../data/chapters'
import stadiumImg from '../assets/stadium.png'

/* ─────────────────────────────────────────────────────────────────────────────
   CLUB BACKGROUND — real stadium photo + cinematic CSS layers + canvas FX
──────────────────────────────────────────────────────────────────────────────*/
function ShootingBackground() {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const dpr       = window.devicePixelRatio || 1
    const container = canvas.parentElement
    let animId, lastTS = null, t = 0

    // Seeded particle data (fixed so resize doesn't jump)
    const PARTS = Array.from({ length: 55 }, (_, i) => ({
      x:     (i * 0.618033) % 1,           // golden ratio x spread
      cycle: 5 + (i % 7) * 0.9,           // each particle has its own period
      phase: (i * 0.271) % 1,              // phase offset
      size:  0.9 + (i % 4) * 0.55,        // dot radius
      isRed: i % 5 === 0,                  // 1 in 5 are club red, rest warm gold
    }))

    // Camera flash positions in the stand area
    const FLASHES = Array.from({ length: 40 }, (_, i) => ({
      x:    0.04 + (i * 0.618033) % 0.92,
      y:    0.10 + (i * 0.381966) % 0.28,
      phase:(i * 0.271) % 1,
      dur:  0.055 + (i % 6) * 0.010,
    }))

    function resize() {
      const W = container.clientWidth
      const H = container.clientHeight
      canvas.width        = W * dpr
      canvas.height       = H * dpr
      canvas.style.width  = W + 'px'
      canvas.style.height = H + 'px'
    }

    function animate(ts) {
      if (lastTS === null) lastTS = ts
      t += Math.min((ts - lastTS) / 1000, 0.05)
      lastTS = ts

      const W   = container.clientWidth
      const H   = container.clientHeight
      const ctx = canvas.getContext('2d')
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      ctx.clearRect(0, 0, W, H)

      // ── 1. Floating light particles rising through the upper frame ────────
      PARTS.forEach(({ x, cycle, phase, size, isRed }) => {
        const life  = ((t * 0.38 + phase * cycle) % cycle) / cycle  // 0→1
        const px    = W * (x + Math.sin(life * Math.PI * 2 + x * 6) * 0.018)
        const py    = H * (0.72 - life * 0.68)   // rise from crowd level upward
        const alpha = life < 0.12
          ? (life / 0.12) * 0.6
          : life > 0.78
            ? ((1 - life) / 0.22) * 0.6
            : 0.6
        if (alpha < 0.01) return
        const col = isRed
          ? `rgba(206,17,38,${alpha * 0.7})`
          : `rgba(255,235,140,${alpha * 0.55})`
        ctx.beginPath()
        ctx.arc(px, py, size, 0, Math.PI * 2)
        ctx.fillStyle = col
        ctx.shadowColor = col
        ctx.shadowBlur  = size * 5
        ctx.fill()
        ctx.shadowBlur = 0
      })

      // ── 2. Camera flashes in the stands ──────────────────────────────────
      FLASHES.forEach(({ x, y, phase, dur }) => {
        const sub = (t * 0.45 + phase) % 1
        if (sub > dur) return
        const fa  = (1 - sub / dur) * 0.9
        const fx  = x * W, fy = y * H
        const g   = ctx.createRadialGradient(fx, fy, 0, fx, fy, 12)
        g.addColorStop(0,   `rgba(255,255,255,${fa})`)
        g.addColorStop(0.4, `rgba(200,215,255,${fa * 0.35})`)
        g.addColorStop(1,   'rgba(0,0,0,0)')
        ctx.fillStyle = g
        ctx.beginPath()
        ctx.arc(fx, fy, 12, 0, Math.PI * 2)
        ctx.fill()
      })

      // ── 3. Slow light sweep across the pitch (broadcast spotlight) ────────
      const sweepX = W * (0.25 + 0.5 * (0.5 + 0.5 * Math.sin(t * 0.18)))
      const sweep  = ctx.createRadialGradient(sweepX, H * 0.82, 0, sweepX, H * 0.82, W * 0.32)
      sweep.addColorStop(0,   `rgba(255,252,220,${0.045 + 0.018 * Math.sin(t * 0.35)})`)
      sweep.addColorStop(0.5, 'rgba(255,250,200,0.012)')
      sweep.addColorStop(1,   'rgba(0,0,0,0)')
      ctx.fillStyle = sweep
      ctx.fillRect(0, H * 0.60, W, H * 0.40)

      // ── 4. Subtle red vignette pulse (club identity beat) ────────────────
      const pulse = 0.28 + 0.06 * Math.sin(t * 0.55)
      const redVig = ctx.createRadialGradient(W * 0.5, H * 0.5, H * 0.15, W * 0.5, H * 0.5, H * 0.9)
      redVig.addColorStop(0,    'rgba(0,0,0,0)')
      redVig.addColorStop(0.55, `rgba(140,5,18,${pulse * 0.08})`)
      redVig.addColorStop(1,    `rgba(80,0,10,${pulse * 0.55})`)
      ctx.fillStyle = redVig
      ctx.fillRect(0, 0, W, H)

      animId = requestAnimationFrame(animate)
    }

    resize()
    animId = requestAnimationFrame(animate)
    const ro = new ResizeObserver(resize)
    ro.observe(container)
    return () => { cancelAnimationFrame(animId); ro.disconnect() }
  }, [])

  return (
    <div style={{ position: 'absolute', inset: 0, zIndex: 0, overflow: 'hidden' }}>

      {/* Layer 1 — real stadium photo, darkened and slightly zoomed */}
      <div style={{
        position: 'absolute', inset: '-4%',
        backgroundImage: `url(${stadiumImg})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center 40%',
        filter: 'brightness(0.38) saturate(0.7)',
        transform: 'scale(1.04)',
      }} />

      {/* Layer 2 — deep club color wash: dark navy → transparent center */}
      <div style={{
        position: 'absolute', inset: 0,
        background: 'radial-gradient(ellipse 120% 100% at 50% 110%, transparent 30%, rgba(8,6,20,0.72) 70%, rgba(4,3,12,0.92) 100%)',
      }} />

      {/* Layer 3 — red streak from top-left (broadcast light ray) */}
      <div style={{
        position: 'absolute', inset: 0,
        background: 'linear-gradient(135deg, rgba(206,17,38,0.18) 0%, rgba(206,17,38,0.04) 35%, transparent 60%)',
      }} />

      {/* Layer 4 — top dark gradient so header text always reads */}
      <div style={{
        position: 'absolute', inset: 0,
        background: 'linear-gradient(to bottom, rgba(4,3,12,0.82) 0%, rgba(4,3,12,0.25) 22%, transparent 45%)',
      }} />

      {/* Layer 5 — bottom darkness to merge into Three.js floor */}
      <div style={{
        position: 'absolute', inset: 0,
        background: 'linear-gradient(to top, rgba(4,3,12,0.95) 0%, rgba(4,3,12,0.4) 18%, transparent 40%)',
      }} />

      {/* Layer 6 — canvas for animated particles, flashes, sweep */}
      <canvas
        ref={canvasRef}
        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', display: 'block' }}
      />
    </div>
  )
}


const N       = CHAPTERS.length
const SPACING = 3.8

/* ─────────────────────────────────────────────────────────────────────────────
   ERA ILLUSTRATIONS — one unique scene drawn per chapter
──────────────────────────────────────────────────────────────────────────────*/

function drawEra0(c, W, H, col) {
  // The Founding — a patch of grass, a ball, 5 stick players, small crowd
  // sky gradient
  const sky = c.createLinearGradient(0, 0, 0, H)
  sky.addColorStop(0, '#dce8f5'); sky.addColorStop(1, '#a8c8e8')
  c.fillStyle = sky; c.fillRect(0, 0, W, H)

  // grass field
  const grass = c.createLinearGradient(0, H*0.55, 0, H)
  grass.addColorStop(0, '#4a8c3a'); grass.addColorStop(1, '#2d5e22')
  c.fillStyle = grass; c.fillRect(0, H*0.55, W, H*0.45)

  // grass stripes
  c.globalAlpha = 0.12
  for (let i = 0; i < 6; i++) {
    c.fillStyle = i%2===0 ? '#000' : '#fff'
    c.fillRect(i * W/6, H*0.55, W/6, H*0.45)
  }
  c.globalAlpha = 1

  // horizon line
  c.strokeStyle = '#2d5e22'; c.lineWidth = 2
  c.beginPath(); c.moveTo(0, H*0.55); c.lineTo(W, H*0.55); c.stroke()

  // sun
  c.fillStyle = '#f8d448'
  c.beginPath(); c.arc(W*0.82, H*0.14, 38, 0, Math.PI*2); c.fill()
  c.globalAlpha = 0.25; c.fillStyle = '#f8d448'
  c.beginPath(); c.arc(W*0.82, H*0.14, 58, 0, Math.PI*2); c.fill()
  c.globalAlpha = 1

  // small crowd silhouette
  c.fillStyle = '#1a1a2e'
  for (let i = 0; i < 28; i++) {
    const cx = W*0.05 + i*(W*0.9/27), cy = H*0.50
    c.beginPath(); c.arc(cx, cy-10, 7, 0, Math.PI*2); c.fill()
    c.fillRect(cx-4, cy-4, 8, 14)
  }

  // football on grass
  const bx = W*0.5, by = H*0.72, br = 28
  c.fillStyle = '#fff'; c.beginPath(); c.arc(bx, by, br, 0, Math.PI*2); c.fill()
  c.strokeStyle = '#222'; c.lineWidth = 1.5
  c.beginPath(); c.arc(bx, by, br, 0, Math.PI*2); c.stroke()
  // pentagon patches
  c.fillStyle = '#111'
  const pts = [[0,-1],[0.95,-0.31],[0.59,0.81],[-0.59,0.81],[-0.95,-0.31]]
  pts.forEach(([px,py]) => {
    c.beginPath(); c.arc(bx+px*br*0.6, by+py*br*0.6, 6, 0, Math.PI*2); c.fill()
  })

  // 5 player silhouettes
  const positions = [0.18, 0.32, 0.50, 0.68, 0.82]
  positions.forEach((x, i) => {
    const px = W*x, py = H*0.60
    c.fillStyle = i===0 ? col : '#fff'
    c.strokeStyle = col; c.lineWidth = 2
    // body
    c.beginPath(); c.arc(px, py-22, 10, 0, Math.PI*2)
    c.fill(); c.stroke()
    c.fillRect(px-7, py-12, 14, 22)
    // legs
    c.beginPath(); c.moveTo(px-5, py+10); c.lineTo(px-8, py+28)
    c.moveTo(px+5, py+10); c.lineTo(px+8, py+28)
    c.strokeStyle = '#333'; c.lineWidth = 3; c.stroke()
  })

  // club name on banner
  c.fillStyle = col; c.fillRect(W*0.1, H*0.08, W*0.8, 36)
  c.fillStyle = '#fff'; c.font = 'bold 20px Arial,sans-serif'
  c.textAlign = 'center'; c.textBaseline = 'middle'
  c.fillText('VORTEX FC — FOUNDED 1994', W/2, H*0.08+18)
}

function drawEra1(c, W, H, col) {
  // First League Title — trophy, confetti, celebration
  const bg = c.createLinearGradient(0, 0, 0, H)
  bg.addColorStop(0, '#1a0a02'); bg.addColorStop(1, '#3d1a04')
  c.fillStyle = bg; c.fillRect(0, 0, W, H)

  // spotlights
  ;[[W*0.3, col+'33'], [W*0.7, '#ffffff22']].forEach(([x, clr]) => {
    const sg = c.createRadialGradient(x, 0, 0, x, 0, H*0.9)
    sg.addColorStop(0, clr); sg.addColorStop(1, 'transparent')
    c.fillStyle = sg; c.fillRect(0, 0, W, H)
  })

  // confetti
  const colors = [col, '#f8d448', '#fff', '#ff6688', col+'aa']
  for (let i = 0; i < 80; i++) {
    c.fillStyle = colors[i%colors.length]
    c.globalAlpha = 0.7 + Math.random()*0.3
    c.save()
    c.translate(Math.random()*W, Math.random()*H*0.85)
    c.rotate(Math.random()*Math.PI*2)
    c.fillRect(-4, -8, 8, 16)
    c.restore()
  }
  c.globalAlpha = 1

  // trophy body
  const tx = W/2, ty = H*0.52
  // base
  c.fillStyle = '#c49a20'
  c.fillRect(tx-40, ty+60, 80, 18)
  c.fillRect(tx-28, ty+48, 56, 16)
  // cup
  const tg = c.createLinearGradient(tx-50, 0, tx+50, 0)
  tg.addColorStop(0, '#8B6010'); tg.addColorStop(0.3, '#f0c840')
  tg.addColorStop(0.7, '#f8e060'); tg.addColorStop(1, '#a07018')
  c.fillStyle = tg
  c.beginPath()
  c.moveTo(tx-48, ty-60); c.lineTo(tx+48, ty-60)
  c.lineTo(tx+32, ty+48); c.lineTo(tx-32, ty+48)
  c.closePath(); c.fill()
  // handles
  c.strokeStyle = '#c49a20'; c.lineWidth = 10; c.lineCap = 'round'
  c.beginPath(); c.arc(tx-48, ty-20, 22, Math.PI*0.5, Math.PI*1.5); c.stroke()
  c.beginPath(); c.arc(tx+48, ty-20, 22, -Math.PI*0.5, Math.PI*0.5); c.stroke()
  // star on top
  c.fillStyle = '#f8e060'
  c.font = '40px Arial'; c.textAlign='center'; c.textBaseline='middle'
  c.fillText('★', tx, ty-82)

  // glow behind trophy
  const trophyGlow = c.createRadialGradient(tx, ty, 20, tx, ty, 160)
  trophyGlow.addColorStop(0, col+'66'); trophyGlow.addColorStop(1, 'transparent')
  c.fillStyle = trophyGlow; c.fillRect(0, 0, W, H)

  // CHAMPIONS text
  c.fillStyle = col
  c.shadowColor = col; c.shadowBlur = 20
  c.font = 'bold 36px "Arial Black",Arial,sans-serif'
  c.fillText('CHAMPIONS!', W/2, H*0.10)
  c.shadowBlur = 0
}

function drawEra2(c, W, H, col) {
  // European Debut — stadium at night, European stars/flags
  const sky = c.createLinearGradient(0, 0, 0, H)
  sky.addColorStop(0, '#050818'); sky.addColorStop(1, '#0d1535')
  c.fillStyle = sky; c.fillRect(0, 0, W, H)

  // stars in sky
  c.fillStyle = '#fff'
  for (let i = 0; i < 60; i++) {
    c.globalAlpha = 0.3 + Math.random()*0.7
    c.beginPath()
    c.arc(Math.random()*W, Math.random()*H*0.5, Math.random()*1.5+0.5, 0, Math.PI*2)
    c.fill()
  }
  c.globalAlpha = 1

  // stadium lights
  ;[W*0.15, W*0.85].forEach(lx => {
    const lg = c.createRadialGradient(lx, H*0.28, 0, lx, H*0.28, W*0.55)
    lg.addColorStop(0, 'rgba(255,240,180,0.45)'); lg.addColorStop(1, 'transparent')
    c.fillStyle = lg; c.fillRect(0, 0, W, H)
    // light post
    c.fillStyle = '#555'; c.fillRect(lx-4, H*0.28, 8, H*0.35)
    c.fillStyle = '#fffacc'; c.fillRect(lx-16, H*0.26, 32, 10)
  })

  // stadium stands silhouette
  c.fillStyle = '#0d1535'
  c.beginPath()
  c.moveTo(0, H*0.55)
  c.lineTo(0, H*0.38)
  c.quadraticCurveTo(W*0.25, H*0.30, W*0.5, H*0.28)
  c.quadraticCurveTo(W*0.75, H*0.30, W, H*0.38)
  c.lineTo(W, H*0.55)
  c.closePath(); c.fill()

  // crowd lights (phones)
  for (let i = 0; i < 120; i++) {
    const cx = Math.random()*W, cy = H*0.32 + Math.random()*H*0.18
    c.fillStyle = `hsl(${Math.random()*60+180},80%,70%)`
    c.globalAlpha = 0.6
    c.beginPath(); c.arc(cx, cy, 1.5, 0, Math.PI*2); c.fill()
  }
  c.globalAlpha = 1

  // pitch
  const pitch = c.createLinearGradient(0, H*0.55, 0, H)
  pitch.addColorStop(0, '#2d6e22'); pitch.addColorStop(1, '#1a4414')
  c.fillStyle = pitch; c.fillRect(0, H*0.55, W, H*0.45)

  // pitch markings
  c.strokeStyle = 'rgba(255,255,255,0.35)'; c.lineWidth = 2
  c.beginPath(); c.moveTo(W/2, H*0.55); c.lineTo(W/2, H); c.stroke()
  c.beginPath(); c.ellipse(W/2, H*0.70, 55, 28, 0, 0, Math.PI*2); c.stroke()

  // UEFA stars header
  c.fillStyle = '#f8d448'
  c.font = '22px Arial'; c.textAlign='center'; c.textBaseline='middle'
  c.fillText('★ ★ ★ UEFA CUP ★ ★ ★', W/2, H*0.08)
  c.fillStyle = col
  c.font = 'bold 26px "Arial Black",Arial,sans-serif'
  c.fillText('EUROPEAN DEBUT', W/2, H*0.16)
}

function drawEra3(c, W, H, col) {
  // The Dark Years — rain, empty stadium, lone figure
  const sky = c.createLinearGradient(0, 0, 0, H)
  sky.addColorStop(0, '#1a1a22'); sky.addColorStop(1, '#2d2d35')
  c.fillStyle = sky; c.fillRect(0, 0, W, H)

  // rain streaks
  c.strokeStyle = 'rgba(180,200,255,0.22)'; c.lineWidth = 1
  for (let i = 0; i < 80; i++) {
    const rx = Math.random()*W, ry = Math.random()*H
    c.beginPath(); c.moveTo(rx, ry); c.lineTo(rx-6, ry+22); c.stroke()
  }

  // empty stadium silhouette
  c.fillStyle = '#111118'
  c.beginPath()
  c.moveTo(0, H*0.65); c.lineTo(0, H*0.35)
  c.lineTo(W*0.12, H*0.25); c.lineTo(W*0.88, H*0.25)
  c.lineTo(W, H*0.35); c.lineTo(W, H*0.65)
  c.closePath(); c.fill()

  // dark puddle on ground
  c.fillStyle = '#15151d'
  c.fillRect(0, H*0.65, W, H*0.35)
  const puddle = c.createRadialGradient(W*0.5, H*0.78, 0, W*0.5, H*0.78, W*0.35)
  puddle.addColorStop(0, 'rgba(100,110,160,0.25)'); puddle.addColorStop(1, 'transparent')
  c.fillStyle = puddle; c.fillRect(0, H*0.65, W, H*0.35)

  // lone player silhouette
  const px = W*0.5, py = H*0.60
  c.fillStyle = '#fff'
  c.globalAlpha = 0.6
  c.beginPath(); c.arc(px, py-24, 11, 0, Math.PI*2); c.fill()
  c.fillRect(px-8, py-13, 16, 28)
  c.beginPath(); c.moveTo(px-5,py+15); c.lineTo(px-9,py+34)
  c.moveTo(px+5,py+15); c.lineTo(px+9,py+34); c.stroke()
  c.globalAlpha = 1

  // reflection in puddle
  c.globalAlpha = 0.18
  c.save(); c.scale(1,-1); c.translate(0,-H*1.38)
  c.fillStyle = '#fff'
  c.beginPath(); c.arc(px, py-24, 11, 0, Math.PI*2); c.fill()
  c.fillRect(px-8, py-13, 16, 28)
  c.restore(); c.globalAlpha = 1

  // mood text
  c.fillStyle = 'rgba(255,255,255,0.5)'
  c.font = 'bold 28px "Arial Black",Arial,sans-serif'
  c.textAlign='center'; c.textBaseline='middle'
  c.fillText('DARK TIMES', W/2, H*0.12)
  c.font = 'italic 18px Arial,sans-serif'
  c.fillStyle = col; c.globalAlpha=0.7
  c.fillText('"We never gave up"', W/2, H*0.19)
  c.globalAlpha=1
}

function drawEra4(c, W, H, col) {
  // Dynasty Begins — crowns, trophies shelf, golden light
  const bg = c.createLinearGradient(0, 0, 0, H)
  bg.addColorStop(0, '#0a0500'); bg.addColorStop(0.6, '#1e0e00'); bg.addColorStop(1, '#2a1400')
  c.fillStyle = bg; c.fillRect(0, 0, W, H)

  // golden glow from below
  const glowB = c.createRadialGradient(W/2, H, 0, W/2, H, W)
  glowB.addColorStop(0, col+'55'); glowB.addColorStop(1, 'transparent')
  c.fillStyle = glowB; c.fillRect(0, 0, W, H)

  // trophy shelf
  c.fillStyle = '#3d1a04'; c.fillRect(W*0.05, H*0.65, W*0.9, 12)
  c.fillStyle = '#2a1000'; c.fillRect(W*0.05, H*0.66, W*0.9, 6)

  // 5 small trophies on shelf
  const tcolors = [col, '#f8e060', col, '#f8e060', col]
  for (let i = 0; i < 5; i++) {
    const tx = W*0.13 + i*(W*0.18), ty = H*0.65
    const tc = tcolors[i]
    const tg2 = c.createLinearGradient(tx-18,0,tx+18,0)
    tg2.addColorStop(0,'#8B6010'); tg2.addColorStop(0.5,'#f0c840'); tg2.addColorStop(1,'#8B6010')
    c.fillStyle = tg2
    // cup
    c.beginPath()
    c.moveTo(tx-18,ty-52); c.lineTo(tx+18,ty-52)
    c.lineTo(tx+12,ty-8);  c.lineTo(tx-12,ty-8)
    c.closePath(); c.fill()
    // handles
    c.strokeStyle = tc; c.lineWidth = 4; c.lineCap='round'
    c.beginPath(); c.arc(tx-18,ty-32,8,Math.PI*0.5,Math.PI*1.5); c.stroke()
    c.beginPath(); c.arc(tx+18,ty-32,8,-Math.PI*0.5,Math.PI*0.5); c.stroke()
    // star
    c.fillStyle='#f8e060'; c.font='16px Arial'
    c.textAlign='center'; c.textBaseline='middle'
    c.fillText('★',tx,ty-62)
    // base
    c.fillStyle=tc; c.fillRect(tx-14,ty-10,28,8); c.fillRect(tx-10,ty-3,20,5)
  }

  // large crown above
  c.fillStyle = '#f8d448'
  c.shadowColor = '#f8d448'; c.shadowBlur = 30
  c.font = '90px Arial'; c.textAlign='center'; c.textBaseline='middle'
  c.fillText('👑', W/2, H*0.28)
  c.shadowBlur = 0

  // "DYNASTY" text
  c.fillStyle = col
  c.shadowColor = col; c.shadowBlur = 18
  c.font = 'bold 40px "Arial Black",Arial,sans-serif'
  c.fillText('DYNASTY', W/2, H*0.10)
  c.shadowBlur = 0
  c.fillStyle = '#f8d448'; c.font = '18px Arial'
  c.fillText('5 TITLES IN 6 YEARS', W/2, H*0.17)
}

function drawEra5(c, W, H, col) {
  // A New Era — modern stadium exterior, rocket launch, future skyline
  const sky = c.createLinearGradient(0, 0, 0, H)
  sky.addColorStop(0, '#050c1a'); sky.addColorStop(0.5, '#0d1e3a'); sky.addColorStop(1, '#1a0a08')
  c.fillStyle = sky; c.fillRect(0, 0, W, H)

  // city skyline silhouette
  c.fillStyle = '#0d1225'
  const buildings = [
    [0,0.55,0.08,0.45],[0.06,0.50,0.07,0.50],[0.12,0.42,0.06,0.58],
    [0.17,0.38,0.09,0.62],[0.25,0.45,0.08,0.55],[0.32,0.35,0.12,0.65],
    [0.42,0.40,0.08,0.60],[0.60,0.32,0.14,0.68],[0.73,0.38,0.08,0.62],
    [0.80,0.44,0.10,0.56],[0.89,0.48,0.11,0.52],
  ]
  buildings.forEach(([bx,by,bw,bh]) => c.fillRect(W*bx,H*by,W*bw,H*bh))

  // building windows
  c.fillStyle = '#f8d44866'
  buildings.forEach(([bx,by,bw]) => {
    for (let wy=0;wy<6;wy++) for (let wx=0;wx<3;wx++) {
      if (Math.random()>0.4) c.fillRect(W*bx+wx*W*bw/3+2,H*by+wy*14+4,W*bw/3-4,8)
    }
  })

  // stadium (large curved structure)
  c.fillStyle = '#1a1a2e'
  c.beginPath()
  c.ellipse(W*0.5, H*0.72, W*0.42, H*0.22, 0, Math.PI, 0)
  c.fill()
  c.strokeStyle = col; c.lineWidth = 3
  c.beginPath()
  c.ellipse(W*0.5, H*0.72, W*0.42, H*0.22, 0, Math.PI, 0)
  c.stroke()

  // stadium lights
  ;[W*0.12, W*0.88].forEach(lx => {
    const lg = c.createRadialGradient(lx, H*0.52, 0, lx, H*0.52, 80)
    lg.addColorStop(0,'rgba(255,240,180,0.6)'); lg.addColorStop(1,'transparent')
    c.fillStyle=lg; c.fillRect(0,0,W,H)
    c.fillStyle='#888'; c.fillRect(lx-3,H*0.52,6,H*0.22)
  })

  // rocket trail
  const rx = W*0.78, ry = H*0.10
  c.strokeStyle = '#ff6644'; c.lineWidth = 3
  c.beginPath(); c.moveTo(rx, ry+60); c.lineTo(rx-8, ry+130); c.stroke()
  c.strokeStyle = '#ffaa44'; c.lineWidth = 2
  c.beginPath(); c.moveTo(rx, ry+60); c.lineTo(rx+6, ry+140); c.stroke()
  c.font = '32px Arial'; c.textAlign='center'; c.textBaseline='middle'
  c.fillText('🚀', rx, ry)

  // "87K" stadium capacity
  c.fillStyle = col
  c.shadowColor = col; c.shadowBlur = 16
  c.font = 'bold 52px "Arial Black",Arial,sans-serif'
  c.textAlign='center'; c.textBaseline='middle'
  c.fillText('87,000', W/2, H*0.82)
  c.shadowBlur = 0
  c.fillStyle = 'rgba(255,255,255,0.6)'
  c.font = '18px Arial'
  c.fillText('SEATS · NEW VORTEX ARENA', W/2, H*0.89)

  c.fillStyle = col
  c.shadowColor = col; c.shadowBlur = 14
  c.font = 'bold 30px "Arial Black",Arial,sans-serif'
  c.fillText('A NEW ERA', W/2, H*0.08)
  c.shadowBlur = 0
}

const ERA_DRAWERS = [drawEra0, drawEra1, drawEra2, drawEra3, drawEra4, drawEra5]

/* ─────────────────────────────────────────────────────────────────────────────
   CARD TEXTURE — illustration top + info bottom
──────────────────────────────────────────────────────────────────────────────*/
function buildTexture(ch, idx) {
  const W = 560, H = 900
  const cv = document.createElement('canvas')
  cv.width = W; cv.height = H
  const c = cv.getContext('2d')

  const illusH = H * 0.54  // top 54% = illustration

  // ── draw era illustration into top section ────────────────────────────────
  c.save()
  c.beginPath(); c.rect(0, 0, W, illusH); c.clip()
  ERA_DRAWERS[idx % ERA_DRAWERS.length](c, W, illusH, ch.color)
  c.restore()

  // ── gradient fade illustration → info ─────────────────────────────────────
  const fade = c.createLinearGradient(0, illusH * 0.70, 0, illusH)
  fade.addColorStop(0, 'rgba(245,243,240,0)')
  fade.addColorStop(1, 'rgba(245,243,240,1)')
  c.fillStyle = fade; c.fillRect(0, illusH * 0.70, W, illusH * 0.30)

  // ── info panel — clean white ───────────────────────────────────────────────
  c.fillStyle = '#f5f3f0'
  c.fillRect(0, illusH, W, H - illusH)

  // colour accent stripe
  c.fillStyle = ch.color
  c.fillRect(0, illusH, W, 4)

  c.textAlign = 'center'; c.textBaseline = 'middle'

  // YEAR
  c.font = 'bold 100px "Arial Black",Arial,sans-serif'
  c.fillStyle = ch.color
  c.fillText(ch.year, W / 2, H * 0.628)

  // ERA NAME
  c.font = 'bold 30px "Arial Black",Arial,sans-serif'
  c.fillStyle = '#000000'
  c.fillText(ch.era.toUpperCase(), W / 2, H * 0.700)

  // divider
  c.strokeStyle = 'rgba(0,0,0,0.20)'; c.lineWidth = 2
  c.beginPath(); c.moveTo(W*0.1, H*0.724); c.lineTo(W*0.9, H*0.724); c.stroke()

  // player + role
  c.font = 'bold 26px "Arial Black",Arial,sans-serif'
  c.fillStyle = '#000000'
  c.fillText(ch.player, W / 2, H * 0.752)

  c.font = 'bold 22px Arial,sans-serif'
  c.fillStyle = ch.color; c.globalAlpha = 1
  c.fillText(ch.role, W / 2, H * 0.778)
  c.globalAlpha = 1

  // description (word-wrap)
  c.font = '19px Arial,sans-serif'
  c.fillStyle = 'rgba(0,0,0,0.80)'
  const maxW = W * 0.84, lineH = 28
  const words = ch.text.split(' ')
  let line = '', lines = []
  for (const w of words) {
    const test = line ? line + ' ' + w : w
    if (c.measureText(test).width > maxW && line) { lines.push(line); line = w }
    else line = test
  }
  if (line) lines.push(line)
  const descY = H * 0.808
  lines.slice(0, 4).forEach((l, i) => c.fillText(l, W / 2, descY + i * lineH))

  // stat pill
  c.font = 'bold 18px Arial,sans-serif'
  const sw = c.measureText(ch.stat).width + 32
  const pillX = (W - sw) / 2, pillY = H * 0.932
  c.fillStyle = ch.color + '28'
  c.strokeStyle = ch.color; c.lineWidth = 2
  c.beginPath(); c.roundRect(pillX, pillY - 16, sw, 32, 16); c.fill(); c.stroke()
  c.fillStyle = ch.color
  c.fillText(ch.stat, W / 2, pillY)

  const tex = new THREE.CanvasTexture(cv)
  tex.needsUpdate = true
  return tex
}

/* ─────────────────────────────────────────────────────────────────────────────
   CARD MESH  — flat rectangle with thin white frame + floor reflection
──────────────────────────────────────────────────────────────────────────────*/
const CW = 2.9, CH = 4.65   // card width / height — portrait ratio

function Card({ chapter, index, isCurrent, onSelect }) {
  const groupRef = useRef()
  const reflRef  = useRef()
  const texture  = useMemo(() => buildTexture(chapter, index), [chapter])

  // thin white border geometry
  const borderGeo = useMemo(() => {
    const bw = CW + 0.055, bh = CH + 0.055
    const outer = new THREE.Shape()
    outer.moveTo(-bw/2,-bh/2); outer.lineTo(bw/2,-bh/2)
    outer.lineTo(bw/2, bh/2); outer.lineTo(-bw/2, bh/2)
    outer.closePath()
    const inner = new THREE.Path()
    inner.moveTo(-CW/2,-CH/2); inner.lineTo(CW/2,-CH/2)
    inner.lineTo(CW/2, CH/2); inner.lineTo(-CW/2, CH/2)
    inner.closePath()
    outer.holes.push(inner)
    return new THREE.ShapeGeometry(outer, 1)
  }, [])

  useFrame(({ clock }) => {
    if (!groupRef.current) return
    const t = clock.elapsedTime

    // gentle float
    groupRef.current.position.y = Math.sin(t * 0.36 + index * 1.2) * 0.04

    // non-current tilt outward
    const tRY = isCurrent ? 0 : (index < N / 2 ? 0.26 : -0.26)
    groupRef.current.rotation.y += (tRY - groupRef.current.rotation.y) * 0.055

    // scale
    const s = isCurrent ? 1.0 : 0.72
    groupRef.current.scale.x += (s - groupRef.current.scale.x) * 0.06
    groupRef.current.scale.y += (s - groupRef.current.scale.y) * 0.06

    // reflection fade
    if (reflRef.current) {
      const o = isCurrent ? 0.28 : 0.10
      reflRef.current.material.opacity += (o - reflRef.current.material.opacity) * 0.05
    }
  })

  return (
    <group position={[index * SPACING, 0, 0]}>
      <group ref={groupRef}>

        {/* card face — clickable */}
        <mesh onClick={() => !isCurrent && onSelect(index)}>
          <planeGeometry args={[CW, CH]} />
          <meshStandardMaterial
            map={texture}
            roughness={0.08}
            metalness={0.05}
          />
        </mesh>

        {/* thin white frame — also clickable */}
        <mesh position={[0, 0, -0.002]} onClick={() => !isCurrent && onSelect(index)}>
          <primitive object={borderGeo} />
          <meshStandardMaterial color="#ffffff" roughness={0.1} metalness={0.0} />
        </mesh>

        {/* floor reflection */}
        <mesh ref={reflRef} position={[0, -CH / 2 - CH * 0.25, 0]} rotation={[Math.PI, 0, 0]}>
          <planeGeometry args={[CW, CH * 0.5]} />
          <meshStandardMaterial map={texture} transparent opacity={0.14} roughness={1} metalness={0} />
        </mesh>
        {/* reflection fade */}
        <mesh position={[0, -CH / 2 - CH * 0.25, 0.001]}>
          <planeGeometry args={[CW, CH * 0.5]} />
          <meshBasicMaterial color="#04060f" transparent opacity={0.70} depthWrite={false} />
        </mesh>

      </group>
    </group>
  )
}

/* ─────────────────────────────────────────────────────────────────────────────
   SCENE
──────────────────────────────────────────────────────────────────────────────*/
function Floor() {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[(N - 1) * SPACING / 2, -CH / 2 - 0.01, 0]}>
      <planeGeometry args={[N * SPACING + 16, 22]} />
      <meshStandardMaterial color="#0a0810" roughness={0.15} metalness={0.88} />
    </mesh>
  )
}

function Particles() {
  const ref = useRef()
  const { geo, sp } = useMemo(() => {
    const C = 180, pos = new Float32Array(C * 3), sp = new Float32Array(C)
    for (let i = 0; i < C; i++) {
      pos[i*3]   = (Math.random() - 0.5) * N * SPACING * 2.2
      pos[i*3+1] = (Math.random() - 0.5) * 10
      pos[i*3+2] = (Math.random() - 0.5) * 6
      sp[i]      = Math.random() * 0.001 + 0.0003
    }
    const g = new THREE.BufferGeometry()
    g.setAttribute('position', new THREE.BufferAttribute(pos, 3))
    return { geo: g, sp }
  }, [])
  useFrame(() => {
    if (!ref.current) return
    const p = ref.current.geometry.attributes.position
    for (let i = 0; i < p.count; i++) {
      p.array[i*3+1] += sp[i]
      if (p.array[i*3+1] > 5) p.array[i*3+1] = -5
    }
    p.needsUpdate = true
  })
  return (
    <points ref={ref} geometry={geo}>
      <pointsMaterial color="#CE1126" size={0.006} transparent opacity={0.18} sizeAttenuation />
    </points>
  )
}

function CameraRig({ current }) {
  const { camera } = useThree()
  const tx       = current * SPACING
  const introRef = useRef(true)   // true while intro pull-in is running
  const tRef     = useRef(0)      // elapsed time for intro

  // Set camera far back on first render
  useMemo(() => {
    camera.position.set(0, 1.8, 14)
  }, [])

  useFrame((_, delta) => {
    if (introRef.current) {
      tRef.current += delta
      // slow ease-in over ~3.5 seconds — exponential deceleration
      const progress = Math.min(tRef.current / 3.5, 1)
      const ease = 1 - Math.pow(1 - progress, 3)   // cubic ease-out

      const startZ = 12, targetZ = 3.2
      const startY = 1.6, targetY = 0.05

      camera.position.z = startZ + (targetZ - startZ) * ease
      camera.position.y = startY + (targetY - startY) * ease
      camera.position.x += (tx - camera.position.x) * 0.04

      if (progress >= 1) introRef.current = false
    } else {
      // normal navigation lerp
      camera.position.x += (tx   - camera.position.x) * 0.028
      camera.position.y += (0.05 - camera.position.y) * 0.028
      camera.position.z += (3.2  - camera.position.z) * 0.028
    }
    camera.lookAt(camera.position.x, 0.05, 0)
  })
  return null
}

function Scene({ current, onSelect }) {
  return (
    <>
      <fog attach="fog" args={['#04060f', 22, 60]} />

      <ambientLight intensity={0.55} />
      <directionalLight position={[0, 8, 6]}   intensity={1.4} color="#ffffff" />
      <directionalLight position={[-4, 5, 3]}  intensity={0.5} color="#fff0f0" />
      <directionalLight position={[ 4, 5, 3]}  intensity={0.5} color="#fff0f0" />
      <pointLight position={[0, -2, 5]} intensity={0.5} color="#CE1126" distance={12} />

      <CameraRig current={current} />
      <Floor />
      <Particles />

      {CHAPTERS.map((ch, i) => (
        <Card key={i} chapter={ch} index={i} isCurrent={i === current} onSelect={onSelect} />
      ))}
    </>
  )
}

/* ─────────────────────────────────────────────────────────────────────────────
   DOTS
──────────────────────────────────────────────────────────────────────────────*/
function Dots({ current, onGo }) {
  return (
    <div style={{ display: 'flex', gap: 7, alignItems: 'center' }}>
      {CHAPTERS.map((ch, i) => (
        <button key={i} onClick={() => onGo(i)} style={{
          width: i === current ? 28 : 7, height: 7, borderRadius: 4,
          background: i === current ? ch.color : 'rgba(255,255,255,0.22)',
          border: 'none', cursor: 'pointer', padding: 0,
          transition: 'all 0.5s cubic-bezier(0.22,1,0.36,1)',
          boxShadow: i === current ? `0 0 12px ${ch.color}` : 'none',
        }} />
      ))}
    </div>
  )
}

/* ─────────────────────────────────────────────────────────────────────────────
   PAGE
──────────────────────────────────────────────────────────────────────────────*/
export default function HistoryPage() {
  const navigate  = useNavigate()
  const [current, setCurrent] = useState(0)
  const movingRef = useRef(false)
  const touchRef  = useRef(null)

  const goTo = (idx) => {
    if (movingRef.current) return
    const next    = typeof idx === 'function' ? idx(current) : idx
    const clamped = Math.max(0, Math.min(N - 1, next))
    if (clamped === current) return
    movingRef.current = true
    setCurrent(clamped)
    setTimeout(() => { movingRef.current = false }, 900)
  }

  useEffect(() => {
    const h = (e) => {
      if (e.key === 'ArrowRight') goTo(i => i + 1)
      if (e.key === 'ArrowLeft')  goTo(i => i - 1)
    }
    window.addEventListener('keydown', h)
    return () => window.removeEventListener('keydown', h)
  }, [current])

  const ch = CHAPTERS[current]

  return (
    <div
      style={{ position: 'fixed', inset: 0, zIndex: 300, background: '#04060f' }}
      onTouchStart={e => { touchRef.current = e.touches[0].clientX }}
      onTouchEnd={e => {
        if (touchRef.current === null) return
        const d = touchRef.current - e.changedTouches[0].clientX
        if (Math.abs(d) > 48) goTo(i => d > 0 ? i + 1 : i - 1)
        touchRef.current = null
      }}
    >
      {/* animated shooting scene behind everything */}
      <ShootingBackground />

      <Canvas
        camera={{ position: [0, 0.05, 3.2], fov: 72, near: 0.01, far: 80 }}
        gl={{ antialias: true, toneMapping: THREE.ACESFilmicToneMapping, toneMappingExposure: 1.0, alpha: true }}
        style={{ position: 'absolute', inset: 0, zIndex: 1 }}
      >
        <Suspense fallback={null}>
          <Scene current={current} onSelect={goTo} />
        </Suspense>
      </Canvas>

      {/* header */}
      <div style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 20,
        display: 'flex', flexDirection: 'column', alignItems: 'center',
        paddingTop: 22, paddingBottom: 28, pointerEvents: 'none',
        background: 'linear-gradient(to bottom, rgba(24,22,26,0.95) 0%, transparent 100%)',
      }}>
        <p style={{
          fontFamily: "'DM Sans', sans-serif", fontSize: 9, letterSpacing: '0.55em',
          textTransform: 'uppercase', color: 'rgba(206,17,38,0.70)', margin: 0,
        }}>Vortex FC · Est. 1994</p>
        <h1 style={{
          fontFamily: "'Russo One', sans-serif",
          fontSize: 'clamp(18px,2.5vw,34px)',
          color: '#ffffff', letterSpacing: '0.18em',
          margin: '4px 0 0', textShadow: '0 0 28px rgba(206,17,38,0.40)',
        }}>HALL OF HISTORY</h1>
        <div style={{
          width: 64, height: 1, marginTop: 7,
          background: 'linear-gradient(90deg, transparent, #CE1126, transparent)',
        }} />
      </div>

      {/* nav arrows */}
      {[
        { side: 'left',  label: '‹', disabled: current === 0,     action: () => goTo(i => i - 1) },
        { side: 'right', label: '›', disabled: current === N - 1, action: () => goTo(i => i + 1) },
      ].map(({ side, label, disabled, action }) => (
        <button key={side} onClick={action} disabled={disabled} style={{
          position: 'fixed', top: '50%', [side]: 22,
          transform: 'translateY(-50%)',
          zIndex: 25, width: 46, height: 46, borderRadius: '50%',
          background: disabled ? 'rgba(255,255,255,0.03)' : 'rgba(255,255,255,0.08)',
          border: `1px solid ${disabled ? 'rgba(255,255,255,0.06)' : 'rgba(255,255,255,0.25)'}`,
          color: disabled ? 'rgba(255,255,255,0.10)' : 'rgba(255,255,255,0.85)',
          fontSize: 22, cursor: disabled ? 'default' : 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          backdropFilter: 'blur(10px)', transition: 'all 0.22s ease',
        }}
          onMouseEnter={e => { if (!disabled) e.currentTarget.style.background = 'rgba(255,255,255,0.15)' }}
          onMouseLeave={e => { e.currentTarget.style.background = disabled ? 'rgba(255,255,255,0.03)' : 'rgba(255,255,255,0.08)' }}
        >{label}</button>
      ))}

      {/* bottom bar */}
      <div style={{
        position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 20,
        display: 'flex', flexDirection: 'column', alignItems: 'center',
        paddingBottom: 22, paddingTop: 32, gap: 9, pointerEvents: 'none',
        background: 'linear-gradient(to top, rgba(24,22,26,0.92) 0%, transparent 100%)',
      }}>
        <div key={current} style={{
          fontFamily: "'Russo One', sans-serif", fontSize: 10,
          letterSpacing: '0.24em', textTransform: 'uppercase',
          color: ch.color, textShadow: `0 0 14px ${ch.color}88`,
          animation: 'fadeUp 0.4s ease',
        }}>{ch.year} — {ch.era}</div>
        <div style={{ pointerEvents: 'auto' }}>
          <Dots current={current} onGo={goTo} />
        </div>
        <div style={{
          fontSize: 9, letterSpacing: '0.4em', textTransform: 'uppercase',
          color: 'rgba(255,255,255,0.18)', fontFamily: "'DM Sans', sans-serif",
        }}>swipe · ← → keys · or click dots</div>
      </div>

      {/* back */}
      <button onClick={() => navigate('/')} style={{
        position: 'fixed', top: 18, left: 18, zIndex: 40,
        padding: '7px 16px',
        fontFamily: "'DM Sans', sans-serif", fontSize: 9,
        letterSpacing: '0.3em', textTransform: 'uppercase',
        color: 'rgba(255,255,255,0.40)',
        border: '1px solid rgba(255,255,255,0.12)', borderRadius: 3,
        background: 'rgba(24,22,26,0.65)', backdropFilter: 'blur(14px)',
        cursor: 'pointer', transition: 'color 0.2s, border-color 0.2s',
      }}
        onMouseEnter={e => {
          e.currentTarget.style.color = '#fff'
          e.currentTarget.style.borderColor = 'rgba(206,17,38,0.55)'
        }}
        onMouseLeave={e => {
          e.currentTarget.style.color = 'rgba(255,255,255,0.40)'
          e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)'
        }}
      >← Back</button>

      <style>{`
        @keyframes fadeUp {
          from { opacity:0; transform:translateY(6px); }
          to   { opacity:1; transform:translateY(0); }
        }
      `}</style>
    </div>
  )
}
