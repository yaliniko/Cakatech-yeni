import type { Access, FieldAccess, Where } from 'payload'

// Roller: 'admin' (Yönetici) her şeyi yapar; 'editor' (Editör) içerik düzenler ama
// kullanıcıları ve site ayarlarını yönetemez. Eski Django sitesindeki iki grubun karşılığı.
type RoleUser = { roles?: ('admin' | 'editor')[] | null } | null | undefined

export const hasRole = (user: RoleUser, role: 'admin' | 'editor') =>
  Boolean(user?.roles?.includes(role))

export const anyone: Access = () => true

export const loggedIn: Access = ({ req: { user } }) => Boolean(user)

export const isAdmin: Access = ({ req: { user } }) => hasRole(user, 'admin')

export const isAdminField: FieldAccess = ({ req: { user } }) => hasRole(user, 'admin')

// Kullanıcı kendi hesabını düzenleyebilir; yönetici herkesinkini.
export const isAdminOrSelf: Access = ({ req: { user } }) => {
  if (!user) return false
  if (hasRole(user, 'admin')) return true
  return { id: { equals: user.id } }
}

// Ziyaretçi yalnızca "aktif" işaretli kayıtları görür; panele girmiş kullanıcı hepsini.
export const activeOrLoggedIn: Access = ({ req: { user } }) => {
  if (user) return true
  return { isActive: { equals: true } } satisfies Where
}

