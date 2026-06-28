import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { Sparkles } from "lucide-react";
import AiStudio from "@/components/ai/AiStudio";

export const metadata: Metadata = {
  title: "AI Landing Page Studio — Digiwangsa",
  description:
    "Describe your business and let Digiwangsa's AI design a landing page concept in seconds.",
};

export default async function AiStudioPage() {
  const t = await getTranslations("aiStudio");

  return (
    <section className="pt-32 pb-20 lg:pt-40">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <div className="mx-auto mb-10 max-w-3xl text-center">
          <span className="mb-4 inline-flex items-center gap-2 rounded-full border border-gold-line/50 bg-elevated px-4 py-1.5 text-xs uppercase tracking-[0.2em] text-gold">
            <Sparkles size={14} />
            {t("badge")}
          </span>
          <h1 className="font-display text-4xl font-semibold leading-tight text-cream sm:text-5xl">
            {t("title")}
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-muted">
            {t("subtitle")}
          </p>
        </div>

        <AiStudio />
      </div>
    </section>
  );
}
