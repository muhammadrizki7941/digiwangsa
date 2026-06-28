# SETUP TEKNIS LENGKAP
## Website Jasa Pembuatan Website & Aplikasi — Next.js Full Stack

Dokumen ini lanjutan dari Blueprint sebelumnya, fokus ke implementasi teknis: struktur project, database, auth, SEO, dan AI chat.

---

# 1. PREREQUISITES

Pastikan sudah terinstall di komputer:
- **Node.js** versi 18.18 atau lebih baru (cek: `node -v`)
- **npm** atau **pnpm** (disarankan pnpm — lebih cepat & hemat disk)
- **Git**
- Akun **Vercel** (untuk deploy, gratis)
- Akun database: **Neon** atau **Supabase** (PostgreSQL gratis) — atau pakai SQLite dulu untuk lokal
- Akun **Groq** atau **Google AI Studio** (untuk API key AI chat, gratis)

---

# 2. INISIALISASI PROJECT

```bash
npx create-next-app@latest jasa-website --typescript --tailwind --eslint --app --src-dir --import-alias "@/*"
cd jasa-website
```

Pilihan saat wizard:
- TypeScript: **Yes**
- ESLint: **Yes**
- Tailwind CSS: **Yes**
- `src/` directory: **Yes**
- App Router: **Yes**
- Import alias: **Yes** (`@/*`)

---

# 3. INSTALL DEPENDENCIES UTAMA

```bash
# Database & ORM
npm install prisma @prisma/client
npx prisma init

# Auth
npm install next-auth @auth/prisma-adapter bcryptjs
npm install -D @types/bcryptjs

# Form & validasi
npm install react-hook-form zod @hookform/resolvers

# Rich text editor untuk artikel
npm install @tiptap/react @tiptap/starter-kit @tiptap/extension-image @tiptap/extension-link

# AI Chat (Vercel AI SDK)
npm install ai @ai-sdk/google groq-sdk

# Animasi & UI tambahan
npm install framer-motion lucide-react clsx

# Upload gambar (lokal dulu, bisa upgrade ke cloud nanti)
npm install sharp
```

---

# 4. STRUKTUR FOLDER PROJECT

```
jasa-website/
├── prisma/
│   ├── schema.prisma
│   └── seed.ts
├── public/
│   └── uploads/                  # gambar upload (portofolio, artikel)
├── src/
│   ├── app/
│   │   ├── (public)/             # grup route halaman publik
│   │   │   ├── page.tsx          # Home
│   │   │   ├── layout.tsx
│   │   │   ├── artikel/
│   │   │   │   ├── page.tsx      # listing artikel
│   │   │   │   └── [slug]/page.tsx  # detail artikel
│   │   │   ├── portofolio/
│   │   │   │   ├── page.tsx      # listing portofolio
│   │   │   │   └── [slug]/page.tsx  # detail case study
│   │   │   └── harga/page.tsx
│   │   │
│   │   ├── admin/                # area admin (protected)
│   │   │   ├── layout.tsx        # cek auth di sini
│   │   │   ├── page.tsx          # dashboard
│   │   │   ├── login/page.tsx
│   │   │   ├── home/page.tsx     # edit konten Home
│   │   │   ├── artikel/
│   │   │   │   ├── page.tsx
│   │   │   │   ├── baru/page.tsx
│   │   │   │   └── [id]/edit/page.tsx
│   │   │   └── portofolio/
│   │   │       ├── page.tsx
│   │   │       ├── baru/page.tsx
│   │   │       └── [id]/edit/page.tsx
│   │   │
│   │   ├── api/
│   │   │   ├── auth/[...nextauth]/route.ts
│   │   │   ├── artikel/route.ts
│   │   │   ├── portofolio/route.ts
│   │   │   ├── upload/route.ts
│   │   │   └── chat/route.ts      # endpoint AI chat
│   │   │
│   │   ├── sitemap.ts             # sitemap dinamis
│   │   ├── robots.ts
│   │   └── layout.tsx              # root layout
│   │
│   ├── components/
│   │   ├── home/                  # Hero, Pricing, FAQ, Testimoni, dll
│   │   ├── portofolio/
│   │   ├── artikel/
│   │   ├── admin/                 # form, table, sidebar admin
│   │   ├── chat/
│   │   │   └── ChatWidget.tsx
│   │   └── ui/                    # button, card, badge (reusable)
│   │
│   ├── lib/
│   │   ├── prisma.ts              # Prisma client singleton
│   │   ├── auth.ts                # config NextAuth
│   │   ├── faq-knowledge.ts       # knowledge base rule-based chat
│   │   └── utils.ts
│   │
│   └── types/
│       └── index.ts
│
├── .env.local
├── next.config.js
├── tailwind.config.ts
└── package.json
```

---

# 5. DATABASE SCHEMA (Prisma)

File: `prisma/schema.prisma`

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql" // ganti "sqlite" untuk lokal kalau mau lebih simpel di awal
  url      = env("DATABASE_URL")
}

model Admin {
  id        String   @id @default(cuid())
  email     String   @unique
  password  String
  name      String
  createdAt DateTime @default(now())
}

model Article {
  id          String   @id @default(cuid())
  title       String
  slug        String   @unique
  excerpt     String
  content     String   // rich text HTML dari TipTap
  coverImage  String?
  category    String
  metaTitle   String?
  metaDesc    String?
  status      String   @default("draft") // draft | published
  publishedAt DateTime?
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}

