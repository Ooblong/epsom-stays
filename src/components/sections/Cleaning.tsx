import { useEffect, useRef, useState, type FormEvent } from 'react'
import { cleaningServices, serviceOptions } from '../../data/content'
import { site } from '../../data/site'
import { bookingProvider } from '../../services/booking'
import { validateCleaning, type CleaningFields, type Errors } from '../../lib/validation'
import { Arrow, FieldError, Reveal } from '../ui'
import { Select } from '../Select'

/*
 * Cleaning services — modelled on the reference's green "Pricing" section:
 * a segmented toggle over white service cards, one raised as the recommendation.
 * There are no prices in the brief, so cards describe the service instead and
 * every CTA leads to the quote form (which pre-selects that service).
 */

const STR = serviceOptions[serviceOptions.length - 1] // short-term rental turnover

// What each card shows. Lines only restate the brief.
const cards: { title: string; big: string; lines: string[] }[] = [
  { title: 'Regular Cleaning', big: 'Weekly or fortnightly', lines: ['Weekly visits', 'Fortnightly visits'] },
  { title: 'Deep Cleaning', big: 'Top to bottom', lines: ['Thorough, detailed clean', 'Every room, top to bottom'] },
  { title: 'End of Tenancy Cleaning', big: 'Move-in ready', lines: ['Prepared for new occupants', 'For tenants and landlords'] },
  { title: 'Laundry Services', big: 'Wash, dry, fold', lines: ['Washing and drying', 'Folding'] },
]

const audiences = [
  { id: 'homes', label: 'Homes', pick: 'Regular Cleaning' },
  { id: 'landlords', label: 'Landlords', pick: 'End of Tenancy Cleaning' },
  { id: 'hosts', label: 'Hosts', pick: STR },
] as const

const empty: CleaningFields = { name: '', contact: '', location: '', service: '', date: '', details: '' }

const Tick = () => (
  <span className="grid h-5 w-5 shrink-0 place-items-center rounded-full bg-pine text-ink">
    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.8" aria-hidden><path d="m5 12.5 4.5 4.5L19 7.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
  </span>
)

function QuoteForm({ preset }: { preset: { service: string; n: number } }) {
  const [f, setF] = useState(empty)
  const [err, setErr] = useState<Errors<CleaningFields>>({})
  const [busy, setBusy] = useState(false)
  const [done, setDone] = useState(false)
  const set = (k: keyof CleaningFields, v: string) => {
    setF((s) => ({ ...s, [k]: v }))
    setErr((e) => ({ ...e, [k]: undefined }))
  }
  // A card's "Get a quote" button pre-selects its service here.
  useEffect(() => { if (preset.n) set('service', preset.service) }, [preset])

  async function submit(ev: FormEvent) {
    ev.preventDefault()
    const e = validateCleaning(f)
    setErr(e)
    if (Object.keys(e).length) return
    setBusy(true)
    await bookingProvider.submitCleaningQuote(f)
    setBusy(false)
    setDone(true)
  }

  if (done)
    return (
      <div role="status" className="py-4">
        <p className="eyebrow flex items-center gap-2.5"><Tick />Quote request prepared</p>
        <h3 className="mt-4 text-[34px] font-normal leading-none tracking-[-0.03em]">Thank you, {f.name.split(' ')[0]}.</h3>
        <p className="mt-4 max-w-md text-[15px] leading-relaxed text-stone">Your request is saved on this device only. <strong className="text-ink">This is a demo: nothing has been sent</strong>, and no quote or price has been given.</p>
        <button className="btn btn-dark mt-6" onClick={() => { setF(empty); setDone(false) }}>Send another request</button>
      </div>
    )

  const c = (k: keyof CleaningFields) => `field ${err[k] ? 'field-error' : ''}`
  return (
    <form onSubmit={submit} noValidate className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      <div><label className="label" htmlFor="cq-name">Name</label><input id="cq-name" autoComplete="name" className={c('name')} aria-invalid={!!err.name} value={f.name} onChange={(e) => set('name', e.target.value)} /><FieldError id="cq-n" msg={err.name} /></div>
      <div><label className="label" htmlFor="cq-contact">Email or phone</label><input id="cq-contact" className={c('contact')} aria-invalid={!!err.contact} value={f.contact} onChange={(e) => set('contact', e.target.value)} /><FieldError id="cq-c" msg={err.contact} /></div>
      <div><label className="label" htmlFor="cq-loc">Property location</label><input id="cq-loc" placeholder="Town or postcode" className={c('location')} aria-invalid={!!err.location} value={f.location} onChange={(e) => set('location', e.target.value)} /><FieldError id="cq-l" msg={err.location} /></div>
      <div>
        <label className="label" htmlFor="cq-service">Service required</label>
        <Select id="cq-service" label="Service required" placeholder="Select a service…" value={f.service} invalid={!!err.service} onChange={(v) => set('service', v)} options={serviceOptions.map((s) => ({ value: s, label: s }))} />
        <FieldError id="cq-s" msg={err.service} />
      </div>
      <div className="sm:col-span-2"><label className="label" htmlFor="cq-date">Preferred date (optional)</label><input id="cq-date" type="date" className={c('date')} aria-invalid={!!err.date} value={f.date} onChange={(e) => set('date', e.target.value)} /><FieldError id="cq-d" msg={err.date} /></div>
      <div className="sm:col-span-2"><label className="label" htmlFor="cq-det">Additional details</label><textarea id="cq-det" rows={3} className="field" placeholder="Size of the property, number of rooms, access…" value={f.details} onChange={(e) => set('details', e.target.value)} /></div>
      <div className="sm:col-span-2"><button disabled={busy} className="btn btn-dark h-[52px] w-full px-6 text-[15px] sm:w-auto">{busy ? 'Preparing…' : <>Request a Cleaning Quote <Arrow /></>}</button></div>
    </form>
  )
}

