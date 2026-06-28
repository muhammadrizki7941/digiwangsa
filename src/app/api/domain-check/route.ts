import { NextResponse } from "next/server";
import { parseDomain, priceForTld } from "@/lib/domain-pricing";

/** Availability via RDAP (free, no key). 404 = available, 200 = taken, else unknown. */
async function checkAvailability(domain: string): Promise<boolean | null> {
  try {
    const res = await fetch(`https://rdap.org/domain/${domain}`, {
      headers: { accept: "application/json" },
      signal: AbortSignal.timeout(8000),
      cache: "no-store",
    });
    if (res.status === 404) return true; // not found → available
    if (res.status === 200) return false; // exists → taken
    return null; // unknown / unsupported tld
  } catch {
    return null;
  }
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

  const available = await checkAvailability(parsed.domain);
  const price = priceForTld(parsed.tld); // margin already applied & hidden

  return NextResponse.json({
    domain: parsed.domain,
    tld: parsed.tld,
    available, // true | false | null
    price, // final customer price (IDR/year)
    currency: "IDR",
  });
}
