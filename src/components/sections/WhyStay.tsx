import { useState } from 'react'
import { Link } from 'react-router-dom'
import { comfortTour } from '../../data/content'
import { featuredProperty } from '../../data/properties'
import { Arrow, Reveal } from '../ui'

/*
 * "Why stay with us" — modelled on the reference's "Every surface, ticked" section.
 * A room photo of the featured flat with + hotspots; moving over (or clicking) one
 * ticks that comfort off the list beside it. Room tabs and a running counter on top.
 */

const total = comfortTour.reduce((n, r) => n + r.points.length, 0)
const key = (r: number, i: number) => `${r}:${i}`
const pad = (n: number) => String(n).padStart(2, '0')

const Plus = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
    <path d="M12 5v14M5 12h14" strokeLinecap="round" />
  </svg>
)
const Tick = ({ className = '' }: { className?: string }) => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" aria-hidden className={className}>
    <path d="m5 12.5 4.5 4.5L19 7.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

/** Round tick box used in the list (empty ring → green filled tick). */
const Box = ({ done }: { done: boolean }) => (
  <span className={`grid h-[22px] w-[22px] shrink-0 place-items-center rounded-full transition-[background-color,box-shadow] duration-300 ${done ? 'bg-pine text-ink' : 'shadow-[inset_0_0_0_1.5px_rgba(20,32,28,.22)]'}`}>
    <Tick className={`transition-[opacity,scale] duration-300 ${done ? 'scale-100 opacity-100' : 'scale-50 opacity-0'}`} />
  </span>
)

