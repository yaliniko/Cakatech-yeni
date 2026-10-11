'use client'

import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'

import type { Locale } from '@/i18n/config'

type NavItem = { href: string; label: string }

type Props = {
  lang: Locale
  homeHref: string
  items: NavItem[]
  cta: NavItem
  labels: { menu: string; close: string; language: string }
}

// Tarayıcıdaki yol: tr → /team, en → /en/team. Dil değiştirici aynı sayfanın diğer dildeki adresine gider.
const switchLocalePath = (pathname: string, to: Locale) => {
  const bare = pathname === '/en' ? '/' : pathname.startsWith('/en/') ? pathname.slice(3) : pathname
  if (to === 'tr') return bare
  return bare === '/' ? '/en' : `/en${bare}`
}

export function SiteHeader({ lang, homeHref, items, cta, labels }: Props) {
  // Proxy rewrite'ı nedeniyle sunucuda /tr/... gelebilir; tarayıcıdaki öneksiz yola çevir.
  const raw = usePathname() ?? '/'
  const pathname = raw === '/tr' ? '/' : raw.startsWith('/tr/') ? raw.slice(3) : raw
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => setOpen(false), [pathname])

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false)
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  const isActive = (href: string) => pathname === href || pathname.startsWith(`${href}/`)

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-colors duration-500 ${
        scrolled || open ? 'border-b border-line bg-ink/85 backdrop-blur-xl' : 'border-b border-transparent'
      }`}
    >
      <div className="mx-auto flex h-18 max-w-7xl items-center justify-between gap-6 px-5 sm:px-8">
        <Link href={homeHref} className="group flex items-center gap-3" aria-label="Çakatech #25160">
          <span className="relative size-10 overflow-hidden rounded-full ring-1 ring-line transition group-hover:ring-accent">
            <Image src="/logo.jpg" alt="" fill sizes="40px" priority />
          </span>
          <span className="flex flex-col leading-none">
            <span className="display text-[1.05rem] tracking-tight normal-case">
              Çaka<span className="text-brand">tech</span>
            </span>
            <span className="label mt-1 text-[0.6rem] text-muted">FTC #25160</span>
          </span>
        </Link>

        <nav aria-label="Ana menü" className="hidden lg:block">
          <ul className="flex items-center gap-1">
            {items.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  aria-current={isActive(item.href) ? 'page' : undefined}
                  className="label relative px-3 py-2 text-paper/70 transition hover:text-paper aria-[current=page]:text-accent"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-3">
          <LangSwitch lang={lang} pathname={pathname} label={labels.language} />
          <Link href={cta.href} className="btn btn-accent hidden !px-4 !py-2.5 sm:inline-flex">
            {cta.label}
          </Link>
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="mobile-menu"
            className="label flex h-10 items-center gap-2 border border-line px-3 lg:hidden"
          >
            <span className="relative block h-2.5 w-4">
              <span
                className={`absolute left-0 h-px w-4 bg-paper transition ${open ? 'top-1/2 rotate-45' : 'top-0'}`}
              />
              <span
                className={`absolute left-0 h-px w-4 bg-paper transition ${open ? 'top-1/2 -rotate-45' : 'bottom-0'}`}
              />
            </span>
            {open ? labels.close : labels.menu}
          </button>
        </div>
      </div>

      <div
        id="mobile-menu"
        hidden={!open}
        className="h-[calc(100svh-4.5rem)] overflow-y-auto border-t border-line bg-ink lg:hidden"
      >
        <nav aria-label="Mobil menü" className="mx-auto max-w-7xl px-5 py-8 sm:px-8">
          <ul className="stagger flex flex-col">
            {items.map((item) => (
              <li key={item.href} className="border-b border-line">
                <Link
                  href={item.href}
                  aria-current={isActive(item.href) ? 'page' : undefined}
                  className="flex items-baseline gap-4 py-4 aria-[current=page]:text-accent"
                >
                  <span className="display text-3xl">{item.label}</span>
                </Link>
              </li>
            ))}
          </ul>
          <Link href={cta.href} className="btn btn-accent mt-8">
            {cta.label} <span aria-hidden>→</span>
          </Link>
        </nav>
      </div>
    </header>
  )
}

function LangSwitch({ lang, pathname, label }: { lang: Locale; pathname: string; label: string }) {
  return (
    <div role="group" aria-label={label} className="label flex border border-line text-[0.66rem]">
      {(['tr', 'en'] as const).map((code) => (
        <Link
          key={code}
          href={switchLocalePath(pathname, code)}
          hrefLang={code}
          aria-current={code === lang ? 'true' : undefined}
          className="px-2.5 py-2 text-muted transition hover:text-paper aria-[current=true]:bg-paper aria-[current=true]:text-ink"
        >
          {code.toUpperCase()}
        </Link>
      ))}
    </div>
  )
}
