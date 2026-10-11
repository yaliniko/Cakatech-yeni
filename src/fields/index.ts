import type { Field } from 'payload'

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
