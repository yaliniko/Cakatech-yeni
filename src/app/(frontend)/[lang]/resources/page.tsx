import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

import { MediaImage } from '@/components/site/MediaImage'
import { Container, EmptyState, PageHeader } from '@/components/site/ui'
import { hasLocale } from '@/i18n/config'
import { getDictionary } from '@/i18n/dictionaries'
import { getResources } from '@/lib/data'
import { alternatesFor } from '@/lib/site'

const TYPE_ORDER = ['code', 'cad', 'portfolio', 'video', 'other'] as const

export async function generateMetadata({ params }: PageProps<'/[lang]/resources'>): Promise<Metadata> {
  const { lang } = await params
  if (!hasLocale(lang)) return {}
  const dict = getDictionary(lang)
  return {
    title: dict.resources.title,
    alternates: alternatesFor(lang, '/resources'),
  }
}

export default async function ResourcesPage({ params }: PageProps<'/[lang]/resources'>) {
  const { lang } = await params
  if (!hasLocale(lang)) notFound()
  const dict = getDictionary(lang)
  const resources = await getResources(lang)

  const groups = TYPE_ORDER.map((type) => ({
    type,
    items: resources.filter((r) => r.type === type),
  })).filter((g) => g.items.length > 0)

  return (
    <>
      <PageHeader title={dict.resources.title} />
      <Container className="py-20">
        {groups.length === 0 ? (
          <EmptyState text={dict.common.empty} />
        ) : (
          <div className="space-y-20">
            {groups.map((group) => (
              <section key={group.type} aria-labelledby={`res-${group.type}`}>
                <h2
                  id={`res-${group.type}`}
                  className="display flex items-baseline gap-4 border-b border-line pb-5 text-3xl"
                >
                  {dict.resources.types[group.type]}
                  <span className="label ml-auto text-muted">{group.items.length}</span>
                </h2>
                <ul className="mt-2">
                  {group.items.map((r, i) => (
                    <li key={r.id}>
                      <a
                        href={r.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group grid grid-cols-[2.5rem_1fr_auto] items-center gap-4 border-b border-line py-6 transition hover:bg-ink-2 sm:grid-cols-[3rem_auto_1fr_auto] sm:gap-6 sm:px-4"
                      >
                        <span className="label text-muted transition group-hover:text-accent">
                          {String(i + 1).padStart(2, '0')}
                        </span>
                        {r.image ? (
                          <span className="relative hidden h-16 w-24 overflow-hidden border border-line sm:block">
                            <MediaImage media={r.image} size="thumb" sizes="96px" />
                          </span>
                        ) : (
                          <span aria-hidden className="hidden sm:block sm:w-0" />
                        )}
                        <span>
                          <span className="block font-display text-xl font-bold [font-stretch:110%] transition group-hover:text-accent">
                            {r.title}
                          </span>
                          {r.description && (
                            <span className="mt-1 block text-sm leading-relaxed text-muted">{r.description}</span>
                          )}
                        </span>
                        <span className="label flex items-center gap-2 text-paper/70 transition group-hover:text-accent">
                          <span aria-hidden>↗</span>
                        </span>
                      </a>
                    </li>
                  ))}
                </ul>
              </section>
            ))}
          </div>
        )}
      </Container>
    </>
  )
}
