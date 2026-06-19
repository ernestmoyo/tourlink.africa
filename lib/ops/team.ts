import 'server-only'
import { cookies } from 'next/headers'
import type { SupabaseClient } from '@supabase/supabase-js'
import { ensureWorkspaces, listTeams, type TeamRow } from '@/lib/supabase/server'

// Which workspace the Ops UI is currently looking at. Stored in a cookie so each
// signed-in operator can switch between TourLink (tours) and VisaPermitLink (BPO).

const TEAM_COOKIE = 'tl_team'

// Ensure both workspaces exist, then resolve the selected one (cookie → else the
// first/oldest team). Returns the active id plus the full list for the switcher.
export async function getOpsTeams(admin: SupabaseClient): Promise<{ activeId: string; teams: TeamRow[] }> {
  const teams = await ensureWorkspaces(admin)
  const jar = await cookies()
  const wanted = jar.get(TEAM_COOKIE)?.value
  const active = (wanted && teams.find((t) => t.id === wanted)) || teams[0]
  return { activeId: active?.id ?? '', teams }
}

// Resolve just the selected team id (for loaders/actions that don't need the list).
export async function getSelectedTeamId(admin: SupabaseClient): Promise<string> {
  const jar = await cookies()
  const wanted = jar.get(TEAM_COOKIE)?.value
  const teams = await listTeams(admin)
  const active = (wanted && teams.find((t) => t.id === wanted)) || teams[0]
  if (active) return active.id
  // No teams yet — seed and retry.
  const seeded = await ensureWorkspaces(admin)
  return seeded[0].id
}

export async function setSelectedTeam(teamId: string): Promise<void> {
  const jar = await cookies()
  jar.set(TEAM_COOKIE, teamId, { httpOnly: false, sameSite: 'lax', path: '/', maxAge: 60 * 60 * 24 * 30 })
}
