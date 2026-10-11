'use client'

import { usePathname } from 'next/navigation'

import { ArrowLink, Container } from '@/components/site/ui'
import { localizePath } from '@/i18n/config'
import { getDictionary } from '@/i18n/dictionaries'

// not-found params almaz; dili adresten çıkarırız.
export default function NotFound() {
  const path = usePathname() ?? ''
  const lang = path === '/en' || path.startsWith('/en/') ? 'en' : 'tr'
  const dict = getDictionary(lang)

  return (
    <section className="relative isolate overflow-hidden">
      <div aria-hidden className="grid-paper absolute inset-0 -z-10 [mask-image:radial-gradient(ellipse_at_center,black,transparent_70%)]" />
      <Container className="flex min-h-[80svh] flex-col items-start justify-center pt-32 pb-16">
        <p className="label text-accent">ERR · 404</p>
        <p aria-hidden className="display outline-text mt-4 text-[clamp(7rem,24vw,18rem)] leading-none">
          404
        </p>
        <h1 className="display -mt-[0.4em] text-[clamp(2.2rem,5vw,4rem)]">{dict.notFound.title}</h1>
        <div className="mt-10">
          <ArrowLink href={localizePath(lang, '/')}>{dict.notFound.home}</ArrowLink>
        </div>
      </Container>
    </section>
  )
}
