'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { getSupabaseAdmin } from '@/lib/supabase/server'
import { isOpsAuthed, opsActor, signIn, signOut, setActor } from '@/lib/ops/auth'
import { getSelectedTeamId, setSelectedTeam } from '@/lib/ops/team'
import { getOrCreateAccountBoard, log, createTripFromSpec, seedPaymentPlan, type Ctx } from '@/lib/concierge/state'
import { findPackage, packageToTripSpec } from '@/lib/crm/packages'
import { buildAndStore, enqueueDoc, emailDoc } from '@/lib/documents/deliver'
import { STAGES, WON_STAGES, DEFAULT_TRIP_DOCS, OPS_OWNER, type StageId } from '@/lib/crm/constants'

const APPROVER = process.env.CONCIERGE_APPROVER || OPS_OWNER

async function ctx(): Promise<Ctx | null> {
  if (!(await isOpsAuthed())) return null
  const admin = getSupabaseAdmin()
  if (!admin) return null
  const teamId = await getSelectedTeamId(admin)
  return { admin, teamId, sender: await opsActor() }
}

// Switch the active workspace (TourLink ↔ VisaPermitLink).
export async function setActiveTeam(formData: FormData): Promise<void> {
  if (!(await isOpsAuthed())) return
  const teamId = String(formData.get('team') || '')
  if (teamId) await setSelectedTeam(teamId)
  revalidatePath('/ops')
}

// ---- auth ----
export async function signInAction(formData: FormData): Promise<void> {
  const ok = await signIn(String(formData.get('password') || ''), String(formData.get('who') || 'Operations'))
  if (ok) redirect('/ops')
  redirect('/ops/login?error=1')
}

export async function signOutAction(): Promise<void> {
  await signOut()
  redirect('/ops/login')
}

// Set who the current operator is (header switcher; no password needed).
export async function switchActor(formData: FormData): Promise<void> {
  const who = String(formData.get('who') || '')
  if (who) await setActor(who)
  revalidatePath('/ops')
}

// ---- pipeline ----
export async function moveCardStage(cardId: string, stage: StageId): Promise<void> {
  const c = await ctx(); if (!c) return
  const { data: card } = await c.admin.from('cards').select('*').eq('id', cardId).single()
  if (!card) return
  const outcome = WON_STAGES.includes(stage) ? 'won' : 'open'
  await c.admin.from('cards').update({ stage, outcome }).eq('id', cardId)
  await log(c, 'moved', card.title, `${STAGES.find((s) => s.id === card.stage)?.title} → ${STAGES.find((s) => s.id === stage)?.title}`, { card_id: cardId, account_id: card.account_id })
  if (outcome === 'won' && card.account_id) {
    await c.admin.from('accounts').update({ status: 'active' }).eq('id', card.account_id).neq('status', 'past')
  }
  revalidatePath('/ops'); revalidatePath(`/ops/accounts/${card.account_id}`)
}

export async function updateAccount(formData: FormData): Promise<void> {
  const c = await ctx(); if (!c) return
  const accountId = String(formData.get('account_id') || '')
  if (!accountId) return
  const str = (k: string) => { const v = formData.get(k); return v == null ? undefined : String(v) }
  const patch: Record<string, unknown> = {}
  for (const k of ['name', 'kind', 'status', 'country', 'contact_phone', 'contact_email', 'owner_name', 'notes'] as const) {
    const v = str(k); if (v !== undefined) patch[k] = v
  }
  patch.vip = formData.get('vip') === 'on'
  if (!patch.name) return
  await c.admin.from('accounts').update(patch).eq('id', accountId).eq('team_id', c.teamId)
  await log(c, 'updated', String(patch.name), 'details edited', { account_id: accountId })
  revalidatePath('/ops'); revalidatePath(`/ops/accounts/${accountId}`)
}

export async function updateTrip(formData: FormData): Promise<void> {
  const c = await ctx(); if (!c) return
  const tripId = String(formData.get('trip_id') || '')
  const accountId = String(formData.get('account_id') || '')
  if (!tripId) return
  const name = String(formData.get('name') || '').trim()
  const destinations = String(formData.get('destinations') || '').split(',').map((s) => s.trim()).filter(Boolean)
  const patch: Record<string, unknown> = {
    name: name || undefined,
    status: String(formData.get('status') || 'planning'),
    start_date: String(formData.get('start_date') || '') || null,
    end_date: String(formData.get('end_date') || '') || null,
    pax: formData.get('pax') ? Number(formData.get('pax')) : null,
    value: Number(formData.get('value') || 0),
    destinations,
  }
  if (!patch.name) delete patch.name
  await c.admin.from('trips').update(patch).eq('id', tripId).eq('team_id', c.teamId)
  await log(c, 'updated trip', name || 'trip', 'details edited', { trip_id: tripId, account_id: accountId || null })
  if (accountId) revalidatePath(`/ops/accounts/${accountId}`)
}

