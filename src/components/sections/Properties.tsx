import { useState } from 'react'
import { Link } from 'react-router-dom'
import { properties } from '../../data/properties'
import type { Property } from '../../data/types'
import { Arrow, ImageSlot, Reveal, Star } from '../ui'

/*
 * "Our Properties" — modelled on the reference's Services section:
 * a numbered list on the left; pointing at (or focusing) a row slides it in,
 * turns its name green and swaps the sticky photo card on the right.
 * Phones get stacked photo cards instead. Only verified facts are shown.
 */

const num = (i: number) => String(i + 1).padStart(2, '0')

function facts(p: Property) {
  return [
    p.bedrooms && `${p.bedrooms} bed${p.bedrooms > 1 ? 's' : ''}`,
    p.bathrooms && `${p.bathrooms} bath${p.bathrooms > 1 ? 's' : ''}`,
    p.guests && `Sleeps ${p.guests}`,
  ].filter(Boolean) as string[]
}

/** Right-hand meta: rating if verified, else the verified facts, else the area. */
function Meta({ p }: { p: Property }) {
  const f = facts(p)
  return (
    <div className="grid justify-items-end gap-1.5 text-right">
      {p.rating ? (
        <p className="inline-flex items-baseline gap-2">
          <Star className="h-3.5 w-3.5 self-center text-moss" />
          <b className="font-display text-[26px] font-normal leading-none">{p.rating.toFixed(2)}</b>
        </p>
      ) : (
        <p className="font-display text-[22px] leading-none">{f[0] ?? p.location.replace(', Surrey', '')}</p>
      )}
      <p className="text-[13.5px] font-medium text-stone">{p.rating ? `${p.reviewCount} reviews` : f.slice(1).join(' · ') || 'Details coming soon'}</p>
    </div>
  )
}

const Go = ({ on }: { on: boolean }) => (
  <span
    aria-hidden
    className={`grid h-11 w-11 shrink-0 place-items-center rounded-full shadow-[0_6px_20px_rgba(20,32,28,.07)] transition-[background-color,color,translate] duration-[450ms] ease-out2 ${on ? 'translate-x-1 bg-moss text-white' : 'bg-white text-ink'}`}
  >
    <Arrow />
  </span>
)

/** Chips under the side photo: badges + highlights, verified only. */
const chipsFor = (p: Property) => [...(p.badges ?? []), ...(p.highlights ?? [])].slice(0, 4)

