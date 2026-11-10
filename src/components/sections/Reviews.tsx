import { featuredRatings, guestReviews } from '../../data/content'
import { featuredProperty } from '../../data/properties'
import { site } from '../../data/site'
import { Arrow, Reveal, Star } from '../ui'

/*
 * Guest reviews — modelled on the reference's Reviews section:
 * a sticky summary card (big rating, stars, proof points) beside a two-column
 * wall of review cards. Breakdown figures come from the live Airbnb listing.
 */

const Stars = ({ n = 5, size = 'h-4 w-4' }: { n?: number; size?: string }) => (
  <span className="flex gap-1 text-moss" aria-label={`${n} out of 5 stars`}>
    {[0, 1, 2, 3, 4].map((i) => <Star key={i} className={`${size} ${i < n ? '' : 'text-ink/15'}`} />)}
  </span>
)

const Tick = () => (
  <span className="grid h-[22px] w-[22px] shrink-0 place-items-center rounded-full bg-pine text-ink">
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" aria-hidden><path d="m5 12.5 4.5 4.5L19 7.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
  </span>
)

export function Reviews() {
  const p = featuredProperty
  const proof = [...(p.badges ?? []), `Hosted by ${site.host}, an Airbnb Superhost`]

  return (
    <section id="reviews" className="bg-bone py-24 sm:py-28 lg:py-32">
      <div className="container-x">
        <Reveal>
          <p className="eyebrow mb-5 flex items-center gap-2.5"><i className="h-[7px] w-[7px] rounded-full bg-pine" />Guest reviews</p>
          <h2 className="text-[clamp(40px,4.3vw,64px)] font-normal leading-none tracking-[-0.04em]">
            What guests say when they <em className="font-light italic text-moss">check out.</em>
          </h2>
        </Reveal>

        <div className="mt-11 grid items-start gap-5 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.6fr)]">
          {/* Summary card */}
          <Reveal className="lg:sticky lg:top-[104px]">
            <div className="rounded-3xl bg-white p-7 shadow-soft sm:p-8">
              <p className="flex items-end gap-3">
                <span className="font-display text-[clamp(88px,8vw,120px)] font-normal leading-[0.8] tracking-[-0.05em]">{p.rating?.toFixed(2)}</span>
                <span className="pb-1 text-[15px] text-stone">out of 5</span>
              </p>
              <div className="mt-5"><Stars size="h-5 w-5" /></div>
              <p className="mt-3 text-[15px] text-ink/80">from <b className="font-semibold text-ink">{p.reviewCount}</b> guest reviews on Airbnb</p>

              {/* Star breakdown (real figures from the listing) */}
              <ul className="mt-6 grid gap-2.5 border-t border-ink/[.12] pt-6" aria-label="Star rating breakdown">
                {featuredRatings.split.map((s, i) => (
                  <li key={s.stars} className="grid grid-cols-[14px_minmax(0,1fr)_38px] items-center gap-3 font-mono text-xs text-stone">
                    <span>{s.stars}</span>
                    <span className="h-1.5 overflow-hidden rounded-full bg-[color-mix(in_srgb,#F4F0E8_82%,#fff)]" aria-hidden>
                      <i className="bar-grow block h-full origin-left rounded-full bg-moss" style={{ transform: `scaleX(${s.pct / 100})`, ['--d' as string]: `${i * 90}ms` }} />
                    </span>
                    <span className="text-right">{s.pct}%</span>
                    <span className="sr-only">{s.stars} stars: {s.pct}% of reviews</span>
                  </li>
                ))}
              </ul>

              {/* Category scores */}
              <dl className="mt-6 grid grid-cols-3 gap-x-3 gap-y-4 border-t border-ink/[.12] pt-6">
                {featuredRatings.categories.map((c) => (
                  <div key={c.label}>
                    <dt className="text-[12.5px] text-stone">{c.label}</dt>
                    <dd className="font-display text-[22px] leading-tight">{c.score.toFixed(1)}</dd>
                  </div>
                ))}
              </dl>

              <ul className="mt-6 grid gap-3 border-t border-ink/[.12] pt-6">
                {proof.map((b) => <li key={b} className="flex items-center gap-3 text-[15px] font-medium"><Tick />{b}</li>)}
              </ul>

              <p className="mt-6 text-[13.5px] leading-relaxed text-stone">
                Ratings for our featured listing, <em>{p.name}</em>, on Airbnb ({featuredRatings.asOf}). Not necessarily every property in the portfolio.
              </p>
              {p.airbnbUrl && (
                <a href={p.airbnbUrl} target="_blank" rel="noreferrer" className="btn btn-ghost mt-6 h-[52px] text-ink">
                  Read every review <Arrow />
                </a>
              )}
            </div>
          </Reveal>

          {/* Review wall: CSS columns give the staggered masonry look */}
          <div className="gap-5 sm:columns-2">
            {guestReviews.map((r, i) => (
              <Reveal key={i} delay={(i % 2) * 120} className="mb-5 break-inside-avoid">
                {r.genuine ? (
                  <figure className="rounded-3xl bg-white p-6 shadow-soft sm:p-7">
                    <div className="flex items-center justify-between gap-3">
                      <Stars n={r.stars ?? 5} />
                      {r.stay && <span className="eyebrow truncate">{r.stay}</span>}
                    </div>
                    <blockquote className={`mt-5 font-display leading-[1.22] tracking-[-0.02em] ${r.text.length > 140 ? 'text-[22px]' : 'text-[26px]'}`}>{r.text}</blockquote>
                    <figcaption className="mt-6 flex items-center gap-3 border-t border-ink/[.12] pt-5">
                      <span className="grid h-10 w-10 place-items-center rounded-full bg-sand font-display text-lg">{r.author.charAt(0)}</span>
                      <span className="text-sm">
                        <span className="block font-semibold">{r.author}</span>
                        {(r.from || r.date || r.note) && <span className="text-stone">{[r.from, r.date, r.note].filter(Boolean).join(' · ')}</span>}
                      </span>
                    </figcaption>
                  </figure>
                ) : (
                  <figure className={`grid place-items-start rounded-3xl border-2 border-dashed border-ink/15 bg-white/40 p-6 sm:p-7 ${i % 3 === 0 ? 'min-h-[300px]' : 'min-h-[220px]'}`}>
                    <div className="flex w-full items-center justify-between gap-3 opacity-50">
                      <Stars />
                      {r.stay && <span className="eyebrow truncate">{r.stay}</span>}
                    </div>
                    <p className="mt-5 font-display text-[22px] leading-snug text-ink/40">“A genuine guest review will go here.”</p>
                    <p className="mt-auto pt-6 text-[13px] text-stone">🟡 Review slot {i + 1}: add a real excerpt from the Airbnb listing.</p>
                  </figure>
                )}
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
