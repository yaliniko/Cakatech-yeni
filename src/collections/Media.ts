import type { CollectionConfig } from 'payload'

import { anyone, loggedIn } from '@/access'
import { revalidateHooks } from '@/hooks/revalidateSite'

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
  hooks: revalidateHooks,
  fields: [
    {
      name: 'alt',
      label: 'Alt metin',
      type: 'text',
      required: true,
      localized: true,
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
