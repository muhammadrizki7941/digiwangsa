import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { Globe } from "lucide-react";
import DomainChecker from "@/components/domain/DomainChecker";
import CTASection from "@/components/home/CTASection";
import { getWhatsappNumber } from "@/lib/settings";

export const metadata: Metadata = {
  title: "Cek Domain — Digiwangsa",
  description:
    "Cek ketersediaan domain bisnis Anda dan harganya secara instan, lalu pesan langsung ke Digiwangsa.",
};

export default async function DomainPage() {
  const t = await getTranslations("domain");
  const whatsapp = await getWhatsappNumber();

  return (
    <>
      <section className="pt-32 pb-20 lg:pt-40">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <div className="mx-auto mb-10 max-w-2xl text-center">
            <span className="mb-4 inline-flex items-center gap-2 rounded-full border border-gold-line/50 bg-elevated px-4 py-1.5 text-xs uppercase tracking-[0.2em] text-gold">
              <Globe size={14} />
              {t("eyebrow")}
            </span>
            <h1 className="font-display text-4xl font-semibold leading-tight text-cream sm:text-5xl">
              {t("title")}
            </h1>
            <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-muted">
              {t("subtitle")}
            </p>
          </div>

          <DomainChecker whatsapp={whatsapp} />
        </div>
      </section>

      <CTASection />
    </>
  );
}
