import 'server-only'
import Anthropic from '@anthropic-ai/sdk'
import { promises as fs } from 'node:fs'
import { join } from 'node:path'
import {
  STAGE_IDS, WON_STAGES, STAGES, accountStatus, formatMoney, DEFAULT_TRIP_DOCS, OPS_OWNER,
} from '@/lib/crm/constants'
import {
  type Ctx, type ConciergeState, loadState, log, getOrCreateAccountBoard, createTripFromSpec, seedPaymentPlan,
} from '@/lib/concierge/state'
import { findPackage, packageToTripSpec, packageOptions } from '@/lib/crm/packages'
import { transcribeAudio, transcribeEnabled } from '@/lib/concierge/transcribe'
import { buildAndStore, enqueueDoc, generateAndDeliver, emailDoc } from '@/lib/documents/deliver'
import type { Account, Card, Trip } from '@/lib/crm/types'

// ===========================================================================
// Relay AI — a Claude-powered brain for the TourLink WhatsApp concierge.
// Understands natural language, drives the CRM through tool use, reads voice
// notes / documents / images, and composes client quotes (with an approval
// gate — nothing client-facing is sent without sign-off).
// Activated only when ANTHROPIC_API_KEY is set; otherwise the deterministic
// keyword brain (brain.ts) handles the message.
// ===========================================================================

export type Media = { data: string; mimetype: string; filename: string }

const MODEL = process.env.ANTHROPIC_MODEL || 'claude-opus-4-8'
const APPROVER = process.env.CONCIERGE_APPROVER || OPS_OWNER

export function aiEnabled(): boolean {
  return !!process.env.ANTHROPIC_API_KEY
}

function boardContext(state: ConciergeState): string {
  const { accounts, cards, trips, segments, payments, docs } = state
  const accName = (c: Card) => (c.account_id && accounts.find((a) => a.id === c.account_id)?.name) || '—'
  const accBlock = accounts.map((a) => {
    const head = `- ${a.vip ? '⭐ ' : ''}${a.name} [${accountStatus(a.status).label}] kind=${a.kind} id=${a.id}`
    const ts = trips.filter((t) => t.account_id === a.id).map((t) => {
      const segs = segments.filter((s) => s.trip_id === t.id)
        .map((s) => `        · segment "${s.name}" ${s.kind} value=${s.value} status=${s.status} id=${s.id}`)
      const pays = payments.filter((p) => p.trip_id === t.id)
        .map((p) => `        · payment "${p.label}" amount=${p.amount} status=${p.status} id=${p.id}`)
      const ds = docs.filter((d) => d.trip_id === t.id)
        .map((d) => `        · doc ${d.code || ''} "${d.label}" status=${d.status} id=${d.id}`)
      return [`     trip "${t.name}" status=${t.status} value=${t.value} pax=${t.pax ?? '?'} id=${t.id}`, ...segs, ...pays, ...ds].join('\n')
    })
    return [head, ...ts].join('\n')
  }).join('\n')
  const cardBlock = cards.map((c) =>
    `- "${c.title}" client=${accName(c)} stage=${c.stage} owner=${c.owner_name} value=${c.value || 0} pax=${c.pax ?? '?'} due=${c.due || 'none'} outcome=${c.outcome} id=${c.id}`,
  ).join('\n')
  return `CLIENTS (with trips / segments / payments / docs):\n${accBlock || '(none)'}\n\nENQUIRIES (pipeline cards):\n${cardBlock || '(none)'}`
}

const SYSTEM = (sender: string, ctx: string) => `You are Relay (you also answer to "Tour" and "TourRelay") — the AI assistant for the TourLink team, a tour operator across Southern & East Africa (South Africa, Tanzania, Zimbabwe, Mozambique, Namibia, Botswana, Kenya, Zambia), HQ in Dar es Salaam.

The TourLink team: *Ernest* (build & product), *Welly* (business dev & network), *Joy* (pipeline & relationships), *Isabel* (operations & exhibitions).

You do TWO jobs:
1) Run the desk — capture enquiries, qualify travellers, build trips, track deposits/balances, generate quotes/itineraries/vouchers — by calling the tools below.
2) Be the team's sharp, helpful GENERAL assistant — answer ANY question, draft messages, brainstorm, explain, reason things through, do quick maths. If a request isn't about the desk, just answer directly and conversationally; you don't need a tool for that.

Pipeline stages (in order): ${STAGE_IDS.join(' → ')}. Booked onward = won (deposit secured).
The message is from *${sender}*.

Here is the current desk state — use the id= values when calling tools:
${ctx}

Rules:
- Be decisive: if the user clearly wants a change, call the tool(s) and confirm. You may call several tools in one turn.
- Match clients/enquiries/trips fuzzily by what the user says to the names above; pick the best id.
- A new enquiry from a traveller → create_enquiry (it makes the client too). Capture pax, destinations, dates, budget when given.
- Build a trip with create_trip (a 30/70 deposit+balance plan is auto-created when you give it a value), then add_segment for each lodge/transfer/flight/activity/guide. If a trip has a value but no payments, call add_payment_plan; use add_payment only for non-standard milestones. If the client wants one of our catalogue packages, use build_trip_from_package instead (it fills the itinerary, pricing AND the payment plan for you).
- NEVER send a quote straight to a client. Use prepare_quote — it builds a PDF and goes to ${APPROVER} for approval first. Only ${APPROVER} can send_quote to the client.
- Itineraries (generate_itinerary) and vouchers (generate_voucher) are polished PDFs you can send to the client directly — no approval needed.
- If a document/image is attached (passport, ID, voucher, signed quote), read it, summarise it, and attach it to the right client/trip.
- For current or external facts NOT on the desk — lodge rates, park/visa fees, flights, seasons/weather, competitor offers, news — call web_research and weave the answer in, citing the source link(s) briefly.
- Reply in short, WhatsApp-friendly text with light emoji. Under ~6 lines (a researched answer can be a little longer). Never invent data that isn't on the desk. Talk like a warm, sharp teammate.`