model Portfolio {
  id          String   @id @default(cuid())
  title       String
  slug        String   @unique
  category    String
  challenge   String
  solution    String
  result      String?
  techStack   String[] // array tag teknologi
  images      String[] // array url gambar
  demoUrl     String?
  featured    Boolean  @default(false)
  order       Int      @default(0)
  createdAt   DateTime @default(now())
}

model PricingPlan {
  id        String   @id @default(cuid())
  name      String   // Starter, Growth, Enterprise
  price     String
  segment   String   // personal | umkm | korporat
  features  String[]
  highlighted Boolean @default(false)
  order     Int      @default(0)
}

model FAQ {
  id       String @id @default(cuid())
  question String
  answer   String
  order    Int    @default(0)
}

model Testimonial {
  id      String @id @default(cuid())
  name    String
  role    String
  company String?
  quote   String
  avatar  String?
  order   Int    @default(0)
}

model HomeContent {
  id            String @id @default(cuid())
  section       String @unique // "hero", "problem", "cta"
  heading       String
  subheading    String?
  extraData     Json?  // fleksibel untuk field tambahan per section
}

model ChatLog {
  id        String   @id @default(cuid())
  sessionId String
  role      String   // user | bot
  message   String
  createdAt DateTime @default(now())
}
```

Jalankan migrasi:
```bash
npx prisma migrate dev --name init
npx prisma generate
```

Prisma client singleton — `src/lib/prisma.ts`:
```typescript
import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient }

export const prisma = globalForPrisma.prisma ?? new PrismaClient()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
```

---

# 6. ENVIRONMENT VARIABLES

File: `.env.local`

```bash
# Database
DATABASE_URL="postgresql://user:password@host:5432/dbname"

# NextAuth
NEXTAUTH_SECRET="generate-dengan: openssl rand -base64 32"
NEXTAUTH_URL="http://localhost:3000"

# AI Chat
GROQ_API_KEY="gsk_xxxxxxxxxxxx"
GOOGLE_AI_API_KEY="xxxxxxxxxxxx"

# Site config
NEXT_PUBLIC_SITE_URL="https://namadomainkamu.com"
```

> Jangan commit file `.env.local` ke Git. Pastikan ada di `.gitignore` (Next.js sudah otomatis exclude ini).

---

# 7. AUTH ADMIN (NextAuth.js)

File: `src/lib/auth.ts`
```typescript
import { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import { prisma } from './prisma'
import bcrypt from 'bcryptjs'

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null

        const admin = await prisma.admin.findUnique({
          where: { email: credentials.email },
        })
        if (!admin) return null

        const valid = await bcrypt.compare(credentials.password, admin.password)
        if (!valid) return null

        return { id: admin.id, email: admin.email, name: admin.name }
      },
    }),
  ],
  session: { strategy: 'jwt' },
  pages: { signIn: '/admin/login' },
}
```

File: `src/app/api/auth/[...nextauth]/route.ts`
```typescript
import NextAuth from 'next-auth'
import { authOptions } from '@/lib/auth'

const handler = NextAuth(authOptions)
export { handler as GET, handler as POST }
```

Proteksi route admin — `src/app/admin/layout.tsx`:
```typescript
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions)
  if (!session) redirect('/admin/login')

  return <div className="flex">{/* sidebar + children */}{children}</div>
}
```

Membuat admin pertama (script seed) — `prisma/seed.ts`:
```typescript
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  const hashedPassword = await bcrypt.hash('passwordAmanKamu123', 10)
  await prisma.admin.create({
    data: {
      email: 'admin@namadomainkamu.com',
      password: hashedPassword,
      name: 'Admin',
    },
  })
}

main().finally(() => prisma.$disconnect())
```
Jalankan: `npx tsx prisma/seed.ts`

---

# 8. SEO SETUP (Penting!)

## 8.1 Metadata Dinamis per Halaman
Setiap halaman pakai Next.js Metadata API. Contoh untuk detail artikel — `src/app/(public)/artikel/[slug]/page.tsx`:

```typescript
import { Metadata } from 'next'
import { prisma } from '@/lib/prisma'

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const article = await prisma.article.findUnique({ where: { slug: params.slug } })
  if (!article) return {}

  return {
    title: article.metaTitle || article.title,
    description: article.metaDesc || article.excerpt,
    openGraph: {
      title: article.title,
      description: article.excerpt,
      images: article.coverImage ? [article.coverImage] : [],
      type: 'article',
    },
    twitter: {
      card: 'summary_large_image',
      title: article.title,
      description: article.excerpt,
    },
  }
}

