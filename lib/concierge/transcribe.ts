import 'server-only'

// Voice-note transcription via an OpenAI-compatible Whisper endpoint (Groq by
// default — fast + cheap). Claude can't take audio directly, so the concierge
// transcribes first, then treats the result as text.

export function transcribeEnabled(): boolean {
  return !!process.env.TRANSCRIBE_API_KEY
}

const EXT: Record<string, string> = {
  'audio/ogg': 'ogg', 'audio/oga': 'oga', 'audio/mpeg': 'mp3', 'audio/mp4': 'm4a',
  'audio/m4a': 'm4a', 'audio/wav': 'wav', 'audio/webm': 'webm', 'audio/amr': 'amr',
}

export async function transcribeAudio(base64: string, mimetype: string): Promise<string | null> {
  const key = process.env.TRANSCRIBE_API_KEY
  if (!key) return null
  const base = process.env.TRANSCRIBE_BASE_URL || 'https://api.groq.com/openai/v1'
  const model = process.env.TRANSCRIBE_MODEL || 'whisper-large-v3'
  try {
    const bytes = Buffer.from(base64, 'base64')
    const ext = EXT[mimetype.split(';')[0]] || 'ogg'
    const form = new FormData()
    form.append('file', new Blob([bytes], { type: mimetype }), `voice.${ext}`)
    form.append('model', model)
    const res = await fetch(`${base}/audio/transcriptions`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${key}` },
      body: form,
    })
    if (!res.ok) return null
    const json = (await res.json()) as { text?: string }
    return (json.text || '').trim() || null
  } catch {
    return null
  }
}
