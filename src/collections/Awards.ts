import type { CollectionConfig } from 'payload'

import { activeOrLoggedIn, loggedIn } from '@/access'
import { orderingFields } from '@/fields'

// Django competitions.Achievement karşılığı.
export const Awards: CollectionConfig = {
  slug: 'awards',
  labels: { singular: 'Ödül', plural: 'Ödüller' },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'competition', 'date', 'isActive'],
    group: 'Takım',
  },
  defaultSort: '-date',
  access: { read: activeOrLoggedIn, create: loggedIn, update: loggedIn, delete: loggedIn },
  fields: [
    { name: 'title', label: 'Ödül adı', type: 'text', required: true, localized: true },
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
    { name: 'image', label: 'Görsel / ikon', type: 'upload', relationTo: 'media' },
    ...orderingFields,
  ],
}
