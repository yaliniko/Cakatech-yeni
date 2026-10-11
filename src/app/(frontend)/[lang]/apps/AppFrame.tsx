'use client'

import { useEffect, useRef, useState } from 'react'

type Props = {
  src: string
  title: string
  labels: { fullscreen: string; exitFullscreen: string }
}

// Uygulamayı izole bir iframe'de gösterir (sandbox: yalnız script; site çerezlerine/oturumuna erişemez).
// Tam ekran, iframe'i saran kutu üzerinden açılır; böylece sandbox korunur.
export function AppFrame({ src, title, labels }: Props) {
  const boxRef = useRef<HTMLDivElement>(null)
  const [isFull, setIsFull] = useState(false)

  useEffect(() => {
    const onChange = () => setIsFull(document.fullscreenElement === boxRef.current)
    document.addEventListener('fullscreenchange', onChange)
    return () => document.removeEventListener('fullscreenchange', onChange)
  }, [])

  const toggle = async () => {
    try {
      if (document.fullscreenElement) await document.exitFullscreen()
      else await boxRef.current?.requestFullscreen()
    } catch {
      // Tarayıcı tam ekranı desteklemiyor ya da reddetti.
    }
  }

  return (
    <div ref={boxRef} className="ticks relative flex flex-col bg-ink p-2">
      <div className="flex items-center justify-between gap-4 border border-b-0 border-line bg-ink-2 px-4 py-2.5">
        <p className="label flex items-center gap-2.5 text-[0.62rem] text-muted">
          <span aria-hidden className="size-2 rounded-full bg-accent" />
          {title}
        </p>
        <button
          type="button"
          onClick={toggle}
          className="label border border-line px-3 py-1.5 text-[0.62rem] transition hover:border-accent hover:text-accent"
        >
          {isFull ? labels.exitFullscreen : labels.fullscreen} {isFull ? '↙' : '↗'}
        </button>
      </div>
      <iframe
        src={src}
        title={title}
        sandbox="allow-scripts allow-popups"
        loading="lazy"
        className={`w-full border border-line bg-ink-2 ${isFull ? 'flex-1' : 'h-[min(82svh,56rem)] min-h-[34rem]'}`}
      />
    </div>
  )
}
