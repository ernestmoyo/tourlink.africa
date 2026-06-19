// Shared CRM definitions — the single source of truth for the TourLink pipeline.
// A CLOSED LOOP: Business Dev sources enquiries at the front; a completed trip
// feeds a Repeat/Referral stage where the relationship grows and spawns the next
// enquiry.
//
//   Enquiry → Qualified → Itinerary → Booked → Confirmed → On Trip →
//   Completed → Repeat ──(spawn follow-up)──┐
//     ▲───────────────────────────────────-─┘

export const STAGES = [
  { id: 'enquiry',   title: 'Enquiry',        sub: 'BizDev · sourced',       accent: '#C2185B' },
  { id: 'qualified', title: 'Qualified',      sub: 'BizDev · dates & pax',   accent: '#E91E73' },
  { id: 'itinerary', title: 'Itinerary & Quote', sub: 'Ops · build & quote', accent: '#C9A84C' },
  { id: 'booked',    title: 'Booked',         sub: 'Ops · deposit paid',     accent: '#2B6A7C' },
  { id: 'confirmed', title: 'Confirmed',      sub: 'Ops · balance & lock',   accent: '#378A9F' },
  { id: 'on_trip',   title: 'On Trip',        sub: 'Guide · travelling',     accent: '#5C6B4F' },
  { id: 'completed', title: 'Completed',      sub: 'Ops · trip done',        accent: '#4A7C59' },
  { id: 'repeat',    title: 'Repeat / Referral', sub: 'BizDev · grow',       accent: '#2B3990' },
] as const

export type StageId = (typeof STAGES)[number]['id']

export const STAGE_IDS = STAGES.map((s) => s.id) as StageId[]

// Stage groupings used for stats and the closed loop.
export const OPEN_STAGES: StageId[] = ['enquiry', 'qualified', 'itinerary']
// Deposit secured = won. Everything from Booked onward counts as won revenue.
export const WON_STAGES: StageId[] = ['booked', 'confirmed', 'on_trip', 'completed', 'repeat']
export const FRONT_STAGES: StageId[] = ['enquiry', 'qualified'] // BizDev-owned
// Where "spawn follow-up" lands when you grow an account → a fresh enquiry.
export const LOOP_BACK_STAGE: StageId = 'enquiry'

// Win-probability weight per stage — drives the weighted pipeline forecast.
export const STAGE_WEIGHT: Record<StageId, number> = {
  enquiry: 0.1, qualified: 0.25, itinerary: 0.5,
  booked: 0.9, confirmed: 1, on_trip: 1, completed: 1, repeat: 1,
}

// Quotes are denominated in USD (the cross-border travel standard); office
// currencies (TZS/ZWL/ZAR) are a display concern handled elsewhere.
export const CURRENCY = '$'

export function formatMoney(n: number): string {
  const v = Number(n) || 0
  const sign = v < 0 ? '-' : ''
  const a = Math.abs(v)
  if (a >= 1_000_000) return `${sign}${CURRENCY}${(a / 1_000_000).toFixed(a % 1_000_000 === 0 ? 0 : 1)}M`
  if (a >= 1_000) return `${sign}${CURRENCY}${(a / 1_000).toFixed(a % 1_000 === 0 ? 0 : 1)}k`
  return `${sign}${CURRENCY}${a.toFixed(0)}`
}

// Opportunity card types.
export const CARD_TYPES = [
  'Enquiry', 'Quote / Proposal', 'Booking', 'Group Tour', 'Corporate / MICE',
  'VIP / Protocol', 'Visa & Permits', 'Referral', 'Other',
] as const

export const PRIORITIES = ['Low', 'Medium', 'High', 'VIP'] as const

// Where an enquiry came from — drives source-of-business reporting.
export const ENQUIRY_SOURCES = [
  'whatsapp', 'website', 'referral', 'embassy', 'event', 'walk-in', 'repeat', 'partner',
] as const
export type EnquirySource = (typeof ENQUIRY_SOURCES)[number]

