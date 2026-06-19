// Seed TourRelay with REAL data:
//  1. GTM high-value targets from the 18 Jun strategy meeting minutes.
//  2. Real clients from C:\Users\ernes\Downloads\TourLink\TourLink\CLIENT_DATABASE.xlsx
//     (the master "Client Tracker"), plus the extra client folders.
// Idempotent: skips an account if one with the same name already exists. Never
// updates existing rows. Seeds into the TourLink workspace only.
//   run:  node bin/seed-real.mjs

import { readFileSync } from 'node:fs'
import { createClient } from '@supabase/supabase-js'
import xlsx from 'xlsx'

// --- env ---
try {
  for (const line of readFileSync(new URL('../.env.local', import.meta.url), 'utf8').split('\n')) {
    const m = line.match(/^\s*([\w.]+)\s*=\s*(.*)\s*$/)
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, '')
  }
} catch { /* rely on env */ }
const url = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL
const key = process.env.SUPABASE_SERVICE_ROLE_KEY
if (!url || !key) { console.error('✗ Missing Supabase env'); process.exit(1) }
const db = createClient(url, key, { auth: { persistSession: false } })
const DB_PATH = 'C:/Users/ernes/Downloads/TourLink/TourLink/CLIENT_DATABASE.xlsx'

// --- helpers ---
const DEST_COUNTRY = { Zanzibar: 'Tanzania', 'Cape Town': 'South Africa', Joburg: 'South Africa', Johannesburg: 'South Africa', Safari: 'Tanzania', Serengeti: 'Tanzania' }
const MONTHS = { jan: 0, feb: 1, mar: 2, apr: 3, may: 4, jun: 5, jul: 6, aug: 7, sep: 8, oct: 9, nov: 10, dec: 11 }

