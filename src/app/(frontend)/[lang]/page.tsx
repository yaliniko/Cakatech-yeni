import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'

import { SponsorTile } from '@/components/site/cards'
import { ArrowLink, Container, Hazard, SectionLabel } from '@/components/site/ui'
import { formatDate, hasLocale, localizePath } from '@/i18n/config'
import { getDictionary } from '@/i18n/dictionaries'
import { getAwards, getCounts, getSponsors } from '@/lib/data'
import { alternatesFor } from '@/lib/site'

export async function generateMetadata({ params }: PageProps<'/[lang]'>): Promise<Metadata> {
  const { lang } = await params
  if (!hasLocale(lang)) return {}
  return { alternates: alternatesFor(lang, '/') }
}

export default async function HomePage({ params }: PageProps<'/[lang]'>) {
  const { lang } = await params
  if (!hasLocale(lang)) notFound()
  const dict = getDictionary(lang)
  const t = dict.home
  const href = (path: string) => localizePath(lang, path)

  const [counts, awards, sponsors] = await Promise.all([getCounts(), getAwards(lang), getSponsors(lang)])

  const stats = [
    { value: counts.members, label: t.stats.members },
    { value: counts.competitions, label: t.stats.competitions },
    { value: counts.awards, label: t.stats.awards },
  ]
  const hasStats = stats.some((s) => s.value > 0)

  return (
    <>
      {/* HERO */}
      <section className="relative isolate overflow-hidden border-b border-line">
        <div aria-hidden className="grid-paper absolute inset-0 -z-10 [mask-image:radial-gradient(ellipse_at_70%_40%,black_20%,transparent_75%)]" />
        <div aria-hidden className="absolute -top-60 -left-40 -z-10 size-[44rem] rounded-full bg-brand/15 blur-[120px]" />
        <p
          aria-hidden
          className="display outline-text pointer-events-none absolute -bottom-[0.18em] left-1/2 -z-10 -translate-x-1/2 text-[clamp(8rem,30vw,28rem)] leading-none whitespace-nowrap select-none"
        >
          25160
        </p>

        <Container className="flex flex-col justify-center pt-32 pb-24 sm:pt-40 lg:min-h-svh lg:pb-32">
          <div className="stagger max-w-4xl">
            <p className="label flex items-center gap-3 text-accent">
              <span aria-hidden className="hazard h-3 w-10" />
              {t.eyebrow} · #25160
            </p>
            <h1 className="display mt-8 text-[clamp(3.2rem,9vw,8.4rem)]">
              <span className="block">{t.heroTitle[0]}</span>
              <span className="block text-brand">{t.heroTitle[1]}</span>
            </h1>
            <p className="mt-8 max-w-xl text-lg leading-relaxed text-paper/75">{t.heroBody}</p>
            <div className="mt-10 flex flex-wrap gap-3">
              <ArrowLink href={href('/team')}>{t.ctaPrimary}</ArrowLink>
              <ArrowLink href={href('/sponsors')} variant="ghost">
                {t.ctaSecondary}
              </ArrowLink>
            </div>
          </div>
        </Container>
      </section>

      {/* SAYILAR */}
      {hasStats && (
        <section aria-label="Çakatech" className="border-b border-line bg-ink-2">
          <Container>
            <dl className="grid grid-cols-3">
              {stats.map((s, i) => (
                <div
                  key={s.label}
                  className={`flex flex-col gap-2 py-10 sm:py-12 ${i > 0 ? 'border-l border-line pl-5 sm:pl-10' : ''}`}
                >
                  <dt className="label order-2 text-muted">{s.label}</dt>
                  <dd className="display order-1 text-4xl text-paper sm:text-6xl">
                    {String(s.value).padStart(2, '0')}
                  </dd>
                </div>
              ))}
            </dl>
          </Container>
        </section>
      )}

      {/* ÖDÜLLER (kayan bant) */}
      {awards.length > 0 && (
        <section aria-label={dict.competitions.awards} className="overflow-hidden border-b border-line py-8">
          <div className="flex w-max animate-marquee hover:[animation-play-state:paused]">
            {[0, 1].map((copy) => (
              <ul key={copy} aria-hidden={copy === 1} className="flex shrink-0 items-center">
                {awards.map((a) => (
                  <li key={`${copy}-${a.id}`} className="flex items-center gap-6 px-6">
                    <span aria-hidden className="text-2xl text-accent">✦</span>
                    <span className="display text-3xl whitespace-nowrap sm:text-4xl">{a.title}</span>
                    {a.date && (
                      <span className="label whitespace-nowrap text-muted">{formatDate(lang, a.date, 'short')}</span>
                    )}
                  </li>
                ))}
              </ul>
            ))}
          </div>
        </section>
      )}

      {/* SPONSORLAR */}
      {sponsors.length > 0 && (
        <section className="py-24 sm:py-28">
          <Container>
            <SectionLabel>{t.sponsorsLabel}</SectionLabel>
            <ul className="mt-12 grid grid-cols-2 gap-px border border-line bg-line sm:grid-cols-3 lg:grid-cols-5">
              {sponsors.map((s) => (
                <li key={s.id} className="bg-ink">
                  <SponsorTile name={s.name} url={s.url} logo={s.logo} />
                </li>
              ))}
            </ul>
          </Container>
        </section>
      )}

      {/* ÇAĞRI */}
      <section className="pt-24">
        <Container>
          <div className="relative overflow-hidden bg-brand">
            <Hazard className="h-3" />
            <div aria-hidden className="grid-paper absolute inset-0 opacity-40" />
            <div className="relative flex flex-col gap-8 px-8 py-14 sm:flex-row sm:items-center sm:justify-between sm:px-14">
              <h2 className="display text-[clamp(2.2rem,5vw,4.2rem)]">{t.ctaTitle}</h2>
              <Link
                href={`${href('/sponsors')}#basvuru`}
                className="btn shrink-0 self-start bg-ink text-paper hover:bg-ink-3 sm:self-auto"
              >
                {dict.nav.becomeSponsor} <span aria-hidden className="arrow">→</span>
              </Link>
            </div>
          </div>
        </Container>
      </section>
    </>
  )
}
