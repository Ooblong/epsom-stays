import { useSeo } from '../lib/seo'
import { site } from '../data/site'

export function Legal({ kind }: { kind: 'privacy' | 'terms' }) {
  const title = kind === 'privacy' ? 'Privacy Policy' : 'Terms & Conditions'
  useSeo(`${title} | ${site.brandName}`, `${title} for ${site.brandName}.`)
  return (
    <div className="container-x max-w-3xl pb-24 pt-40">
      <h1 className="text-5xl">{title}</h1>
      <p className="mt-6 rounded-2xl bg-sand/70 p-5 text-sm">🟡 Placeholder page. The client’s solicitor-approved {title.toLowerCase()} should be added here before launch.</p>
    </div>
  )
}
