"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Search, Loader2, CheckCircle2, XCircle, HelpCircle, MessageCircle, Globe } from "lucide-react";
import { cn } from "@/lib/utils";

type Suggestion = { domain: string; available: boolean | null; price: number };
type Result = {
  domain: string;
  tld: string;
  available: boolean | null;
  price: number;
  currency: string;
  suggestions?: Suggestion[];
};

const idr = (n: number) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(n);

export default function DomainChecker({ whatsapp }: { whatsapp: string }) {
  const t = useTranslations("domain");
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<Result | null>(null);
  const [error, setError] = useState("");

  async function check() {
    const q = query.trim();
    if (!q || loading) return;
    setLoading(true);
    setError("");
    setResult(null);
    try {
      const res = await fetch(`/api/domain-check?domain=${encodeURIComponent(q)}`);
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || t("errorInvalid"));
        return;
      }
      setResult(data);
    } catch {
      setError(t("errorInvalid"));
    } finally {
      setLoading(false);
    }
  }

  function orderUrl(domain: string, price: number) {
    return `https://wa.me/${whatsapp}?text=${encodeURIComponent(
      `Halo Digiwangsa! Saya mau pesan domain ${domain} (${idr(price)}/tahun).`
    )}`;
  }

  return (
    <div className="mx-auto max-w-2xl">
      {/* search bar */}
      <div className="card-glass flex items-center gap-2 rounded-full p-2">
        <Globe size={18} className="ml-3 shrink-0 text-gold" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && check()}
          placeholder={t("placeholder")}
          className="flex-1 bg-transparent px-1 py-2 text-sm text-cream outline-none placeholder:text-muted/50"
        />
        <button
          onClick={check}
          disabled={loading}
          className="btn-gold flex items-center gap-2 rounded-full px-6 py-2.5 text-sm font-semibold disabled:opacity-60"
        >
          {loading ? <Loader2 size={16} className="animate-spin" /> : <Search size={16} />}
          {loading ? t("checking") : t("check")}
        </button>
      </div>

      {error && <p className="mt-3 text-center text-sm text-red-300">{error}</p>}

      {result && (
        <div className="card-glass mt-6 rounded-2xl p-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              {result.available === true && <CheckCircle2 className="text-emerald-400" size={26} />}
              {result.available === false && <XCircle className="text-red-400" size={26} />}
              {result.available === null && <HelpCircle className="text-muted" size={26} />}
              <div>
                <p className="font-display text-xl font-semibold text-cream">{result.domain}</p>
                <p
                  className={cn(
                    "text-sm",
                    result.available === true && "text-emerald-400",
                    result.available === false && "text-red-400",
                    result.available === null && "text-muted"
                  )}
                >
                  {result.available === true && t("available")}
                  {result.available === false && t("taken")}
                  {result.available === null && t("unknown")}
                </p>
              </div>
            </div>

            <div className="text-right">
              <p className="text-[11px] uppercase tracking-wide text-muted">{t("priceLabel")}</p>
              <p className="text-gold-gradient font-display text-2xl font-bold">
                {idr(result.price)}
                <span className="ml-1 text-xs font-normal text-muted">{t("perYear")}</span>
              </p>
            </div>
          </div>

          {result.available !== false && (
            <a
              href={orderUrl(result.domain, result.price)}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-gold mt-5 flex w-full items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-semibold"
            >
              <MessageCircle size={17} />
              {t("order")}
            </a>
          )}

          <p className="mt-4 text-center text-xs leading-relaxed text-muted">{t("note")}</p>
        </div>
      )}

      {result?.suggestions && result.suggestions.length > 0 && (
        <div className="mt-6">
          <p className="mb-1 text-sm font-semibold text-cream">{t("suggested")}</p>
          <p className="mb-3 text-xs text-muted">{t("suggestedNote")}</p>
          <div className="space-y-2">
            {result.suggestions.map((s) => (
              <div
                key={s.domain}
                className="card-glass flex items-center justify-between gap-3 rounded-xl px-4 py-3"
              >
                <div className="flex items-center gap-2.5">
                  {s.available === true ? (
                    <CheckCircle2 size={18} className="text-emerald-400" />
                  ) : (
                    <HelpCircle size={18} className="text-muted" />
                  )}
                  <span className="text-sm text-cream">{s.domain}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-gold-gradient font-display text-sm font-bold">
                    {idr(s.price)}
                  </span>
                  <a
                    href={orderUrl(s.domain, s.price)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded-full border border-gold-line/60 px-3 py-1.5 text-xs text-gold transition hover:border-gold/70"
                  >
                    {t("order")}
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
