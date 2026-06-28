"use client";

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { ArrowRight, PlayCircle } from "lucide-react";
import {
  motion,
  useScroll,
  useTransform,
  useReducedMotion,
  type Variants,
} from "framer-motion";
import GoldParticles from "@/components/motion/GoldParticles";

const container: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12, delayChildren: 0.1 } },
};
const item: Variants = {
  hidden: { opacity: 0, y: 22 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

export default function HeroSection() {
  const t = useTranslations("hero");
  const reduce = useReducedMotion();
  const ref = useRef<HTMLElement>(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  // Parallax depth: background drifts down, wayang lifts up as you scroll.
  const bgY = useTransform(scrollYProgress, [0, 1], [0, 130]);
  const wayangY = useTransform(scrollYProgress, [0, 1], [0, -70]);
  const fade = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  return (
    <section ref={ref} className="relative isolate overflow-hidden pt-28 lg:pt-32">
      {/* Javanese ornamental background (parallax layer) */}
      <motion.div
        className="absolute inset-0 -z-10"
        style={reduce ? undefined : { y: bgY }}
      >
        <Image
          src="/asset/background-digiwangsa.png"
          alt=""
          fill
          priority
          className="scale-110 object-cover object-right-top opacity-0 dark:opacity-90"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-base via-base/85 to-base/40" />
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-base to-transparent" />
      </motion.div>

      <GoldParticles count={24} />

      <div className="mx-auto grid max-w-7xl items-center gap-10 px-5 pb-20 lg:grid-cols-[1.05fr_0.95fr] lg:px-8 lg:pb-28">
        {/* Copy */}
        <motion.div variants={container} initial="hidden" animate="show">
          <motion.p
            variants={item}
            className="mb-5 text-xs font-medium uppercase tracking-[0.25em] text-gold"
          >
            {t("eyebrow")}
          </motion.p>
          <motion.h1
            variants={item}
            className="font-display text-4xl font-semibold leading-[1.08] text-cream sm:text-5xl lg:text-6xl"
          >
            {t("titleLine1")}
            <br />
            {t("titleLine2")}{" "}
            <span className="text-gold-gradient">{t("titleHighlight")}</span>
          </motion.h1>
          <motion.p
            variants={item}
            className="mt-6 max-w-xl text-base leading-relaxed text-muted"
          >
            {t("subtitle")}
          </motion.p>

          <motion.div
            variants={item}
            className="mt-9 flex flex-wrap items-center gap-4"
          >
            <Link
              href="/pricing"
              className="btn-gold flex items-center gap-2 rounded-full px-7 py-3.5 text-sm font-semibold transition"
            >
              {t("ctaPrimary")}
              <ArrowRight size={17} />
            </Link>
            <Link
              href="/portfolio"
              className="flex items-center gap-2 rounded-full border border-gold-line/60 px-7 py-3.5 text-sm font-medium text-cream transition hover:border-gold/70"
            >
              <PlayCircle size={18} className="text-gold" />
              {t("ctaSecondary")}
            </Link>
          </motion.div>

          <motion.div variants={item} className="mt-4">
            <Link
              href="/ai-studio"
              className="text-gold-gradient inline-flex items-center gap-1.5 text-sm font-medium transition hover:opacity-80"
            >
              {t("aiCta")}
            </Link>
          </motion.div>

          <motion.div variants={item} className="mt-10 flex items-center gap-4">
            <div className="flex -space-x-3">
              {[0, 1, 2, 3].map((i) => (
                <span
                  key={i}
                  className="h-10 w-10 rounded-full border-2 border-base bg-gradient-to-br from-gold-line to-elevated"
                />
              ))}
            </div>
            <div>
              <p className="font-display text-xl font-semibold text-gold">500+</p>
              <p className="text-xs text-muted">{t("social")}</p>
            </div>
          </motion.div>
        </motion.div>

        {/* Wayang illustration — parallax (outer) + sway loop (inner) */}
        <motion.div
          className="relative"
          style={reduce ? undefined : { y: wayangY, opacity: fade }}
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, ease: "easeOut" }}
        >
          <div className="glow-gold absolute inset-0 scale-125" />
          <motion.div
            animate={reduce ? undefined : { y: [0, -14, 0], rotate: [0, 0.6, 0] }}
            transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
          >
            <Image
              src="/asset/digiwangsa.png"
              alt="Digiwangsa — wayang digital illustration"
              width={900}
              height={620}
              priority
              className="relative w-full drop-shadow-[0_25px_60px_rgba(212,175,55,0.18)]"
            />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
