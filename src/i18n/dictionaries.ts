import type { Locale } from './config'

// Arayüz metinleri. İçerik (üyeler, yarışmalar…) panelden gelir; buradakiler sabit site metinleri.
const tr = {
  meta: {
    title: 'Çakatech #25160 — FTC Robotik Takımı',
    description: "Çakatech, FIRST Tech Challenge'da yarışan #25160 numaralı robotik takımı.",
  },
  nav: {
    home: 'Ana sayfa',
    team: 'Takım',
    competitions: 'Yarışmalar',
    resources: 'Kaynaklar',
    apps: 'Uygulamalar',
    sponsors: 'Sponsorlar',
    becomeSponsor: 'Sponsor ol',
    menu: 'Menü',
    close: 'Kapat',
    skip: 'İçeriğe geç',
    language: 'Dil',
  },
  common: {
    empty: 'Yakında.',
    season: 'Sezon',
  },
  home: {
    eyebrow: 'FIRST Tech Challenge',
    heroTitle: ['Fikirden', 'sahaya.'],
    heroBody: 'Robotlarımızı kendimiz tasarlıyor, üretiyor ve programlıyoruz.',
    ctaPrimary: 'Takımı tanı',
    ctaSecondary: 'Destek ol',
    stats: { members: 'Üye', competitions: 'Yarışma', awards: 'Ödül' },
    sponsorsLabel: 'Sponsorlar',
    ctaTitle: 'Bize destek olun.',
  },
  team: { title: 'Takım' },
  competitions: {
    title: 'Yarışmalar',
    awards: 'Ödüller',
    otherAwards: 'Diğer ödüller',
  },
  resources: {
    title: 'Kaynaklar',
    types: { code: 'Kod', cad: 'CAD', portfolio: 'Portfolyo', video: 'Video', other: 'Diğer' },
  },
  apps: {
    title: 'Uygulamalar',
    fullscreen: 'Tam ekran',
    exitFullscreen: 'Küçült',
  },
  sponsors: {
    title: 'Sponsorlar',
    tiers: {
      platinum: 'Platin',
      gold: 'Altın',
      silver: 'Gümüş',
      bronze: 'Bronz',
      partner: 'Partner',
    },
  },
  form: {
    title: 'Sponsor ol',
    name: 'Ad soyad',
    organization: 'Kurum',
    email: 'E-posta',
    phone: 'Telefon',
    message: 'Mesaj',
    optional: 'isteğe bağlı',
    submit: 'Gönder',
    sending: 'Gönderiliyor…',
    success: 'Teşekkürler, size döneceğiz.',
    errorRequired: 'Ad, e-posta ve mesaj gerekli.',
    errorServer: 'Bir sorun oluştu, tekrar deneyin.',
  },
  footer: {
    disclaimer: 'FIRST® ve FIRST® Tech Challenge, FIRST®’ün tescilli markalarıdır.',
    panel: 'Panel',
  },
  notFound: {
    title: 'Sayfa bulunamadı',
    home: 'Ana sayfa',
  },
  subteams: {
    captain: 'Kaptan',
    mentor: 'Mentor',
    mechanical: 'Mekanik',
    software: 'Yazılım',
    design: 'Tasarım / CAD',
    media: 'Medya',
    business: 'İş Geliştirme',
    other: 'Ekip',
  },
}

export type Dictionary = typeof tr

const en: Dictionary = {
  meta: {
    title: 'Çakatech #25160 — FTC Robotics Team',
    description: 'Çakatech is robotics team #25160 competing in FIRST Tech Challenge.',
  },
  nav: {
    home: 'Home',
    team: 'Team',
    competitions: 'Competitions',
    resources: 'Resources',
    apps: 'Apps',
    sponsors: 'Sponsors',
    becomeSponsor: 'Sponsor us',
    menu: 'Menu',
    close: 'Close',
    skip: 'Skip to content',
    language: 'Language',
  },
  common: {
    empty: 'Coming soon.',
    season: 'Season',
  },
  home: {
    eyebrow: 'FIRST Tech Challenge',
    heroTitle: ['From idea', 'to field.'],
    heroBody: 'We design, build and program our robots ourselves.',
    ctaPrimary: 'Meet the team',
    ctaSecondary: 'Support us',
    stats: { members: 'Members', competitions: 'Competitions', awards: 'Awards' },
    sponsorsLabel: 'Sponsors',
    ctaTitle: 'Support us.',
  },
  team: { title: 'Team' },
  competitions: {
    title: 'Competitions',
    awards: 'Awards',
    otherAwards: 'Other awards',
  },
  resources: {
    title: 'Resources',
    types: { code: 'Code', cad: 'CAD', portfolio: 'Portfolio', video: 'Video', other: 'Other' },
  },
  apps: {
    title: 'Apps',
    fullscreen: 'Fullscreen',
    exitFullscreen: 'Exit',
  },
  sponsors: {
    title: 'Sponsors',
    tiers: {
      platinum: 'Platinum',
      gold: 'Gold',
      silver: 'Silver',
      bronze: 'Bronze',
      partner: 'Partner',
    },
  },
  form: {
    title: 'Sponsor us',
    name: 'Full name',
    organization: 'Organisation',
    email: 'Email',
    phone: 'Phone',
    message: 'Message',
    optional: 'optional',
    submit: 'Send',
    sending: 'Sending…',
    success: 'Thank you, we will get back to you.',
    errorRequired: 'Name, email and message are required.',
    errorServer: 'Something went wrong, please try again.',
  },
  footer: {
    disclaimer: 'FIRST® and FIRST® Tech Challenge are registered trademarks of FIRST®.',
    panel: 'Panel',
  },
  notFound: {
    title: 'Page not found',
    home: 'Home',
  },
  subteams: {
    captain: 'Captain',
    mentor: 'Mentor',
    mechanical: 'Mechanical',
    software: 'Software',
    design: 'Design / CAD',
    media: 'Media',
    business: 'Business',
    other: 'Crew',
  },
}

const dictionaries: Record<Locale, Dictionary> = { tr, en }

export const getDictionary = (lang: Locale) => dictionaries[lang]
