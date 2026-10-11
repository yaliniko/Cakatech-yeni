import type { MetadataRoute } from 'next'

import { locales, localizePath } from '@/i18n/config'
import { APPS } from '@/lib/apps'
import { siteUrl } from '@/lib/site'

const STATIC_PATHS = ['/', '/team', '/competitions', '/resources', '/apps', '/sponsors']

export default function sitemap(): MetadataRoute.Sitemap {
  const paths = [...STATIC_PATHS, ...APPS.map((a) => `/apps/${a.slug}`)]
  return paths.map((path) => ({
    url: `${siteUrl}${localizePath('tr', path)}`,
    alternates: {
      languages: Object.fromEntries(locales.map((l) => [l, `${siteUrl}${localizePath(l, path)}`])),
    },
  }))
}