export function Properties() {
  const [on, setOn] = useState(0)
  const p = properties[on]

  return (
    <section id="properties" className="py-24 sm:py-28 lg:py-32">
      <div className="container-x">
        {/* Top: heading left, lead + link right */}
        <div className="mb-10 grid gap-5 lg:mb-14 lg:grid-cols-[minmax(0,1fr)_minmax(0,420px)] lg:items-end lg:gap-16">
          <Reveal>
            <p className="eyebrow mb-5 flex items-center gap-2.5"><i className="h-[7px] w-[7px] rounded-full bg-pine" />Our properties</p>
            <h2 className="text-[clamp(40px,4.3vw,64px)] font-normal leading-none tracking-[-0.04em]">
              Homes made for <br className="hidden sm:block" />guests, in <em className="font-light italic text-moss">Epsom.</em>
            </h2>
          </Reveal>
          <Reveal delay={120} className="grid justify-items-start gap-[18px]">
            <p className="max-w-[34em] text-[17px] leading-relaxed text-stone">
              Each home is run personally, with the same care for comfort and cleanliness. Point at one to see it, open it for the full details.
            </p>
            <Link to="/book" className="group inline-flex min-h-[44px] items-center gap-2 text-[14.5px] font-semibold">
              Book your stay <Arrow className="transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </Reveal>
        </div>

        {/* Desktop / tablet: list + sticky preview */}
        <div className="hidden gap-7 md:grid md:grid-cols-[minmax(0,1fr)_minmax(0,0.7fr)] lg:grid-cols-[minmax(0,1fr)_minmax(0,0.62fr)] lg:gap-14">
          <ul className="border-t border-ink/[.14]">
            {properties.map((x, i) => {
              const active = i === on
              return (
                <li key={x.slug}>
                  <Link
                    to={`/properties/${x.slug}`}
                    onMouseEnter={() => setOn(i)}
                    onFocus={() => setOn(i)}
                    aria-label={`View ${x.name}`}
                    className={`grid grid-cols-[30px_minmax(0,1fr)_40px] items-center gap-3 border-b border-ink/[.14] py-[22px] pr-3.5 transition-[padding,background-color] duration-[450ms] ease-out2 lg:grid-cols-[44px_minmax(0,1fr)_auto_44px] lg:gap-5 ${
                      active ? 'bg-white/70 pl-[18px]' : 'pl-1.5'
                    }`}
                  >
                    <span className="eyebrow">{num(i)}</span>
                    <span className="grid min-w-0 gap-1.5">
                      <span className={`font-display text-[clamp(24px,2.3vw,34px)] leading-[1.05] tracking-[-0.03em] transition-colors duration-300 ${active ? 'text-moss' : ''}`}>{x.name}</span>
                      <span className="hidden max-w-[52ch] text-[15px] leading-[1.45] text-stone lg:block">{x.tagline}</span>
                      <span className="text-[13.5px] font-medium text-stone lg:hidden">
                        {x.rating ? `★ ${x.rating.toFixed(2)} · ${x.reviewCount} reviews` : facts(x).join(' · ') || x.location}
                      </span>
                    </span>
                    <span className="hidden lg:block"><Meta p={x} /></span>
                    <Go on={active} />
                  </Link>
                </li>
              )
            })}
          </ul>

          <div className="sticky top-[104px] self-start">
            <Link to={`/properties/${p.slug}`} className="block rounded-3xl bg-white p-2.5 shadow-soft" tabIndex={-1} aria-hidden>
              <div key={p.slug} className="veil relative aspect-[4/3.4] overflow-hidden rounded-[16px]">
                <ImageSlot src={p.images[0]} alt={p.name} tone={p.tone} />
              </div>
              <div className="grid gap-3.5 px-3 pb-3 pt-[18px]">
                <p className="eyebrow">{num(on)} · {p.location.replace(', Surrey', '')}</p>
                <p key={p.slug} className="rise font-display text-[28px] leading-[1.05] tracking-[-0.03em]">{p.name}</p>
                {chipsFor(p).length > 0 && (
                  <ul className="flex flex-wrap gap-1.5">
                    {chipsFor(p).map((c) => (
                      <li key={c} className="rounded-full bg-[color-mix(in_srgb,#F4F0E8_82%,#fff)] px-3.5 py-2 text-[13px] font-medium">{c}</li>
                    ))}
                  </ul>
                )}
              </div>
            </Link>
          </div>
        </div>

        {/* Phones: stacked cards */}
        <ul className="grid gap-4 md:hidden">
          {properties.map((x, i) => (
            <li key={x.slug}>
              <Reveal>
                <Link to={`/properties/${x.slug}`} className="flex flex-col rounded-3xl bg-white p-2.5 shadow-soft">
                  <div className="aspect-[4/3] overflow-hidden rounded-[16px]">
                    <ImageSlot src={x.images[0]} alt={x.name} tone={x.tone} />
                  </div>
                  <div className="grid gap-2.5 px-2.5 pb-2.5 pt-4">
                    <p className="eyebrow">{num(i)} · {x.location.replace(', Surrey', '')}</p>
                    <p className="font-display text-[26px] leading-[1.05] tracking-[-0.03em]">{x.name}</p>
                    <p className="text-[15px] leading-normal text-stone">{x.tagline}</p>
                    <div className="mt-1 flex items-center justify-between gap-3 border-t border-ink/[.14] pt-3">
                      <span className="text-[13.5px] font-medium text-stone">
                        {x.rating ? `★ ${x.rating.toFixed(2)} · ${x.reviewCount} reviews` : facts(x).join(' · ') || 'Details coming soon'}
                      </span>
                      <span aria-hidden className="grid h-11 w-11 place-items-center rounded-full bg-moss text-white"><Arrow /></span>
                    </div>
                  </div>
                </Link>
              </Reveal>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
