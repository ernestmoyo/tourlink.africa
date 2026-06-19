'use client'

import { useRef } from 'react'
import { switchActor } from '@/app/ops/actions'
import { ownerColor } from '@/lib/crm/constants'

// "Who am I" picker in the Ops header — no password, just attribution.
// Auto-submits on change.
export function WhoSwitcher({ people, current }: { people: string[]; current: string }) {
  const ref = useRef<HTMLFormElement>(null)
  return (
    <form action={switchActor} ref={ref} className="flex items-center gap-1.5">
      <span aria-hidden className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: ownerColor(current) }} />
      <select
        name="who"
        defaultValue={current}
        onChange={() => ref.current?.requestSubmit()}
        aria-label="Who am I"
        className="rounded-md border border-savanna bg-white py-1.5 pl-2 pr-7 text-sm font-semibold text-charcoal cursor-pointer focus:outline-none focus:ring-2 focus:ring-navy"
      >
        {people.map((p) => <option key={p} value={p}>{p}</option>)}
      </select>
    </form>
  )
}
