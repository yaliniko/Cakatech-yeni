import type { CollectionConfig } from 'payload'

import { activeOrLoggedIn, loggedIn } from '@/access'
import { revalidateHooks } from '@/hooks/revalidateSite'
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
    group: 'İçerik',
  },
  defaultSort: 'order',
  access: { read: activeOrLoggedIn, create: loggedIn, update: loggedIn, delete: loggedIn },
  hooks: revalidateHooks,
  fields: [
    { name: 'name', label: 'Ad', type: 'text', required: true },
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
    { name: 'logo', label: 'Logo', type: 'upload', relationTo: 'media' },
    { name: 'description', label: 'Açıklama', type: 'textarea', localized: true },
    ...orderingFields,
  ],
}
