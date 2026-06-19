import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { loadTripByToken } from '@/lib/portal/data'
import { formatMoney, tripStatus, paymentStatus, segmentStatus } from '@/lib/crm/constants'

export const dynamic = 'force-dynamic'
export const metadata: Metadata = { title: 'Your Trip · TourLink', robots: { index: false, follow: false } }

export default async function TripPortal({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params
  const data = await loadTripByToken(token)
  if (!data) notFound()
  const { trip, accountName, segments, payments, docs } = data

  const total = trip.value || segments.reduce((s, x) => s + (x.value || 0), 0)
  const paid = payments.filter((p) => p.status === 'paid').reduce((s, p) => s + (p.amount || 0), 0)
  const outstanding = payments.filter((p) => p.status !== 'paid').reduce((s, p) => s + (p.amount || 0), 0)
  const checklistDone = docs.filter((d) => d.status === 'delivered' || d.status === 'ready').length

  return (
    <div className="min-h-screen bg-sand">
      {/* Branded header */}
      <header className="border-b-4 border-gold bg-navy">
        <div className="mx-auto max-w-3xl px-5 py-6">
          <div className="font-serif text-2xl font-bold text-white">TourLink</div>
          <div className="text-xs text-white/70">Linking you to the World</div>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-5 py-8">
        <p className="text-slate">Hello {accountName},</p>
        <h1 className="mt-1 font-serif text-3xl font-bold text-charcoal">{trip.name}</h1>
        <div className="mt-2 flex flex-wrap items-center gap-2 text-sm text-slate">
          {trip.destinations.length ? <span>📍 {trip.destinations.join(' · ')}</span> : null}
          {trip.pax ? <span>· 👥 {trip.pax}</span> : null}
          {trip.start_date ? <span>· 🗓️ {trip.start_date}{trip.end_date ? ` → ${trip.end_date}` : ''}</span> : null}
          <span className="rounded-full px-2 py-0.5 text-xs font-semibold text-white" style={{ backgroundColor: tripStatus(trip.status).color }}>
            {tripStatus(trip.status).label}
          </span>
        </div>

        {/* Day-by-day plan (if authored / from a package) */}
        {trip.itinerary && trip.itinerary.length > 0 && (
          <section className="mt-8">
            <h2 className="mb-3 font-serif text-xl font-bold text-navy">Day by day</h2>
            <ol className="space-y-3">
              {trip.itinerary.map((day) => (
                <li key={day.day} className="rounded-xl border border-savanna bg-white px-4 py-3">
                  <div className="font-semibold text-charcoal">Day {day.day} · {day.title}</div>
                  <div className="text-xs text-slate">
                    {[day.destination, day.accommodation ? `Stay: ${day.accommodation}` : '', (day.meals && day.meals.length) ? `Meals: ${day.meals.join('/')}` : ''].filter(Boolean).join(' · ')}
                  </div>
                  {day.description ? <p className="mt-1.5 text-sm text-charcoal">{day.description}</p> : null}
                </li>
              ))}
            </ol>
          </section>
        )}

        {/* Itinerary (services) */}
        <section className="mt-8">
          <h2 className="mb-3 font-serif text-xl font-bold text-navy">{trip.itinerary?.length ? 'Your services' : 'Your itinerary'}</h2>
          <div className="space-y-2">
            {segments.map((s) => (
              <div key={s.id} className="flex items-center justify-between rounded-xl border border-savanna bg-white px-4 py-3">
                <div>
                  <div className="font-semibold text-charcoal">{s.name}</div>
                  {s.nights ? <div className="text-xs text-slate">{s.nights} night{s.nights === 1 ? '' : 's'}</div> : null}
                </div>
                <span className="rounded-full px-2 py-0.5 text-xs font-semibold text-white" style={{ backgroundColor: segmentStatus(s.status).color }}>
                  {segmentStatus(s.status).label}
                </span>
              </div>
            ))}
            {segments.length === 0 && <p className="text-sm text-slate">Your detailed itinerary is being finalised — we&apos;ll update this page as it firms up.</p>}
          </div>
        </section>

        {/* Payments */}
        {payments.length > 0 && (
          <section className="mt-8">
            <h2 className="mb-3 font-serif text-xl font-bold text-navy">Payments</h2>
            <div className="rounded-xl border border-savanna bg-white">
              {payments.map((p) => (
                <div key={p.id} className="flex items-center justify-between border-b border-savanna px-4 py-3 last:border-0">
                  <div>
                    <span className="font-semibold text-charcoal">{p.label}</span>
                    {p.due_date && p.status !== 'paid' ? <span className="ml-2 text-xs text-slate">due {p.due_date}</span> : null}
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-bold text-charcoal">{formatMoney(p.amount)}</span>
                    <span className="rounded-full px-2 py-0.5 text-xs font-semibold text-white" style={{ backgroundColor: paymentStatus(p.status).color }}>
                      {paymentStatus(p.status).label}
                    </span>
                  </div>
                </div>
              ))}
              <div className="flex items-center justify-between bg-sand px-4 py-3 text-sm">
                <span className="font-semibold text-navy">Total {formatMoney(total)}</span>
                <span className="text-slate">Paid {formatMoney(paid)} · <span className={outstanding ? 'font-semibold text-magenta' : ''}>Outstanding {formatMoney(outstanding)}</span></span>
              </div>
            </div>
          </section>
        )}

        {/* Documents */}
        <section className="mt-8">
          <h2 className="mb-3 font-serif text-xl font-bold text-navy">Documents</h2>
          <div className="flex flex-wrap gap-2">
            <a className="rounded-lg bg-navy px-4 py-2 text-sm font-semibold text-white hover:bg-navy-dark" href={`/api/trip/${token}/doc?type=itinerary`} target="_blank" rel="noreferrer">🗺️ Download itinerary</a>
            <a className="rounded-lg border border-navy px-4 py-2 text-sm font-semibold text-navy hover:bg-navy hover:text-white" href={`/api/trip/${token}/doc?type=voucher`} target="_blank" rel="noreferrer">🎫 Download voucher</a>
          </div>
          {docs.length > 0 && <p className="mt-3 text-xs text-slate">Trip checklist: {checklistDone}/{docs.length} ready.</p>}
        </section>

        {/* Contact */}
        <section className="mt-10 rounded-2xl border border-savanna bg-white p-5 text-center">
          <p className="text-sm text-slate">Questions about your trip?</p>
          <a href="https://wa.me/255767898469" className="mt-2 inline-block rounded-lg bg-magenta px-5 py-2.5 font-semibold text-white hover:bg-magenta-dark">
            💬 Message us on WhatsApp
          </a>
        </section>

        <p className="mt-8 text-center text-xs text-slate">TourLink · info@tourlink.africa · +255 767 898 469</p>
      </main>
    </div>
  )
}
