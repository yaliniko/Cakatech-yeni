import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'

import { Container } from '@/components/site/ui'
import { hasLocale, locales, localizePath } from '@/i18n/config'
import { getDictionary } from '@/i18n/dictionaries'
import { APPS, getApp } from '@/lib/apps'
import { alternatesFor } from '@/lib/site'

import { AppFrame } from '../AppFrame'

export const dynamicParams = false

export function generateStaticParams() {
  return locales.flatMap((lang) => APPS.map((app) => ({ lang, slug: app.slug })))
}

export async function generateMetadata({ params }: PageProps<'/[lang]/apps/[slug]'>): Promise<Metadata> {
  const { lang, slug } = await params
  const app = getApp(slug)
  if (!hasLocale(lang) || !app) return {}
  return {
    title: app.title[lang],
    description: app.summary[lang],
    alternates: alternatesFor(lang, `/apps/${slug}`),
  }
}

export default async function AppPage({ params }: PageProps<'/[lang]/apps/[slug]'>) {
  const { lang, slug } = await params
  const app = getApp(slug)
  if (!hasLocale(lang) || !app) notFound()
  const dict = getDictionary(lang)
  const others = APPS.filter((a) => a.slug !== app.slug)

  return (
    <>
      <header className="relative overflow-hidden">
        <div aria-hidden className="grid-paper absolute inset-0 [mask-image:linear-gradient(to_bottom,black,transparent)]" />
        <Container className="relative pt-32 pb-10 sm:pt-40">
          <Link href={localizePath(lang, '/apps')} className="label text-muted transition hover:text-accent">
            ← {dict.nav.apps}
          </Link>
          <div className="stagger mt-10 grid gap-6 lg:grid-cols-[1fr_auto] lg:items-end">
            <div>
              <p className="label text-accent">{app.tag[lang]}</p>
              <h1 className="display mt-4 text-[clamp(2.4rem,6vw,5rem)]">{app.title[lang]}</h1>
            </div>
          </div>
        </Container>
      </header>

      <Container className="max-w-[90rem]">
        <AppFrame
          src={app.file}
          title={app.title[lang]}
          labels={{ fullscreen: dict.apps.fullscreen, exitFullscreen: dict.apps.exitFullscreen }}
        />
      </Container>

      {others.length > 0 && (
        <Container className="mt-20">
          <p className="label text-muted">{dict.nav.apps}</p>
          <ul className="mt-6 border-t border-line">
            {others.map((a) => (
              <li key={a.slug}>
                <Link
                  href={localizePath(lang, `/apps/${a.slug}`)}
                  className="group flex items-center justify-between gap-6 border-b border-line py-6 transition hover:bg-ink-2 sm:px-4"
                >
                  <span className="font-display text-2xl font-bold [font-stretch:115%] transition group-hover:text-accent">
                    {a.title[lang]}
                  </span>
                  <span aria-hidden className="transition group-hover:translate-x-1">
                    →
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </Container>
      )}
    </>
  )
}
