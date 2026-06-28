"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { Send, Loader2, Circle } from "lucide-react";
import { cn } from "@/lib/utils";

type SessionRow = {
  id: string;
  mode: string;
  needsHuman: boolean;
  updatedAt: string;
  last: string;
  lastRole: string;
};
type Message = { id: string; role: string; message: string; at: string };

export default function AdminInbox() {
  const [online, setOnline] = useState(false);
  const [sessions, setSessions] = useState<SessionRow[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [reply, setReply] = useState("");
  const [sending, setSending] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const activeRef = useRef<string | null>(null);
  activeRef.current = activeId;

  const loadSessions = useCallback(async () => {
    const r = await fetch("/api/admin/chat/sessions");
    if (r.ok) setSessions((await r.json()).sessions || []);
  }, []);

  const loadMessages = useCallback(async (id: string) => {
    const r = await fetch(`/api/admin/chat/messages?sessionId=${id}`);
    if (r.ok) setMessages((await r.json()).messages || []);
  }, []);

  // initial: settings + sessions
  useEffect(() => {
    fetch("/api/admin/settings")
      .then((r) => r.json())
      .then((d) => setOnline(Boolean(d.teamOnline)))
      .catch(() => {});
    loadSessions();
    const id = setInterval(loadSessions, 5000);
    return () => clearInterval(id);
  }, [loadSessions]);

  // poll active conversation
  useEffect(() => {
    if (!activeId) return;
    loadMessages(activeId);
    const id = setInterval(() => {
      if (activeRef.current) loadMessages(activeRef.current);
    }, 3000);
    return () => clearInterval(id);
  }, [activeId, loadMessages]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight });
  }, [messages]);

  async function toggleOnline() {
    const next = !online;
    setOnline(next);
    await fetch("/api/admin/settings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ teamOnline: next }),
    });
  }

  async function sendReply() {
    const text = reply.trim();
    if (!text || !activeId || sending) return;
    setSending(true);
    try {
      const r = await fetch("/api/admin/chat/reply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId: activeId, message: text }),
      });
      const d = await r.json();
      if (d.message) setMessages((m) => [...m, d.message]);
      setReply("");
      loadSessions();
    } finally {
      setSending(false);
    }
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="font-display text-3xl font-semibold text-cream">Live Chat</h1>
        <button
          onClick={toggleOnline}
          className={cn(
            "flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition",
            online
              ? "border-emerald-500/50 bg-emerald-500/10 text-emerald-300"
              : "border-gold-line/50 text-muted hover:border-gold/70"
          )}
        >
          <Circle
            size={10}
            className={online ? "fill-emerald-400 text-emerald-400" : "fill-muted text-muted"}
          />
          {online ? "Tim Online" : "Tim Offline (AI aktif)"}
        </button>
      </div>

      <div className="grid h-[32rem] grid-cols-[260px_1fr] overflow-hidden rounded-2xl border border-gold-line/30">
        {/* sessions */}
        <div className="overflow-y-auto border-r border-gold-line/30 bg-base-2">
          {sessions.length === 0 ? (
            <p className="p-4 text-sm text-muted">Belum ada percakapan.</p>
          ) : (
            sessions.map((s) => (
              <button
                key={s.id}
                onClick={() => setActiveId(s.id)}
                className={cn(
                  "block w-full border-b border-gold-line/15 px-4 py-3 text-left transition",
                  activeId === s.id ? "bg-elevated" : "hover:bg-elevated/60"
                )}
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs text-cream">
                    #{s.id.slice(0, 8)}
                  </span>
                  {s.needsHuman && (
                    <span className="rounded-full bg-gold/20 px-2 py-0.5 text-[10px] text-gold">
                      perlu balasan
                    </span>
                  )}
                </div>
                <p className="mt-1 truncate text-xs text-muted">
                  {s.lastRole === "user" ? "👤 " : "🤖 "}
                  {s.last}
                </p>
              </button>
            ))
          )}
        </div>

        {/* conversation */}
        <div className="flex flex-col bg-base">
          {activeId ? (
            <>
              <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto p-4">
                {messages.map((m) => (
                  <div
                    key={m.id}
                    className={m.role === "user" ? "flex justify-start" : "flex justify-end"}
                  >
                    <span
                      className={cn(
                        "max-w-[75%] rounded-2xl px-3.5 py-2 text-sm",
                        m.role === "user"
                          ? "rounded-bl-sm border border-gold-line/40 bg-elevated text-cream"
                          : m.role === "admin"
                            ? "rounded-br-sm bg-gold text-[#1a1407]"
                            : "rounded-br-sm border border-gold-line/40 bg-base-2 text-muted"
                      )}
                    >
                      {m.role === "bot" && (
                        <span className="mb-0.5 block text-[10px] uppercase tracking-wide text-gold/70">
                          AI
                        </span>
                      )}
                      {m.message}
                    </span>
                  </div>
                ))}
              </div>
              <div className="flex items-center gap-2 border-t border-gold-line/30 p-3">
                <input
                  value={reply}
                  onChange={(e) => setReply(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && sendReply()}
                  placeholder="Balas sebagai tim…"
                  className="flex-1 rounded-full border border-gold-line/50 bg-base px-4 py-2 text-sm text-cream outline-none transition focus:border-gold/70"
                />
                <button
                  onClick={sendReply}
                  disabled={sending}
                  className="btn-gold grid h-9 w-9 shrink-0 place-items-center rounded-full disabled:opacity-60"
                >
                  {sending ? <Loader2 size={15} className="animate-spin" /> : <Send size={15} />}
                </button>
              </div>
            </>
          ) : (
            <div className="grid flex-1 place-items-center text-sm text-muted">
              Pilih percakapan untuk membalas.
            </div>
          )}
        </div>
      </div>

      <p className="mt-4 text-xs text-muted">
        Saat <b className="text-cream">Online</b>, pesan pengunjung menunggu balasan tim. Saat{" "}
        <b className="text-cream">Offline</b>, AI menjawab otomatis; jika AI tak bisa, pengunjung diarahkan ke WhatsApp dan sesi ditandai “perlu balasan”.
      </p>
    </div>
  );
}
