// Domain types for the TourLink CRM. These mirror the Supabase schema in
// supabase/migrations/0001_crm.sql. All rows are team-scoped.

import type {
  StageId, AccountStatusId, AccountKindId, EnquirySource, SegmentKindId,
} from '@/lib/crm/constants'

export interface Team {
  id: string
  name: string
  created_at: string
}

/** Tier-1 account — a traveller, corporate, embassy, government body, or partner. */
export interface Account {
  id: string
  team_id: string
  name: string
  kind: AccountKindId
  status: AccountStatusId
  owner_name: string
  source: EnquirySource | null
  country: string | null
  contact_phone: string | null
  contact_email: string | null
  vip: boolean
  value: number
  notes: string | null
  created_at: string
  updated_at: string
}

/** One delivery board per account (holds its opportunity cards). */
export interface Board {
  id: string
  team_id: string
  account_id: string | null
  name: string
  created_at: string
}

/** An opportunity / enquiry card — lives on the pipeline. */
export interface Card {
  id: string
  board_id: string
  account_id: string | null
  trip_id: string | null
  title: string
  type: string
  stage: StageId
  owner_name: string
  priority: string
  source: EnquirySource | null
  value: number
  pax: number | null
  destinations: string[]
  travel_from: string | null // ISO date
  travel_to: string | null   // ISO date
  due: string | null         // ISO date
  outcome: 'open' | 'won' | 'lost'
  outcome_reason: string | null
  notes: string | null
  docs: { label: string; url: string }[]
  position: number
  created_at: string
  updated_at: string
}

/** A single day on a trip's day-by-day itinerary (from a package or authored). */
export interface TripItineraryDay {
  day: number
  title: string
  description?: string
  accommodation?: string | null
  meals?: string[]
  activities?: string[]
  destination?: string | null
}

/** Tier-2 parent — a single booked journey for an account. */
export interface Trip {
  id: string
  team_id: string
  account_id: string
  name: string
  status: string
  destinations: string[]
  start_date: string | null
  end_date: string | null
  pax: number | null
  value: number
  notes: string | null
  share_token: string | null
  itinerary: TripItineraryDay[]
  created_at: string
  updated_at: string
}

/** Tier-2 component — an itinerary building block (lodge, transfer, flight…). */
export interface Segment {
  id: string
  team_id: string
  trip_id: string
  name: string
  kind: SegmentKindId
  value: number
  status: string
  nights: number | null
  start_date: string | null
  supplier: string | null // DMC / lodge / partner
  sort: number
  notes: string | null
}

/** Tier-2 payment milestone — deposit, balance, etc. */
export interface Payment {
  id: string
  team_id: string
  trip_id: string
  label: string
  trigger: string | null
  amount: number
  status: string
  due_date: string | null
  invoiced_at: string | null
  paid_at: string | null
  sort: number
}

/** Tier-2 trip document / checklist item. */
export interface TripDoc {
  id: string
  team_id: string
  trip_id: string
  code: string | null
  label: string
  status: string
  owner_name: string | null
  due: string | null
  sort: number
}

/** Append-only activity feed. */
export interface Activity {
  id: string
  team_id: string
  actor_name: string
  verb: string
  subject: string
  detail: string | null
  account_id: string | null
  trip_id: string | null
  card_id: string | null
  created_at: string
}

/** Outbound message queue — the bridge poller delivers these to WhatsApp. */
export interface OutboxRow {
  id: string
  team_id: string
  target: string // a phone number, a team-member name, or 'group'
  kind: string
  text: string
  media_url: string | null
  media_mime: string | null
  media_name: string | null
  status: 'queued' | 'sent' | 'failed'
  created_at: string
  sent_at: string | null
}
