/**
 * BOOKING SERVICE LAYER
 * ---------------------------------------------------------------
 * The UI only talks to the `BookingProvider` interface. For this demo the
 * `localDemoProvider` stores enquiries in the browser (localStorage) and
 * reports availability as "unknown" — nothing is sent, confirmed or priced.
 *
 * To go live, write a new provider (Hostaway, Guesty, Lodgify, Beds24,
 * Stripe Checkout, an iCal feed reader, your own API…) that implements the
 * same interface and swap it in at the bottom of this file. No component
 * changes needed.
 */
import type { CleaningFields, ContactFields, EnquiryFields } from '../lib/validation'

export type AvailabilityStatus = 'unknown' | 'available' | 'unavailable'

export interface AvailabilityRequest {
  propertySlug: string
  checkIn: string
  checkOut: string
  guests: number
}

export interface AvailabilityResult {
  status: AvailabilityStatus
  /** Real engines would return a quote here. Never populated by the demo. */
  quote?: { total: number; currency: string }
  note?: string
}

export interface SavedRecord<T> {
  id: string
  createdAt: string
  data: T
}

export interface BookingProvider {
  checkAvailability(req: AvailabilityRequest): Promise<AvailabilityResult>
  submitEnquiry(data: EnquiryFields): Promise<SavedRecord<EnquiryFields>>
  submitCleaningQuote(data: CleaningFields): Promise<SavedRecord<CleaningFields>>
  submitContact(data: ContactFields): Promise<SavedRecord<ContactFields>>
}

const KEYS = { enquiry: 'demo.enquiries', cleaning: 'demo.cleaningQuotes', contact: 'demo.contacts' } as const

function read<T>(key: string): SavedRecord<T>[] {
  try {
    return JSON.parse(localStorage.getItem(key) ?? '[]')
  } catch {
    return []
  }
}

function save<T>(key: string, data: T): SavedRecord<T> {
  const record: SavedRecord<T> = { id: crypto.randomUUID(), createdAt: new Date().toISOString(), data }
  try {
    localStorage.setItem(key, JSON.stringify([record, ...read(key)].slice(0, 50)))
  } catch {
    /* storage blocked — still return the record so the UI can confirm */
  }
  return record
}

const wait = (ms: number) => new Promise((r) => setTimeout(r, ms))

export const localDemoProvider: BookingProvider = {
  async checkAvailability() {
    await wait(450)
    return {
      status: 'unknown',
      note: 'Live availability is not connected in this demo. Send an enquiry and the host will confirm.',
    }
  },
  async submitEnquiry(data) {
    await wait(500)
    return save(KEYS.enquiry, data)
  },
  async submitCleaningQuote(data) {
    await wait(500)
    return save(KEYS.cleaning, data)
  },
  async submitContact(data) {
    await wait(400)
    return save(KEYS.contact, data)
  },
}

export const savedEnquiries = () => read<EnquiryFields>(KEYS.enquiry)

// 👉 Swap this export for a real provider when integrating.
export const bookingProvider: BookingProvider = localDemoProvider
