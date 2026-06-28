"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { AnimatePresence, motion } from "framer-motion";
import { X, ArrowRight, ArrowLeft, Loader2, Check, MessageCircle } from "lucide-react";
import { OPEN_CONSULT_EVENT } from "./ConsultButton";

type Form = {
  name: string;
  whatsapp: string;
  email: string;
  business: string;
  social: string;
  description: string;
};

const empty: Form = {
  name: "",
  whatsapp: "",
  email: "",
  business: "",
  social: "",
  description: "",
};

const field =
  "w-full rounded-lg border border-gold-line/50 bg-base px-3.5 py-3 text-sm text-cream outline-none transition focus:border-gold/70 placeholder:text-muted/50";
const label = "mb-1.5 block text-xs uppercase tracking-wide text-muted";

export default function ConsultationModal({ whatsapp }: { whatsapp?: string }) {
  const WHATSAPP = whatsapp || process.env.NEXT_PUBLIC_WHATSAPP || "6280000000000";
  const t = useTranslations("consult");
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState(0);
  const [form, setForm] = useState<Form>(empty);
  const [sending, setSending] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const handler = () => {
      setForm(empty);
      setStep(0);
      setDone(false);
      setError("");
      setOpen(true);
    };
    window.addEventListener(OPEN_CONSULT_EVENT, handler);
    return () => window.removeEventListener(OPEN_CONSULT_EVENT, handler);
  }, []);

  function set<K extends keyof Form>(k: K, v: string) {
    setForm((f) => ({ ...f, [k]: v }));
    setError("");
  }

  const TOTAL = 3;
  const canNext =
    step === 0
      ? form.name.trim() && form.whatsapp.trim()
      : step === 1
        ? form.email.trim()
        : form.description.trim();

  function next() {
    if (!canNext) {
      setError(t("error"));
      return;
    }
    setStep((s) => Math.min(s + 1, TOTAL - 1));
  }

  function waUrl() {
    const lines = [
      `Halo Digiwangsa! Saya ${form.name}.`,
      form.business && `Bisnis: ${form.business}`,
      form.social && `Sosial: ${form.social}`,
      `Email: ${form.email}`,
      "",
      form.description,
    ].filter(Boolean);
    return `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(lines.join("\n"))}`;
  }

  async function submit() {
    if (!canNext) {
      setError(t("error"));
      return;
    }
    setSending(true);
    setError("");
    try {
      await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      setDone(true);
      const url = waUrl();
      setTimeout(() => window.open(url, "_blank"), 1200);
    } catch {
      setError(t("error"));
    } finally {
      setSending(false);
    }
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[80] flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            onClick={() => setOpen(false)}
          />

          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.97 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="card-glass relative z-10 w-full max-w-lg overflow-hidden rounded-2xl"
          >
            <div className="glow-gold pointer-events-none absolute inset-x-0 top-0 h-32" />

            <button
              onClick={() => setOpen(false)}
              className="absolute right-4 top-4 z-10 rounded-lg p-1.5 text-muted transition hover:text-cream"
              aria-label="Close"
            >
              <X size={20} />
            </button>

            <div className="relative p-7 sm:p-9">
              {done ? (
                <div className="flex flex-col items-center py-8 text-center">
                  <span className="mb-5 grid h-16 w-16 place-items-center rounded-full bg-gold/15 text-gold">
                    <Check size={32} />
                  </span>
                  <h3 className="font-display text-2xl font-semibold text-cream">
                    {t("successTitle")}
                  </h3>
                  <p className="mt-2 max-w-sm text-sm text-muted">
                    {t("successDesc")}
                  </p>
                  <a
                    href={waUrl()}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-gold mt-6 flex items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold"
                  >
                    <MessageCircle size={17} />
                    {t("toWhatsapp")}
                  </a>
                </div>
              ) : (
                <>
                  <p className="text-xs font-medium uppercase tracking-[0.2em] text-gold">
                    {t("step")} {step + 1} {t("of")} {TOTAL}
                  </p>
                  <h3 className="mt-2 font-display text-2xl font-semibold text-cream">
                    {t("title")}
                  </h3>
                  <p className="mt-1 text-sm text-muted">{t("subtitle")}</p>

                  {/* progress */}
                  <div className="mt-5 flex gap-2">
                    {Array.from({ length: TOTAL }).map((_, i) => (
                      <span
                        key={i}
                        className={`h-1.5 flex-1 rounded-full transition-colors ${
                          i <= step ? "bg-gold" : "bg-gold-line/30"
                        }`}
                      />
                    ))}
                  </div>

                  <div className="mt-6 min-h-[210px]">
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={step}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.2 }}
                        className="space-y-4"
                      >
                        {step === 0 && (
                          <>
                            <div>
                              <label className={label}>{t("name")}</label>
                              <input className={field} value={form.name} onChange={(e) => set("name", e.target.value)} placeholder={t("namePh")} autoFocus />
                            </div>
                            <div>
                              <label className={label}>{t("whatsapp")}</label>
                              <input className={field} value={form.whatsapp} onChange={(e) => set("whatsapp", e.target.value)} placeholder={t("whatsappPh")} inputMode="tel" />
                            </div>
                          </>
                        )}
                        {step === 1 && (
                          <>
                            <div>
                              <label className={label}>{t("email")}</label>
                              <input className={field} type="email" value={form.email} onChange={(e) => set("email", e.target.value)} placeholder={t("emailPh")} autoFocus />
                            </div>
                            <div>
                              <label className={label}>
                                {t("business")} <span className="text-muted/60 normal-case">({t("optional")})</span>
                              </label>
                              <input className={field} value={form.business} onChange={(e) => set("business", e.target.value)} />
                            </div>
                            <div>
                              <label className={label}>
                                {t("social")} <span className="text-muted/60 normal-case">({t("optional")})</span>
                              </label>
                              <input className={field} value={form.social} onChange={(e) => set("social", e.target.value)} placeholder={t("socialPh")} />
                            </div>
                          </>
                        )}
                        {step === 2 && (
                          <div>
                            <label className={label}>{t("description")}</label>
                            <textarea className={field} rows={6} value={form.description} onChange={(e) => set("description", e.target.value)} placeholder={t("descriptionPh")} autoFocus />
                          </div>
                        )}
                      </motion.div>
                    </AnimatePresence>
                  </div>

                  {error && <p className="mt-1 text-sm text-red-300">{error}</p>}

                  <div className="mt-6 flex items-center justify-between gap-3">
                    {step > 0 ? (
                      <button onClick={() => setStep((s) => s - 1)} className="flex items-center gap-2 rounded-full border border-gold-line/60 px-5 py-2.5 text-sm text-cream transition hover:border-gold/70">
                        <ArrowLeft size={16} /> {t("back")}
                      </button>
                    ) : (
                      <span />
                    )}

                    {step < TOTAL - 1 ? (
                      <button onClick={next} className="btn-gold flex items-center gap-2 rounded-full px-6 py-2.5 text-sm font-semibold">
                        {t("next")} <ArrowRight size={16} />
                      </button>
                    ) : (
                      <button onClick={submit} disabled={sending} className="btn-gold flex items-center gap-2 rounded-full px-6 py-2.5 text-sm font-semibold disabled:opacity-60">
                        {sending ? <Loader2 size={16} className="animate-spin" /> : <MessageCircle size={16} />}
                        {sending ? t("sending") : t("submit")}
                      </button>
                    )}
                  </div>
                </>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
