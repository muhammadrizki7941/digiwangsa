"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { useLocale, useTranslations } from "next-intl";
import { AnimatePresence, motion } from "framer-motion";
import { MessageCircle, X, Send, Loader2 } from "lucide-react";

type Msg = { id?: string; role: "user" | "bot" | "admin"; text: string };

export default function ChatWidget({ whatsapp }: { whatsapp?: string }) {
  const WHATSAPP = whatsapp || process.env.NEXT_PUBLIC_WHATSAPP || "6280000000000";
  const t = useTranslations("chat");
  const locale = useLocale();
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Msg[]>([
    { role: "bot", text: t("greeting") },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [started, setStarted] = useState(false);

  const sessionId = useRef(
    typeof crypto !== "undefined" ? crypto.randomUUID() : "anon"
  ).current;
  const seenIds = useRef<Set<string>>(new Set());
  const lastAt = useRef<string>(new Date(0).toISOString());
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages, loading, open]);

  const pollNow = useCallback(async () => {
    try {
      const res = await fetch(
        `/api/chat/poll?sessionId=${sessionId}&after=${encodeURIComponent(lastAt.current)}`
      );
      const data = await res.json();
      const fresh: Msg[] = [];
      for (const m of data.messages || []) {
        if (seenIds.current.has(m.id)) continue;
        seenIds.current.add(m.id);
        if (m.at > lastAt.current) lastAt.current = m.at;
        fresh.push({ id: m.id, role: m.role, text: m.message });
      }
      if (fresh.length) setMessages((prev) => [...prev, ...fresh]);
    } catch {
      /* ignore poll errors */
    }
  }, [sessionId]);

  // Poll for admin/bot replies while the chat is open and active.
  useEffect(() => {
    if (!open || !started) return;
    const id = setInterval(pollNow, 4000);
    return () => clearInterval(id);
  }, [open, started, pollNow]);

  async function send() {
    const text = input.trim();
    if (!text || loading) return;
    setMessages((m) => [...m, { role: "user", text }]);
    setInput("");
    setLoading(true);
    setStarted(true);
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text, sessionId, locale }),
      });
      const data = await res.json();
      if (data.messageId) {
        seenIds.current.add(data.messageId);
        if (data.at) lastAt.current = data.at;
      }
      setMessages((m) => [
        ...m,
        { id: data.messageId, role: "bot", text: data.reply || t("greeting") },
      ]);
    } catch {
      setMessages((m) => [...m, { role: "bot", text: t("greeting") }]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed bottom-5 right-5 z-[60]">
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.96 }}
            transition={{ duration: 0.22, ease: "easeOut" }}
            className="absolute bottom-16 right-0 flex h-[28rem] w-[21rem] flex-col overflow-hidden rounded-2xl border border-gold-line/50 bg-base-2 shadow-2xl"
          >
            <div className="flex items-center justify-between border-b border-gold-line/30 bg-elevated px-4 py-3">
              <div>
                <p className="font-display text-sm font-semibold text-cream">
                  {t("title")}
                </p>
                <p className="flex items-center gap-1.5 text-[11px] text-muted">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                  {t("status")}
                </p>
              </div>
              <button
                onClick={() => setOpen(false)}
                className="rounded-lg p-1.5 text-muted transition hover:bg-base hover:text-cream"
                aria-label="Close"
              >
                <X size={18} />
              </button>
            </div>

            <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto p-4">
              {messages.map((m, i) => (
                <div
                  key={m.id || i}
                  className={m.role === "user" ? "flex justify-end" : "flex flex-col items-start"}
                >
                  {m.role === "admin" && (
                    <span className="mb-1 ml-1 text-[10px] uppercase tracking-wide text-gold">
                      Tim Digiwangsa
                    </span>
                  )}
                  <span
                    className={
                      m.role === "user"
                        ? "max-w-[80%] rounded-2xl rounded-br-sm bg-gold px-3.5 py-2 text-sm text-[#1a1407]"
                        : m.role === "admin"
                          ? "max-w-[80%] rounded-2xl rounded-bl-sm border border-gold/50 bg-elevated px-3.5 py-2 text-sm text-cream"
                          : "max-w-[80%] rounded-2xl rounded-bl-sm border border-gold-line/40 bg-elevated px-3.5 py-2 text-sm text-cream"
                    }
                  >
                    {m.text}
                  </span>
                </div>
              ))}
              {loading && (
                <p className="flex items-center gap-2 text-xs text-muted">
                  <Loader2 size={13} className="animate-spin" />
                  {t("typing")}
                </p>
              )}
            </div>

            <a
              href={`https://wa.me/${WHATSAPP}`}
              target="_blank"
              rel="noopener noreferrer"
              className="mx-4 mb-2 rounded-lg border border-gold-line/40 py-2 text-center text-xs text-gold transition hover:bg-elevated"
            >
              {t("whatsapp")}
            </a>

            <div className="flex items-center gap-2 border-t border-gold-line/30 p-3">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && send()}
                placeholder={t("placeholder")}
                className="flex-1 rounded-full border border-gold-line/50 bg-base px-4 py-2 text-sm text-cream outline-none transition focus:border-gold/70"
              />
              <button
                onClick={send}
                disabled={loading}
                className="btn-gold grid h-9 w-9 shrink-0 place-items-center rounded-full disabled:opacity-60"
                aria-label={t("send")}
              >
                <Send size={15} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <button
        onClick={() => setOpen((v) => !v)}
        className="btn-gold grid h-14 w-14 place-items-center rounded-full shadow-lg transition hover:scale-105"
        aria-label={t("open")}
      >
        {open ? <X size={24} /> : <MessageCircle size={24} />}
      </button>
    </div>
  );
}
