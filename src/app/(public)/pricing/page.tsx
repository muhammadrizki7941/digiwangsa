import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { Check, Star } from "lucide-react";
import PageHeader from "@/components/ui/PageHeader";
import CTASection from "@/components/home/CTASection";
import Reveal from "@/components/motion/Reveal";
import { prisma } from "@/lib/prisma";
import ConsultButton from "@/components/lead/ConsultButton";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Pricing — Digiwangsa",
  description:
    "Simple, transparent pricing for every stage of growth — from starter landing pages to custom enterprise systems.",
};

export default async function PricingPage() {
  const t = await getTranslations("pricing");
  const plans = await prisma.pricingPlan.findMany({ orderBy: { order: "asc" } });

  return (
    <>
      <PageHeader eyebrow={t("eyebrow")} title={t("title")} subtitle={t("subtitle")} />

      <section className="py-16 lg:py-24">
        <div className="mx-auto grid max-w-6xl items-stretch gap-6 px-5 lg:grid-cols-3 lg:px-8">
          {plans.map((plan, i) => {
            const features = Array.isArray(plan.features)
              ? (plan.features as string[])
              : [];
            return (
              <Reveal
                key={plan.id}
                delay={i * 0.1}
                className={cn(
                  "relative flex flex-col rounded-2xl p-8",
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
                <h2 className="font-display text-xl font-semibold text-cream">
                  {plan.name}
                </h2>
                <p className="mt-1 text-xs text-muted">{plan.segment}</p>

                <div className="mt-5 flex items-baseline gap-1">
                  <span className="text-gold-gradient font-display text-4xl font-bold">
                    {plan.price}
                  </span>
                  {plan.period && (
                    <span className="text-sm text-muted">{plan.period}</span>
                  )}
                </div>

                <ul className="mt-7 flex-1 space-y-3">
                  {features.map((f) => (
                    <li key={f} className="flex items-start gap-2.5 text-sm text-cream/85">
                      <Check size={16} className="mt-0.5 shrink-0 text-gold" />
                      {f}
                    </li>
                  ))}
                </ul>

                <ConsultButton
                  className={cn(
                    "mt-8 w-full rounded-full px-6 py-3 text-center text-sm font-semibold transition",
                    plan.highlighted
                      ? "btn-gold"
                      : "border border-gold-line/60 text-cream hover:border-gold/70"
                  )}
                >
                  {t("cta")}
                </ConsultButton>
              </Reveal>
            );
          })}
        </div>
      </section>

      <CTASection />
    </>
  );
}
