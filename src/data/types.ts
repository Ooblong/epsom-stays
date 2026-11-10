export interface Review {
  author: string
  date?: string
  text: string
  /** false = placeholder text awaiting a genuine excerpt from the client's screenshots */
  genuine: boolean
}

export interface Property {
  slug: string
  name: string
  location: string
  /** Photo URLs, e.g. /images/<slug>/1.jpg (put files in /public/images). Empty = elegant placeholder. */
  images: string[]
  /** Only fill in values that are verified. Undefined = hidden in the UI. */
  guests?: number
  bedrooms?: number
  bathrooms?: number
  rating?: number
  reviewCount?: number
  badges?: string[]
  highlights?: string[]
  tagline: string
  description: string[]
  amenities?: string[]
  sleeping?: string[]
  locationNotes: string[]
  houseRules?: string[]
  reviews: Review[]
  airbnbUrl?: string
  /** The host's own live booking page (Hostaway booking engine) */
  bookingUrl?: string
  /** placeholder tint for image slots */
  tone: 'sage' | 'sand' | 'moss' | 'brass'
}
