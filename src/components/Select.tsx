import { useEffect, useId, useLayoutEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'

export interface Option<V extends string | number = string> {
  value: V
  label: string
  /** optional small grey second line, e.g. a location */
  hint?: string
}

interface Props<V extends string | number> {
  value: V
  options: Option<V>[]
  onChange: (v: V) => void
  /** accessible name (also shown above the field when variant = "field") */
  label: string
  /** "chip" = rounded pill used in the hero bar; "field" = form input */
  variant?: 'chip' | 'field'
  placeholder?: string
  invalid?: boolean
  id?: string
  className?: string
}

const Chevrons = () => (
  <svg width="10" height="14" viewBox="0 0 10 14" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden className="shrink-0 opacity-55">
    <path d="m2 5 3-3 3 3M2 9l3 3 3-3" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)
const Check = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" aria-hidden className="shrink-0">
    <path d="m5 12.5 4.5 4.5L19 7.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

/**
 * Custom dropdown that matches the site's design (native <select> menus can't be styled).
 * Follows the WAI-ARIA "select-only combobox" pattern: arrow keys, Home/End, Enter/Space,
 * Escape, Tab and type-to-jump all work; screen readers hear the active option.
 */
export function Select<V extends string | number>({ value, options, onChange, label, variant = 'field', placeholder = 'Select…', invalid, id, className = '' }: Props<V>) {
  const uid = useId()
  const btnId = id ?? `sel-${uid}`
  const listId = `${btnId}-list`
  const [open, setOpen] = useState(false)
  const [active, setActive] = useState(0)
  const [up, setUp] = useState(false)
  const [pos, setPos] = useState<{ left: number; width: number; top?: number; bottom?: number } | null>(null)
  const wrap = useRef<HTMLDivElement>(null)
  const btn = useRef<HTMLButtonElement>(null)
  const list = useRef<HTMLUListElement>(null)
  const typed = useRef({ s: '', t: 0 })

  const selectedIndex = options.findIndex((o) => o.value === value)
  const selected = options[selectedIndex]

  const show = () => {
    setActive(Math.max(0, selectedIndex))
    setOpen(true)
  }
  const choose = (i: number) => {
    onChange(options[i].value)
    setOpen(false)
    btn.current?.focus()
  }

  // The menu is rendered in a portal with fixed positioning so sections with
  // overflow:hidden (like the hero) can't clip it. Opens upwards when there's no room below.
  useLayoutEffect(() => {
    if (!open || !btn.current) return
    const place = () => {
      const r = btn.current!.getBoundingClientRect()
      const need = Math.min(options.length * 58 + 16, 420)
      const below = window.innerHeight - r.bottom
      const goUp = below < need + 8 && r.top > below
      setUp(goUp)
      setPos({ left: r.left, width: r.width, top: goUp ? undefined : r.bottom + 8, bottom: goUp ? window.innerHeight - r.top + 8 : undefined })
    }
    place()
    window.addEventListener('scroll', place, true)
    window.addEventListener('resize', place)
    return () => {
      window.removeEventListener('scroll', place, true)
      window.removeEventListener('resize', place)
    }
  }, [open, options.length])

  useEffect(() => {
    if (!open) return
    const out = (e: MouseEvent) => {
      const t = e.target as Node
      if (!wrap.current?.contains(t) && !list.current?.contains(t)) setOpen(false)
    }
    document.addEventListener('mousedown', out)
    return () => document.removeEventListener('mousedown', out)
  }, [open])

  useEffect(() => {
    if (open) list.current?.querySelector<HTMLElement>(`[data-i="${active}"]`)?.scrollIntoView({ block: 'nearest' })
  }, [open, active])

  const onKey = (e: React.KeyboardEvent) => {
    const last = options.length - 1
    if (!open) {
      if (['ArrowDown', 'ArrowUp', 'Enter', ' '].includes(e.key)) {
        e.preventDefault()
        show()
      }
      return
    }
    switch (e.key) {
      case 'ArrowDown': e.preventDefault(); setActive((a) => Math.min(last, a + 1)); break
      case 'ArrowUp': e.preventDefault(); setActive((a) => Math.max(0, a - 1)); break
      case 'Home': e.preventDefault(); setActive(0); break
      case 'End': e.preventDefault(); setActive(last); break
      case 'Enter': case ' ': e.preventDefault(); choose(active); break
      case 'Escape': e.preventDefault(); setOpen(false); break
      case 'Tab': setOpen(false); break
      default:
        if (e.key.length === 1) {
          const now = Date.now()
          typed.current = { s: (now - typed.current.t > 600 ? '' : typed.current.s) + e.key.toLowerCase(), t: now }
          const i = options.findIndex((o) => o.label.toLowerCase().startsWith(typed.current.s))
          if (i >= 0) setActive(i)
        }
    }
  }

  const trigger =
    variant === 'chip'
      ? `chip w-full justify-between ${open ? '!bg-[color-mix(in_srgb,#0E5B4A_14%,#fff)]' : ''}`
      : `field flex items-center justify-between gap-3 text-left ${invalid ? 'field-error' : ''} ${open ? 'border-moss bg-white ring-2 ring-moss/20' : ''}`

  return (
    <div ref={wrap} className={`relative ${className}`}>
      <button
        ref={btn}
        id={btnId}
        type="button"
        role="combobox"
        aria-label={variant === 'chip' ? label : undefined}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listId}
        aria-activedescendant={open ? `${listId}-${active}` : undefined}
        aria-invalid={invalid || undefined}
        onClick={() => (open ? setOpen(false) : show())}
        onKeyDown={onKey}
        className={trigger}
      >
        <span className={`truncate ${selected ? '' : 'text-ink/45'}`}>{selected?.label ?? placeholder}</span>
        <Chevrons />
      </button>

      {open && pos && createPortal(
        <ul
          ref={list}
          id={listId}
          role="listbox"
          aria-label={label}
          tabIndex={-1}
          style={{ left: Math.min(pos.left, window.innerWidth - 20 - Math.min(440, window.innerWidth - 40)), minWidth: pos.width, top: pos.top, bottom: pos.bottom }}
          className={`menu-pop fixed z-[70] max-h-[420px] w-max max-w-[min(440px,calc(100vw-40px))] overflow-y-auto rounded-[22px] bg-white p-1.5 text-ink shadow-float ring-1 ring-ink/[.06] ${up ? 'origin-bottom' : 'origin-top'}`}
        >
          {options.map((o, i) => {
            const isSel = o.value === value
            return (
              <li
                key={String(o.value)}
                id={`${listId}-${i}`}
                data-i={i}
                role="option"
                aria-selected={isSel}
                onMouseEnter={() => setActive(i)}
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => choose(i)}
                className={`flex cursor-pointer items-center justify-between gap-4 rounded-[14px] px-3.5 py-2.5 text-[14.5px] transition-colors duration-150 ${
                  i === active ? 'bg-[color-mix(in_srgb,#0E5B4A_9%,#fff)]' : ''
                } ${isSel ? 'font-semibold text-moss' : 'font-medium'}`}
              >
                <span className="min-w-0">
                  <span className="block truncate">{o.label}</span>
                  {o.hint && <span className="block truncate text-xs font-normal text-stone">{o.hint}</span>}
                </span>
                <span className={isSel ? 'text-moss' : 'invisible'}><Check /></span>
              </li>
            )
          })}
        </ul>,
        document.body,
      )}
    </div>
  )
}
