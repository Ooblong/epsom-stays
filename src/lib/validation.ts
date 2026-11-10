import { nightsBetween, todayISO } from './dates'

export type Errors<T> = Partial<Record<keyof T, string>>

export const isEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim())
export const isPhone = (v: string) => /^\+?[\d\s()-]{7,18}$/.test(v.trim())

export interface EnquiryFields {
  propertySlug: string
  checkIn: string
  checkOut: string
  guests: number
  name: string
  email: string
  phone: string
  message: string
}

export function validateEnquiry(f: EnquiryFields, maxGuests?: number): Errors<EnquiryFields> {
  const e: Errors<EnquiryFields> = {}
  if (!f.propertySlug) e.propertySlug = 'Please choose a property.'
  if (!f.checkIn) e.checkIn = 'Choose a check-in date.'
  else if (f.checkIn < todayISO()) e.checkIn = 'Check-in cannot be in the past.'
  if (!f.checkOut) e.checkOut = 'Choose a check-out date.'
  else if (f.checkIn && nightsBetween(f.checkIn, f.checkOut) < 1) e.checkOut = 'Check-out must be after check-in.'
  if (!f.guests || f.guests < 1) e.guests = 'Add at least one guest.'
  else if (maxGuests && f.guests > maxGuests) e.guests = `This property sleeps up to ${maxGuests} guests.`
  if (f.name.trim().length < 2) e.name = 'Please enter your name.'
  if (!isEmail(f.email)) e.email = 'Enter a valid email address.'
  if (f.phone.trim() && !isPhone(f.phone)) e.phone = 'Enter a valid phone number, or leave blank.'
  return e
}

export interface CleaningFields {
  name: string
  contact: string
  location: string
  service: string
  date: string
  details: string
}

export function validateCleaning(f: CleaningFields): Errors<CleaningFields> {
  const e: Errors<CleaningFields> = {}
  if (f.name.trim().length < 2) e.name = 'Please enter your name.'
  if (!f.contact.trim()) e.contact = 'Enter an email address or phone number.'
  else if (!isEmail(f.contact) && !isPhone(f.contact)) e.contact = 'That doesn’t look like an email or phone number.'
  if (f.location.trim().length < 2) e.location = 'Tell us where the property is.'
  if (!f.service) e.service = 'Choose a service.'
  if (f.date && f.date < todayISO()) e.date = 'Preferred date cannot be in the past.'
  return e
}

export interface ContactFields {
  name: string
  email: string
  topic: string
  message: string
}

export function validateContact(f: ContactFields): Errors<ContactFields> {
  const e: Errors<ContactFields> = {}
  if (f.name.trim().length < 2) e.name = 'Please enter your name.'
  if (!isEmail(f.email)) e.email = 'Enter a valid email address.'
  if (f.message.trim().length < 5) e.message = 'Please write a short message.'
  return e
}
