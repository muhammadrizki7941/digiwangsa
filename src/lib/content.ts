import type { Locale } from "@/i18n/config";

/** Bilingual string. Javanese falls back to Indonesian. */
export type L = { id: string; en: string };

export function pick(value: L, locale: Locale): string {
  return locale === "en" ? value.en : value.id;
}

export type Project = {
  slug: string;
  category: L;
  client: string;
  year: string;
  accent: string; // gradient classes for the cover placeholder
  title: L;
  summary: L;
  challenge: L;
  solution: L;
  result: L;
  tech: string[];
  demoUrl?: string;
};

export const projects: Project[] = [
  {
    slug: "anindita-creator",
    client: "Anindita",
    year: "2025",
    accent: "from-amber-900/40 to-base",
    category: { id: "Personal Brand", en: "Personal Brand" },
    title: {
      id: "Rumah Digital untuk Seorang Content Creator",
      en: "A Digital Home for a Content Creator",
    },
    summary: {
      id: "Website personal premium yang menyatukan portofolio, kolaborasi, dan cerita seorang influencer.",
      en: "A premium personal website uniting an influencer's portfolio, collaborations, and story.",
    },
    challenge: {
      id: "Anindita memiliki audiens besar di media sosial, namun tidak punya rumah digital yang merepresentasikan brand pribadinya secara profesional.",
      en: "Anindita had a large social audience but no digital home that represented her personal brand professionally.",
    },
    solution: {
      id: "Kami merancang website elegan dengan halaman portofolio, media kit, dan formulir kolaborasi, lengkap dengan animasi halus yang memperkuat kesan premium.",
      en: "We crafted an elegant site with a portfolio, media kit, and collaboration form, complete with subtle animations that reinforce a premium feel.",
    },
    result: {
      id: "Inquiry kolaborasi meningkat dan brand pribadinya kini tampil kredibel di mata mitra.",
      en: "Collaboration inquiries grew, and her personal brand now appears credible to partners.",
    },
    tech: ["Next.js", "Tailwind CSS", "Framer Motion", "Vercel"],
    demoUrl: "#",
  },
  {
    slug: "kopi-nusantara",
    client: "Kopi Nusantara",
    year: "2025",
    accent: "from-yellow-900/40 to-base",
    category: { id: "UMKM & E-Commerce", en: "MSME & E-Commerce" },
    title: {
      id: "Toko Kopi Lokal, Kualitas Global",
      en: "Local Coffee, Global Quality",
    },
    summary: {
      id: "Toko online untuk UMKM kopi dengan manajemen produk dan pembayaran terintegrasi.",
      en: "An online store for a coffee MSME with product management and integrated payments.",
    },
    challenge: {
      id: "Penjualan masih mengandalkan chat manual sehingga sulit melacak pesanan dan stok.",
      en: "Sales relied on manual chat, making it hard to track orders and stock.",
    },
    solution: {
      id: "Kami membangun toko online dengan katalog produk, keranjang, integrasi pembayaran, dan dashboard pesanan yang mudah dikelola.",
      en: "We built an online store with a product catalog, cart, payment integration, and an easy-to-manage order dashboard.",
    },
    result: {
      id: "Proses pemesanan otomatis menghemat waktu dan meningkatkan kepercayaan pelanggan.",
      en: "Automated ordering saved time and increased customer trust.",
    },
    tech: ["Next.js", "Prisma", "MySQL", "Midtrans"],
    demoUrl: "#",
  },
  {
    slug: "nusantara-logistics",
    client: "Nusantara Logistics",
    year: "2024",
    accent: "from-stone-700/40 to-base",
    category: { id: "Aplikasi Enterprise", en: "Enterprise Application" },
    title: {
      id: "Sistem Manajemen Operasional Logistik",
      en: "Logistics Operations Management System",
    },
    summary: {
      id: "Aplikasi web internal untuk memantau armada, pengiriman, dan laporan secara real-time.",
      en: "An internal web app to monitor fleet, deliveries, and reports in real time.",
    },
    challenge: {
      id: "Operasional masih tercatat di spreadsheet terpisah sehingga rawan kesalahan dan lambat.",
      en: "Operations were tracked across separate spreadsheets — error-prone and slow.",
    },
    solution: {
      id: "Kami membangun sistem custom dengan peran pengguna, dashboard analitik, dan integrasi API pelacakan.",
      en: "We built a custom system with user roles, an analytics dashboard, and tracking API integration.",
    },
    result: {
      id: "Visibilitas operasional meningkat dan keputusan dapat diambil berbasis data.",
      en: "Operational visibility improved and decisions became data-driven.",
    },
    tech: ["Next.js", "Prisma", "PostgreSQL", "Recharts"],
    demoUrl: "#",
  },
  {
    slug: "batik-warisan",
    client: "Batik Warisan",
    year: "2024",
    accent: "from-orange-900/40 to-base",
    category: { id: "Company Profile", en: "Company Profile" },
    title: {
      id: "Company Profile Penuh Cerita Budaya",
      en: "A Company Profile Rich With Cultural Story",
    },
    summary: {
      id: "Website company profile yang menonjolkan warisan dan kualitas produk batik.",
      en: "A company profile website highlighting the heritage and quality of batik products.",
    },
    challenge: {
      id: "Brand batik premium membutuhkan kehadiran online yang setara dengan kualitas produknya.",
      en: "A premium batik brand needed an online presence matching its product quality.",
    },
    solution: {
      id: "Kami merancang website bercerita dengan galeri, narasi sejarah, dan integrasi katalog.",
      en: "We designed a storytelling website with a gallery, historical narrative, and catalog integration.",
    },
    result: {
      id: "Brand kini tampil mewah dan menjangkau pasar yang lebih luas.",
      en: "The brand now appears luxurious and reaches a wider market.",
    },
    tech: ["Next.js", "Tailwind CSS", "Sanity CMS"],
    demoUrl: "#",
  },
];

