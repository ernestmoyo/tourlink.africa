import type { Metadata } from 'next'
import Link from 'next/link'
import { isOpsAuthed, opsActor } from '@/lib/ops/auth'
import { getSupabaseAdmin } from '@/lib/supabase/server'
import { getOpsTeams } from '@/lib/ops/team'
import { TeamSwitcher } from '@/app/ops/_components/TeamSwitcher'
import { WhoSwitcher } from '@/app/ops/_components/WhoSwitcher'
import { SIGN_IN_PEOPLE } from '@/lib/crm/constants'

export const metadata: Metadata = {
  title: 'TourRelay',
  robots: { index: false, follow: false },
}

export default async function OpsLayout({ children }: { children: React.ReactNode }) {
  const authed = await isOpsAuthed()
  const who = authed ? await opsActor() : ''
  const admin = authed ? getSupabaseAdmin() : null
  const teamInfo = admin ? await getOpsTeams(admin) : { activeId: '', teams: [] }
  return (
    <div className="min-h-screen bg-sand">
      <header className="sticky top-0 z-40 border-b border-savanna bg-white/90 backdrop-blur">
        <div className="mx-auto flex max-w-[1536px] items-center justify-between px-4 py-3 sm:px-6">
          <div className="flex items-center gap-3">
            <Link href="/ops" className="flex items-center gap-2">
              <span className="text-xl">🔗</span>
              <span className="font-serif text-lg font-bold text-navy">Tour<span className="text-magenta">Relay</span></span>
            </Link>
            {authed && (
              <nav className="ml-4 hidden gap-4 text-sm font-semibold text-slate sm:flex">
                <Link href="/ops" className="hover:text-navy">Pipeline</Link>
                <Link href="/ops/dashboard" className="hover:text-navy">Dashboard</Link>
                <Link href="/ops#clients" className="hover:text-navy">Clients</Link>
                <Link href="/ops#activity" className="hover:text-navy">Activity</Link>
              </nav>
            )}
          </div>
          {authed && (
            <div className="flex items-center gap-3 text-sm">
              <TeamSwitcher teams={teamInfo.teams} activeId={teamInfo.activeId} />
              <WhoSwitcher people={SIGN_IN_PEOPLE} current={who} />
            </div>
          )}
        </div>
      </header>
      <main className="mx-auto max-w-[1536px] px-4 py-6 sm:px-6">{children}</main>
    </div>
  )
}
