import type { Field } from 'payload'

// Django'daki OrderedModel karşılığı: manuel sıralama + yayında mı bayrağı (yan panelde).
export const orderingFields: Field[] = [
  {
    name: 'order',
    label: 'Sıra',
    type: 'number',
    defaultValue: 0,
    index: true,
    admin: { position: 'sidebar', description: 'Küçük sayı önce gösterilir.' },
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

// URL için kısa ad: boş bırakılırsa kaynak alandan otomatik üretilir.
export const slugField = (from: string): Field => ({
  name: 'slug',
  label: 'URL kısa adı',
  type: 'text',
  unique: true,
  index: true,
  admin: {
    position: 'sidebar',
    description: 'Boş bırakırsan başlıktan otomatik üretilir.',
  },
  hooks: {
    beforeValidate: [
      ({ value, data }) => {
        const source = typeof value === 'string' && value ? value : data?.[from]
        return typeof source === 'string' ? slugify(source) : value
      },
    ],
  },
})

const TR_MAP: Record<string, string> = { ç: 'c', ğ: 'g', ı: 'i', ö: 'o', ş: 's', ü: 'u' }

export const slugify = (input: string) =>
  input
    .toLocaleLowerCase('tr')
    .replace(/[çğıöşü]/g, (ch) => TR_MAP[ch] ?? ch)
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')

// Gelen kutusu kayıtları için "okundu" bayrağı (yan panelde).
export const isReadField: Field = {
  name: 'isRead',
  label: 'Okundu',
  type: 'checkbox',
  defaultValue: false,
  index: true,
  admin: { position: 'sidebar' },
}
