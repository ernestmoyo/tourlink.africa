import 'server-only'
import { promises as fs } from 'node:fs'
import { join } from 'node:path'
import { PdfBuilder, money, type Column } from '@/lib/documents/pdf'
import { SEGMENT_KINDS } from '@/lib/crm/constants'
import type { TripDocData } from '@/lib/documents/data'

export type DocType = 'quote' | 'itinerary' | 'voucher'
export type BuiltDoc = { bytes: Uint8Array; filename: string }

// Brand logo for the PDF header — read once, cached. null once if missing.
let logoCache: Uint8Array | null | undefined
async function loadLogo(): Promise<Uint8Array | undefined> {
  if (logoCache !== undefined) return logoCache ?? undefined
  try { logoCache = new Uint8Array(await fs.readFile(join(process.cwd(), 'public', 'images', 'logo.png'))) }
  catch { logoCache = null }
  return logoCache ?? undefined
}

async function newBuilder(): Promise<PdfBuilder> {
  return PdfBuilder.create({ logoBytes: await loadLogo() })
}

const safe = (s: string) => s.replace(/[^a-zA-Z0-9._-]/g, '_').slice(0, 60)
const kindLabel = (id: string) => SEGMENT_KINDS.find((k) => k.id === id)?.label || id

const MEALS: Record<string, string> = { B: 'Breakfast', L: 'Lunch', D: 'Dinner' }
function mealLine(meals?: string[]): string {
  if (!meals || !meals.length) return ''
  return `Meals: ${meals.map((m) => MEALS[m] || m).join(', ')}`
}

function ref(trip: TripDocData['trip'], prefix: string): string {
  return `${prefix}-${trip.id.slice(0, 6).toUpperCase()}`
}

function dateLine(trip: TripDocData['trip']): string {
  if (!trip.start_date) return 'Dates to be confirmed'
  return trip.end_date ? `${trip.start_date} to ${trip.end_date}` : `From ${trip.start_date}`
}

function footer(): string {
  return 'TourLink · info@tourlink.africa · +255 767 898 469 · Dar es Salaam · Harare · Cape Town · Sandton'
}

// ---- Quote: itinerary pricing + payment plan ----
export async function buildQuotePdf(d: TripDocData): Promise<BuiltDoc> {
  const b = await newBuilder()
  const today = new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })
  b.header('QUOTE', ref(d.trip, 'Q'))
  b.title(d.trip.name)
  b.keyValues([
    ['Prepared for', d.account.name],
    ['Destinations', d.trip.destinations.length ? d.trip.destinations.join(', ') : '—'],
    ['Travel dates', dateLine(d.trip)],
    ['Travellers', d.trip.pax ? String(d.trip.pax) : '—'],
    ['Date issued', today],
  ])

  b.section('Your journey')
  const cols: Column[] = [
    { header: 'Service', width: 250 },
    { header: 'Type', width: 110 },
    { header: 'Nights', width: 55, align: 'right' },
    { header: 'Price (USD)', width: 80, align: 'right' },
  ]
  const rows = d.segments.map((s) => [s.name, kindLabel(s.kind), s.nights ? String(s.nights) : '—', money(s.value)])
  if (rows.length === 0) rows.push(['Bespoke itinerary — details to follow', '—', '—', '—'])
  b.table(cols, rows)
  const segTotal = d.segments.reduce((t, s) => t + (s.value || 0), 0)
  b.total('Total', money(d.trip.value || segTotal))

  if (d.payments.length) {
    b.section('Payment plan')
    const pcols: Column[] = [
      { header: 'Milestone', width: 230 },
      { header: 'Trigger', width: 175 },
      { header: 'Amount (USD)', width: 90, align: 'right' },
    ]
    b.table(pcols, d.payments.map((p) => [p.label, p.trigger || (p.due_date ? `By ${p.due_date}` : '—'), money(p.amount)]))
  }

  b.spacer(8)
  b.callout([
    'Good to know',
    'Prices are per the itinerary above and valid for 14 days from the date issued.',
    'Rates are subject to availability until a deposit secures the booking.',
    'A TourLink consultant will confirm every detail before you travel.',
  ])

  const bytes = await b.finish(footer())
  return { bytes, filename: `TourLink_Quote_${safe(d.trip.name)}.pdf` }
}