const AMBIENT_NOTE = `

IMPORTANT — this message was NOT addressed to you; you are quietly listening in a group chat. Only jump in if you can genuinely help: a real question, someone stuck about a trip/client/payment, or a clear request you can act on. Be brief and human. Do NOT change anything in ambient mode unless explicitly asked. If the message is casual chat, off-topic, directed at a specific person, or you have nothing useful to add, reply with exactly the single token <silent> and nothing else.`

// ---- tool definitions ----
const TOOLS: Anthropic.Tool[] = [
  { name: 'move_card', description: 'Move an enquiry to a pipeline stage.', input_schema: { type: 'object', properties: { card_id: { type: 'string' }, stage: { type: 'string', enum: STAGE_IDS as unknown as string[] } }, required: ['card_id', 'stage'] } },
  { name: 'add_note', description: 'Append a note to an enquiry.', input_schema: { type: 'object', properties: { card_id: { type: 'string' }, text: { type: 'string' } }, required: ['card_id', 'text'] } },
  { name: 'set_owner', description: 'Assign an enquiry to a person, DMC, or guide.', input_schema: { type: 'object', properties: { card_id: { type: 'string' }, owner: { type: 'string' } }, required: ['card_id', 'owner'] } },
  { name: 'set_value', description: 'Set the value (USD) of an enquiry.', input_schema: { type: 'object', properties: { card_id: { type: 'string' }, value: { type: 'number' } }, required: ['card_id', 'value'] } },
  { name: 'create_enquiry', description: 'Create a new enquiry (and the client if new). Capture pax/destinations/budget when known.', input_schema: { type: 'object', properties: { client: { type: 'string' }, title: { type: 'string' }, value: { type: 'number' }, pax: { type: 'number' }, destinations: { type: 'array', items: { type: 'string' } }, kind: { type: 'string', enum: ['individual', 'corporate', 'embassy', 'government', 'partner'] }, vip: { type: 'boolean' } }, required: ['client'] } },
  { name: 'qualify_account', description: 'Update a client: status, kind, VIP flag, country, contact phone/email.', input_schema: { type: 'object', properties: { account_id: { type: 'string' }, status: { type: 'string', enum: ['lead', 'qualified', 'prospect', 'active', 'past', 'disqualified'] }, kind: { type: 'string', enum: ['individual', 'corporate', 'embassy', 'government', 'partner'] }, vip: { type: 'boolean' }, country: { type: 'string' }, contact_phone: { type: 'string' }, contact_email: { type: 'string' } }, required: ['account_id'] } },
  { name: 'create_trip', description: 'Create a trip (booking) for a client. Seeds the standard trip checklist.', input_schema: { type: 'object', properties: { account_id: { type: 'string' }, name: { type: 'string' }, destinations: { type: 'array', items: { type: 'string' } }, start_date: { type: 'string', description: 'ISO date' }, end_date: { type: 'string', description: 'ISO date' }, pax: { type: 'number' }, value: { type: 'number' } }, required: ['account_id', 'name'] } },
  { name: 'build_trip_from_package', description: `Create a trip for a client from a TourLink catalogue package — auto-fills itinerary segments, pricing (per-person × pax) and dates, and seeds the checklist. Available packages: ${packageOptions().map((p) => p.slug).join(', ')}.`, input_schema: { type: 'object', properties: { account_id: { type: 'string' }, package: { type: 'string', description: 'package slug or name' }, pax: { type: 'number' }, start_date: { type: 'string', description: 'ISO date' } }, required: ['account_id', 'package'] } },
  { name: 'add_segment', description: 'Add an itinerary segment (lodge/transfer/flight/activity/guide/permit) to a trip.', input_schema: { type: 'object', properties: { trip_id: { type: 'string' }, name: { type: 'string' }, kind: { type: 'string', enum: ['lodge', 'transfer', 'flight', 'activity', 'guide', 'permit', 'other'] }, value: { type: 'number' }, nights: { type: 'number' }, supplier: { type: 'string', description: 'DMC / lodge / partner' } }, required: ['trip_id', 'name'] } },
  { name: 'set_segment_status', description: 'Update a segment status.', input_schema: { type: 'object', properties: { segment_id: { type: 'string' }, status: { type: 'string', enum: ['proposed', 'held', 'confirmed', 'booked', 'cancelled'] } }, required: ['segment_id', 'status'] } },
  { name: 'add_payment', description: 'Add a payment milestone (e.g. Deposit 30%, Balance 70%) to a trip.', input_schema: { type: 'object', properties: { trip_id: { type: 'string' }, label: { type: 'string' }, amount: { type: 'number' }, trigger: { type: 'string' }, due_date: { type: 'string', description: 'ISO date' } }, required: ['trip_id', 'label', 'amount'] } },
  { name: 'add_payment_plan', description: 'Seed the standard 30% deposit + 70% balance plan for a trip from its current total value. Use when a trip has a value but no payments yet.', input_schema: { type: 'object', properties: { trip_id: { type: 'string' } }, required: ['trip_id'] } },
  { name: 'set_payment_status', description: 'Update a payment status (pending → invoiceable → invoiced → paid → overdue).', input_schema: { type: 'object', properties: { payment_id: { type: 'string' }, status: { type: 'string', enum: ['pending', 'invoiceable', 'invoiced', 'paid', 'overdue'] } }, required: ['payment_id', 'status'] } },
  { name: 'set_doc_status', description: 'Update a trip checklist item (visa, vouchers, insurance, flights, guide…).', input_schema: { type: 'object', properties: { doc_id: { type: 'string' }, status: { type: 'string', enum: ['todo', 'in_progress', 'ready', 'delivered', 'na'] } }, required: ['doc_id', 'status'] } },
  { name: 'mark_lost', description: 'Mark an enquiry lost with an optional reason.', input_schema: { type: 'object', properties: { card_id: { type: 'string' }, reason: { type: 'string' } }, required: ['card_id'] } },
  { name: 'attach_document', description: 'Save an attached document/image to a client or enquiry with a label + summary.', input_schema: { type: 'object', properties: { target_type: { type: 'string', enum: ['card', 'account'] }, target_id: { type: 'string' }, label: { type: 'string' }, summary: { type: 'string' } }, required: ['target_type', 'target_id', 'label', 'summary'] } },
  { name: 'prepare_quote', description: `Compose a client quote from a trip's segments + payments and send it to ${APPROVER} for approval. NEVER goes straight to the client.`, input_schema: { type: 'object', properties: { trip_id: { type: 'string' }, recipient: { type: 'string', description: "who it will go to once approved: a phone number or 'the client'" } }, required: ['trip_id'] } },
  { name: 'send_quote', description: `Send an already-prepared quote (as a PDF) to the client. Only ${APPROVER} may call this.`, input_schema: { type: 'object', properties: { trip_id: { type: 'string' }, recipient: { type: 'string', description: 'client phone number; defaults to the account contact phone' } }, required: ['trip_id'] } },
  { name: 'generate_itinerary', description: 'Generate a polished day-by-day itinerary PDF for a trip and send it to the client (or a given recipient).', input_schema: { type: 'object', properties: { trip_id: { type: 'string' }, recipient: { type: 'string', description: "phone number, or leave blank for the client's contact phone" } }, required: ['trip_id'] } },
  { name: 'generate_voucher', description: 'Generate a confirmation voucher PDF (booked services) for a trip and send it to the client (or a given recipient).', input_schema: { type: 'object', properties: { trip_id: { type: 'string' }, recipient: { type: 'string' } }, required: ['trip_id'] } },
  { name: 'email_document', description: `Email a trip document (PDF attached) to the client's email. Use for high-value clients who prefer email. A quote may only be emailed by ${APPROVER} (the approver).`, input_schema: { type: 'object', properties: { trip_id: { type: 'string' }, type: { type: 'string', enum: ['quote', 'itinerary', 'voucher'] }, to: { type: 'string', description: 'recipient email; defaults to the client contact email' } }, required: ['trip_id', 'type'] } },
  { name: 'send_trip_link', description: "Send the client their private 'track my trip' portal link (live itinerary, payments, documents) over WhatsApp.", input_schema: { type: 'object', properties: { trip_id: { type: 'string' }, recipient: { type: 'string', description: 'phone number; defaults to the client contact phone' } }, required: ['trip_id'] } },
  { name: 'web_research', description: 'Search the live web and read the top results — for current/external info NOT on the desk: lodge details & rates, park/visa fees, flight info, weather/seasons, competitor offers, news, facts. Returns sources you should cite briefly.', input_schema: { type: 'object', properties: { query: { type: 'string', description: 'a natural-language search query' }, max_results: { type: 'number', description: 'how many sources to read (default 3, max 5)' } }, required: ['query'] } },
]

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://tourlink.africa'

