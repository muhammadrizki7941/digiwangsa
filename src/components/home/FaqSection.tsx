import { getTranslations } from "next-intl/server";
import { prisma } from "@/lib/prisma";
import Reveal from "@/components/motion/Reveal";
import FaqAccordion from "./FaqAccordion";

export default async function FaqSection() {
  const faqs = await prisma.fAQ.findMany({ orderBy: { order: "asc" } });
  if (faqs.length === 0) return null;

  const t = await getTranslations("faqSection");

  return (
    <section className="py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <Reveal className="mx-auto mb-12 max-w-2xl text-center">
          <p className="mb-3 text-xs font-medium uppercase tracking-[0.25em] text-gold">
            {t("eyebrow")}
          </p>
          <h2 className="font-display text-3xl font-semibold leading-tight text-cream sm:text-4xl">
            {t("title")}
          </h2>
        </Reveal>
        <FaqAccordion
          items={faqs.map((f) => ({ id: f.id, question: f.question, answer: f.answer }))}
        />
      </div>
    </section>
  );
}
