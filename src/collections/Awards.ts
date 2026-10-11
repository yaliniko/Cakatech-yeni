import type { CollectionConfig } from 'payload'

import { activeOrLoggedIn, loggedIn } from '@/access'
import { revalidateHooks } from '@/hooks/revalidateSite'
import { orderingFields } from '@/fields'

// Django competitions.Achievement karşılığı.
export const Awards: CollectionConfig = {
  slug: 'awards',
  labels: { singular: 'Ödül', plural: 'Ödüller' },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'competition', 'date'],
    group: 'İçerik',
  },
  defaultSort: '-date',
  access: { read: activeOrLoggedIn, create: loggedIn, update: loggedIn, delete: loggedIn },
  hooks: revalidateHooks,
  fields: [
    { name: 'title', label: 'Ad', type: 'text', required: true, localized: true },
    {
      type: 'row',
      fields: [
        {
          name: 'competition',
          label: 'Yarışma',
          type: 'relationship',
          relationTo: 'competitions',
        },
        {
          name: 'date',
          label: 'Tarih',
          type: 'date',
          admin: { date: { pickerAppearance: 'dayOnly', displayFormat: 'd MMMM yyyy' } },
        },
      ],
    },
    { name: 'description', label: 'Açıklama', type: 'textarea', localized: true },
    { name: 'image', label: 'Görsel', type: 'upload', relationTo: 'media' },
    ...orderingFields,
  ],
}
