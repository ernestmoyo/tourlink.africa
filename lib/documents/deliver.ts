import 'server-only'
import type { SupabaseClient } from '@supabase/supabase-js'
import { loadTripDocData } from '@/lib/documents/data'
import { buildDoc, type DocType, type BuiltDoc } from '@/lib/documents/build'
import { sendEmail, emailShell, emailEnabled } from '@/lib/email/send'

const BUCKET = process.env.TOURLINK_DOCS_BUCKET || 'tourlink-docs'
const SIGNED_URL_TTL = 60 * 60 * 24 * 7 // 7 days — plenty for the outbox poll + retries

const safe = (s: string) => s.replace(/[^a-zA-Z0-9._-]/g, '_').slice(-80)

export type Built = {
  storagePath: string
  signedUrl: string
  filename: string
  tripName: string
  accountName: string
  contactPhone: string
}

// Build a document for a trip and store it in the private docs bucket. Returns a
// durable storage path (so it can be re-signed later) plus a fresh signed URL.
export async function buildAndStore(admin: SupabaseClient, teamId: string, type: DocType, tripId: string): Promise<Built | { error: string }> {
  const data = await loadTripDocData(admin, teamId, tripId)
  if (!data) return { error: 'trip not found' }

  const built: BuiltDoc = await buildDoc(type, data)
  const storagePath = `${teamId}/${type}/${Date.now()}_${safe(built.filename)}`
  const up = await admin.storage.from(BUCKET).upload(storagePath, Buffer.from(built.bytes), { contentType: 'application/pdf', upsert: false })
  if (up.error) return { error: `storage upload failed: ${up.error.message}` }

  const signed = await admin.storage.from(BUCKET).createSignedUrl(storagePath, SIGNED_URL_TTL)
  if (signed.error || !signed.data?.signedUrl) return { error: `could not sign document url: ${signed.error?.message || 'unknown'}` }

  return {
    storagePath,
    signedUrl: signed.data.signedUrl,
    filename: built.filename,
    tripName: data.trip.name,
    accountName: data.account.name,
    contactPhone: (data.account.contact_phone || '').trim(),
  }
}

// Build the raw bytes for a direct web download (no storage round-trip).
export async function buildBytes(admin: SupabaseClient, teamId: string, type: DocType, tripId: string): Promise<BuiltDoc | { error: string }> {
  const data = await loadTripDocData(admin, teamId, tripId)
  if (!data) return { error: 'trip not found' }
  return buildDoc(type, data)
}

export async function signStored(admin: SupabaseClient, storagePath: string): Promise<string | null> {
  const signed = await admin.storage.from(BUCKET).createSignedUrl(storagePath, SIGNED_URL_TTL)
  return signed.data?.signedUrl || null
}

// Enqueue a document onto the outbox; the bridge delivers it as a WhatsApp
// document (the text becomes the caption).
export async function enqueueDoc(
  admin: SupabaseClient,
  teamId: string,
  args: { target: string; caption: string; signedUrl: string; filename: string; kind: string },
): Promise<{ error?: string }> {
  const { error } = await admin.from('outbox').insert({
    team_id: teamId, target: args.target, text: args.caption, kind: args.kind,
    media_url: args.signedUrl, media_mime: 'application/pdf', media_name: args.filename,
  })
  return error ? { error: `could not enqueue document: ${error.message}` } : {}
}

export { emailEnabled }

const DOC_NOUN: Record<DocType, string> = { quote: 'quote', itinerary: 'itinerary', voucher: 'voucher' }

export type EmailDocResult = { ok: true; to: string; filename: string } | { error: string }

// Build a trip document and email it (PDF attached) to the client or a given
// address. Returns an error string when email isn't configured or no address.
export async function emailDoc(
  admin: SupabaseClient, teamId: string,
  opts: { tripId: string; type: DocType; to?: string; subject?: string; intro?: string },
): Promise<EmailDocResult> {
  if (!emailEnabled()) return { error: 'email is not configured (set RESEND_API_KEY + EMAIL_FROM)' }
  const data = await loadTripDocData(admin, teamId, opts.tripId)
  if (!data) return { error: 'trip not found' }
  const to = (opts.to || data.account.contact_email || '').trim()
  if (!to) return { error: 'no client email on file — add a contact email first' }

  const built: BuiltDoc = await buildDoc(opts.type, data)
  const noun = DOC_NOUN[opts.type]
  const subject = opts.subject || `Your TourLink ${noun} — ${data.trip.name}`
  const intro = opts.intro || `Please find your ${noun} for <strong>${data.trip.name}</strong> attached. We'd be delighted to take you on this journey.`
  const html = emailShell(`Your ${noun}`, `<p style="font-size:14px;line-height:1.6">Dear ${data.account.name},</p><p style="font-size:14px;line-height:1.6">${intro}</p><p style="font-size:14px;line-height:1.6">Any questions, just reply to this email or message us on WhatsApp at +255 767 898 469.</p><p style="font-size:14px;line-height:1.6">Warm regards,<br/>The TourLink team 🦒</p>`)

  const r = await sendEmail({
    to, subject, html,
    attachments: [{ filename: built.filename, contentBase64: Buffer.from(built.bytes).toString('base64'), contentType: 'application/pdf' }],
  })
  if ('error' in r) return { error: r.error }
  return { ok: true, to, filename: built.filename }
}

export type DeliverResult = { ok: true; target: string; filename: string; tripName: string } | { error: string }

// Generate a document and deliver it straight to a target (no approval). Used
// for itineraries / vouchers, and for releasing an approved quote to the client.
export async function generateAndDeliver(
  admin: SupabaseClient, teamId: string,
  opts: { tripId: string; type: DocType; target?: string; caption?: string; kind?: string },
): Promise<DeliverResult> {
  const built = await buildAndStore(admin, teamId, opts.type, opts.tripId)
  if ('error' in built) return built
  const target = (opts.target || '').trim() || built.contactPhone || 'group'
  const caption = opts.caption || `🦒 ${built.tripName} — ${opts.type} attached.`
  const enq = await enqueueDoc(admin, teamId, { target, caption, signedUrl: built.signedUrl, filename: built.filename, kind: opts.kind || opts.type })
  if (enq.error) return { error: enq.error }
  return { ok: true, target, filename: built.filename, tripName: built.tripName }
}