export async function generateStaticParams() {
  const articles = await prisma.article.findMany({ where: { status: 'published' } })
  return articles.map((a) => ({ slug: a.slug }))
}
```

## 8.2 Sitemap Otomatis
File: `src/app/sitemap.ts`
```typescript
import { MetadataRoute } from 'next'
import { prisma } from '@/lib/prisma'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL!

  const articles = await prisma.article.findMany({ where: { status: 'published' } })
  const portfolios = await prisma.portfolio.findMany()

  const articleUrls = articles.map((a) => ({
    url: `${baseUrl}/artikel/${a.slug}`,
    lastModified: a.updatedAt,
  }))

  const portfolioUrls = portfolios.map((p) => ({
    url: `${baseUrl}/portofolio/${p.slug}`,
    lastModified: new Date(),
  }))

  return [
    { url: baseUrl, lastModified: new Date() },
    { url: `${baseUrl}/artikel` },
    { url: `${baseUrl}/portofolio` },
    { url: `${baseUrl}/harga` },
    ...articleUrls,
    ...portfolioUrls,
  ]
}
```

## 8.3 Robots.txt
File: `src/app/robots.ts`
```typescript
import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: '*', allow: '/', disallow: '/admin/' },
    sitemap: `${process.env.NEXT_PUBLIC_SITE_URL}/sitemap.xml`,
  }
}
```

## 8.4 Checklist SEO Tambahan
- Pakai `next/image` untuk semua gambar (otomatis lazy-load + WebP + resize)
- Pastikan setiap halaman punya **satu** `<h1>` saja
- Submit sitemap ke Google Search Console setelah live
- Pastikan semua halaman publik di-render via SSG/SSR (default Next.js App Router sudah begini), bukan client-side rendering penuh
- Gunakan struktur heading yang logis (H1 → H2 → H3) di artikel

---

# 9. AI CHAT — IMPLEMENTASI HYBRID (Rule-based + LLM Fallback)

## 9.1 Knowledge Base Sederhana
File: `src/lib/faq-knowledge.ts`
```typescript
export const faqKnowledge = [
  {
    keywords: ['harga', 'biaya', 'paket', 'tarif'],
    answer: 'Kami punya 3 paket: Starter (mulai Rp 500rb) untuk personal, Growth (mulai Rp 2,5jt) untuk UMKM, dan Enterprise (custom) untuk perusahaan besar. Lihat detail lengkap di halaman Harga ya!',
  },
  {
    keywords: ['lama', 'durasi', 'berapa hari', 'proses'],
    answer: 'Proses pembuatan website biasanya 3-14 hari kerja, tergantung kompleksitas dan paket yang dipilih.',
  },
  {
    keywords: ['portofolio', 'contoh', 'hasil kerja'],
    answer: 'Anda bisa lihat berbagai project yang sudah kami kerjakan di halaman Portofolio. Mau saya arahkan ke sana?',
  },
  {
    keywords: ['revisi', 'ubah', 'ganti desain'],
    answer: 'Setiap paket sudah termasuk jatah revisi gratis (2-3x untuk Starter/Growth, unlimited sesuai kontrak untuk Enterprise).',
  },
]

export function matchFAQ(message: string): string | null {
  const lower = message.toLowerCase()
  for (const item of faqKnowledge) {
    if (item.keywords.some((kw) => lower.includes(kw))) {
      return item.answer
    }
  }
  return null
}
```

## 9.2 API Route Chat
File: `src/app/api/chat/route.ts`
```typescript
import { matchFAQ } from '@/lib/faq-knowledge'
import { prisma } from '@/lib/prisma'
import Groq from 'groq-sdk'

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY })

const SYSTEM_PROMPT = `Kamu adalah asisten virtual untuk jasa pembuatan website & aplikasi bernama "Sasa".
Jawab singkat, ramah, dan profesional dalam Bahasa Indonesia.
Info bisnis:
- Layanan: Website Personal, Website UMKM, Sistem/Aplikasi Korporat
- Paket: Starter (Rp 500rb+), Growth (Rp 2,5jt+), Enterprise (custom)
- Proses: Konsultasi -> Penawaran -> Desain & Development -> Revisi -> Launching
- Jika user ingin bicara dengan tim manusia, arahkan untuk klik tombol "Hubungkan ke WhatsApp Admin".
Jika tidak tahu jawabannya, akui dengan jujur dan arahkan ke WhatsApp admin.`

export async function POST(req: Request) {
  const { message, sessionId } = await req.json()

  // 1. Coba rule-based dulu (gratis, instan)
  const faqAnswer = matchFAQ(message)

  let reply: string
  if (faqAnswer) {
    reply = faqAnswer
  } else {
    // 2. Fallback ke LLM (Groq - gratis untuk volume kecil-menengah)
    const completion = await groq.chat.completions.create({
      model: 'llama-3.1-8b-instant',
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: message },
      ],
      max_tokens: 300,
    })
    reply = completion.choices[0]?.message?.content || 'Maaf, bisa diulang pertanyaannya?'
  }

  // 3. Simpan log percakapan
  await prisma.chatLog.createMany({
    data: [
      { sessionId, role: 'user', message },
      { sessionId, role: 'bot', message: reply },
    ],
  })

  return Response.json({ reply })
}
```

## 9.3 Komponen Widget Chat (Frontend)
File: `src/components/chat/ChatWidget.tsx`
```typescript
'use client'
import { useState } from 'react'
import { MessageCircle, X, Send } from 'lucide-react'

type Message = { role: 'user' | 'bot'; text: string }

