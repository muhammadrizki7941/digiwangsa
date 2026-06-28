# RENCANA PROYEK — Digiwangsa.com

> Jasa pembuatan Website & Aplikasi. Tema visual: **Jawa autentik** (wayang, gunungan, candi, mega mendung) dengan eksekusi **premium dark-mode + aksen emas** mengikuti `asset/referensi.png`. Copywriting **Indo–English auto-detect** (+ opsi Javanese).

---

## 1. IDENTITAS & ARAH DESAIN

### 1.1 Filosofi
"**Digital. Traditional. Solution.**" — teknologi modern dibungkus warisan budaya Jawa. Bukan ornamen tempelan: motif jadi bagian struktur (border, divider, glow, parallax).

### 1.2 Design Tokens (dari referensi)
| Token | Nilai | Pakai untuk |
|---|---|---|
| `bg-base` | `#0B0A08` / hampir hitam hangat | background utama |
| `bg-elevated` | `#16130D` | kartu, panel |
| `gold-primary` | `#C9A24B` / `#D4AF37` | aksen, CTA, judul highlight |
| `gold-soft` | `#E8D9A0` | teks emas terang |
| `gold-line` | `#6E5A2E` | garis ornamen tipis |
| `text-main` | `#F5F1E6` (off-white) | body text |
| `text-muted` | `#A89E86` | sub-teks |
| Gradien CTA | gold → amber, glow halus | tombol utama |

### 1.3 Tipografi
- **Display / Heading**: serif elegan (mis. *Playfair Display* atau *Cormorant*) — sesuai huruf "Transform Your Vision" di referensi.
- **Body / UI**: sans modern (*Inter* / *Plus Jakarta Sans* — Jakarta cocok dengan tema Indonesia).
- Highlight kata kunci ("Digital Experience.") diberi warna emas.

### 1.4 Aset visual
- `asset/digiwangsa.png` → ilustrasi wayang emas untuk **hero** (animasi).
- `asset/background-digiwangsa.png` → background **section atas** (hero + nav), di-overlay gradien gelap agar teks terbaca.
- `asset/referensi.png` → acuan layout (jangan dideploy).
- Perlu disiapkan/diekspor: logo Digiwangsa (ikon gunungan emas), favicon, OG image.

---

## 2. ANIMASI WAYANG (pembeda utama)

Hero "hidup" seperti pertunjukan wayang kulit:
1. **Parallax layer**: background candi/gunungan bergerak lambat saat scroll (depth).
2. **Wayang figures**: tokoh wayang dari `digiwangsa.png` masuk dari kiri-kanan dengan gerak halus + sedikit "goyang" gamelan-like (subtle sway loop) memakai **Framer Motion**.
3. **Gold particles / shimmer**: partikel emas (seperti debu cahaya di aset) — CSS/canvas ringan.
4. **Entrance**: gunungan "membelah" / fade-in saat load (analogi pembuka pertunjukan).
5. Hormati `prefers-reduced-motion` → animasi dimatikan, tampil statis.

Implementasi: `framer-motion` (sudah di dependency), `<motion.div>` + `useScroll`/`useTransform`. Aset PNG transparan di-layer dengan `next/image` (priority untuk hero).

---

## 3. SISTEM BAHASA & GEOLOKASI (i18n dinamis)

Sesuai dokumen + referensi (toggle Auto Detect / ID / EN / JV):
- **Library**: `next-intl` (App Router friendly).
- **Auto-detect**: middleware baca `Accept-Language` + `req.geo.country` (Vercel). `ID` → Indonesia; luar negeri → English. Default fallback EN.
- **Manual override**: language switcher di navbar (Auto Detect ✓ / Indonesia / English / Javanese) — simpan pilihan di cookie.
- **Javanese (JV)**: fase awal **hanya hero & nav** (sisanya fallback ID); bisa diperluas nanti.
- **Konten geo-dinamis**: jika `country === 'ID'` tampilkan portofolio lokal (UMKM); selain itu studi kasus internasional.
- File pesan: `messages/id.json`, `messages/en.json`, `messages/jv.json`.

---

## 4. COPYWRITING (Indo–English)

### Hero
- **ID**: "Transform Your Vision Into A Powerful **Pengalaman Digital**." → atau versi penuh ID: *"Ubah Visi Anda Menjadi Pengalaman Digital yang Berdaya."*
  Sub: "Digiwangsa membantu individu, kreator, bisnis, dan perusahaan membangun website & aplikasi premium untuk memperkuat brand, kredibilitas, dan pengalaman digital yang bermakna."
- **EN**: "Transform Your Vision Into A Powerful **Digital Experience**."
  Sub: "Digiwangsa helps individuals, creators, businesses, and companies build premium websites and applications that strengthen their brand, credibility, and create meaningful digital experiences."
- CTA: **Start Your Project** / **Mulai Proyek Anda** + **Explore Portfolio** / **Lihat Portofolio**.
- Trust: "500+ Happy Clients Worldwide".

### 3 Segmen — "Tailored For Every Vision And Ambition"
1. **Personal Brand / Influencer** — "Your Story Deserves A Digital Home." → *"Ceritamu Layak Punya Rumah Digital."*
2. **UMKM & Business** — "Make Your Business Look More Professional." → *"Buat Bisnismu Tampil Lebih Profesional."*
3. **Company & Enterprise** — "Digital Solutions Built For Growth." → *"Solusi Digital untuk Pertumbuhan."*
CTA tiap kartu: **View Case Study**.

