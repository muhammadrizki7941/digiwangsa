"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Search, Loader2, CheckCircle2, XCircle, HelpCircle, MessageCircle, Globe } from "lucide-react";
import { cn } from "@/lib/utils";

type Result = {
  domain: string;
  tld: string;
  available: boolean | null;
  price: number;
  currency: string;
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

  const waUrl =
    result &&
    `https://wa.me/${whatsapp}?text=${encodeURIComponent(
      `Halo Digiwangsa! Saya mau pesan domain ${result.domain} (${idr(result.price)}/tahun).`
    )}`;

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

          {result.available !== false && waUrl && (
            <a
              href={waUrl}
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
    </div>
  );
}
