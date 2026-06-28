import { useTranslations } from "next-intl";
import {
  AlertTriangle,
  TrendingDown,
  Activity,
  Gavel,
  Lock,
  ArrowDown,
  type LucideIcon,
} from "lucide-react";
import Reveal from "@/components/motion/Reveal";

const icons: LucideIcon[] = [TrendingDown, Activity, Gavel, Lock];

type PainItem = { title: string; desc: string };

export default function PainSection() {
  const t = useTranslations("pain");
  const items = t.raw("items") as PainItem[];

  return (
    <section className="relative py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <Reveal className="mx-auto max-w-3xl text-center">
          <span className="mb-4 inline-flex items-center gap-2 rounded-full border border-red-500/30 bg-red-500/10 px-4 py-1.5 text-xs font-medium uppercase tracking-[0.2em] text-red-300">
            <AlertTriangle size={14} />
            {t("eyebrow")}
          </span>
          <h2 className="font-display text-3xl font-semibold leading-tight text-cream sm:text-4xl">
            {t("title")}
          </h2>
          <p className="mt-4 text-base leading-relaxed text-muted">
            {t("subtitle")}
          </p>
        </Reveal>

        <div className="mt-12 grid gap-5 md:grid-cols-2">
          {items.map((item, i) => {
            const Icon = icons[i] ?? AlertTriangle;
            return (
              <Reveal
                key={item.title}
                delay={i * 0.08}
                className="card-glass group relative flex gap-5 overflow-hidden rounded-2xl p-6"
              >
                <span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl border border-red-500/30 bg-red-500/10 text-red-300">
                  <Icon size={22} />
                </span>
                <div>
                  <h3 className="font-display text-lg font-semibold text-cream">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted">
                    {item.desc}
                  </p>
                </div>
                <span className="pointer-events-none absolute -right-4 -top-5 font-display text-6xl font-bold text-red-500/5">
                  {i + 1}
                </span>
              </Reveal>
            );
          })}
        </div>

        <Reveal delay={0.1} className="mt-12 flex flex-col items-center gap-2 text-center">
          <ArrowDown size={20} className="animate-bounce text-gold" />
          <p className="font-display text-xl font-semibold text-gold-gradient sm:text-2xl">
            {t("bridge")}
          </p>
        </Reveal>
      </div>
    </section>
  );
}
