import Link from "next/link";
import { useTranslations } from "next-intl";
import { ArrowRight, Crown } from "lucide-react";
import Reveal from "@/components/motion/Reveal";

export default function SolutionsSection() {
  const t = useTranslations("solutions");
  const items = ["personal", "umkm", "enterprise"] as const;

  return (
    <section className="relative py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <Reveal className="max-w-3xl">
          <p className="mb-3 text-xs font-medium uppercase tracking-[0.25em] text-gold">
            {t("eyebrow")}
          </p>
          <h2 className="font-display text-3xl font-semibold leading-tight text-cream sm:text-4xl">
            {t("title")}
          </h2>
          <p className="mt-4 text-base leading-relaxed text-muted">
            {t("subtitle")}
          </p>
        </Reveal>

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {items.map((key, i) => (
            <Reveal
              key={key}
              delay={i * 0.12}
              className="card-glass group relative flex flex-col overflow-hidden rounded-2xl p-7 transition duration-300 hover:-translate-y-1"
            >
              <div className="mb-6 flex items-center justify-between">
                <span className="text-[11px] font-medium uppercase tracking-[0.18em] text-gold/90">
                  {t(`${key}.tag`)}
                </span>
                <span className="grid h-9 w-9 place-items-center rounded-full border border-gold-line/50 text-gold">
                  <Crown size={16} />
                </span>
              </div>

              <h3 className="font-display text-2xl font-semibold leading-snug text-cream">
                {t(`${key}.title`)}
              </h3>
              <p className="mt-4 flex-1 text-sm leading-relaxed text-muted">
                {t(`${key}.desc`)}
              </p>

              <Link
                href="/portfolio"
                className="mt-7 inline-flex items-center gap-2 text-sm font-medium text-gold transition group-hover:gap-3"
              >
                {t("viewCase")}
                <ArrowRight size={16} />
              </Link>

              <span className="pointer-events-none absolute -right-6 -top-6 font-display text-7xl font-semibold text-gold/5">
                0{i + 1}
              </span>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
