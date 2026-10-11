import config from '@payload-config'
import { getPayload } from 'payload'
import { cache } from 'react'

import type { Locale } from '@/i18n/config'

// Sitenin okuduğu tüm veriler. overrideAccess: false → ziyaretçi erişim kuralları uygulanır
// (yalnızca "Sitede göster" işaretli kayıtlar ve yayınlanmış yazılar gelir).
export const getPayloadClient = cache(async () => getPayload({ config }))

const base = (lang: Locale) =>
  ({ locale: lang, fallbackLocale: 'tr', overrideAccess: false, depth: 1 }) as const

export const getMembers = cache(async (lang: Locale) => {
  const payload = await getPayloadClient()
  const { docs } = await payload.find({
    collection: 'members',
    ...base(lang),
    sort: ['order', 'name'],
    limit: 200,
  })
  return docs
})

export const getCompetitions = cache(async (lang: Locale) => {
  const payload = await getPayloadClient()
  const { docs } = await payload.find({
    collection: 'competitions',
    ...base(lang),
    sort: ['-date', 'order'],
    limit: 200,
  })
  return docs
})

export const getAwards = cache(async (lang: Locale) => {
  const payload = await getPayloadClient()
  const { docs } = await payload.find({
    collection: 'awards',
    ...base(lang),
    depth: 0,
    sort: ['-date', 'order'],
    limit: 200,
  })
  return docs
})

export const getSponsors = cache(async (lang: Locale) => {
  const payload = await getPayloadClient()
  const { docs } = await payload.find({
    collection: 'sponsors',
    ...base(lang),
    sort: ['order', 'name'],
    limit: 200,
  })
  return docs
})

export const getResources = cache(async (lang: Locale) => {
  const payload = await getPayloadClient()
  const { docs } = await payload.find({
    collection: 'resources',
    ...base(lang),
    sort: ['order', 'title'],
    limit: 200,
  })
  return docs
})

export const getCounts = cache(async () => {
  const payload = await getPayloadClient()
  const count = async (collection: 'members' | 'competitions' | 'awards') =>
    (await payload.count({ collection, overrideAccess: false })).totalDocs
  const [members, competitions, awards] = await Promise.all([
    count('members'),
    count('competitions'),
    count('awards'),
  ])
  return { members, competitions, awards }
})
