import { Link } from 'react-router-dom'
import { site } from '../../data/site'
import { Arrow, ImageSlot, Reveal } from '../ui'

/*
 * About us — modelled on the reference's "Your crew" (host card) and
 * "How it works" (three steps on a ticked track). Every line comes from the
 * brief or the featured listing; nothing here is invented.
 */

const IMG = '/images/elegant-epsom-flat-period-building'

const Tick = ({ halo = false }: { halo?: boolean }) => (
  <span className={`grid h-[22px] w-[22px] shrink-0 place-items-center rounded-full bg-pine text-ink ${halo ? 'shadow-[0_0_0_8px_#F4F0E8]' : ''}`}>
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" aria-hidden><path d="m5 12.5 4.5 4.5L19 7.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
  </span>
)

const values = ['Personal service', 'Quality finish', 'Attention to detail']

const steps = [
  {
    n: '01', chip: 'Direct', title: 'Choose your home',
    text: 'Pick a property and your dates, then send an enquiry straight to the host. No middleman.',
    img: `${IMG}/08-living-lounge.webp`,
  },
  {
    n: '02', chip: 'Your choice', title: 'Arrive your way',
    text: 'A personal welcome from John, or convenient self check-in. Whichever suits your plans.',
    img: `${IMG}/14-front-entrance.webp`,
  },
  {
    n: '03', chip: '7+ nights: weekly clean', title: 'Settle straight in',
    text: 'Toiletries, bathrobes and welcome essentials in the fridge. Longer stays get a weekly clean and fresh bedding.',
    img: `${IMG}/06-bedroom-wallpaper.webp`,
  },
]

export function About() {
  return (
    <section id="about" className="bg-bone py-24 sm:py-28 lg:py-32">
      <div className="container-x">
        {/* Head block */}
        <div className="flex flex-wrap items-end justify-between gap-x-16 gap-y-7">
          <Reveal className="max-w-[720px]">
            <p className="eyebrow mb-5 flex items-center gap-2.5"><i className="h-[7px] w-[7px] rounded-full bg-pine" />About us</p>
            <h2 className="text-[clamp(40px,4.3vw,64px)] font-normal leading-none tracking-[-0.04em]">
              Created for guests, <em className="font-light italic text-moss">down to the detail.</em>
            </h2>
            <p className="mt-6 max-w-[560px] text-[17px] leading-relaxed text-stone">
              These homes were made specifically for guests, with careful attention to comfort, cleanliness and convenience.
            </p>
          </Reveal>
          <Reveal delay={100} className="flex flex-wrap items-center gap-x-6 gap-y-3">
            <Link to="/book" className="btn btn-dark h-[52px]">Book your stay <Arrow /></Link>
            <a href="#properties" className="group inline-flex items-center gap-2 text-[15px] font-semibold">
              <span className="bg-[linear-gradient(currentColor,currentColor)] bg-[length:0_1.5px] bg-left-bottom bg-no-repeat pb-0.5 transition-[background-size] duration-300 group-hover:bg-[length:100%_1.5px]">See the homes</span>
              <Arrow />
            </a>
          </Reveal>
        </div>

        {/* Host card + philosophy plate */}
        <div className="mt-14 grid grid-cols-1 gap-5 md:grid-cols-[minmax(0,0.85fr)_minmax(0,1.6fr)] lg:mt-16">
          <Reveal>
            <article className="flex h-full flex-col rounded-[26px] bg-white p-2.5 shadow-[0_12px_34px_rgba(20,32,28,.07)]">
              <div className="relative aspect-[4/5] overflow-hidden rounded-[18px]">
                <ImageSlot src={site.hostPhoto} alt={`${site.host}, your host`} tone="sand" label="Host photo to be added" />
              </div>
              <div className="flex flex-1 flex-col gap-2 px-3 pb-3 pt-5">
                <div className="flex items-baseline justify-between gap-3">
                  <h3 className="text-[27px] font-normal leading-[1.05]">{site.host}</h3>
                  <span className="whitespace-nowrap font-mono text-xs uppercase tracking-[0.1em] text-stone">~10 years</span>
                </div>
                <p className="text-[14.5px] font-semibold leading-snug text-moss">Your host · Airbnb Superhost</p>
                <p className="text-[15px] leading-normal text-stone">Hosting guests in Epsom for around a decade, and still runs every stay personally.</p>
                <p className="mt-auto flex items-center gap-2.5 border-t border-ink/[.12] pt-4 text-sm font-medium"><Tick />Superhost on Airbnb</p>
              </div>
            </article>
          </Reveal>

          <Reveal delay={120}>
            <div className="flex h-full flex-col justify-between gap-10 rounded-[26px] bg-sand p-7 sm:p-10 lg:p-12">
              <div>
                <p className="eyebrow">Our hospitality</p>
                <blockquote className="mt-6 font-display text-[clamp(30px,3vw,46px)] font-light leading-[1.1] tracking-[-0.03em]">
                  “Guests should feel at home from the moment they <em className="italic text-moss">arrive.</em>”
                </blockquote>
                <p className="mt-6 max-w-[560px] text-[16px] leading-relaxed text-ink/75">
                  We combine the privacy and independence of a home with the thoughtful details of a good hotel, so every stay feels easy from the first night.
                </p>
              </div>
              <ul className="grid gap-3 border-t border-ink/[.12] pt-7 sm:grid-cols-3">
                {values.map((v) => <li key={v} className="flex items-center gap-3 text-[15px] font-medium"><Tick />{v}</li>)}
              </ul>
            </div>
          </Reveal>
        </div>

        {/* How a stay works: ticked track with three step cards */}
        <Reveal className="mt-20 lg:mt-24">
          <p className="eyebrow flex items-center gap-2.5"><i className="h-[7px] w-[7px] rounded-full bg-pine" />How a stay works</p>
        </Reveal>
        <div className="relative mt-8">
          <i className="absolute bottom-0 left-[10px] top-0 w-px bg-ink/15 md:bottom-auto md:left-0 md:right-0 md:top-[11px] md:h-px md:w-auto" aria-hidden />
          <ol className="relative grid grid-cols-1 gap-6 md:grid-cols-3 md:gap-5">
            {steps.map((s, i) => (
              <li key={s.n}><Reveal delay={i * 110} className="grid h-full grid-cols-[22px_minmax(0,1fr)] gap-4 md:grid-cols-1 md:grid-rows-[auto_minmax(0,1fr)] md:gap-6">
                <span className="pt-4 md:pl-[18px] md:pt-0"><Tick halo /></span>
                <div className="group flex h-full flex-col rounded-[26px] bg-white p-2.5 shadow-[0_12px_34px_rgba(20,32,28,.07)] transition-[translate,box-shadow] duration-[450ms] ease-out2 hover:-translate-y-1 hover:shadow-[0_22px_60px_rgba(20,32,28,.12)]">
                  <div className="relative aspect-[16/11] overflow-hidden rounded-[18px]">
                    <ImageSlot src={s.img} alt={s.title} tone="sand" zoom />
                  </div>
                  <div className="grid gap-3 px-3.5 pb-4 pt-5">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <span className="eyebrow">Step {s.n}</span>
                      <span className="rounded-full bg-sand px-3 py-1 text-[12.5px] font-medium">{s.chip}</span>
                    </div>
                    <h3 className="text-[clamp(26px,2.2vw,32px)] font-normal leading-[1.05]">{s.title}</h3>
                    <p className="text-[15.5px] leading-relaxed text-stone">{s.text}</p>
                  </div>
                </div>
              </Reveal></li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  )
}