export function WhyStay() {
  const [room, setRoom] = useState(0)
  const [done, setDone] = useState<Set<string>>(() => new Set())
  const [open, setOpen] = useState<number | null>(null)
  const r = comfortTour[room]
  const roomDone = (ri: number) => comfortTour[ri].points.filter((_, i) => done.has(key(ri, i))).length

  const tick = (i: number) => setDone((s) => (s.has(key(room, i)) ? s : new Set(s).add(key(room, i))))
  const tickRoom = () => setDone((s) => { const n = new Set(s); r.points.forEach((_, i) => n.add(key(room, i))); return n })
  const allRoom = roomDone(room) === r.points.length

  return (
    <section id="why" className="bg-sand py-24 sm:py-28 lg:py-32">
      <div className="container-x">
        {/* Top: heading + counter */}
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end lg:gap-12">
          <Reveal>
            <p className="eyebrow mb-5 flex items-center gap-2.5"><i className="h-[7px] w-[7px] rounded-full bg-pine" />Why stay with us</p>
            <h2 className="text-[clamp(40px,4.3vw,64px)] font-normal leading-none tracking-[-0.04em]">
              Every comfort, <em className="font-light italic text-moss">thought of.</em>
            </h2>
            <p className="mt-5 max-w-[34em] text-[17px] leading-relaxed text-stone">
              Hotel-style comforts with the privacy of home. Move over the rooms of our featured flat to see what’s waiting for you.
            </p>
          </Reveal>
          <Reveal delay={120} className="grid min-w-[260px] justify-items-start gap-2.5 lg:justify-items-end">
            <p className="flex items-baseline overflow-hidden font-display text-[clamp(64px,6.6vw,104px)] leading-[0.9] tracking-[-0.04em]" aria-hidden>
              <span key={done.size} className="rise inline-block">{pad(done.size)}</span>
              <span className="text-stone">/{pad(total)}</span>
            </p>
            <p className="eyebrow">Comforts found</p>
            <span className="block h-1 w-full overflow-hidden rounded bg-ink/[.22]">
              <i className="block h-full origin-left rounded bg-moss transition-transform duration-[600ms] ease-out2" style={{ transform: `scaleX(${done.size / total})` }} />
            </span>
            <p className="sr-only" aria-live="polite">{done.size} of {total} comforts found</p>
          </Reveal>
        </div>

        {/* Room tabs */}
        <div role="tablist" aria-label="Rooms" className="mt-11 flex flex-wrap gap-2">
          {comfortTour.map((t, i) => (
            <button
              key={t.room}
              role="tab"
              aria-selected={i === room}
              onClick={() => { setRoom(i); setOpen(null) }}
              className={`inline-flex h-11 items-center gap-2 rounded-full px-[18px] text-sm font-medium transition-colors duration-300 ${i === room ? 'bg-moss text-white' : 'bg-white text-ink shadow-chip hover:bg-[color-mix(in_srgb,#0E5B4A_12%,#fff)]'}`}
            >
              {t.room} <span className={i === room ? 'text-white/75' : 'text-stone'}>{roomDone(i)}/{t.points.length}</span>
            </button>
          ))}
        </div>

        {/* Stage: photo with hotspots + checklist */}
        <div className="mt-5 grid gap-5 lg:grid-cols-[minmax(0,1fr)_380px]">
          {/* Photo keeps its real 3:2 shape so the % hotspot positions never drift */}
          <div className="relative aspect-[3/2] self-start overflow-hidden rounded-3xl" role="tabpanel" aria-label={r.room}>
            <div key={r.photo} className="veil absolute inset-0">
              <img src={r.photo} alt={r.alt} loading="lazy" className="h-full w-full object-cover" />
            </div>
            <ul className="absolute inset-0 z-[3]">
              {r.points.map((pt, i) =>
                pt.x === undefined ? null : (
                  <li key={i} className={`absolute h-0 w-0 ${open === i ? 'z-[4]' : ''}`} style={{ left: `${pt.x}%`, top: `${pt.y}%` }}>
                    <button
                      aria-label={pt.label}
                      aria-pressed={done.has(key(room, i))}
                      onMouseEnter={() => { setOpen(i); tick(i) }}
                      onMouseLeave={() => setOpen(null)}
                      onFocus={() => setOpen(i)}
                      onBlur={() => setOpen(null)}
                      onClick={() => { setOpen(i); tick(i) }}
                      className={`absolute -left-[19px] -top-[19px] grid h-[38px] w-[38px] place-items-center rounded-full bg-white text-ink transition-[scale,box-shadow] duration-300 ease-out2 hover:scale-110 focus-visible:scale-110 after:absolute after:-inset-[9px] after:rounded-full ${
                        done.has(key(room, i))
                          ? 'shadow-[0_0_0_8px_rgba(47,191,138,.3),0_8px_24px_rgba(20,32,28,.22)]'
                          : 'shadow-[0_0_0_8px_rgba(255,255,255,.34),0_8px_24px_rgba(20,32,28,.26)]'
                      }`}
                    >
                      {done.has(key(room, i)) ? <Tick className="text-moss" /> : <Plus />}
                    </button>
                    <span
                      aria-hidden
                      className={`pointer-events-none absolute -top-[19px] inline-flex h-[38px] items-center gap-2 whitespace-nowrap rounded-full bg-white pl-2.5 pr-4 text-[14.5px] font-semibold text-ink shadow-[0_12px_34px_rgba(20,32,28,.24)] transition-[opacity,translate] duration-300 ease-out2 ${
                        (pt.x ?? 0) > 60 ? 'right-7' : 'left-7'
                      } ${open === i ? 'translate-x-0 opacity-100' : `opacity-0 ${(pt.x ?? 0) > 60 ? 'translate-x-2' : '-translate-x-2'}`}`}
                    >
                      <Box done={done.has(key(room, i))} /> {pt.label}
                    </span>
                  </li>
                ),
              )}
            </ul>
          </div>

          <div className="flex min-w-0 flex-col gap-3.5 rounded-3xl bg-white px-6 pb-[22px] pt-[26px] shadow-soft">
            <p className="flex items-baseline justify-between gap-3 border-b border-ink/[.12] pb-3.5">
              <span key={r.room} className="rise font-display text-[30px] leading-[1.05] tracking-[-0.03em]">{r.room}</span>
              <span className="eyebrow">{pad(roomDone(room))}/{pad(r.points.length)}</span>
            </p>
            <ul className="grid gap-0.5">
              {r.points.map((pt, i) => {
                const d = done.has(key(room, i))
                return (
                  <li key={i}>
                    <button
                      onClick={() => tick(i)}
                      onMouseEnter={() => setOpen(i)}
                      onMouseLeave={() => setOpen(null)}
                      className={`-mx-2 flex min-h-[46px] w-[calc(100%+16px)] items-center gap-3 rounded-xl px-2 py-1.5 text-left text-[15px] leading-[1.35] transition-colors duration-300 ${d ? 'text-ink' : 'text-stone'} ${open === i ? 'bg-sand' : ''}`}
                    >
                      <Box done={d} /> {pt.label}
                    </button>
                  </li>
                )
              })}
            </ul>
            <div className="mt-auto pt-3.5">
              {allRoom ? (
                <p className="flex items-center gap-2.5 text-[15px] font-semibold"><Box done /> Every comfort in this room found.</p>
              ) : (
                <button onClick={tickRoom} className="btn btn-dark h-[52px] w-full text-[15px]">Show every comfort</button>
              )}
            </div>
          </div>
        </div>

        <div className="mt-8 flex">
          <Link to={`/properties/${featuredProperty.slug}`} className="group inline-flex min-h-[44px] items-center gap-2 text-[14.5px] font-semibold">
            See {featuredProperty.name} <Arrow className="transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
        </div>
      </div>
    </section>
  )
}
