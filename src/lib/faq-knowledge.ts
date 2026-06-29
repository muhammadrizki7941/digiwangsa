/** Bilingual rule-based knowledge base for the Digiwangsa assistant.
 * Keywords are intentionally specific so generic questions fall through to the LLM. */

type Answer = { id: string; en: string };
type FaqEntry = { keywords: string[]; answer: Answer };

export const faqKnowledge: FaqEntry[] = [
  {
    keywords: ["harga", "biaya", "tarif", "paket", "price", "pricing", "rega", "budget", "berapa duit"],
    answer: {
      id: "Kami punya 3 paket: Starter (mulai Rp 500rb) untuk kreator/personal, Growth (mulai Rp 5jt) untuk UMKM, dan Enterprise (custom) untuk perusahaan. Detail lengkap ada di halaman Harga ya!",
      en: "We have 3 plans: Starter (from Rp 500K) for creators, Growth (from Rp 5M) for MSMEs, and Enterprise (custom) for companies. Full details are on the Pricing page!",
    },
  },
  {
    keywords: ["berapa lama", "durasi", "berapa hari", "how long", "timeline", "lead time", "kapan selesai", "estimasi waktu"],
    answer: {
      id: "Proses pembuatan biasanya 3–14 hari kerja, tergantung kompleksitas dan paket yang dipilih.",
      en: "A typical project takes 3–14 working days, depending on complexity and the chosen plan.",
    },
  },
  {
    keywords: ["portofolio", "portfolio", "case study", "studi kasus", "hasil kerja", "contoh proyek", "contoh project"],
    answer: {
      id: "Anda bisa melihat berbagai proyek yang sudah kami kerjakan di halaman Portofolio. Mau saya arahkan ke sana?",
      en: "You can see the projects we've worked on in the Portfolio page. Want me to point you there?",
    },
  },
  {
    keywords: ["revisi", "revision"],
    answer: {
      id: "Setiap paket sudah termasuk jatah revisi gratis (2x untuk Starter, 4x untuk Growth, dan sesuai kontrak untuk Enterprise).",
      en: "Every plan includes free revisions (2x for Starter, 4x for Growth, and per contract for Enterprise).",
    },
  },
  {
    keywords: ["layanan apa", "jasa apa", "layanan kalian", "jasa kalian", "jenis layanan", "what services", "services do you", "what do you offer"],
    answer: {
      id: "Kami membuat Company Profile & Landing Page, E-Commerce/Toko Online, Aplikasi Web/Sistem Custom, serta layanan Maintenance & SEO. Lihat halaman Layanan untuk detailnya.",
      en: "We build Company Profiles & Landing Pages, E-Commerce stores, custom Web Applications/Systems, plus Maintenance & SEO. Check the Services page for details.",
    },
  },
  {
    keywords: ["proses", "cara kerja", "tahapan", "alur kerja", "workflow", "how do you work"],
    answer: {
      id: "Alur kami: Konsultasi → Penawaran → Desain & Pengembangan → Revisi → Peluncuran & Dukungan. Selengkapnya di halaman Proses.",
      en: "Our flow: Consultation → Proposal → Design & Development → Revision → Launch & Support. More on the Process page.",
    },
  },
  {
    keywords: ["halo", "hai", "hello", "assalamualaikum", "sugeng", "good morning", "good afternoon", "good evening"],
    answer: {
      id: "Halo! 👋 Saya asisten Digiwangsa. Ada yang bisa saya bantu seputar pembuatan website atau aplikasi?",
      en: "Hi there! 👋 I'm the Digiwangsa assistant. How can I help with your website or application needs?",
    },
  },
];

export type Lang = "id" | "en" | "jv";

function escapeRegex(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/** Match a user message against the knowledge base using word boundaries.
 * Returns a localized answer, or null so the caller can fall back to the LLM. */
export function matchFAQ(message: string, lang: Lang): string | null {
  const lower = message.toLowerCase();
  for (const item of faqKnowledge) {
    const hit = item.keywords.some((kw) => {
      const re = new RegExp(`(^|[^a-z0-9])${escapeRegex(kw)}([^a-z0-9]|$)`, "i");
      return re.test(lower);
    });
    if (hit) {
      // Javanese falls back to Indonesian.
      return lang === "en" ? item.answer.en : item.answer.id;
    }
  }
  return null;
}
