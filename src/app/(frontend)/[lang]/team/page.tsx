import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

import { MediaImage } from '@/components/site/MediaImage'
import { Container, EmptyState, Monogram, PageHeader } from '@/components/site/ui'
import { SUBTEAMS } from '@/collections/Members'
import { hasLocale } from '@/i18n/config'
import { getDictionary } from '@/i18n/dictionaries'
import { getMembers } from '@/lib/data'
import { alternatesFor } from '@/lib/site'
import type { Member } from '@/payload-types'

export async function generateMetadata({ params }: PageProps<'/[lang]/team'>): Promise<Metadata> {
  const { lang } = await params
  if (!hasLocale(lang)) return {}
  const dict = getDictionary(lang)
  return { title: dict.team.title, alternates: alternatesFor(lang, '/team') }
}

export default async function TeamPage({ params }: PageProps<'/[lang]/team'>) {
  const { lang } = await params
  if (!hasLocale(lang)) notFound()
  const dict = getDictionary(lang)
  const members = await getMembers(lang)

  // Alt takımlara göre grupla (panel sırası korunur); alt takımı boş olanlar en sonda.
  const order = [...SUBTEAMS.map((s) => s.value), 'other'] as const
  const groups = order
    .map((key) => ({
      key,
      label: dict.subteams[key as keyof typeof dict.subteams],
      members: members.filter((m) => (m.subteam ?? 'other') === key),
    }))
    .filter((g) => g.members.length > 0)

  return (
    <>
      <PageHeader title={dict.team.title}>
        {members.length > 0 && (
          <p className="label mt-10 text-accent">
            {String(members.length).padStart(2, '0')} · {dict.home.stats.members}
          </p>
        )}
      </PageHeader>

      <Container className="py-20">
        {groups.length === 0 ? (
          <EmptyState text={dict.common.empty} />
        ) : (
          <div className="space-y-24">
            {groups.map((group) => (
              <section key={group.key} aria-labelledby={`grp-${group.key}`}>
                <div className="flex items-baseline gap-5 border-b border-line pb-5">
                  <h2 id={`grp-${group.key}`} className="display text-3xl sm:text-4xl">
                    {group.label}
                  </h2>
                  <span className="label ml-auto text-muted">{group.members.length}</span>
                </div>
                <ul className="mt-10 grid grid-cols-2 gap-x-5 gap-y-12 md:grid-cols-3 lg:grid-cols-4">
                  {group.members.map((m) => (
                    <li key={m.id}>
                      <MemberCard member={m} />
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

function MemberCard({ member }: { member: Member }) {
  const links = [
    member.instagramUrl && { href: member.instagramUrl, label: 'Instagram' },
    member.linkedinUrl && { href: member.linkedinUrl, label: 'LinkedIn' },
  ].filter(Boolean) as { href: string; label: string }[]

  return (
    <article className="group">
      <div className="ticks relative aspect-[4/5] p-2">
        <div className="relative h-full w-full overflow-hidden bg-ink-3">
          {member.photo ? (
            <MediaImage
              media={member.photo}
              sizes="(min-width: 1024px) 25vw, (min-width: 768px) 33vw, 50vw"
              className="grayscale transition duration-700 group-hover:scale-[1.03] group-hover:grayscale-0"
            />
          ) : (
            <Monogram name={member.name} className="absolute inset-0" />
          )}
          <span
            aria-hidden
            className="absolute inset-x-0 bottom-0 h-1 origin-left scale-x-0 bg-brand transition duration-500 group-hover:scale-x-100"
          />
        </div>
      </div>
      <h3 className="mt-4 font-display text-lg leading-tight font-bold [font-stretch:110%]">{member.name}</h3>
      {member.role && <p className="label mt-1.5 text-[0.66rem] text-muted">{member.role}</p>}
      {member.bio && <p className="mt-3 text-sm leading-relaxed text-paper/70">{member.bio}</p>}
      {links.length > 0 && (
        <ul className="mt-3 flex gap-4">
          {links.map((l) => (
            <li key={l.label}>
              <a
                href={l.href}
                target="_blank"
                rel="noopener noreferrer"
                className="label text-[0.62rem] text-paper/60 transition hover:text-accent"
              >
                {l.label} ↗
              </a>
            </li>
          ))}
        </ul>
      )}
    </article>
  )
}
