'use server'

import { getPayloadClient } from '@/lib/data'

export type InquiryState = { status: 'idle' | 'success' | 'invalid' | 'error' }

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

  try {
    const payload = await getPayloadClient()
    await payload.create({ collection: 'sponsorship-inquiries', data, overrideAccess: true })
    return { status: 'success' }
  } catch (error) {
    console.error('Sponsorluk başvurusu kaydedilemedi', error)
    return { status: 'error' }
  }
}
