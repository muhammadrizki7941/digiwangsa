"use client";

import { useState, useRef, useEffect } from "react";
import { useLocale, useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { Globe, ChevronDown, Check } from "lucide-react";
import { locales, localeLabels, LOCALE_COOKIE, type Locale } from "@/i18n/config";
import { cn } from "@/lib/utils";

export default function LanguageSwitcher() {
  const t = useTranslations("nav");
  const locale = useLocale() as Locale;
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  function choose(next: Locale) {
    document.cookie = `${LOCALE_COOKIE}=${next}; path=/; max-age=31536000; samesite=lax`;
    setOpen(false);
    router.refresh();
  }

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-2 rounded-full border border-gold-line/60 bg-elevated/70 px-4 py-2 text-sm text-cream transition hover:border-gold/70"
      >
        <Globe size={15} className="text-gold" />
        <span>{t("autoDetect")}</span>
        <ChevronDown
          size={14}
          className={cn("text-muted transition", open && "rotate-180")}
        />
      </button>

      {open && (
        <div className="absolute right-0 z-50 mt-2 w-60 overflow-hidden rounded-xl border border-gold-line/50 bg-base-2/95 p-1.5 shadow-2xl backdrop-blur">
          <p className="px-3 pb-1.5 pt-2 text-[10px] uppercase tracking-[0.2em] text-muted">
            {t("language")}
          </p>
          {locales.map((code) => {
            const meta = localeLabels[code];
            const active = code === locale;
            return (
              <button
                key={code}
                onClick={() => choose(code)}
                className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm text-cream transition hover:bg-elevated"
              >
                <span className="text-base">{meta.flag}</span>
                <span className="flex-1">{meta.name}</span>
                <span className="text-xs text-muted">{meta.code}</span>
                {active && <Check size={15} className="text-gold" />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
