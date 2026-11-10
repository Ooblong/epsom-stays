export const whyStay = [
  { title: 'Thoughtfully furnished homes', text: 'Created for guests first, with care for comfort and cleanliness.', big: true },
  { title: 'Central Epsom', text: 'Walk to the town centre, restaurants and the railway station.' },
  { title: 'Secure private parking', text: 'At applicable properties.' },
  { title: 'Hotel comforts, home privacy', text: 'Toiletries, bathrobes and welcome essentials — behind your own front door.', big: true },
  { title: 'Flexible self check-in', text: 'Or a personal welcome from your host.' },
  { title: 'Fully equipped kitchens', text: 'Plus the everyday essentials, stocked.' },
  { title: 'Optional housekeeping', text: 'Linen changes and cleaning on request.' },
  { title: 'Genuine hospitality', text: 'A Superhost with around ten years of experience.' },
]

/**
 * "Why stay with us" room tour of the featured flat.
 * Each point is a comfort from the client brief (or something plainly visible in the photo),
 * pinned at x/y % on the photo. Points without x/y appear in the list only.
 */
const flat = '/images/elegant-epsom-flat-period-building'
export const comfortTour: { room: string; photo: string; alt: string; points: { label: string; x?: number; y?: number }[] }[] = [
  {
    room: 'Living room',
    photo: `${flat}/03-living-entrance.webp`,
    alt: 'Open-plan living room with sofa, front door and kitchen beyond',
    points: [
      { label: 'Personal welcome or flexible self check-in', x: 42, y: 52 },
      { label: 'Thoughtfully furnished, made for guests', x: 70, y: 66 },
      { label: 'Period sash windows with shutters', x: 21, y: 40 },
      { label: 'Open-plan living, dining and kitchen', x: 86, y: 44 },
    ],
  },
  {
    room: 'Kitchen',
    photo: `${flat}/04-kitchen-dining.webp`,
    alt: 'Kitchen with breakfast bar and dining table for four',
    points: [
      { label: 'Fully equipped kitchen', x: 77, y: 52 },
      { label: 'Welcome essentials stocked in the fridge', x: 37, y: 42 },
      { label: 'Everyday essentials supplied', x: 88, y: 47 },
      { label: 'Dining table for four', x: 25, y: 60 },
    ],
  },
  {
    room: 'Bedrooms',
    photo: `${flat}/06-bedroom-wallpaper.webp`,
    alt: 'Double bedroom with ensuite and shuttered sash window',
    points: [
      { label: 'Complimentary toiletries and bathrobes', x: 6, y: 52 },
      { label: 'Optional housekeeping and linen changes', x: 33, y: 63 },
      { label: 'Weekly clean and bedding change on stays of 7+ nights', x: 52, y: 80 },
      { label: 'Period sash window with shutters', x: 88, y: 38 },
      { label: 'Two bedrooms, two bathrooms' },
    ],
  },
  {
    room: 'Outside',
    photo: `${flat}/02-period-exterior.webp`,
    alt: 'Period building with courtyard seating in central Epsom',
    points: [
      { label: 'Elegant period building', x: 63, y: 24 },
      { label: 'Outdoor seating area', x: 48, y: 82 },
      { label: 'Epsom town centre on your doorstep', x: 6, y: 40 },
      { label: 'Secure private parking' },
    ],
  },
]

/**
 * GUEST REVIEWS for the home page wall.
 * Paste GENUINE excerpts from the Airbnb listing here and set `genuine: true`.
 * Slots with `genuine: false` render as clearly-marked empty placeholders.
 */
// Copied from airbnb.co.uk/rooms/14028511 reviews on 10 Nov 2026 (wording kept as written; excerpts end at a full sentence).
export const guestReviews: { text: string; author: string; from?: string; date?: string; stay?: string; stars?: number; note?: string; genuine: boolean }[] = [
  { text: 'Lovely Airbnb in the centre of Epsom within walking distance of local restaurants and shops.', author: 'Julia', date: 'September 2026', stay: 'Elegant Epsom Flat', stars: 5, genuine: true },
  { text: 'Great place next to a good pub. Nice and quiet bedrooms, plenty of space, spotlessly clean', author: 'Paul', date: 'October 2026', stay: 'Elegant Epsom Flat', stars: 5, genuine: true },
  { text: 'John is an excellent host and was extremely helpful. Will definitely stay here again.', author: 'Paul', date: 'July 2026', stay: 'Elegant Epsom Flat', stars: 5, genuine: true },
  { text: 'Great stay in the centre of Epsom. Really enjoyed. Modern, inviting & homely. Thank you', author: 'Heather', date: 'September 2026', stay: 'Elegant Epsom Flat', stars: 5, genuine: true },
  { text: 'The apartment is perfect, very clean and fully equipped. I will definitely come back.', author: 'Juliana', date: 'June 2026', stay: 'Elegant Epsom Flat', stars: 5, note: 'Translated by Airbnb', genuine: true },
  { text: 'Great apartment in a fantastic location. Great local bars and restaurants', author: 'Simon', date: 'October 2026', stay: 'Elegant Epsom Flat', stars: 5, genuine: true },
]

/** Star breakdown + category scores shown on the featured listing (Airbnb, 10 Nov 2026). */
export const featuredRatings = {
  split: [
    { stars: 5, pct: 95 },
    { stars: 4, pct: 5 },
    { stars: 3, pct: 0 },
    { stars: 2, pct: 0 },
    { stars: 1, pct: 0 },
  ],
  categories: [
    { label: 'Cleanliness', score: 4.9 },
    { label: 'Accuracy', score: 4.9 },
    { label: 'Check-in', score: 4.9 },
    { label: 'Communication', score: 5.0 },
    { label: 'Location', score: 4.9 },
    { label: 'Value', score: 4.8 },
  ],
  asOf: 'November 2026',
}

export const cleaningServices = [
  { id: 'regular', title: 'Regular Cleaning', text: 'Weekly or fortnightly cleaning to keep your home consistently fresh.' },
  { id: 'deep', title: 'Deep Cleaning', text: 'Thorough cleaning from top to bottom.' },
  { id: 'end-of-tenancy', title: 'End of Tenancy Cleaning', text: 'Preparing properties for new occupants.' },
  { id: 'laundry', title: 'Laundry Services', text: 'Washing, drying and folding.' },
] as const

export const serviceOptions = [
  ...cleaningServices.map((s) => s.title),
  'Serviced accommodation / short-term rental turnover',
]

/**
 * Places near the homes. Each `slug` links to the property it relates to.
 * Only facts from the brief or the listing titles; no invented distances.
 */
export const locationPoints: { title: string; text: string; slug?: string; stay?: string }[] = [
  { title: 'Epsom town centre', text: 'Restaurants and shops close at hand.', slug: 'elegant-epsom-flat-period-building', stay: 'Elegant Epsom Flat' },
  { title: 'Epsom railway station', text: 'About 5 minutes on foot, with trains to Central London.', slug: 'elegant-epsom-family', stay: 'Elegant Epsom Family' },
  { title: 'Epsom College', text: 'A 5-minute walk from our quiet, leafy flat.', slug: 'quiet-epsom-flat-near-college', stay: 'Quiet Flat' },
  { title: 'Epsom Hospital', text: '500 m from our 3-bed home with a garden.', slug: 'three-bed-family-home-near-hospital', stay: 'Cosy 3-Bed Home' },
  { title: 'Hobbledown', text: 'A family home with parking, nearby.', slug: 'epsom-family-home-near-hobbledown', stay: 'Epsom Family Home' },
  { title: 'Nearby attractions', text: 'Local favourites to be added by the host.' },
]
