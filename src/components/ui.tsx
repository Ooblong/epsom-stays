import { useEffect, useRef, useState, type ReactNode } from 'react'
import type { Property } from '../data/types'

/** Fades content up when it scrolls into view. */
export function Reveal({ children, delay = 0, className = '' }: { children: ReactNode; delay?: number; className?: string }) {
  const ref = useRef<HTMLDivElement>(null)
  const [shown, setShown] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setShown(true)
          io.disconnect()
        }
      },
      { rootMargin: '0px 0px -8% 0px' },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])
  return (
    <div ref={ref} className={`reveal ${shown ? 'in' : ''} ${className}`} style={{ ['--d' as string]: `${delay}ms` }}>
      {children}
    </div>
  )
}

const toneClass: Record<Property['tone'], string> = {
  sage: 'from-sage-light via-sage to-sage-deep',
  sand: 'from-sand via-[#d9cdb6] to-[#bfae8d]',
  moss: 'from-[#5f7d6e] via-moss to-ink',
  brass: 'from-[#e6d8bb] via-[#c9ab78] to-brass',
}

/**
 * Shows a real photo when `src` is provided; otherwise a refined placeholder
 * so the layout still looks intentional until photography is dropped in.
 */
export function ImageSlot({
  src,
  alt,
  tone = 'sage',
  label = 'Photography to be added',
  className = '',
  eager = false,
  zoom = false,
}: {
  src?: string
  alt: string
  tone?: Property['tone']
  label?: string
  className?: string
  eager?: boolean
  zoom?: boolean
}) {
  const [failed, setFailed] = useState(false)
  if (src && !failed) {
    return (
      <img
        src={src}
        alt={alt}
        loading={eager ? 'eager' : 'lazy'}
        decoding="async"
        onError={() => setFailed(true)}
        className={`h-full w-full object-cover ${zoom ? 'transition duration-[1200ms] ease-out group-hover:scale-105' : ''} ${className}`}
      />
    )
  }
  return (
    <div
      role="img"
      aria-label={`${alt} (${label})`}
      className={`relative grid h-full w-full place-items-center overflow-hidden bg-gradient-to-br ${toneClass[tone]} ${className}`}
    >
      <svg viewBox="0 0 200 120" className="absolute inset-0 h-full w-full opacity-25" preserveAspectRatio="xMidYMax slice" aria-hidden>
        <path d="M0 120V78l30-18 24 12 34-30 36 26 30-20 46 28v44z" fill="#fff" />
        <rect x="118" y="52" width="14" height="20" fill="#fff" opacity=".6" />
      </svg>
      <span className="relative rounded-full bg-white/70 px-3 py-1 text-[10px] uppercase tracking-[0.2em] text-ink/70 backdrop-blur">{label}</span>
    </div>
  )
}

export const Arrow = ({ className = '' }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={`h-4 w-4 ${className}`} fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
    <path d="M5 12h14m-6-6 6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

export const Star = ({ className = '' }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={`h-4 w-4 ${className}`} fill="currentColor" aria-hidden>
    <path d="m12 2.5 2.9 6 6.6.9-4.8 4.6 1.2 6.5L12 17.4 6.1 20.5l1.2-6.5L2.5 9.4l6.6-.9z" />
  </svg>
)

export function SectionHead({ eyebrow, title, children, align = 'left' }: { eyebrow: string; title: ReactNode; children?: ReactNode; align?: 'left' | 'center' }) {
  return (
    <Reveal className={align === 'center' ? 'mx-auto max-w-2xl text-center' : 'max-w-2xl'}>
      <p className="eyebrow mb-4">{eyebrow}</p>
      <h2 className="text-4xl leading-[1.05] sm:text-5xl lg:text-6xl">{title}</h2>
      {children && <p className="mt-5 text-base leading-relaxed text-ink/70 sm:text-lg">{children}</p>}
    </Reveal>
  )
}

export function FieldError({ id, msg }: { id: string; msg?: string }) {
  return msg ? (
    <p id={id} role="alert" className="mt-1.5 text-xs text-red-800">
      {msg}
    </p>
  ) : null
}
