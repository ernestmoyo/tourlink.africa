import 'server-only'
import type { SupabaseClient } from '@supabase/supabase-js'
import { DEFAULT_TRIP_DOCS } from '@/lib/crm/constants'
import type { Account, Card, Trip, Segment, Payment, TripDoc } from '@/lib/crm/types'
import type { TripSpec } from '@/lib/crm/packages'

// ===========================================================================
// Concierge state — load + log helpers shared by the deterministic and AI
// brains. The CRM is two-tier: one board per account (boards.account_id), plus
// trips → segments / payments / trip_docs under each account.
//
// The concierge uses the service-role admin client (bypasses RLS), so every
// query MUST be explicitly scoped by team_id (or by ids resolved from
// team-scoped state).
// ===========================================================================

type Db = SupabaseClient

export type Ctx = { admin: Db; teamId: string; sender: string }

export type ConciergeState = {
  accounts: Account[]
  cards: Card[]
  trips: Trip[]
  segments: Segment[]
  payments: Payment[]
  docs: TripDoc[]
}

export async function loadState(ctx: Ctx): Promise<ConciergeState> {
  // Cards live across many per-account boards, so first resolve the team's board
  // ids, then pull every card on them.
  const { data: boards } = await ctx.admin.from('boards').select('id').eq('team_id', ctx.teamId)
  const boardIds = (boards || []).map((b) => b.id as string)
  const cardsP = boardIds.length
    ? ctx.admin.from('cards').select('*').in('board_id', boardIds)
    : Promise.resolve({ data: [] as Card[] })
  const [{ data: cards }, { data: accounts }, { data: trips }, { data: segments }, { data: payments }, { data: docs }] =
    await Promise.all([
      cardsP,
      ctx.admin.from('accounts').select('*').eq('team_id', ctx.teamId),
      ctx.admin.from('trips').select('*').eq('team_id', ctx.teamId),
      ctx.admin.from('segments').select('*').eq('team_id', ctx.teamId),
      ctx.admin.from('payments').select('*').eq('team_id', ctx.teamId),
      ctx.admin.from('trip_docs').select('*').eq('team_id', ctx.teamId),
    ])
  return {
    accounts: (accounts || []) as Account[],
    cards: (cards || []) as Card[],
    trips: (trips || []) as Trip[],
    segments: (segments || []) as Segment[],
    payments: (payments || []) as Payment[],
    docs: (docs || []) as TripDoc[],
  }
}

// Find (or create) the delivery board for an account. With per-account boards,
// every card must land on its account's own board. Returns the board id.
export async function getOrCreateAccountBoard(admin: Db, teamId: string, accountId: string, accountName: string): Promise<string> {
  const { data: existing } = await admin.from('boards').select('id')
    .eq('team_id', teamId).eq('account_id', accountId).order('created_at', { ascending: true }).limit(1).maybeSingle()
  if (existing?.id) return existing.id as string
  const { data: created } = await admin.from('boards')
    .insert({ team_id: teamId, account_id: accountId, name: `${accountName} — Trips` })
    .select('id').single()
  return created!.id as string
}

// Seed a standard 30% deposit + 70% balance payment plan for a trip from its
// total value. No-op if value is 0 or (unless force) payments already exist.
export async function seedPaymentPlan(
  ctx: Ctx, tripId: string, value: number, startDate?: string | null, force = false,
): Promise<boolean> {
  if (!value || value <= 0) return false
  if (!force) {
    const { data: existing } = await ctx.admin.from('payments').select('id').eq('trip_id', tripId).limit(1)
    if (existing && existing.length) return false
  }
  const deposit = Math.round(value * 0.3)
  const balance = value - deposit
  let balanceDue: string | null = null
  if (startDate) { const d = new Date(startDate + 'T00:00'); d.setDate(d.getDate() - 30); balanceDue = d.toISOString().slice(0, 10) }
  await ctx.admin.from('payments').insert([
    { team_id: ctx.teamId, trip_id: tripId, label: 'Deposit (30%)', amount: deposit, trigger: 'On confirmation', status: 'invoiceable', sort: 0 },
    { team_id: ctx.teamId, trip_id: tripId, label: 'Balance (70%)', amount: balance, trigger: '30 days before travel', due_date: balanceDue, status: 'pending', sort: 1 },
  ])
  return true
}

// Materialise a TripSpec (e.g. from a catalogue package) into trip + segments +
// seeded checklist + a 30/70 payment plan. Returns the new trip's id and name.
export async function createTripFromSpec(ctx: Ctx, accountId: string, spec: TripSpec): Promise<{ tripId: string; name: string } | null> {
  const { data: trip } = await ctx.admin.from('trips').insert({
    team_id: ctx.teamId, account_id: accountId, name: spec.name, status: 'planning',
    destinations: spec.destinations, start_date: spec.startDate, end_date: spec.endDate,
    pax: spec.pax, value: spec.value, itinerary: spec.itinerary || [],
  }).select('id, name').single()
  if (!trip) return null
  if (spec.segments.length) {
    await ctx.admin.from('segments').insert(spec.segments.map((s, i) => ({
      team_id: ctx.teamId, trip_id: trip.id as string, name: s.name, kind: s.kind, value: s.value,
      nights: s.nights, supplier: s.supplier, status: 'proposed', sort: i,
    })))
  }
  await ctx.admin.from('trip_docs').insert(DEFAULT_TRIP_DOCS.map((d, i) => ({
    team_id: ctx.teamId, trip_id: trip.id as string, code: d.code, label: d.label, status: 'todo', sort: i,
  })))
  await seedPaymentPlan(ctx, trip.id as string, spec.value, spec.startDate)
  return { tripId: trip.id as string, name: trip.name as string }
}

export async function log(
  ctx: Ctx,
  verb: string,
  subject: string,
  detail: string,
  refs: { card_id?: string | null; account_id?: string | null; trip_id?: string | null },
): Promise<void> {
  await ctx.admin.from('activity').insert({
    team_id: ctx.teamId, actor_name: `${ctx.sender} (WhatsApp)`, verb,
    subject, detail, card_id: refs.card_id ?? null, account_id: refs.account_id ?? null, trip_id: refs.trip_id ?? null,
  })
}

export function accountName(card: Card, accounts: Account[]): string {
  return (card.account_id && accounts.find((a) => a.id === card.account_id)?.name) || '—'
}

export function daysLate(due: string | null): number | null {
  if (!due) return null
  const today = new Date(new Date().toDateString()).getTime()
  return Math.round((today - new Date(due + 'T00:00').getTime()) / 86400000)
}

// fuzzy: score a card against a query by title + account name.
export function matchCards(cards: Card[], accounts: Account[], q: string): { card: Card; score: number }[] {
  const n = q.toLowerCase().trim()
  if (n.length < 2) return []
  return cards.map((c) => {
    const hay = `${c.title} ${accountName(c, accounts)}`.toLowerCase()
    let score = 0
    if (hay.includes(n)) score += 5
    for (const w of n.split(/\s+/)) if (w.length > 2 && hay.includes(w)) score += 1
    if (c.outcome === 'open') score += 0.5
    return { card: c, score }
  }).filter((x) => x.score > 0).sort((a, b) => b.score - a.score)
}

export function resolveCard(matches: { card: Card; score: number }[]): { card?: Card; ambiguous?: { card: Card }[] } {
  if (matches.length === 0) return {}
  if (matches.length === 1 || matches[0].score > matches[1].score) return { card: matches[0].card }
  return { ambiguous: matches.filter((m) => m.score === matches[0].score).slice(0, 4) }
}