export type Post = {
  slug: string;
  category: L;
  date: string;
  readMins: number;
  title: L;
  excerpt: L;
  body: L; // paragraphs separated by blank lines
};

export const posts: Post[] = [
  {
    slug: "kenapa-bisnis-butuh-website",
    category: { id: "Strategi Digital", en: "Digital Strategy" },
    date: "2025-05-12",
    readMins: 5,
    title: {
      id: "Kenapa Bisnis Anda Butuh Website di 2025",
      en: "Why Your Business Needs a Website in 2025",
    },
    excerpt: {
      id: "Media sosial saja tidak cukup. Inilah alasan website tetap menjadi fondasi kehadiran digital yang kredibel.",
      en: "Social media alone isn't enough. Here's why a website remains the foundation of a credible digital presence.",
    },
    body: {
      id: "Banyak bisnis mengandalkan media sosial sebagai satu-satunya kanal digital. Padahal, platform tersebut bisa berubah aturan kapan saja, dan Anda tidak benar-benar memiliki audiens di sana.\n\nWebsite adalah aset yang Anda miliki sepenuhnya. Ia menjadi pusat kredibilitas, tempat calon pelanggan memverifikasi keseriusan bisnis Anda sebelum membeli.\n\nDengan SEO yang tepat, website juga menjadi mesin pencari pelanggan baru yang bekerja 24 jam tanpa henti — sesuatu yang sulit dicapai hanya dengan unggahan media sosial.",
      en: "Many businesses rely on social media as their only digital channel. Yet those platforms can change their rules anytime, and you don't truly own your audience there.\n\nA website is an asset you fully own. It becomes your hub of credibility, where prospective customers verify your seriousness before buying.\n\nWith proper SEO, a website also becomes a customer-finding engine that works 24/7 — something hard to achieve with social posts alone.",
    },
  },
  {
    slug: "anatomi-landing-page-konversi",
    category: { id: "Desain & Konversi", en: "Design & Conversion" },
    date: "2025-04-28",
    readMins: 6,
    title: {
      id: "Anatomi Landing Page yang Mengonversi",
      en: "The Anatomy of a Landing Page That Converts",
    },
    excerpt: {
      id: "Desain cantik saja tidak menjual. Pelajari elemen kunci yang membuat pengunjung mengambil tindakan.",
      en: "Pretty design alone doesn't sell. Learn the key elements that make visitors take action.",
    },
    body: {
      id: "Landing page yang efektif dimulai dari headline yang jelas — pengunjung harus paham nilai Anda dalam tiga detik pertama.\n\nSetelah itu, bukti sosial seperti testimoni dan logo klien membangun kepercayaan. Tanpa kepercayaan, tidak ada konversi.\n\nTerakhir, satu ajakan bertindak (CTA) yang menonjol dan diulang di titik strategis akan memandu pengunjung menuju langkah berikutnya tanpa kebingungan.",
      en: "An effective landing page starts with a clear headline — visitors must grasp your value in the first three seconds.\n\nNext, social proof such as testimonials and client logos builds trust. Without trust, there is no conversion.\n\nFinally, a single prominent call to action, repeated at strategic points, guides visitors toward the next step without confusion.",
    },
  },
  {
    slug: "memilih-tech-stack-yang-tepat",
    category: { id: "Pengembangan", en: "Development" },
    date: "2025-04-10",
    readMins: 7,
    title: {
      id: "Memilih Tech Stack yang Tepat untuk Proyek Anda",
      en: "Choosing the Right Tech Stack for Your Project",
    },
    excerpt: {
      id: "Tidak ada stack yang sempurna untuk semua. Berikut cara menyesuaikan teknologi dengan tujuan bisnis.",
      en: "There's no perfect stack for everything. Here's how to match technology to business goals.",
    },
    body: {
      id: "Pemilihan teknologi sebaiknya berangkat dari kebutuhan, bukan tren. Website company profile tidak butuh arsitektur sekompleks aplikasi enterprise.\n\nUntuk kecepatan dan SEO, kami sering memilih Next.js karena rendering server dan optimasi gambar bawaannya.\n\nYang terpenting, stack harus mudah dirawat dalam jangka panjang sehingga bisnis tidak terjebak pada teknologi yang sulit dikembangkan.",
      en: "Technology choices should start from needs, not trends. A company profile site doesn't need the complex architecture of an enterprise application.\n\nFor speed and SEO, we often choose Next.js for its server rendering and built-in image optimization.\n\nMost importantly, the stack must be maintainable long term so the business isn't locked into hard-to-extend technology.",
    },
  },
];

export function formatDate(iso: string, locale: Locale): string {
  return new Date(iso).toLocaleDateString(locale === "en" ? "en-US" : "id-ID", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}
