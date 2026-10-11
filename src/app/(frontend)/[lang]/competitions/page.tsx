import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

import { MediaImage } from '@/components/site/MediaImage'
import { Container, EmptyState, PageHeader, SectionLabel } from '@/components/site/ui'
import { formatDate, hasLocale } from '@/i18n/config'
import { getDictionary } from '@/i18n/dictionaries'
import { getAwards, getCompetitions } from '@/lib/data'
import { alternatesFor } from '@/lib/site'
import type { Award } from '@/payload-types'

export async function generateMetadata({ params }: PageProps<'/[lang]/competitions'>): Promise<Metadata> {
  const { lang } = await params
  if (!hasLocale(lang)) return {}
  const dict = getDictionary(lang)
  return {
    title: dict.competitions.title,
    alternates: alternatesFor(lang, '/competitions'),
  }
}

export default async function CompetitionsPage({ params }: PageProps<'/[lang]/competitions'>) {
  const { lang } = await params
  if (!hasLocale(lang)) notFound()
  const dict = getDictionary(lang)
  const [competitions, awards] = await Promise.all([getCompetitions(lang), getAwards(lang)])

  const awardsFor = (id: number) => awards.filter((a) => a.competition === id)
  const looseAwards = awards.filter(
    (a) => a.competition == null || !competitions.some((c) => c.id === a.competition),
  )

  // Sezonlara göre grupla (en yeni sezon üstte).
  const seasons = new Map<string, typeof competitions>()
  for (const c of competitions) {
    const key = c.season || (c.date ? String(new Date(c.date).getFullYear()) : '—')
    seasons.set(key, [...(seasons.get(key) ?? []), c])
  }

  return (
    <>
      <PageHeader title={dict.competitions.title}>
        {awards.length > 0 && (
          <p className="label mt-10 text-accent">
            {String(competitions.length).padStart(2, '0')} · {dict.home.stats.competitions} &nbsp;/&nbsp;{' '}
            {String(awards.length).padStart(2, '0')} · {dict.home.stats.awards}
          </p>
        )}
      </PageHeader>

      <Container className="py-20">
        {competitions.length === 0 && awards.length === 0 ? (
          <EmptyState text={dict.common.empty} />
        ) : (
          <div className="space-y-24">
            {[...seasons.entries()].map(([season, items]) => (
              <section key={season} className="grid gap-8 lg:grid-cols-[14rem_1fr]">
                <div className="lg:sticky lg:top-28 lg:self-start">
                  <p className="label text-muted">{dict.common.season}</p>
                  <h2 className="display mt-2 text-5xl text-accent">{season}</h2>
                </div>
                <ol className="relative border-l border-line">
                  {items.map((c) => {
                    const cAwards = awardsFor(c.id)
                    return (
                      <li key={c.id} className="relative pb-14 pl-8 last:pb-0 sm:pl-12">
                        <span
                          aria-hidden
                          className="absolute top-1.5 -left-[7px] size-3.5 rotate-45 border-2 border-accent bg-ink"
                        />
                        <div className="grid gap-6 md:grid-cols-[1fr_auto]">
                          <div>
                            <p className="label text-muted">
                              {[formatDate(lang, c.date), c.location].filter(Boolean).join(' · ')}
                            </p>
                            <h3 className="mt-3 font-display text-2xl leading-tight font-bold [font-stretch:115%] sm:text-3xl">
                              {c.name}
                            </h3>
                            {c.result && (
                              <p className="mt-4 inline-flex items-center gap-3 bg-brand px-3 py-1.5">
                                <span className="font-display font-bold">{c.result}</span>
                              </p>
                            )}
                            {c.description && (
                              <p className="mt-5 max-w-2xl leading-relaxed text-paper/75">{c.description}</p>
                            )}
                            {cAwards.length > 0 && <AwardList awards={cAwards} lang={lang} />}
                          </div>
                          {c.image && (
                            <div className="relative aspect-[4/3] w-full overflow-hidden border border-line md:w-64">
                              <MediaImage media={c.image} sizes="(min-width: 768px) 16rem, 100vw" />
                            </div>
                          )}
                        </div>
                      </li>
                    )
                  })}
                </ol>
              </section>
            ))}

            {looseAwards.length > 0 && (
              <section>
                <SectionLabel>{competitions.length ? dict.competitions.otherAwards : dict.competitions.awards}</SectionLabel>
                <AwardList awards={looseAwards} lang={lang} large />
              </section>
            )}
          </div>
        )}
      </Container>
    </>
  )
}

function AwardList({ awards, lang, large }: { awards: Award[]; lang: 'tr' | 'en'; large?: boolean }) {
  return (
    <ul className={`mt-6 grid gap-3 ${large ? 'sm:grid-cols-2 lg:grid-cols-3' : ''}`}>
      {awards.map((a) => (
        <li key={a.id} className="ticks flex items-start gap-4 border border-line bg-ink-2 p-4">
          <span aria-hidden className="mt-0.5 text-xl text-accent">
            ✦
          </span>
          <div>
            <p className="font-display font-bold">{a.title}</p>
            {a.date && <p className="label mt-1 text-[0.62rem] text-muted">{formatDate(lang, a.date)}</p>}
            {a.description && <p className="mt-2 text-sm leading-relaxed text-paper/70">{a.description}</p>}
          </div>
        </li>
      ))}
    </ul>
  )
}
