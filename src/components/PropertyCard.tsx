import { Link } from 'react-router-dom'
import type { Property } from '../data/types'
import { Arrow, ImageSlot, Star } from './ui'

/** Reusable listing card. Only verified facts are displayed. */
export function PropertyFacts({ p, className = '' }: { p: Property; className?: string }) {
  const facts = [
    p.guests && `${p.guests} guests`,
    p.bedrooms && `${p.bedrooms} bedroom${p.bedrooms > 1 ? 's' : ''}`,
    p.bathrooms && `${p.bathrooms} bathroom${p.bathrooms > 1 ? 's' : ''}`,
  ].filter(Boolean) as string[]
  if (!facts.length) return null
  return <p className={className}>{facts.join(' · ')}</p>
}

export function PropertyCard({ p, className = '', tall = false }: { p: Property; className?: string; tall?: boolean }) {
  return (
    <Link to={`/properties/${p.slug}`} className={`group block ${className}`} aria-label={`View ${p.name}`}>
      <div className={`relative overflow-hidden rounded-[1.75rem] ${tall ? 'aspect-[4/5]' : 'aspect-[4/3]'}`}>
        <ImageSlot src={p.images[0]} alt={p.name} tone={p.tone} zoom />
        <div className="absolute inset-0 bg-gradient-to-t from-ink/55 via-transparent to-transparent opacity-80 transition group-hover:opacity-100" />
        {p.badges?.[0] && (
          <span className="absolute left-4 top-4 rounded-full bg-ivory/90 px-3 py-1 text-[11px] font-medium tracking-wide backdrop-blur">{p.badges[0]}</span>
        )}
        <span className="absolute bottom-4 right-4 grid h-11 w-11 translate-y-2 place-items-center rounded-full bg-ivory text-ink opacity-0 transition duration-500 group-hover:translate-y-0 group-hover:opacity-100">
          <Arrow />
        </span>
      </div>
      <div className="px-1 pt-5">
        <div className="flex items-start justify-between gap-4">
          <h3 className="text-2xl leading-tight">{p.name}</h3>
          {p.rating && (
            <span className="mt-1 flex shrink-0 items-center gap-1 text-sm font-medium">
              <Star className="text-brass" /> {p.rating.toFixed(2)}
              {p.reviewCount && <span className="font-normal text-ink/50">({p.reviewCount})</span>}
            </span>
          )}
        </div>
        <p className="mt-1 text-sm text-ink/60">{p.location}</p>
        <PropertyFacts p={p} className="mt-2 text-sm text-ink/80" />
        <span className="mt-4 inline-flex items-center gap-2 border-b border-ink/30 pb-0.5 text-sm font-medium transition group-hover:gap-3 group-hover:border-ink">
          View Property <Arrow />
        </span>
      </div>
    </Link>
  )
}
