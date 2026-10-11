// Site dilleri. Türkçe kökte yayınlanır (/takim değil /team gibi ortak yollar kullanılır),
// İngilizce /en önekiyle. Proxy, önek olmayan istekleri içeride /tr'ye yönlendirir.
export const locales = ['tr', 'en'] as const
export type Locale = (typeof locales)[number]
export const defaultLocale: Locale = 'tr'

export const hasLocale = (value: string): value is Locale =>
  (locales as readonly string[]).includes(value)

// Ziyaretçinin gördüğü URL: tr → /team, en → /en/team
export const localizePath = (lang: Locale, path: string) => {
  const clean = path.startsWith('/') ? path : `/${path}`
  if (lang === defaultLocale) return clean
  return clean === '/' ? `/${lang}` : `/${lang}${clean}`
}

export const intlLocale: Record<Locale, string> = { tr: 'tr-TR', en: 'en-GB' }

export const formatDate = (lang: Locale, value?: string | null, style: 'long' | 'short' = 'long') => {
  if (!value) return null
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return null
  return new Intl.DateTimeFormat(intlLocale[lang], {
    day: 'numeric',
    month: style === 'long' ? 'long' : 'short',
    year: 'numeric',
  }).format(date)
}