export function Cleaning() {
  const [aud, setAud] = useState<(typeof audiences)[number]['id']>('homes')
  const [preset, setPreset] = useState({ service: '', n: 0 })
  const formRef = useRef<HTMLDivElement>(null)
  const pick = audiences.find((a) => a.id === aud)!.pick

  const quote = (service: string) => {
    setPreset((p) => ({ service, n: p.n + 1 }))
    formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    setTimeout(() => document.getElementById('cq-name')?.focus({ preventScroll: true }), 600)
  }

  return (
    <section id="cleaning" className="bg-moss py-24 text-white sm:py-28 lg:py-32">
      <div className="container-x">
        {/* Top: heading left, audience toggle right */}
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end lg:gap-12">
          <Reveal>
            <p className="eyebrow mb-5 flex items-center gap-2.5 !text-white/[.78]"><i className="h-[7px] w-[7px] rounded-full bg-pine" />{site.cleaning.name}</p>
            <h2 className="text-[clamp(40px,4.3vw,64px)] font-normal leading-none tracking-[-0.04em]">
              Spotless spaces, <br className="hidden sm:block" /><em className="font-light italic">every time.</em>
            </h2>
            <p className="mt-5 max-w-[34em] text-[17px] leading-relaxed text-white/[.82]">
              Our own cleaning company, with the same standards that keep our guests’ homes immaculate. For homeowners, landlords and hosts.
            </p>
          </Reveal>
          <Reveal delay={120}>
            <p className="eyebrow mb-3 !text-white/[.78]">Who it’s for</p>
            <div role="radiogroup" aria-label="Who the cleaning is for" className="inline-flex flex-wrap gap-1 rounded-full bg-white/[.12] p-1">
              {audiences.map((a) => (
                <button
                  key={a.id}
                  role="radio"
                  aria-checked={aud === a.id}
                  onClick={() => setAud(a.id)}
                  className={`h-11 rounded-full px-5 text-sm font-medium transition-colors duration-300 ${aud === a.id ? 'bg-white text-moss' : 'text-white hover:bg-white/10'}`}
                >
                  {a.label}
                </button>
              ))}
            </div>
          </Reveal>
        </div>

        {/* Service cards */}
        <div className="mt-14 grid items-start gap-5 sm:grid-cols-2 lg:grid-cols-4 lg:gap-4 xl:gap-5">
          {cards.map((c, i) => {
            const on = c.title === pick
            return (
              <Reveal key={c.title} delay={i * 90}>
                <article className={`relative flex flex-col rounded-3xl bg-white p-6 lg:p-5 xl:p-7 text-ink transition-[translate,box-shadow] duration-500 ease-out2 sm:p-7 ${on ? 'shadow-float lg:-translate-y-5' : 'shadow-soft'}`}>
                  <div className="flex items-start justify-between gap-3">
                    <h3 className="text-[28px] font-normal leading-[1.05] tracking-[-0.03em]">{c.title.replace(' Cleaning', '')}<span className="sr-only"> cleaning</span></h3>
                    {on && <span className="rise shrink-0 rounded-full bg-moss px-3.5 py-2 text-[13px] font-semibold text-white">Recommended</span>}
                  </div>
                  <p className="mt-2 text-[15px] text-stone">{cleaningServices[i].text}</p>
                  <p className="mt-6 font-display text-[34px] leading-none lg:text-[clamp(24px,2.3vw,34px)] tracking-[-0.03em]">{c.big}</p>
                  <ul className="mt-6 grid gap-3 border-t border-ink/[.12] pt-6">
                    {c.lines.map((l) => <li key={l} className="flex items-center gap-3 text-[15px]"><Tick />{l}</li>)}
                  </ul>
                  <button onClick={() => quote(c.title)} className={`btn mt-7 h-[52px] w-full ${on ? 'btn-dark' : 'btn-ghost text-ink'}`}>
                    Get a quote <Arrow />
                  </button>
                </article>
              </Reveal>
            )
          })}
        </div>

        {/* Short-term rental band */}
        <Reveal delay={100}>
          <div className={`mt-5 grid gap-6 rounded-3xl p-6 transition-colors duration-500 sm:p-8 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center ${pick === STR ? 'bg-white text-ink shadow-float' : 'bg-white/[.08] text-white ring-1 ring-white/15'}`}>
            <div>
              <p className={`eyebrow flex items-center gap-2.5 ${pick === STR ? '' : '!text-white/[.78]'}`}>
                For hosts &amp; landlords {pick === STR && <span className="rise rounded-full bg-moss px-3 py-1 font-sans text-[12px] normal-case tracking-normal text-white">Recommended</span>}
              </p>
              <h3 className="mt-3 text-[clamp(26px,2.4vw,34px)] font-normal leading-[1.1] tracking-[-0.03em]">Serviced accommodation &amp; short-term rental cleaning</h3>
              <p className={`mt-2 max-w-2xl text-[15px] ${pick === STR ? 'text-stone' : 'text-white/[.78]'}`}>Guest-ready turnovers from a team who look after holiday homes themselves.</p>
            </div>
            <button onClick={() => quote(STR)} className={`btn h-[52px] px-6 ${pick === STR ? 'btn-dark' : 'btn-light'}`}>Get a turnover quote <Arrow /></button>
          </div>
        </Reveal>

        {/* Quote form */}
        <div ref={formRef} className="scroll-mt-24">
          <Reveal delay={100}>
            <div className="mt-5 grid grid-cols-1 gap-8 rounded-3xl bg-white p-6 text-ink shadow-soft sm:p-8 lg:grid-cols-[minmax(0,0.75fr)_minmax(0,1.25fr)] lg:gap-14 lg:p-10">
              <div>
                <p className="eyebrow">Free, no-obligation quote</p>
                <h3 className="mt-3 text-[clamp(30px,3vw,42px)] font-normal leading-none tracking-[-0.03em]">Request a Cleaning Quote</h3>
                <p className="mt-4 text-[15px] leading-relaxed text-stone">Tell us about the property and the clean you need. Every quote is tailored, so no prices are shown until we’ve heard from you.</p>
              </div>
              <QuoteForm preset={preset} />
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
