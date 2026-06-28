"use client";

import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";

type Particle = {
  left: number;
  top: number;
  size: number;
  delay: number;
  duration: number;
};

/** Floating gold dust — mounted client-side only to avoid hydration mismatch. */
export default function GoldParticles({ count = 22 }: { count?: number }) {
  const reduce = useReducedMotion();
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    if (reduce) return;
    setParticles(
      Array.from({ length: count }, () => ({
        left: Math.random() * 100,
        top: Math.random() * 100,
        size: Math.random() * 3 + 1,
        delay: Math.random() * 5,
        duration: Math.random() * 4 + 5,
      }))
    );
  }, [count, reduce]);

  if (reduce) return null;

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {particles.map((p, i) => (
        <motion.span
          key={i}
          className="absolute rounded-full bg-gold-soft shadow-[0_0_6px_rgba(232,217,160,0.8)]"
          style={{ left: `${p.left}%`, top: `${p.top}%`, width: p.size, height: p.size }}
          animate={{ y: [0, -34, 0], opacity: [0, 0.85, 0] }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}
