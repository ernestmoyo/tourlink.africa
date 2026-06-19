'use server'

import { z } from 'zod'
import { getSupabaseAdmin, ensureWorkspaces } from '@/lib/supabase/server'
import { getOrCreateAccountBoard, log } from '@/lib/concierge/state'

// Public enquiry capture — called from the marketing site's forms. Creates (or
// reuses) an account and drops an enquiry card on the pipeline. No auth: this is
// the front door. Best-effort; never throws to the caller.

const schema = z.object({
  name: z.string().min(1).max(120),
  email: z.string().email().optional().or(z.literal('')),
  phone: z.string().max(40).optional().or(z.literal('')),
  interest: z.string().max(120).optional(),
  message: z.string().max(2000).optional(),
  pax: z.number().int().positive().max(200).optional(),
  destinations: z.array(z.string().max(60)).max(12).optional(),
  source: z.enum(['website', 'referral', 'event', 'partner']).optional(),
})

export type CaptureInput = z.infer<typeof schema>

export async function captureWebEnquiry(raw: CaptureInput): Promise<{ ok: boolean }> {
  const parsed = schema.safeParse(raw)
  if (!parsed.success) return { ok: false }
  const input = parsed.data

  const admin = getSupabaseAdmin()
  if (!admin) return { ok: false } // Formspree still delivered the lead by email

  try {
    // Website enquiries belong to the TourLink workspace (not VisaPermitLink).
    const teams = await ensureWorkspaces(admin)
    const teamId = teams.find((t) => t.name.toLowerCase() === 'tourlink')?.id ?? teams[0].id
    const ctx = { admin, teamId, sender: input.name }

    // Match an existing account by email, phone, or name (in that order).
    const email = input.email?.trim() || null
    const phone = input.phone?.replace(/\D/g, '') || null
    let account: { id: string; name: string } | null = null

    if (email) {
      const { data } = await admin.from('accounts').select('id, name').eq('team_id', teamId).ilike('contact_email', email).maybeSingle()
      account = data
    }
    if (!account && phone && phone.length >= 9) {
      const { data } = await admin.from('accounts').select('id, name, contact_phone').eq('team_id', teamId)
      account = (data || []).find((a) => (a.contact_phone || '').replace(/\D/g, '').slice(-9) === phone.slice(-9)) || null
    }
    if (!account) {
      const { data } = await admin.from('accounts').select('id, name').eq('team_id', teamId).ilike('name', input.name).maybeSingle()
      account = data
    }
    if (!account) {
      const { data } = await admin.from('accounts').insert({
        team_id: teamId, name: input.name, status: 'lead', source: input.source || 'website',
        owner_name: 'Business Dev', contact_email: email, contact_phone: input.phone || null,
      }).select('id, name').single()
      account = data
      if (account) await log(ctx, 'added client', account.name, 'Website lead', { account_id: account.id })
    }
    if (!account) return { ok: false }

    const boardId = await getOrCreateAccountBoard(admin, teamId, account.id, account.name)
    const interest = input.interest ? input.interest.replace(/-/g, ' ') : 'enquiry'
    const title = `Website: ${interest}`
    const { data: card } = await admin.from('cards').insert({
      board_id: boardId, account_id: account.id, title, type: 'Enquiry', stage: 'enquiry',
      owner_name: 'Business Dev', priority: 'Medium', source: input.source || 'website',
      pax: input.pax ?? null, destinations: input.destinations ?? [],
      notes: input.message ? `[website form] ${input.message}` : null, position: 1000,
    }).select('id').single()
    if (card) await log(ctx, 'created', title, 'Website enquiry', { card_id: card.id, account_id: account.id })
    return { ok: true }
  } catch (e) {
    console.error('captureWebEnquiry failed', e)
    return { ok: false }
  }
}
