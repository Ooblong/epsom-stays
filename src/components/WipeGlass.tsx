import { useEffect, useRef } from 'react'

/**
 * "Wipe the glass" photo, recreated from the reference hero.
 * A misted copy of the photo is painted on a canvas over the sharp photo;
 * the visitor's cursor wipes it clear. Wiped areas stay clear — the mist never returns.
 * Touch devices and reduced-motion users just see the clear photo.
 */
export function WipeGlass({ src, alt, onIntroDone }: { src: string; alt: string; onIntroDone?: () => void }) {
  const box = useRef<HTMLDivElement>(null)
  const cv = useRef<HTMLCanvasElement>(null)
  const blade = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = box.current!, canvas = cv.current!
    const fine = matchMedia('(hover: hover) and (pointer: fine)').matches
    const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches
    if (!fine || reduce) return
    const ctx = canvas.getContext('2d')!
    const fog = document.createElement('canvas')
    const img = new Image()
    img.src = src
    let dpr = 1, last: { x: number; y: number } | null = null

    function paintFog() {
      dpr = Math.min(window.devicePixelRatio || 1, 2)
      const w = el.clientWidth, h = el.clientHeight
      canvas.width = fog.width = w * dpr
      canvas.height = fog.height = h * dpr
      const f = fog.getContext('2d')!
      // object-fit: cover maths, matching the <img> underneath (scaled 1.04)
      const s = Math.max(w / img.width, h / img.height) * 1.04
      const iw = img.width * s, ih = img.height * s
      // Same mist values as the reference: blur(5px) saturate(.66) brightness(1.05) + 30% bone wash
      f.filter = 'blur(5px) saturate(.66) brightness(1.05)'
      f.drawImage(img, ((w - iw) / 2) * dpr, ((h - ih) / 2) * dpr, iw * dpr, ih * dpr)
      f.filter = 'none'
      f.fillStyle = 'rgba(244,240,232,.3)'
      f.fillRect(0, 0, fog.width, fog.height)
      ctx.globalCompositeOperation = 'source-over'
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      ctx.drawImage(fog, 0, 0)
    }

    function wipe(x: number, y: number, r = 70) {
      ctx.globalCompositeOperation = 'destination-out'
      const from = last ?? { x, y }
      const dist = Math.hypot(x - from.x, y - from.y)
      const steps = Math.max(1, Math.ceil(dist / (r * 0.3)))
      for (let i = 0; i <= steps; i++) {
        const px = (from.x + ((x - from.x) * i) / steps) * dpr
        const py = (from.y + ((y - from.y) * i) / steps) * dpr
        const g = ctx.createRadialGradient(px, py, 0, px, py, r * dpr)
        g.addColorStop(0, 'rgba(0,0,0,.9)')
        g.addColorStop(0.55, 'rgba(0,0,0,.6)')
        g.addColorStop(1, 'rgba(0,0,0,0)')
        ctx.fillStyle = g
        ctx.beginPath()
        ctx.arc(px, py, r * dpr, 0, Math.PI * 2)
        ctx.fill()
      }
      last = { x, y }
    }

    /** Resize the canvas without losing the areas already wiped clear. */
    function resizeKeepingWipes() {
      const prev = document.createElement('canvas')
      prev.width = canvas.width
      prev.height = canvas.height
      prev.getContext('2d')!.drawImage(canvas, 0, 0)
      dpr = Math.min(window.devicePixelRatio || 1, 2)
      canvas.width = el.clientWidth * dpr
      canvas.height = el.clientHeight * dpr
      ctx.globalCompositeOperation = 'source-over'
      ctx.drawImage(prev, 0, 0, canvas.width, canvas.height)
    }

    // Intro: a squeegee "blade" sweeps diagonally across, wiping one clean band
    function intro() {
      const w = el.clientWidth, h = el.clientHeight
      const b = blade.current!
      b.classList.add('opacity-100')
      const start = performance.now(), dur = 1300
      last = null
      const step = (now: number) => {
        const p = Math.min(1, (now - start) / dur)
        const e = 1 - Math.pow(1 - p, 3)
        const x = w * (0.18 + e * 0.9)
        const y = h * (0.86 - e * 0.55)
        b.style.transform = `translate(${x}px, ${y - h * 0.8}px) rotate(18deg)`
        wipe(x, y, 120)
        if (p < 1) requestAnimationFrame(step)
        else {
          b.classList.remove('opacity-100')
          last = null
          onIntroDone?.()
        }
      }
      requestAnimationFrame(step)
    }

    const start = () => {
      paintFog()
      el.dataset.ready = '1'
      const go = () => setTimeout(intro, 500)
      if ((window as unknown as { __siteReady?: boolean }).__siteReady) go()
      else window.addEventListener('site:ready', go, { once: true })
    }
    if (img.complete && img.naturalWidth) start()
    else img.onload = start

    const section = el.closest('section') ?? el
    const move = (e: PointerEvent) => {
      const r = el.getBoundingClientRect()
      wipe(e.clientX - r.left, e.clientY - r.top)
    }
    const leave = () => (last = null)
    let rt: ReturnType<typeof setTimeout>
    const resize = () => {
      clearTimeout(rt)
      rt = setTimeout(() => img.naturalWidth && resizeKeepingWipes(), 150)
    }
    section.addEventListener('pointermove', move as EventListener)
    section.addEventListener('pointerleave', leave)
    window.addEventListener('resize', resize)
    return () => {
      clearTimeout(rt)
      section.removeEventListener('pointermove', move as EventListener)
      section.removeEventListener('pointerleave', leave)
      window.removeEventListener('resize', resize)
    }
  }, [src, onIntroDone])

  return (
    <div ref={box} className="absolute inset-0 overflow-hidden bg-fog">
      <img src={src} alt={alt} {...{ fetchpriority: 'high' }} decoding="async" draggable={false} className="absolute inset-0 h-full w-full scale-[1.04] select-none object-cover" />
      <canvas ref={cv} aria-hidden className="pointer-events-none absolute inset-0 h-full w-full" />
      <div
        ref={blade}
        aria-hidden
        className="pointer-events-none absolute left-[-1px] top-0 h-[160%] w-[2px] opacity-0 transition-opacity duration-300"
        style={{
          background: 'linear-gradient(to bottom,transparent,rgba(255,255,255,.85) 20%,rgba(255,255,255,.85) 80%,transparent)',
          boxShadow: '0 0 22px 5px rgba(255,255,255,.38)',
        }}
      />
    </div>
  )
}
