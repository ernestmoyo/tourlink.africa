import 'server-only'
import type { SupabaseClient } from '@supabase/supabase-js'
import type { Account, Trip, Segment, Payment, TripDoc } from '@/lib/crm/types'

// Load everything needed to render a trip document, team-scoped for safety.
export type TripDocData = {
  trip: Trip
  account: Account
  segments: Segment[]
  payments: Payment[]
  docs: TripDoc[]
}

export async function loadTripDocData(admin: SupabaseClient, teamId: string, tripId: string): Promise<TripDocData | null> {
  const { data: trip } = await admin.from('trips').select('*').eq('id', tripId).eq('team_id', teamId).maybeSingle()
  if (!trip) return null
  const { data: account } = await admin.from('accounts').select('*').eq('id', (trip as Trip).account_id).eq('team_id', teamId).maybeSingle()
  if (!account) return null
  const [{ data: segments }, { data: payments }, { data: docs }] = await Promise.all([
    admin.from('segments').select('*').eq('trip_id', tripId).eq('team_id', teamId).order('sort', { ascending: true }),
    admin.from('payments').select('*').eq('trip_id', tripId).eq('team_id', teamId).order('sort', { ascending: true }),
    admin.from('trip_docs').select('*').eq('trip_id', tripId).eq('team_id', teamId).order('sort', { ascending: true }),
  ])
  return {
    trip: trip as Trip,
    account: account as Account,
    segments: (segments || []) as Segment[],
    payments: (payments || []) as Payment[],
    docs: (docs || []) as TripDoc[],
  }
}