### Value strip
Premium Design · High Performance · Strategic Approach · Custom Development · Reliable Support.

### Stats
150+ Projects Completed · 100+ Happy Clients · 98% Client Satisfaction · 5+ Years Experience · 24/7 Support.

> Semua string ditulis di file i18n, bukan hardcode, agar auto-detect bekerja.

---

## 5. STRUKTUR HALAMAN (sesuai nav referensi)

| Route | Isi |
|---|---|
| `/` Home | Hero (animasi wayang) → Solutions (3 segmen) → Why Choose Us → Stats → Process preview → Portfolio preview → Testimoni → Pricing preview → FAQ → CTA WhatsApp |
| `/services` | Detail layanan (Website Personal, UMKM, Enterprise/Aplikasi) |
| `/portfolio` + `/portfolio/[slug]` | Listing + case study (geo-dinamis) |
| `/process` | Alur kerja: Konsultasi → Penawaran → Desain & Development → Revisi → Launching |
| `/pricing` | Paket Starter / Growth / Enterprise |
| `/about` | Cerita brand, filosofi Jawa, tim |
| `/blog` + `/blog/[slug]` | Artikel (SEO) |
| `/admin/*` | CMS (login, dashboard, CRUD artikel/portofolio/konten home) |

Komponen global: Navbar (logo + lang switcher + Consultation Free), Footer bermotif, ChatWidget AI ("asisten virtual"), tombol WhatsApp.

---

## 6. ARSITEKTUR TEKNIS (mengacu Setup-Teknis md)

- **Framework**: Next.js (App Router, TS, `src/`), Tailwind.
- **DB/ORM**: Prisma + **MySQL/MariaDB via Laragon** (`provider = "mysql"`, `DATABASE_URL="mysql://root:@localhost:3306/digiwangsa"`). Saat deploy bisa pakai MySQL hosting (PlanetScale/Railway) atau tetap MySQL.
  - ⚠️ **Penyesuaian schema**: field array (`techStack`, `images`, `features`) tidak didukung MySQL → ubah jadi tipe `Json` atau tabel relasi terpisah.
- **Auth admin**: NextAuth (Credentials + bcrypt).
- **CMS**: TipTap editor untuk artikel; CRUD portofolio/pricing/FAQ/testimoni/home content.
- **AI Chat**: hybrid rule-based (`faq-knowledge`) + LLM fallback (Groq). Persona: asisten Digiwangsa, jawab sesuai bahasa user.
- **SEO**: Metadata API per halaman, `sitemap.ts`, `robots.ts`, `next/image`, satu `<h1>`/halaman, JSON-LD Organization.
- **i18n**: `next-intl` + middleware geo/locale.
- **Animasi**: `framer-motion`.
- **Deploy**: Vercel + custom domain digiwangsa.com.

Struktur folder mengikuti bagian 4 dokumen, ditambah: `src/i18n/`, `messages/`, `src/components/home/HeroWayang.tsx`, `src/components/layout/LanguageSwitcher.tsx`.

---

## 7. URUTAN PENGERJAAN (fase)

**Fase 0 — Fondasi**
1. `create-next-app` + Tailwind + struktur folder + design tokens (tailwind.config: warna emas, font, container).
2. Import font, setup global CSS (bg gelap, base typography).
3. Setup `next-intl` + middleware auto-detect + file `messages/{id,en}.json`.

**Fase 1 — Visual statis (cepat lihat hasil)**
4. Navbar + LanguageSwitcher + logo + tombol Consultation.
5. Hero statis (background-digiwangsa + digiwangsa.png) — layout dulu, animasi nanti.
6. Section Solutions (3 segmen), Why Choose, Stats, Footer — pakai dummy data + copy i18n.

**Fase 2 — Animasi & polish**
7. Animasi wayang (parallax, sway, particles, reduced-motion).
8. Responsif mobile (cocokkan panel mobile di referensi).

**Fase 3 — Halaman lain**
9. Services, Process, Pricing, About, Portfolio (listing+detail), Blog.

**Fase 4 — Backend & CMS**
10. Prisma schema + migrate + seed.
11. Auth admin + dashboard + CRUD (artikel, portofolio, home content, pricing, FAQ, testimoni).
12. Sambungkan halaman publik ke data dinamis.

**Fase 5 — Fitur cerdas**
13. AI ChatWidget (hybrid) bertema, multibahasa.
14. Konten geo-dinamis (portofolio lokal vs internasional).

**Fase 6 — SEO, QA, Deploy**
15. Metadata, sitemap, robots, JSON-LD, OG image.
16. Audit performa (Lighthouse), aksesibilitas, lazy-load aset berat.
17. Deploy Vercel + domain + submit Search Console.

---

## 8. KEPUTUSAN
- ✅ Database: **MySQL/MariaDB via Laragon** (bukan SQLite/Postgres). Schema array → `Json`.
- ✅ Javanese (JV): **hero & nav saja** di fase awal.
- ✅ Status: **berhenti di tahap rencana** — belum mulai koding, tunggu review.
- ⏳ Masih perlu diputuskan nanti: LLM chat (Groq vs Gemini); apakah aset wayang perlu varian per-layer transparan untuk animasi.