export default function ChatWidget() {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    { role: 'bot', text: 'Halo! Ada yang bisa saya bantu? 👋' },
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const sessionId = useState(() => crypto.randomUUID())[0]

  async function sendMessage() {
    if (!input.trim()) return
    const userMsg = input
    setMessages((prev) => [...prev, { role: 'user', text: userMsg }])
    setInput('')
    setLoading(true)

    const res = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: userMsg, sessionId }),
    })
    const data = await res.json()
    setMessages((prev) => [...prev, { role: 'bot', text: data.reply }])
    setLoading(false)
  }

  return (
    <div className="fixed bottom-5 right-5 z-50">
      {open ? (
        <div className="w-80 h-[450px] bg-white rounded-xl shadow-2xl flex flex-col overflow-hidden">
          <div className="bg-blue-600 text-white p-3 flex justify-between items-center">
            <span className="font-semibold">Sasa - Asisten Virtual</span>
            <button onClick={() => setOpen(false)}><X size={18} /></button>
          </div>
          <div className="flex-1 overflow-y-auto p-3 space-y-2">
            {messages.map((m, i) => (
              <div key={i} className={m.role === 'user' ? 'text-right' : 'text-left'}>
                <span className={`inline-block px-3 py-2 rounded-lg text-sm ${
                  m.role === 'user' ? 'bg-blue-600 text-white' : 'bg-gray-100'
                }`}>{m.text}</span>
              </div>
            ))}
            {loading && <p className="text-xs text-gray-400">Sasa sedang mengetik...</p>}
          </div>
          <div className="p-2 border-t flex gap-2">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
              placeholder="Tulis pesan..."
              className="flex-1 border rounded-lg px-3 py-2 text-sm"
            />
            <button onClick={sendMessage} className="bg-blue-600 text-white p-2 rounded-lg">
              <Send size={16} />
            </button>
          </div>
        </div>
      ) : (
        <button
          onClick={() => setOpen(true)}
          className="bg-blue-600 text-white p-4 rounded-full shadow-lg hover:scale-105 transition"
        >
          <MessageCircle size={24} />
        </button>
      )}
    </div>
  )
}
```

Pasang di root layout — `src/app/layout.tsx`, tambahkan `<ChatWidget />` sebelum `</body>`.

> **Kenapa Groq?** Model `llama-3.1-8b-instant` gratis dengan rate limit cukup besar untuk chatbot bisnis kecil-menengah, dan responnya sangat cepat (cocok untuk chat real-time). Kalau kuota habis, tinggal ganti ke Google Gemini (`@ai-sdk/google`) sebagai alternatif — cukup ubah bagian API call di `route.ts`.

---

# 10. UPLOAD GAMBAR (Portofolio & Artikel)

File: `src/app/api/upload/route.ts`
```typescript
import { writeFile } from 'fs/promises'
import path from 'path'

