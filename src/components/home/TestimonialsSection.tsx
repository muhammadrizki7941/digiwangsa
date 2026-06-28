import { getTranslations } from "next-intl/server";
import { Quote } from "lucide-react";
import { prisma } from "@/lib/prisma";
import Reveal from "@/components/motion/Reveal";

export default async function TestimonialsSection() {
  const items = await prisma.testimonial.findMany({ orderBy: { order: "asc" } });
  if (items.length === 0) return null;

  const t = await getTranslations("testimonials");

  return (
    <section className="border-y border-gold-line/20 bg-base-2 py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <Reveal className="mx-auto mb-12 max-w-2xl text-center">
          <p className="mb-3 text-xs font-medium uppercase tracking-[0.25em] text-gold">
            {t("eyebrow")}
          </p>
          <h2 className="font-display text-3xl font-semibold leading-tight text-cream sm:text-4xl">
            {t("title")}
          </h2>
        </Reveal>

        <div className="grid gap-6 md:grid-cols-3">
          {items.map((item, i) => (
            <Reveal
              key={item.id}
              delay={i * 0.1}
              className="card-glass flex h-full flex-col rounded-2xl p-7"
            >
              <Quote size={26} className="text-gold/70" />
              <p className="mt-4 flex-1 text-sm leading-relaxed text-cream/85">
                “{item.quote}”
              </p>
              <div className="mt-6 flex items-center gap-3">
                {item.avatar ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={item.avatar}
                    alt={item.name}
                    className="h-11 w-11 rounded-full object-cover"
                  />
                ) : (
                  <span className="grid h-11 w-11 place-items-center rounded-full bg-gradient-to-br from-gold to-gold-line font-display font-semibold text-[#1a1407]">
                    {item.name.charAt(0)}
                  </span>
                )}
                <div>
                  <p className="text-sm font-medium text-cream">{item.name}</p>
                  <p className="text-xs text-muted">
                    {item.role}
                    {item.company ? `, ${item.company}` : ""}
                  </p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
