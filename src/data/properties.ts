import type { Property } from './types'
import { guestReviews } from './content'

/**
 * PROPERTY DATA — the single place to add or edit listings.
 * Add a new object to this array and a card + full property page appear automatically.
 *
 * For this demo nothing is invented: fields without verified information
 * are left out, and the UI shows a gentle "to be confirmed" note instead.
 */

const tbc = (what: string) => `${what} — to be confirmed with the host`

export const properties: Property[] = [
  {
    slug: 'elegant-epsom-flat-period-building',
    // NOTE: assumed to be the featured Airbnb listing (rooms/14028511). Confirm with client.
    name: 'Elegant Epsom Flat in Period Building',
    location: 'Central Epsom, Surrey',
    // First photo is the card cover. File names double as photo descriptions.
    images: [
      '01-living-room',
      '02-period-exterior',
      '03-living-entrance',
      '04-kitchen-dining',
      '05-kitchen',
      '06-bedroom-wallpaper',
      '07-bedroom-two',
      '08-living-lounge',
      '09-dining-table',
      '10-living-corner',
      '11-bedroom-ensuite',
      '12-bedroom-two-alt',
      '13-patio',
      '14-front-entrance',
    ].map((f) => `/images/elegant-epsom-flat-period-building/${f}.webp`),
    guests: 4,
    bedrooms: 2,
    bathrooms: 2,
    rating: 4.95,
    reviewCount: 194,
    badges: ['Guest Favourite', 'Top 5% of eligible Airbnb homes'],
    highlights: ['Secure private parking', 'Self check-in or personal welcome'],
    tagline: 'Two bedrooms, two bathrooms and the quiet confidence of a well-run hotel.',
    description: [
      'A thoughtfully furnished two-bedroom, two-bathroom home in the heart of Epsom, created specifically for guests — with careful attention to comfort, cleanliness and convenience.',
      'You get the privacy and independence of a home, with the little details you would expect from a good hotel: complimentary toiletries, bathrobes, and welcome essentials stocked in the fridge.',
    ],
    amenities: [
      'Secure private parking',
      'Fully equipped kitchen',
      'Complimentary toiletries',
      'Bathrobes',
      'Essential supplies provided',
      'Welcome essentials stocked in the fridge',
      'Personal welcome or convenient self check-in',
      'Optional housekeeping and linen changes',
      'Weekly cleaning and bedding change for stays of 7+ nights',
    ],
    sleeping: [tbc('Bed types and sleeping arrangements')],
    locationNotes: [
      'Central Epsom location.',
      'Close to the town centre, local restaurants and shops, and Epsom railway station.',
    ],
    // From the host's booking site (epsomelegance.holidayfuture.com/listings/231558)
    houseRules: ['Check-in from 3 pm', 'Check-out by 11 am', 'No pets', 'No smoking inside'],
    // Genuine excerpts from the Airbnb listing (see guestReviews in content.ts)
    reviews: guestReviews.filter((r) => r.genuine).map((r) => ({ author: r.author, date: r.date, text: r.text, genuine: true })),
    airbnbUrl: 'https://www.airbnb.co.uk/rooms/14028511',
    bookingUrl: 'https://epsomelegance.holidayfuture.com/listings/231558',
    tone: 'sage',
  },

  /* ── The three below are taken from the host's own websites ──────────────
   * epsomservicedapartments.com and their booking site
   * epsomelegance.holidayfuture.com (text, facts and photos, Nov 2026). */
  {
    slug: 'elegant-epsom-family',
    name: 'Elegant Epsom Family',
    location: 'Central Epsom, Surrey',
    images: Array.from({ length: 16 }, (_, i) => `/images/elegant-epsom-family/${String(i + 1).padStart(2, '0')}.webp`),
    guests: 4,
    bedrooms: 2,
    bathrooms: 2,
    highlights: ['Secure private parking', 'Made for families with young children'],
    tagline: 'A family-friendly period apartment, a short stroll from the station.',
    description: [
      'Welcome to your family friendly home away from home in the heart of Epsom. Top-rated shops, restaurants and the station are a short stroll from the doorstep, and the period building has been thoughtfully transformed to combine the warmth of a home with the attention to detail of a high-end hotel.',
      'Designed for families with younger children in mind, with everything you need, from quality toiletries to kitchen essentials, at no extra cost. Secure private parking is available for one car, with more options nearby.',
      'Check-in can be warm and personal, or as easy as entering a code. Stays of 7 days or more include a complimentary clean and bedding change each week.',
    ],
    amenities: [
      'Secure private parking (one car)', 'Fully equipped kitchen', 'Dishwasher', 'Washing machine', 'Fast WiFi', 'Smart TV',
      'Baby cot', 'Suitable for infants and children', 'Bath', 'Balcony / patio with outdoor furniture', 'Toiletries and linens provided',
      'Coffee and tea maker', 'Room-darkening blinds', 'Long stays welcome',
    ],
    sleeping: ['Main bedroom: double bed with ample storage', 'Second bedroom: full-size bunk beds and a small work area'],
    locationNotes: [
      'Central Epsom, with shops and restaurants a short stroll away.',
      'Around a 5-minute walk to Epsom station, for trains to Central London.',
    ],
    houseRules: ['Check-in from 3 pm', 'Check-out by 11 am', 'No pets', 'No smoking inside'],
    reviews: [],
    bookingUrl: 'https://epsomelegance.holidayfuture.com/listings/231563',
    tone: 'sand',
  },
  {
    slug: 'quiet-epsom-flat-near-college',
    name: 'Quiet Flat, 5-Min Walk to Epsom College',
    location: 'Epsom, Surrey',
    images: Array.from({ length: 10 }, (_, i) => `/images/quiet-epsom-flat-near-college/${String(i + 1).padStart(2, '0')}.webp`),
    guests: 4,
    bedrooms: 2,
    bathrooms: 1,
    highlights: ['5-minute walk to Epsom College', 'Quiet, leafy street'],
    tagline: 'A bright, quiet flat that’s ideal for visiting parents.',
    description: [
      'A bright, comfortable flat in a quiet, leafy corner of Epsom. Just a 5-minute walk to Epsom College, 15 minutes to Laine’s School and Epsom station, and 10 minutes to the town centre: ideal for visiting parents.',
      'Alexandra Recreation Ground, with its park, tennis courts and play area, is right on the doorstep for a peaceful stroll.',
    ],
    amenities: ['Free parking', 'Kitchen with cooking basics', 'Washing machine', 'WiFi', 'TV', 'Coffee and tea maker', 'Heating', 'Toiletries provided', 'Iron'],
    locationNotes: [
      '5-minute walk to Epsom College.',
      '15 minutes to Laine’s School and Epsom station; 10 minutes to the town centre.',
      'Alexandra Recreation Ground on the doorstep.',
    ],
    houseRules: ['Check-in from 3 pm', tbc('Check-out time (listed as “12 am”)'), 'No pets', 'No smoking inside'],
    reviews: [],
    bookingUrl: 'https://epsomelegance.holidayfuture.com/listings/572123',
    tone: 'moss',
  },
  {
    slug: 'three-bed-family-home-near-hospital',
    name: 'Cosy 3-Bed Family Home near Central Epsom',
    location: 'Near Epsom Hospital, Surrey',
    images: Array.from({ length: 17 }, (_, i) => `/images/three-bed-family-home-near-hospital/${String(i + 1).padStart(2, '0')}.webp`),
    guests: 6,
    bedrooms: 3,
    bathrooms: 2,
    highlights: ['Private driveway parking', 'Garden with outdoor kitchen', '500 m from Epsom Hospital'],
    tagline: 'Space for the whole family, with a garden and driveway parking.',
    description: [
      'A beautifully presented 3-bedroom home in a quiet Epsom setting, with private driveway parking, a landscaped garden complete with an outdoor kitchen, and a children’s play area.',
      'Just 500 m from Epsom Hospital and a 15-minute walk into the town centre: well placed whether you’re visiting family, working locally or exploring Surrey. Ideal for families, business travellers or groups of friends who need extra space.',
    ],
    amenities: ['Private driveway parking', 'Landscaped garden with outdoor kitchen', 'Children’s play area', 'Kitchen with cooking basics', 'Washing machine', 'WiFi', 'Laptop-friendly workspace', 'TV', 'Heating', 'Outdoor furniture'],
    locationNotes: ['500 m from Epsom Hospital.', 'A 15-minute walk into Epsom town centre.'],
    houseRules: ['Check-in from 3 pm', 'Check-out by 11 am', 'No pets', 'No smoking inside'],
    reviews: [],
    bookingUrl: 'https://epsomelegance.holidayfuture.com/listings/585504',
    tone: 'brass',
  },
  {
    slug: 'epsom-family-home-near-hobbledown',
    name: 'Epsom Family Home | Parking | Near Hobbledown',
    location: 'Epsom, Surrey',
    images: [],
    highlights: ['Parking', 'Near Hobbledown'],
    tagline: 'A family home with parking, near Hobbledown.',
    description: ['Full description to be supplied from the Airbnb listing.'],
    amenities: ['Parking'],
    locationNotes: ['Near Hobbledown (per listing title).'],
    reviews: [],
    tone: 'sage',
  },
]

export const getProperty = (slug: string) => properties.find((p) => p.slug === slug)
export const featuredProperty = properties.find((p) => p.rating) ?? properties[0]