export async function POST(req: Request) {
  const formData = await req.formData()
  const file = formData.get('file') as File

  const bytes = await file.arrayBuffer()
  const buffer = Buffer.from(bytes)

  const filename = `${Date.now()}-${file.name}`
  const filepath = path.join(process.cwd(), 'public/uploads', filename)
  await writeFile(filepath, buffer)

  return Response.json({ url: `/uploads/${filename}` })
}
```

> Untuk produksi, lebih disarankan upgrade ke cloud storage (Vercel Blob Storage atau Cloudinary free tier), karena filesystem di Vercel itu *read-only* saat sudah deploy — folder `public/uploads` hanya bekerja optimal untuk development lokal. Saat deploy, ganti implementasi ini ke Vercel Blob (`@vercel/blob`) — gratis untuk volume kecil.

---

# 11. DEPLOYMENT KE VERCEL

```bash
# Push ke GitHub dulu
git init
git add .
git commit -m "initial setup"
git remote add origin https://github.com/username/jasa-website.git
git push -u origin main
```

Lalu:
1. Buka [vercel.com](https://vercel.com) → New Project → Import dari GitHub
2. Masukkan semua environment variable dari `.env.local` ke Vercel Project Settings → Environment Variables
3. Set `DATABASE_URL` pakai database production (Neon/Supabase)
4. Deploy — otomatis dapat domain `*.vercel.app`, bisa connect custom domain nanti
5. Jalankan migration production: `npx prisma migrate deploy` (bisa lewat Vercel CLI atau GitHub Action)

---

# 12. URUTAN PENGERJAAN (Step-by-Step)

1. Setup project + Tailwind + struktur folder (Bagian 2-4)
2. Setup database + Prisma schema + migrate (Bagian 5)
3. Bangun komponen Home statis dulu pakai dummy data (cepat lihat hasil visual)
4. Setup Auth admin + halaman login (Bagian 7)
5. Bangun CRUD Artikel & Portofolio di admin, sambungkan ke Home (data jadi dinamis)
6. Setup SEO (metadata, sitemap, robots) (Bagian 8)
7. Integrasi AI Chat (Bagian 9)
8. Testing menyeluruh + optimasi gambar/loading
9. Deploy ke Vercel (Bagian 11)
10. Submit sitemap ke Google Search Console

---

*Dokumen ini siap dipakai sebagai panduan development langsung. Setiap kode di atas adalah starting point — sesuaikan styling & detail field dengan kebutuhan final.*




# SETUP TEKNIS LENGKAP
## Website Jasa Pembuatan Website & Aplikasi — Next.js Full Stack

Dokumen ini lanjutan dari Blueprint sebelumnya, fokus ke implementasi teknis: struktur project, database, auth, SEO, dan AI chat.

---

# 1. PREREQUISITES

Pastikan sudah terinstall di komputer:
- **Node.js** versi 18.18 atau lebih baru (cek: `node -v`)
- **npm** atau **pnpm** (disarankan pnpm — lebih cepat & hemat disk)
- **Git**
- Akun **Vercel** (untuk deploy, gratis)
- Akun database: **Neon** atau **Supabase** (PostgreSQL gratis) — atau pakai SQLite dulu untuk lokal
- Akun **Groq** atau **Google AI Studio** (untuk API key AI chat, gratis)

---

# 2. INISIALISASI PROJECT

```bash
npx create-next-app@latest jasa-website --typescript --tailwind --eslint --app --src-dir --import-alias "@/*"
cd jasa-website
```

Pilihan saat wizard:
- TypeScript: **Yes**
- ESLint: **Yes**
- Tailwind CSS: **Yes**
- `src/` directory: **Yes**
- App Router: **Yes**
- Import alias: **Yes** (`@/*`)

---

# 3. INSTALL DEPENDENCIES UTAMA

```bash
# Database & ORM
npm install prisma @prisma/client
npx prisma init

# Auth
npm install next-auth @auth/prisma-adapter bcryptjs
npm install -D @types/bcryptjs

# Form & validasi
npm install react-hook-form zod @hookform/resolvers

# Rich text editor untuk artikel
npm install @tiptap/react @tiptap/starter-kit @tiptap/extension-image @tiptap/extension-link

# AI Chat (Vercel AI SDK)
npm install ai @ai-sdk/google groq-sdk

# Animasi & UI tambahan
npm install framer-motion lucide-react clsx

# Upload gambar (lokal dulu, bisa upgrade ke cloud nanti)
npm install sharp
```

---

# 4. STRUKTUR FOLDER PROJECT

```
jasa-website/
├── prisma/
│   ├── schema.prisma
│   └── seed.ts
├── public/
│   └── uploads/                  # gambar upload (portofolio, artikel)
├── src/
│   ├── app/
│   │   ├── (public)/             # grup route halaman publik
│   │   │   ├── page.tsx          # Home
│   │   │   ├── layout.tsx
│   │   │   ├── artikel/
│   │   │   │   ├── page.tsx      # listing artikel
│   │   │   │   └── [slug]/page.tsx  # detail artikel
│   │   │   ├── portofolio/
│   │   │   │   ├── page.tsx      # listing portofolio
│   │   │   │   └── [slug]/page.tsx  # detail case study
│   │   │   └── harga/page.tsx
│   │   │
│   │   ├── admin/                # area admin (protected)
│   │   │   ├── layout.tsx        # cek auth di sini
│   │   │   ├── page.tsx          # dashboard
│   │   │   ├── login/page.tsx
│   │   │   ├── home/page.tsx     # edit konten Home
│   │   │   ├── artikel/
│   │   │   │   ├── page.tsx
│   │   │   │   ├── baru/page.tsx
│   │   │   │   └── [id]/edit/page.tsx
│   │   │   └── portofolio/
│   │   │       ├── page.tsx
│   │   │       ├── baru/page.tsx
│   │   │       └── [id]/edit/page.tsx
│   │   │
│   │   ├── api/
│   │   │   ├── auth/[...nextauth]/route.ts
│   │   │   ├── artikel/route.ts
│   │   │   ├── portofolio/route.ts
│   │   │   ├── upload/route.ts
│   │   │   └── chat/route.ts      # endpoint AI chat
│   │   │
│   │   ├── sitemap.ts             # sitemap dinamis
│   │   ├── robots.ts
│   │   └── layout.tsx              # root layout
│   │
│   ├── components/
│   │   ├── home/                  # Hero, Pricing, FAQ, Testimoni, dll
│   │   ├── portofolio/
│   │   ├── artikel/
│   │   ├── admin/                 # form, table, sidebar admin
│   │   ├── chat/
│   │   │   └── ChatWidget.tsx
│   │   └── ui/                    # button, card, badge (reusable)
│   │
│   ├── lib/
│   │   ├── prisma.ts              # Prisma client singleton
│   │   ├── auth.ts                # config NextAuth
│   │   ├── faq-knowledge.ts       # knowledge base rule-based chat
│   │   └── utils.ts
│   │
│   └── types/
│       └── index.ts
│
├── .env.local
├── next.config.js
├── tailwind.config.ts
└── package.json
```

---

# 5. DATABASE SCHEMA (Prisma)

File: `prisma/schema.prisma`

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql" // ganti "sqlite" untuk lokal kalau mau lebih simpel di awal
  url      = env("DATABASE_URL")
}

model Admin {
  id        String   @id @default(cuid())
  email     String   @unique
  password  String
  name      String
  createdAt DateTime @default(now())
}

model Article {
  id          String   @id @default(cuid())
  title       String
  slug        String   @unique
  excerpt     String
  content     String   // rich text HTML dari TipTap
  coverImage  String?
  category    String
  metaTitle   String?
  metaDesc    String?
  status      String   @default("draft") // draft | published
  publishedAt DateTime?
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}

model Portfolio {
  id          String   @id @default(cuid())
  title       String
  slug        String   @unique
  category    String
  challenge   String
  solution    String
  result      String?
  techStack   String[] // array tag teknologi
  images      String[] // array url gambar
  demoUrl     String?
  featured    Boolean  @default(false)
  order       Int      @default(0)
  createdAt   DateTime @default(now())
}

model PricingPlan {
  id        String   @id @default(cuid())
  name      String   // Starter, Growth, Enterprise
  price     String
  segment   String   // personal | umkm | korporat
  features  String[]
  highlighted Boolean @default(false)
  order     Int      @default(0)
}

model FAQ {
  id       String @id @default(cuid())
  question String
  answer   String
  order    Int    @default(0)
}

model Testimonial {
  id      String @id @default(cuid())
  name    String
  role    String
  company String?
  quote   String
  avatar  String?
  order   Int    @default(0)
}

model HomeContent {
  id            String @id @default(cuid())
  section       String @unique // "hero", "problem", "cta"
  heading       String
  subheading    String?
  extraData     Json?  // fleksibel untuk field tambahan per section
}

model ChatLog {
  id        String   @id @default(cuid())
  sessionId String
  role      String   // user | bot
  message   String
  createdAt DateTime @default(now())
}
```

Jalankan migrasi:
```bash
npx prisma migrate dev --name init
npx prisma generate
```

Prisma client singleton — `src/lib/prisma.ts`:
```typescript
import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient }

export const prisma = globalForPrisma.prisma ?? new PrismaClient()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
```

---

# 6. ENVIRONMENT VARIABLES

File: `.env.local`

```bash
# Database
DATABASE_URL="postgresql://user:password@host:5432/dbname"

# NextAuth
NEXTAUTH_SECRET="generate-dengan: openssl rand -base64 32"
NEXTAUTH_URL="http://localhost:3000"

# AI Chat
GROQ_API_KEY="gsk_xxxxxxxxxxxx"
GOOGLE_AI_API_KEY="xxxxxxxxxxxx"

# Site config
NEXT_PUBLIC_SITE_URL="https://namadomainkamu.com"
```

> Jangan commit file `.env.local` ke Git. Pastikan ada di `.gitignore` (Next.js sudah otomatis exclude ini).

---

# 7. AUTH ADMIN (NextAuth.js)

File: `src/lib/auth.ts`
```typescript
import { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import { prisma } from './prisma'
import bcrypt from 'bcryptjs'

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null

        const admin = await prisma.admin.findUnique({
          where: { email: credentials.email },
        })
        if (!admin) return null

        const valid = await bcrypt.compare(credentials.password, admin.password)
        if (!valid) return null

        return { id: admin.id, email: admin.email, name: admin.name }
      },
    }),
  ],
  session: { strategy: 'jwt' },
  pages: { signIn: '/admin/login' },
}
```

File: `src/app/api/auth/[...nextauth]/route.ts`
```typescript
import NextAuth from 'next-auth'
import { authOptions } from '@/lib/auth'

const handler = NextAuth(authOptions)
export { handler as GET, handler as POST }
```

Proteksi route admin — `src/app/admin/layout.tsx`:
```typescript
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions)
  if (!session) redirect('/admin/login')

  return <div className="flex">{/* sidebar + children */}{children}</div>
}
```

Membuat admin pertama (script seed) — `prisma/seed.ts`:
```typescript
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  const hashedPassword = await bcrypt.hash('passwordAmanKamu123', 10)
  await prisma.admin.create({
    data: {
      email: 'admin@namadomainkamu.com',
      password: hashedPassword,
      name: 'Admin',
    },
  })
}

