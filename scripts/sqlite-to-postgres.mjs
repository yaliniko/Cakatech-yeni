// Tek seferlik taşıma: SQLite/Turso → Postgres (Neon).
//
// Hedef veritabanında önce şema kurulmuş olmalı (`npm run payload migrate`) ve tablolar boş olmalı.
// İki taraf aynı Payload config'inden üretildiği için tablo/kolon adları birebir aynıdır;
// script veriyi tablo tablo kopyalar, sadece tip dönüşümü yapar (0/1 → boolean, metin → json vb.).
//
// Kullanım:
//   SOURCE_URL=libsql://<db>.turso.io SOURCE_AUTH_TOKEN=... TARGET_URL=postgres://... \
//     node scripts/sqlite-to-postgres.mjs
//   (SOURCE_URL=file:./cakatech.db ile yerel dosyadan da çalışır.)
//   Önce DRY_RUN=1 ile çalıştırıp sadece sayımları görebilirsin.

import { createClient } from '@libsql/client'
import pg from 'pg'

const { SOURCE_URL, SOURCE_AUTH_TOKEN, TARGET_URL, DRY_RUN } = process.env
if (!SOURCE_URL || !TARGET_URL) {
  console.error('SOURCE_URL ve TARGET_URL gerekli.')
  process.exit(1)
}

// Kopyalanmayacaklar: migration kaydı hedefte zaten var; oturum ve kilitler geçici.
const SKIP = new Set([
  'payload_migrations',
  'users_sessions',
  'payload_locked_documents',
  'payload_locked_documents_rels',
])

const src = createClient({ url: SOURCE_URL, authToken: SOURCE_AUTH_TOKEN || undefined })
const dst = new pg.Client({ connectionString: TARGET_URL })
await dst.connect()

const srcTables = (
  await src.execute(
    "select name from sqlite_master where type='table' and name not like 'sqlite_%' and name not like '\\_\\_%' escape '\\'",
  )
).rows.map((r) => String(r.name))

const dstTables = (
  await dst.query("select table_name from information_schema.tables where table_schema='public'")
).rows.map((r) => r.table_name)

const missing = srcTables.filter((t) => !dstTables.includes(t))
if (missing.length) {
  console.error('Hedefte olmayan tablolar (önce migrate çalıştır):', missing)
  process.exit(1)
}

// Yabancı anahtarlara göre sırala: önce bağımlı olunan tablolar.
const fks = (
  await dst.query(`
    select tc.table_name as child, ccu.table_name as parent
    from information_schema.table_constraints tc
    join information_schema.constraint_column_usage ccu on tc.constraint_name = ccu.constraint_name
    where tc.constraint_type = 'FOREIGN KEY' and tc.table_schema = 'public'`)
).rows
const tables = srcTables.filter((t) => !SKIP.has(t))
const ordered = []
const visit = (t, seen = new Set()) => {
  if (ordered.includes(t) || seen.has(t)) return
  seen.add(t)
  for (const { parent } of fks.filter((f) => f.child === t && f.parent !== t)) {
    if (tables.includes(parent)) visit(parent, seen)
  }
  ordered.push(t)
}
tables.forEach((t) => visit(t))

const convert = (value, type) => {
  if (value === null || value === undefined) return null
  if (type === 'boolean') return value === 1 || value === 1n || value === true || value === '1'
  if (type === 'jsonb' || type === 'json') return typeof value === 'string' ? value : JSON.stringify(value)
  if (typeof value === 'bigint') return value.toString()
  if (value instanceof ArrayBuffer) return Buffer.from(value)
  return value
}

try {
  await dst.query('begin')
  for (const table of ordered) {
    const cols = (
      await dst.query(
        "select column_name, data_type from information_schema.columns where table_schema='public' and table_name=$1",
        [table],
      )
    ).rows
    const types = Object.fromEntries(cols.map((c) => [c.column_name, c.data_type]))
    const { rows } = await src.execute(`select * from "${table}"`)

    const existing = Number((await dst.query(`select count(*) from "${table}"`)).rows[0].count)
    if (existing > 0) throw new Error(`Hedef tablo boş değil: ${table} (${existing} satır)`)

    console.log(`${table}: ${rows.length} satır`)
    if (DRY_RUN || rows.length === 0) continue

    const names = Object.keys(rows[0]).filter((c) => c in types)
    const colList = names.map((c) => `"${c}"`).join(', ')
    for (const row of rows) {
      const values = names.map((c) => convert(row[c], types[c]))
      const params = names.map((_, i) => `$${i + 1}`).join(', ')
      await dst.query(`insert into "${table}" (${colList}) values (${params})`, values)
    }

    // Kimlik sayaçlarını ilerlet ki yeni kayıtlar mevcut id'lerle çakışmasın.
    if (types.id === 'integer') {
      await dst.query(
        `select setval(pg_get_serial_sequence('"${table}"', 'id'), coalesce((select max(id) from "${table}"), 0) + 1, false)`,
      )
    }
  }
  if (DRY_RUN) {
    await dst.query('rollback')
    console.log('DRY_RUN: hiçbir şey yazılmadı.')
  } else {
    await dst.query('commit')
    console.log('Tamamlandı.')
  }
} catch (err) {
  await dst.query('rollback')
  console.error('Hata, hiçbir şey yazılmadı:', err.message)
  process.exitCode = 1
} finally {
  await dst.end()
}
