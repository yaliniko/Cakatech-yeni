import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'

import { Container, PageHeader } from '@/components/site/ui'
import { hasLocale, localizePath } from '@/i18n/config'
import { getDictionary } from '@/i18n/dictionaries'
import { APPS } from '@/lib/apps'
import { alternatesFor } from '@/lib/site'

export async function generateMetadata({ params }: PageProps<'/[lang]/apps'>): Promise<Metadata> {
  const { lang } = await params
  if (!hasLocale(lang)) return {}
  const dict = getDictionary(lang)
  return { title: dict.apps.title, alternates: alternatesFor(lang, '/apps') }
}

export default async function AppsPage({ params }: PageProps<'/[lang]/apps'>) {
  const { lang } = await params
  if (!hasLocale(lang)) notFound()
  const dict = getDictionary(lang)

  return (
    <>
      <PageHeader title={dict.apps.title} />
      <Container className="py-20">
        <ul className="grid gap-6 md:grid-cols-2">
          {APPS.map((app) => (
            <li key={app.slug}>
              <Link
                href={localizePath(lang, `/apps/${app.slug}`)}
                className="group card flex h-full flex-col p-8 sm:p-10"
              >
                <div className="flex">
                  <span className="label bg-accent px-2 py-1 text-[0.62rem] text-ink">{app.tag[lang]}</span>
                </div>
                <h2 className="display mt-16 text-[clamp(1.9rem,3.4vw,2.8rem)] transition group-hover:text-accent">
                  {app.title[lang]}
                </h2>
                <p className="mt-5 leading-relaxed text-muted">{app.summary[lang]}</p>
                <span className="label mt-auto flex items-center gap-2 pt-10 text-paper/80">
                  <span aria-hidden className="transition group-hover:translate-x-1">
                    →
                  </span>
                </span>
                <span
                  aria-hidden
                  className="absolute inset-x-0 bottom-0 h-1 origin-left scale-x-0 bg-brand transition duration-500 group-hover:scale-x-100"
                />
              </Link>
            </li>
          ))}
        </ul>
      </Container>
    </>
  )
}