main().finally(() => prisma.$disconnect())
```
Jalankan: `npx tsx prisma/seed.ts`

---

# 8. SEO SETUP (Penting!)

## 8.1 Metadata Dinamis per Halaman
Setiap halaman pakai Next.js Metadata API. Contoh untuk detail artikel — `src/app/(public)/artikel/[slug]/page.tsx`:

```typescript
import { Metadata } from 'next'
import { prisma } from '@/lib/prisma'

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const article = await prisma.article.findUnique({ where: { slug: params.slug } })
  if (!article) return {}

  return {
    title: article.metaTitle || article.title,
    description: article.metaDesc || article.excerpt,
    openGraph: {
      title: article.title,
      description: article.excerpt,
      images: article.coverImage ? [article.coverImage] : [],
      type: 'article',
    },
    twitter: {
      card: 'summary_large_image',
      title: article.title,
      description: article.excerpt,
    },
  }
}

export async function generateStaticParams() {
  const articles = await prisma.article.findMany({ where: { status: 'published' } })
  return articles.map((a) => ({ slug: a.slug }))
}
```

## 8.2 Sitemap Otomatis
File: `src/app/sitemap.ts`
```typescript
import { MetadataRoute } from 'next'
import { prisma } from '@/lib/prisma'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL!

  const articles = await prisma.article.findMany({ where: { status: 'published' } })
  const portfolios = await prisma.portfolio.findMany()

  const articleUrls = articles.map((a) => ({
    url: `${baseUrl}/artikel/${a.slug}`,
    lastModified: a.updatedAt,
  }))

  const portfolioUrls = portfolios.map((p) => ({
    url: `${baseUrl}/portofolio/${p.slug}`,
    lastModified: new Date(),
  }))

  return [
    { url: baseUrl, lastModified: new Date() },
    { url: `${baseUrl}/artikel` },
    { url: `${baseUrl}/portofolio` },
    { url: `${baseUrl}/harga` },
    ...articleUrls,
    ...portfolioUrls,
  ]
}
```

## 8.3 Robots.txt
File: `src/app/robots.ts`
```typescript
import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: '*', allow: '/', disallow: '/admin/' },
    sitemap: `${process.env.NEXT_PUBLIC_SITE_URL}/sitemap.xml`,
  }
}
```

## 8.4 Checklist SEO Tambahan
- Pakai `next/image` untuk semua gambar (otomatis lazy-load + WebP + resize)
- Pastikan setiap halaman punya **satu** `<h1>` saja
- Submit sitemap ke Google Search Console setelah live
- Pastikan semua halaman publik di-render via SSG/SSR (default Next.js App Router sudah begini), bukan client-side rendering penuh
- Gunakan struktur heading yang logis (H1 → H2 → H3) di artikel

---

# 9. AI CHAT — IMPLEMENTASI HYBRID (Rule-based + LLM Fallback)

## 9.1 Knowledge Base Sederhana
File: `src/lib/faq-knowledge.ts`
```typescript
export const faqKnowledge = [
  {
    keywords: ['harga', 'biaya', 'paket', 'tarif'],
    answer: 'Kami punya 3 paket: Starter (mulai Rp 500rb) untuk personal, Growth (mulai Rp 2,5jt) untuk UMKM, dan Enterprise (custom) untuk perusahaan besar. Lihat detail lengkap di halaman Harga ya!',
  },
  {
    keywords: ['lama', 'durasi', 'berapa hari', 'proses'],
    answer: 'Proses pembuatan website biasanya 3-14 hari kerja, tergantung kompleksitas dan paket yang dipilih.',
  },
  {
    keywords: ['portofolio', 'contoh', 'hasil kerja'],
    answer: 'Anda bisa lihat berbagai project yang sudah kami kerjakan di halaman Portofolio. Mau saya arahkan ke sana?',
  },
  {
    keywords: ['revisi', 'ubah', 'ganti desain'],
    answer: 'Setiap paket sudah termasuk jatah revisi gratis (2-3x untuk Starter/Growth, unlimited sesuai kontrak untuk Enterprise).',
  },
]

