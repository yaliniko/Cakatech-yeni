import { MediaImage } from './MediaImage'

export function SponsorTile({
  name,
  url,
  logo,
}: {
  name: string
  url?: string | null
  logo?: Parameters<typeof MediaImage>[0]['media']
}) {
  const inner = (
    <div className="group relative flex aspect-[3/2] items-center justify-center p-6 transition hover:bg-ink-2">
      {logo ? (
        <div className="relative h-full w-full opacity-70 grayscale transition duration-500 group-hover:opacity-100 group-hover:grayscale-0">
          <MediaImage media={logo} size="thumb" sizes="240px" contain />
          <span className="sr-only">{name}</span>
        </div>
      ) : (
        <span className="text-center font-display text-lg font-bold">{name}</span>
      )}
    </div>
  )
  return url ? (
    <a href={url} target="_blank" rel="noopener noreferrer" title={name}>
      {inner}
    </a>
  ) : (
    inner
  )
}
