import { sqliteAdapter } from '@payloadcms/db-sqlite'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { vercelBlobStorage } from '@payloadcms/storage-vercel-blob'
import { en } from '@payloadcms/translations/languages/en'
import { tr } from '@payloadcms/translations/languages/tr'
import path from 'path'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'
import sharp from 'sharp'

import { Awards } from './collections/Awards'
import { Competitions } from './collections/Competitions'
import { Media } from './collections/Media'
import { Members } from './collections/Members'
import { Resources } from './collections/Resources'
import { Sponsors } from './collections/Sponsors'
import { SponsorshipInquiries } from './collections/SponsorshipInquiries'
import { Users } from './collections/Users'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  admin: {
    user: Users.slug,
    // Sade, tek tema: sitenin siyah zemini (renkler: (payload)/custom.scss).
    theme: 'dark',
    meta: { titleSuffix: ' · Çakatech', icons: [{ rel: 'icon', url: '/logo.jpg' }] },
    importMap: {
      baseDir: path.resolve(dirname),
    },
  },
  collections: [
    Members,
    Competitions,
    Awards,
    Sponsors,
    SponsorshipInquiries,
    Resources,
    Media,
    Users,
  ],
  // Panel arayüzü Türkçe.
  i18n: {
    supportedLanguages: { tr, en },
    fallbackLanguage: 'tr',
  },
  // İçerik dilleri: şimdilik Türkçe girilir, İngilizce boşsa Türkçesi gösterilir.
  localization: {
    locales: [
      { label: 'Türkçe', code: 'tr' },
      { label: 'English', code: 'en' },
    ],
    defaultLocale: 'tr',
    fallback: true,
  },
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  // Yerelde: file:./cakatech.db (SQLite dosyası). Yayında: Turso (libsql://…) + DATABASE_AUTH_TOKEN.
  // Yayında şema, build sırasında `payload migrate` ile güncellenir (bkz. package.json "ci").
  db: sqliteAdapter({
    client: {
      url: process.env.DATABASE_URL || '',
      authToken: process.env.DATABASE_AUTH_TOKEN,
    },
  }),
  sharp,
  plugins: [
    // Yayında görseller Vercel Blob'a yüklenir; token yoksa (yerelde) media/ klasörüne yazılır.
    vercelBlobStorage({
      enabled: Boolean(process.env.BLOB_READ_WRITE_TOKEN),
      token: process.env.BLOB_READ_WRITE_TOKEN,
      collections: { media: true },
      // Vercel'in 4.5 MB istek sınırına takılmamak için dosyalar tarayıcıdan doğrudan yüklenir.
      clientUploads: true,
      // Yerel ve yayın ortamında aynı veritabanı şeması olsun (migration'lar tutarlı kalsın).
      alwaysInsertFields: true,
    }),
  ],
})
