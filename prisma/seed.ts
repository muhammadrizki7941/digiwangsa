import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const articles = [
  {
    title: "Kenapa Bisnis Anda Butuh Website di 2025",
    slug: "kenapa-bisnis-butuh-website",
    category: "Strategi Digital",
    readMins: 5,
    excerpt:
      "Media sosial saja tidak cukup. Inilah alasan website tetap menjadi fondasi kehadiran digital yang kredibel.",
    content:
      "Banyak bisnis mengandalkan media sosial sebagai satu-satunya kanal digital. Padahal, platform tersebut bisa berubah aturan kapan saja, dan Anda tidak benar-benar memiliki audiens di sana.\n\nWebsite adalah aset yang Anda miliki sepenuhnya. Ia menjadi pusat kredibilitas, tempat calon pelanggan memverifikasi keseriusan bisnis Anda sebelum membeli.\n\nDengan SEO yang tepat, website juga menjadi mesin pencari pelanggan baru yang bekerja 24 jam tanpa henti — sesuatu yang sulit dicapai hanya dengan unggahan media sosial.",
  },
  {
    title: "Anatomi Landing Page yang Mengonversi",
    slug: "anatomi-landing-page-konversi",
    category: "Desain & Konversi",
    readMins: 6,
    excerpt:
      "Desain cantik saja tidak menjual. Pelajari elemen kunci yang membuat pengunjung mengambil tindakan.",
    content:
      "Landing page yang efektif dimulai dari headline yang jelas — pengunjung harus paham nilai Anda dalam tiga detik pertama.\n\nSetelah itu, bukti sosial seperti testimoni dan logo klien membangun kepercayaan. Tanpa kepercayaan, tidak ada konversi.\n\nTerakhir, satu ajakan bertindak (CTA) yang menonjol dan diulang di titik strategis akan memandu pengunjung menuju langkah berikutnya tanpa kebingungan.",
  },
  {
    title: "Memilih Tech Stack yang Tepat untuk Proyek Anda",
    slug: "memilih-tech-stack-yang-tepat",
    category: "Pengembangan",
    readMins: 7,
    excerpt:
      "Tidak ada stack yang sempurna untuk semua. Berikut cara menyesuaikan teknologi dengan tujuan bisnis.",
    content:
      "Pemilihan teknologi sebaiknya berangkat dari kebutuhan, bukan tren. Website company profile tidak butuh arsitektur sekompleks aplikasi enterprise.\n\nUntuk kecepatan dan SEO, kami sering memilih Next.js karena rendering server dan optimasi gambar bawaannya.\n\nYang terpenting, stack harus mudah dirawat dalam jangka panjang sehingga bisnis tidak terjebak pada teknologi yang sulit dikembangkan.",
  },
];

const portfolios = [
  {
    slug: "anindita-creator",
    client: "Anindita",
    year: "2025",
    category: "Personal Brand",
    accent: "from-amber-900/40 to-base",
    order: 1,
    featured: true,
    title: "Rumah Digital untuk Seorang Content Creator",
    summary:
      "Website personal premium yang menyatukan portofolio, kolaborasi, dan cerita seorang influencer.",
    challenge:
      "Anindita memiliki audiens besar di media sosial, namun tidak punya rumah digital yang merepresentasikan brand pribadinya secara profesional.",
    solution:
      "Kami merancang website elegan dengan halaman portofolio, media kit, dan formulir kolaborasi, lengkap dengan animasi halus yang memperkuat kesan premium.",
    result:
      "Inquiry kolaborasi meningkat dan brand pribadinya kini tampil kredibel di mata mitra.",
    tech: ["Next.js", "Tailwind CSS", "Framer Motion", "Vercel"],
    demoUrl: "#",
  },
  {
    slug: "kopi-nusantara",
    client: "Kopi Nusantara",
    year: "2025",
    category: "UMKM & E-Commerce",
    accent: "from-yellow-900/40 to-base",
    order: 2,
    featured: true,
    title: "Toko Kopi Lokal, Kualitas Global",
    summary:
      "Toko online untuk UMKM kopi dengan manajemen produk dan pembayaran terintegrasi.",
    challenge:
      "Penjualan masih mengandalkan chat manual sehingga sulit melacak pesanan dan stok.",
    solution:
      "Kami membangun toko online dengan katalog produk, keranjang, integrasi pembayaran, dan dashboard pesanan yang mudah dikelola.",
    result:
      "Proses pemesanan otomatis menghemat waktu dan meningkatkan kepercayaan pelanggan.",
    tech: ["Next.js", "Prisma", "MySQL", "Midtrans"],
    demoUrl: "#",
  },
  {
    slug: "nusantara-logistics",
    client: "Nusantara Logistics",
    year: "2024",
    category: "Aplikasi Enterprise",
    accent: "from-stone-700/40 to-base",
    order: 3,
    featured: false,
    title: "Sistem Manajemen Operasional Logistik",
    summary:
      "Aplikasi web internal untuk memantau armada, pengiriman, dan laporan secara real-time.",
    challenge:
      "Operasional masih tercatat di spreadsheet terpisah sehingga rawan kesalahan dan lambat.",
    solution:
      "Kami membangun sistem custom dengan peran pengguna, dashboard analitik, dan integrasi API pelacakan.",
    result:
      "Visibilitas operasional meningkat dan keputusan dapat diambil berbasis data.",
    tech: ["Next.js", "Prisma", "PostgreSQL", "Recharts"],
    demoUrl: "#",
  },
  {
    slug: "batik-warisan",
    client: "Batik Warisan",
    year: "2024",
    category: "Company Profile",
    accent: "from-orange-900/40 to-base",
    order: 4,
    featured: false,
    title: "Company Profile Penuh Cerita Budaya",
    summary:
      "Website company profile yang menonjolkan warisan dan kualitas produk batik.",
    challenge:
      "Brand batik premium membutuhkan kehadiran online yang setara dengan kualitas produknya.",
    solution:
      "Kami merancang website bercerita dengan galeri, narasi sejarah, dan integrasi katalog.",
    result: "Brand kini tampil mewah dan menjangkau pasar yang lebih luas.",
    tech: ["Next.js", "Tailwind CSS", "Sanity CMS"],
    demoUrl: "#",
  },
];

