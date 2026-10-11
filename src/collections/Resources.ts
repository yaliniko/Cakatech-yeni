import type { CollectionConfig } from 'payload'

import { activeOrLoggedIn, loggedIn } from '@/access'
import { revalidateHooks } from '@/hooks/revalidateSite'
import { orderingFields } from '@/fields'

// Kaynaklar sayfası: açık kaynak kod, CAD, portfolyo, video bağlantıları.
export const Resources: CollectionConfig = {
  slug: 'resources',
  labels: { singular: 'Kaynak', plural: 'Kaynaklar' },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'type'],
    group: 'İçerik',
  },
  defaultSort: 'order',
  access: { read: activeOrLoggedIn, create: loggedIn, update: loggedIn, delete: loggedIn },
  hooks: revalidateHooks,
  fields: [
    { name: 'title', label: 'Başlık', type: 'text', required: true, localized: true },
    {
      type: 'row',
      fields: [
        {
          name: 'type',
          label: 'Tür',
          type: 'select',
          required: true,
          options: [
            { label: 'Kod', value: 'code' },
            { label: 'CAD', value: 'cad' },
            { label: 'Portfolyo', value: 'portfolio' },
            { label: 'Video', value: 'video' },
            { label: 'Diğer', value: 'other' },
          ],
        },
        { name: 'url', label: 'Bağlantı', type: 'text', required: true },
      ],
    },
    { name: 'description', label: 'Açıklama', type: 'textarea', localized: true },
    { name: 'image', label: 'Görsel', type: 'upload', relationTo: 'media' },
    ...orderingFields,
  ],
}