async function saveMedia(media: Media): Promise<string> {
  const dir = join(process.cwd(), 'public', 'uploads')
  await fs.mkdir(dir, { recursive: true })
  const safe = (media.filename || 'file').replace(/[^a-zA-Z0-9._-]/g, '_').slice(-60)
  const name = `${Date.now()}_${safe}`
  await fs.writeFile(join(dir, name), Buffer.from(media.data, 'base64'))
  return `/uploads/${name}`
}

function composeQuote(trip: Trip, state: ConciergeState): string {
  const segs = state.segments.filter((s) => s.trip_id === trip.id).sort((a, b) => a.sort - b.sort)
  const pays = state.payments.filter((p) => p.trip_id === trip.id).sort((a, b) => a.sort - b.sort)
  const lines = [
    `🦒 *TourLink — ${trip.name}*`,
    trip.destinations.length ? `📍 ${trip.destinations.join(' · ')}` : '',
    trip.pax ? `👥 ${trip.pax} traveller(s)` : '',
    trip.start_date ? `🗓️ ${trip.start_date}${trip.end_date ? ` → ${trip.end_date}` : ''}` : '',
    '',
    '*Itinerary*',
    ...segs.map((s) => `• ${s.name}${s.nights ? ` (${s.nights}n)` : ''} — ${formatMoney(s.value)}`),
    '',
    `*Total: ${formatMoney(trip.value || segs.reduce((t, s) => t + (s.value || 0), 0))}*`,
    pays.length ? '\n*Payment plan*' : '',
    ...pays.map((p) => `• ${p.label}: ${formatMoney(p.amount)}${p.due_date ? ` (by ${p.due_date})` : ''}`),
  ]
  return lines.filter((l) => l !== '').join('\n')
}

