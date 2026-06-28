import { getRequestConfig } from "next-intl/server";
import { cookies, headers } from "next/headers";
import { defaultLocale, LOCALE_COOKIE, locales, type Locale } from "./config";

/** Detect locale from cookie → Accept-Language → default. */
async function resolveLocale(): Promise<Locale> {
  const cookieStore = await cookies();
  const cookieLocale = cookieStore.get(LOCALE_COOKIE)?.value as Locale | undefined;
  if (cookieLocale && locales.includes(cookieLocale)) return cookieLocale;

  // Auto-detect from browser language. Indonesian visitors → id, otherwise → en.
  const headerStore = await headers();
  const accept = (headerStore.get("accept-language") || "").toLowerCase();
  if (accept.startsWith("id")) return "id";
  if (accept) return "en";

  return defaultLocale;
}

type Dict = { [key: string]: unknown };

/** Deep-merge so a partial locale (e.g. Javanese) inherits any missing keys from Indonesian. */
function deepMerge(base: Dict, override: Dict): Dict {
  const out: Dict = { ...base };
  for (const key of Object.keys(override)) {
    const b = base[key];
    const o = override[key];
    if (
      b && o &&
      typeof b === "object" && typeof o === "object" &&
      !Array.isArray(b) && !Array.isArray(o)
    ) {
      out[key] = deepMerge(b as Dict, o as Dict);
    } else {
      out[key] = o;
    }
  }
  return out;
}

export default getRequestConfig(async () => {
  const locale = await resolveLocale();

  // Indonesian is the base; other locales deep-merge over it (missing keys fall back to ID).
  const base = (await import(`../../messages/id.json`)).default as Dict;
  const messages =
    locale === "id"
      ? base
      : deepMerge(base, (await import(`../../messages/${locale}.json`)).default as Dict);

  return { locale, messages };
});
