import { NextResponse } from "next/server";
import { parseDomain, priceForTld, suggestionDomains } from "@/lib/domain-pricing";

/** Availability via RDAP (free, no key). 404 = available, 200 = taken, else unknown. */
async function checkAvailability(domain: string): Promise<boolean | null> {
  try {
    const res = await fetch(`https://rdap.org/domain/${domain}`, {
      headers: { accept: "application/json" },
      signal: AbortSignal.timeout(7000),
      cache: "no-store",
    });
    if (res.status === 404) return true;
    if (res.status === 200) return false;
    return null;
  } catch {
    return null;
  }
}

function tldOf(domain: string): string {
  const p = parseDomain(domain);
  return p ? p.tld : domain.split(".").slice(1).join(".");
}

export async function GET(req: Request) {
  const q = new URL(req.url).searchParams.get("domain") || "";
  const parsed = parseDomain(q);

  if (!parsed) {
    return NextResponse.json(
      { error: "Masukkan domain yang valid, misalnya: namabisnis.com" },
      { status: 400 }
    );
  }

  // Main domain + suggestions checked in parallel.
  const suggestionList = suggestionDomains(parsed.sld, parsed.tld, 6);
  const [mainAvail, ...suggAvail] = await Promise.all([
    checkAvailability(parsed.domain),
    ...suggestionList.map((d) => checkAvailability(d)),
  ]);

  const suggestions = suggestionList
    .map((domain, i) => ({
      domain,
      available: suggAvail[i],
      price: priceForTld(tldOf(domain)),
    }))
    // surface the ones that are available (or unknown) first, keep it useful
    .filter((s) => s.available !== false)
    .slice(0, 5);

  return NextResponse.json({
    domain: parsed.domain,
    tld: parsed.tld,
    available: mainAvail,
    price: priceForTld(parsed.tld),
    currency: "IDR",
    suggestions,
  });
}
