import { NextResponse } from 'next/server'
import { getSupabaseAdmin, resolveTeamId } from '@/lib/supabase/server'
import { runConcierge, isCommand } from '@/lib/concierge/brain'
import { loadState } from '@/lib/concierge/state'
import { runConciergeAI, runClientAI, aiEnabled, type Media } from '@/lib/concierge/ai'

export const dynamic = 'force-dynamic'
// Allow time for the AI tool loop + live web research (Apify) to complete.
export const maxDuration = 60

// Shared secret between the WhatsApp bridge and the app. Required unless running
// locally without one set (dev convenience).
function authorized(req: Request): boolean {
  const expected = process.env.CONCIERGE_WA_SECRET
  if (!expected) return process.env.NODE_ENV !== 'production'
  return req.headers.get('x-concierge-secret') === expected
}

export async function POST(req: Request) {
  if (!authorized(req)) return NextResponse.json({ error: 'unauthorized' }, { status: 401 })

  let body: { from?: string; chatId?: string; name?: string; body?: string; message?: string; media?: Media | null; mode?: string; history?: string; fromPhone?: string; team?: string }
  try { body = await req.json() } catch { return NextResponse.json({ error: 'bad json' }, { status: 400 }) }

  const text = (body.body ?? body.message ?? '').toString()
  const sender = (body.name || '').toString().split(' ')[0] || 'WhatsApp'
  const media = body.media && body.media.data ? body.media : null
  const ambient = body.mode === 'ambient'
  const isClient = body.mode === 'client'
  const fromPhone = (body.fromPhone || '').toString().replace(/\D/g, '')
  const history = (body.history || '').toString()
  if (!text.trim() && !media) return NextResponse.json({ reply: '' })

  const admin = getSupabaseAdmin()
  if (!admin) return NextResponse.json({ error: 'server not configured' }, { status: 500 })

  const teamId = await resolveTeamId(admin, body.team)
  if (!teamId) return NextResponse.json({ reply: 'TourLink has no workspace yet — open /ops on the web first.' })

  const ctx = { admin, teamId, sender }

  // Client-facing DM: a non-team number whose phone matches an account's
  // contact_phone. Read-only, hard-scoped to that one account.
  if (isClient) {
    const state = await loadState(ctx)
    const tail = fromPhone.slice(-9)
    const account = tail.length >= 9
      ? state.accounts.find((a) => { const p = (a.contact_phone || '').replace(/\D/g, ''); return p.length >= 9 && p.slice(-9) === tail })
      : undefined
    const reply = account
      ? await runClientAI(account, state, text)
      : "Hi! 👋 You've reached TourLink's concierge. I don't have your number linked to a trip yet — please ask your TourLink consultant to add it, and I'll be able to share your trip status here. 🦒"
    return NextResponse.json({ reply, ok: true })
  }

  let reply: string
  try {
    if (ambient) {
      reply = aiEnabled() ? await runConciergeAI(ctx, text, media, { ambient: true, history }) : ''
    } else {
      const isAudio = !!media && media.mimetype.startsWith('audio')
      const useAI = aiEnabled() && (media != null || isAudio || process.env.CONCIERGE_AI_ALWAYS === 'true' || !isCommand(text))
      reply = useAI ? await runConciergeAI(ctx, text, media, { ambient: false, history }) : await runConcierge(ctx, text)
    }
  } catch (e) {
    console.error('concierge error', e)
    try { reply = await runConcierge(ctx, text || 'help') } catch { reply = '⚠️ Something went wrong. Try *help*.' }
  }
  return NextResponse.json({ reply, ok: true })
}

export async function GET() {
  return NextResponse.json({ ok: true, service: 'tourlink-concierge', ai: aiEnabled() })
}
