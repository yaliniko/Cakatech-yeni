# Çakatech #25160 — Takım Sitesi

FTC robotik takımı Çakatech'in sitesi ve içerik yönetim paneli.

**Stack:** Next.js 16 · Payload CMS 3 · SQLite (yerelde dosya, yayında Turso) · Tailwind CSS 4 · TypeScript
**Yayın:** Vercel (ücretsiz) + Turso veritabanı (ücretsiz) + Vercel Blob görsel deposu (ücretsiz)

## Yerelde çalıştırma

```bash
cp .env.example .env        # PAYLOAD_SECRET'ı değiştir: openssl rand -hex 32
npm install
npm run dev                 # http://localhost:3000  ·  panel: http://localhost:3000/admin
```

İlk `/admin` ziyaretinde açılan formla oluşturulan hesap otomatik **Yönetici** olur.

Faydalı komutlar:

| Komut | Ne yapar |
|---|---|
| `npm run generate:types` | Koleksiyon değişince `src/payload-types.ts`'i günceller |
| `npm run payload -- migrate:create <ad>` | Koleksiyon/alan değişince yeni veritabanı migration'ı üretir (**yayından önce şart**) |
| `npx tsc --noEmit` | Tip kontrolü |
| `npm run build` | Üretim derlemesi |

## Yayına alma (Vercel + Turso)

### 1. Turso veritabanı
1. https://turso.tech → ücretsiz hesap → **Create Database** (ad: `cakatech`, bölge: Avrupa).
2. Veritabanı sayfasından **URL**'yi (`libsql://cakatech-….turso.io`) ve **Create Token** ile bir token al.

### 2. GitHub
Bu klasörü GitHub'da yeni bir repoya push'la (`.env` ve `*.db` zaten `.gitignore`'da).

### 3. Vercel
1. https://vercel.com → **Add New → Project** → GitHub reposunu seç. Framework: Next.js (otomatik).
   Build komutu `vercel.json`'dan gelir: `npm run ci` (önce migration, sonra build).
2. **Environment Variables:**

   | Değişken | Değer |
   |---|---|
   | `DATABASE_URL` | Turso URL'si (`libsql://…`) |
   | `DATABASE_AUTH_TOKEN` | Turso token'ı |
   | `PAYLOAD_SECRET` | `openssl rand -hex 32` çıktısı (yereldekinden farklı olsun) |

3. **Deploy**.
4. Proje → **Storage → Create → Blob** → projeye bağla. Bu, `BLOB_READ_WRITE_TOKEN` değişkenini otomatik ekler.
   Sonra **Deployments → Redeploy** (görsel yükleme ancak bundan sonra çalışır).
5. `https://<proje>.vercel.app/admin` → ilk Yönetici hesabını oluştur.

### Sonraki güncellemeler
GitHub'a push → Vercel otomatik yeniden yayınlar. Koleksiyon/alan değiştirdiysen push'tan önce
`npm run payload -- migrate:create <ad>` çalıştırıp oluşan `src/migrations/` dosyalarını da commit'le.

## Yapı

```
src/
  access/        roller ve yetki kuralları (Yönetici / Editör)
  fields/        ortak alanlar (sıra + sitede göster, URL kısa adı, okundu)
  collections/   Üyeler, Robotlar, Yarışmalar, Ödüller, Sponsorlar, Sponsorluk Başvuruları,
                 Haberler & Etkinlikler, Kaynaklar, Görseller, Kullanıcılar
  migrations/    veritabanı şeması geçmişi
  app/(frontend) public site (şimdilik geçici ana sayfa)
  app/(payload)  yönetim paneli + API
```