// ---- Itinerary: day-by-day style listing of the journey ----
export async function buildItineraryPdf(d: TripDocData): Promise<BuiltDoc> {
  const b = await newBuilder()
  b.header('ITINERARY', ref(d.trip, 'I'))
  b.title(d.trip.name)
  b.keyValues([
    ['Guest', d.account.name],
    ['Destinations', d.trip.destinations.length ? d.trip.destinations.join(', ') : '—'],
    ['Travel dates', dateLine(d.trip)],
    ['Travellers', d.trip.pax ? String(d.trip.pax) : '—'],
  ])

  b.section('Your journey, step by step')
  const days = d.trip.itinerary || []
  if (days.length > 0) {
    // Proper day-by-day plan (e.g. materialised from a catalogue package).
    for (const day of days) {
      b.title(`Day ${day.day} — ${day.title}`, 12)
      const meta = [day.destination || '', day.accommodation ? `Stay: ${day.accommodation}` : '', mealLine(day.meals)].filter(Boolean).join('  ·  ')
      if (meta) b.paragraph(meta, 9)
      if (day.description) b.paragraph(day.description, 9)
      if (day.activities && day.activities.length) b.paragraph(`Activities: ${day.activities.join(', ')}`, 9)
      b.spacer(6)
    }
  } else if (d.segments.length === 0) {
    b.paragraph('Your detailed itinerary is being finalised and will follow shortly.')
  } else {
    d.segments.forEach((s, i) => {
      b.title(`${i + 1}. ${s.name}`, 12)
      const meta = [kindLabel(s.kind), s.nights ? `${s.nights} night${s.nights === 1 ? '' : 's'}` : '', s.supplier || ''].filter(Boolean).join('  ·  ')
      if (meta) b.paragraph(meta, 9)
      if (s.notes) b.paragraph(s.notes, 9)
      b.spacer(6)
    })
  }

  b.spacer(6)
  b.callout([
    'Your TourLink team',
    'Questions on the road? Message us any time on WhatsApp: +255 767 898 469.',
    'Our guides and DMC partners will be with you at every step.',
  ])

  const bytes = await b.finish(footer())
  return { bytes, filename: `TourLink_Itinerary_${safe(d.trip.name)}.pdf` }
}

// ---- Voucher: confirmation of booked services per supplier ----
export async function buildVoucherPdf(d: TripDocData): Promise<BuiltDoc> {
  const b = await newBuilder()
  b.header('VOUCHER', ref(d.trip, 'V'))
  b.title(d.trip.name)
  b.keyValues([
    ['Guest', d.account.name],
    ['Travel dates', dateLine(d.trip)],
    ['Travellers', d.trip.pax ? String(d.trip.pax) : '—'],
    ['Status', d.trip.status],
  ])

  b.section('Confirmed services')
  const cols: Column[] = [
    { header: 'Service', width: 215 },
    { header: 'Supplier', width: 160 },
    { header: 'Status', width: 110 },
  ]
  const confirmed = d.segments.filter((s) => s.status === 'confirmed' || s.status === 'booked')
  const list = (confirmed.length ? confirmed : d.segments)
  b.table(cols, (list.length ? list : [{ name: '—', supplier: '', status: '—' }] as never).map((s) =>
    [s.name, s.supplier || kindLabel(s.kind), s.status]))

  b.spacer(8)
  b.callout([
    'Present this voucher on arrival',
    'This confirms the services listed above have been arranged by TourLink.',
    'For any issue, contact TourLink on +255 767 898 469 (WhatsApp) before paying anything locally.',
  ])

  const bytes = await b.finish(footer())
  return { bytes, filename: `TourLink_Voucher_${safe(d.trip.name)}.pdf` }
}

export async function buildDoc(type: DocType, d: TripDocData): Promise<BuiltDoc> {
  if (type === 'itinerary') return buildItineraryPdf(d)
  if (type === 'voucher') return buildVoucherPdf(d)
  return buildQuotePdf(d)
}
