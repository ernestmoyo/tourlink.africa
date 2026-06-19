# TourRelay — Production deploy runbook

Three pieces:

```
   ┌──────────────┐        ┌─────────────────┐        ┌──────────────────────┐
   │  Vercel app  │◀──────▶│  Supabase Cloud │        │  Local WhatsApp       │
   │ (Next.js +   │  data  │  (Postgres +    │        │  bridge (your phone   │
   │  Relay API)  │        │   Storage)      │        │  number + Chromium)   │
   └──────┬───────┘        └─────────────────┘        └──────────┬───────────┘
          │  https /api/whatsapp/ingest + /outbox                │
          └──────────────────────────────────────────────────────┘
```

- **Vercel** hosts the Next.js app + the Relay API (`/api/whatsapp/*`, `/ops`, `/trip`).
- **Supabase Cloud** is the database + document storage (the local stack was dev only).
- **The bridge runs on your machine** (it needs a real phone + a browser). It just
  calls the Vercel URL. The dedicated WhatsApp number lives wherever the bridge runs.

---

## 1 · Supabase Cloud (the database)

1. Create a project at **supabase.com** (pick a region near Dar es Salaam, e.g. `eu-central`).
2. Apply the migrations. Easiest — in the project's **SQL Editor**, paste and run each
   file in order from `supabase/migrations/`:
   `0001_crm.sql` → `0002_documents.sql` → `0003_trip_share.sql` →
   `0004_trip_itinerary.sql` → `0005_grants.sql`.
   (Or, with the CLI: `supabase link --project-ref <ref>` then `supabase db push`.)
3. `0002` creates the private **`tourlink-docs`** storage bucket and `0005` grants the
   service role — both required.
4. From **Project Settings → API**, copy:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **service_role key** (secret) → `SUPABASE_SERVICE_ROLE_KEY`

> Note: the local `supabase/config.toml` port shifts (544xx) are **local-only** — they
> don't affect cloud.

## 2 · Vercel (the app)

1. **Import** the GitHub repo `ernestmoyo/tourlink.africa` in Vercel (Framework: Next.js,
   root directory: repository root).
2. Set **Environment Variables** (Production):

   | Var | Value |
   |-----|-------|
   | `NEXT_PUBLIC_SUPABASE_URL` | from Supabase |
   | `SUPABASE_SERVICE_ROLE_KEY` | from Supabase (secret) |
   | `ANTHROPIC_API_KEY` | your key (enables Relay's AI brain) |
   | `ANTHROPIC_MODEL` | `claude-opus-4-8` |
   | `CONCIERGE_WA_SECRET` | **generate a strong random string** — shared with the bridge |
   | `CONCIERGE_APPROVER` | `Isabel` |
   | `CONCIERGE_TZ` | `Africa/Dar_es_Salaam` |
   | `NEXT_PUBLIC_SITE_URL` | your Vercel URL, e.g. `https://tourrelay.vercel.app` |
   | `RESEND_API_KEY` / `EMAIL_FROM` | optional — emailed quotes |
   | `TRANSCRIBE_API_KEY` | optional — voice-note transcription (Groq/OpenAI) |
   | `TOURLINK_OPS_REQUIRE` | leave unset (desk open) or `true` to re-enable the password |

3. **Deploy.** First load of `/ops` seeds the TourLink workspace automatically.
4. (Optional) Re-seed your real clients against cloud: set the cloud keys in `.env.local`
   and run `node bin/seed-real.mjs` once.

> `CONCIERGE_WA_SECRET` is **required in production** — the ingest/outbox endpoints reject
> requests without the matching `x-concierge-secret` header.

## 3 · WhatsApp bridge (local, your number)

On the machine that will host the dedicated number (a laptop or a small always-on box):

```bash
cd ops/concierge
cp .env.example .env      # then edit .env (below)
npm install               # pulls whatsapp-web.js + a headless Chromium
node bridge.mjs           # opens http://localhost:3200
```

`ops/concierge/.env`:
```
APP_URL=https://tourrelay.vercel.app        # your Vercel URL
CONCIERGE_WA_SECRET=<same strong string as Vercel>
CONCIERGE_TEAM=TourLink
TEAM_NUMBERS=255767898469,263772928431      # team numbers (digits) = full control
WA_GROUP_NAME=TourLink Team                  # exact name of the team WhatsApp group (optional)
```

Open **http://localhost:3200**, scan the QR on the dedicated phone
(**WhatsApp → Linked Devices → Link a Device**). Text it `help`, `status`, or talk to it:
*"relay, build Gore the Ultimate Exclusive for 2"*.

- Team numbers get full control. Others texting it get the read-only "track my trip" view.
- Add the number to your team group; address it with `relay …` (it stays quiet otherwise).

## 4 · Proactive digests (optional)

Trigger the morning/EOD digest from any scheduler (cron, GitHub Actions, Vercel Cron via a
small wrapper) hitting:
```
GET https://tourrelay.vercel.app/api/whatsapp/proactive?type=morning   (header x-concierge-secret)
GET https://tourrelay.vercel.app/api/whatsapp/proactive?type=eod
```
The bridge's outbox poller delivers them.

---

## Known follow-ups before heavy customer use
- **Inbound media** (a client texting a passport/photo) currently tries the local
  filesystem via `attach_document` — fine for the team pilot (it degrades gracefully),
  but should move to Supabase Storage for Vercel. Ask and I'll wire it.
- **Official number:** for customer-facing scale, swap the bridge for the **Meta WhatsApp
  Cloud API** (the `/api/whatsapp/ingest` contract is unchanged).
