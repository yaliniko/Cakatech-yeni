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
  {
    slug: 'intake-laboratuvari',
    file: '/uygulamalar/intake-laboratuvari.html',
    tag: { tr: 'Intake', en: 'Intake' },
    title: { tr: 'FTC Intake Laboratuvarı', en: 'FTC Intake Lab' },
    summary: {
      tr: 'Üst rulo ve zemin arasında topun sıkışmasını, kavramayı ve rulo torkunu hesaplar.',
      en: 'Computes ball compression, grip and roller torque between the top roller and the floor.',
    },
  },
  {
    slug: 'apriltag-nisan-laboratuvari',
    file: '/uygulamalar/apriltag-nisan-laboratuvari.html',
    tag: { tr: 'Görüntü işleme', en: 'Vision' },
    title: { tr: 'AprilTag ile Nişan Alma Laboratuvarı', en: 'AprilTag Aiming Lab' },
    summary: {
      tr: 'Kamera ölçümünden shooter yönünü ve hedefteki yanal hatayı gösterir.',
      en: 'Shows shooter heading and lateral error at the target from camera measurements.',
    },
  },
]

export const getApp = (slug: string) => APPS.find((app) => app.slug === slug) ?? null
