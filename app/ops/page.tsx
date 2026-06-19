import Link from 'next/link'
import { redirect } from 'next/navigation'
import { isOpsAuthed } from '@/lib/ops/auth'
import { loadOps, loadActivity } from '@/lib/ops/data'
import { addEnquiry } from '@/app/ops/actions'
import { StatusControl } from '@/app/ops/_components/StatusControl'
import {
  STAGES, ACCOUNT_STATUSES, formatMoney, paymentStatus,
} from '@/lib/crm/constants'
import { daysLate } from '@/lib/concierge/state'
import type { Card } from '@/lib/crm/types'

export const dynamic = 'force-dynamic'

function Stat({ label, value, accent }: { label: string; value: string; accent?: string }) {
  return (
    <div className="rounded-xl border border-savanna bg-white px-4 py-3">
      <div className="text-2xl font-bold text-charcoal" style={accent ? { color: accent } : undefined}>{value}</div>
      <div className="text-xs font-semibold uppercase tracking-wide text-slate">{label}</div>
    </div>
  )
}

export default async function OpsBoard() {
  if (!(await isOpsAuthed())) redirect('/ops/login')
  const data = await loadOps()
  const activity = await loadActivity(20)

  if (!data.configured) {
    return (
      <div className="rounded-2xl border border-warning/40 bg-warning/10 p-8">
        <h2 className="font-serif text-xl font-bold text-charcoal">Connect Supabase to switch on the desk</h2>
        <p className="mt-2 text-sm text-slate">
          Set <code className="rounded bg-white px-1.5 py-0.5">NEXT_PUBLIC_SUPABASE_URL</code> and{' '}
          <code className="rounded bg-white px-1.5 py-0.5">SUPABASE_SERVICE_ROLE_KEY</code> in <code>.env.local</code>,
          run the migration in <code>supabase/migrations/</code>, then reload. See <code>docs/CONCIERGE.md</code>.
        </p>
      </div>
    )
  }

  const { accounts, cards, trips, payments } = data
  const accName = (c: Card) => (c.account_id && accounts.find((a) => a.id === c.account_id)?.name) || '—'

  const open = cards.filter((c) => c.outcome === 'open')
  const won = cards.filter((c) => c.outcome === 'won')
  const openVal = open.reduce((s, c) => s + (c.value || 0), 0)
  const wonVal = won.reduce((s, c) => s + (c.value || 0), 0)
  const overdue = open.filter((c) => (daysLate(c.due) ?? -1) > 0).length
  const activeClients = accounts.filter((a) => a.status === 'active').length
  const outstanding = payments.filter((p) => p.status !== 'paid').reduce((s, p) => s + (p.amount || 0), 0)

  const empty = cards.length === 0 && accounts.length === 0

  return (
    <div className="space-y-8">
      {/* Stat strip */}
      <section className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        <Stat label="Open enquiries" value={String(open.length)} />
        <Stat label="Pipeline value" value={formatMoney(openVal)} />
        <Stat label="Booked value" value={formatMoney(wonVal)} accent="#4A7C59" />
        <Stat label="Active clients" value={String(activeClients)} />
        <Stat label="Payments due" value={formatMoney(outstanding)} accent={outstanding ? '#B33A3A' : undefined} />
        <Stat label="Overdue" value={String(overdue)} accent={overdue ? '#B33A3A' : undefined} />
      </section>

      {/* Quick add */}
      <form action={addEnquiry} className="flex flex-wrap items-center gap-2 rounded-xl border border-savanna bg-white p-3">
        <span className="text-sm font-semibold text-navy">➕ New enquiry</span>
        <input name="client" placeholder="Client name" required
          className="min-w-40 flex-1 rounded-lg border border-savanna px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-navy" />
        <input name="title" placeholder="What they want (optional)"
          className="min-w-40 flex-[2] rounded-lg border border-savanna px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-navy" />
        <button className="rounded-lg bg-magenta px-4 py-2 text-sm font-semibold text-white hover:bg-magenta-dark cursor-pointer">Add</button>
      </form>

      {empty && (
        <div className="rounded-2xl border border-savanna bg-white p-8 text-center">
          <div className="text-3xl">🔗</div>
          <h2 className="mt-2 font-serif text-xl font-bold text-charcoal">The desk is empty — for now</h2>
          <p className="mt-2 text-sm text-slate">
            Add an enquiry above, or text <strong>Relay</strong> on WhatsApp — <strong>“enquiry Ambassador Saddam: Zimbabwe cultural tour for 4”</strong>.
            It’ll appear here instantly.
          </p>
        </div>
      )}

      {/* Pipeline kanban */}
      {!empty && (
        <section>
          <h2 className="mb-3 font-serif text-xl font-bold text-charcoal">Pipeline</h2>
          <div className="flex gap-3 overflow-x-auto pb-3">
            {STAGES.map((stage) => {
              const col = open.concat(won).filter((c) => c.stage === stage.id && c.outcome !== 'lost')
              const colVal = col.reduce((s, c) => s + (c.value || 0), 0)
              return (
                <div key={stage.id} className="w-64 shrink-0">
                  <div className="mb-2 flex items-center justify-between rounded-lg px-2 py-1.5"
                    style={{ backgroundColor: `${stage.accent}14` }}>
                    <span className="flex items-center gap-2 text-sm font-bold text-charcoal">
                      <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: stage.accent }} />
                      {stage.title}
                    </span>
                    <span className="text-xs font-semibold text-slate">{col.length}{colVal ? ` · ${formatMoney(colVal)}` : ''}</span>
                  </div>
                  <div className="space-y-2">
                    {col.map((c) => {
                      const late = daysLate(c.due)
                      return (
                        <div key={c.id} className="rounded-xl border border-savanna bg-white p-3 shadow-card">
                          <Link href={`/ops/accounts/${c.account_id}`} className="block">
                            <div className="text-sm font-semibold text-charcoal hover:text-magenta">{c.title}</div>
                            <div className="mt-0.5 text-xs text-slate">{accName(c)}</div>
                          </Link>
                          <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-slate">
                            {c.value ? <span className="font-semibold text-charcoal">{formatMoney(c.value)}</span> : null}
                            {c.pax ? <span>· {c.pax} pax</span> : null}
                            {c.priority === 'VIP' ? <span className="font-bold text-magenta">⭐ VIP</span> : null}
                            {(late ?? -1) > 0 ? <span className="font-semibold text-error">⏰ {late}d</span> : null}
                          </div>
                          <div className="mt-2 flex items-center justify-between gap-1">
                            <StatusControl kind="owner" id={c.id} value={c.owner_name} />
                            <StatusControl kind="stage" id={c.id} value={c.stage} />
                          </div>
                        </div>
                      )
                    })}
                    {col.length === 0 && <div className="rounded-lg border border-dashed border-savanna py-4 text-center text-xs text-slate">—</div>}
                  </div>
                </div>
              )
            })}
          </div>
        </section>
      )}

      {/* Clients */}
      <section id="clients">
        <h2 className="mb-3 font-serif text-xl font-bold text-charcoal">Clients</h2>
        <div className="overflow-hidden rounded-xl border border-savanna bg-white">
          <table className="w-full text-sm">
            <thead className="bg-sand text-left text-xs uppercase tracking-wide text-slate">
              <tr>
                <th className="px-4 py-2 font-semibold">Client</th>
                <th className="px-4 py-2 font-semibold">Status</th>
                <th className="hidden px-4 py-2 font-semibold sm:table-cell">Owner</th>
                <th className="hidden px-4 py-2 font-semibold sm:table-cell">Enquiries</th>
                <th className="hidden px-4 py-2 font-semibold sm:table-cell">Trips</th>
              </tr>
            </thead>
            <tbody>
              {[...accounts].sort((a, b) => {
                const order = ACCOUNT_STATUSES.map((s) => s.id)
                return order.indexOf(a.status) - order.indexOf(b.status)
              }).map((a) => (
                <tr key={a.id} className="border-t border-savanna hover:bg-sand/50">
                  <td className="px-4 py-2.5">
                    <Link href={`/ops/accounts/${a.id}`} className="font-semibold text-charcoal hover:text-magenta">
                      {a.vip ? '⭐ ' : ''}{a.name}
                    </Link>
                    {a.country ? <span className="ml-2 text-xs text-slate">{a.country}</span> : null}
                  </td>
                  <td className="px-4 py-2.5"><StatusControl kind="account" id={a.id} value={a.status} /></td>
                  <td className="hidden px-4 py-2.5 text-slate sm:table-cell">{a.owner_name}</td>
                  <td className="hidden px-4 py-2.5 text-slate sm:table-cell">{cards.filter((c) => c.account_id === a.id).length}</td>
                  <td className="hidden px-4 py-2.5 text-slate sm:table-cell">{trips.filter((t) => t.account_id === a.id).length}</td>
                </tr>
              ))}
              {accounts.length === 0 && (
                <tr><td colSpan={5} className="px-4 py-6 text-center text-slate">No clients yet.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      {/* Payments due */}
      {payments.some((p) => p.status !== 'paid') && (
        <section>
          <h2 className="mb-3 font-serif text-xl font-bold text-charcoal">Payments due</h2>
          <div className="space-y-2">
            {payments.filter((p) => p.status !== 'paid')
              .sort((a, b) => (daysLate(b.due_date) ?? -999) - (daysLate(a.due_date) ?? -999))
              .map((p) => {
                const trip = trips.find((t) => t.id === p.trip_id)
                const late = daysLate(p.due_date)
                return (
                  <div key={p.id} className="flex items-center justify-between rounded-xl border border-savanna bg-white px-4 py-3">
                    <div>
                      <span className="font-semibold text-charcoal">{p.label}</span>
                      <span className="ml-2 text-sm text-slate">{trip?.name}</span>
                      {(late ?? -1) > 0 ? <span className="ml-2 text-xs font-semibold text-error">⏰ {late}d late</span> : null}
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="font-bold text-charcoal">{formatMoney(p.amount)}</span>
                      <span className="rounded-full px-2 py-0.5 text-xs font-semibold text-white" style={{ backgroundColor: paymentStatus(p.status).color }}>
                        {paymentStatus(p.status).label}
                      </span>
                    </div>
                  </div>
                )
              })}
          </div>
        </section>
      )}

      {/* Activity */}
      <section id="activity">
        <h2 className="mb-3 font-serif text-xl font-bold text-charcoal">Activity</h2>
        <div className="rounded-xl border border-savanna bg-white divide-y divide-savanna">
          {activity.map((a) => (
            <div key={a.id} className="flex items-baseline gap-2 px-4 py-2 text-sm">
              <span className="font-semibold text-navy">{a.actor_name}</span>
              <span className="text-slate">{a.verb}</span>
              <span className="font-semibold text-charcoal">{a.subject}</span>
              {a.detail ? <span className="text-slate">— {a.detail}</span> : null}
              <span className="ml-auto whitespace-nowrap text-xs text-slate">{new Date(a.created_at).toLocaleString('en-GB', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}</span>
            </div>
          ))}
          {activity.length === 0 && <div className="px-4 py-6 text-center text-slate">No activity yet.</div>}
        </div>
      </section>
    </div>
  )
}
