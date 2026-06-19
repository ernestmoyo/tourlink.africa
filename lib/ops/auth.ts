import 'server-only'
import { cookies } from 'next/headers'
import { OPS_OWNER } from '@/lib/crm/constants'

// Lightweight password gate for the internal /ops CRM. The cookie stores the
// configured password (httpOnly) and the gate compares it server-side, so a
// forged cookie can't pass without knowing the password. v1 — upgrade to full
// Supabase Auth later.

const COOKIE = 'tl_ops'
const WHO_COOKIE = 'tl_ops_who'

function expected(): string | null {
  return process.env.TOURLINK_OPS_PASSWORD || null
}

// Password gate DISABLED for now — /ops is open. To re-enable, set
// TOURLINK_OPS_PASSWORD *and* TOURLINK_OPS_REQUIRE=true.
export async function isOpsAuthed(): Promise<boolean> {
  if (process.env.TOURLINK_OPS_REQUIRE !== 'true') return true
  const pw = expected()
  if (!pw) return process.env.NODE_ENV !== 'production'
  const jar = await cookies()
  return jar.get(COOKIE)?.value === pw
}

export async function opsActor(): Promise<string> {
  const jar = await cookies()
  return jar.get(WHO_COOKIE)?.value || OPS_OWNER
}

// Set who the current operator is (used by the header "who am I" switcher now
// that there's no sign-in step).
export async function setActor(who: string): Promise<void> {
  const jar = await cookies()
  jar.set(WHO_COOKIE, who, { httpOnly: false, sameSite: 'lax', path: '/', maxAge: 60 * 60 * 24 * 30 })
}

export async function signIn(password: string, who: string): Promise<boolean> {
  const pw = expected()
  if (pw && password !== pw) return false
  const jar = await cookies()
  const common = { httpOnly: true, sameSite: 'lax' as const, path: '/', maxAge: 60 * 60 * 24 * 14 }
  jar.set(COOKIE, pw || 'open', { ...common })
  jar.set(WHO_COOKIE, who || OPS_OWNER, { ...common, httpOnly: false })
  return true
}

export async function signOut(): Promise<void> {
  const jar = await cookies()
  jar.delete(COOKIE)
  jar.delete(WHO_COOKIE)
}