export async function setCardOwner(cardId: string, owner: string): Promise<void> {
  const c = await ctx(); if (!c) return
  const { data: card } = await c.admin.from('cards').select('title, account_id').eq('id', cardId).single()
  await c.admin.from('cards').update({ owner_name: owner }).eq('id', cardId)
  if (card) await log(c, 'updated', card.title, `assigned to ${owner}`, { card_id: cardId, account_id: card.account_id })
  revalidatePath('/ops'); if (card?.account_id) revalidatePath(`/ops/accounts/${card.account_id}`)
}

export async function setAccountStatus(accountId: string, status: string): Promise<void> {
  const c = await ctx(); if (!c) return
  const { data: acc } = await c.admin.from('accounts').select('name').eq('id', accountId).single()
  await c.admin.from('accounts').update({ status }).eq('id', accountId).eq('team_id', c.teamId)
  if (acc) await log(c, 'updated', acc.name, `status → ${status}`, { account_id: accountId })
  revalidatePath('/ops'); revalidatePath(`/ops/accounts/${accountId}`)
}

export async function setPaymentStatus(paymentId: string, status: string): Promise<void> {
  const c = await ctx(); if (!c) return
  const { data: p } = await c.admin.from('payments').select('label, trip_id').eq('id', paymentId).single()
  const patch: Record<string, unknown> = { status }
  if (status === 'invoiced') patch.invoiced_at = new Date().toISOString()
  if (status === 'paid') patch.paid_at = new Date().toISOString()
  await c.admin.from('payments').update(patch).eq('id', paymentId).eq('team_id', c.teamId)
  if (p) await log(c, 'payment', p.label, status, { trip_id: p.trip_id })
  revalidatePath('/ops'); if (p?.trip_id) await revalidateTrip(c, p.trip_id)
}

export async function setDocStatus(docId: string, status: string): Promise<void> {
  const c = await ctx(); if (!c) return
  const { data: d } = await c.admin.from('trip_docs').select('label, trip_id').eq('id', docId).single()
  await c.admin.from('trip_docs').update({ status }).eq('id', docId).eq('team_id', c.teamId)
  if (d) await log(c, 'checklist', d.label, status, { trip_id: d.trip_id })
  if (d?.trip_id) await revalidateTrip(c, d.trip_id)
}

export async function setSegmentStatus(segmentId: string, status: string): Promise<void> {
  const c = await ctx(); if (!c) return
  const { data: s } = await c.admin.from('segments').select('name, trip_id').eq('id', segmentId).single()
  await c.admin.from('segments').update({ status }).eq('id', segmentId).eq('team_id', c.teamId)
  if (s) await log(c, 'updated', s.name, status, { trip_id: s.trip_id })
  if (s?.trip_id) await revalidateTrip(c, s.trip_id)
}

// ---- create ----
export async function addEnquiry(formData: FormData): Promise<void> {
  const c = await ctx(); if (!c) return
  const client = String(formData.get('client') || '').trim()
  const title = String(formData.get('title') || '').trim()
  if (!client) return
  let { data: acc } = await c.admin.from('accounts').select('*').eq('team_id', c.teamId).ilike('name', client).maybeSingle()
  if (!acc) {
    const ins = await c.admin.from('accounts').insert({
      team_id: c.teamId, name: client, status: 'lead', source: 'website', owner_name: 'Business Dev',
    }).select('*').single()
    acc = ins.data
    if (acc) await log(c, 'added client', acc.name, 'Lead', { account_id: acc.id })
  }
  if (!acc) return
  const boardId = await getOrCreateAccountBoard(c.admin, c.teamId, acc.id, acc.name)
  const t = title || `New enquiry — ${client}`
  const { data: card } = await c.admin.from('cards').insert({
    board_id: boardId, account_id: acc.id, title: t, type: 'Enquiry', stage: 'enquiry',
    owner_name: 'Business Dev', priority: 'Medium', source: 'website', position: 1000,
  }).select('id').single()
  if (card) await log(c, 'created', t, 'Enquiry', { card_id: card.id, account_id: acc.id })
  revalidatePath('/ops')
}

