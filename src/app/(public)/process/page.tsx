import type { Metadata } from "next";
import { useTranslations } from "next-intl";
import PageHeader from "@/components/ui/PageHeader";
import CTASection from "@/components/home/CTASection";
import Reveal from "@/components/motion/Reveal";

export const metadata: Metadata = {
  title: "Process — Digiwangsa",
  description:
    "A transparent, collaborative process from consultation to launch — you always know what happens next.",
};

type Step = { step: string; name: string; desc: string };

export default function ProcessPage() {
  const t = useTranslations("process");
  const steps = t.raw("steps") as Step[];

  return (
    <>
      <PageHeader eyebrow={t("eyebrow")} title={t("title")} subtitle={t("subtitle")} />

      <section className="py-16 lg:py-24">
        <div className="mx-auto max-w-4xl px-5 lg:px-8">
          <ol className="relative border-l border-gold-line/40 pl-8 sm:pl-12">
            {steps.map((s, i) => (
              <Reveal
                key={s.step}
                delay={i * 0.08}
                className="relative mb-12 last:mb-0"
              >
                <span className="absolute -left-[3.05rem] grid h-12 w-12 place-items-center rounded-full border border-gold-line/60 bg-elevated font-display text-lg font-semibold text-gold sm:-left-[4.55rem]">
                  {s.step}
                </span>
                <h2 className="font-display text-2xl font-semibold text-cream">
                  {s.name}
                </h2>
                <p className="mt-2 max-w-xl text-sm leading-relaxed text-muted">
                  {s.desc}
                </p>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>

      <CTASection />
    </>
  );
}
