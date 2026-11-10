import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { featuredProperty } from '../../data/properties'
import { site } from '../../data/site'
import { BookingSearch } from '../BookingSearch'
import { WipeGlass } from '../WipeGlass'
import { Arrow } from '../ui'

// Headline split into lines → words so each word can rise out of its own mask.
const LINES: { w: string; em?: boolean }[][] = [
  [{ w: 'Come' }, { w: 'home' }, { w: 'to' }, { w: 'stay.', em: true }],
  [{ w: 'Come' }, { w: 'home' }, { w: 'to' }, { w: 'clean.', em: true }],
]

export function Hero() {
  const p = featuredProperty
  const [inn, setInn] = useState(false)
  const cur = useRef<HTMLDivElement>(null)
  const section = useRef<HTMLElement>(null)

  // Start the entrance once the launch loader has wiped away.
  useEffect(() => {
    if ((window as unknown as { __siteReady?: boolean }).__siteReady) {
      const t = setTimeout(() => setInn(true), 30)
      return () => clearTimeout(t)
    }
    const go = () => setInn(true)
    window.addEventListener('site:ready', go, { once: true })
    const fallback = setTimeout(go, 3000) // never leave the hero hidden
    return () => { window.removeEventListener('site:ready', go); clearTimeout(fallback) }
  }, [])

  // "WIPE" cursor bubble (fine pointers only); shrinks to a dot over controls.
  useEffect(() => {
    const s = section.current!, c = cur.current!
    if (!matchMedia('(hover: hover) and (pointer: fine)').matches) return
    const move = (e: PointerEvent) => {
      const r = s.getBoundingClientRect()
      c.style.transform = `translate3d(${e.clientX - r.left}px, ${e.clientY - r.top}px, 0)`
      c.dataset.on = '1'
      const overUi = !!(e.target as HTMLElement).closest('a,button,select,label,input,[role=dialog],[role=search],[role=listbox]')
      c.dataset.small = overUi ? '1' : ''
    }
    const leave = () => (c.dataset.on = '')
    const down = () => (c.dataset.press = '1')
    const up = () => (c.dataset.press = '')
    s.addEventListener('pointermove', move)
    s.addEventListener('pointerleave', leave)
    s.addEventListener('pointerdown', down)
    s.addEventListener('pointerup', up)
    return () => {
      s.removeEventListener('pointermove', move)
      s.removeEventListener('pointerleave', leave)
      s.removeEventListener('pointerdown', down)
      s.removeEventListener('pointerup', up)
    }
  }, [])

  let wordIndex = 0
  return (
    <section
      id="home"
      ref={section}
      className={`relative isolate flex min-h-[100svh] flex-col overflow-hidden bg-bone text-ink lg:cursor-none ${inn ? '' : 'hero-wait'}`}
    >
      {/* Photo + misted glass. Mobile: photo band on top; desktop: full bleed. */}
      <div className="absolute inset-x-0 top-0 z-[1] h-[min(98vw,460px)] md:inset-0 md:h-auto">
        <WipeGlass src={site.heroImage} alt="Bright open-plan living room, dining area and kitchen in one of our Epsom homes" />
      </div>
      {/* Bone-coloured wash so dark text reads over the bright photo (values from the reference). */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 z-[2] h-[min(98vw,460px)] md:hidden"
        style={{ background: 'linear-gradient(180deg, rgba(244,240,232,.72) 0, transparent 26%), linear-gradient(0deg, #F4F0E8 0, transparent 20%)' }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-[2] hidden md:block lg:hidden"
        style={{ background: 'linear-gradient(90deg, rgba(244,240,232,.92) 0, rgba(244,240,232,.7) 40%, rgba(244,240,232,.16) 68%, transparent 80%), linear-gradient(180deg, rgba(244,240,232,.62) 0, transparent 17%), linear-gradient(0deg, rgba(244,240,232,.8) 0, transparent 34%)' }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-[2] hidden lg:block"
        style={{ background: 'linear-gradient(90deg, rgba(244,240,232,.92) 0, rgba(244,240,232,.66) 30%, rgba(244,240,232,.12) 52%, transparent 62%), linear-gradient(180deg, rgba(244,240,232,.62) 0, transparent 17%), linear-gradient(0deg, rgba(244,240,232,.66) 0, transparent 26%)' }}
      />

      <div className="container-x pointer-events-none relative z-[3] flex flex-1 flex-col [&_a]:pointer-events-auto [&_button]:pointer-events-auto [&_label]:pointer-events-auto">
        {/* Copy */}
        <div className="flex flex-1 items-center pb-7 pt-[calc(min(98vw,460px)-90px)] md:pb-9 md:pt-[124px]">
          <div className="w-full md:w-[78%] lg:w-[64%] lg:max-w-[900px]">
            <p className="hero-up mb-[22px] inline-flex items-center gap-2.5 rounded-full bg-white px-4 py-2.5 text-[13px] font-medium leading-tight shadow-chip sm:mb-7 sm:text-sm" style={{ ['--d' as string]: '50ms' }}>
              <i className="pulse-dot h-2 w-2 shrink-0 rounded-full bg-pine" />
              Hosted by {site.host} · Superhost · Epsom, Surrey
            </p>

            <h1 className="text-[min(13.4vw,64px)] font-semibold leading-[0.9] tracking-[-0.045em] sm:text-[clamp(64px,8.6vw,96px)] lg:text-[clamp(72px,7.4vw,132px)]">
              {LINES.map((line, li) => (
                <span key={li} className="block sm:whitespace-nowrap">
                  {line.map((t, i) => {
                    const d = 120 + wordIndex++ * 70
                    return (
                      <span key={i}>
                        <span className="mask-w">
                          <span className={`mask-wi ${t.em ? 'pr-[0.04em] font-light italic text-moss' : ''}`} style={{ ['--d' as string]: `${d}ms` }}>{t.w}</span>
                        </span>
                        {i < line.length - 1 && ' '}
                      </span>
                    )
                  })}
                </span>
              ))}
            </h1>

            <p className="hero-up mt-[22px] max-w-[460px] text-[16.5px] leading-normal text-ink/[.86] sm:mt-[30px] sm:text-[19px]" style={{ ['--d' as string]: '450ms' }}>
              Beautifully kept homes to stay in, and the same spotless care for yours, in the heart of Surrey.
            </p>

            <div className="hero-up mt-7 flex flex-wrap gap-3" style={{ ['--d' as string]: '520ms' }}>
              <Link to="/#properties" className="btn btn-dark">Explore Our Stays <Arrow /></Link>
              <Link to="/#cleaning" className="btn btn-ghost bg-white/60 text-ink backdrop-blur">Our Cleaning Services</Link>
            </div>
          </div>
        </div>

        {/* Foot: booking bar + social proof */}
        <div className="flex flex-col-reverse items-stretch gap-[26px] pb-9 lg:items-start lg:pb-[42px] xl:flex-row xl:items-end xl:justify-between xl:gap-8">
          <div className="hero-up xl:max-w-[860px] xl:flex-1" style={{ ['--d' as string]: '600ms' }}>
            <BookingSearch />
          </div>
          {p.rating && (
            <div className="hero-up pointer-events-none xl:text-right" style={{ ['--d' as string]: '750ms' }}>
              <span className="mb-2.5 hidden rounded-full bg-white/[.86] px-2.5 py-1.5 font-mono text-xs uppercase tracking-[0.12em] xl:inline-block">Wipe the glass</span>
              <p className="whitespace-nowrap font-display text-[30px] font-semibold leading-[1.05] tracking-[-0.03em] lg:text-[clamp(30px,3.05vw,50px)]">
                {p.rating.toFixed(2)} ★ · {p.reviewCount} reviews
              </p>
              <p className="mt-1.5 text-[13px] text-stone">Featured listing · {p.badges?.[0]}</p>
            </div>
          )}
        </div>
      </div>

      {/* Cursor bubble */}
      <div
        ref={cur}
        aria-hidden
        className="group pointer-events-none absolute left-0 top-0 z-[9] hidden h-0 w-0 opacity-0 transition-opacity duration-200 data-[on='1']:opacity-100 lg:block"
      >
        <b className="absolute -left-14 -top-14 grid h-28 w-28 place-items-center rounded-full bg-white/[.92] font-normal text-ink shadow-[0_10px_40px_rgba(20,32,28,.22)] transition-[scale,background-color] duration-300 ease-out group-data-[press='1']:scale-[.86] group-data-[small='1']:scale-[.14] group-data-[small='1']:bg-moss">
          <span className="font-mono text-xs uppercase tracking-[0.12em] transition-opacity group-data-[small='1']:opacity-0">Wipe</span>
        </b>
      </div>
    </section>
  )
}
