import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

import { SponsorTile } from '@/components/site/cards'
import { Container, EmptyState, PageHeader } from '@/components/site/ui'
import { SPONSOR_TIERS } from '@/collections/Sponsors'
import { hasLocale } from '@/i18n/config'
import { getDictionary } from '@/i18n/dictionaries'
import { getSponsors } from '@/lib/data'
import { alternatesFor } from '@/lib/site'

import { InquiryForm } from './InquiryForm'

export async function generateMetadata({ params }: PageProps<'/[lang]/sponsors'>): Promise<Metadata> {
  const { lang } = await params
  if (!hasLocale(lang)) return {}
  const dict = getDictionary(lang)
  return { title: dict.sponsors.title, alternates: alternatesFor(lang, '/sponsors') }
}

// Üst kategoriler daha büyük karolarla gösterilir.
const TILE_GRID: Record<string, string> = {
  platinum: 'grid-cols-1 sm:grid-cols-2',
  gold: 'grid-cols-2 lg:grid-cols-3',
  silver: 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-4',
  bronze: 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-5',
  partner: 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-5',
}

export default async function SponsorsPage({ params }: PageProps<'/[lang]/sponsors'>) {
  const { lang } = await params
  if (!hasLocale(lang)) notFound()
  const dict = getDictionary(lang)
  const sponsors = await getSponsors(lang)

  const tiers = SPONSOR_TIERS.map(({ value }) => ({
    value,
    label: dict.sponsors.tiers[value as keyof typeof dict.sponsors.tiers],
    items: sponsors.filter((s) => s.tier === value),
  })).filter((t) => t.items.length > 0)

  return (
    <>
      <PageHeader title={dict.sponsors.title} />

      <Container className="py-20">
        {tiers.length === 0 ? (
          <EmptyState text={dict.common.empty} />
        ) : (
          <div className="space-y-16">
            {tiers.map((tier) => (
              <section key={tier.value} aria-labelledby={`tier-${tier.value}`}>
                <h2 id={`tier-${tier.value}`} className="label flex items-center gap-3 text-accent">
                  <span aria-hidden className="hazard h-2.5 w-8" />
                  {tier.label}
                </h2>
                <ul className={`mt-6 grid gap-px border border-line bg-line ${TILE_GRID[tier.value]}`}>
                  {tier.items.map((s) => (
                    <li key={s.id} className="flex flex-col bg-ink">
                      <SponsorTile name={s.name} url={s.url} logo={s.logo} />
                      {s.description && tier.value !== 'partner' && (
                        <p className="border-t border-line px-6 py-4 text-sm leading-relaxed text-muted">
                          {s.description}
                        </p>
                      )}
                    </li>
                  ))}
                </ul>
              </section>
            ))}
          </div>
        )}
      </Container>

      <section id="basvuru" className="scroll-mt-24 border-t border-line bg-ink-2 py-24">
        <Container className="max-w-3xl">
          <h2 className="display text-[clamp(2.2rem,4.5vw,3.8rem)]">{dict.form.title}</h2>
          <div className="mt-10">
            <InquiryForm t={dict.form} />
          </div>
        </Container>
      </section>
    </>
  )
}
