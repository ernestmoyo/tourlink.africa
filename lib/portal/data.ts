import 'server-only'
import { getSupabaseAdmin } from '@/lib/supabase/server'
import type { Trip, Segment, Payment, TripDoc } from '@/lib/crm/types'

// Public, read-only trip view resolved by an unguessable share token. Exposes
// only what a traveller should see — never other clients, owners, or supplier
// costs. The account name is included for a personal greeting.
export type PortalTrip = {
  trip: Trip
  accountName: string
  segments: Segment[]
  payments: Payment[]
  docs: TripDoc[]
}

export async function loadTripByToken(token: string): Promise<PortalTrip | null> {
  if (!token || token.length < 8) return null
  const admin = getSupabaseAdmin()
  if (!admin) return null
  const { data: trip } = await admin.from('trips').select('*').eq('share_token', token).maybeSingle()
  if (!trip) return null
  const t = trip as Trip
  const [{ data: account }, { data: segments }, { data: payments }, { data: docs }] = await Promise.all([
    admin.from('accounts').select('name').eq('id', t.account_id).maybeSingle(),
    admin.from('segments').select('*').eq('trip_id', t.id).order('sort', { ascending: true }),
    admin.from('payments').select('*').eq('trip_id', t.id).order('sort', { ascending: true }),
    admin.from('trip_docs').select('*').eq('trip_id', t.id).order('sort', { ascending: true }),
  ])
  return {
    trip: t,
    accountName: (account?.name as string) || 'Traveller',
    segments: (segments || []) as Segment[],
    payments: (payments || []) as Payment[],
    docs: (docs || []) as TripDoc[],
  }
}
