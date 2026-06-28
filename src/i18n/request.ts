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

export default getRequestConfig(async () => {
  const locale = await resolveLocale();

  // Javanese only covers nav + hero in this phase; fall back to Indonesian for the rest.
  const base = (await import(`../../messages/id.json`)).default;
  const messages =
    locale === "id"
      ? base
      : { ...base, ...(await import(`../../messages/${locale}.json`)).default };

  return { locale, messages };
});
