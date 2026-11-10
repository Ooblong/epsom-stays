import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { properties } from '../data/properties'
import { nightsBetween } from '../lib/dates'
import { DateRangePicker } from './DateRangePicker'
import { Select } from './Select'
import { Arrow } from './ui'

const propertyOptions = [{ value: '', label: 'Any property' }, ...properties.map((p) => ({ value: p.slug, label: p.name, hint: p.location }))]
const guestOptions = Array.from({ length: 8 }, (_, i) => ({ value: i + 1, label: `${i + 1} guest${i ? 's' : ''}` }))

/** Hero "quote bar": property, dates, guests → hands off to /book with prefilled values. */
export function BookingSearch() {
  const nav = useNavigate()
  const [slug, setSlug] = useState('')
  const [ci, setCi] = useState('')
  const [co, setCo] = useState('')
  const [guests, setGuests] = useState(2)
  const nights = ci && co ? nightsBetween(ci, co) : 0
  const propName = properties.find((p) => p.slug === slug)?.name

  const go = () => {
    const q = new URLSearchParams()
    if (slug) q.set('property', slug)
    if (ci) q.set('in', ci)
    if (co) q.set('out', co)
    q.set('guests', String(guests))
    nav(`/book?${q}`)
  }

  return (
    <div role="search" aria-label="Find a stay" className="pointer-events-auto relative flex flex-col gap-2.5 rounded-[26px] bg-white p-3 text-ink shadow-float lg:flex-row lg:items-center lg:gap-2 lg:rounded-full lg:p-2">
      <div className="flex flex-wrap items-center gap-2 lg:flex-nowrap">
        <Select variant="chip" label="Property" value={slug} options={propertyOptions} onChange={setSlug} className="min-w-0 flex-1 lg:w-[200px] lg:flex-none" />
        <div className="flex min-w-0 flex-[2] gap-2 lg:flex-none [&>div]:min-w-[128px]">
          <DateRangePicker compact checkIn={ci} checkOut={co} onChange={(a, b) => { setCi(a); setCo(b) }} />
        </div>
        <Select variant="chip" label="Guests" value={guests} options={guestOptions} onChange={setGuests} className="lg:w-[128px]" />
      </div>
      <div className="flex items-center justify-between gap-2.5 lg:gap-1.5">
        <span className="inline-flex h-[1.2em] min-w-[92px] items-center justify-center overflow-hidden px-3 font-display text-[30px] leading-none tracking-[-0.03em]" aria-live="polite">
          <span key={nights} className="roll whitespace-nowrap">
            {nights ? <>{nights}<span className="ml-1.5 font-sans text-sm tracking-normal text-stone">night{nights > 1 ? 's' : ''}</span></> : <span className="font-sans text-sm tracking-normal text-stone">Pick dates</span>}
          </span>
        </span>
        <button onClick={go} className="btn btn-dark h-[52px] flex-1 px-6 text-[15px] lg:flex-none" aria-label={propName ? `Check availability for ${propName}` : 'Check availability'}>
          Check availability <Arrow />
        </button>
      </div>
    </div>
  )
}
