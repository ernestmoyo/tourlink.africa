'use client'

import { useEffect, useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import {
  STAGES, ACCOUNT_STATUSES, PAYMENT_STATUSES, DOC_STATUSES, SEGMENT_STATUSES,
  DEFAULT_OWNERS, ownerColor,
} from '@/lib/crm/constants'
import {
  moveCardStage, setAccountStatus, setPaymentStatus, setDocStatus, setSegmentStatus, setCardOwner,
} from '@/app/ops/actions'

type Kind = 'stage' | 'account' | 'payment' | 'doc' | 'segment' | 'owner'

const OPTIONS: Record<Kind, { value: string; label: string; color?: string }[]> = {
  stage: STAGES.map((s) => ({ value: s.id, label: s.title, color: s.accent })),
  account: ACCOUNT_STATUSES.map((s) => ({ value: s.id, label: s.label, color: s.color })),
  payment: Object.entries(PAYMENT_STATUSES).map(([value, v]) => ({ value, label: v.label, color: v.color })),
  doc: Object.entries(DOC_STATUSES).map(([value, v]) => ({ value, label: v.label, color: v.color })),
  segment: Object.entries(SEGMENT_STATUSES).map(([value, v]) => ({ value, label: v.label, color: v.color })),
  owner: DEFAULT_OWNERS.map((o) => ({ value: o, label: o, color: ownerColor(o) })),
}

async function dispatch(kind: Kind, id: string, value: string): Promise<void> {
  if (kind === 'stage') return moveCardStage(id, value as never)
  if (kind === 'account') return setAccountStatus(id, value)
  if (kind === 'payment') return setPaymentStatus(id, value)
  if (kind === 'doc') return setDocStatus(id, value)
  if (kind === 'owner') return setCardOwner(id, value)
  return setSegmentStatus(id, value)
}

interface StatusControlProps {
  kind: Kind
  id: string
  value: string
}

// A tiny inline dropdown that saves on change and re-sorts the board so the item
// moves to its new place automatically (no drag-and-drop needed). Optimistic:
// the selection updates instantly, then the server confirms + the board refreshes.
export function StatusControl({ kind, id, value }: StatusControlProps) {
  const router = useRouter()
  const [pending, start] = useTransition()
  const [val, setVal] = useState(value)
  // Re-sync if the server sends a new value (e.g. after a refresh).
  useEffect(() => { setVal(value) }, [value])

  const base = OPTIONS[kind]
  // Ensure the current value is always selectable (e.g. a custom owner name).
  const opts = base.some((o) => o.value === val) || !val
    ? base
    : [{ value: val, label: val, color: '#6B6B6B' }, ...base]
  const current = opts.find((o) => o.value === val)

  return (
    <span className="relative inline-flex items-center">
      <span
        aria-hidden
        className="mr-1.5 h-2 w-2 rounded-full transition-colors"
        style={{ backgroundColor: current?.color ?? '#6B6B6B' }}
      />
      <select
        value={val}
        disabled={pending}
        onChange={(e) => {
          const next = e.target.value
          setVal(next) // optimistic — reflect the choice immediately
          start(async () => {
            await dispatch(kind, id, next)
            router.refresh() // re-fetch so the row/card moves to its new spot
          })
        }}
        className="appearance-none rounded-md border border-savanna bg-white py-1 pl-1.5 pr-6 text-xs font-semibold text-charcoal cursor-pointer focus:outline-none focus:ring-2 focus:ring-navy disabled:opacity-50"
      >
        {opts.map((o) => (
          <option key={o.value} value={o.value}>{o.label}</option>
        ))}
      </select>
    </span>
  )
}
