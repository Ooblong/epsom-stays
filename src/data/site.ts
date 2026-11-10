// ─────────────────────────────────────────────────────────────
// Brand & site configuration. EDIT HERE to rebrand the demo.
// Contact details are deliberately left blank — never invented.
// ─────────────────────────────────────────────────────────────
export const site = {
  brandName: 'Epsom Stays', // TEMPORARY — replace with the client's real accommodation brand
  brandTagline: 'Homes with hotel-style care',
  // Hero background photo (file lives in /public/images)
  heroImage: '/images/hero-living-room.webp',
  host: 'John',
  hostPhoto: '/images/host-john.avif', // 240×280; a larger original would look sharper
  hostBio: 'Airbnb Superhost with around 10 years of hosting experience',
  cleaning: {
    name: 'Pure Living Cleaning Company',
    tagline: 'Cleaning, done properly.',
  },
  contact: {
    accommodationEmail: '', // add when confirmed
    cleaningEmail: '',
    phone: '',
    address: '',
  },
  social: [
    { label: 'Instagram', href: '' },
    { label: 'Facebook', href: '' },
    { label: 'Airbnb', href: 'https://www.airbnb.co.uk/rooms/14028511' },
  ],
  // Free OpenStreetMap view of central Epsom (no API key needed).
  mapEmbed:
    'https://www.openstreetmap.org/export/embed.html?bbox=-0.2900%2C51.3200%2C-0.2400%2C51.3450&layer=mapnik',
}
