import Link from 'next/link'
import type { ReactNode } from 'react'

// Küçük, durumsuz yapı taşları.

export function Container({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <div className={`mx-auto w-full max-w-7xl px-5 sm:px-8 ${className}`}>{children}</div>
}

/** Mono bölüm etiketi */
export function SectionLabel({ children }: { children: ReactNode }) {
  return (
    <p className="label flex items-center gap-3 text-muted">
      <span aria-hidden className="h-px w-8 bg-line-strong" />
      <span>{children}</span>
    </p>
  )
}

/** İç sayfaların üst bölümü: yalnız sayfa adı */
export function PageHeader({ title, children }: { title: string; children?: ReactNode }) {
  return (
    <header className="relative overflow-hidden border-b border-line">
      <div aria-hidden className="grid-paper absolute inset-0 [mask-image:linear-gradient(to_bottom,black,transparent)]" />
      <Container className="relative pt-36 pb-14 sm:pt-44 sm:pb-16">
        <div className="stagger">
          <h1 className="display text-[clamp(2.8rem,8vw,6.5rem)]">{title}</h1>
          {children}
        </div>
      </Container>
    </header>
  )
}

export function ArrowLink({
  href,
  children,
  variant = 'accent',
  external,
}: {
  href: string
  children: ReactNode
  variant?: 'accent' | 'brand' | 'ghost'
  external?: boolean
}) {
  const className = `btn btn-${variant}`
  const inner = (
    <>
      {children}
      <span aria-hidden className="arrow">
        {external ? '↗' : '→'}
      </span>
    </>
  )
  if (external)
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={className}>
        {inner}
      </a>
    )
  return (
    <Link href={href} className={className}>
      {inner}
    </Link>
  )
}

export function EmptyState({ text }: { text: string }) {
  return (
    <p className="label flex items-center gap-4 text-muted">
      <span aria-hidden className="hazard h-2 w-10" />
      {text}
    </p>
  )
}

/** Fotoğraf yoksa baş harfler */
export function Monogram({ name, className = '' }: { name: string; className?: string }) {
  const initials = name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toLocaleUpperCase('tr'))
    .join('')
  return (
    <div aria-hidden className={`grid-paper flex items-center justify-center bg-ink-3 ${className}`}>
      <span className="display text-5xl text-white/20">{initials}</span>
    </div>
  )
}

export function Hazard({ className = '' }: { className?: string }) {
  return <div aria-hidden className={`hazard h-3 w-full ${className}`} />
}
