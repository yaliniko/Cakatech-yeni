import type { Locale } from '@/i18n/config'

// Uygulamalar sayfasındaki etkileşimli araçlar. Dosyalar public/uygulamalar/ içinde durur.
// Yeni uygulama: HTML dosyasını oraya koy, aşağıya bir kayıt ekle.
export type AppEntry = {
  slug: string
  file: string
  tag: Record<Locale, string>
  title: Record<Locale, string>
  summary: Record<Locale, string>
}

export const APPS: AppEntry[] = [
  {
    slug: 'mecanum-vektor-laboratuvari',
    file: '/uygulamalar/mecanum-vektor-laboratuvari.html',
    tag: { tr: 'Kinematik', en: 'Kinematics' },
    title: { tr: 'Mecanum Vektör Laboratuvarı', en: 'Mecanum Vector Lab' },
    summary: {
      tr: 'Mecanum sürüşte teker hızlarını ve kuvvetleri canlı gösterir.',
      en: 'Shows mecanum wheel speeds and forces live.',
    },
  },
  {
    slug: 'hive-atis-laboratuvari',
    file: '/uygulamalar/hive-atis-laboratuvari.html',
    tag: { tr: 'Atış', en: 'Launching' },
    title: { tr: 'HIVE Atış Laboratuvarı', en: 'HIVE Launch Lab' },
    summary: {
      tr: 'Flywheel devri ve açıyla HIVE hedefine atışı hesaplar.',
      en: 'Computes HIVE shots from flywheel RPM and angle.',
    },
  },
]

export const getApp = (slug: string) => APPS.find((app) => app.slug === slug) ?? null
