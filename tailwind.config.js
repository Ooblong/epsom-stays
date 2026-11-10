/** @type {import('tailwindcss').Config} */
// Palette and type taken from the Brightwork Framer reference.
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        ivory: '#F4F0E8', // "bone" — page background
        bone: '#F4F0E8',
        sand: '#E9E3D7', // bone/fog mix
        fog: '#DDD6C9',
        ink: '#14201C',
        night: '#0C1613',
        stone: '#56625D',
        moss: '#0E5B4A', // primary green
        brass: '#0E5B4A', // template's accent is the same deep green
        pine: '#2FBF8A', // bright status dot
        sage: { DEFAULT: '#A5B59E', deep: '#7D9279', light: '#DCE4D7' }, // Pure Living cleaning brand
      },
      fontFamily: {
        display: ['Fraunces', 'Georgia', 'serif'],
        sans: ['Figtree', 'system-ui', 'sans-serif'],
        mono: ['"Geist Mono"', 'ui-monospace', 'monospace'],
      },
      boxShadow: {
        soft: '0 14px 44px rgba(20,32,28,.07)',
        chip: '0 6px 24px rgba(20,32,28,.08)',
        float: '0 18px 60px rgba(20,32,28,.16)',
      },
      transitionTimingFunction: { out2: 'cubic-bezier(.16,.84,.24,1)' },
    },
  },
  plugins: [],
}
