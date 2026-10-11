import type { CollectionConfig } from 'payload'

import { activeOrLoggedIn, loggedIn } from '@/access'
import { revalidateHooks } from '@/hooks/revalidateSite'
import { orderingFields } from '@/fields'

// Django team.Member.SubTeam ile aynı değerler (veri taşımada birebir eşleşsin).
export const SUBTEAMS = [
  { label: 'Kaptan', value: 'captain' },
  { label: 'Mentor', value: 'mentor' },
  { label: 'Mekanik', value: 'mechanical' },
  { label: 'Yazılım', value: 'software' },
  { label: 'Tasarım / CAD', value: 'design' },
  { label: 'Medya', value: 'media' },
  { label: 'İş Geliştirme', value: 'business' },
]

export const Members: CollectionConfig = {
  slug: 'members',
  labels: { singular: 'Üye', plural: 'Üyeler' },
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'subteam', 'isActive'],
    group: 'İçerik',
  },
  defaultSort: 'order',
  access: { read: activeOrLoggedIn, create: loggedIn, update: loggedIn, delete: loggedIn },
  hooks: revalidateHooks,
  fields: [
    { name: 'name', label: 'Ad soyad', type: 'text', required: true },
    {
      type: 'row',
      fields: [
        { name: 'role', label: 'Görev', type: 'text', localized: true },
        { name: 'subteam', label: 'Alt takım', type: 'select', options: SUBTEAMS },
      ],
    },
    { name: 'photo', label: 'Fotoğraf', type: 'upload', relationTo: 'media' },
    { name: 'bio', label: 'Biyografi', type: 'textarea', localized: true },
    {
      type: 'row',
      fields: [
        { name: 'instagramUrl', label: 'Instagram', type: 'text' },
        { name: 'linkedinUrl', label: 'LinkedIn', type: 'text' },
      ],
    },
    ...orderingFields,
  ],
}
