import type { Field, TextFieldSingleValidation } from 'payload'

// Django'daki OrderedModel karşılığı: manuel sıralama + yayında mı bayrağı (yan panelde).
export const orderingFields: Field[] = [
  {
    name: 'order',
    label: 'Sıra',
    type: 'number',
    defaultValue: 0,
    index: true,
    admin: { position: 'sidebar' },
  },
  {
    name: 'isActive',
    label: 'Sitede göster',
    type: 'checkbox',
    defaultValue: true,
    index: true,
    admin: { position: 'sidebar' },
  },
]

// Gelen kutusu kayıtları için "okundu" bayrağı (yan panelde).
export const isReadField: Field = {
  name: 'isRead',
  label: 'Okundu',
  type: 'checkbox',
  defaultValue: false,
  index: true,
  admin: { position: 'sidebar' },
}

// Bağlantı alanları: boş olabilir (zorunluluğu `required` belirler), doluysa http(s):// ile başlamalı.
// Böylece "instagram.com/x" gibi eksik yazılan adresler sitede kırık göreli bağlantıya dönüşmez.
export const httpUrl: TextFieldSingleValidation = (value, { required }) => {
  const text = typeof value === 'string' ? value.trim() : ''
  if (!text) return required ? 'Bu alan gerekli.' : true
  try {
    const { protocol } = new URL(text)
    if (protocol === 'http:' || protocol === 'https:') return true
  } catch {
    // aşağıdaki mesaja düş
  }
  return 'Geçerli bir adres girin (https://… ile başlamalı).'
}
