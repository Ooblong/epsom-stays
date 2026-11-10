/** Dates are handled as local "YYYY-MM-DD" strings to avoid timezone surprises. */
export const toISO = (d: Date) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`

export const fromISO = (s: string) => {
  const [y, m, d] = s.split('-').map(Number)
  return new Date(y, m - 1, d)
}

export const todayISO = () => toISO(new Date())

export const nightsBetween = (a: string, b: string) =>
  Math.round((fromISO(b).getTime() - fromISO(a).getTime()) / 86_400_000)

export const formatLong = (s: string) =>
  fromISO(s).toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' })

export const formatShort = (s: string) =>
  fromISO(s).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })

export const monthLabel = (y: number, m: number) =>
  new Date(y, m, 1).toLocaleDateString('en-GB', { month: 'long', year: 'numeric' })
