import { Link } from 'react-router-dom'
import { locationPoints } from '../../data/content'
import { site } from '../../data/site'
import { Arrow, Reveal } from '../ui'

/*
 * Location — modelled on the reference's "Areas" section: head block beside a
 * white plate (here a map instead of the zip checker), then a two-column
 * numbered list. Each place links to the home it sits near.
 */

export function Location() {
  return (
    <section id="location" className="bg-sand py-24 sm:py-28 lg:py-32">
      <div className="container-x">
        <div className="grid grid-cols-1 items-end gap-9 lg:grid-cols-[minmax(0,1fr)_minmax(0,520px)] lg:gap-16">
          <Reveal>
            <p className="eyebrow mb-5 flex items-center gap-2.5"><i className="h-[7px] w-[7px] rounded-full bg-pine" />Location</p>
            <h2 className="text-[clamp(40px,4.3vw,64px)] font-normal leading-none tracking-[-0.04em]">
              Set in the heart of <em className="font-light italic text-moss">Epsom.</em>
            </h2>
            <p className="mt-6 max-w-[540px] text-[17px] leading-relaxed text-stone">
              A Surrey market town with shops, restaurants and the railway station close by. Each of our homes is chosen for what is around it.
            </p>
          </Reveal>

          <Reveal delay={120}>
            <div className="rounded-[28px] bg-white p-2.5 shadow-[0_12px_34px_rgba(20,32,28,.07)]">
              <div className="h-[260px] overflow-hidden rounded-[20px] sm:h-[300px]">
                <iframe title="Map of Epsom, Surrey" src={site.mapEmbed} loading="lazy" className="h-full w-full grayscale-[.45] sepia-[.12]" />
              </div>
              <p className="flex flex-wrap items-center gap-x-2.5 gap-y-1 px-4 pb-3 pt-4 text-[14.5px] text-stone">
                <span className="whitespace-nowrap font-mono text-xs uppercase tracking-[0.12em]">Central Epsom</span>
                <span className="hidden sm:inline" aria-hidden>·</span>
                Exact addresses are shared on booking.
              </p>
            </div>
          </Reveal>
        </div>

        <ul className="mt-14 grid grid-cols-1 border-b border-ink/[.14] md:grid-cols-2 md:gap-x-10 lg:mt-16 lg:gap-x-16">
          {locationPoints.map((l, i) => {
            const inner = (
              <>
                <span className="hidden font-mono text-xs tracking-[0.12em] text-stone sm:block" aria-hidden>{String(i + 1).padStart(2, '0')}</span>
                <span className="grid min-w-0 gap-1.5">
                  <span className={`font-display text-[clamp(24px,2.2vw,30px)] leading-[1.05] transition-colors duration-300 ${l.slug ? 'group-hover:text-moss' : ''}`}>{l.title}</span>
                  <span className="text-[15px] leading-snug text-stone">{l.text}</span>
                </span>
                <span className={`whitespace-nowrap rounded-full px-3 py-1 text-[13.5px] font-medium transition-colors duration-300 ${l.slug ? 'bg-white group-hover:bg-moss group-hover:text-white' : 'border border-dashed border-ink/25 text-stone'}`}>
                  {l.stay ?? 'To be added'}
                </span>
                <span className={`hidden h-7 w-7 place-items-center text-moss opacity-0 transition-[opacity,translate] duration-[450ms] ease-out2 -translate-x-2 lg:grid ${l.slug ? 'group-hover:translate-x-0 group-hover:opacity-100' : ''}`} aria-hidden><Arrow /></span>
              </>
            )
            const row = 'group relative grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3.5 px-0.5 py-5 transition-[padding] duration-[450ms] ease-out2 sm:grid-cols-[34px_minmax(0,1fr)_auto] sm:py-6 lg:grid-cols-[34px_minmax(0,1fr)_auto_28px]'
            const line = <i className="absolute -top-px left-0 h-0.5 w-full origin-left scale-x-0 bg-moss transition-transform duration-[550ms] ease-out2 group-hover:scale-x-100" aria-hidden />
            return (
              <li key={l.title} className="border-t border-ink/[.14]">
                <Reveal delay={(i % 2) * 90}>
                  {l.slug ? (
                    <Link to={`/properties/${l.slug}`} className={`${row} lg:hover:pl-3 lg:hover:pr-0`} aria-label={`${l.title}: ${l.text} See ${l.stay}.`}>
                      {line}{inner}
                    </Link>
                  ) : (
                    <div className={row}>{inner}</div>
                  )}
                </Reveal>
              </li>
            )
          })}
        </ul>
      </div>
    </section>
  )
}
