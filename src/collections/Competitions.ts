import type { CollectionConfig } from 'payload'

import { activeOrLoggedIn, loggedIn } from '@/access'
import { orderingFields } from '@/fields'

export const Competitions: CollectionConfig = {
  slug: 'competitions',
  labels: { singular: 'Yarışma', plural: 'Yarışmalar' },
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'season', 'date', 'result', 'isActive'],
    group: 'Takım',
  },
  defaultSort: '-date',
  access: { read: activeOrLoggedIn, create: loggedIn, update: loggedIn, delete: loggedIn },
  fields: [
    { name: 'name', label: 'Yarışma adı', type: 'text', required: true, localized: true },
    {
      type: 'row',
      fields: [
        { name: 'season', label: 'Sezon', type: 'text', admin: { description: 'Örn. 2025-26' } },
        {
          name: 'date',
          label: 'Tarih',
          type: 'date',
          admin: { date: { pickerAppearance: 'dayOnly', displayFormat: 'd MMMM yyyy' } },
        },
      ],
    },
    {
      type: 'row',
      fields: [
        { name: 'location', label: 'Yer', type: 'text', localized: true },
        {
          name: 'result',
          label: 'Sonuç / derece',
          type: 'text',
          localized: true,
          admin: { description: 'Örn. Bölge 3.lüğü, Finalist' },
        },
      ],
    },
    { name: 'description', label: 'Açıklama', type: 'textarea', localized: true },
    { name: 'image', label: 'Görsel', type: 'upload', relationTo: 'media' },
    ...orderingFields,
  ],
}