// ---------------------------------------------------------------------------
// Accounts (CRM Tier 1). An account moves lead → qualified → prospect → active
// → past, with disqualified parked. An account is a traveller, a corporate, an
// embassy, a government body, or a referral partner.
// ---------------------------------------------------------------------------
export const ACCOUNT_STATUSES = [
  { id: 'lead',         label: 'Lead',          color: '#C2185B' },
  { id: 'qualified',    label: 'Qualified',     color: '#E91E73' },
  { id: 'prospect',     label: 'Prospect',      color: '#C9A84C' },
  { id: 'active',       label: 'Active client', color: '#4A7C59' },
  { id: 'past',         label: 'Past client',   color: '#6B6B6B' },
  { id: 'disqualified', label: 'Not a fit',     color: '#475569' },
] as const

export type AccountStatusId = (typeof ACCOUNT_STATUSES)[number]['id']

export const ACCOUNT_FUNNEL: AccountStatusId[] = ['lead', 'qualified', 'prospect', 'active']
export const ACCOUNT_CLOSED: AccountStatusId[] = ['past', 'disqualified']

export function accountStatus(id: string) {
  return ACCOUNT_STATUSES.find((s) => s.id === id) || ACCOUNT_STATUSES[0]
}

export const ACCOUNT_KINDS = [
  { id: 'individual', label: 'Individual / Family' },
  { id: 'corporate',  label: 'Corporate / MICE' },
  { id: 'embassy',    label: 'Embassy / Diplomatic' },
  { id: 'government', label: 'Government / Protocol' },
  { id: 'partner',    label: 'Referral Partner' },
] as const
export type AccountKindId = (typeof ACCOUNT_KINDS)[number]['id']

// ---------------------------------------------------------------------------
// Trip status (Tier 2 parent). A trip moves planning → booked → confirmed →
// travelling → completed (or cancelled).
// ---------------------------------------------------------------------------
export const TRIP_STATUSES: Record<string, { label: string; color: string }> = {
  planning:   { label: 'Planning',   color: '#C9A84C' },
  booked:     { label: 'Booked',     color: '#2B6A7C' },
  confirmed:  { label: 'Confirmed',  color: '#378A9F' },
  travelling: { label: 'Travelling', color: '#5C6B4F' },
  completed:  { label: 'Completed',  color: '#4A7C59' },
  cancelled:  { label: 'Cancelled',  color: '#B33A3A' },
}
export function tripStatus(id: string) { return TRIP_STATUSES[id] || TRIP_STATUSES.planning }

// Trip segment kinds (Tier-2 components): the building blocks of an itinerary.
export const SEGMENT_KINDS = [
  { id: 'lodge',    label: 'Lodge / Camp' },
  { id: 'transfer', label: 'Transfer' },
  { id: 'flight',   label: 'Flight / Charter' },
  { id: 'activity', label: 'Activity / Excursion' },
  { id: 'guide',    label: 'Guide / Ranger' },
  { id: 'permit',   label: 'Permit / Park fees' },
  { id: 'other',    label: 'Other' },
] as const
export type SegmentKindId = (typeof SEGMENT_KINDS)[number]['id']

export const SEGMENT_STATUSES: Record<string, { label: string; color: string }> = {
  proposed:  { label: 'Proposed',  color: '#6B6B6B' },
  held:      { label: 'On hold',   color: '#C9A84C' },
  confirmed: { label: 'Confirmed', color: '#378A9F' },
  booked:    { label: 'Booked',    color: '#4A7C59' },
  cancelled: { label: 'Cancelled', color: '#B33A3A' },
}
export function segmentStatus(id: string) { return SEGMENT_STATUSES[id] || SEGMENT_STATUSES.proposed }

// Payment milestones (Tier-2 tranches): deposit / balance, etc.
export const PAYMENT_STATUSES: Record<string, { label: string; color: string }> = {
  pending:     { label: 'Pending',     color: '#6B6B6B' },
  invoiceable: { label: 'Invoiceable', color: '#C9A84C' },
  invoiced:    { label: 'Invoiced',    color: '#2B6A7C' },
  paid:        { label: 'Paid',        color: '#4A7C59' },
  overdue:     { label: 'Overdue',     color: '#B33A3A' },
}
export function paymentStatus(id: string) { return PAYMENT_STATUSES[id] || PAYMENT_STATUSES.pending }

