# TourLink Concierge — WhatsApp-driven CRM 🦒

> An internal **operations CRM** for TourLink, driven primarily from **WhatsApp**.
> Same proven engine as 7Square's *Relay/OneClaw*, retuned for a tour operator:
> the pipeline is **enquiry → trip → repeat**, not "software delivery".
>
> Built greenfield **inside the existing `tourlink` Next.js app** — the public
> marketing site stays the front door; this is the brain behind it.

The WhatsApp persona is **"Relay"** (Swahili: giraffe) — a friendly working name,
easily renamed. Code is namespaced neutrally: `lib/crm`, `lib/concierge`,
`app/(ops)`, `app/api/whatsapp`.

---

## Why it exists

Most TourLink business happens on WhatsApp — enquiries from travellers,
ambassadors, executives, embassies, and referrals. Today that lives in chat
threads and people's heads. Relay puts a dedicated WhatsApp number in the team
group (and as a DM line) that **captures every enquiry, qualifies it, builds the
trip, tracks deposits/balances, and nudges the team** — while a web board gives
the office the full picture.

It also serves the **traveller**: a client can text the number and get a
read-only, hard-scoped status of *their own* trip ("what's confirmed, what's left
to pay") — nothing about anyone else.

The same engine runs a second workspace for the sister company **VisaPermitLink
(BPO)** later — same code, different `team`.

---

## The pipeline (a closed loop)

| Stage | Owner | What happens |
|-------|-------|--------------|
| **Enquiry** | Business Dev | A traveller asks — WhatsApp, website form, referral, embassy intro. |
| **Qualified** | Business Dev | Real intent: dates, party size, budget band confirmed. |
| **Itinerary & Quote** | Operations | DMC + package assembled into a trip; quote sent. |
| **Booked** | Operations | Deposit paid — the deal is won. |
| **Confirmed** | Operations | Balance paid; services locked (lodges, transfers, guides, flights). |
| **On Trip** | Guide / DMC | The traveller is travelling. |
| **Completed** | Operations | Trip done; feedback captured. |
| **Repeat / Referral** | Business Dev | Grow the account, ask for referrals → spawns the next enquiry. |

`enquiry · qualified · itinerary` are **open**; `booked · confirmed · on_trip ·
completed · repeat` count as **won** (deposit secured).

---

## Two tiers

### Tier 1 — Accounts funnel (sales)
One light row per **account** (a traveller, corporate, embassy, government body,
or referral partner). Status: `lead → qualified → prospect → active → past`, plus
`disqualified`. This is the CRM funnel.

### Tier 2 — Per-trip workspace (delivery)
Each account can have many **trips** over time. A trip is the booking:

```
Account (e.g. "H.E. Ambassador …", status=active)
  └─ Trip ("Zimbabwe Cultural + Vic Falls — Aug 2026", pax 4, USD 24,000)
       ├─ Segments     Vic Falls 3n · Hwange 2n · transfers · private guide   (value, status)
       ├─ Payments     Deposit 30% · Balance 70%   (pending→invoiceable→invoiced→paid)
       └─ Trip docs    Visa · Vouchers · Itinerary PDF · Insurance · Guide assigned · Flights ticketed
  └─ Cards (enquiries) the opportunity that became this trip; the pipeline lives here
```

---

## Architecture

```
 traveller / team ──text──▶  ops/concierge/bridge.mjs ──HTTP──▶  /api/whatsapp/ingest
       ▲                       (whatsapp-web.js, QR)               (Relay brain)
       └──────────  reply  ◀──── outbox poller ◀── /api/whatsapp/outbox ◀──┘

 web team ──▶ /ops  (password-gated board)  ──server actions──▶  Supabase (service role)
 public site ──ContactForm / TripWizard──▶ server action ──▶ creates an Enquiry lead
```

- **Backend:** Supabase Postgres. All CRM tables are server-only via the
  **service-role** client (RLS on, no public policies). Every query is explicitly
  scoped by `team_id` — exactly the Relay discipline.
- **Brain:** `lib/concierge/` — a deterministic keyword brain (free, instant) for
  exact commands, and a **Claude Opus 4.8** brain with tool-use for everything
  conversational, plus voice notes (transcribed) and PDFs/photos (read + filed).
- **Modes:** `team` (full tool access), `ambient` (listens in the group, only
  speaks when genuinely useful, else `<silent>`), `client` (read-only, scoped to
  the one account whose phone matches the sender).
- **Proactive:** an `outbox` table + bridge poller. Morning digest ("today's
  departures & arrivals, deposits due, hot leads to chase") + per-person nudges +
  end-of-day recap.
- **Auth (v1):** a lightweight shared-password cookie gate on `/ops` (env
  `TOURLINK_OPS_PASSWORD`); the actor picks their name on sign-in. The API uses
  the service role, never the browser. (Upgrade to full Supabase Auth later.)

---

## Build phases

1. **Foundation** — deps, env, Supabase schema, `lib/crm` constants + types,
   Supabase admin client. *(this commit)*
2. **Concierge** — deterministic + AI brain, tourism tools, ingest/outbox/proactive
   routes, transcription, media reading.
3. **Ops UI** — `/ops` funnel board + account detail + per-trip workspace + activity.
4. **Wire-up** — public enquiry forms → CRM lead; `ops/concierge` bridge package
   (QR, durable queue, outbox poller, digest cron).

---

## Documents (real PDFs)

Quotes, itineraries, and vouchers are generated as **branded A4 PDFs** with
`pdf-lib` (pure JS, no headless browser) — navy/gold header, Times serif
headings (≈ Playfair), banded itinerary tables, totals, payment plan, callout.

- Builders: `lib/documents/{pdf,data,build,deliver}.ts`.
- Storage: a private Supabase bucket `tourlink-docs` (migration `0002`); files
  are reached only via short-lived signed URLs.
- Delivery: a PDF is enqueued on the `outbox` with `media_url` + `media_name`;
  the bridge sends it as a WhatsApp **document** (the text becomes the caption).
- Web: the team can open/print any doc at `/api/documents?trip=<id>&type=quote|itinerary|voucher`
  (ops-password gated), and from the **DocActions** buttons on each trip in `/ops`.
- Concierge tools: `prepare_quote` (builds the PDF → sends to the approver),
  `send_quote` (approver-only → client), `generate_itinerary`, `generate_voucher`.
  A quote **never** reaches a client without the approver releasing it.

## Package catalogue → CRM

A trip can be **built from one of the 12 catalogue packages** (`data/packages.ts`)
— `lib/crm/packages.ts` materialises its itinerary into priced segments
(per-person × pax) with dates and a seeded checklist. Available from the
concierge (`build_trip_from_package`) and the Ops "📦 From package" form.

## Team, payments, email, traveller portal, dashboard

- **Team** — edit `TEAM_MEMBERS` in `lib/crm/constants.ts` for real people; drives
  Ops sign-in identities, owner colours/roles, and the default quote approver
  (`OPS_OWNER`, override with `CONCIERGE_APPROVER`).
- **Auto payments** — building a trip from a package, a spec, or `create_trip`
  with a value auto-seeds a **30% deposit + 70% balance** plan. Manual trips get a
  "＋ 30/70 plan" button / `add_payment_plan` tool.
- **Email** — quotes/itineraries/vouchers can be emailed (PDF attached) via
  Resend (`RESEND_API_KEY` + `EMAIL_FROM`): concierge `email_document` (quote
  stays approver-gated), Ops "📧 Itinerary/Voucher" buttons. `lib/email/send.ts`.
- **Traveller portal** — every trip has an unguessable `share_token` (migration
  `0003`). `/trip/<token>` is a public, read-only page: itinerary, payments,
  document downloads (itinerary/voucher only, via `/api/trip/<token>/doc`). Share
  it from Ops (🔗 Portal / 📋 Copy link) or `send_trip_link` over WhatsApp.
- **Dashboard** — `/ops/dashboard`: weighted forecast, conversion, cash
  collected vs outstanding, pipeline-by-stage, source of business, upcoming
  departures.
- **Day-by-day itineraries** — a trip carries a `itinerary` JSONB day plan
  (migration `0004`), auto-filled when built from a catalogue package. The
  itinerary PDF and the traveller portal render it day-by-day (with
  accommodation, meals, activities), falling back to the segment list otherwise.
- **Editable desk** — accounts (name/type/status/VIP/country/phone/email/notes),
  trips (name/status/dates/pax/value/destinations), and card owners are all
  editable inline in `/ops` (so the team can add the contact email that emailed
  quotes + the portal rely on). Owner is a `StatusControl kind="owner"`.

## Two workspaces (TourLink + VisaPermitLink)

The same engine runs **two isolated workspaces** (`teams`): TourLink (tours) and
VisaPermitLink (BPO). Every query is `team_id`-scoped.

- **Ops** has a workspace switcher (top-right); the choice is a cookie
  (`lib/ops/team.ts`). All loaders/actions read the selected team.
- **WhatsApp**: a number serves one workspace via the bridge's `CONCIERGE_TEAM`
  env (passed to `/api/whatsapp/ingest` and used to scope the outbox poll, so two
  numbers never cross-deliver). Run one bridge per number.
- **Website** enquiry capture always pins to the **TourLink** workspace.
- Proactive digests accept `?team=` (e.g. `…/proactive?type=morning&team=VisaPermitLink`).
- Both workspaces are seeded idempotently on first `/ops` visit.

## Live-data discipline

This will run against a managed Supabase DB. Per the team's safety rules:
seeders are **idempotent**; migrations are **additive**; the concierge **never
sends an invoice/quote straight to a client without an approval step**; the
client mode is **strictly read-only**. See the approval flow in
`lib/concierge/` (mirrors Relay's invoice-approval gate).
