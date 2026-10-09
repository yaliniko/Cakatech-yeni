// Geçici ana sayfa: Aşama 4'te CMS'ten beslenen gerçek ana sayfa ile değiştirilecek.
export default function HomePage() {
  return (
    <section className="relative flex min-h-svh flex-col items-center justify-center overflow-hidden px-6 text-center">
      <div
        aria-hidden
        className="pointer-events-none absolute -top-40 left-1/2 size-[42rem] -translate-x-1/2 rounded-full bg-brand/20 blur-3xl"
      />
      <p className="font-display text-sm font-medium tracking-[0.3em] text-accent uppercase">
        FIRST Tech Challenge · #25160
      </p>
      <h1 className="mt-4 font-display text-6xl font-bold tracking-tight sm:text-8xl">
        Çaka<span className="text-brand">tech</span>
      </h1>
      <p className="mt-6 max-w-xl text-lg text-muted">Yeni site yapım aşamasında.</p>
      <a
        href="/admin"
        className="mt-10 rounded-full bg-accent px-6 py-3 font-display font-semibold text-ink transition hover:bg-accent-hi"
      >
        Yönetim paneli
      </a>
    </section>
  )
}
