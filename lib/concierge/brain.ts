import 'server-only'
import {
  STAGES, STAGE_IDS, WON_STAGES, formatMoney, accountStatus,
  paymentStatus, tripStatus, type StageId,
} from '@/lib/crm/constants'
import {
  type Ctx, type ConciergeState, loadState, log, getOrCreateAccountBoard,
  accountName, daysLate, matchCards, resolveCard,
} from '@/lib/concierge/state'
import type { Account, Card, Trip, Segment, Payment, TripDoc } from '@/lib/crm/types'

// ===========================================================================
// Relay — the deterministic WhatsApp command brain for TourRelay.
// Parses a free-text message into a board query or mutation, runs it against
// the team's per-account boards (service-role), logs to the activity feed, and
// returns a short WhatsApp-friendly reply. Deterministic + forgiving. Anything
// conversational falls through to the Claude brain (ai.ts).
// ===========================================================================

const HELP = [
  '🔗 *TourRelay* — text me to run the desk:',
  '',
  '📊 *status* — pipeline summary',
  '🗓️ *standup* — full team digest',
  '🛫 *departures* — trips travelling / leaving soon',
  '💸 *payments* — deposits & balances due',
  '⏰ *overdue* — what is late',
  '🏷️ *accounts* — clients + status',
  '👥 *team* — load per person',
  '🔎 *<account>* — status of one client + their trips',
  '',
  '✍️ *move <enquiry> to <stage>*',
  '✅ *booked <enquiry>* — deposit in, mark won',
  '✕ *lost <enquiry>* [: reason]',
  '➕ *enquiry <client>* [: what they want]',
  '📝 *note <enquiry>: <text>*',
  '🙋 *assign <enquiry> to <person>*',
  '',
  '🧩 Ask about a client to see their *trips, segments & payments*.',
  '💸 e.g. "mark Ambassador deposit paid" or "set guide assigned ready".',
].join('\n')

function norm(s: string) { return s.toLowerCase().trim() }

const QUERY_RE = /^(hi|hello|hey|help|menu|start|relay|🦒|standup|digest|brief|daily|update|status|summary|pipeline|overview|overdue|late|behind|departures|departure|arrivals|travelling|payments|payment|deposits|balance|due|today|week|soon|accounts|account|clients|client|team|who|load|people|board|stages)\b/i
const MUTATION_RE = [
  /^move\s+.+\s+to\s+.+$/i,
  /^(?:booked|book|won|deposit|confirm(?:ed)?|complete(?:d)?)\s+.+$/i,
  /^(?:lost|lose|cancel(?:led)?)\s+.+$/i,
  /^note\s+.+?\s*:\s*.+$/i,
  /^(?:enquiry|enquire|lead|new lead|prospect)\s+.+$/i,
  /^assign\s+.+?\s+to\s+.+$/i,
]
export function isCommand(text: string): boolean {
  const t = text.trim()
  if (t === '?') return true
  if (MUTATION_RE.some((re) => re.test(t))) return true
  if (QUERY_RE.test(t) && t.split(/\s+/).length <= 3) return true
  return false
}

function stageFromText(q: string): StageId | null {
  const n = norm(q)
  const exact = STAGES.find((s) => norm(s.title) === n || s.id === n)
  if (exact) return exact.id
  const partial = STAGES.find((s) => norm(s.title).includes(n) || n.includes(s.id))
  return partial ? partial.id : null
}

// ---- query handlers ----
function replyStatus(cards: Card[], accounts: Account[]): string {
  const open = cards.filter((c) => c.outcome === 'open')
  const won = cards.filter((c) => c.outcome === 'won')
  const lost = cards.filter((c) => c.outcome === 'lost')
  const decided = won.length + lost.length
  const openVal = open.reduce((s, c) => s + (c.value || 0), 0)
  const wonVal = won.reduce((s, c) => s + (c.value || 0), 0)
  const overdue = open.filter((c) => (daysLate(c.due) ?? -1) > 0).length
  const active = accounts.filter((a) => a.status === 'active').length
  return [
    '📊 *TourLink pipeline*',
    `Open enquiries: ${open.length} · ${formatMoney(openVal)}`,
    `Booked: ${won.length} · ${formatMoney(wonVal)}`,
    decided ? `Conversion: ${Math.round((won.length / decided) * 100)}% (${won.length}✓·${lost.length}✕)` : '',
    `Active clients: ${active}`,
    overdue ? `⏰ Overdue: ${overdue}` : '✅ Nothing overdue',
  ].filter(Boolean).join('\n')
}