export function matchFAQ(message: string): string | null {
  const lower = message.toLowerCase()
  for (const item of faqKnowledge) {
    if (item.keywords.some((kw) => lower.includes(kw))) {
      return item.answer
    }
  }
  return null
}
```

## 9.2 API Route Chat
File: `src/app/api/chat/route.ts`
```typescript
import { matchFAQ } from '@/lib/faq-knowledge'
import { prisma } from '@/lib/prisma'
import Groq from 'groq-sdk'

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY })

const SYSTEM_PROMPT = `Kamu adalah asisten virtual untuk jasa pembuatan website & aplikasi bernama "Sasa".
Jawab singkat, ramah, dan profesional dalam Bahasa Indonesia.
Info bisnis:
- Layanan: Website Personal, Website UMKM, Sistem/Aplikasi Korporat
- Paket: Starter (Rp 500rb+), Growth (Rp 2,5jt+), Enterprise (custom)
- Proses: Konsultasi -> Penawaran -> Desain & Development -> Revisi -> Launching
- Jika user ingin bicara dengan tim manusia, arahkan untuk klik tombol "Hubungkan ke WhatsApp Admin".
Jika tidak tahu jawabannya, akui dengan jujur dan arahkan ke WhatsApp admin.`

export async function POST(req: Request) {
  const { message, sessionId } = await req.json()

  // 1. Coba rule-based dulu (gratis, instan)
  const faqAnswer = matchFAQ(message)

  let reply: string
  if (faqAnswer) {
    reply = faqAnswer
  } else {
    // 2. Fallback ke LLM (Groq - gratis untuk volume kecil-menengah)
    const completion = await groq.chat.completions.create({
      model: 'llama-3.1-8b-instant',
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: message },
      ],
      max_tokens: 300,
    })
    reply = completion.choices[0]?.message?.content || 'Maaf, bisa diulang pertanyaannya?'
  }

  // 3. Simpan log percakapan
  await prisma.chatLog.createMany({
    data: [
      { sessionId, role: 'user', message },
      { sessionId, role: 'bot', message: reply },
    ],
  })

  return Response.json({ reply })
}
```

## 9.3 Komponen Widget Chat (Frontend)
File: `src/components/chat/ChatWidget.tsx`
```typescript
'use client'
import { useState } from 'react'
import { MessageCircle, X, Send } from 'lucide-react'

type Message = { role: 'user' | 'bot'; text: string }

export default function ChatWidget() {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    { role: 'bot', text: 'Halo! Ada yang bisa saya bantu? 👋' },
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const sessionId = useState(() => crypto.randomUUID())[0]

  async function sendMessage() {
    if (!input.trim()) return
    const userMsg = input
    setMessages((prev) => [...prev, { role: 'user', text: userMsg }])
    setInput('')
    setLoading(true)

    const res = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: userMsg, sessionId }),
    })
    const data = await res.json()
    setMessages((prev) => [...prev, { role: 'bot', text: data.reply }])
    setLoading(false)
  }

  return (
    <div className="fixed bottom-5 right-5 z-50">
      {open ? (
        <div className="w-80 h-[450px] bg-white rounded-xl shadow-2xl flex flex-col overflow-hidden">
          <div className="bg-blue-600 text-white p-3 flex justify-between items-center">
            <span className="font-semibold">Sasa - Asisten Virtual</span>
            <button onClick={() => setOpen(false)}><X size={18} /></button>
          </div>
          <div className="flex-1 overflow-y-auto p-3 space-y-2">
            {messages.map((m, i) => (
              <div key={i} className={m.role === 'user' ? 'text-right' : 'text-left'}>
                <span className={`inline-block px-3 py-2 rounded-lg text-sm ${
                  m.role === 'user' ? 'bg-blue-600 text-white' : 'bg-gray-100'
                }`}>{m.text}</span>
              </div>
            ))}
            {loading && <p className="text-xs text-gray-400">Sasa sedang mengetik...</p>}
          </div>
          <div className="p-2 border-t flex gap-2">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
              placeholder="Tulis pesan..."
              className="flex-1 border rounded-lg px-3 py-2 text-sm"
            />
            <button onClick={sendMessage} className="bg-blue-600 text-white p-2 rounded-lg">
              <Send size={16} />
            </button>
          </div>
        </div>
      ) : (
        <button
          onClick={() => setOpen(true)}
          className="bg-blue-600 text-white p-4 rounded-full shadow-lg hover:scale-105 transition"
        >
          <MessageCircle size={24} />
        </button>
      )}
    </div>
  )
}
```

Pasang di root layout — `src/app/layout.tsx`, tambahkan `<ChatWidget />` sebelum `</body>`.

> **Kenapa Groq?** Model `llama-3.1-8b-instant` gratis dengan rate limit cukup besar untuk chatbot bisnis kecil-menengah, dan responnya sangat cepat (cocok untuk chat real-time). Kalau kuota habis, tinggal ganti ke Google Gemini (`@ai-sdk/google`) sebagai alternatif — cukup ubah bagian API call di `route.ts`.

---

# 10. UPLOAD GAMBAR (Portofolio & Artikel)

File: `src/app/api/upload/route.ts`
```typescript
import { writeFile } from 'fs/promises'
import path from 'path'

