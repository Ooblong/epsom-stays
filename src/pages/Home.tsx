import { About } from '../components/sections/About'
import { Cleaning } from '../components/sections/Cleaning'
import { Contact } from '../components/sections/Contact'
import { Hero } from '../components/sections/Hero'
import { Location } from '../components/sections/Location'
import { Properties } from '../components/sections/Properties'
import { Reviews } from '../components/sections/Reviews'
import { WhyStay } from '../components/sections/WhyStay'
import { useSeo } from '../lib/seo'
import { site } from '../data/site'

export default function Home() {
  useSeo(`${site.brandName} | Boutique stays in Epsom, Surrey`, 'Beautifully maintained short-term rental homes with hotel-style comforts in central Epsom, Surrey — plus professional cleaning by Pure Living Cleaning Company.')
  return (
    <>
      <Hero />
      <Properties />
      <WhyStay />
      <Reviews />
      <Cleaning />
      <About />
      <Location />
      <Contact />
    </>
  )
}