export async function addTrip(formData: FormData): Promise<void> {
  const c = await ctx(); if (!c) return
  const accountId = String(formData.get('account_id') || '')
  const name = String(formData.get('name') || '').trim()
  if (!accountId || !name) return
  const { data: trip } = await c.admin.from('trips').insert({
    team_id: c.teamId, account_id: accountId, name, status: 'planning',
  }).select('*').single()
  if (!trip) return
  await c.admin.from('trip_docs').insert(DEFAULT_TRIP_DOCS.map((d, i) => ({
    team_id: c.teamId, trip_id: trip.id, code: d.code, label: d.label, status: 'todo', sort: i,
  })))
  await log(c, 'created trip', trip.name, '', { trip_id: trip.id, account_id: accountId })
  revalidatePath(`/ops/accounts/${accountId}`)
}

// Email an itinerary/voucher PDF to the client's email (from the Ops trip card).
// Returns a short status string for the client component to surface.
export async function emailTripDoc(tripId: string, type: 'itinerary' | 'voucher'): Promise<string> {
  const c = await ctx(); if (!c) return 'not signed in'
  const r = await emailDoc(c.admin, c.teamId, { tripId, type })
  if ('error' in r) return r.error
  const { data: trip } = await c.admin.from('trips').select('name, account_id').eq('id', tripId).single()
  if (trip) await log(c, `${type} emailed`, trip.name, `→ ${r.to}`, { trip_id: tripId, account_id: trip.account_id })
  if (trip?.account_id) revalidatePath(`/ops/accounts/${trip.account_id}`)
  return `Emailed to ${r.to}`
}

// Build the quote PDF and send it to the approver for sign-off (never straight
// to the client). Mirrors the concierge prepare_quote flow from the web side.
export async function prepareQuote(tripId: string): Promise<void> {
  const c = await ctx(); if (!c) return
  const { data: trip } = await c.admin.from('trips').select('id, name, account_id').eq('id', tripId).eq('team_id', c.teamId).single()
  if (!trip) return
  const built = await buildAndStore(c.admin, c.teamId, 'quote', tripId)
  if ('error' in built) return
  await enqueueDoc(c.admin, c.teamId, {
    target: APPROVER, kind: 'quote_review',
    caption: `📝 Quote ready for approval — ${trip.name}. Reply "send quote ${trip.name}" on WhatsApp to release it to the client.`,
    signedUrl: built.signedUrl, filename: built.filename,
  })
  await log(c, 'quote prepared', trip.name, `→ ${APPROVER} for approval`, { trip_id: trip.id, account_id: trip.account_id })
  revalidatePath(`/ops/accounts/${trip.account_id}`)
}

export async function addTripFromPackage(formData: FormData): Promise<void> {
  const c = await ctx(); if (!c) return
  const accountId = String(formData.get('account_id') || '')
  const slug = String(formData.get('package') || '')
  const pax = Number(formData.get('pax') || 0)
  const startDate = String(formData.get('start_date') || '') || undefined
  if (!accountId || !slug) return
  const pkg = findPackage(slug); if (!pkg) return
  const spec = packageToTripSpec(pkg, pax, startDate)
  const made = await createTripFromSpec(c, accountId, spec)
  if (made) await log(c, 'created trip', made.name, `from package ${pkg.slug}`, { trip_id: made.tripId, account_id: accountId })
  revalidatePath(`/ops/accounts/${accountId}`)
}

// Seed the 30/70 plan for a manual trip on demand (button on the trip card).
export async function seedPaymentPlanAction(formData: FormData): Promise<void> {
  const c = await ctx(); if (!c) return
  const tripId = String(formData.get('trip_id') || '')
  if (!tripId) return
  const { data: trip } = await c.admin.from('trips').select('value, start_date, account_id, name').eq('id', tripId).eq('team_id', c.teamId).single()
  if (!trip) return
  const ok = await seedPaymentPlan(c, tripId, Number(trip.value) || 0, trip.start_date)
  if (ok) await log(c, 'payment', trip.name, '30/70 plan added', { trip_id: tripId, account_id: trip.account_id })
  if (trip.account_id) revalidatePath(`/ops/accounts/${trip.account_id}`)
}

async function revalidateTrip(c: Ctx, tripId: string): Promise<void> {
  const { data } = await c.admin.from('trips').select('account_id').eq('id', tripId).single()
  if (data?.account_id) revalidatePath(`/ops/accounts/${data.account_id}`)
}
