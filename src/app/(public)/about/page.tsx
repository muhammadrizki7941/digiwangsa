import type { Metadata } from "next";
import Image from "next/image";
import { useTranslations } from "next-intl";
import PageHeader from "@/components/ui/PageHeader";
import CTASection from "@/components/home/CTASection";
import Reveal from "@/components/motion/Reveal";

export const metadata: Metadata = {
  title: "About Us — Digiwangsa",
  description:
    "Digiwangsa blends Javanese heritage with world-class web engineering to build digital legacies that last.",
};

type Value = { name: string; desc: string };

export default function AboutPage() {
  const t = useTranslations("about");
  const values = t.raw("values") as Value[];

  return (
    <>
      <PageHeader eyebrow={t("eyebrow")} title={t("title")} />

      <section className="py-16 lg:py-24">
        <div className="mx-auto grid max-w-6xl items-center gap-12 px-5 lg:grid-cols-2 lg:px-8">
          <Reveal>
            <p className="text-lg leading-relaxed text-cream/90">{t("intro")}</p>
            <p className="mt-6 leading-relaxed text-muted">{t("story")}</p>
          </Reveal>
          <Reveal delay={0.1} className="relative">
            <div className="glow-gold absolute inset-0 scale-110" />
            <Image
              src="/asset/digiwangsa.png"
              alt="Digiwangsa wayang illustration"
              width={800}
              height={560}
              className="relative w-full drop-shadow-[0_20px_50px_rgba(212,175,55,0.18)]"
            />
          </Reveal>
        </div>
      </section>

      <section className="border-y border-gold-line/20 bg-base-2 py-16 lg:py-20">
        <div className="mx-auto max-w-6xl px-5 lg:px-8">
          <Reveal>
            <h2 className="font-display text-3xl font-semibold text-cream">
              {t("valuesTitle")}
            </h2>
          </Reveal>
          <div className="mt-10 grid gap-6 sm:grid-cols-2">
            {values.map((v, i) => (
              <Reveal
                key={v.name}
                delay={i * 0.08}
                className="card-glass rounded-2xl p-7"
              >
                <h3 className="font-display text-xl font-semibold text-gold">
                  {v.name}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-muted">{v.desc}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <CTASection />
    </>
  );
}
