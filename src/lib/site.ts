import { type Locale, locales, localizePath } from '@/i18n/config'

// Sitenin kanonik adresi: önce elle verilen, sonra Vercel'in üretim alan adı, yoksa yerel.
export const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ||
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : 'http://localhost:3000')

// Sayfa başına canonical + hreflang bağlantıları.
export const alternatesFor = (lang: Locale, path: string) => ({
  canonical: localizePath(lang, path),
  languages: Object.fromEntries(locales.map((l) => [l, localizePath(l, path)])),
})
