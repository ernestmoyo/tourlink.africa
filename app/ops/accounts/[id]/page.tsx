import Link from 'next/link'
import { notFound, redirect } from 'next/navigation'
import { isOpsAuthed } from '@/lib/ops/auth'
import { loadOps } from '@/lib/ops/data'
import { addTrip, addTripFromPackage, seedPaymentPlanAction, updateAccount, updateTrip } from '@/app/ops/actions'
import { StatusControl } from '@/app/ops/_components/StatusControl'
import { DocActions } from '@/app/ops/_components/DocActions'
import {
  formatMoney, accountStatus, tripStatus, ACCOUNT_KINDS, ACCOUNT_STATUSES, TRIP_STATUSES,
} from '@/lib/crm/constants'
import { daysLate } from '@/lib/concierge/state'
import { packageOptions } from '@/lib/crm/packages'

export const dynamic = 'force-dynamic'

export default async function AccountDetail({ params }: { params: Promise<{ id: string }> }) {
  if (!(await isOpsAuthed())) redirect('/ops/login')
  const { id } = await params
  const data = await loadOps()
  const account = data.accounts.find((a) => a.id === id)
  if (!account) notFound()

  const enquiries = data.cards.filter((c) => c.account_id === id)
  const trips = data.trips.filter((t) => t.account_id === id)
  const pkgs = packageOptions()

  return (
    <div className="space-y-8">
      <Link href="/ops" className="text-sm font-semibold text-slate hover:text-navy">← Pipeline</Link>

      {/* Account header */}
      <div className="rounded-2xl border border-savanna bg-white p-6">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h1 className="font-serif text-2xl font-bold text-charcoal">
              {account.vip ? '⭐ ' : ''}{account.name}
            </h1>
            <p className="mt-1 text-sm text-slate">
              {accountStatus(account.status).label}
              {account.country ? ` · ${account.country}` : ''}
              {account.kind ? ` · ${account.kind}` : ''}
              {account.source ? ` · via ${account.source}` : ''}
            </p>
            <p className="mt-1 text-sm text-slate">
              {account.contact_phone ? `📞 ${account.contact_phone}` : ''}
              {account.contact_email ? `  ✉️ ${account.contact_email}` : ''}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold uppercase text-slate">Status</span>
            <StatusControl kind="account" id={account.id} value={account.status} />
          </div>
        </div>
        {account.notes ? <p className="mt-4 whitespace-pre-wrap rounded-lg bg-sand p-3 text-sm text-charcoal">{account.notes}</p> : null}

        <details className="mt-4">
          <summary className="cursor-pointer text-sm font-semibold text-navy hover:text-magenta">✏️ Edit details</summary>
          <form action={updateAccount} className="mt-3 grid gap-3 sm:grid-cols-2">
            <input type="hidden" name="account_id" value={account.id} />
            <label className="text-xs font-semibold text-slate">Name
              <input name="name" defaultValue={account.name} required className="mt-1 w-full rounded-lg border border-savanna px-3 py-2 text-sm text-charcoal focus:outline-none focus:ring-2 focus:ring-navy" />
            </label>
            <label className="text-xs font-semibold text-slate">Type
              <select name="kind" defaultValue={account.kind} className="mt-1 w-full rounded-lg border border-savanna bg-white px-3 py-2 text-sm text-charcoal focus:outline-none focus:ring-2 focus:ring-navy">
                {ACCOUNT_KINDS.map((k) => <option key={k.id} value={k.id}>{k.label}</option>)}
              </select>
            </label>
            <label className="text-xs font-semibold text-slate">Status
              <select name="status" defaultValue={account.status} className="mt-1 w-full rounded-lg border border-savanna bg-white px-3 py-2 text-sm text-charcoal focus:outline-none focus:ring-2 focus:ring-navy">
                {ACCOUNT_STATUSES.map((s) => <option key={s.id} value={s.id}>{s.label}</option>)}
              </select>
            </label>
            <label className="text-xs font-semibold text-slate">Country
              <input name="country" defaultValue={account.country ?? ''} className="mt-1 w-full rounded-lg border border-savanna px-3 py-2 text-sm text-charcoal focus:outline-none focus:ring-2 focus:ring-navy" />
            </label>
            <label className="text-xs font-semibold text-slate">Contact phone
              <input name="contact_phone" defaultValue={account.contact_phone ?? ''} placeholder="+255…" className="mt-1 w-full rounded-lg border border-savanna px-3 py-2 text-sm text-charcoal focus:outline-none focus:ring-2 focus:ring-navy" />
            </label>
            <label className="text-xs font-semibold text-slate">Contact email
              <input name="contact_email" type="email" defaultValue={account.contact_email ?? ''} placeholder="for emailed quotes" className="mt-1 w-full rounded-lg border border-savanna px-3 py-2 text-sm text-charcoal focus:outline-none focus:ring-2 focus:ring-navy" />
            </label>
            <label className="text-xs font-semibold text-slate sm:col-span-2">Notes
              <textarea name="notes" defaultValue={account.notes ?? ''} rows={2} className="mt-1 w-full rounded-lg border border-savanna px-3 py-2 text-sm text-charcoal focus:outline-none focus:ring-2 focus:ring-navy" />
            </label>
            <label className="flex items-center gap-2 text-sm text-charcoal">
              <input type="checkbox" name="vip" defaultChecked={account.vip} className="h-4 w-4" /> ⭐ VIP
            </label>
            <div className="sm:col-span-2">
              <button className="rounded-lg bg-magenta px-4 py-2 text-sm font-semibold text-white hover:bg-magenta-dark cursor-pointer">Save</button>
            </div>
          </form>
        </details>
      </div>

      {/* Enquiries */}
      <section>
        <h2 className="mb-3 font-serif text-xl font-bold text-charcoal">Enquiries</h2>
        <div className="space-y-2">
          {enquiries.map((c) => {
            const late = daysLate(c.due)
            return (
              <div key={c.id} className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-savanna bg-white px-4 py-3">
                <div>
                  <div className="font-semibold text-charcoal">{c.title}</div>
                  <div className="text-xs text-slate">
                    {c.type} · {c.owner_name}
                    {c.value ? ` · ${formatMoney(c.value)}` : ''}
                    {c.pax ? ` · ${c.pax} pax` : ''}
                    {(late ?? -1) > 0 ? ` · ⏰ ${late}d late` : ''}
                    {c.outcome === 'lost' ? ` · ✕ lost${c.outcome_reason ? ` (${c.outcome_reason})` : ''}` : ''}
                  </div>
                </div>
                <div className="flex items-center gap-1.5">
                  <StatusControl kind="owner" id={c.id} value={c.owner_name} />
                  <StatusControl kind="stage" id={c.id} value={c.stage} />
                </div>
              </div>
            )
          })}
          {enquiries.length === 0 && <p className="text-sm text-slate">No enquiries yet.</p>}
        </div>
      </section>

      {/* Trips (Tier 2) */}
      <section>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="font-serif text-xl font-bold text-charcoal">Trips</h2>
        </div>

        <div className="mb-4 grid gap-3 lg:grid-cols-2">
          <form action={addTrip} className="flex flex-wrap items-center gap-2 rounded-xl border border-savanna bg-white p-3">
            <input type="hidden" name="account_id" value={account.id} />
            <span className="text-sm font-semibold text-navy">🧳 Blank trip</span>
            <input name="name" placeholder="e.g. Vic Falls + Hwange — Aug 2026" required
              className="min-w-40 flex-1 rounded-lg border border-savanna px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-navy" />
            <button className="rounded-lg bg-magenta px-4 py-2 text-sm font-semibold text-white hover:bg-magenta-dark cursor-pointer">Add</button>
          </form>

          <form action={addTripFromPackage} className="flex flex-wrap items-center gap-2 rounded-xl border border-savanna bg-white p-3">
            <input type="hidden" name="account_id" value={account.id} />
            <span className="text-sm font-semibold text-navy">📦 From package</span>
            <select name="package" required className="min-w-36 flex-1 rounded-lg border border-savanna px-2 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-navy">
              {pkgs.map((p) => <option key={p.slug} value={p.slug}>{p.name} ({p.nights}n · ${p.priceFrom})</option>)}
            </select>
            <input name="pax" type="number" min={1} placeholder="pax" className="w-16 rounded-lg border border-savanna px-2 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-navy" />
            <input name="start_date" type="date" className="rounded-lg border border-savanna px-2 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-navy" />
            <button className="rounded-lg bg-navy px-4 py-2 text-sm font-semibold text-white hover:bg-navy-dark cursor-pointer">Build</button>
          </form>
        </div>

        <div className="space-y-4">
          {trips.map((t) => {
            const segs = data.segments.filter((s) => s.trip_id === t.id).sort((a, b) => a.sort - b.sort)
            const pays = data.payments.filter((p) => p.trip_id === t.id).sort((a, b) => a.sort - b.sort)
            const docs = data.docs.filter((d) => d.trip_id === t.id).sort((a, b) => a.sort - b.sort)
            const paid = pays.filter((p) => p.status === 'paid').reduce((s, p) => s + (p.amount || 0), 0)
            return (
              <div key={t.id} className="rounded-2xl border border-savanna bg-white p-5">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <h3 className="font-serif text-lg font-bold text-charcoal">{t.name}</h3>
                    <p className="text-xs text-slate">
                      {t.destinations.length ? `${t.destinations.join(' · ')} · ` : ''}
                      {t.pax ? `${t.pax} pax · ` : ''}
                      {t.start_date ? `${t.start_date}${t.end_date ? ` → ${t.end_date}` : ''}` : 'dates TBC'}
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-charcoal">{formatMoney(t.value)}</div>
                    <span className="rounded-full px-2 py-0.5 text-xs font-semibold text-white" style={{ backgroundColor: tripStatus(t.status).color }}>
                      {tripStatus(t.status).label}
                    </span>
                  </div>
                </div>

                <div className="mt-3 border-t border-savanna pt-3">
                  <DocActions tripId={t.id} hasEmail={!!account.contact_email} shareToken={t.share_token} />
                </div>

                <details className="mt-3">
                  <summary className="cursor-pointer text-xs font-semibold text-navy hover:text-magenta">✏️ Edit trip</summary>
                  <form action={updateTrip} className="mt-2 grid gap-2 sm:grid-cols-2">
                    <input type="hidden" name="trip_id" value={t.id} />
                    <input type="hidden" name="account_id" value={account.id} />
                    <label className="text-xs font-semibold text-slate sm:col-span-2">Name
                      <input name="name" defaultValue={t.name} className="mt-1 w-full rounded-lg border border-savanna px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-navy" />
                    </label>
                    <label className="text-xs font-semibold text-slate">Status
                      <select name="status" defaultValue={t.status} className="mt-1 w-full rounded-lg border border-savanna bg-white px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-navy">
                        {Object.entries(TRIP_STATUSES).map(([id, v]) => <option key={id} value={id}>{v.label}</option>)}
                      </select>
                    </label>
                    <label className="text-xs font-semibold text-slate">Value (USD)
                      <input name="value" type="number" min={0} defaultValue={t.value || ''} className="mt-1 w-full rounded-lg border border-savanna px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-navy" />
                    </label>
                    <label className="text-xs font-semibold text-slate">Start date
                      <input name="start_date" type="date" defaultValue={t.start_date ?? ''} className="mt-1 w-full rounded-lg border border-savanna px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-navy" />
                    </label>
                    <label className="text-xs font-semibold text-slate">End date
                      <input name="end_date" type="date" defaultValue={t.end_date ?? ''} className="mt-1 w-full rounded-lg border border-savanna px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-navy" />
                    </label>
                    <label className="text-xs font-semibold text-slate">Travellers
                      <input name="pax" type="number" min={1} defaultValue={t.pax ?? ''} className="mt-1 w-full rounded-lg border border-savanna px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-navy" />
                    </label>
                    <label className="text-xs font-semibold text-slate">Destinations (comma-sep)
                      <input name="destinations" defaultValue={t.destinations.join(', ')} className="mt-1 w-full rounded-lg border border-savanna px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-navy" />
                    </label>
                    <div className="sm:col-span-2">
                      <button className="rounded-lg bg-navy px-4 py-1.5 text-sm font-semibold text-white hover:bg-navy-dark cursor-pointer">Save trip</button>
                    </div>
                  </form>
                </details>

                <div className="mt-4 grid gap-4 lg:grid-cols-3">
                  {/* Segments */}
                  <div>
                    <div className="mb-1.5 text-xs font-bold uppercase tracking-wide text-slate">Itinerary</div>
                    <div className="space-y-1.5">
                      {segs.map((s) => (
                        <div key={s.id} className="flex items-center justify-between gap-2 text-sm">
                          <span className="text-charcoal">{s.name}{s.nights ? ` · ${s.nights}n` : ''}</span>
                          <span className="flex items-center gap-2">
                            <span className="text-xs text-slate">{formatMoney(s.value)}</span>
                            <StatusControl kind="segment" id={s.id} value={s.status} />
                          </span>
                        </div>
                      ))}
                      {segs.length === 0 && <p className="text-xs text-slate">No segments yet. Add via WhatsApp: “add Hwange 2 nights 4200 to {t.name}”.</p>}
                    </div>
                  </div>

                  {/* Payments */}
                  <div>
                    <div className="mb-1.5 text-xs font-bold uppercase tracking-wide text-slate">
                      Payments {pays.length ? `· ${formatMoney(paid)}/${formatMoney(t.value)} paid` : ''}
                    </div>
                    <div className="space-y-1.5">
                      {pays.map((p) => (
                        <div key={p.id} className="flex items-center justify-between gap-2 text-sm">
                          <span className="text-charcoal">{p.label} · {formatMoney(p.amount)}</span>
                          <StatusControl kind="payment" id={p.id} value={p.status} />
                        </div>
                      ))}
                      {pays.length === 0 && (
                        t.value > 0 ? (
                          <form action={seedPaymentPlanAction}>
                            <input type="hidden" name="trip_id" value={t.id} />
                            <button className="rounded-md border border-savanna bg-white px-2.5 py-1 text-xs font-semibold text-navy hover:bg-sand cursor-pointer">＋ 30/70 plan</button>
                          </form>
                        ) : <p className="text-xs text-slate">Set a trip value to add a payment plan.</p>
                      )}
                    </div>
                  </div>

                  {/* Checklist */}
                  <div>
                    <div className="mb-1.5 text-xs font-bold uppercase tracking-wide text-slate">Checklist</div>
                    <div className="space-y-1.5">
                      {docs.map((d) => (
                        <div key={d.id} className="flex items-center justify-between gap-2 text-sm">
                          <span className="text-charcoal">{d.code ? `${d.code}. ` : ''}{d.label}</span>
                          <StatusControl kind="doc" id={d.id} value={d.status} />
                        </div>
                      ))}
                      {docs.length === 0 && <p className="text-xs text-slate">No checklist.</p>}
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
          {trips.length === 0 && <p className="text-sm text-slate">No trips yet — add one above, or let the concierge build it from WhatsApp.</p>}
        </div>
      </section>
    </div>
  )
}
