# TourRelay — secrets & env map

> This file is **committed** and intentionally contains **no secret values** — only
> what each key is and *where the value lives*. Actual values are kept in
> git-ignored files locally and encrypted on Vercel.

## Where secret values live (all git-ignored)

| Location | What's in it | Git status |
|----------|--------------|-----------|
| `tourlink/.secrets/production.env` | **All cloud/production secrets** in one place (Supabase URL/keys/DB password, bridge secret, prod URL) | ignored (`.secrets/`) |
| `tourlink/.env.local` | Local-dev app env (local Supabase, `ANTHROPIC_API_KEY`, Formspree IDs) | ignored (`.env*`) |
| `tourlink/ops/concierge/.env` | Bridge config (APP_URL + `CONCIERGE_WA_SECRET`) | ignored (`.env*`) |
| **Vercel → project `tourrelay` → Settings → Env** | The live production values (encrypted) | n/a (cloud) |
| `tourlink.africa/tourrelay.txt`, `secrete_key.txt` | Original drops (DB password, service-role key) — **outside** the git repo | not in any repo; values now also in `.secrets/production.env`, safe to delete |

## The keys

| Key | Purpose | Set where |
|-----|---------|-----------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL | `.secrets/production.env` · Vercel |
| `SUPABASE_SERVICE_ROLE_KEY` | Server-side DB access (bypasses RLS) — **secret** | `.secrets/production.env` · Vercel |
| `SUPABASE_ANON_PUBLISHABLE_KEY` | Public/anon key (not used by the server yet) | `.secrets/production.env` |
| `SUPABASE_DB_PASSWORD` / `SUPABASE_DB_URL` | Direct Postgres (schema push / seeding) | `.secrets/production.env` |
| `ANTHROPIC_API_KEY` | Relay AI brain (Claude) — **secret** | `.env.local` · Vercel |
| `CONCIERGE_WA_SECRET` | Shared secret between the app and the WhatsApp bridge | `.secrets/production.env` · Vercel · bridge `.env` |
| `APP_MODE` | `crm` on the `tourrelay` deployment (vs unset = website) | Vercel only |
| `NEXT_PUBLIC_SITE_URL` | Public base URL for portal links | Vercel |

## Rotating a key
- **Supabase keys / DB password:** Supabase dashboard → Settings → API / Database → reset → update `.secrets/production.env` + Vercel env + re-run any seed.
- **Anthropic:** new key in console.anthropic.com → update `.env.local` + Vercel.
- **`CONCIERGE_WA_SECRET`:** generate a new random string → update Vercel + the bridge `.env` (must match).

> Anything secret must stay only in the files above (all git-ignored) or in Vercel.
> Never paste a value into a committed file, a commit message, or chat.
