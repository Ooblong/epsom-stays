import { useSearchParams } from 'react-router-dom'
import { EnquiryForm } from '../components/EnquiryForm'
import { SectionHead } from '../components/ui'
import { site } from '../data/site'
import { useSeo } from '../lib/seo'

export default function BookPage() {
  const [q] = useSearchParams()
  useSeo(`Book your stay | ${site.brandName}`, 'Choose a property, dates and guests to send a booking enquiry for a stay in Epsom, Surrey.')
  return (
    <div className="container-x pb-24 pt-36">
      <div className="grid gap-14 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <SectionHead eyebrow="Book your stay" title={<>Tell us when, and we’ll <em className="italic text-moss">take it from there.</em></>}>
            Choose a property, your dates and party size. The host will come back to you with availability.
          </SectionHead>
          <p className="mt-8 rounded-2xl bg-sand/70 p-5 text-sm leading-relaxed text-ink/70">
            🔵 <strong>Demo mode.</strong> Live availability, pricing and payment are not connected. This form validates your details and saves them on this device only.
          </p>
        </div>
        <div className="relative rounded-[2rem] border border-ink/10 bg-white/70 p-6 shadow-soft sm:p-8 lg:col-span-7">
          <EnquiryForm
            initial={{
              propertySlug: q.get('property') ?? '',
              checkIn: q.get('in') ?? '',
              checkOut: q.get('out') ?? '',
              guests: Number(q.get('guests')) || 2,
            }}
          />
        </div>
      </div>
    </div>
  )
}
