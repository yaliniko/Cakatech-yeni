import type { CollectionConfig } from 'payload'

import { activeOrLoggedIn, loggedIn } from '@/access'
import { orderingFields } from '@/fields'

// Django sponsors.Sponsor.Tier ile aynı değerler.
export const SPONSOR_TIERS = [
  { label: 'Platin', value: 'platinum' },
  { label: 'Altın', value: 'gold' },
  { label: 'Gümüş', value: 'silver' },
  { label: 'Bronz', value: 'bronze' },
  { label: 'Partner', value: 'partner' },
]

export const Sponsors: CollectionConfig = {
  slug: 'sponsors',
  labels: { singular: 'Sponsor', plural: 'Sponsorlar' },
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'tier', 'isActive'],
    group: 'Sponsorluk',
  },
  defaultSort: 'order',
  access: { read: activeOrLoggedIn, create: loggedIn, update: loggedIn, delete: loggedIn },
  fields: [
    { name: 'name', label: 'Sponsor adı', type: 'text', required: true },
    {
      type: 'row',
      fields: [
        {
          name: 'tier',
          label: 'Kategori',
          type: 'select',
          required: true,
          defaultValue: 'partner',
          options: SPONSOR_TIERS,
        },
        { name: 'url', label: 'Web sitesi', type: 'text' },
      ],
    },
    {
      name: 'logo',
      label: 'Logo',
      type: 'upload',
      relationTo: 'media',
      admin: { description: 'Mümkünse şeffaf arka planlı PNG veya SVG.' },
    },
    { name: 'description', label: 'Açıklama', type: 'textarea', localized: true },
    ...orderingFields,
  ],
}
