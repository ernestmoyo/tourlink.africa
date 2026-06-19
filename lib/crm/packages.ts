import { packages } from '@/data/packages'
import { DESTINATION_NAMES } from '@/lib/constants'
import type { Package } from '@/types'
import type { SegmentKindId } from '@/lib/crm/constants'
import type { TripItineraryDay } from '@/lib/crm/types'

// ===========================================================================
// Bridge the public package catalogue (data/packages.ts) into the CRM, so a
// trip + its itinerary segments can be materialised from a chosen package and
// priced for a given party size. Used by the concierge (build_trip_from_package)
// and the Ops "new trip from package" form.
// ===========================================================================

export type SegmentSpec = { name: string; kind: SegmentKindId; value: number; nights: number | null; supplier: string | null }
export type TripSpec = {
  name: string
  destinations: string[]
  value: number
  startDate: string | null
  endDate: string | null
  pax: number
  segments: SegmentSpec[]
  itinerary: TripItineraryDay[]
}

export type PackageOption = { slug: string; name: string; nights: number; priceFrom: number; tier: string }

export function packageOptions(): PackageOption[] {
  return packages.map((p) => ({ slug: p.slug, name: p.name, nights: p.durationNights, priceFrom: p.priceFrom, tier: p.tier }))
}

export function findPackage(query: string): Package | null {
  const q = query.toLowerCase().trim()
  if (!q) return null
  return (
    packages.find((p) => p.slug === q) ||
    packages.find((p) => p.name.toLowerCase() === q) ||
    packages.find((p) => p.name.toLowerCase().includes(q) || p.slug.includes(q)) ||
    null
  )
}

function addDays(iso: string, days: number): string {
  const d = new Date(iso + 'T00:00')
  d.setDate(d.getDate() + days)
  return d.toISOString().slice(0, 10)
}

// Group the package itinerary into lodge stays (consecutive days sharing an
// accommodation/destination), then distribute the per-person total across them.
function stayGroups(pkg: Package): { label: string; nights: number }[] {
  const groups: { label: string; nights: number }[] = []
  for (const day of pkg.itinerary) {
    const label = day.accommodation || `${DESTINATION_NAMES[day.destination]} stay`
    const last = groups[groups.length - 1]
    if (last && last.label === label) last.nights += 1
    else groups.push({ label, nights: 1 })
  }
  return groups.length ? groups : [{ label: pkg.name, nights: pkg.durationNights }]
}

export function packageToTripSpec(pkg: Package, pax: number, startDate?: string): TripSpec {
  const people = Math.max(1, pax || pkg.groupSizeMin || 1)
  const perPerson = pkg.priceUnit === 'per-person-per-night' ? pkg.priceFrom * pkg.durationNights : pkg.priceFrom
  const total = perPerson * people
  const destinations = pkg.destinations.map((d) => DESTINATION_NAMES[d])

  const groups = stayGroups(pkg)
  const totalNights = groups.reduce((s, g) => s + g.nights, 0) || 1
  let allocated = 0
  const segments: SegmentSpec[] = groups.map((g, i) => {
    // Distribute the total by nights; last segment absorbs the rounding remainder.
    const value = i === groups.length - 1 ? total - allocated : Math.round((total * g.nights) / totalNights)
    allocated += value
    return { name: g.label, kind: 'lodge', value, nights: g.nights, supplier: null }
  })

  const start = startDate || null
  const end = start ? addDays(start, Math.max(0, pkg.durationDays - 1)) : null

  const itinerary: TripItineraryDay[] = pkg.itinerary.map((d) => ({
    day: d.dayNumber,
    title: d.title,
    description: d.description,
    accommodation: d.accommodation || null,
    meals: d.meals || [],
    activities: d.activities || [],
    destination: DESTINATION_NAMES[d.destination] || d.destination,
  }))

  return {
    name: `${pkg.name} — ${people} pax`,
    destinations,
    value: total,
    startDate: start,
    endDate: end,
    pax: people,
    segments,
    itinerary,
  }
}
