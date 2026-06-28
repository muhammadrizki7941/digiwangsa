import { useTranslations } from "next-intl";
import Reveal from "@/components/motion/Reveal";
import {
  Sparkles,
  Gauge,
  Target,
  Code2,
  Headset,
  type LucideIcon,
} from "lucide-react";

const icons: Record<string, LucideIcon> = {
  design: Sparkles,
  performance: Gauge,
  strategy: Target,
  custom: Code2,
  support: Headset,
};

export default function WhyChooseSection() {
  const t = useTranslations("why");
  const items = ["design", "performance", "strategy", "custom", "support"] as const;

  return (
    <section className="relative border-y border-gold-line/20 bg-base-2 py-20 lg:py-24">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <Reveal className="mx-auto max-w-2xl text-center">
          <p className="mb-3 text-xs font-medium uppercase tracking-[0.25em] text-gold">
            {t("eyebrow")}
          </p>
          <h2 className="font-display text-3xl font-semibold leading-tight text-cream sm:text-4xl">
            {t("title")}
          </h2>
        </Reveal>

        <div className="mt-14 grid gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-5">
          {items.map((key, i) => {
            const Icon = icons[key];
            return (
              <Reveal key={key} delay={i * 0.08} className="text-center sm:text-left">
                <span className="mb-4 inline-grid h-12 w-12 place-items-center rounded-xl border border-gold-line/50 bg-elevated text-gold">
                  <Icon size={22} />
                </span>
                <h3 className="mb-2 font-display text-lg font-semibold text-cream">
                  {t(`${key}.title`)}
                </h3>
                <p className="text-sm leading-relaxed text-muted">
                  {t(`${key}.desc`)}
                </p>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
