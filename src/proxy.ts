import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Türkçe kökte (/team), İngilizce /en altında (/en/team). Uygulamada tüm sayfalar
// app/(frontend)/[lang] altında olduğu için önek olmayan istekler içeride /tr'ye yönlendirilir.
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  if (pathname === '/en' || pathname.startsWith('/en/')) return NextResponse.next()

  // /tr/... adresini kanonik (öneksiz) adrese çevir.
  if (pathname === '/tr' || pathname.startsWith('/tr/')) {
    const url = request.nextUrl.clone()
    url.pathname = pathname.slice(3) || '/'
    return NextResponse.redirect(url, 308)
  }

  const url = request.nextUrl.clone()
  url.pathname = `/tr${pathname === '/' ? '' : pathname}`
  return NextResponse.rewrite(url)
}

export const config = {
  // Panel, API, Next dosyaları ve uzantılı dosyalar (logo.jpg, sitemap.xml…) hariç.
  matcher: ['/((?!admin|api|_next|.*\\..*).*)'],
}
