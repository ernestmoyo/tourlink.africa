// Idempotent DEMO seed for the TourLink desk. Creates one worked-through VIP
// trip so /ops looks alive for an internal walkthrough. Safe to re-run: it
// checks for the demo account by name and exits if it already exists. It NEVER
// updates existing rows. Run explicitly:  node bin/seed-demo.mjs
//
// Reads NEXT_PUBLIC_SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY from .env.local.

import { readFileSync } from 'node:fs'
import { createClient } from '@supabase/supabase-js'

// --- load .env.local (no dotenv dependency) ---
try {
  for (const line of readFileSync(new URL('../.env.local', import.meta.url), 'utf8').split('\n')) {
    const m = line.match(/^\s*([\w.]+)\s*=\s*(.*)\s*$/)
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, '')
  }
} catch { /* no .env.local — rely on the environment */ }

const url = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL
const key = process.env.SUPABASE_SERVICE_ROLE_KEY
if (!url || !key) { console.error('✗ Set NEXT_PUBLIC_SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY in .env.local'); process.exit(1) }

const db = createClient(url, key, { auth: { persistSession: false } })
const DEMO = 'H.E. Ambassador Saddam (Demo)'

async function main() {
  // Ensure the TourLink workspace exists; seed the demo into it.
  const { data: existing } = await db.from('teams').select('id, name').order('created_at', { ascending: true })
  const have = new Set((existing || []).map((t) => t.name.toLowerCase()))
  if (!have.has('tourlink')) await db.from('teams').insert({ name: 'TourLink' })
  const { data: teams } = await db.from('teams').select('id, name')
  const teamId = (teams.find((t) => t.name.toLowerCase() === 'tourlink') || teams[0]).id

  // idempotency guard
  const { data: exists } = await db.from('accounts').select('id').eq('team_id', teamId).eq('name', DEMO).maybeSingle()
  if (exists) { console.log('✓ Demo already present — nothing to do.'); return }

  // account (VIP embassy)
  const { data: acc } = await db.from('accounts').insert({
    team_id: teamId, name: DEMO, kind: 'embassy', status: 'active', vip: true,
    owner_name: 'Business Dev', source: 'embassy', country: 'Zimbabwe',
    contact_phone: '+263 772 000 000', contact_email: 'protocol@example.org',
    notes: 'Met at the embassy opening night. Two hats: visas (VisaPermitLink) + cultural tour (TourLink).',
  }).select('*').single()

  const { data: board } = await db.from('boards').insert({ team_id: teamId, account_id: acc.id, name: `${acc.name} — Trips` }).select('id').single()

  // a won enquiry + a fresh referral lead
  await db.from('cards').insert([
    { board_id: board.id, account_id: acc.id, title: 'Zimbabwe cultural tour + Vic Falls', type: 'VIP / Protocol', stage: 'confirmed', owner_name: 'Operations', priority: 'VIP', source: 'embassy', value: 24000, pax: 4, destinations: ['Zimbabwe'], outcome: 'won', position: 1 },
    { board_id: board.id, account_id: acc.id, title: 'Referral: colleague wants Zanzibar honeymoon', type: 'Referral', stage: 'enquiry', owner_name: 'Business Dev', priority: 'High', source: 'referral', value: 0, pax: 2, destinations: ['Tanzania'], outcome: 'open', position: 2 },
  ])

  // trip + segments + payments + checklist
  const { data: trip } = await db.from('trips').insert({
    team_id: teamId, account_id: acc.id, name: 'Zimbabwe Cultural + Vic Falls — Aug 2026', status: 'confirmed',
    destinations: ['Zimbabwe'], start_date: '2026-08-12', end_date: '2026-08-19', pax: 4, value: 24000,
  }).select('*').single()

  await db.from('segments').insert([
    { team_id: teamId, trip_id: trip.id, name: 'Victoria Falls — 3 nights', kind: 'lodge', value: 9000, status: 'booked', nights: 3, supplier: 'DMC: Falls Collection', sort: 1 },
    { team_id: teamId, trip_id: trip.id, name: 'Hwange Safari — 2 nights', kind: 'lodge', value: 7600, status: 'confirmed', nights: 2, supplier: 'DMC: Hwange Bush', sort: 2 },
    { team_id: teamId, trip_id: trip.id, name: 'Harare → Mutoko cultural day', kind: 'activity', value: 2400, status: 'confirmed', sort: 3 },
    { team_id: teamId, trip_id: trip.id, name: 'Private guide (Isabel)', kind: 'guide', value: 3000, status: 'confirmed', sort: 4 },
    { team_id: teamId, trip_id: trip.id, name: 'Airport + inter-camp transfers', kind: 'transfer', value: 2000, status: 'booked', sort: 5 },
  ])

  await db.from('payments').insert([
    { team_id: teamId, trip_id: trip.id, label: 'Deposit 30%', amount: 7200, status: 'paid', trigger: 'On confirmation', due_date: '2026-06-20', paid_at: new Date('2026-06-18').toISOString(), sort: 1 },
    { team_id: teamId, trip_id: trip.id, label: 'Balance 70%', amount: 16800, status: 'invoiceable', trigger: '30 days before travel', due_date: '2026-07-13', sort: 2 },
  ])

  const docs = [
    ['a', 'Itinerary PDF', 'delivered'], ['b', 'Quote / invoice', 'delivered'], ['c', 'Deposit received', 'delivered'],
    ['d', 'Visa / permits', 'in_progress'], ['e', 'Travel insurance', 'todo'], ['f', 'Flights ticketed', 'todo'],
    ['g', 'Lodge vouchers', 'ready'], ['h', 'Transfers booked', 'ready'], ['i', 'Guide assigned', 'delivered'], ['j', 'Final docs sent', 'todo'],
  ]
  await db.from('trip_docs').insert(docs.map(([code, label, status], i) => ({ team_id: teamId, trip_id: trip.id, code, label, status, sort: i })))

  await db.from('activity').insert({ team_id: teamId, actor_name: 'Seed', verb: 'created trip', subject: trip.name, detail: 'demo data', account_id: acc.id, trip_id: trip.id })

  console.log(`✓ Seeded demo client "${DEMO}" with a confirmed $24k trip (deposit paid, balance due).`)
}

main().then(() => process.exit(0)).catch((e) => { console.error(e); process.exit(1) })