export function replyStandup(cards: Card[], accounts: Account[], trips: Trip[], payments: Payment[]): string {
  return [
    '🗓️ *TourLink standup*', '',
    replyStatus(cards, accounts), '',
    replyDepartures(trips), '',
    replyPayments(trips, payments), '',
    replyOverdue(cards, accounts),
  ].join('\n')
}

export function replyDepartures(trips: Trip[]): string {
  const today = new Date(new Date().toDateString()).getTime()
  const soon = trips
    .filter((t) => t.status !== 'completed' && t.status !== 'cancelled' && t.start_date)
    .map((t) => ({ t, d: Math.round((new Date(t.start_date + 'T00:00').getTime() - today) / 86400000) }))
    .filter((x) => x.d >= -30 && x.d <= 30)
    .sort((a, b) => a.d - b.d)
  if (soon.length === 0) return '🛫 No departures in the next 30 days.'
  const lines = soon.slice(0, 12).map(({ t, d }) => {
    const when = d < 0 ? `travelling (day ${Math.abs(d)})` : d === 0 ? 'departs today ✈️' : `in ${d}d`
    return `• *${t.name}* — ${when} · ${tripStatus(t.status).label}`
  })
  return `🛫 *Departures (${soon.length})*\n${lines.join('\n')}`
}

export function replyPayments(trips: Trip[], payments: Payment[]): string {
  const tripName = (id: string) => trips.find((t) => t.id === id)?.name || 'trip'
  const due = payments
    .filter((p) => p.status !== 'paid')
    .map((p) => ({ p, d: daysLate(p.due_date) }))
    .sort((a, b) => (b.d ?? -999) - (a.d ?? -999))
  if (due.length === 0) return '💸 No outstanding payments. All settled.'
  const lines = due.slice(0, 12).map(({ p, d }) => {
    const late = (d ?? -1) > 0 ? ` · ⏰ ${d}d late` : d === 0 ? ' · due today' : ''
    return `• ${tripName(p.trip_id)} — ${p.label}: ${formatMoney(p.amount)} · ${paymentStatus(p.status).label}${late}`
  })
  const outstanding = due.reduce((s, x) => s + (x.p.amount || 0), 0)
  return `💸 *Payments due (${due.length}) · ${formatMoney(outstanding)}*\n${lines.join('\n')}`
}

export function replyOverdue(cards: Card[], accounts: Account[]): string {
  const late = cards
    .filter((c) => c.outcome === 'open')
    .map((c) => ({ c, d: daysLate(c.due) }))
    .filter((x) => (x.d ?? -1) > 0)
    .sort((a, b) => (b.d ?? 0) - (a.d ?? 0))
  if (late.length === 0) return '✅ Nothing overdue. Everyone is on track.'
  const lines = late.slice(0, 12).map(({ c, d }) =>
    `• *${c.title}* — ${accountName(c, accounts)} · ${c.owner_name} · ${d}d late`)
  return `⏰ *Overdue (${late.length})*\n${lines.join('\n')}`
}

function replyDue(cards: Card[]): string {
  const soon = cards
    .filter((c) => c.outcome === 'open' && c.due)
    .map((c) => ({ c, d: daysLate(c.due) }))
    .filter((x) => x.d !== null && x.d >= -7 && x.d <= 0)
    .sort((a, b) => (b.d ?? 0) - (a.d ?? 0))
  if (soon.length === 0) return '📅 Nothing due in the next 7 days.'
  const lines = soon.slice(0, 12).map(({ c, d }) =>
    `• *${c.title}* — ${c.owner_name} · ${d === 0 ? 'today' : `in ${Math.abs(d as number)}d`}`)
  return `📅 *Due soon (${soon.length})*\n${lines.join('\n')}`
}