// ---- tool executor ----
async function runTool(ctx: Ctx, name: string, input: Record<string, unknown>, state: ConciergeState, media: Media | null): Promise<string> {
  const { accounts, cards, trips, segments, payments, docs } = state
  const findCard = (id: string) => cards.find((c) => c.id === id)
  const findTrip = (id: string) => trips.find((t) => t.id === id)
  switch (name) {
    case 'move_card': {
      const card = findCard(input.card_id as string); if (!card) return 'enquiry not found'
      const stage = input.stage as string
      const outcome = WON_STAGES.includes(stage as never) ? 'won' : 'open'
      const maxPos = Math.max(0, ...cards.filter((c) => c.stage === stage).map((c) => c.position))
      await ctx.admin.from('cards').update({ stage, position: maxPos + 1, outcome }).eq('id', card.id)
      await log(ctx, 'moved', card.title, `${STAGES.find((s) => s.id === card.stage)?.title} → ${STAGES.find((s) => s.id === stage)?.title}`, { card_id: card.id, account_id: card.account_id })
      if (outcome === 'won' && card.account_id) { const a = accounts.find((x) => x.id === card.account_id); if (a && a.status !== 'active' && a.status !== 'past') await ctx.admin.from('accounts').update({ status: 'active' }).eq('id', a.id) }
      return `moved "${card.title}" to ${stage}`
    }
    case 'add_note': {
      const card = findCard(input.card_id as string); if (!card) return 'enquiry not found'
      const stamped = `[${ctx.sender} via WhatsApp] ${input.text}`
      const { data } = await ctx.admin.from('cards').select('notes').eq('id', card.id).single()
      const notes = (data?.notes ?? card.notes) || ''
      await ctx.admin.from('cards').update({ notes: notes ? `${notes}\n${stamped}` : stamped }).eq('id', card.id)
      await log(ctx, 'note', card.title, String(input.text).slice(0, 80), { card_id: card.id, account_id: card.account_id })
      return `noted on "${card.title}"`
    }
    case 'set_owner': {
      const card = findCard(input.card_id as string); if (!card) return 'enquiry not found'
      await ctx.admin.from('cards').update({ owner_name: String(input.owner) }).eq('id', card.id)
      await log(ctx, 'updated', card.title, `assigned to ${input.owner}`, { card_id: card.id, account_id: card.account_id })
      return `assigned "${card.title}" to ${input.owner}`
    }
    case 'set_value': {
      const card = findCard(input.card_id as string); if (!card) return 'enquiry not found'
      await ctx.admin.from('cards').update({ value: Number(input.value) || 0 }).eq('id', card.id)
      await log(ctx, 'updated', card.title, `value ${input.value}`, { card_id: card.id, account_id: card.account_id })
      return `set value of "${card.title}"`
    }
    case 'create_enquiry': {
      const cName = String(input.client)
      let acc = accounts.find((a) => a.name.toLowerCase() === cName.toLowerCase())
      if (!acc) {
        const { data } = await ctx.admin.from('accounts').insert({
          team_id: ctx.teamId, name: cName, status: 'lead', source: 'whatsapp', owner_name: 'Business Dev',
          kind: String(input.kind || 'individual'), vip: !!input.vip,
        }).select('*').single()
        if (data) { acc = data as Account; accounts.push(acc) }
      }
      if (!acc) return 'could not create the client'
      const boardId = await getOrCreateAccountBoard(ctx.admin, ctx.teamId, acc.id, acc.name)
      const title = String(input.title || `New enquiry — ${cName}`)
      const { data: card } = await ctx.admin.from('cards').insert({
        board_id: boardId, account_id: acc.id, title, type: 'Enquiry', stage: 'enquiry',
        owner_name: 'Business Dev', priority: input.vip ? 'VIP' : 'Medium', source: 'whatsapp',
        value: Number(input.value) || 0, pax: input.pax ? Number(input.pax) : null,
        destinations: Array.isArray(input.destinations) ? (input.destinations as string[]) : [], position: 1000,
      }).select('*').single()
      if (card) { cards.push(card as Card); await log(ctx, 'created', title, 'Enquiry', { card_id: (card as Card).id, account_id: acc.id }) }
      return `created enquiry "${title}" for ${cName}`
    }
    case 'qualify_account': {
      const acc = accounts.find((a) => a.id === input.account_id); if (!acc) return 'client not found'
      const patch: Record<string, unknown> = {}
      for (const k of ['status', 'kind', 'country', 'contact_phone', 'contact_email'] as const) if (input[k] != null) patch[k] = String(input[k])
      if (input.vip != null) patch.vip = !!input.vip
      await ctx.admin.from('accounts').update(patch).eq('id', acc.id).eq('team_id', ctx.teamId)
      await log(ctx, 'updated', acc.name, Object.keys(patch).join(', '), { account_id: acc.id })
      return `updated client "${acc.name}"`
    }
    case 'create_trip': {
      const acc = accounts.find((a) => a.id === input.account_id); if (!acc) return 'client not found'
      const { data: trip } = await ctx.admin.from('trips').insert({
        team_id: ctx.teamId, account_id: acc.id, name: String(input.name), status: 'planning',
        destinations: Array.isArray(input.destinations) ? (input.destinations as string[]) : [],
        start_date: (input.start_date as string) || null, end_date: (input.end_date as string) || null,
        pax: input.pax ? Number(input.pax) : null, value: Number(input.value) || 0,
      }).select('*').single()
      if (!trip) return 'could not create the trip'
      trips.push(trip as Trip)
      // seed the standard checklist
      await ctx.admin.from('trip_docs').insert(DEFAULT_TRIP_DOCS.map((d, i) => ({
        team_id: ctx.teamId, trip_id: (trip as Trip).id, code: d.code, label: d.label, status: 'todo', sort: i,
      })))
      const tripValue = Number(input.value) || 0
      if (tripValue > 0) await seedPaymentPlan(ctx, (trip as Trip).id, tripValue, (input.start_date as string) || null)
      await log(ctx, 'created trip', (trip as Trip).name, acc.name, { trip_id: (trip as Trip).id, account_id: acc.id })
      return `created trip "${(trip as Trip).name}" for ${acc.name} (checklist${tripValue > 0 ? ' + 30/70 plan' : ''} seeded)`
    }
    case 'add_payment_plan': {
      const trip = findTrip(input.trip_id as string); if (!trip) return 'trip not found'
      const ok = await seedPaymentPlan(ctx, trip.id, trip.value, trip.start_date)
      return ok
        ? `💸 Added a 30% deposit (${formatMoney(Math.round(trip.value * 0.3))}) + 70% balance plan to "${trip.name}".`
        : `"${trip.name}" already has payments, or has no value set yet.`
    }
    case 'build_trip_from_package': {
      const acc = accounts.find((a) => a.id === input.account_id); if (!acc) return 'client not found'
      const pkg = findPackage(String(input.package)); if (!pkg) return `no package matches "${input.package}"`
      const spec = packageToTripSpec(pkg, Number(input.pax) || 0, (input.start_date as string) || undefined)
      const made = await createTripFromSpec(ctx, acc.id, spec)
      if (!made) return 'could not create the trip'
      trips.push({ id: made.tripId, account_id: acc.id, name: made.name, value: spec.value } as Trip)
      await log(ctx, 'created trip', made.name, `${acc.name} · from package ${pkg.slug}`, { trip_id: made.tripId, account_id: acc.id })
      return `🧳 Built "${made.name}" for ${acc.name} from ${pkg.name} — ${spec.segments.length} segments, ${formatMoney(spec.value)} total. Ask me to add a deposit/balance or prepare a quote.`
    }
    case 'add_segment': {
      const trip = findTrip(input.trip_id as string); if (!trip) return 'trip not found'
      const maxSort = Math.max(0, ...segments.filter((s) => s.trip_id === trip.id).map((s) => s.sort))
      const { data } = await ctx.admin.from('segments').insert({
        team_id: ctx.teamId, trip_id: trip.id, name: String(input.name), kind: String(input.kind || 'other'),
        value: Number(input.value) || 0, nights: input.nights ? Number(input.nights) : null,
        supplier: (input.supplier as string) || null, status: 'proposed', sort: maxSort + 1,
      }).select('*').single()
      if (data) segments.push(data as never)
      // roll the trip value up from its segments
      const total = segments.filter((s) => s.trip_id === trip.id).reduce((t, s) => t + (s.value || 0), 0)
      await ctx.admin.from('trips').update({ value: total }).eq('id', trip.id)
      await log(ctx, 'added segment', String(input.name), trip.name, { trip_id: trip.id, account_id: trip.account_id })
      return `added "${input.name}" to ${trip.name}`
    }
    case 'set_segment_status': {
      const seg = segments.find((s) => s.id === input.segment_id); if (!seg) return 'segment not found'
      await ctx.admin.from('segments').update({ status: String(input.status) }).eq('id', seg.id).eq('team_id', ctx.teamId)
      await log(ctx, 'updated', seg.name, String(input.status), { trip_id: seg.trip_id })
      return `set segment "${seg.name}" to ${input.status}`
    }
    case 'add_payment': {
      const trip = findTrip(input.trip_id as string); if (!trip) return 'trip not found'
      const maxSort = Math.max(0, ...payments.filter((p) => p.trip_id === trip.id).map((p) => p.sort))
      const { data } = await ctx.admin.from('payments').insert({
        team_id: ctx.teamId, trip_id: trip.id, label: String(input.label), amount: Number(input.amount) || 0,
        trigger: (input.trigger as string) || null, due_date: (input.due_date as string) || null,
        status: 'pending', sort: maxSort + 1,
      }).select('*').single()
      if (data) payments.push(data as never)
      await log(ctx, 'added payment', String(input.label), `${trip.name} · ${formatMoney(Number(input.amount) || 0)}`, { trip_id: trip.id, account_id: trip.account_id })
      return `added payment "${input.label}" (${formatMoney(Number(input.amount) || 0)}) to ${trip.name}`
    }
    case 'set_payment_status': {
      const pay = payments.find((p) => p.id === input.payment_id); if (!pay) return 'payment not found'
      const status = String(input.status)
      const patch: Record<string, unknown> = { status }
      if (status === 'invoiced') patch.invoiced_at = new Date().toISOString()
      if (status === 'paid') patch.paid_at = new Date().toISOString()
      await ctx.admin.from('payments').update(patch).eq('id', pay.id).eq('team_id', ctx.teamId)
      await log(ctx, 'payment', pay.label, status, { trip_id: pay.trip_id })
      return `set payment "${pay.label}" to ${status}`
    }
    case 'set_doc_status': {
      const d = docs.find((x) => x.id === input.doc_id); if (!d) return 'checklist item not found'
      await ctx.admin.from('trip_docs').update({ status: String(input.status) }).eq('id', d.id).eq('team_id', ctx.teamId)
      await log(ctx, 'checklist', [d.code, d.label].filter(Boolean).join(' '), String(input.status), { trip_id: d.trip_id })
      return `set "${d.label}" to ${input.status}`
    }
    case 'mark_lost': {
      const card = findCard(input.card_id as string); if (!card) return 'enquiry not found'
      await ctx.admin.from('cards').update({ outcome: 'lost', outcome_reason: String(input.reason || '') }).eq('id', card.id)
      await log(ctx, 'lost', card.title, String(input.reason || '').slice(0, 80), { card_id: card.id, account_id: card.account_id })
      return `marked "${card.title}" lost`
    }
    case 'attach_document': {
      if (!media) return 'no document was attached to this message'
      const url = await saveMedia(media)
      const label = String(input.label || media.filename)
      const summary = String(input.summary || '')
      if (input.target_type === 'account') {
        const acc = accounts.find((a) => a.id === input.target_id); if (!acc) return 'client not found'
        const notes = acc.notes ? `${acc.notes}\n[doc] ${label}: ${summary}` : `[doc] ${label}: ${summary}`
        await ctx.admin.from('accounts').update({ notes }).eq('id', acc.id)
        await log(ctx, 'note', acc.name, `📎 ${label}`, { account_id: acc.id })
        return `saved "${label}" to ${acc.name}`
      }
      const card = findCard(input.target_id as string); if (!card) return 'enquiry not found'
      const docList = [...(card.docs || []), { label, url }]
      const notes = card.notes ? `${card.notes}\n[doc] ${label}: ${summary}` : `[doc] ${label}: ${summary}`
      await ctx.admin.from('cards').update({ docs: docList, notes }).eq('id', card.id)
      await log(ctx, 'note', card.title, `📎 ${label}`, { card_id: card.id, account_id: card.account_id })
      return `saved "${label}" to "${card.title}"`
    }
    case 'prepare_quote': {
      const trip = findTrip(input.trip_id as string); if (!trip) return 'trip not found'
      const recipient = String(input.recipient || 'the client')
      // Build the real PDF and send it to the approver (with a text preview).
      const built = await buildAndStore(ctx.admin, ctx.teamId, 'quote', trip.id)
      if ('error' in built) return `couldn't build the quote: ${built.error}`
      const caption = `📝 *Quote ready for approval* (would go to ${recipient}).\nReply "send quote ${trip.name}" to release it.\n\n${composeQuote(trip, state)}`
      const enq = await enqueueDoc(ctx.admin, ctx.teamId, { target: APPROVER, caption, signedUrl: built.signedUrl, filename: built.filename, kind: 'quote_review' })
      if (enq.error) return `couldn't send for approval: ${enq.error}`
      await log(ctx, 'quote prepared', trip.name, `→ ${APPROVER} for approval`, { trip_id: trip.id, account_id: trip.account_id })
      return `📝 Quote PDF for "${trip.name}" sent to ${APPROVER} for approval — it goes to ${recipient} once approved.`
    }
    case 'send_quote': {
      if (ctx.sender.toLowerCase() !== APPROVER.toLowerCase()) return `Only ${APPROVER} can send a quote to a client.`
      const trip = findTrip(input.trip_id as string); if (!trip) return 'trip not found'
      const acc = accounts.find((a) => a.id === trip.account_id)
      const recipient = String(input.recipient || acc?.contact_phone || '')
      if (!recipient) return 'no client phone on file — add a contact phone first'
      const r = await generateAndDeliver(ctx.admin, ctx.teamId, { tripId: trip.id, type: 'quote', target: recipient, caption: `🦒 Your TourLink quote — ${trip.name}. We'd love to take you. ✨`, kind: 'quote' })
      if ('error' in r) return `couldn't send the quote: ${r.error}`
      await log(ctx, 'quote sent', trip.name, `→ ${recipient}`, { trip_id: trip.id, account_id: trip.account_id })
      return `✅ Sending the ${trip.name} quote PDF to ${recipient} now.`
    }
    case 'generate_itinerary': {
      const trip = findTrip(input.trip_id as string); if (!trip) return 'trip not found'
      const r = await generateAndDeliver(ctx.admin, ctx.teamId, { tripId: trip.id, type: 'itinerary', target: input.recipient as string | undefined, caption: `🦒 Your TourLink itinerary — ${trip.name}.`, kind: 'itinerary' })
      if ('error' in r) return `couldn't generate the itinerary: ${r.error}`
      await log(ctx, 'itinerary sent', trip.name, `→ ${r.target}`, { trip_id: trip.id, account_id: trip.account_id })
      return `🗺️ Itinerary for "${trip.name}" generating — sending to ${r.target} now.`
    }
    case 'generate_voucher': {
      const trip = findTrip(input.trip_id as string); if (!trip) return 'trip not found'
      const r = await generateAndDeliver(ctx.admin, ctx.teamId, { tripId: trip.id, type: 'voucher', target: input.recipient as string | undefined, caption: `🦒 Your TourLink voucher — ${trip.name}. Present on arrival.`, kind: 'voucher' })
      if ('error' in r) return `couldn't generate the voucher: ${r.error}`
      await log(ctx, 'voucher sent', trip.name, `→ ${r.target}`, { trip_id: trip.id, account_id: trip.account_id })
      return `🎫 Voucher for "${trip.name}" generating — sending to ${r.target} now.`
    }
    case 'send_trip_link': {
      const trip = findTrip(input.trip_id as string); if (!trip) return 'trip not found'
      const { data: row } = await ctx.admin.from('trips').select('share_token').eq('id', trip.id).single()
      const token = row?.share_token as string | undefined
      if (!token) return 'this trip has no share link yet'
      const acc = accounts.find((a) => a.id === trip.account_id)
      const recipient = String(input.recipient || acc?.contact_phone || '')
      if (!recipient) return 'no client phone on file — add a contact phone first'
      const url = `${SITE_URL}/trip/${token}`
      await ctx.admin.from('outbox').insert({ team_id: ctx.teamId, target: recipient, kind: 'trip_link', text: `🦒 Track your TourLink trip "${trip.name}" any time here:\n${url}` })
      await log(ctx, 'trip link sent', trip.name, `→ ${recipient}`, { trip_id: trip.id, account_id: trip.account_id })
      return `🔗 Sending ${acc?.name || 'the client'} their trip portal link now.`
    }
    case 'email_document': {
      const trip = findTrip(input.trip_id as string); if (!trip) return 'trip not found'
      const type = String(input.type) as 'quote' | 'itinerary' | 'voucher'
      if (type === 'quote' && ctx.sender.toLowerCase() !== APPROVER.toLowerCase()) return `Only ${APPROVER} can email a quote to a client.`
      const r = await emailDoc(ctx.admin, ctx.teamId, { tripId: trip.id, type, to: (input.to as string) || undefined })
      if ('error' in r) return `couldn't email the ${type}: ${r.error}`
      await log(ctx, `${type} emailed`, trip.name, `→ ${r.to}`, { trip_id: trip.id, account_id: trip.account_id })
      return `📧 Emailed the ${type} for "${trip.name}" to ${r.to}.`
    }
    case 'web_research': {
      const token = process.env.APIFY_TOKEN
      if (!token) return 'Web research is not configured (no APIFY_TOKEN).'
      const max = Math.min(Math.max(1, Number(input.max_results) || 3), 5)
      try {
        const res = await fetch(`https://api.apify.com/v2/acts/apify~rag-web-browser/run-sync-get-dataset-items?token=${token}`, {
          method: 'POST', headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ query: String(input.query), maxResults: max, outputFormats: ['markdown'], scrapingTool: 'raw-http' }),
        })
        if (!res.ok) return `web research failed (${res.status})`
        const items = (await res.json()) as Array<Record<string, unknown>>
        if (!Array.isArray(items) || items.length === 0) return 'No web results found.'
        const blocks = items.slice(0, max).map((it, i) => {
          const meta = (it.metadata || {}) as Record<string, string>
          const sr = (it.searchResult || {}) as Record<string, string>
          const title = meta.title || sr.title || 'Result'
          const url = meta.url || sr.url || ''
          const content = String((it.markdown as string) || (it.text as string) || sr.description || '')
            .replace(/\n{3,}/g, '\n\n').trim().slice(0, 1800)
          return `[${i + 1}] ${title}\n${url}\n${content}`
        }).join('\n\n---\n\n')
        return `Live web results for "${input.query}" (cite the source URLs in your answer):\n\n${blocks}`
      } catch (e) { return `web research error: ${(e as Error).message}` }
    }
    default:
      return 'unknown tool'
  }
}

