import { NextResponse } from 'next/server'
import { getSupabaseAdmin, resolveTeamId } from '@/lib/supabase/server'
import { loadState } from '@/lib/concierge/state'
import { replyStandup, replyPayments } from '@/lib/concierge/brain'

export const dynamic = 'force-dynamic'

function authorized(req: Request): boolean {
  const expected = process.env.CONCIERGE_WA_SECRET
  if (!expected) return process.env.NODE_ENV !== 'production'
  return req.headers.get('x-concierge-secret') === expected
}

// Compute proactive messages from the desk and ENQUEUE them on the outbox; the
// bridge poller delivers them. type=morning → group standup. type=eod → recap.
export async function GET(req: Request) {
  if (!authorized(req)) return NextResponse.json({ error: 'unauthorized' }, { status: 401 })
  const type = new URL(req.url).searchParams.get('type') === 'eod' ? 'eod' : 'morning'
  const admin = getSupabaseAdmin()
  if (!admin) return NextResponse.json({ error: 'not configured' }, { status: 500 })

  const teamId = await resolveTeamId(admin, new URL(req.url).searchParams.get('team') || undefined)
  if (!teamId) return NextResponse.json({ enqueued: 0 })

  const ctx = { admin, teamId, sender: 'Relay' }
  const { cards, accounts, trips, payments } = await loadState(ctx)

  const rows: { team_id: string; target: string; kind: string; text: string }[] = []
  if (type === 'eod') {
    const since = new Date(); since.setHours(0, 0, 0, 0)
    const { data: acts } = await admin
      .from('activity').select('verb, subject').eq('team_id', teamId)
      .gte('created_at', since.toISOString()).order('created_at', { ascending: true })
    const moved = (acts || []).filter((a) => ['moved', 'won', 'lost', 'created', 'created trip', 'payment', 'quote sent'].includes(a.verb as string))
      .map((a) => `• ${a.subject} — ${a.verb}`)
    const text = [
      '🌙 *TourLink end of day*', '',
      moved.length ? `✅ *Today (${moved.length})*\n${moved.slice(0, 15).join('\n')}` : '😴 Quiet day on the desk.',
      '', replyPayments(trips, payments),
    ].join('\n')
    rows.push({ team_id: teamId, target: 'group', kind: 'eod', text })
  } else {
    rows.push({ team_id: teamId, target: 'group', kind: 'standup', text: replyStandup(cards, accounts, trips, payments) })
  }

  if (new URL(req.url).searchParams.get('dry') === '1') {
    return NextResponse.json({ ok: true, type, dry: true, messages: rows })
  }
  if (rows.length) await admin.from('outbox').insert(rows)
  return NextResponse.json({ ok: true, type, enqueued: rows.length })
}
