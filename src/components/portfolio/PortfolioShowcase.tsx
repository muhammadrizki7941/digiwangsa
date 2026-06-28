"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight, ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

export type ShowcaseProject = {
  id: string;
  slug: string;
  title: string;
  category: string;
  client: string;
  year: string;
  summary: string;
  accent: string;
  tech: string[];
  demoUrl?: string | null;
  coverImage?: string | null;
  mobileImage?: string | null;
};

/** Mini website preview inside a device frame: real screenshot if available, else a styled mock. */
function SitePreview({
  p,
  compact = false,
  image,
}: {
  p: ShowcaseProject;
  compact?: boolean;
  image?: string | null;
}) {
  if (image) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={image}
        alt={p.title}
        className="h-full w-full object-cover object-top"
      />
    );
  }

  return (
    <div className={cn("relative h-full w-full bg-gradient-to-br", p.accent)}>
      <div className="glow-gold absolute inset-0 opacity-70" />
      {/* mock top nav */}
      <div
        className={cn(
          "relative flex items-center justify-between",
          compact ? "px-3 py-2" : "px-6 py-4"
        )}
      >
        <div className="flex items-center gap-1.5">
          <span
            className={cn(
              "rounded-full bg-gold",
              compact ? "h-2 w-2" : "h-3 w-3"
            )}
          />
          {!compact && (
            <span className="h-1.5 w-14 rounded-full bg-cream/30" />
          )}
        </div>
        {!compact && (
          <div className="flex items-center gap-2">
            <span className="h-1.5 w-6 rounded-full bg-cream/25" />
            <span className="h-1.5 w-6 rounded-full bg-cream/25" />
            <span className="h-4 w-14 rounded-full bg-gold/80" />
          </div>
        )}
      </div>

      {/* mock hero */}
      <div
        className={cn(
          "relative flex flex-col justify-center",
          compact ? "gap-1.5 px-3 pt-6" : "gap-3 px-8 pt-10 sm:pt-16"
        )}
      >
        <span
          className={cn(
            "w-fit rounded-full border border-gold/40 bg-base/40 uppercase tracking-[0.18em] text-gold",
            compact ? "px-2 py-0.5 text-[6px]" : "px-3 py-1 text-[10px]"
          )}
        >
          {p.category}
        </span>
        <h3
          className={cn(
            "font-display font-semibold leading-tight text-cream",
            compact ? "text-[11px]" : "text-2xl sm:text-4xl"
          )}
        >
          {p.title}
        </h3>
        {!compact && (
          <p className="max-w-md text-sm leading-relaxed text-cream/75 line-clamp-2">
            {p.summary}
          </p>
        )}
        <div
          className={cn(
            "flex items-center gap-2",
            compact ? "mt-1" : "mt-3"
          )}
        >
          <span
            className={cn(
              "btn-gold rounded-full font-semibold",
              compact ? "px-2 py-1 text-[6px]" : "px-4 py-2 text-xs"
            )}
          >
            {p.client}
          </span>
          {!compact && (
            <span className="rounded-full border border-gold-line/50 px-4 py-2 text-xs text-cream/70">
              {p.year}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

export default function PortfolioShowcase({
  projects,
  viewLabel,
}: {
  projects: ShowcaseProject[];
  viewLabel: string;
}) {
  const [active, setActive] = useState(0);
  const reduce = useReducedMotion();
  const railRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<(HTMLButtonElement | null)[]>([]);

  if (projects.length === 0) return null;
  const current = projects[active];

  function select(i: number) {
    setActive(i);
    itemRefs.current[i]?.scrollIntoView({
      behavior: "smooth",
      inline: "center",
      block: "nearest",
    });
  }

  function step(dir: 1 | -1) {
    const next = (active + dir + projects.length) % projects.length;
    select(next);
  }

  return (
    <div className="mx-auto max-w-6xl px-5 lg:px-8">
      {/* ===== Desktop frame ===== */}
      <div className="relative">
        <div className="glow-gold pointer-events-none absolute -inset-10" />
        <div className="relative overflow-hidden rounded-2xl border border-gold-line/40 bg-base-2 shadow-[0_30px_80px_-30px_rgba(212,175,55,0.35)]">
          {/* browser chrome */}
          <div className="flex items-center gap-2 border-b border-gold-line/30 bg-elevated px-4 py-3">
            <span className="h-3 w-3 rounded-full bg-red-400/70" />
            <span className="h-3 w-3 rounded-full bg-yellow-400/70" />
            <span className="h-3 w-3 rounded-full bg-green-400/70" />
            <div className="mx-auto flex w-1/2 items-center justify-center rounded-full bg-base/60 px-4 py-1 text-[11px] text-muted">
              {current.demoUrl && current.demoUrl !== "#"
                ? current.demoUrl.replace(/^https?:\/\//, "")
                : `digiwangsa.com/${current.slug}`}
            </div>
          </div>
          {/* screen */}
          <div className="relative aspect-[16/9] w-full">
            <AnimatePresence mode="wait">
              <motion.div
                key={current.id}
                initial={reduce ? false : { opacity: 0, scale: 1.03 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={reduce ? undefined : { opacity: 0, scale: 0.99 }}
                transition={{ duration: 0.45, ease: "easeOut" }}
                className="absolute inset-0"
              >
                <SitePreview p={current} image={current.coverImage} />
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* view project CTA */}
        <Link
          href={`/portfolio/${current.slug}`}
          className="btn-gold absolute -bottom-5 left-1/2 z-10 flex -translate-x-1/2 items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold shadow-lg"
        >
          {viewLabel}
          <ArrowUpRight size={16} />
        </Link>
      </div>

      {/* ===== Mobile slider ===== */}
      <div className="mt-16 flex items-center gap-3">
        <button
          onClick={() => step(-1)}
          aria-label="Previous"
          className="hidden shrink-0 rounded-full border border-gold-line/50 p-2.5 text-cream transition hover:border-gold/70 sm:block"
        >
          <ChevronLeft size={18} />
        </button>

        <div
          ref={railRef}
          className="flex flex-1 snap-x snap-mandatory gap-5 overflow-x-auto scroll-smooth pb-4 pt-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {projects.map((p, i) => {
            const isActive = i === active;
            return (
              <button
                key={p.id}
                ref={(el) => {
                  itemRefs.current[i] = el;
                }}
                onClick={() => select(i)}
                aria-label={p.title}
                aria-pressed={isActive}
                className={cn(
                  "group relative shrink-0 snap-center transition-all duration-300",
                  isActive ? "scale-105" : "scale-95 opacity-60 hover:opacity-90"
                )}
              >
                {/* phone frame */}
                <div
                  className={cn(
                    "relative h-64 w-[120px] overflow-hidden rounded-[1.6rem] border-2 bg-base p-1 transition",
                    isActive
                      ? "border-gold shadow-[0_0_30px_-6px_rgba(212,175,55,0.6)]"
                      : "border-gold-line/40"
                  )}
                >
                  {/* notch */}
                  <div className="absolute left-1/2 top-1 z-10 h-1.5 w-10 -translate-x-1/2 rounded-full bg-base-2" />
                  <div className="h-full w-full overflow-hidden rounded-[1.3rem]">
                    <SitePreview
                      p={p}
                      compact
                      image={p.mobileImage || p.coverImage}
                    />
                  </div>
                </div>
                <p
                  className={cn(
                    "mt-3 max-w-[120px] truncate text-center text-xs transition",
                    isActive ? "text-gold" : "text-muted"
                  )}
                >
                  {p.client}
                </p>
              </button>
            );
          })}
        </div>

        <button
          onClick={() => step(1)}
          aria-label="Next"
          className="hidden shrink-0 rounded-full border border-gold-line/50 p-2.5 text-cream transition hover:border-gold/70 sm:block"
        >
          <ChevronRight size={18} />
        </button>
      </div>
    </div>
  );
}
