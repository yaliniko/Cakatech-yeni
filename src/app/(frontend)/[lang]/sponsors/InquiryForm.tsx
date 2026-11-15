'use client'

import Script from 'next/script'
import { useActionState, useEffect, useRef } from 'react'

import type { Dictionary } from '@/i18n/dictionaries'

import { type InquiryState, submitInquiry } from './actions'

const initial: InquiryState = { status: 'idle' }

type TurnstileApi = {
  render: (el: HTMLElement, options: { sitekey: string; theme?: string }) => string
  reset: (id: string) => void
  remove: (id: string) => void
}
declare global {
  interface Window {
    turnstile?: TurnstileApi
  }
}

export function InquiryForm({ t, turnstileSiteKey }: { t: Dictionary['form']; turnstileSiteKey?: string }) {
  const [state, action, pending] = useActionState(submitInquiry, initial)
  const boxRef = useRef<HTMLDivElement>(null)
  const widgetId = useRef<string | null>(null)

  // Turnstile (anahtar tanımlıysa): script yüklenince kutuya çizilir; sayfadan ayrılınca kaldırılır.
  const renderWidget = () => {
    if (!turnstileSiteKey || !boxRef.current || widgetId.current || !window.turnstile) return
    widgetId.current = window.turnstile.render(boxRef.current, { sitekey: turnstileSiteKey, theme: 'dark' })
  }
  useEffect(() => {
    renderWidget()
    return () => {
      if (widgetId.current) window.turnstile?.remove(widgetId.current)
      widgetId.current = null
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [turnstileSiteKey])

  // Her gönderimden sonra jeton tek kullanımlık olduğu için yenilenir.
  useEffect(() => {
    if (state.status !== 'idle' && widgetId.current) window.turnstile?.reset(widgetId.current)
  }, [state])

  if (state.status === 'success') {
    return (
      <div role="status" className="ticks flex flex-col items-start gap-5 border border-accent/40 bg-accent/5 p-10">
        <span aria-hidden className="flex size-12 items-center justify-center bg-accent text-2xl text-ink">
          ✓
        </span>
        <p className="display text-2xl">{t.success}</p>
      </div>
    )
  }

  return (
    <form action={action} className="grid gap-5 sm:grid-cols-2">
      <Field name="name" label={t.name} required autoComplete="name" />
      <Field name="organization" label={t.organization} optional={t.optional} autoComplete="organization" />
      <Field name="email" label={t.email} type="email" required autoComplete="email" />
      <Field name="phone" label={t.phone} type="tel" optional={t.optional} autoComplete="tel" />
      <label className="flex flex-col gap-2 sm:col-span-2">
        <span className="label text-muted">{t.message}</span>
        <textarea
          name="message"
          required
          minLength={5}
          maxLength={4000}
          rows={6}
          className="resize-y border border-line bg-ink-2 px-4 py-3.5 text-paper transition outline-none placeholder:text-muted/50 hover:border-line-strong focus:border-accent"
        />
      </label>

      {/* Bot tuzağı: ekran okuyuculardan ve gözden gizli */}
      <div aria-hidden className="absolute -left-[9999px] h-px w-px overflow-hidden">
        <label>
          Website
          <input type="text" name="website" tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      {turnstileSiteKey && (
        <>
          <Script
            src="https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit"
            strategy="afterInteractive"
            onReady={renderWidget}
          />
          <div ref={boxRef} className="sm:col-span-2" />
        </>
      )}

      <div className="flex flex-col gap-4 sm:col-span-2 sm:flex-row sm:items-center">
        <button type="submit" disabled={pending} className="btn btn-accent disabled:opacity-60">
          {pending ? t.sending : t.submit}
          <span aria-hidden className="arrow">
            →
          </span>
        </button>
        <p aria-live="polite" className="text-sm text-red-400">
          {state.status === 'invalid' && t.errorRequired}
          {state.status === 'error' && t.errorServer}
          {state.status === 'captcha' && t.errorCaptcha}
          {state.status === 'limited' && t.errorLimit}
        </p>
      </div>
    </form>
  )
}

function Field({
  name,
  label,
  type = 'text',
  required,
  optional,
  autoComplete,
}: {
  name: string
  label: string
  type?: string
  required?: boolean
  optional?: string
  autoComplete?: string
}) {
  return (
    <label className="flex flex-col gap-2">
      <span className="label text-muted">
        {label}
        {optional && <span className="ml-2 normal-case tracking-normal text-muted/60">({optional})</span>}
      </span>
      <input
        name={name}
        type={type}
        required={required}
        autoComplete={autoComplete}
        maxLength={type === 'email' ? 200 : 160}
        className="h-13 border border-line bg-ink-2 px-4 text-paper transition outline-none hover:border-line-strong focus:border-accent"
      />
    </label>
  )
}