export async function POST(req: Request) {
  const formData = await req.formData()
  const file = formData.get('file') as File

  const bytes = await file.arrayBuffer()
  const buffer = Buffer.from(bytes)

  const filename = `${Date.now()}-${file.name}`
  const filepath = path.join(process.cwd(), 'public/uploads', filename)
  await writeFile(filepath, buffer)

  return Response.json({ url: `/uploads/${filename}` })
}
```

> Untuk produksi, lebih disarankan upgrade ke cloud storage (Vercel Blob Storage atau Cloudinary free tier), karena filesystem di Vercel itu *read-only* saat sudah deploy — folder `public/uploads` hanya bekerja optimal untuk development lokal. Saat deploy, ganti implementasi ini ke Vercel Blob (`@vercel/blob`) — gratis untuk volume kecil.

---

# 11. DEPLOYMENT KE VERCEL

```bash
# Push ke GitHub dulu
git init
git add .
git commit -m "initial setup"
git remote add origin https://github.com/username/jasa-website.git
git push -u origin main
```

Lalu:
1. Buka [vercel.com](https://vercel.com) → New Project → Import dari GitHub
2. Masukkan semua environment variable dari `.env.local` ke Vercel Project Settings → Environment Variables
3. Set `DATABASE_URL` pakai database production (Neon/Supabase)
4. Deploy — otomatis dapat domain `*.vercel.app`, bisa connect custom domain nanti
5. Jalankan migration production: `npx prisma migrate deploy` (bisa lewat Vercel CLI atau GitHub Action)

---

# 12. URUTAN PENGERJAAN (Step-by-Step)

1. Setup project + Tailwind + struktur folder (Bagian 2-4)
2. Setup database + Prisma schema + migrate (Bagian 5)
3. Bangun komponen Home statis dulu pakai dummy data (cepat lihat hasil visual)
4. Setup Auth admin + halaman login (Bagian 7)
5. Bangun CRUD Artikel & Portofolio di admin, sambungkan ke Home (data jadi dinamis)
6. Setup SEO (metadata, sitemap, robots) (Bagian 8)
7. Integrasi AI Chat (Bagian 9)
8. Testing menyeluruh + optimasi gambar/loading
9. Deploy ke Vercel (Bagian 11)
10. Submit sitemap ke Google Search Console

---

Output tamabhan yang menajdi tujuan
saya mau sperti ini UI UX nya ,
"A seamless video scrolling animation of a premium portfolio website for a landing page creation agency. The hero section features a dynamic split-screen layout. On one side, sleek modern typography highlighting three distinct client segments: 'Influencers', 'Growing MSMEs', and 'Enterprise Brands'. On the other side, an elegant globe or location pin icon subtly glowing to represent automatic region detection. The UI displays an active language toggle switching smoothly between 'ID' and 'EN'. High-end Dribbble trending style, dark mode with neon accent colors, smooth glassmorphism UI cards, 8k resolution, highly detailed web design concept."
Konsep Copywriting & Sistem Dinamis (Untuk Anda Terapkan di Next.js)
Karena fitur deteksi otomatis tidak bisa dibuat hanya dengan gambar, berikut panduan menerapkannya di coding Anda:
Copywriting Utama (Hero Section):
Versi Indonesia: "Tingkatkan Konversi Anda. Landing Page Kelas Dunia untuk Kreator, UMKM, hingga Skala Enterprise."
Versi Inggris: "Convert More. World-Class Landing Pages for Creators, Startups, and Enterprise Brands."
Sistem Deteksi Bahasa (i18n):
Di Next.js, Anda bisa menggunakan next-intl atau next-i18next.
Website akan membaca Accept-Language dari header browser pengunjung. Jika pengunjung dari luar negeri (misal AS), website otomatis render ke bahasa Inggris. Jika dari Indonesia, pakai bahasa Indonesia.
Sistem Konten Dinamis (Geolokasi):
Gunakan Vercel Edge Functions atau middleware di Next.js. Vercel secara otomatis mendeteksi negara pengunjung (req.geo.country).
Logika: Jika country === 'ID', tampilkan portofolio klien lokal (misal: Toko Kopi UMKM Jakarta). Jika country === 'US', tampilkan portofolio bergaya internasional atau studi kasus berbahasa Inggris.

*Dokumen ini siap dipakai sebagai panduan development langsung. Setiap kode di atas adalah starting point — sesuaikan styling & detail field dengan kebutuhan final.*

