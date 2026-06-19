import { redirect } from 'next/navigation'
import { isOpsAuthed } from '@/lib/ops/auth'
import { signInAction } from '@/app/ops/actions'
import { SIGN_IN_PEOPLE } from '@/lib/crm/constants'

export default async function OpsLogin({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  if (await isOpsAuthed()) redirect('/ops')
  const { error } = await searchParams
  return (
    <div className="flex min-h-[70vh] items-center justify-center">
      <form action={signInAction} className="w-full max-w-sm rounded-2xl border border-savanna bg-white p-8 shadow-card">
        <div className="mb-6 text-center">
          <div className="text-3xl">🔗</div>
          <h1 className="mt-2 font-serif text-2xl font-bold text-navy">Tour<span className="text-magenta">Relay</span></h1>
          <p className="mt-1 text-sm text-slate">The desk behind TourLink.</p>
        </div>

        <label className="mb-1.5 block text-sm font-semibold text-charcoal">You are</label>
        <select name="who" className="mb-4 w-full rounded-lg border border-savanna bg-white px-4 py-3 text-charcoal focus:outline-none focus:ring-2 focus:ring-navy">
          {SIGN_IN_PEOPLE.map((o) => (
            <option key={o} value={o}>{o}</option>
          ))}
        </select>

        <label className="mb-1.5 block text-sm font-semibold text-charcoal">Password</label>
        <input
          name="password"
          type="password"
          autoFocus
          placeholder="Team password"
          className="w-full rounded-lg border border-savanna px-4 py-3 text-charcoal focus:outline-none focus:ring-2 focus:ring-navy"
        />
        {error && <p className="mt-2 text-sm text-error">Wrong password — try again.</p>}

        <button className="mt-6 w-full rounded-lg bg-magenta px-6 py-3 font-semibold text-white hover:bg-magenta-dark cursor-pointer">
          Sign in
        </button>
      </form>
    </div>
  )
}
