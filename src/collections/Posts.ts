import type { CollectionConfig } from 'payload'

import { loggedIn, publishedOrLoggedIn } from '@/access'
import { slugField } from '@/fields'

// Haberler + sosyal etki (STEM etkinlikleri) yazıları. Taslak olarak kaydedilip sonra yayınlanabilir.
export const Posts: CollectionConfig = {
  slug: 'posts',
  labels: { singular: 'Yazı', plural: 'Haberler & Etkinlikler' },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'category', 'publishedAt', '_status'],
    group: 'İçerik',
  },
  defaultSort: '-publishedAt',
  versions: { drafts: true },
  access: { read: publishedOrLoggedIn, create: loggedIn, update: loggedIn, delete: loggedIn },
  fields: [
    { name: 'title', label: 'Başlık', type: 'text', required: true, localized: true },
    {
      name: 'excerpt',
      label: 'Kısa özet',
      type: 'textarea',
      localized: true,
      admin: { description: 'Liste ve paylaşım kartlarında görünür (1-2 cümle).' },
    },
    { name: 'heroImage', label: 'Kapak görseli', type: 'upload', relationTo: 'media' },
    { name: 'content', label: 'İçerik', type: 'richText', localized: true },
    {
      name: 'category',
      label: 'Kategori',
      type: 'select',
      required: true,
      defaultValue: 'news',
      options: [
        { label: 'Haber', value: 'news' },
        { label: 'Sosyal etki / STEM', value: 'outreach' },
      ],
      admin: { position: 'sidebar' },
    },
    {
      name: 'publishedAt',
      label: 'Yayın tarihi',
      type: 'date',
      admin: { position: 'sidebar', date: { pickerAppearance: 'dayOnly' } },
      hooks: {
        beforeChange: [
          ({ value, siblingData }) =>
            value ?? (siblingData._status === 'published' ? new Date().toISOString() : value),
        ],
      },
    },
    slugField('title'),
  ],
}
