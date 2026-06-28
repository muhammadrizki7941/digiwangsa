import type { Metadata } from "next";
import { useTranslations } from "next-intl";
import { Check } from "lucide-react";
import PageHeader from "@/components/ui/PageHeader";
import CTASection from "@/components/home/CTASection";
import Reveal from "@/components/motion/Reveal";

export const metadata: Metadata = {
  title: "Services — Digiwangsa",
  description:
    "From landing pages to custom web applications — Digiwangsa designs, builds, and maintains digital products that perform.",
};

type ServiceItem = { name: string; desc: string; features: string[] };

export default function ServicesPage() {
  const t = useTranslations("services");
  const items = t.raw("items") as ServiceItem[];

  return (
    <>
      <PageHeader eyebrow={t("eyebrow")} title={t("title")} subtitle={t("subtitle")} />

      <section className="py-16 lg:py-24">
        <div className="mx-auto grid max-w-7xl gap-6 px-5 md:grid-cols-2 lg:px-8">
          {items.map((item, i) => (
            <Reveal
              key={item.name}
              delay={i * 0.08}
              className="card-glass flex flex-col rounded-2xl p-8"
            >
              <span className="mb-5 inline-grid h-11 w-11 place-items-center rounded-xl border border-gold-line/50 bg-elevated font-display text-lg font-semibold text-gold">
                {String(i + 1).padStart(2, "0")}
              </span>
              <h2 className="font-display text-2xl font-semibold text-cream">
                {item.name}
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-muted">{item.desc}</p>

              <p className="mt-6 mb-3 text-[11px] uppercase tracking-[0.2em] text-gold/80">
                {t("feature")}
              </p>
              <ul className="space-y-2.5">
                {item.features.map((f) => (
                  <li key={f} className="flex items-start gap-2.5 text-sm text-cream/85">
                    <Check size={16} className="mt-0.5 shrink-0 text-gold" />
                    {f}
                  </li>
                ))}
              </ul>
            </Reveal>
          ))}
        </div>
      </section>

      <CTASection />
    </>
  );
}
