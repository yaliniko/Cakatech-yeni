'use server'

import { headers } from 'next/headers'

import { getPayloadClient } from '@/lib/data'
import { isFlooded, verifyTurnstile } from '@/lib/inquiryGuard'
import { contactEmail } from '@/lib/site'

export type InquiryState = { status: 'idle' | 'success' | 'invalid' | 'error' | 'captcha' | 'limited' }

const text = (data: FormData, key: string, max: number) =>
  String(data.get(key) ?? '')
    .trim()
    .slice(0, max)

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

// "Sponsor ol" formu. Koleksiyon ziyaretçiye kapalı (create: false); kayıt burada sunucu tarafında açılır.
export async function submitInquiry(_prev: InquiryState, formData: FormData): Promise<InquiryState> {
  // Bot tuzağı: gerçek kullanıcı bu gizli alanı boş bırakır. Bota başarı gibi görünür.
  if (text(formData, 'website', 200)) return { status: 'success' }

  const data = {
    name: text(formData, 'name', 120),
    organization: text(formData, 'organization', 160) || undefined,
    email: text(formData, 'email', 200),
    phone: text(formData, 'phone', 40) || undefined,
    message: text(formData, 'message', 4000),
  }

  if (!data.name || !EMAIL.test(data.email) || data.message.length < 5) return { status: 'invalid' }

  const ip = (await headers()).get('x-forwarded-for')?.split(',')[0]?.trim() || undefined
  if (!(await verifyTurnstile(text(formData, 'cf-turnstile-response', 4096), ip))) return { status: 'captcha' }

  try {
    const payload = await getPayloadClient()
    if (await isFlooded(payload, data.email)) return { status: 'limited' }
    await payload.create({ collection: 'sponsorship-inquiries', data, overrideAccess: true })
  } catch (error) {
    console.error('Sponsorluk başvurusu kaydedilemedi', error)
    return { status: 'error' }
  }

  // Bildirim maili: başvuru zaten kaydedildi, mail gitmezse ziyaretçiye hata gösterilmez.
  // Düz metin gönderilir (ziyaretçi girdisi HTML olarak yorumlanmasın); yanıtla → ziyaretçiye gider.
  if (process.env.RESEND_API_KEY) {
    try {
      const payload = await getPayloadClient()
      const oneLine = (value: string) => value.replace(/[\r\n]+/g, ' ')
      await payload.sendEmail({
        to: contactEmail,
        replyTo: data.email,
        subject: `Yeni sponsorluk başvurusu: ${oneLine(data.name)}`,
        text: [
          `Ad soyad: ${data.name}`,
          `Kurum: ${data.organization ?? '-'}`,
          `E-posta: ${data.email}`,
          `Telefon: ${data.phone ?? '-'}`,
          '',
          data.message,
        ].join('\n'),
      })
    } catch (error) {
      console.error('Başvuru bildirim maili gönderilemedi', error)
    }
  }

  return { status: 'success' }
}
