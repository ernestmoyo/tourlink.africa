import 'server-only'
import { createClient, type SupabaseClient } from '@supabase/supabase-js'

// Server-only Supabase admin client (service-role key). Bypasses RLS, so every
// query MUST be explicitly scoped by team_id. Never import this into a client
// component or expose the key to the browser.

let cached: SupabaseClient | null = null

export function getSupabaseAdmin(): SupabaseClient | null {
  if (cached) return cached
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!url || !key) return null
  cached = createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  })
  return cached
}

// Resolve the active workspace (oldest team). The CRM is single-workspace per
// business; VisaPermitLink will be a second team later.
export async function getActiveTeamId(admin: SupabaseClient): Promise<string | null> {
  const { data } = await admin
    .from('teams').select('id').order('created_at', { ascending: true }).limit(1).maybeSingle()
  return (data?.id as string) ?? null
}

// Idempotent: ensure a default TourLink team exists; return its id.
export async function ensureDefaultTeam(admin: SupabaseClient): Promise<string> {
  const existing = await getActiveTeamId(admin)
  if (existing) return existing
  const { data } = await admin.from('teams').insert({ name: 'TourLink' }).select('id').single()
  return data!.id as string
}

export type TeamRow = { id: string; name: string }

// Workspaces this deployment runs. VisaPermitLink (BPO) is parked behind a flag
// for now — flip ENABLE_BPO=true to bring it online (adds the Ops switcher).
export function workspaceNames(): string[] {
  return process.env.ENABLE_BPO === 'true' ? ['TourLink', 'VisaPermitLink'] : ['TourLink']
}

export async function listTeams(admin: SupabaseClient): Promise<TeamRow[]> {
  const { data } = await admin.from('teams').select('id, name').order('created_at', { ascending: true })
  return (data || []) as TeamRow[]
}

// Idempotent: ensure the enabled workspaces exist (matched by name). Returns all teams.
export async function ensureWorkspaces(admin: SupabaseClient): Promise<TeamRow[]> {
  const existing = await listTeams(admin)
  const have = new Set(existing.map((t) => t.name.toLowerCase()))
  const missing = workspaceNames().filter((n) => !have.has(n.toLowerCase()))
  if (missing.length) await admin.from('teams').insert(missing.map((name) => ({ name })))
  return missing.length ? listTeams(admin) : existing
}

export async function getTeamByName(admin: SupabaseClient, name: string): Promise<string | null> {
  const { data } = await admin.from('teams').select('id').ilike('name', name).order('created_at', { ascending: true }).limit(1).maybeSingle()
  return (data?.id as string) ?? null
}

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

// Resolve a team from a name OR id (used by the WhatsApp bridge's CONCIERGE_TEAM).
// Falls back to the oldest team when no match.
export async function resolveTeamId(admin: SupabaseClient, nameOrId: string | undefined): Promise<string | null> {
  if (nameOrId) {
    if (UUID_RE.test(nameOrId)) {
      const { data } = await admin.from('teams').select('id').eq('id', nameOrId).maybeSingle()
      if (data?.id) return data.id as string
    }
    const byName = await getTeamByName(admin, nameOrId)
    if (byName) return byName
  }
  return getActiveTeamId(admin)
}
