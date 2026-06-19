'use client'

import { useState, useTransition } from 'react'
import { prepareQuote, emailTripDoc } from '@/app/ops/actions'

const LINK = 'rounded-md border border-savanna bg-white px-2.5 py-1 text-xs font-semibold text-navy hover:bg-sand'

// Per-trip document controls: download the PDFs, push a quote into the approval
// flow (WhatsApp to the approver), or email the itinerary/voucher to the client.
export function DocActions({ tripId, hasEmail, shareToken }: { tripId: string; hasEmail: boolean; shareToken?: string | null }) {
  const [pending, start] = useTransition()
  const [sent, setSent] = useState(false)
  const [emailMsg, setEmailMsg] = useState('')
  const [copied, setCopied] = useState(false)

  function email(type: 'itinerary' | 'voucher') {
    start(async () => { setEmailMsg(await emailTripDoc(tripId, type)) })
  }

  function copyShare() {
    if (!shareToken) return
    const url = `${window.location.origin}/trip/${shareToken}`
    navigator.clipboard?.writeText(url).then(() => { setCopied(true); setTimeout(() => setCopied(false), 2000) })
  }

  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex flex-wrap items-center gap-1.5">
        <a className={LINK} href={`/api/documents?type=quote&trip=${tripId}`} target="_blank" rel="noreferrer">📄 Quote</a>
        <a className={LINK} href={`/api/documents?type=itinerary&trip=${tripId}`} target="_blank" rel="noreferrer">🗺️ Itinerary</a>
        <a className={LINK} href={`/api/documents?type=voucher&trip=${tripId}`} target="_blank" rel="noreferrer">🎫 Voucher</a>
        {shareToken && (
          <>
            <a className={LINK} href={`/trip/${shareToken}`} target="_blank" rel="noreferrer">🔗 Portal</a>
            <button onClick={copyShare} className={`${LINK} cursor-pointer`}>{copied ? '✓ Copied' : '📋 Copy link'}</button>
          </>
        )}
        <button
          disabled={pending || sent}
          onClick={() => start(async () => { await prepareQuote(tripId); setSent(true) })}
          className="rounded-md bg-magenta px-2.5 py-1 text-xs font-semibold text-white hover:bg-magenta-dark disabled:opacity-60 cursor-pointer"
        >
          {sent ? '✓ Quote sent for approval' : pending ? 'Working…' : '✉️ Quote → approval'}
        </button>
      </div>
      {hasEmail && (
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="text-xs text-slate">Email client:</span>
          <button disabled={pending} onClick={() => email('itinerary')} className={`${LINK} disabled:opacity-60 cursor-pointer`}>📧 Itinerary</button>
          <button disabled={pending} onClick={() => email('voucher')} className={`${LINK} disabled:opacity-60 cursor-pointer`}>📧 Voucher</button>
          {emailMsg && <span className="text-xs font-semibold text-success">{emailMsg}</span>}
        </div>
      )}
    </div>
  )
}
