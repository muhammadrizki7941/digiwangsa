import Link from "next/link";
import { useTranslations } from "next-intl";
import { MessageCircle, ArrowRight } from "lucide-react";
import Reveal from "@/components/motion/Reveal";
import ConsultButton from "@/components/lead/ConsultButton";

export default function CTASection() {
  const t = useTranslations("cta");

  return (
    <section className="py-20 lg:py-28">
      <div className="mx-auto max-w-6xl px-5 lg:px-8">
        <Reveal className="card-glass relative overflow-hidden rounded-3xl px-6 py-14 text-center sm:px-12 lg:py-20">
          <div className="glow-gold pointer-events-none absolute inset-0 scale-110" />
          <p className="relative mb-4 text-xs font-medium uppercase tracking-[0.28em] text-gold">
            {t("eyebrow")}
          </p>
          <h2 className="relative mx-auto max-w-3xl font-display text-3xl font-semibold leading-tight text-cream sm:text-4xl lg:text-5xl">
            {t("title")}
          </h2>
          <p className="relative mx-auto mt-5 max-w-2xl text-base leading-relaxed text-muted">
            {t("subtitle")}
          </p>
          <div className="relative mt-9 flex flex-wrap items-center justify-center gap-4">
            <ConsultButton className="btn-gold flex items-center gap-2 rounded-full px-7 py-3.5 text-sm font-semibold transition">
              <MessageCircle size={18} />
              {t("primary")}
            </ConsultButton>
            <Link
              href="/pricing"
              className="flex items-center gap-2 rounded-full border border-gold-line/60 px-7 py-3.5 text-sm font-medium text-cream transition hover:border-gold/70"
            >
              {t("secondary")}
              <ArrowRight size={16} />
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