function replyAccounts(accounts: Account[], cards: Card[]): string {
  if (accounts.length === 0) return 'No clients yet. Add one with: *enquiry <name>*'
  const order: Record<string, number> = { active: 0, prospect: 1, qualified: 2, lead: 3, past: 4, disqualified: 5 }
  const lines = [...accounts]
    .sort((a, b) => (order[a.status] ?? 9) - (order[b.status] ?? 9))
    .slice(0, 20)
    .map((a) => {
      const n = cards.filter((c) => c.account_id === a.id).length
      return `• ${a.vip ? '⭐ ' : ''}*${a.name}* — ${accountStatus(a.status).label} · ${n} enq`
    })
  return `🏷️ *Clients (${accounts.length})*\n${lines.join('\n')}`
}

function replyTeam(cards: Card[]): string {
  const open = cards.filter((c) => c.outcome === 'open')
  const byOwner = new Map<string, { n: number; v: number }>()
  open.forEach((c) => {
    const e = byOwner.get(c.owner_name) || { n: 0, v: 0 }
    e.n += 1; e.v += c.value || 0; byOwner.set(c.owner_name, e)
  })
  const lines = [...byOwner.entries()].sort((a, b) => b[1].n - a[1].n)
    .map(([name, e]) => `• *${name}* — ${e.n} open · ${formatMoney(e.v)}`)
  return `👥 *Load by person*\n${lines.join('\n') || 'No open enquiries.'}`
}

function replyAccountDetail(
  acc: Account, cards: Card[], trips: Trip[], segments: Segment[], payments: Payment[], docs: TripDoc[],
): string {
  const enq = cards.filter((c) => c.account_id === acc.id)
  const open = enq.filter((c) => c.outcome === 'open')
  const val = enq.reduce((s, c) => s + (c.value || 0), 0)
  const enqLines = enq.slice(0, 8).map((c) => {
    const st = STAGES.find((s) => s.id === c.stage)
    const late = daysLate(c.due)
    return `• ${c.title} — _${st?.title}_${(late ?? -1) > 0 ? ` ⏰${late}d` : ''}`
  })

  const accTrips = trips.filter((t) => t.account_id === acc.id)
  const tripBlock: string[] = []
  for (const t of accTrips) {
    tripBlock.push('', `🧳 *${t.name}* — ${tripStatus(t.status).label} · ${formatMoney(t.value)}`)
    const segs = [...segments.filter((s) => s.trip_id === t.id)].sort((a, b) => a.sort - b.sort)
    for (const s of segs) tripBlock.push(`   ◦ ${s.name} · ${formatMoney(s.value)}`)
    const pays = [...payments.filter((p) => p.trip_id === t.id)].sort((a, b) => a.sort - b.sort)
    for (const p of pays) tripBlock.push(`   💸 ${p.label}: ${formatMoney(p.amount)} · ${paymentStatus(p.status).label}`)
    const ds = docs.filter((d) => d.trip_id === t.id)
    if (ds.length) {
      const done = ds.filter((d) => d.status === 'delivered' || d.status === 'ready').length
      tripBlock.push(`   📋 Checklist ${done}/${ds.length} done`)
    }
  }

  return [
    `🔎 ${acc.vip ? '⭐ ' : ''}*${acc.name}* — ${accountStatus(acc.status).label}`,
    acc.country ? acc.country : '',
    `${enq.length} enquiries · ${open.length} open · ${formatMoney(val)}`,
    '',
    ...enqLines,
    ...tripBlock,
  ].filter(Boolean).join('\n')
}