function paxOf(g) {
  if (!g) return null
  const s = String(g).toLowerCase()
  if (s.includes('couple')) return 2
  const m = s.match(/(\d+)/)
  return m ? Number(m[1]) : null
}
function statusMap(q) {
  const s = String(q || '').toLowerCase()
  if (s.includes('confirm') || s.includes('booked') || s.includes('paid')) return { acc: 'active', stage: 'confirmed', trip: 'confirmed', outcome: 'won' }
  if (s.includes('quote')) return { acc: 'prospect', stage: 'itinerary', trip: 'planning', outcome: 'open' }
  return { acc: 'lead', stage: 'enquiry', trip: 'planning', outcome: 'open' }
}
// Best-effort start date from strings like "24-28 Apr 2026", "25 Feb – 2 Mar 26",
// "5-8 Feb 2026", "14-15 Feb 2026", "May 2026". Returns ISO or null.
function startDate(d) {
  if (!d || /tbc/i.test(d)) return null
  const s = String(d)
  let m = s.match(/(\d{1,2}).*?([A-Za-z]{3,})\s*(20\d{2}|\d{2})/) // first day + month + year
  if (m) {
    const day = Number(m[1]); const mo = MONTHS[m[2].slice(0, 3).toLowerCase()]
    let yr = Number(m[3]); if (yr < 100) yr += 2000
    if (mo != null) return `${yr}-${String(mo + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
  }
  m = s.match(/([A-Za-z]{3,})\s*(20\d{2})/) // "May 2026"
  if (m) { const mo = MONTHS[m[1].slice(0, 3).toLowerCase()]; if (mo != null) return `${m[2]}-${String(mo + 1).padStart(2, '0')}-01` }
  return null
}

let teamId
async function ensureTeam() {
  const { data: t } = await db.from('teams').select('id,name').order('created_at', { ascending: true })
  const have = new Set((t || []).map((x) => x.name.toLowerCase()))
  if (!have.has('tourlink')) await db.from('teams').insert({ name: 'TourLink' })
  const { data: teams } = await db.from('teams').select('id,name')
  teamId = (teams.find((x) => x.name.toLowerCase() === 'tourlink') || teams[0]).id
}

async function seedClient(c) {
  const { data: exists } = await db.from('accounts').select('id').eq('team_id', teamId).ilike('name', c.name).maybeSingle()
  if (exists) return false
  const map = statusMap(c.status)
  const country = DEST_COUNTRY[c.dest] || c.dest || null
  const pax = paxOf(c.guests)
  const noteParts = [c.hotel && !/tbc/i.test(c.hotel) ? `Hotel: ${c.hotel}` : '', c.dates ? `Dates: ${c.dates}` : '', c.notes || ''].filter(Boolean)
  const { data: acc } = await db.from('accounts').insert({
    team_id: teamId, name: c.name, kind: c.kind || 'individual', status: c.gtm ? (c.accStatus || 'qualified') : map.acc,
    vip: !!c.vip, owner_name: c.owner || 'Isabel', source: c.source || 'referral', country,
    notes: noteParts.join(' · ') || null,
  }).select('id,name').single()
  const { data: board } = await db.from('boards').insert({ team_id: teamId, account_id: acc.id, name: `${acc.name} — Trips` }).select('id').single()

  if (c.gtm) {
    // GTM target = top-of-funnel enquiry card, no trip yet.
    await db.from('cards').insert({
      board_id: board.id, account_id: acc.id, title: c.title, type: c.kind === 'embassy' || c.kind === 'government' ? 'VIP / Protocol' : 'Enquiry',
      stage: c.stage || 'qualified', owner_name: c.owner, priority: c.vip ? 'VIP' : 'High', source: c.source, value: c.value || 0,
      destinations: country ? [country] : [], position: c.pos || 100, notes: c.brief || null,
    })
    await db.from('activity').insert({ team_id: teamId, actor_name: 'GTM seed', verb: 'created', subject: c.title, detail: 'high-value target', account_id: acc.id })
    return true
  }

  const start = startDate(c.dates)
  const total = Number(String(c.total).replace(/[^\d.]/g, '')) || 0
  const tripName = `${c.dest} — ${c.dates || 'dates TBC'}`
  const { data: trip } = await db.from('trips').insert({
    team_id: teamId, account_id: acc.id, name: tripName, status: map.trip,
    destinations: country ? [country] : [], start_date: start, pax, value: total,
    notes: noteParts.join(' · ') || null,
  }).select('id,name').single()
  if (c.hotel && !/tbc/i.test(c.hotel)) {
    await db.from('segments').insert({ team_id: teamId, trip_id: trip.id, name: `${c.hotel}${c.nights && c.nights !== 'TBC' ? ` — ${c.nights}n` : ''}`, kind: 'lodge', value: total, status: map.outcome === 'won' ? 'confirmed' : 'proposed', nights: c.nights && c.nights !== 'TBC' ? Number(c.nights) || null : null, sort: 0 })
  }
  await db.from('trip_docs').insert(['Itinerary PDF', 'Quote / invoice', 'Deposit received', 'Visa / permits', 'Flights ticketed', 'Lodge vouchers', 'Final docs sent'].map((label, i) => ({ team_id: teamId, trip_id: trip.id, label, status: 'todo', sort: i })))
  if (total > 0) {
    const dep = Math.round(total * 0.3)
    await db.from('payments').insert([
      { team_id: teamId, trip_id: trip.id, label: 'Deposit (30%)', amount: dep, status: 'invoiceable', trigger: 'On confirmation', sort: 0 },
      { team_id: teamId, trip_id: trip.id, label: 'Balance (70%)', amount: total - dep, status: 'pending', trigger: '30 days before travel', sort: 1 },
    ])
  }
  await db.from('cards').insert({
    board_id: board.id, account_id: acc.id, trip_id: trip.id, title: tripName, type: pax && pax >= 6 ? 'Group Tour' : 'Booking',
    stage: map.stage, owner_name: acc.owner_name || 'Isabel', priority: 'Medium', source: 'referral', value: total, pax,
    destinations: country ? [country] : [], travel_from: start, outcome: map.outcome, position: 200,
    notes: c.notes || null,
  })
  await db.from('activity').insert({ team_id: teamId, actor_name: 'Client import', verb: map.outcome === 'won' ? 'won' : 'created', subject: c.name, detail: `${c.dest} · ${c.status}`, account_id: acc.id, trip_id: trip.id })
  return true
}

async function main() {
  await ensureTeam()

  // 1) GTM high-value targets (from the 18 Jun 2026 strategy minutes)
  const gtm = [
    { gtm: true, name: 'Ambassador Saddam', kind: 'embassy', vip: true, owner: 'Joy', source: 'embassy', country: 'Zimbabwe', accStatus: 'qualified', stage: 'qualified', title: 'Acting Zimbabwean Ambassador — cultural-tour partnership', pos: 10, brief: 'Courtesy/coffee meeting (Joy + Welly), two-hats. Position TourLink as cultural-tour partner for inbound visitors (Mbare, Mutoko, Great Zimbabwe, Vic Falls). Target 30 Jun 2026.' },
    { gtm: true, name: 'Tourism Authority CEO', kind: 'government', vip: true, owner: 'Joy', source: 'referral', country: 'Zimbabwe', accStatus: 'qualified', stage: 'qualified', title: 'CEO, Tourism Authority — institutional meeting', pos: 11, brief: 'Joy scheduling meeting for Welly. Prime with full talking points + deck. Target 30 Jun 2026.' },
    { gtm: true, name: 'ZTE CEO', kind: 'corporate', vip: true, owner: 'Welly', source: 'referral', country: 'Zimbabwe', accStatus: 'prospect', stage: 'qualified', title: 'ZTE CEO — intro via existing contact', pos: 12, brief: 'Pursue introduction + meeting via existing contact (best-friend network). Two-hats. Target 15 Jul 2026.' },
    { gtm: true, name: 'UAE Embassy', kind: 'embassy', vip: true, owner: 'Welly', source: 'embassy', country: 'United Arab Emirates', accStatus: 'lead', stage: 'enquiry', title: 'UAE Embassy — high-value partnership opportunity', pos: 13, brief: 'Flagged as a particularly big opportunity. Do not limit to Southern-African embassies. Re-activate embassy-event contacts.' },
  ]

  // 2a) Real clients from the master tracker
  const wb = xlsx.readFile(DB_PATH)
  const rows = xlsx.utils.sheet_to_json(wb.Sheets['Client Tracker'], { defval: '', header: 1 })
  const tracker = []
  for (let i = 2; i < rows.length; i++) {
    const r = rows[i]
    if (!r[1] || String(r[1]).trim() === '' || String(r[1]).trim() === 'Client Name') continue
    tracker.push({ name: String(r[1]).trim(), dest: String(r[2]).trim(), dates: String(r[3]).trim(), guests: String(r[4]).trim(), nights: String(r[5]).trim(), hotel: String(r[7]).trim(), status: String(r[8]).trim(), total: r[9], notes: String(r[11]).trim() })
  }

  // 2b) Extra client folders not in the tracker (have real quote files on disk)
  const extras = [
    { name: 'Bethseda Church Ladies', dest: 'Zanzibar', dates: '20-29 Nov 2026', guests: 'Group', nights: '5', hotel: 'TBC', status: 'Quoted', notes: "Church ladies group — Zele Women's Group quotes prepared" },
    { name: 'FIF Ladies Group', dest: 'Zanzibar', dates: 'TBC', guests: 'Group', nights: 'TBC', hotel: 'TBC', status: 'Quoted', notes: 'Ladies group — Zanzibar + Joburg quotes' },
    { name: 'Motie', dest: 'Zanzibar', dates: 'TBC', guests: 'Couple', nights: 'TBC', hotel: 'TBC', status: 'Quoted', notes: 'Zanzibar + Cape Town quotes' },
    { name: 'Musabayana', dest: 'Zanzibar', dates: 'TBC', guests: 'Group', nights: 'TBC', hotel: 'TBC', status: 'Quoted', notes: 'Quote + extra shuttle services' },
    { name: 'Kuzamba', dest: 'Zanzibar', dates: 'TBC', guests: 'TBC', nights: 'TBC', hotel: 'TBC', status: 'Quoted', notes: 'Zanzibar quote prepared' },
    { name: 'Spears', dest: 'Zanzibar', dates: 'TBC', guests: 'TBC', nights: 'TBC', hotel: 'TBC', status: 'Enquiry', notes: 'Folder created — follow up' },
    { name: 'Catherine J', dest: 'Zanzibar', dates: 'TBC', guests: 'TBC', nights: 'TBC', hotel: 'TBC', status: 'Enquiry', notes: 'Packages 2026 shared' },
  ]

  let created = 0, skipped = 0
  for (const c of [...gtm, ...tracker, ...extras]) {
    try { (await seedClient(c)) ? created++ : skipped++ } catch (e) { console.error(`! ${c.name}: ${e.message}`) }
  }
  console.log(`✓ Seeded ${created} new (GTM + clients), skipped ${skipped} already present.`)
}
main().then(() => process.exit(0)).catch((e) => { console.error(e); process.exit(1) })
