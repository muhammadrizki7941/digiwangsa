This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```


##  DEPLOY ON VPS 
📌 Catatan untuk update ke depan: karena kita pakai db push (bukan migration history), kalau nanti ada perubahan skema, pakai:

npx prisma db push
(bukan migrate deploy). Nanti setelah live, saya bisa rapikan file migration di repo biar migrate deploy jalan lintas-OS — tapi untuk sekarang db push ini yang tercepat bikin kamu online.

Lapor hasil npx prisma db seed dan npm run build ya — kalau dua-duanya sukses, kita langsung ke Fase 5: Add Project + domain + SSL. 

