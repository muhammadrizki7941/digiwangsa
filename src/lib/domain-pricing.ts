// INTERNAL — margin, kurs & cost. Never expose these (or the markup) to the client.
const MARKUP = 0.10; // 10% profit margin (hidden)

// USD → IDR exchange rate used for TLDs you buy in USD (e.g. Cloudflare).
// Set slightly above the real rate as a safety buffer against fluctuation.
const KURS_IDR = 18000;

// Your annual COST in USD for TLDs bought at registrars like Cloudflare (at-cost).
// Keep these >= the real registrar price so you never sell below cost.
const USD_COST: Record<string, number> = {
  com: 10.46,
  net: 12.18,
  org: 11.0,
  info: 12.98,
  biz: 12.98,
  dev: 12.18,
  app: 14.18,
  io: 46.0,
  co: 28.0,
  ai: 75.0,
  me: 20.0,
  xyz: 11.5,
  site: 35.0,
  online: 38.0,
  store: 60.0,
  shop: 35.0,
  tech: 50.0,
  space: 25.0,
  fun: 25.0,
};

// TLDs bought locally (not on Cloudflare) — cost already in IDR.
const IDR_COST: Record<string, number> = {
  id: 230000,
  "co.id": 280000,
  "my.id": 55000,
  "web.id": 55000,
  "biz.id": 55000,
  "or.id": 55000,
  "sch.id": 55000,
  "ac.id": 55000,
};

const DEFAULT_USD_COST = 15.0;

function roundUp(n: number): number {
  return Math.ceil(n / 1000) * 1000;
}

/** Final customer price in IDR (cost + hidden 10% margin), rounded up to nearest 1.000. */
export function priceForTld(tld: string): number {
  if (tld in IDR_COST) return roundUp(IDR_COST[tld] * (1 + MARKUP));
  const usd = USD_COST[tld] ?? DEFAULT_USD_COST;
  return roundUp(usd * KURS_IDR * (1 + MARKUP));
}

const MULTI_SUFFIX = [
  "co.id", "web.id", "my.id", "biz.id", "or.id", "sch.id", "ac.id", "net.id", "go.id",
  "co.uk", "com.au",
];

/** Normalize input and split into sld/tld (handles 2-level suffixes like co.id). */
export function parseDomain(input: string): { domain: string; sld: string; tld: string } | null {
  const clean = input
    .trim()
    .toLowerCase()
    .replace(/^https?:\/\//, "")
    .replace(/^www\./, "")
    .replace(/\/.*$/, "")
    .replace(/\s/g, "");

  if (!clean.includes(".")) return null;
  if (!/^[a-z0-9.-]+$/.test(clean)) return null;

  for (const suf of MULTI_SUFFIX) {
    if (clean.endsWith("." + suf)) {
      const sld = clean.slice(0, clean.length - suf.length - 1);
      if (!sld || sld.includes(".")) return null;
      return { domain: clean, sld, tld: suf };
    }
  }

  const parts = clean.split(".");
  if (parts.length !== 2) return null; // keep it simple: name.tld
  const [sld, tld] = parts;
  if (!sld || !tld) return null;
  return { domain: clean, sld, tld };
}

/** Alternative TLDs to suggest for a given SLD (excludes the one already searched). */
export function suggestionDomains(sld: string, currentTld: string, max = 6): string[] {
  const order = ["com", "id", "co", "net", "online", "store", "shop", "site", "xyz", "my.id", "biz.id"];
  return order
    .filter((t) => t !== currentTld)
    .slice(0, max)
    .map((t) => `${sld}.${t}`);
}
