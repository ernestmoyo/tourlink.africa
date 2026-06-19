# TourLink Concierge — WhatsApp bridge 🦒

Dedicate a WhatsApp number that the team texts to **run the desk**, and that
travellers text to **check their trip** — no app needed in the field. Every
WhatsApp action lands in the Ops activity feed (tagged `(WhatsApp)`) and updates
`/ops` live for everyone.

```
 phone  ──text──▶  bridge.mjs  ──HTTP──▶  /api/whatsapp/ingest
   ▲               (whatsapp-web.js)        (Relay brain)
   └──────  reply / outbox  ◀──────────────────┘
```

## Go live (2 minutes)

1. Make sure the app is running (`npm run dev` in `../../`, i.e. the `tourlink`
   app) with Supabase + `ANTHROPIC_API_KEY` set in `.env.local`.
2. From this folder:
   ```bash
   npm install      # first time (pulls whatsapp-web.js + Chromium)
   node bridge.mjs  # or, from the app root: npm run concierge
   ```
3. Open **http://localhost:3200** and scan the QR with the phone of the number
   you want to dedicate: **WhatsApp → Linked Devices → Link a Device**.
4. Text that number **`status`** or **`help`**. That's it.

## Modes (who gets what)

| Sender | Mode | What they can do |
|--------|------|------------------|
| A team number (in `TEAM_NUMBERS`), 1:1 | **team** | Full control — capture enquiries, build trips, set payments, ask anything. |
| The team group (message starts with `twiga`/`🦒`) | **team** | Same, addressed in the group. |
| The team group (any other message) | **ambient** | Relay listens quietly and only chimes in when it can genuinely help. |
| Any other number, 1:1 | **client** | Read-only status of *their own* trip (matched by phone). Nothing else. |

## Config (env — set before launching)

| Var | Default | Notes |
|-----|---------|-------|
| `APP_URL` | `http://localhost:3000` | Where the TourLink app runs |
| `CONCIERGE_WA_SECRET` | — | Optional locally, **required in prod**; must match the app's env |
| `WA_CLIENT_ID` | `tourlink-concierge` | Session id (unique per number) |
| `QR_PORT` | `3200` | QR / health UI port |
| `WA_GROUP_NAME` | — | Exact name of the team WhatsApp group (so `group` outbox messages land there) |
| `TEAM_NUMBERS` | — | Comma-separated team phone numbers (digits), e.g. `255767898469,263772928431` |
| `TOURLINK_PEOPLE` | `{}` | `{"Isabel":"2557...","Wellington":"2637..."}` — for per-person DMs |
| `OUTBOX_POLL_MS` | `5000` | Outbox delivery interval |

## Proactive digests

The app computes the morning standup / end-of-day recap and **enqueues** them on
the outbox; this bridge delivers them. Trigger from cron (or a scheduler):

```bash
# morning standup to the group
curl -H "x-concierge-secret: $CONCIERGE_WA_SECRET" "$APP_URL/api/whatsapp/proactive?type=morning"
# end-of-day recap
curl -H "x-concierge-secret: $CONCIERGE_WA_SECRET" "$APP_URL/api/whatsapp/proactive?type=eod"
# preview without sending
curl -H "x-concierge-secret: $CONCIERGE_WA_SECRET" "$APP_URL/api/whatsapp/proactive?type=morning&dry=1"
```

## Notes

- Groups/channels/broadcasts other than the named team group are handled as
  ambient or ignored; status broadcasts are skipped.
- If sending breaks after long uptime (Chrome staleness), just restart
  `node bridge.mjs` — the session reconnects without a re-scan.
- For a hardened public number, swap this bridge for the Meta Cloud API; the
  `/api/whatsapp/ingest` contract is unchanged.
