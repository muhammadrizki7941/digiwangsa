// INTERNAL — margin & base cost. Never expose base price or markup to the client.
const MARKUP = 0.10; // 10% profit margin (hidden)

// Approximate registrar/Cloudflare cost per TLD in IDR (your cost, before markup).
const BASE_PRICE_IDR: Record<string, number> = {
  com: 165000,
  net: 230000,
  org: 230000,
  xyz: 60000,
  online: 70000,
  site: 70000,
  store: 95000,
  shop: 95000,
  tech: 110000,
  space: 45000,
  fun: 45000,
  info: 230000,
  biz: 230000,
  dev: 230000,
  app: 290000,
  io: 650000,
  co: 420000,
  ai: 1500000,
  id: 250000,
  "co.id": 290000,
  "web.id": 55000,
  "my.id": 50000,
  "biz.id": 55000,
  "or.id": 55000,
  "sch.id": 55000,
  "ac.id": 55000,
};

const DEFAULT_BASE_IDR = 300000;

/** Final customer price (margin already applied & hidden), rounded to nearest 1.000. */
export function priceForTld(tld: string): number {
  const base = BASE_PRICE_IDR[tld] ?? DEFAULT_BASE_IDR;
  const withMargin = base * (1 + MARKUP);
  return Math.round(withMargin / 1000) * 1000;
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
