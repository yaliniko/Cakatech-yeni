import type { CollectionConfig } from 'payload'

import { anyone, loggedIn } from '@/access'

export const Media: CollectionConfig = {
  slug: 'media',
  labels: { singular: 'Görsel', plural: 'Görseller' },
  admin: { group: 'İçerik' },
  access: {
    read: anyone,
    create: loggedIn,
    update: loggedIn,
    delete: loggedIn,
  },
  fields: [
    {
      name: 'alt',
      label: 'Açıklama (alt metin)',
      type: 'text',
      required: true,
      localized: true,
      admin: {
        description: 'Görme engelliler ve arama motorları için görselde ne olduğunu yaz.',
      },
    },
  ],
  upload: {
    mimeTypes: ['image/*'],
    focalPoint: true,
    // Orijinal dosya olduğu gibi saklanır (SVG logolar bozulmasın); boyutlar webp üretilir.
    imageSizes: [
      { name: 'thumb', width: 400, formatOptions: { format: 'webp', options: { quality: 80 } } },
      { name: 'card', width: 900, formatOptions: { format: 'webp', options: { quality: 82 } } },
      { name: 'hero', width: 1920, formatOptions: { format: 'webp', options: { quality: 82 } } },
    ],
    adminThumbnail: 'thumb',
  },
}
