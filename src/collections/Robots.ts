import type { CollectionConfig } from 'payload'

import { activeOrLoggedIn, loggedIn } from '@/access'
import { orderingFields, slugField } from '@/fields'

// Sezon başına bir robot: Robotlar sayfası + robot detay sayfası.
export const Robots: CollectionConfig = {
  slug: 'robots',
  labels: { singular: 'Robot', plural: 'Robotlar' },
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'seasonName', 'seasonYears', 'featured', 'isActive'],
    group: 'Takım',
  },
  defaultSort: '-seasonYears',
  access: { read: activeOrLoggedIn, create: loggedIn, update: loggedIn, delete: loggedIn },
  fields: [
    { name: 'name', label: 'Robot adı', type: 'text', required: true },
    {
      type: 'row',
      fields: [
        {
          name: 'seasonName',
          label: 'Sezon (oyun adı)',
          type: 'text',
          required: true,
          admin: { description: 'Örn. DECODE' },
        },
        {
          name: 'seasonYears',
          label: 'Sezon yılı',
          type: 'text',
          required: true,
          admin: { description: 'Örn. 2025-26' },
        },
      ],
    },
    { name: 'summary', label: 'Kısa özet', type: 'textarea', localized: true },
    { name: 'heroImage', label: 'Ana görsel', type: 'upload', relationTo: 'media' },
    { name: 'description', label: 'Detaylı anlatım', type: 'richText', localized: true },
    {
      name: 'specs',
      label: 'Teknik özellikler',
      type: 'array',
      labels: { singular: 'Özellik', plural: 'Özellikler' },
      fields: [
        {
          type: 'row',
          fields: [
            { name: 'label', label: 'Özellik', type: 'text', required: true, localized: true },
            { name: 'value', label: 'Değer', type: 'text', required: true, localized: true },
          ],
        },
      ],
    },
    {
      name: 'gallery',
      label: 'Galeri',
      type: 'upload',
      relationTo: 'media',
      hasMany: true,
    },
    {
      type: 'row',
      fields: [
        { name: 'cadUrl', label: 'CAD bağlantısı (Onshape vb.)', type: 'text' },
        { name: 'codeUrl', label: 'Kod bağlantısı (GitHub)', type: 'text' },
      ],
    },
    {
      name: 'featured',
      label: 'Ana sayfada öne çıkar',
      type: 'checkbox',
      defaultValue: false,
      admin: { position: 'sidebar' },
    },
    slugField('name'),
    ...orderingFields,
  ],
}
