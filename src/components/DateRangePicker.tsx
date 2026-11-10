import { useEffect, useMemo, useRef, useState } from 'react'
import { formatLong, formatShort, fromISO, monthLabel, toISO, todayISO } from '../lib/dates'

const CalendarIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
    <rect x="3.5" y="5" width="17" height="15" rx="3" />
    <path d="M3.5 10h17M8 3v4M16 3v4" strokeLinecap="round" />
  </svg>
)

interface Props {
  checkIn: string
  checkOut: string
  onChange: (checkIn: string, checkOut: string) => void
  errorIn?: string
  errorOut?: string
  /** compact = used inside the hero search bar */
  compact?: boolean
}

const WEEKDAYS = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su']

function Month({
  year,
  month,
  checkIn,
  checkOut,
  hover,
  onPick,
  onHover,
}: {
  year: number
  month: number
  checkIn: string
  checkOut: string
  hover: string
  onPick: (iso: string) => void
  onHover: (iso: string) => void
}) {
  const today = todayISO()
  const first = new Date(year, month, 1)
  const offset = (first.getDay() + 6) % 7 // Monday-first
  const days = new Date(year, month + 1, 0).getDate()
  const end = checkOut || (checkIn && hover > checkIn ? hover : '')
  const cells: (string | null)[] = [...Array(offset).fill(null), ...Array.from({ length: days }, (_, i) => toISO(new Date(year, month, i + 1)))]

  return (
    <div className="w-full min-w-[17rem]">
      <p className="mb-3 text-center font-display text-xl">{monthLabel(year, month)}</p>
      <div className="grid grid-cols-7 gap-y-1 text-center text-[11px] uppercase tracking-wider text-ink/45">
        {WEEKDAYS.map((d) => (
          <span key={d}>{d}</span>
        ))}
      </div>
      <div className="mt-1 grid grid-cols-7 gap-y-1" role="grid">
        {cells.map((iso, i) => {
          if (!iso) return <span key={`e${i}`} />
          const disabled = iso < today
          const isStart = iso === checkIn
          const isEnd = iso === end
          const inRange = checkIn && end && iso > checkIn && iso < end
          return (
            <button
              key={iso}
              type="button"
              disabled={disabled}
              aria-label={formatLong(iso)}
              aria-pressed={isStart || isEnd}
              onClick={() => onPick(iso)}
              onMouseEnter={() => onHover(iso)}
              className={`relative mx-auto grid h-10 w-full place-items-center text-sm transition ${
                isStart || isEnd
                  ? 'z-10 rounded-full bg-moss text-ivory'
                  : inRange
                    ? 'bg-sage-light/70'
                    : disabled
                      ? 'text-ink/25'
                      : 'rounded-full hover:bg-sage-light'
              } ${isStart && end ? 'rounded-r-none' : ''} ${isEnd && checkIn ? 'rounded-l-none' : ''}`}
            >
              {Number(iso.slice(8))}
            </button>
          )
        })}
      </div>
    </div>
  )
}

export function DateRangePicker({ checkIn, checkOut, onChange, errorIn, errorOut, compact }: Props) {
  const [open, setOpen] = useState(false)
  const [hover, setHover] = useState('')
  const start = checkIn ? fromISO(checkIn) : new Date()
  const [view, setView] = useState({ y: start.getFullYear(), m: start.getMonth() })
  const wrap = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    const click = (e: MouseEvent) => !wrap.current?.contains(e.target as Node) && setOpen(false)
    const key = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false)
    document.addEventListener('mousedown', click)
    document.addEventListener('keydown', key)
    return () => {
      document.removeEventListener('mousedown', click)
      document.removeEventListener('keydown', key)
    }
  }, [open])

  const next = useMemo(() => {
    const d = new Date(view.y, view.m + 1, 1)
    return { y: d.getFullYear(), m: d.getMonth() }
  }, [view])

  const shift = (n: number) => {
    const d = new Date(view.y, view.m + n, 1)
    const now = new Date()
    if (d < new Date(now.getFullYear(), now.getMonth(), 1)) return
    setView({ y: d.getFullYear(), m: d.getMonth() })
  }

  const pick = (iso: string) => {
    if (!checkIn || checkOut || iso <= checkIn) {
      onChange(iso, '')
    } else {
      onChange(checkIn, iso)
      setOpen(false)
    }
  }

  const btn = (label: string, value: string, err?: string, id?: string) => (
    <button
      type="button"
      id={id}
      onClick={() => setOpen(true)}
      aria-haspopup="dialog"
      aria-expanded={open}
      aria-invalid={!!err}
      className={compact ? 'chip w-full justify-between' : `field w-full text-left ${err ? 'field-error' : ''}`}
    >
      {compact ? (
        <>
          <span>{value ? formatShort(value) : label}</span>
          <CalendarIcon />
        </>
      ) : (
        <span className={`block text-sm ${value ? 'text-ink' : 'text-ink/45'}`}>{value ? formatLong(value) : 'Add date'}</span>
      )}
    </button>
  )

  return (
    // `contents`: the popover positions against the nearest `relative` ancestor supplied by the caller.
    <div ref={wrap} className="contents">
      <div className={compact ? 'flex-1' : ''}>
        {!compact && <label htmlFor="dp-in" className="label">Check-in</label>}
        {btn('Check-in', checkIn, errorIn, 'dp-in')}
        {errorIn && <p role="alert" className="mt-1.5 text-xs text-red-800">{errorIn}</p>}
      </div>
      <div className={compact ? 'flex-1' : ''}>
        {!compact && <label htmlFor="dp-out" className="label">Check-out</label>}
        {btn('Check-out', checkOut, errorOut, 'dp-out')}
        {errorOut && <p role="alert" className="mt-1.5 text-xs text-red-800">{errorOut}</p>}
      </div>
      {open && (
        <div
          role="dialog"
          aria-label="Choose dates"
          className={`absolute left-0 z-50 w-full max-w-[40rem] rounded-3xl border border-ink/10 bg-white p-5 text-ink shadow-float sm:w-[38rem] ${compact ? 'bottom-full mb-3' : 'right-0 top-full mx-auto mt-3'}`}
          onMouseLeave={() => setHover('')}
        >
          <div className="mb-2 flex items-center justify-between">
            <button type="button" onClick={() => shift(-1)} aria-label="Previous month" className="grid h-9 w-9 place-items-center rounded-full hover:bg-sage-light">‹</button>
            <button type="button" onClick={() => shift(1)} aria-label="Next month" className="grid h-9 w-9 place-items-center rounded-full hover:bg-sage-light">›</button>
          </div>
          <div className="flex gap-8">
            <Month year={view.y} month={view.m} checkIn={checkIn} checkOut={checkOut} hover={hover} onPick={pick} onHover={setHover} />
            <div className="hidden sm:block">
              <Month year={next.y} month={next.m} checkIn={checkIn} checkOut={checkOut} hover={hover} onPick={pick} onHover={setHover} />
            </div>
          </div>
          <div className="mt-4 flex items-center justify-between text-xs text-ink/60">
            <span>{!checkIn ? 'Select check-in' : !checkOut ? 'Now select check-out' : 'Dates selected'}</span>
            {(checkIn || checkOut) && (
              <button type="button" className="underline underline-offset-4" onClick={() => onChange('', '')}>Clear dates</button>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