// ---------------------------------------------------------------------------
// Client-facing brain — when a *traveller's* number DMs Relay. Read-only, hard
// scoped to that ONE account's trips. No tools, no other clients' data.
// ---------------------------------------------------------------------------
export async function runClientAI(account: Account, state: ConciergeState, message: string): Promise<string> {
  if (!aiEnabled()) return `Thanks! 🦒 A TourLink consultant will get back to you shortly. 🙏`
  const trips = state.trips.filter((t) => t.account_id === account.id)
  const lines = trips.map((t) => {
    const pays = state.payments.filter((p) => p.trip_id === t.id)
    const outstanding = pays.filter((p) => p.status !== 'paid').reduce((s, p) => s + (p.amount || 0), 0)
    return `- "${t.name}" — ${t.status}${t.start_date ? ` (departs ${t.start_date})` : ''}${outstanding ? ` · ${formatMoney(outstanding)} outstanding` : ' · fully paid'}`
  }).join('\n')
  const system = `You are Relay, the assistant for TourLink, speaking with ${account.name}.
You may ONLY discuss ${account.name}'s own trips with TourLink. NEVER mention other clients, internal owners, the pipeline, supplier costs, or anything not about ${account.name}.
You cannot change anything — you are read-only. If they ask for a change or something you don't know, warmly say a TourLink consultant will follow up.
Keep replies short, friendly, WhatsApp-style with light emoji.

${account.name}'s trips with TourLink:
${lines || '(no trips on record yet)'}`
  try {
    const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })
    const resp = await client.messages.create({
      model: MODEL, max_tokens: 600,
      system, messages: [{ role: 'user', content: message || 'Hi, any update on my trip?' }],
    })
    const text = resp.content.filter((b): b is Anthropic.TextBlock => b.type === 'text').map((b) => b.text).join('\n').trim()
    return text || `Thanks for reaching out — a TourLink consultant will follow up shortly. 🙏`
  } catch {
    return `Thanks for reaching out — a TourLink consultant will follow up shortly. 🙏`
  }
}