const pricingPlans = [
  {
    name: "Starter",
    price: "Rp 500rb",
    period: "/ proyek",
    segment: "Untuk kreator & personal brand",
    features: ["Landing page 1–3 halaman", "Desain responsif premium", "Setup SEO dasar", "Integrasi WhatsApp", "2x revisi gratis"],
    highlighted: false,
    order: 1,
  },
  {
    name: "Growth",
    price: "Rp 5jt",
    period: "/ proyek",
    segment: "Untuk UMKM & bisnis bertumbuh",
    features: ["Hingga 8 halaman", "Desain custom & CMS", "SEO lanjutan & analitik", "Siap e-commerce", "Integrasi pembayaran", "4x revisi gratis"],
    highlighted: true,
    order: 2,
  },
  {
    name: "Enterprise",
    price: "Custom",
    period: "",
    segment: "Untuk perusahaan & sistem custom",
    features: ["Aplikasi web custom", "Dashboard & peran khusus", "Integrasi API & sistem", "Arsitektur cloud skalabel", "Dukungan prioritas & SLA", "Revisi tanpa batas (sesuai kontrak)"],
    highlighted: false,
    order: 3,
  },
];

const faqs = [
  { question: "Berapa lama proses pembuatan website?", answer: "Umumnya 3–14 hari kerja, tergantung kompleksitas dan paket yang dipilih.", order: 1 },
  { question: "Apakah sudah termasuk domain & hosting?", answer: "Kami bantu setup domain & hosting; biayanya menyesuaikan provider. Untuk paket tertentu, tahun pertama bisa kami bundel.", order: 2 },
  { question: "Apakah bisa request desain custom?", answer: "Tentu. Setiap proyek kami buat custom sesuai identitas brand Anda, bukan template.", order: 3 },
  { question: "Bagaimana sistem pembayarannya?", answer: "Umumnya DP 50% di awal dan pelunasan saat proyek selesai sebelum launching. Detail bisa didiskusikan via WhatsApp.", order: 4 },
  { question: "Apakah ada garansi & dukungan setelah launching?", answer: "Ya, kami menyediakan masa dukungan dan opsi maintenance berkelanjutan agar website tetap aman & optimal.", order: 5 },
];

const testimonials = [
  { name: "Anindita Putri", role: "Content Creator", company: "Personal Brand", quote: "Websitenya benar-benar merepresentasikan personal brand saya. Inquiry kolaborasi langsung meningkat!", order: 1 },
  { name: "Budi Santoso", role: "Pemilik", company: "Kopi Nusantara", quote: "Toko online kami jadi rapi dan profesional. Proses pesanan otomatis sangat menghemat waktu.", order: 2 },
  { name: "Rina Hartono", role: "Operations Manager", company: "Nusantara Logistics", quote: "Sistem internal yang dibangun Digiwangsa membuat operasional kami jauh lebih terkontrol dan berbasis data.", order: 3 },
];

async function main() {
  const email = "admin@digiwangsa.com";
  const password = await bcrypt.hash("admin123", 10);
  await prisma.admin.upsert({
    where: { email },
    update: {},
    create: { email, password, name: "Admin Digiwangsa" },
  });
  console.log(`✔ Admin ready: ${email} / admin123`);

  for (const a of articles) {
    await prisma.article.upsert({
      where: { slug: a.slug },
      update: {},
      create: { ...a, status: "published", publishedAt: new Date() },
    });
  }
  console.log(`✔ Seeded ${articles.length} articles`);

  for (const p of portfolios) {
    await prisma.portfolio.upsert({
      where: { slug: p.slug },
      update: {},
      create: p,
    });
  }
  console.log(`✔ Seeded ${portfolios.length} portfolio projects`);

  if ((await prisma.pricingPlan.count()) === 0) {
    await prisma.pricingPlan.createMany({ data: pricingPlans });
    console.log(`✔ Seeded ${pricingPlans.length} pricing plans`);
  }
  if ((await prisma.fAQ.count()) === 0) {
    await prisma.fAQ.createMany({ data: faqs });
    console.log(`✔ Seeded ${faqs.length} FAQs`);
  }
  if ((await prisma.testimonial.count()) === 0) {
    await prisma.testimonial.createMany({ data: testimonials });
    console.log(`✔ Seeded ${testimonials.length} testimonials`);
  }

  await prisma.setting.upsert({
    where: { key: "team_online" },
    update: {},
    create: { key: "team_online", value: "false" },
  });
  await prisma.setting.upsert({
    where: { key: "whatsapp_number" },
    update: {},
    create: {
      key: "whatsapp_number",
      value: (process.env.NEXT_PUBLIC_WHATSAPP || "6280000000000").replace(/[^0-9]/g, ""),
    },
  });
  console.log("✔ Settings (team_online, whatsapp_number) ready");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
