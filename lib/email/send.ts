import 'server-only'

// Transactional email via Resend (https://resend.com) — a single fetch, no SDK.
// Set RESEND_API_KEY + EMAIL_FROM in the environment to enable. Without a key,
// sending is a no-op that reports a clear error to the caller.

export type EmailAttachment = { filename: string; contentBase64: string; contentType?: string }
export type SendEmailArgs = {
  to: string | string[]
  subject: string
  html: string
  text?: string
  attachments?: EmailAttachment[]
}
export type SendResult = { ok: true; id?: string } | { error: string }

export function emailEnabled(): boolean {
  return !!process.env.RESEND_API_KEY
}

const FROM = () => process.env.EMAIL_FROM || 'TourLink <quotes@tourlink.africa>'

export async function sendEmail(args: SendEmailArgs): Promise<SendResult> {
  const key = process.env.RESEND_API_KEY
  if (!key) return { error: 'email is not configured (set RESEND_API_KEY + EMAIL_FROM)' }
  const to = Array.isArray(args.to) ? args.to : [args.to]
  if (!to.length || !to[0]) return { error: 'no recipient email' }
  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        from: FROM(),
        to,
        subject: args.subject,
        html: args.html,
        text: args.text,
        attachments: args.attachments?.map((a) => ({ filename: a.filename, content: a.contentBase64 })),
      }),
    })
    if (!res.ok) {
      const body = await res.text().catch(() => '')
      return { error: `email send failed (${res.status})${body ? `: ${body.slice(0, 160)}` : ''}` }
    }
    const json = (await res.json().catch(() => ({}))) as { id?: string }
    return { ok: true, id: json.id }
  } catch (e) {
    return { error: `email send error: ${(e as Error).message}` }
  }
}

// A small branded HTML wrapper for transactional emails.
export function emailShell(title: string, bodyHtml: string): string {
  return `<div style="font-family:Helvetica,Arial,sans-serif;max-width:560px;margin:0 auto;color:#2C2C2C">
  <div style="background:#2B3990;border-bottom:4px solid #C9A84C;padding:20px 24px">
    <span style="color:#fff;font-size:22px;font-weight:700;font-family:Georgia,serif">TourLink</span>
    <span style="color:#B9C0DC;font-size:12px;display:block;margin-top:2px">Linking you to the World</span>
  </div>
  <div style="padding:24px">
    <h1 style="font-family:Georgia,serif;color:#2B3990;font-size:20px;margin:0 0 12px">${title}</h1>
    ${bodyHtml}
  </div>
  <div style="border-top:1px solid #E8DFD0;padding:16px 24px;color:#6B6B6B;font-size:12px">
    TourLink · info@tourlink.africa · +255 767 898 469<br/>Dar es Salaam · Harare · Cape Town · Sandton
  </div>
</div>`
}
