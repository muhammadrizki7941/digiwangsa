import { useTranslations } from "next-intl";
import Reveal from "@/components/motion/Reveal";

export default function StatsSection() {
  const t = useTranslations("stats");
  const stats = [
    { value: "150+", label: t("projects") },
    { value: "100+", label: t("clients") },
    { value: "98%", label: t("satisfaction") },
    { value: "5+", label: t("experience") },
    { value: "24/7", label: t("support") },
  ];

  return (
    <section className="py-16 lg:py-20">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <Reveal className="card-glass grid grid-cols-2 gap-y-8 rounded-2xl px-6 py-9 sm:grid-cols-3 lg:grid-cols-5">
          {stats.map((s) => (
            <div key={s.label} className="text-center">
              <p className="text-gold-gradient font-display text-3xl font-bold sm:text-4xl">
                {s.value}
              </p>
              <p className="mt-1.5 text-xs text-muted sm:text-sm">{s.label}</p>
            </div>
          ))}
        </Reveal>
      </div>
    </section>
  );
}
