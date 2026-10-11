import type { Metadata } from 'next'
import { Archivo, Instrument_Sans, JetBrains_Mono } from 'next/font/google'
import { notFound } from 'next/navigation'
import React from 'react'

import { SiteFooter } from '@/components/site/SiteFooter'
import { SiteHeader } from '@/components/site/SiteHeader'
import { hasLocale, locales, localizePath } from '@/i18n/config'
import { getDictionary } from '@/i18n/dictionaries'
import { siteUrl } from '@/lib/site'

import '../styles.css'

const display = Archivo({
  subsets: ['latin', 'latin-ext'],
  axes: ['wdth'],
  variable: '--nf-display',
  display: 'swap',
})

const body = Instrument_Sans({
  subsets: ['latin', 'latin-ext'],
  variable: '--nf-body',
  display: 'swap',
})

const mono = JetBrains_Mono({
  subsets: ['latin', 'latin-ext'],
  variable: '--nf-mono',
  display: 'swap',
})

// İçerik panelden değişince sayfalar anında yenilenir (bkz. hooks/revalidateSite);
// bu süre yalnızca güvenlik ağı.
export const revalidate = 600

export function generateStaticParams() {
  return locales.map((lang) => ({ lang }))
}

export async function generateMetadata({ params }: LayoutProps<'/[lang]'>): Promise<Metadata> {
  const { lang } = await params
  if (!hasLocale(lang)) return {}
  const dict = getDictionary(lang)
  return {
    metadataBase: new URL(siteUrl),
    title: { default: dict.meta.title, template: '%s · Çakatech #25160' },
    description: dict.meta.description,
    openGraph: {
      type: 'website',
      siteName: 'Çakatech #25160',
      locale: lang === 'tr' ? 'tr_TR' : 'en_GB',
      images: ['/logo.jpg'],
    },
    icons: { icon: '/logo.jpg' },
  }
}

export default async function RootLayout({ children, params }: LayoutProps<'/[lang]'>) {
  const { lang } = await params
  if (!hasLocale(lang)) notFound()
  const dict = getDictionary(lang)
  const href = (path: string) => localizePath(lang, path)

  const items = [
    { href: href('/team'), label: dict.nav.team },
    { href: href('/competitions'), label: dict.nav.competitions },
    { href: href('/resources'), label: dict.nav.resources },
    { href: href('/apps'), label: dict.nav.apps },
    { href: href('/sponsors'), label: dict.nav.sponsors },
  ]

  return (
    <html lang={lang} className={`${display.variable} ${body.variable} ${mono.variable}`}>
      <body className="grain">
        <a
          href="#icerik"
          className="label sr-only z-[70] bg-accent px-4 py-3 text-ink focus:not-sr-only focus:fixed focus:top-4 focus:left-4"
        >
          {dict.nav.skip}
        </a>
        <SiteHeader
          lang={lang}
          homeHref={href('/')}
          items={items}
          cta={{ href: `${href('/sponsors')}#basvuru`, label: dict.nav.becomeSponsor }}
          labels={{ menu: dict.nav.menu, close: dict.nav.close, language: dict.nav.language }}
        />
        <main id="icerik">{children}</main>
        <SiteFooter lang={lang} dict={dict} />
      </body>
    </html>
  )
}
