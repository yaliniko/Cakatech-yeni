import Image from 'next/image'
import Link from 'next/link'

import { type Locale, localizePath } from '@/i18n/config'
import type { Dictionary } from '@/i18n/dictionaries'

import { Container, Hazard } from './ui'

export function SiteFooter({ lang, dict }: { lang: Locale; dict: Dictionary }) {
  const href = (path: string) => localizePath(lang, path)
  const links = [
    { href: href('/team'), label: dict.nav.team },
    { href: href('/competitions'), label: dict.nav.competitions },
    { href: href('/resources'), label: dict.nav.resources },
    { href: href('/apps'), label: dict.nav.apps },
    { href: href('/sponsors'), label: dict.nav.sponsors },
  ]

  return (
    <footer className="relative mt-32 overflow-hidden border-t border-line bg-ink-2">
      <Hazard className="h-2" />
      <Container className="flex flex-col gap-10 py-16 md:flex-row md:items-center md:justify-between">
        <Link href={href('/')} className="inline-flex items-center gap-4">
          <span className="relative size-14 overflow-hidden rounded-full ring-1 ring-line">
            <Image src="/logo.jpg" alt="" fill sizes="56px" />
          </span>
          <span className="flex flex-col">
            <span className="display text-2xl normal-case">
              Çaka<span className="text-brand">tech</span>
            </span>
            <span className="label mt-1 text-[0.62rem] text-accent">FTC #25160</span>
          </span>
        </Link>
        <nav aria-label="Alt menü">
          <ul className="flex flex-wrap gap-x-6 gap-y-3">
            {links.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="label text-paper/70 transition hover:text-accent">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </Container>

      <div aria-hidden className="pointer-events-none select-none">
        <p className="display outline-text -mb-[0.2em] text-center text-[clamp(5rem,22vw,20rem)] leading-none">
          25160
        </p>
      </div>

      <div className="border-t border-line">
        <Container className="flex flex-col gap-3 py-6 text-xs text-muted sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {new Date().getFullYear()} Çakatech · {dict.footer.disclaimer}
          </p>
          <a href="/admin" className="label shrink-0 text-[0.65rem] transition hover:text-paper">
            {dict.footer.panel} ↗
          </a>
        </Container>
      </div>
    </footer>
  )
}
