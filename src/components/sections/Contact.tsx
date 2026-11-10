import { useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { featuredProperty } from '../../data/properties'
import { site } from '../../data/site'
import { bookingProvider } from '../../services/booking'
import { validateContact, type ContactFields, type Errors } from '../../lib/validation'
import { Arrow, FieldError, Reveal } from '../ui'

/*
 * Contact — modelled on the reference's closing "Book your first clean" card:
 * a photo with proof chips on the left, a builder on the right. Here the
 * builder is a short message form. Demo only: saved locally, never sent.
 */

const topics = ['Accommodation', 'Cleaning services', 'Something else']
const empty: ContactFields = { name: '', email: '', topic: topics[0], message: '' }

const Tick = () => (
  <span className="grid h-[22px] w-[22px] shrink-0 place-items-center rounded-full bg-pine text-ink">
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" aria-hidden><path d="m5 12.5 4.5 4.5L19 7.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
  </span>
)

export function Contact() {
  const [f, setF] = useState(empty)
  const [err, setErr] = useState<Errors<ContactFields>>({})
  const [done, setDone] = useState(false)
  const [busy, setBusy] = useState(false)
  const set = (k: keyof ContactFields, v: string) => { setF((s) => ({ ...s, [k]: v })); setErr((e) => ({ ...e, [k]: undefined })) }
  const p = featuredProperty

  async function submit(ev: FormEvent) {
    ev.preventDefault()
    const e = validateContact(f)
    setErr(e)
    if (Object.keys(e).length) return
    setBusy(true)
    await bookingProvider.submitContact(f)
    setBusy(false)
    setDone(true)
  }

  return (
    <section id="contact" className="bg-bone py-24 sm:py-28 lg:py-32">
      <div className="container-x">
        <Reveal>
          <div className="grid grid-cols-1 rounded-[26px] bg-white p-2.5 shadow-[0_30px_90px_rgba(20,32,28,.10)] md:grid-cols-[minmax(0,46fr)_minmax(0,54fr)] md:rounded-[32px] md:p-3.5">
            {/* Photo with proof chips */}
            <div className="relative flex min-w-0">
              <div className="relative aspect-[4/3] w-full overflow-hidden rounded-[18px] md:aspect-auto md:min-h-[560px]">
                <img src={site.heroImage} alt="Living room at the Elegant Epsom Flat" loading="lazy" className="absolute inset-0 h-full w-full object-cover" />
              </div>
              <span className="absolute left-3 top-3 inline-flex items-center gap-2 rounded-full bg-white/90 px-3.5 py-1.5 text-[13.5px] font-medium backdrop-blur md:left-[18px] md:top-[18px]">
                <i className="pulse-dot h-2 w-2 rounded-full bg-pine" aria-hidden />Hosted by {site.host}
              </span>
              {p.rating && (
                <span className="absolute bottom-3 left-3 inline-flex max-w-[calc(100%-24px)] items-baseline gap-2.5 rounded-[18px] bg-white px-4 py-2.5 text-sm font-medium shadow-[0_10px_34px_rgba(20,32,28,.16)] md:bottom-[18px] md:left-[18px] md:px-[18px] md:py-3">
                  <b className="font-display text-[24px] font-normal leading-none md:text-[30px]">{p.rating.toFixed(2)}</b>
                  <span>★ · {p.reviewCount} reviews on Airbnb</span>
                </span>
              )}
            </div>

            {/* Builder: the message form */}
            <div className="flex min-w-0 flex-col gap-6 px-3 pb-4 pt-7 md:gap-7 md:px-9 md:pb-8 md:pt-10 lg:pl-14 lg:pr-11">
              <div>
                <p className="eyebrow mb-5 flex items-center gap-2.5"><i className="h-[7px] w-[7px] rounded-full bg-pine" />Contact</p>
                <h2 className="text-[clamp(40px,4.3vw,64px)] font-normal leading-none tracking-[-0.04em]">
                  Let’s plan your <em className="font-light italic text-moss">stay.</em>
                </h2>
                <p className="mt-5 max-w-[520px] text-[17px] leading-relaxed text-stone">
                  Questions about a home, a longer stay or cleaning? Send a note straight to the team.
                </p>
              </div>

              {done ? (
                <div role="status" className="rise grid gap-4 rounded-[22px] bg-sand p-6 sm:p-7">
                  <p className="flex items-center gap-3 font-display text-[28px] leading-tight"><Tick />Message saved.</p>
                  <p className="text-[15px] leading-relaxed text-ink/75">
                    This is a demo: your message is stored on this device only. It has <b className="font-semibold text-ink">not</b> been emailed to anyone, and no reply will be sent.
                  </p>
                  <button className="btn btn-ghost w-fit text-ink" onClick={() => { setF(empty); setDone(false) }}>Write another</button>
                </div>
              ) : (
                <form onSubmit={submit} noValidate className="grid gap-5">
                  <fieldset>
                    <legend className="eyebrow mb-2.5">Enquiry about</legend>
                    <div className="flex flex-wrap gap-2">
                      {topics.map((t) => (
                        <button key={t} type="button" aria-pressed={f.topic === t} onClick={() => set('topic', t)}
                          className={`chip ${f.topic === t ? '!bg-moss !text-white' : ''}`}>{t}</button>
                      ))}
                    </div>
                  </fieldset>
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div><label className="label" htmlFor="ct-name">Name</label><input id="ct-name" autoComplete="name" className={`field ${err.name ? 'field-error' : ''}`} aria-invalid={!!err.name} aria-describedby={err.name ? 'ct-n' : undefined} value={f.name} onChange={(e) => set('name', e.target.value)} /><FieldError id="ct-n" msg={err.name} /></div>
                    <div><label className="label" htmlFor="ct-email">Email</label><input id="ct-email" type="email" autoComplete="email" className={`field ${err.email ? 'field-error' : ''}`} aria-invalid={!!err.email} aria-describedby={err.email ? 'ct-e' : undefined} value={f.email} onChange={(e) => set('email', e.target.value)} /><FieldError id="ct-e" msg={err.email} /></div>
                  </div>
                  <div><label className="label" htmlFor="ct-msg">Message</label><textarea id="ct-msg" rows={4} className={`field resize-y ${err.message ? 'field-error' : ''}`} aria-invalid={!!err.message} aria-describedby={err.message ? 'ct-m' : undefined} value={f.message} onChange={(e) => set('message', e.target.value)} /><FieldError id="ct-m" msg={err.message} /></div>

                  <div className="flex flex-col gap-5 border-t border-ink/[.12] pt-6 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
                    <button disabled={busy} className="btn btn-dark h-[52px] w-full sm:w-auto">{busy ? 'Saving…' : 'Send message'} {!busy && <Arrow />}</button>
                    <Link to={f.topic === 'Cleaning services' ? '/#cleaning' : '/book'} className="text-center text-[14.5px] font-medium text-stone hover:text-ink sm:text-left">
                      Or {f.topic === 'Cleaning services' ? 'request a cleaning quote' : 'start a booking enquiry'} <b className="font-semibold text-ink">→</b>
                    </Link>
                  </div>
                </form>
              )}

              <ul className="flex flex-col gap-2.5 text-[14.5px] font-medium sm:flex-row sm:flex-wrap sm:gap-x-6">
                <li className="flex items-center gap-2.5"><Tick />Direct with the host</li>
                <li className="flex items-center gap-2.5"><Tick />Stays and cleaning</li>
                <li className="flex items-center gap-2.5 text-stone"><span className="h-[22px] w-[22px] rounded-full border border-dashed border-ink/30" aria-hidden />Demo: nothing is sent</li>
              </ul>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
