import 'server-only'
import { getSupabaseAdmin } from '@/lib/supabase/server'
import { getSelectedTeamId } from '@/lib/ops/team'
import { loadState, type ConciergeState } from '@/lib/concierge/state'
import type { Activity } from '@/lib/crm/types'

export type OpsData = ConciergeState & { teamId: string | null; configured: boolean }

const EMPTY: OpsData = {
  teamId: null, configured: false,
  accounts: [], cards: [], trips: [], segments: [], payments: [], docs: [],
}

// Load the full desk for the active team. Returns configured:false when Supabase
// env is missing, so the UI can show a setup hint instead of crashing.
export async function loadOps(): Promise<OpsData> {
  const admin = getSupabaseAdmin()
  if (!admin) return EMPTY
  // First visit seeds both workspaces (additive, idempotent) and picks the
  // operator's selected one.
  const teamId = await getSelectedTeamId(admin)
  const state = await loadState({ admin, teamId, sender: 'ops' })
  return { ...state, teamId, configured: true }
}

export async function loadActivity(limit = 30): Promise<Activity[]> {
  const admin = getSupabaseAdmin()
  if (!admin) return []
  const teamId = await getSelectedTeamId(admin)
  const { data } = await admin
    .from('activity').select('*').eq('team_id', teamId)
    .order('created_at', { ascending: false }).limit(limit)
  return (data || []) as Activity[]
}
