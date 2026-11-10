import { useState, type FormEvent } from 'react'
import { properties, getProperty } from '../data/properties'
import { bookingProvider, type AvailabilityResult, type SavedRecord } from '../services/booking'
import { formatLong, nightsBetween } from '../lib/dates'
import { validateEnquiry, type EnquiryFields, type Errors } from '../lib/validation'
import { DateRangePicker } from './DateRangePicker'
import { Select } from './Select'
import { FieldError } from './ui'

interface Props {
  initial?: Partial<EnquiryFields>
  /** Lock to one property (used on property pages). */
  lockedSlug?: string
}

export function EnquiryForm({ initial, lockedSlug }: Props) {
  const [f, setF] = useState<EnquiryFields>({
    propertySlug: lockedSlug ?? initial?.propertySlug ?? '',
    checkIn: initial?.checkIn ?? '',
    checkOut: initial?.checkOut ?? '',
    guests: initial?.guests ?? 2,
    name: '',
    email: '',
    phone: '',
    message: '',
  })
  const [errors, setErrors] = useState<Errors<EnquiryFields>>({})
  const [avail, setAvail] = useState<AvailabilityResult | null>(null)
  const [checking, setChecking] = useState(false)
  const [sending, setSending] = useState(false)
  const [done, setDone] = useState<SavedRecord<EnquiryFields> | null>(null)

  const prop = getProperty(f.propertySlug)
  const set = <K extends keyof EnquiryFields>(k: K, v: EnquiryFields[K]) => {
    setF((s) => ({ ...s, [k]: v }))
    setErrors((e) => ({ ...e, [k]: undefined }))
    if (k === 'propertySlug' || k === 'checkIn' || k === 'checkOut' || k === 'guests') setAvail(null)
  }

  const stayErrors = () => {
    const e = validateEnquiry({ ...f, name: 'xx', email: 'a@b.co' }, prop?.guests)
    return e
  }

  async function check() {
    const e = stayErrors()
    setErrors(e)
    if (Object.keys(e).length) return
    setChecking(true)
    setAvail(await bookingProvider.checkAvailability(f))
    setChecking(false)
  }

  async function submit(ev: FormEvent) {
    ev.preventDefault()
    const e = validateEnquiry(f, prop?.guests)
    setErrors(e)
    if (Object.keys(e).length) {
      document.querySelector<HTMLElement>('[aria-invalid="true"]')?.focus()
      return
    }
    setSending(true)
    setDone(await bookingProvider.submitEnquiry(f))
    setSending(false)
  }

  if (done) {
    const d = done.data
    return (
      <div role="status" className="rounded-3xl border border-sage bg-sage-light/50 p-8">
        <p className="eyebrow">Enquiry prepared</p>
        <h3 className="mt-2 text-3xl">Thank you, {d.name.split(' ')[0]}.</h3>
        <p className="mt-3 text-sm leading-relaxed text-ink/75">
          Your details are saved on this device only. <strong>This is a demo — nothing has been emailed and no booking has been confirmed or priced.</strong> In
          the live site this would go to the host, who would reply with availability.
        </p>
        <dl className="mt-6 grid gap-3 rounded-2xl bg-white/70 p-5 text-sm sm:grid-cols-2">
          <div><dt className="text-ink/50">Property</dt><dd>{getProperty(d.propertySlug)?.name}</dd></div>
          <div><dt className="text-ink/50">Guests</dt><dd>{d.guests}</dd></div>
          <div><dt className="text-ink/50">Check-in</dt><dd>{formatLong(d.checkIn)}</dd></div>
          <div><dt className="text-ink/50">Check-out</dt><dd>{formatLong(d.checkOut)} ({nightsBetween(d.checkIn, d.checkOut)} nights)</dd></div>
          <div><dt className="text-ink/50">Contact</dt><dd>{d.email}{d.phone && ` · ${d.phone}`}</dd></div>
          <div><dt className="text-ink/50">Reference</dt><dd className="font-mono text-xs">{done.id.slice(0, 8)}</dd></div>
        </dl>
        <button className="btn btn-dark mt-6" onClick={() => { setDone(null); setAvail(null) }}>Make another enquiry</button>
      </div>
    )
  }

  return (
    <form onSubmit={submit} noValidate className="relative grid gap-5 sm:grid-cols-2">
      {!lockedSlug && (
        <div className="sm:col-span-2">
          <label htmlFor="enq-prop" className="label">Property</label>
          <Select id="enq-prop" label="Property" placeholder="Select a property…" value={f.propertySlug} invalid={!!errors.propertySlug} onChange={(v) => set('propertySlug', v)} options={properties.map((p) => ({ value: p.slug, label: p.name, hint: p.location }))} />
          <FieldError id="e-prop" msg={errors.propertySlug} />
        </div>
      )}

      <DateRangePicker checkIn={f.checkIn} checkOut={f.checkOut} onChange={(a, b) => { set('checkIn', a); set('checkOut', b) }} errorIn={errors.checkIn} errorOut={errors.checkOut} />

      <div>
        <label htmlFor="enq-guests" className="label">Guests{prop?.guests ? ` (max ${prop.guests})` : ''}</label>
        <input id="enq-guests" type="number" min={1} max={prop?.guests ?? 12} className={`field ${errors.guests ? 'field-error' : ''}`} value={f.guests} aria-invalid={!!errors.guests} onChange={(e) => set('guests', Number(e.target.value))} />
        <FieldError id="e-guests" msg={errors.guests} />
      </div>

      <div className="flex items-end">
        <button type="button" onClick={check} disabled={checking} className="btn btn-ghost w-full border-ink/30 text-ink hover:bg-sage-light">
          {checking ? 'Checking…' : 'Check availability'}
        </button>
      </div>

      {avail && (
        <p role="status" className="rounded-xl bg-sand/70 px-4 py-3 text-sm sm:col-span-2">
          🔵 {avail.note}
        </p>
      )}

      <div>
        <label htmlFor="enq-name" className="label">Your name</label>
        <input id="enq-name" autoComplete="name" className={`field ${errors.name ? 'field-error' : ''}`} value={f.name} aria-invalid={!!errors.name} onChange={(e) => set('name', e.target.value)} />
        <FieldError id="e-name" msg={errors.name} />
      </div>
      <div>
        <label htmlFor="enq-email" className="label">Email</label>
        <input id="enq-email" type="email" autoComplete="email" className={`field ${errors.email ? 'field-error' : ''}`} value={f.email} aria-invalid={!!errors.email} onChange={(e) => set('email', e.target.value)} />
        <FieldError id="e-email" msg={errors.email} />
      </div>
      <div className="sm:col-span-2">
        <label htmlFor="enq-phone" className="label">Phone (optional)</label>
        <input id="enq-phone" type="tel" autoComplete="tel" className={`field ${errors.phone ? 'field-error' : ''}`} value={f.phone} aria-invalid={!!errors.phone} onChange={(e) => set('phone', e.target.value)} />
        <FieldError id="e-phone" msg={errors.phone} />
      </div>
      <div className="sm:col-span-2">
        <label htmlFor="enq-msg" className="label">Anything we should know? (optional)</label>
        <textarea id="enq-msg" rows={3} className="field" value={f.message} onChange={(e) => set('message', e.target.value)} />
      </div>

      <div className="sm:col-span-2">
        <button type="submit" disabled={sending} className="btn btn-dark w-full sm:w-auto">{sending ? 'Preparing…' : 'Send booking enquiry'}</button>
        <p className="mt-3 text-xs text-ink/55">Demo only: no prices are shown and nothing is confirmed until the host replies.</p>
      </div>
    </form>
  )
}
