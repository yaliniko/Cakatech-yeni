import Image from 'next/image'

import type { Media } from '@/payload-types'

type Props = {
  media?: number | Media | null
  size?: 'thumb' | 'card' | 'hero'
  sizes?: string
  className?: string
  priority?: boolean
  /** Logolar için: kırpmadan sığdır */
  contain?: boolean
}

export const isMedia = (value: unknown): value is Media =>
  typeof value === 'object' && value !== null && 'url' in value

// Panelden yüklenen görsel. Ebeveyn `relative` ve boyutlu olmalı (fill kullanır).
export function MediaImage({ media, size = 'card', sizes, className, priority, contain }: Props) {
  if (!isMedia(media) || !media.url) return null

  const isSvg = media.mimeType === 'image/svg+xml'
  const src = (!isSvg && media.sizes?.[size]?.url) || media.url
  const position =
    media.focalX != null && media.focalY != null ? `${media.focalX}% ${media.focalY}%` : undefined

  return (
    <Image
      src={src}
      alt={media.alt ?? ''}
      fill
      sizes={sizes ?? '(min-width: 1024px) 50vw, 100vw'}
      priority={priority}
      unoptimized={isSvg}
      className={className}
      style={{ objectFit: contain ? 'contain' : 'cover', objectPosition: position }}
    />
  )
}