// ---- mutation handlers ----
async function doMove(ctx: Ctx, cards: Card[], accounts: Account[], q: string, stageText: string): Promise<string> {
  const stage = stageFromText(stageText)
  if (!stage) return `🤔 I don't know the stage "${stageText}". Stages: ${STAGE_IDS.join(', ')}`
  const r = resolveCard(matchCards(cards, accounts, q))
  if (r.ambiguous) return `Which one?\n${r.ambiguous.map((m) => `• ${m.card.title}`).join('\n')}`
  if (!r.card) return `🤔 No enquiry matches "${q}".`
  const card = r.card
  const maxPos = Math.max(0, ...cards.filter((c) => c.stage === stage).map((c) => c.position))
  const outcome = WON_STAGES.includes(stage) ? 'won' : 'open'
  await ctx.admin.from('cards').update({ stage, position: maxPos + 1, outcome }).eq('id', card.id)
  const fromT = STAGES.find((s) => s.id === card.stage)?.title
  const toT = STAGES.find((s) => s.id === stage)?.title
  await log(ctx, 'moved', card.title, `${fromT} → ${toT}`, { card_id: card.id, account_id: card.account_id })
  if (WON_STAGES.includes(stage) && card.account_id) {
    const acc = accounts.find((a) => a.id === card.account_id)
    if (acc && acc.status !== 'active' && acc.status !== 'past') {
      await ctx.admin.from('accounts').update({ status: 'active' }).eq('id', acc.id)
    }
  }
  return `✅ Moved *${card.title}* → _${toT}_`
}

async function doLost(ctx: Ctx, cards: Card[], accounts: Account[], q: string, reason: string): Promise<string> {
  const r = resolveCard(matchCards(cards, accounts, q))
  if (r.ambiguous) return `Which enquiry?\n${r.ambiguous.map((m) => `• ${m.card.title}`).join('\n')}`
  if (!r.card) return `🤔 No enquiry matches "${q}".`
  const card = r.card
  await ctx.admin.from('cards').update({ outcome: 'lost', outcome_reason: reason }).eq('id', card.id)
  await log(ctx, 'lost', card.title, reason.slice(0, 80), { card_id: card.id, account_id: card.account_id })
  return `✕ Marked *${card.title}* as lost${reason ? ` — ${reason}` : ''}.`
}

async function doNote(ctx: Ctx, cards: Card[], accounts: Account[], q: string, text: string): Promise<string> {
  const r = resolveCard(matchCards(cards, accounts, q))
  if (r.ambiguous) return `Which enquiry?\n${r.ambiguous.map((m) => `• ${m.card.title}`).join('\n')}`
  if (!r.card) return `🤔 No enquiry matches "${q}".`
  const card = r.card
  const stamped = `[${ctx.sender} via WhatsApp] ${text}`
  const { data: fresh } = await ctx.admin.from('cards').select('notes').eq('id', card.id).single()
  const current = (fresh?.notes ?? card.notes) || ''
  await ctx.admin.from('cards').update({ notes: current ? `${current}\n${stamped}` : stamped }).eq('id', card.id)
  await log(ctx, 'note', card.title, text.slice(0, 80), { card_id: card.id, account_id: card.account_id })
  return `📝 Noted on *${card.title}*.`
}

async function doEnquiry(ctx: Ctx, accounts: Account[], rest: string): Promise<string> {
  const [namePart, ...titleParts] = rest.split(':')
  const name = namePart.trim()
  if (!name) return 'Usage: *enquiry <client>* : what they want'
  const title = titleParts.join(':').trim() || `New enquiry — ${name}`
  let acc = accounts.find((a) => norm(a.name) === norm(name))
  let created = false
  if (!acc) {
    const { data, error } = await ctx.admin.from('accounts')
      .insert({ team_id: ctx.teamId, name, status: 'lead', source: 'whatsapp', owner_name: 'Business Dev' })
      .select('*').single()
    if (error || !data) return '⚠️ Could not create that client — try again.'
    acc = data as Account
    created = true
    await log(ctx, 'added client', acc.name, 'Lead', { account_id: acc.id })
  }
  const boardId = await getOrCreateAccountBoard(ctx.admin, ctx.teamId, acc.id, acc.name)
  const { data: card } = await ctx.admin.from('cards').insert({
    board_id: boardId, account_id: acc.id, title, type: 'Enquiry', stage: 'enquiry',
    owner_name: 'Business Dev', priority: 'Medium', source: 'whatsapp', value: 0, position: 1000,
  }).select('*').single()
  if (card) await log(ctx, 'created', title, 'Enquiry', { card_id: (card as Card).id, account_id: acc.id })
  return `➕ Enquiry added: *${title}*${created ? `\n🏷️ New client *${name}* created.` : ` for *${name}*`}`
}

