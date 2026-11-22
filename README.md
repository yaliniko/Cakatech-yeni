# Çakatech #25160 — Takım Sitesi

FTC robotik takımı Çakatech'in sitesi 

**Stack:** Next.js 16 · Payload CMS 3 · PostgreSQL (yerelde Docker, yayında Neon) · Tailwind CSS 4 · TypeScript
**Yayın:** Vercel (ücretsiz) + Neon Postgres (ücretsiz) + Vercel Blob görsel deposu (ücretsiz)

## Yerelde çalıştırma

```bash
# Yerel Postgres (bir kez; sonraki seferlerde: docker start cakatech-pg)
docker run -d --name cakatech-pg -e POSTGRES_USER=cakatech -e POSTGRES_PASSWORD=cakatech \
  -e POSTGRES_DB=cakatech -p 5432:5432 -v cakatech-pg-data:/var/lib/postgresql/data postgres:17

cp .env.example .env        # PAYLOAD_SECRET'ı değiştir: openssl rand -hex 32
npm install
npm run payload -- migrate  # şemayı kurar
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

## Yayına alma (Vercel + Neon)

### 1. Neon veritabanı
Vercel → **Storage → Create Database → Neon (Postgres)** → bölge: Frankfurt → projeye bağla.
Bu, `DATABASE_URL` değişkenini otomatik ekler. Proje henüz yoksa önce 3. adımı yap; ilk deploy
veritabanı olmadan başarısız olur, Neon'u bağladıktan sonra **Redeploy** et.
(Alternatif: https://neon.tech'te elle oluşturup bağlantı adresini `DATABASE_URL` olarak girmek.)

### 2. GitHub
Bu klasörü GitHub'da yeni bir repoya push'la (`.env` zaten `.gitignore`'da).

### 3. Vercel
1. https://vercel.com → **Add New → Project** → GitHub reposunu seç. Framework: Next.js (otomatik).
   Build komutu `vercel.json`'dan gelir: `npm run ci` (önce migration, sonra build).
2. **Environment Variables:**

   | Değişken | Değer |
   |---|---|
   | `DATABASE_URL` | Neon bağlantı adresi (`postgresql://…`; Neon entegrasyonu otomatik ekler) |
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
  hooks/         içerik değişince sitenin önbelleğini yenileyen hook
  i18n/          site dilleri (tr kökte, en /en altında) ve arayüz metinleri
  lib/           sitenin veri sorguları (Payload local API)
  components/    site bileşenleri (menü, alt bilgi, kartlar)
  proxy.ts       dil yönlendirmesi: /team → içeride /tr/team
  app/(frontend)/[lang]  public site: ana sayfa, takım, yarışmalar, kaynaklar, uygulamalar, sponsorlar
  app/(payload)  yönetim paneli + API
```

Site sayfaları statik üretilir ve panelde içerik kaydedilince otomatik yenilenir.
Arayüz metinleri (başlıklar, butonlar) `src/i18n/dictionaries.ts` içindedir; içerik panelden gelir.
Uygulamalar sayfası: HTML dosyasını `public/uygulamalar/` içine koy ve `src/lib/apps.ts`'e bir kayıt ekle.
İsteğe bağlı `NEXT_PUBLIC_SITE_URL` (ör. `https://cakatech.org`) sitemap ve paylaşım kartlarında kullanılır;
verilmezse Vercel'in üretim adresi kullanılır.
