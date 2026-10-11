import type { CollectionConfig } from 'payload'

import { activeOrLoggedIn, loggedIn } from '@/access'
import { revalidateHooks } from '@/hooks/revalidateSite'
import { orderingFields } from '@/fields'

export const Competitions: CollectionConfig = {
  slug: 'competitions',
  labels: { singular: 'Yarışma', plural: 'Yarışmalar' },
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'season', 'result'],
    group: 'İçerik',
  },
  defaultSort: '-date',
  access: { read: activeOrLoggedIn, create: loggedIn, update: loggedIn, delete: loggedIn },
  hooks: revalidateHooks,
  fields: [
    { name: 'name', label: 'Ad', type: 'text', required: true, localized: true },
    {
      type: 'row',
      fields: [
        { name: 'season', label: 'Sezon', type: 'text', admin: { placeholder: '2025-26' } },
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
          label: 'Sonuç',
          type: 'text',
          localized: true,
          admin: { placeholder: 'Finalist' },
        },
      ],
    },
    { name: 'description', label: 'Açıklama', type: 'textarea', localized: true },
    { name: 'image', label: 'Görsel', type: 'upload', relationTo: 'media' },
    ...orderingFields,
  ],
}
