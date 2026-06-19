import { NextResponse } from 'next/server'
import { getSupabaseAdmin, resolveTeamId } from '@/lib/supabase/server'

export const dynamic = 'force-dynamic'

// Outbound message queue. The WhatsApp bridge polls GET to fetch queued
// messages, delivers them, then POSTs back the ids it sent (or failed).

function authorized(req: Request): boolean {
  const expected = process.env.CONCIERGE_WA_SECRET
  if (!expected) return process.env.NODE_ENV !== 'production'
  return req.headers.get('x-concierge-secret') === expected
}

export async function GET(req: Request) {
  if (!authorized(req)) return NextResponse.json({ error: 'unauthorized' }, { status: 401 })
  const admin = getSupabaseAdmin()
  if (!admin) return NextResponse.json({ error: 'not configured' }, { status: 500 })
  // When a bridge serves one workspace (CONCIERGE_TEAM), scope to that team so
  // two numbers don't deliver each other's messages.
  const teamParam = new URL(req.url).searchParams.get('team') || undefined
  let q = admin
    .from('outbox').select('id, target, kind, text, media_url, media_mime, media_name')
    .eq('status', 'queued').order('created_at', { ascending: true }).limit(20)
  if (teamParam) {
    const teamId = await resolveTeamId(admin, teamParam)
    if (teamId) q = q.eq('team_id', teamId)
  }
  const { data } = await q
  return NextResponse.json({ messages: data || [] })
}

export async function POST(req: Request) {
  if (!authorized(req)) return NextResponse.json({ error: 'unauthorized' }, { status: 401 })
  const admin = getSupabaseAdmin()
  if (!admin) return NextResponse.json({ error: 'not configured' }, { status: 500 })
  let body: { sent?: string[]; failed?: string[] }
  try { body = await req.json() } catch { return NextResponse.json({ error: 'bad json' }, { status: 400 }) }
  const now = new Date().toISOString()
  if (body.sent?.length) await admin.from('outbox').update({ status: 'sent', sent_at: now }).in('id', body.sent)
  if (body.failed?.length) await admin.from('outbox').update({ status: 'failed' }).in('id', body.failed)
  return NextResponse.json({ ok: true })
}
