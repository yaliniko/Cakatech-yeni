import type { Payload } from 'payload'

// Sponsor formu için sel koruması (ek servis gerekmez; veritabanındaki kayıtlara bakar).
// Aynı e-posta saatte en fazla 3, tüm site 10 dakikada en fazla 20 başvuru açabilir.
const PER_EMAIL = { max: 3, windowMs: 60 * 60 * 1000 }
const GLOBAL = { max: 20, windowMs: 10 * 60 * 1000 }

const since = (ms: number) => new Date(Date.now() - ms).toISOString()

export async function isFlooded(payload: Payload, email: string): Promise<boolean> {
  const [byEmail, overall] = await Promise.all([
    payload.count({
      collection: 'sponsorship-inquiries',
      where: { and: [{ email: { equals: email } }, { createdAt: { greater_than: since(PER_EMAIL.windowMs) } }] },
    }),
    payload.count({
      collection: 'sponsorship-inquiries',
      where: { createdAt: { greater_than: since(GLOBAL.windowMs) } },
    }),
  ])
  return byEmail.totalDocs >= PER_EMAIL.max || overall.totalDocs >= GLOBAL.max
}

// Cloudflare Turnstile doğrulaması. TURNSTILE_SECRET_KEY yoksa kontrol kapalıdır (true döner).
export async function verifyTurnstile(token: string, ip?: string): Promise<boolean> {
  const secret = process.env.TURNSTILE_SECRET_KEY
  if (!secret) return true
  if (!token) return false
  try {
    const body = new URLSearchParams({ secret, response: token })
    if (ip) body.set('remoteip', ip)
    const res = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      body,
      signal: AbortSignal.timeout(8000),
    })
    const json = (await res.json()) as { success?: boolean }
    return json.success === true
  } catch (error) {
    console.error('Turnstile doğrulanamadı', error)
    return false
  }
}