async function doAssign(ctx: Ctx, cards: Card[], accounts: Account[], q: string, person: string): Promise<string> {
  const r = resolveCard(matchCards(cards, accounts, q))
  if (r.ambiguous) return `Which enquiry?\n${r.ambiguous.map((m) => `• ${m.card.title}`).join('\n')}`
  if (!r.card) return `🤔 No enquiry matches "${q}".`
  const card = r.card
  const owner = person.trim()
  await ctx.admin.from('cards').update({ owner_name: owner }).eq('id', card.id)
  await log(ctx, 'updated', card.title, `assigned to ${owner}`, { card_id: card.id, account_id: card.account_id })
  return `🙋 *${card.title}* assigned to *${owner}*.`
}

// ===========================================================================
export async function runConcierge(ctx: Ctx, message: string): Promise<string> {
  const text = message.trim()
  if (!text) return HELP
  const low = norm(text)
  const st: ConciergeState = await loadState(ctx)
  const { accounts, cards, trips, segments, payments, docs } = st

  if (/^(hi|hello|hey|help|menu|start|relay|\?|🦒)\b/.test(low)) return HELP

  // queries
  if (/^(standup|digest|brief|daily|update)\b/.test(low)) return replyStandup(cards, accounts, trips, payments)
  if (/^(status|summary|pipeline|overview)\b/.test(low)) return replyStatus(cards, accounts)
  if (/^(departures|departure|arrivals|travelling)\b/.test(low)) return replyDepartures(trips)
  if (/^(payments|payment|deposits|balance)\b/.test(low)) return replyPayments(trips, payments)
  if (/^(overdue|late|behind)\b/.test(low)) return replyOverdue(cards, accounts)
  if (/^(due|today|this week|week|soon)\b/.test(low)) return replyDue(cards)
  if (/^(accounts|account|clients|client)\b/.test(low)) return replyAccounts(accounts, cards)
  if (/^(team|who|load|people)\b/.test(low)) return replyTeam(cards)

  // mutations
  let m
  if ((m = text.match(/^move\s+(.+?)\s+to\s+(.+)$/i))) return doMove(ctx, cards, accounts, m[1], m[2])
  if ((m = text.match(/^(?:booked|book|won|deposit)\s+(.+)$/i))) return doMove(ctx, cards, accounts, m[1], 'booked')
  if ((m = text.match(/^(?:confirm(?:ed)?)\s+(.+)$/i))) return doMove(ctx, cards, accounts, m[1], 'confirmed')
  if ((m = text.match(/^(?:complete(?:d)?)\s+(.+)$/i))) return doMove(ctx, cards, accounts, m[1], 'completed')
  if ((m = text.match(/^(?:lost|lose|cancel(?:led)?)\s+(.+?)(?:\s*:\s*(.+))?$/i))) return doLost(ctx, cards, accounts, m[1], (m[2] || '').trim())
  if ((m = text.match(/^note\s+(.+?)\s*:\s*(.+)$/i))) return doNote(ctx, cards, accounts, m[1], m[2])
  if ((m = text.match(/^(?:enquiry|enquire|lead|new lead|prospect)\s+(.+)$/i))) return doEnquiry(ctx, accounts, m[1])
  if ((m = text.match(/^assign\s+(.+?)\s+to\s+(.+)$/i))) return doAssign(ctx, cards, accounts, m[1], m[2])

  // bare account name → detail
  const acc = accounts.find((a) => norm(a.name) === low) ||
    accounts.find((a) => norm(a.name).includes(low) && low.length > 3)
  if (acc) return replyAccountDetail(acc, cards, trips, segments, payments, docs)

  // fallback: try to match a card
  const cardMatch = matchCards(cards, accounts, text)
  if (cardMatch.length > 0) {
    const c = cardMatch[0].card
    const sg = STAGES.find((s) => s.id === c.stage)
    const late = daysLate(c.due)
    return `🔎 *${c.title}*\n${accountName(c, accounts)} · _${sg?.title}_ · ${c.owner_name}${(late ?? -1) > 0 ? ` · ⏰ ${late}d late` : ''}\n${c.value ? formatMoney(c.value) : ''}`
  }

  return `🤔 Didn't catch that. Send *help* for commands.`
}
