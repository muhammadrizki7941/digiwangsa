export const locales = ["id", "en", "jv"] as const;
export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = "id";

export const localeLabels: Record<Locale, { name: string; code: string; flag: string }> = {
  id: { name: "Indonesia", code: "ID", flag: "🇮🇩" },
  en: { name: "English", code: "EN", flag: "🇺🇸" },
  jv: { name: "Javanese", code: "JV", flag: "🪷" },
};

export const LOCALE_COOKIE = "NEXT_LOCALE";
