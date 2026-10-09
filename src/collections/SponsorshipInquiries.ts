import type { CollectionConfig } from 'payload'

import { loggedIn } from '@/access'
import { isReadField } from '@/fields'

// "Sponsor Ol" formundan gelen başvurular — panelde Gelen Kutusu'nda görünür.
// Ziyaretçi API'den doğrudan yazamaz; kayıt sitedeki form üzerinden (sunucu tarafında) oluşturulur.
export const SponsorshipInquiries: CollectionConfig = {
  slug: 'sponsorship-inquiries',
  labels: { singular: 'Sponsorluk Başvurusu', plural: 'Sponsorluk Başvuruları' },
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'organization', 'email', 'isRead', 'createdAt'],
    group: 'Gelen Kutusu',
  },
  defaultSort: '-createdAt',
  access: {
    read: loggedIn,
    create: () => false,
    update: loggedIn,
    delete: loggedIn,
  },
  fields: [
    {
      type: 'row',
      fields: [
        { name: 'name', label: 'Ad soyad', type: 'text', required: true, admin: { readOnly: true } },
        { name: 'organization', label: 'Kurum / firma', type: 'text', admin: { readOnly: true } },
      ],
    },
    {
      type: 'row',
      fields: [
        { name: 'email', label: 'E-posta', type: 'email', required: true, admin: { readOnly: true } },
        { name: 'phone', label: 'Telefon', type: 'text', admin: { readOnly: true } },
      ],
    },
    { name: 'message', label: 'Mesaj', type: 'textarea', required: true, admin: { readOnly: true } },
    isReadField,
  ],
}
