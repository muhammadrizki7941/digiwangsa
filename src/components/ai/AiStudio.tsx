"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Sparkles, Loader2, Download, ExternalLink, RefreshCw } from "lucide-react";
import ConsultButton from "@/components/lead/ConsultButton";
import { cn } from "@/lib/utils";

const THEMES = [
  "Modern Minimal",
  "Bold & Vibrant",
  "Elegant Luxury",
  "Playful & Creative",
  "Corporate Professional",
  "Dark Tech",
];

const field =
  "w-full rounded-lg border border-gold-line/50 bg-base px-3.5 py-3 text-sm text-cream outline-none transition focus:border-gold/70 placeholder:text-muted/50";
const label = "mb-1.5 block text-xs uppercase tracking-wide text-muted";

export default function AiStudio() {
  const t = useTranslations("aiStudio");
  const [business, setBusiness] = useState("");
  const [description, setDescription] = useState("");
  const [theme, setTheme] = useState(THEMES[0]);
  const [loading, setLoading] = useState(false);
  const [html, setHtml] = useState("");
  const [error, setError] = useState("");
  const [remaining, setRemaining] = useState<number | null>(null);

  async function generate() {
    if (!business.trim() || !description.trim() || loading) return;
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/generate-landing", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ business, description, theme }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.limit ? t("limitReached") : data.error || t("error"));
        if (typeof data.remaining === "number") setRemaining(data.remaining);
        return;
      }
      setHtml(data.html);
      if (typeof data.remaining === "number") setRemaining(data.remaining);
    } catch {
      setError(t("error"));
    } finally {
      setLoading(false);
    }
  }

  function download() {
    const blob = new Blob([html], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${business.toLowerCase().replace(/\s+/g, "-") || "landing"}.html`;
    a.click();
    URL.revokeObjectURL(url);
  }

  function openNew() {
    const blob = new Blob([html], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    window.open(url, "_blank");
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[380px_1fr]">
      {/* form */}
      <div className="lg:sticky lg:top-28 lg:self-start">
        <div className="card-glass rounded-2xl p-6">
          <div className="space-y-5">
            <div>
              <label className={label}>{t("business")}</label>
              <input className={field} value={business} onChange={(e) => setBusiness(e.target.value)} placeholder={t("businessPh")} />
            </div>
            <div>
              <label className={label}>{t("description")}</label>
              <textarea className={field} rows={5} value={description} onChange={(e) => setDescription(e.target.value)} placeholder={t("descriptionPh")} />
            </div>
            <div>
              <label className={label}>{t("theme")}</label>
              <div className="flex flex-wrap gap-2">
                {THEMES.map((th) => (
                  <button
                    key={th}
                    type="button"
                    onClick={() => setTheme(th)}
                    className={cn(
                      "rounded-full border px-3 py-1.5 text-xs transition",
                      theme === th
                        ? "border-gold bg-gold/15 text-gold"
                        : "border-gold-line/50 text-muted hover:border-gold/60 hover:text-cream"
                    )}
                  >
                    {th}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={generate}
              disabled={loading || !business.trim() || !description.trim()}
              className="btn-gold flex w-full items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-semibold disabled:opacity-50"
            >
              {loading ? <Loader2 size={17} className="animate-spin" /> : <Sparkles size={17} />}
              {loading ? t("generating") : html ? t("regenerate") : t("generate")}
            </button>

            {error && <p className="text-sm text-red-300">{error}</p>}
            {remaining !== null && !error && (
              <p className="text-center text-xs text-muted">
                {t("remaining", { n: remaining })}
              </p>
            )}
          </div>
        </div>

        <p className="mt-4 text-xs leading-relaxed text-muted">{t("note")}</p>
        <ConsultButton className="btn-gold mt-3 flex w-full items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-semibold">
          {t("cta")}
        </ConsultButton>
      </div>

      {/* preview */}
      <div>
        <div className="overflow-hidden rounded-2xl border border-gold-line/40 bg-base-2 shadow-[0_30px_80px_-30px_rgba(212,175,55,0.35)]">
          <div className="flex items-center gap-2 border-b border-gold-line/30 bg-elevated px-4 py-3">
            <span className="h-3 w-3 rounded-full bg-red-400/70" />
            <span className="h-3 w-3 rounded-full bg-yellow-400/70" />
            <span className="h-3 w-3 rounded-full bg-green-400/70" />
            {html && (
              <div className="ml-auto flex items-center gap-1">
                <button onClick={openNew} className="rounded-lg p-1.5 text-muted transition hover:text-gold" title={t("openNew")}>
                  <ExternalLink size={15} />
                </button>
                <button onClick={download} className="rounded-lg p-1.5 text-muted transition hover:text-gold" title={t("download")}>
                  <Download size={15} />
                </button>
              </div>
            )}
          </div>

          <div className="relative h-[70vh] w-full bg-white">
            {html ? (
              <iframe
                title="AI landing preview"
                srcDoc={html}
                sandbox="allow-scripts allow-popups"
                className="h-full w-full"
              />
            ) : (
              <div className="grid h-full place-items-center bg-base">
                {loading ? (
                  <div className="flex flex-col items-center gap-3 text-muted">
                    <Loader2 size={28} className="animate-spin text-gold" />
                    <p className="text-sm">{t("generating")}</p>
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-3 px-8 text-center text-muted">
                    <RefreshCw size={26} className="text-gold/50" />
                    <p className="text-sm">{t("previewHint")}</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
