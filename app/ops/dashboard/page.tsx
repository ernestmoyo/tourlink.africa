import { redirect } from 'next/navigation'
import { isOpsAuthed } from '@/lib/ops/auth'
import { loadOps } from '@/lib/ops/data'
import { STAGES, STAGE_WEIGHT, ENQUIRY_SOURCES, formatMoney, type StageId } from '@/lib/crm/constants'
import { daysLate } from '@/lib/concierge/state'

export const dynamic = 'force-dynamic'

function Stat({ label, value, accent, hint }: { label: string; value: string; accent?: string; hint?: string }) {
  return (
    <div className="rounded-xl border border-savanna bg-white px-4 py-3">
      <div className="text-2xl font-bold" style={{ color: accent ?? '#2C2C2C' }}>{value}</div>
      <div className="text-xs font-semibold uppercase tracking-wide text-slate">{label}</div>
      {hint ? <div className="mt-0.5 text-xs text-slate">{hint}</div> : null}
    </div>
  )
}

function Bar({ label, count, value, pct, color }: { label: string; count: number; value: string; pct: number; color: string }) {
  return (
    <div>
      <div className="mb-1 flex items-center justify-between text-sm">
        <span className="font-semibold text-charcoal">{label}</span>
        <span className="text-slate">{count}{value ? ` · ${value}` : ''}</span>
      </div>
      <div className="h-2.5 w-full rounded-full bg-sand">
        <div className="h-2.5 rounded-full" style={{ width: `${Math.max(2, pct)}%`, backgroundColor: color }} />
      </div>
    </div>
  )
}

export default async function OpsDashboard() {
  if (!(await isOpsAuthed())) redirect('/ops/login')
  const data = await loadOps()
  if (!data.configured) redirect('/ops')

  const { accounts, cards, trips, payments } = data
  const open = cards.filter((c) => c.outcome === 'open')
  const won = cards.filter((c) => c.outcome === 'won')
  const lost = cards.filter((c) => c.outcome === 'lost')
  const decided = won.length + lost.length

  const openVal = open.reduce((s, c) => s + (c.value || 0), 0)
  const wonVal = won.reduce((s, c) => s + (c.value || 0), 0)
  const forecast = open.reduce((s, c) => s + (c.value || 0) * (STAGE_WEIGHT[c.stage as StageId] ?? 0), 0)
  const conversion = decided ? Math.round((won.length / decided) * 100) : 0

  const outstanding = payments.filter((p) => p.status !== 'paid').reduce((s, p) => s + (p.amount || 0), 0)
  const collected = payments.filter((p) => p.status === 'paid').reduce((s, p) => s + (p.amount || 0), 0)
  const overduePay = payments.filter((p) => p.status !== 'paid' && (daysLate(p.due_date) ?? -1) > 0)

  const activeClients = accounts.filter((a) => a.status === 'active').length
  const vipClients = accounts.filter((a) => a.vip).length

  // Pipeline funnel — open + won counts per stage.
  const live = cards.filter((c) => c.outcome !== 'lost')
  const byStage = STAGES.map((s) => {
    const col = live.filter((c) => c.stage === s.id)
    return { stage: s, count: col.length, value: col.reduce((t, c) => t + (c.value || 0), 0) }
  })
  const maxStage = Math.max(1, ...byStage.map((b) => b.count))

  // Source of business — across all cards.
  const bySource = ENQUIRY_SOURCES.map((src) => ({
    src, count: cards.filter((c) => c.source === src).length,
  })).filter((s) => s.count > 0).sort((a, b) => b.count - a.count)
  const maxSource = Math.max(1, ...bySource.map((s) => s.count))

  // Upcoming departures (next 60 days, not completed/cancelled).
  const today = new Date(new Date().toDateString()).getTime()
  const departures = trips
    .filter((t) => t.status !== 'completed' && t.status !== 'cancelled' && t.start_date)
    .map((t) => ({ t, d: Math.round((new Date(t.start_date + 'T00:00').getTime() - today) / 86400000) }))
    .filter((x) => x.d >= -3 && x.d <= 60)
    .sort((a, b) => a.d - b.d)

  return (
    <div className="space-y-8">
      <h1 className="font-serif text-2xl font-bold text-charcoal">Dashboard</h1>

      <section className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        <Stat label="Open enquiries" value={String(open.length)} hint={formatMoney(openVal)} />
        <Stat label="Weighted forecast" value={formatMoney(forecast)} accent="#2B6A7C" />
        <Stat label="Booked value" value={formatMoney(wonVal)} accent="#4A7C59" />
        <Stat label="Conversion" value={`${conversion}%`} hint={`${won.length}✓ · ${lost.length}✕`} />
        <Stat label="Cash collected" value={formatMoney(collected)} accent="#4A7C59" />
        <Stat label="Outstanding" value={formatMoney(outstanding)} accent={outstanding ? '#B33A3A' : undefined} hint={overduePay.length ? `${overduePay.length} overdue` : 'on track'} />
      </section>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Pipeline funnel */}
        <section className="rounded-2xl border border-savanna bg-white p-5">
          <h2 className="mb-4 font-serif text-lg font-bold text-navy">Pipeline by stage</h2>
          <div className="space-y-3">
            {byStage.map((b) => (
              <Bar key={b.stage.id} label={b.stage.title} count={b.count} value={b.value ? formatMoney(b.value) : ''} pct={(b.count / maxStage) * 100} color={b.stage.accent} />
            ))}
          </div>
        </section>

        {/* Source of business */}
        <section className="rounded-2xl border border-savanna bg-white p-5">
          <h2 className="mb-4 font-serif text-lg font-bold text-navy">Source of business</h2>
          {bySource.length === 0 ? (
            <p className="text-sm text-slate">No enquiries yet.</p>
          ) : (
            <div className="space-y-3">
              {bySource.map((s, i) => (
                <Bar key={s.src} label={s.src} count={s.count} value="" pct={(s.count / maxSource) * 100} color={['#C2185B', '#2B6A7C', '#C9A84C', '#5C6B4F', '#2B3990', '#9B1348'][i % 6]} />
              ))}
            </div>
          )}
          <div className="mt-5 flex gap-6 border-t border-savanna pt-4 text-sm">
            <div><span className="font-bold text-charcoal">{activeClients}</span> <span className="text-slate">active clients</span></div>
            <div><span className="font-bold text-charcoal">{vipClients}</span> <span className="text-slate">⭐ VIP</span></div>
            <div><span className="font-bold text-charcoal">{accounts.length}</span> <span className="text-slate">total</span></div>
          </div>
        </section>
      </div>

      {/* Upcoming departures */}
      <section className="rounded-2xl border border-savanna bg-white p-5">
        <h2 className="mb-4 font-serif text-lg font-bold text-navy">Upcoming departures (next 60 days)</h2>
        {departures.length === 0 ? (
          <p className="text-sm text-slate">No departures scheduled in the next 60 days.</p>
        ) : (
          <div className="space-y-2">
            {departures.map(({ t, d }) => (
              <div key={t.id} className="flex items-center justify-between rounded-lg border border-savanna px-4 py-2.5 text-sm">
                <span className="font-semibold text-charcoal">{t.name}</span>
                <span className="text-slate">
                  {t.pax ? `${t.pax} pax · ` : ''}
                  {d < 0 ? `travelling (day ${Math.abs(d)})` : d === 0 ? 'departs today ✈️' : `in ${d} day${d === 1 ? '' : 's'}`}
                </span>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