// Trip docs / checklist (Tier-2 deliverables): the things that must exist before
// a traveller flies.
export const DOC_STATUSES: Record<string, { label: string; color: string }> = {
  todo:        { label: 'To do',       color: '#6B6B6B' },
  in_progress: { label: 'In progress', color: '#C9A84C' },
  ready:       { label: 'Ready',       color: '#2B6A7C' },
  delivered:   { label: 'Delivered',   color: '#4A7C59' },
  na:          { label: 'N/A',         color: '#475569' },
}
export function docStatus(id: string) { return DOC_STATUSES[id] || DOC_STATUSES.todo }

// A sensible default trip checklist (codes a–) seeded for each new trip.
export const DEFAULT_TRIP_DOCS = [
  { code: 'a', label: 'Itinerary PDF' },
  { code: 'b', label: 'Quote / invoice' },
  { code: 'c', label: 'Deposit received' },
  { code: 'd', label: 'Visa / permits' },
  { code: 'e', label: 'Travel insurance' },
  { code: 'f', label: 'Flights ticketed' },
  { code: 'g', label: 'Lodge vouchers' },
  { code: 'h', label: 'Transfers booked' },
  { code: 'i', label: 'Guide assigned' },
  { code: 'j', label: 'Final docs sent' },
] as const

// ---------------------------------------------------------------------------
// The TourLink team. EDIT THIS LIST to match your real people — it drives the
// Ops sign-in identities, owner colours, and roles. (Names below are seeded from
// the team's own discussions; adjust spelling/roles as needed.)
// ---------------------------------------------------------------------------
export const TEAM_MEMBERS = [
  { name: 'Ernest', role: 'Build, Product & Design',   color: '#2B3990' },
  { name: 'Welly',  role: 'Business Dev & Network',    color: '#C2185B' },
  { name: 'Joy',    role: 'Pipeline & Relationships',  color: '#C9A84C' },
  { name: 'Isabel', role: 'Operations & Exhibitions',  color: '#2B6A7C' },
] as const

export const TEAM_NAMES = TEAM_MEMBERS.map((m) => m.name)

// People shown in the Ops "who am I" switcher.
export const SIGN_IN_PEOPLE: string[] = [...TEAM_NAMES]

// Default owners new work falls to, and who approves client-facing quotes.
export const BIZDEV_OWNER = 'Welly'
export const OPS_OWNER = 'Isabel'

// Assignable owners: the team + a generic BizDev queue + Unassigned.
export const DEFAULT_OWNERS = ['Unassigned', ...TEAM_NAMES, 'Business Dev', 'Guide'] as const

export const OWNER_COLORS: Record<string, string> = {
  ...Object.fromEntries(TEAM_MEMBERS.map((m) => [m.name, m.color])),
  'Business Dev': '#9B1348',
  Guide: '#5C6B4F',
  Unassigned: '#6B6B6B',
}

export const OWNER_ROLES: Record<string, string> = {
  ...Object.fromEntries(TEAM_MEMBERS.map((m) => [m.name, m.role])),
  'Business Dev': 'Customer Acquisition queue',
  Guide: 'On-the-ground & Guiding',
  Unassigned: 'No owner yet',
}

export function ownerColor(name: string): string {
  if (OWNER_COLORS[name]) return OWNER_COLORS[name]
  let h = 0
  for (let i = 0; i < name.length; i++) h = (h * 31 + name.charCodeAt(i)) % 360
  return `hsl(${h} 55% 45%)`
}

export function initials(name: string): string {
  if (!name || name === 'Unassigned') return '–'
  return name.split(' ').map((w) => w[0]).join('').slice(0, 2).toUpperCase()
}

// Destinations TourLink sells (mirrors the public site's country set).
export const DESTINATIONS = [
  'South Africa', 'Tanzania', 'Zimbabwe', 'Mozambique',
  'Namibia', 'Botswana', 'Kenya', 'Zambia',
] as const
