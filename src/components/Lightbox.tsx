import { useEffect, useRef } from 'react'

/** Turns "/images/x/03-living-entrance.webp" into "Living entrance". */
export const photoAlt = (src: string, fallback = 'Property photo') => {
  const name = src.split('/').pop()?.replace(/\.\w+$/, '').replace(/^\d+-/, '').replace(/-/g, ' ')
  // Numbered files (01.webp …) have no description, so use the fallback
  return name && !/^\d+$/.test(name) ?name.charAt(0).toUpperCase() + name.slice(1) : fallback
}

/** Full-screen photo viewer: arrow keys / buttons to move, Esc or backdrop to close. */
export function Lightbox({ images, index, onIndex, onClose, title }: { images: string[]; index: number; onIndex: (i: number) => void; onClose: () => void; title: string }) {
  const closeBtn = useRef<HTMLButtonElement>(null)
  const strip = useRef<HTMLDivElement>(null)
  const n = images.length
  const go = (d: number) => onIndex((index + d + n) % n)

  useEffect(() => {
    const prevFocus = document.activeElement as HTMLElement | null
    closeBtn.current?.focus()
    document.documentElement.style.overflow = 'hidden'
    return () => {
      document.documentElement.style.overflow = ''
      prevFocus?.focus()
    }
  }, [])

  useEffect(() => {
    const key = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowRight') go(1)
      if (e.key === 'ArrowLeft') go(-1)
    }
    document.addEventListener('keydown', key)
    strip.current?.querySelector<HTMLElement>(`[data-i="${index}"]`)?.scrollIntoView({ block: 'nearest', inline: 'center', behavior: 'smooth' })
    return () => document.removeEventListener('keydown', key)
  })

  // Swipe on touch screens
  let x0 = 0
  const arrowCls = 'grid h-12 w-12 place-items-center rounded-full bg-white/10 text-2xl text-white transition hover:bg-white hover:text-ink'

  return (
    <div role="dialog" aria-modal="true" aria-label={`${title} photos`} className="fixed inset-0 z-[60] flex flex-col bg-night/95 text-white backdrop-blur" onClick={onClose}>
      <div className="flex items-center justify-between px-5 py-4 sm:px-8" onClick={(e) => e.stopPropagation()}>
        <p className="font-mono text-xs uppercase tracking-[0.12em] text-white/70">
          {index + 1} / {n} · {photoAlt(images[index])}
        </p>
        <button ref={closeBtn} onClick={onClose} className="rounded-full bg-white/10 px-4 py-2 text-sm transition hover:bg-white hover:text-ink">Close ✕</button>
      </div>

      <div
        className="relative flex min-h-0 flex-1 items-center justify-center px-4 sm:px-20"
        onTouchStart={(e) => (x0 = e.touches[0].clientX)}
        onTouchEnd={(e) => {
          const dx = e.changedTouches[0].clientX - x0
          if (Math.abs(dx) > 40) go(dx < 0 ? 1 : -1)
        }}
      >
        <img key={index} src={images[index]} alt={photoAlt(images[index])} onClick={(e) => e.stopPropagation()} className="roll max-h-full max-w-full rounded-2xl object-contain" />
        <button aria-label="Previous photo" onClick={(e) => { e.stopPropagation(); go(-1) }} className={`absolute left-4 hidden sm:grid ${arrowCls}`}>‹</button>
        <button aria-label="Next photo" onClick={(e) => { e.stopPropagation(); go(1) }} className={`absolute right-4 hidden sm:grid ${arrowCls}`}>›</button>
      </div>

      <div ref={strip} className="flex gap-2 overflow-x-auto px-5 py-4 sm:justify-center sm:px-8" onClick={(e) => e.stopPropagation()}>
        {images.map((src, i) => (
          <button key={src} data-i={i} onClick={() => onIndex(i)} aria-label={`Show ${photoAlt(src)}`} aria-current={i === index} className={`h-14 w-20 shrink-0 overflow-hidden rounded-lg transition ${i === index ? 'opacity-100 ring-2 ring-pine' : 'opacity-50 hover:opacity-90'}`}>
            <img src={src} alt="" loading="lazy" className="h-full w-full object-cover" />
          </button>
        ))}
      </div>
    </div>
  )
}
