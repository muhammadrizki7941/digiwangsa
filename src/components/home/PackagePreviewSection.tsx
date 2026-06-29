import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { Check, ArrowRight, Star } from "lucide-react";
import { prisma } from "@/lib/prisma";
import Reveal from "@/components/motion/Reveal";
import { cn } from "@/lib/utils";

export default async function PackagePreviewSection() {
  const plans = await prisma.pricingPlan.findMany({ orderBy: { order: "asc" }, take: 3 });
  if (plans.length === 0) return null;

  const t = await getTranslations("pricing");

  return (
    <section className="relative py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <Reveal className="mx-auto mb-12 max-w-2xl text-center">
          <p className="mb-3 text-xs font-medium uppercase tracking-[0.25em] text-gold">
            {t("previewEyebrow")}
          </p>
          <h2 className="font-display text-3xl font-semibold leading-tight text-cream sm:text-4xl">
            {t("previewTitle")}
          </h2>
        </Reveal>

        <div className="grid gap-6 md:grid-cols-3">
          {plans.map((plan, i) => {
            const features = Array.isArray(plan.features)
              ? (plan.features as string[]).slice(0, 3)
              : [];
            return (
              <Reveal key={plan.id} delay={i * 0.1}>
                <Link
                  href="/pricing"
                  className={cn(
                    "group relative flex h-full flex-col rounded-2xl p-7 transition duration-300 hover:-translate-y-1",
                    plan.highlighted
                      ? "border border-gold/60 bg-elevated shadow-[0_20px_60px_-20px_rgba(212,175,55,0.4)]"
                      : "card-glass"
                  )}
                >
                  {plan.highlighted && (
                    <span className="btn-gold absolute -top-3 left-1/2 -translate-x-1/2 rounded-full px-4 py-1 text-[11px] font-semibold">
                      <Star size={11} className="mr-1 inline" />
                      {t("popular")}
                    </span>
                  )}

                  <h3 className="font-display text-xl font-semibold text-cream">
                    {plan.name}
                  </h3>
                  <p className="mt-1 text-xs text-muted">{plan.segment}</p>

                  <div className="mt-4 flex items-baseline gap-1">
                    <span className="text-[11px] text-muted">{t("from")}</span>
                    <span className="text-gold-gradient font-display text-3xl font-bold">
                      {plan.price}
                    </span>
                    {plan.period && (
                      <span className="text-xs text-muted">{plan.period}</span>
                    )}
                  </div>

                  <ul className="mt-5 flex-1 space-y-2">
                    {features.map((f) => (
                      <li key={f} className="flex items-start gap-2 text-sm text-muted">
                        <Check size={15} className="mt-0.5 shrink-0 text-gold" />
                        {f}
                      </li>
                    ))}
                  </ul>

                  <span className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-gold transition group-hover:gap-3">
                    {t("viewDetails")}
                    <ArrowRight size={16} />
                  </span>
                </Link>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
