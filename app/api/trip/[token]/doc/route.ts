import { getSupabaseAdmin } from '@/lib/supabase/server'
import { buildBytes } from '@/lib/documents/deliver'
import type { DocType } from '@/lib/documents/build'

export const dynamic = 'force-dynamic'

// Public, token-scoped document download for the traveller portal. Only the
// itinerary and voucher are exposed — never the quote (pricing/approval).
const PUBLIC_TYPES: DocType[] = ['itinerary', 'voucher']

export async function GET(req: Request, { params }: { params: Promise<{ token: string }> }) {
  const { token } = await params
  const type = (new URL(req.url).searchParams.get('type') || 'itinerary') as DocType
  if (!token || !PUBLIC_TYPES.includes(type)) return new Response('not found', { status: 404 })

  const admin = getSupabaseAdmin()
  if (!admin) return new Response('not configured', { status: 500 })
  const { data: trip } = await admin.from('trips').select('id, team_id').eq('share_token', token).maybeSingle()
  if (!trip) return new Response('not found', { status: 404 })

  const built = await buildBytes(admin, trip.team_id as string, type, trip.id as string)
  if ('error' in built) return new Response(built.error, { status: 404 })

  return new Response(Buffer.from(built.bytes), {
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': `inline; filename="${built.filename}"`,
      'Cache-Control': 'no-store',
    },
  })
}
