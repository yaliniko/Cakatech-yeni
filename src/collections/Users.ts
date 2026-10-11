import type { CollectionConfig } from 'payload'

import { isAdmin, isAdminField, isAdminOrSelf, loggedIn } from '@/access'

export const Users: CollectionConfig = {
  slug: 'users',
  labels: { singular: 'Kullanıcı', plural: 'Kullanıcılar' },
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'email', 'roles'],
    group: 'Ayarlar',
  },
  auth: true,
  access: {
    admin: ({ req: { user } }) => Boolean(user),
    read: loggedIn,
    create: isAdmin,
    update: isAdminOrSelf,
    delete: isAdmin,
  },
  hooks: {
    // İlk oluşturulan hesap (kurulumdaki "ilk kullanıcı" ekranı) otomatik Yönetici olur.
    beforeChange: [
      async ({ data, operation, req }) => {
        if (operation !== 'create') return data
        const { totalDocs } = await req.payload.count({ collection: 'users', req })
        if (totalDocs === 0) data.roles = ['admin']
        return data
      },
    ],
  },
  fields: [
    { name: 'name', label: 'Ad soyad', type: 'text', required: true },
    {
      name: 'roles',
      label: 'Rol',
      type: 'select',
      hasMany: true,
      required: true,
      defaultValue: ['editor'],
      saveToJWT: true,
      options: [
        { label: 'Yönetici', value: 'admin' },
        { label: 'Editör', value: 'editor' },
      ],
      access: { create: isAdminField, update: isAdminField },
    },
  ],
}
