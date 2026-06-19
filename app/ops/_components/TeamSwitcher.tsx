'use client'

import { useRef } from 'react'
import { setActiveTeam } from '@/app/ops/actions'

type Team = { id: string; name: string }

// Switch the active workspace (TourLink ↔ VisaPermitLink). Auto-submits on change.
export function TeamSwitcher({ teams, activeId }: { teams: Team[]; activeId: string }) {
  const ref = useRef<HTMLFormElement>(null)
  if (teams.length < 2) return null
  return (
    <form action={setActiveTeam} ref={ref}>
      <select
        name="team"
        defaultValue={activeId}
        onChange={() => ref.current?.requestSubmit()}
        className="rounded-md border border-savanna bg-white py-1.5 pl-2 pr-7 text-sm font-semibold text-navy cursor-pointer focus:outline-none focus:ring-2 focus:ring-navy"
        aria-label="Switch workspace"
      >
        {teams.map((t) => <option key={t.id} value={t.id}>{t.name}</option>)}
      </select>
    </form>
  )
}
