import { getSupabaseAdmin } from '@/lib/supabase/server'
import { isOpsAuthed } from '@/lib/ops/auth'
import { getSelectedTeamId } from '@/lib/ops/team'
import { buildBytes } from '@/lib/documents/deliver'
import type { DocType } from '@/lib/documents/build'

export const dynamic = 'force-dynamic'

const TYPES: DocType[] = ['quote', 'itinerary', 'voucher']

// Ops-only: stream a freshly-built PDF for a trip, for the team to download or
// print. Travellers never hit this — it's behind the ops password.
export async function GET(req: Request) {
  if (!(await isOpsAuthed())) return new Response('unauthorized', { status: 401 })
  const url = new URL(req.url)
  const tripId = url.searchParams.get('trip') || ''
  const type = (url.searchParams.get('type') || 'quote') as DocType
  if (!tripId || !TYPES.includes(type)) return new Response('bad request', { status: 400 })

  const admin = getSupabaseAdmin()
  if (!admin) return new Response('not configured', { status: 500 })
  const teamId = await getSelectedTeamId(admin)

  const built = await buildBytes(admin, teamId, type, tripId)
  if ('error' in built) return new Response(built.error, { status: 404 })

  return new Response(Buffer.from(built.bytes), {
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': `inline; filename="${built.filename}"`,
      'Cache-Control': 'no-store',
    },
  })
}
