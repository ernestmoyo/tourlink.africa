// TourLink Concierge — WhatsApp bridge.
// Links a real WhatsApp number via QR and relays messages to the app's ingest
// API ("Relay" brain), then sends replies back. Also polls the outbox and
// delivers proactive / queued messages. Unofficial WhatsApp Web protocol —
// ideal for an internal team line; swap to the Meta Cloud API for a hardened
// public number later (the ingest endpoint is unchanged).
//
//   run:  npm install   (in this folder)   then   node bridge.mjs
//   or from web/:  npm run concierge

import http from 'node:http'
import pkg from 'whatsapp-web.js'
import qrcode from 'qrcode-terminal'

const { Client, LocalAuth, MessageMedia } = pkg

// ---- config ----
const APP_URL = process.env.APP_URL || 'http://localhost:3000'
const SECRET = process.env.CONCIERGE_WA_SECRET || ''
const CLIENT_ID = process.env.WA_CLIENT_ID || 'tourlink-concierge'
const QR_PORT = Number(process.env.QR_PORT || 3200)
const POLL_MS = Number(process.env.OUTBOX_POLL_MS || 5000)
const GROUP_NAME = process.env.WA_GROUP_NAME || '' // team group to treat as the desk
const TEAM = process.env.CONCIERGE_TEAM || '' // workspace this number serves: 'TourLink' or 'VisaPermitLink'
const ADDRESS = ['relay', 'tourrelay', '@relay', '🔗', 'concierge']
// Phone digits (no +) that are team members → full control. Everyone else 1:1 is a client.
const TEAM_NUMBERS = new Set((process.env.TEAM_NUMBERS || '').split(',').map((s) => s.replace(/\D/g, '')).filter(Boolean))
// name → phone digits, for DM targeting from the outbox.
let PEOPLE = {}
try { PEOPLE = JSON.parse(process.env.TOURLINK_PEOPLE || '{}') } catch { PEOPLE = {} }

const headers = { 'Content-Type': 'application/json', ...(SECRET ? { 'x-concierge-secret': SECRET } : {}) }
let lastQr = ''
let ready = false

// ---- ingest ----
async function ingest(payload) {
  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      const res = await fetch(`${APP_URL}/api/whatsapp/ingest`, { method: 'POST', headers, body: JSON.stringify(payload) })
      if (res.ok) return (await res.json()).reply || ''
    } catch { /* retry */ }
    await new Promise((r) => setTimeout(r, 800 * (attempt + 1)))
  }
  return '⚠️ The desk is briefly unreachable — please resend in a moment.'
}

async function mediaOf(msg) {
  if (!msg.hasMedia) return null
  try {
    const m = await msg.downloadMedia()
    if (!m?.data) return null
    return { data: m.data, mimetype: m.mimetype || 'application/octet-stream', filename: m.filename || 'file' }
  } catch { return null }
}

function stripAddress(body) {
  let t = (body || '').trim()
  for (const a of ADDRESS) {
    if (t.toLowerCase().startsWith(a)) { t = t.slice(a.length).replace(/^[\s,:]+/, ''); break }
  }
  return t
}

// ---- client ----
const client = new Client({
  authStrategy: new LocalAuth({ clientId: CLIENT_ID }),
  puppeteer: { headless: true, args: ['--no-sandbox', '--disable-setuid-sandbox'] },
})

client.on('qr', (qr) => { lastQr = qr; qrcode.generate(qr, { small: true }); console.log(`\nScan the QR above, or open http://localhost:${QR_PORT}\n`) })
client.on('ready', () => { ready = true; console.log(`✅ TourRelay connected as ${CLIENT_ID}. Listening…`) })
client.on('disconnected', (r) => { ready = false; console.log('⚠️ disconnected:', r) })

client.on('message', async (msg) => {
  try {
    if (msg.isStatus) return
    const chat = await msg.getChat()
    const contact = await msg.getContact()
    const name = contact.pushname || contact.name || contact.number || 'WhatsApp'
    const fromPhone = (contact.number || '').replace(/\D/g, '')
    const media = await mediaOf(msg)

    let mode = 'team'
    let text = msg.body || ''

    if (chat.isGroup) {
      const addressed = ADDRESS.some((a) => (msg.body || '').toLowerCase().startsWith(a))
      if (addressed) { mode = 'team'; text = stripAddress(msg.body) }
      else { mode = 'ambient' } // listen quietly; server stays silent unless it can help
    } else {
      mode = TEAM_NUMBERS.has(fromPhone) ? 'team' : 'client'
    }

    const reply = await ingest({ name, body: text, media, mode, fromPhone, team: TEAM || undefined })
    if (reply && reply.trim()) await chat.sendMessage(reply)
  } catch (e) {
    console.error('message handler error', e)
  }
})

// ---- outbox poller (proactive + queued sends) ----
let groupChatId = null
async function resolveGroup() {
  if (groupChatId || !GROUP_NAME) return groupChatId
  try {
    const chats = await client.getChats()
    const g = chats.find((c) => c.isGroup && c.name === GROUP_NAME)
    if (g) groupChatId = g.id._serialized
  } catch { /* ignore */ }
  return groupChatId
}

function targetToChatId(target) {
  if (target === 'group') return groupChatId
  const digits = String(target).replace(/\D/g, '')
  if (digits.length >= 9) return `${digits}@c.us`
  const phone = (PEOPLE[target] || PEOPLE[String(target).toLowerCase()] || '').replace(/\D/g, '')
  return phone.length >= 9 ? `${phone}@c.us` : null
}

async function pollOutbox() {
  if (!ready) return
  try {
    await resolveGroup()
    const outboxUrl = `${APP_URL}/api/whatsapp/outbox${TEAM ? `?team=${encodeURIComponent(TEAM)}` : ''}`
    const res = await fetch(outboxUrl, { headers })
    if (!res.ok) return
    const { messages } = await res.json()
    const sent = [], failed = []
    for (const m of messages || []) {
      const chatId = targetToChatId(m.target)
      if (!chatId) { failed.push(m.id); continue }
      try {
        if (m.media_url) {
          // Deliver as a document (PDF quote/itinerary/voucher); text is the caption.
          const media = await MessageMedia.fromUrl(m.media_url, { unsafeMime: true, filename: m.media_name || 'document.pdf' })
          await client.sendMessage(chatId, media, { caption: m.text || '' })
        } else {
          await client.sendMessage(chatId, m.text)
        }
        sent.push(m.id)
      } catch (e) { console.error('send failed', e?.message || e); failed.push(m.id) }
    }
    if (sent.length || failed.length) {
      await fetch(`${APP_URL}/api/whatsapp/outbox`, { method: 'POST', headers, body: JSON.stringify({ sent, failed }) })
    }
  } catch { /* ignore poll errors */ }
}
setInterval(pollOutbox, POLL_MS)

// ---- QR / health page ----
http.createServer((req, res) => {
  if (req.url === '/health') { res.writeHead(200); return res.end(ready ? 'ready' : 'starting') }
  res.writeHead(200, { 'Content-Type': 'text/html' })
  const body = ready
    ? '<h2>✅ Connected</h2><p>TourRelay is live.</p>'
    : lastQr
      ? `<h2>Scan to link</h2><img src="https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(lastQr)}"/><p>WhatsApp → Linked Devices → Link a Device</p>`
      : '<h2>Starting…</h2><p>Refresh in a moment.</p>'
  res.end(`<html><body style="font-family:system-ui;text-align:center;padding:40px">${body}</body></html>`)
}).listen(QR_PORT, () => console.log(`QR / health UI on http://localhost:${QR_PORT}`))

client.initialize()
