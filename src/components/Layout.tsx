import { useEffect, useState } from 'react'
import { Link, Outlet, useLocation } from 'react-router-dom'
import { properties } from '../data/properties'
import { site } from '../data/site'
import { Arrow } from './ui'

const nav = [
  { label: 'Home', to: '/#home' },
  { label: 'Our Properties', to: '/#properties' },
  { label: 'Cleaning Services', to: '/#cleaning' },
  { label: 'About Us', to: '/#about' },
  { label: 'Contact', to: '/#contact' },
]

export function Logo({ light = false }: { light?: boolean }) {
  return (
    <Link to="/#home" className="inline-flex min-h-[44px] items-baseline whitespace-nowrap py-2 font-display text-[25px] font-medium leading-none tracking-[-0.03em] sm:text-[29px]" aria-label={`${site.brandName} home`}>
      {site.brandName}
      <i className={`not-italic ${light ? 'text-pine' : 'text-moss'}`}>.</i>
    </Link>
  )
}

function Header() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const loc = useLocation()

  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 40)
    on()
    window.addEventListener('scroll', on, { passive: true })
    return () => window.removeEventListener('scroll', on)
  }, [])
  useEffect(() => setOpen(false), [loc])

  return (
    <header className={`fixed inset-x-0 top-0 z-40 text-ink transition-[height] duration-300 ${scrolled ? 'h-[60px] md:h-[76px]' : 'h-[68px] md:h-[92px]'}`}>
      {/* bone backdrop + hairline that draws in once you scroll (as in the reference) */}
      <div className={`absolute inset-0 bg-bone transition-opacity duration-300 ${scrolled || open ? 'opacity-100' : 'opacity-0'}`} />
      <div className={`absolute inset-x-0 bottom-0 h-px origin-left bg-ink/[.12] transition-transform duration-[600ms] ease-out2 ${scrolled ? 'scale-x-100' : 'scale-x-0'}`} />
      <div className="container-x relative flex h-full items-center justify-between gap-6">
        <Logo />
        <nav aria-label="Main" className="hidden lg:block">
          <ul className="flex gap-[34px] text-[14.5px] font-medium">
            {nav.map((n) => (
              <li key={n.label}>
                <Link to={n.to} className="relative inline-flex min-h-[44px] items-center py-2 after:absolute after:inset-x-0 after:bottom-[9px] after:h-[1.5px] after:origin-left after:scale-x-0 after:bg-moss after:transition-transform after:duration-300 hover:after:scale-x-100">
                  {n.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <div className="flex items-center gap-2.5">
          <Link to="/book" className="btn btn-dark h-[42px] px-[18px] text-[13.5px] md:h-[46px] md:px-[22px] md:text-sm">Book Your Stay</Link>
          <button className="relative h-11 w-11 rounded-full bg-white shadow-chip lg:hidden" aria-label="Menu" aria-expanded={open} aria-controls="mobile-nav" onClick={() => setOpen(!open)}>
            <i className={`absolute left-[13px] right-[13px] top-[17px] h-[1.5px] rounded bg-current transition ${open ? 'translate-y-1 rotate-45' : ''}`} />
            <i className={`absolute left-[13px] right-[13px] top-[25px] h-[1.5px] rounded bg-current transition ${open ? '-translate-y-1 -rotate-45' : ''}`} />
          </button>
        </div>
      </div>
      {open && (
        <nav id="mobile-nav" aria-label="Mobile" className="container-x relative flex flex-col gap-1 bg-bone pb-6 lg:hidden">
          {nav.map((n) => (
            <Link key={n.label} to={n.to} className="border-b border-ink/10 py-3 font-display text-2xl">{n.label}</Link>
          ))}
        </nav>
      )}
    </header>
  )
}

/* Footer link with the reference's underline that grows on hover */
const FootLink = ({ to, children }: { to: string; children: React.ReactNode }) => (
  <Link to={to} className="inline-flex min-h-[36px] items-center bg-[linear-gradient(#0E5B4A,#0E5B4A)] bg-[length:0_1.5px] bg-[position:0_calc(100%-5px)] bg-no-repeat py-1 text-[15.5px] font-medium leading-snug transition-[background-size,color] duration-300 ease-out2 hover:bg-[length:100%_1.5px] hover:text-moss">
    {children}
  </Link>
)

const shortName = (n: string) => n.split(/ \| |, /)[0]

/* Contact rows: show the real value once added in site.ts, otherwise a clear placeholder */
const reach = [
  { label: 'Email', v: site.contact.accommodationEmail, href: (v: string) => `mailto:${v}` },
  { label: 'Phone', v: site.contact.phone, href: (v: string) => `tel:${v.replace(/\s/g, '')}` },
  { label: 'Area', v: site.contact.address || 'Epsom, Surrey', href: null },
]

export function Footer() {
  const cols = [
    { title: 'Stay', links: [...properties.map((p) => ({ label: shortName(p.name), to: `/properties/${p.slug}` })), { label: 'Book your stay', to: '/book' }] },
    { title: 'Explore', links: nav.slice(1).map((n) => ({ label: n.label, to: n.to })).concat([{ label: 'Reviews', to: '/#reviews' }, { label: 'Location', to: '/#location' }]) },
    { title: 'Cleaning', links: ['Regular cleaning', 'Deep cleaning', 'End of tenancy', 'Laundry services', 'Short-term rentals'].map((l) => ({ label: l, to: '/#cleaning' })) },
  ]

  return (
    <footer className="border-t border-ink/[.12] bg-bone text-ink">
      <div className="container-x pt-[clamp(72px,7vw,112px)]">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-2 xl:grid-cols-[minmax(0,300px)_minmax(0,1fr)_minmax(0,320px)] xl:gap-14">
          {/* Brand + contact rows */}
          <div className="grid content-start justify-items-start gap-5">
            <Logo />
            <p className="max-w-[30em] text-[15.5px] leading-relaxed text-stone">
              Guest-ready homes in Epsom, Surrey, hosted by {site.host}, alongside our own {site.cleaning.name}.
            </p>
            <Link to="/book" className="btn btn-dark">Book your stay <Arrow /></Link>
            <ul className="mt-2 w-full">
              {reach.map((r) => (
                <li key={r.label} className="grid min-h-[46px] grid-cols-[64px_minmax(0,1fr)] items-center gap-3 border-t border-ink/[.12]">
                  <span className="font-mono text-xs uppercase tracking-[0.12em] text-stone">{r.label}</span>
                  {r.v ? (
                    r.href ? <a href={r.href(r.v)} className="break-words py-2.5 text-[15px] font-medium hover:text-moss">{r.v}</a> : <span className="py-2.5 text-[15px] font-medium">{r.v}</span>
                  ) : (
                    <span className="py-2.5 text-[15px] text-stone">🟡 To be added</span>
                  )}
                </li>
              ))}
            </ul>
          </div>

          {/* Link columns */}
          <div className="grid grid-cols-2 gap-x-7 gap-y-9 sm:grid-cols-3 md:order-3 md:col-span-2 xl:order-none xl:col-span-1">
            {cols.map((c) => (
              <nav key={c.title} aria-label={c.title} className="min-w-0">
                <p className="eyebrow mb-3.5">{c.title}</p>
                <ul>{c.links.map((l) => <li key={l.label}><FootLink to={l.to}>{l.label}</FootLink></li>)}</ul>
              </nav>
            ))}
          </div>

          {/* Host plate (in place of the reference's opening-hours card) */}
          <div className="grid content-start justify-items-start gap-3.5 self-start rounded-[26px] bg-white p-6 md:order-2 xl:order-none shadow-[0_12px_34px_rgba(20,32,28,.07)]">
            <p className="eyebrow">Your host</p>
            <div className="flex items-center gap-4">
              <img src={site.hostPhoto} alt="" width={56} height={56} loading="lazy" className="h-14 w-14 shrink-0 rounded-full object-cover" />
              <p className="font-display text-[26px] leading-[1.1]">{site.host}, Airbnb Superhost</p>
            </div>
            <p className="flex items-center gap-2.5 rounded-full bg-[color-mix(in_srgb,#F4F0E8_82%,#fff)] px-3.5 py-2.5 text-sm font-medium">
              <i className="h-2 w-2 shrink-0 rounded-full bg-pine shadow-[0_0_0_4px_rgba(47,191,138,.22)]" aria-hidden />
              Around 10 years of hosting
            </p>
            <div className="mt-1 flex w-full flex-wrap items-center gap-x-4 gap-y-1 border-t border-ink/[.12] pt-3.5">
              <span className="eyebrow mr-1">Follow</span>
              {site.social.map((s) => s.href
                ? <a key={s.label} href={s.href} target="_blank" rel="noreferrer" className="inline-flex min-h-[36px] items-center text-[15px] font-semibold hover:text-moss">{s.label}</a>
                : <span key={s.label} className="inline-flex min-h-[36px] items-center text-[15px] text-stone" title="Link to be added">{s.label}</span>)}
            </div>
          </div>
        </div>

        {/* Giant wordmark */}
        <div className="mt-[clamp(56px,6vw,96px)] overflow-hidden" aria-hidden>
          <p className="select-none whitespace-nowrap pb-[.1em] pt-[.04em] text-center font-display text-[15vw] font-normal leading-[.86] tracking-[-0.045em] xl:text-[min(15vw,250px)]">
            {site.brandName}<i className="not-italic text-moss">.</i>
          </p>
        </div>

        <div className="mt-5 flex flex-wrap items-center gap-x-7 gap-y-2.5 border-t border-ink/[.12] pb-7 pt-5">
          <p className="mr-auto text-[13.5px] leading-normal text-stone">© {new Date().getFullYear()} {site.brandName}. Demo website: the brand name is a placeholder.</p>
          <ul className="flex flex-wrap gap-x-5 gap-y-1 text-[13.5px] font-medium text-stone">
            <li><Link to="/privacy" className="inline-flex min-h-[36px] items-center hover:text-ink">Privacy</Link></li>
            <li><Link to="/terms" className="inline-flex min-h-[36px] items-center hover:text-ink">Terms</Link></li>
            <li><button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="inline-flex min-h-[36px] items-center hover:text-ink">Back to top ↑</button></li>
          </ul>
        </div>
      </div>
    </footer>
  )
}

/** Smooth-scrolls to #hash targets after route changes; resets to top otherwise. */
function ScrollManager() {
  const { pathname, hash } = useLocation()
  useEffect(() => {
    if (hash) {
      const t = setTimeout(() => document.getElementById(hash.slice(1))?.scrollIntoView({ behavior: 'smooth' }), 60)
      return () => clearTimeout(t)
    }
    window.scrollTo({ top: 0 })
  }, [pathname, hash])
  return null
}

export function Layout() {
  return (
    <>
      <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-full focus:bg-ivory focus:px-4 focus:py-2">Skip to content</a>
      <ScrollManager />
      <Header />
      <main id="main"><Outlet /></main>
      <Footer />
    </>
  )
}