function mediaBlock(media: Media): Anthropic.ContentBlockParam {
  if (media.mimetype === 'application/pdf') {
    return { type: 'document', source: { type: 'base64', media_type: 'application/pdf', data: media.data } }
  }
  const mt = (['image/jpeg', 'image/png', 'image/gif', 'image/webp'].includes(media.mimetype) ? media.mimetype : 'image/jpeg') as 'image/jpeg' | 'image/png' | 'image/gif' | 'image/webp'
  return { type: 'image', source: { type: 'base64', media_type: mt, data: media.data } }
}

export async function runConciergeAI(ctx: Ctx, message: string, media: Media | null, opts: { ambient?: boolean; history?: string } = {}): Promise<string> {
  let text = message
  let doc: Media | null = media

  if (doc && doc.mimetype.startsWith('audio')) {
    const t = await transcribeAudio(doc.data, doc.mimetype)
    doc = null
    if (!t) return transcribeEnabled()
      ? "🎤 I couldn't make out that voice note — try again or type it?"
      : '🎤 Voice notes need a transcription key. Set TRANSCRIBE_API_KEY in .env.local.'
    text = (message ? `${message}\n` : '') + `(voice note) ${t}`
  }

  const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })
  const state = await loadState(ctx)

  const userBlocks: Anthropic.ContentBlockParam[] = []
  if (doc) userBlocks.push(mediaBlock(doc))
  userBlocks.push({ type: 'text', text: text || (doc ? 'Here is a document — please file it appropriately.' : 'help') })

  const messages: Anthropic.MessageParam[] = [{ role: 'user', content: userBlocks }]
  const now = new Date()
  const tz = process.env.CONCIERGE_TZ || 'Africa/Dar_es_Salaam'
  const nowNote = `\n\nRight now it is ${now.toLocaleString('en-GB', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit', timeZone: tz })} (${tz}). Use this for any date reasoning — "departs soon", "overdue", "today".`
  const historyNote = opts.history?.trim() ? `\n\nRecent chat (most recent last), for context only:\n${opts.history.trim()}` : ''
  const system = SYSTEM(ctx.sender, boardContext(state)) + nowNote + historyNote + (opts.ambient ? AMBIENT_NOTE : '')

  for (let i = 0; i < 6; i++) {
    const resp = await client.messages.create({ model: MODEL, max_tokens: 2048, system, tools: TOOLS, messages })
    const toolUses = resp.content.filter((b): b is Anthropic.ToolUseBlock => b.type === 'tool_use')
    messages.push({ role: 'assistant', content: resp.content })

    if (resp.stop_reason !== 'tool_use' || toolUses.length === 0) {
      const out = resp.content.filter((b): b is Anthropic.TextBlock => b.type === 'text').map((b) => b.text).join('\n').trim()
      if (opts.ambient && (!out || /<silent>/i.test(out))) return ''
      return out || '✅ Done.'
    }

    const results: Anthropic.ToolResultBlockParam[] = []
    for (const tu of toolUses) {
      let outp = 'error'
      try { outp = await runTool(ctx, tu.name, tu.input as Record<string, unknown>, state, doc) } catch (e) { outp = `error: ${(e as Error).message}` }
      results.push({ type: 'tool_result', tool_use_id: tu.id, content: outp })
    }
    messages.push({ role: 'user', content: results })
  }
  return '🤔 That needed too many steps — try breaking it into smaller asks.'
}
