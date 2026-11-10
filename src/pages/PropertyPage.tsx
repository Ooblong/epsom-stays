import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { EnquiryForm } from '../components/EnquiryForm'
import { Lightbox, photoAlt } from '../components/Lightbox'
import { PropertyFacts } from '../components/PropertyCard'
import { ImageSlot, Reveal, Star } from '../components/ui'
import { getProperty, properties } from '../data/properties'
import { site } from '../data/site'
import { useSeo } from '../lib/seo'

const TBC = <p className="text-sm italic text-ink/50">🟡 To be confirmed with the host.</p>

/** Confirmed lines read normally; anything still "to be confirmed" is flagged. */
const Facts = ({ items }: { items: string[] }) => (
  <ul className="space-y-2 text-sm">
    {items.map((s) => /to be confirmed/i.test(s)
      ? <li key={s} className="italic text-ink/55">🟡 {s}</li>
      : <li key={s} className="flex gap-3"><span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-brass" />{s}</li>)}
  </ul>
)

function Block({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <Reveal>
      <section className="border-t border-ink/10 py-10">
        <h2 className="mb-5 text-3xl sm:text-4xl">{title}</h2>
        {children}
      </section>
    </Reveal>
  )
}

export default function PropertyPage() {
  const { slug } = useParams()
  const p = getProperty(slug ?? '')
  const [viewer, setViewer] = useState<number | null>(null)
  useSeo(p ? `${p.name} | ${site.brandName}` : 'Property not found', p?.tagline ?? '')

  if (!p)
    return (
      <div className="container-x py-40 text-center">
        <h1 className="text-5xl">Property not found</h1>
        <Link to="/#properties" className="btn btn-dark mt-8">Back to our properties</Link>
      </div>
    )

  // Gallery uses real photos when present, otherwise five placeholders to preview the layout.
  const hasPhotos = p.images.length > 0
  const gallery: (string | undefined)[] = hasPhotos ? p.images : [undefined, undefined, undefined, undefined, undefined]
  const open = (i: number) => hasPhotos && setViewer(i)
  const others = properties.filter((o) => o.slug !== p.slug).slice(0, 3)

  return (
    <article className="pt-24">
      <div className="container-x">
        <nav aria-label="Breadcrumb" className="py-4 text-sm text-ink/60">
          <Link to="/" className="hover:text-ink">Home</Link> / <Link to="/#properties" className="hover:text-ink">Properties</Link> / <span className="text-ink">{p.name}</span>
        </nav>

        <header className="max-w-3xl pb-8">
          <h1 className="text-4xl leading-[1.05] sm:text-6xl">{p.name}</h1>
          <p className="mt-3 flex flex-wrap items-center gap-x-3 text-sm text-ink/70">
            <span>{p.location}</span>
            {p.rating && <span className="flex items-center gap-1 font-medium text-ink"><Star className="text-brass" /> {p.rating.toFixed(2)} · {p.reviewCount} reviews</span>}
          </p>
          <PropertyFacts p={p} className="mt-1 text-sm" />
          {p.badges && <ul className="mt-4 flex flex-wrap gap-2">{p.badges.map((b) => <li key={b} className="rounded-full border border-moss/30 px-3 py-1 text-xs">{b}</li>)}</ul>}
        </header>

        {/* Gallery: 1 large + 4 small; any photo opens the full-screen viewer */}
        <div className="relative grid gap-3 md:grid-cols-4 md:grid-rows-2">
          <button className="group relative aspect-[4/3] overflow-hidden rounded-3xl md:col-span-2 md:row-span-2 md:aspect-auto" onClick={() => open(0)} disabled={!hasPhotos} aria-label={hasPhotos ? `Open photos: ${photoAlt(gallery[0]!)}` : 'Photos to be added'}>
            <ImageSlot src={gallery[0]} alt={gallery[0] ? photoAlt(gallery[0]) : p.name} tone={p.tone} eager zoom />
          </button>
          {gallery.slice(1, 5).map((g, i) => (
            <button key={i} onClick={() => open(i + 1)} disabled={!hasPhotos} aria-label={g ? `Open photo: ${photoAlt(g)}` : 'Photo to be added'} className="group hidden aspect-[4/3] overflow-hidden rounded-3xl md:block">
              <ImageSlot src={g} alt={g ? photoAlt(g) : p.name} tone={p.tone} label="Photo to be added" zoom />
            </button>
          ))}
          {p.images.length > 1 && (
            <button onClick={() => open(0)} className="chip absolute bottom-4 right-4 bg-white shadow-chip">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden><rect x="3" y="3" width="7" height="7" rx="1.5" /><rect x="14" y="3" width="7" height="7" rx="1.5" /><rect x="3" y="14" width="7" height="7" rx="1.5" /><rect x="14" y="14" width="7" height="7" rx="1.5" /></svg>
              Show all {p.images.length} photos
            </button>
          )}
        </div>
        {viewer !== null && <Lightbox images={p.images} index={viewer} onIndex={setViewer} onClose={() => setViewer(null)} title={p.name} />}

        <div className="mt-12 grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <p className="font-display text-3xl leading-snug sm:text-4xl">{p.tagline}</p>
            <div className="mt-6 space-y-4 text-base leading-relaxed text-ink/75">{p.description.map((d, i) => <p key={i}>{d}</p>)}</div>

            <Block title="Amenities">
              {p.amenities ? (
                <ul className="grid gap-x-8 gap-y-3 sm:grid-cols-2">{p.amenities.map((a) => <li key={a} className="flex gap-3 text-sm"><span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-brass" />{a}</li>)}</ul>
              ) : TBC}
            </Block>
            <Block title="Bedrooms & sleeping arrangements">
              {p.bedrooms || p.bathrooms ? <p className="mb-3 text-sm">{[p.bedrooms && `${p.bedrooms} bedroom${p.bedrooms > 1 ? 's' : ''}`, p.bathrooms && `${p.bathrooms} bathroom${p.bathrooms > 1 ? 's' : ''}`, p.guests && `sleeps up to ${p.guests}`].filter(Boolean).join(' · ')}</p> : null}
              {p.sleeping ? <Facts items={p.sleeping} /> : TBC}
            </Block>
            <Block title="Location">
              <ul className="space-y-2 text-sm text-ink/75">{p.locationNotes.map((l) => <li key={l}>{l}</li>)}</ul>
              <div className="mt-5 h-64 overflow-hidden rounded-3xl border border-ink/10"><iframe title={`Map near ${p.name}`} src={site.mapEmbed} loading="lazy" className="h-full w-full grayscale-[.4]" /></div>
              <p className="mt-2 text-xs text-ink/50">Approximate area map. Exact address shared on booking.</p>
            </Block>
            <Block title="House rules">
              {p.houseRules ? <Facts items={p.houseRules} /> : TBC}
            </Block>
            <Block title="Guest reviews">
              {p.reviews.length ? (
                <div className="space-y-4">
                  {p.rating && <p className="text-sm text-ink/70">{p.rating.toFixed(2)} from {p.reviewCount} Airbnb reviews.</p>}
                  {p.reviews.map((r, i) => (
                    <figure key={i} className="rounded-2xl bg-sand/60 p-6"><blockquote className="font-display text-xl">“{r.text}”</blockquote><figcaption className="mt-3 text-sm text-ink/60">{r.author}{r.date && ` · ${r.date}`}{!r.genuine && ' · 🟡 placeholder'}</figcaption></figure>
                  ))}
                </div>
              ) : <p className="text-sm italic text-ink/50">🟡 Reviews for this property will appear here once supplied.</p>}
            </Block>
          </div>

          <aside className="lg:col-span-5">
            <div id="enquire" className="relative rounded-[2rem] border border-ink/10 bg-white/70 p-6 shadow-soft sm:p-8 lg:sticky lg:top-24">
              <p className="eyebrow">Availability &amp; enquiry</p>
              <h2 className="mb-6 mt-2 text-3xl">Enquire about this stay</h2>
              <EnquiryForm lockedSlug={p.slug} />
              {p.bookingUrl && (
                <p className="mt-5 border-t border-ink/10 pt-4 text-sm text-ink/65">
                  Prefer to book now? <a href={p.bookingUrl} target="_blank" rel="noreferrer" className="font-semibold text-ink underline underline-offset-4 hover:text-moss">Use the live booking site ↗</a>
                </p>
              )}
            </div>
          </aside>
        </div>

        <section className="mt-20 border-t border-ink/10 py-16">
          <h2 className="mb-8 text-3xl sm:text-4xl">More places to stay</h2>
          <div className="grid gap-6 sm:grid-cols-3">
            {others.map((o) => (
              <Link key={o.slug} to={`/properties/${o.slug}`} className="group block">
                <div className="aspect-[4/3] overflow-hidden rounded-2xl"><ImageSlot src={o.images[0]} alt={o.name} tone={o.tone} zoom /></div>
                <h3 className="mt-3 text-xl">{o.name}</h3>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </article>
  )
}
