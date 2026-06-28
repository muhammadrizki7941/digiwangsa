import { NextResponse } from "next/server";
import Groq from "groq-sdk";
import { matchFAQ, type Lang } from "@/lib/faq-knowledge";
import { prisma } from "@/lib/prisma";
import { isTeamOnline } from "@/lib/settings";

const ACK = {
  id: "Terima kasih! Tim kami sedang online — mohon tunggu sebentar, kami segera membalas. 🙏",
  en: "Thank you! Our team is online — please hold on, we'll reply shortly. 🙏",
};
const FALLBACK = {
  id: "Untuk pertanyaan ini saya belum yakin. Tim kami akan segera menghubungi Anda. Anda juga bisa langsung lanjut via WhatsApp.",
  en: "I'm not fully sure about this one. Our team will reach out to you shortly. You can also continue directly on WhatsApp.",
};

const SYSTEM_PROMPT = {
  id: `Kamu asisten virtual Digiwangsa (jasa website & aplikasi premium bernuansa Jawa). Jawab singkat (maks 3 kalimat), ramah, profesional, Bahasa Indonesia. Layanan: Company Profile/Landing Page, E-Commerce, Aplikasi Web/Sistem Custom, Maintenance & SEO. Paket: Starter (Rp 1,5jt+), Growth (Rp 5jt+), Enterprise (custom). Jika tidak tahu, arahkan ke WhatsApp.`,
  en: `You are Digiwangsa's virtual assistant (premium Javanese-inspired website & app studio). Answer briefly (max 3 sentences), friendly, professional, in English. Services: Company Profile/Landing Page, E-Commerce, custom Web Apps/Systems, Maintenance & SEO. Plans: Starter (Rp 1.5M+), Growth (Rp 5M+), Enterprise (custom). If unsure, point to WhatsApp.`,
};

export async function POST(req: Request) {
  let message = "";
  let sessionId = "";
  let locale: Lang = "id";
  try {
    const b = await req.json();
    message = String(b.message || "").slice(0, 1000);
    sessionId = String(b.sessionId || "");
    locale = b.locale === "en" ? "en" : "id";
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
  if (!message.trim() || !sessionId)
    return NextResponse.json({ error: "Bad request" }, { status: 400 });

  const lang: "id" | "en" = locale === "en" ? "en" : "id";

  await prisma.chatSession.upsert({
    where: { id: sessionId },
    create: { id: sessionId, locale },
    update: { locale },
  });
  await prisma.chatMessage.create({
    data: { sessionId, role: "user", message, source: "user" },
  });

  const online = await isTeamOnline();

  async function botReply(text: string, source: string, mode: string, extra?: object) {
    const saved = await prisma.chatMessage.create({
      data: { sessionId, role: "bot", message: text, source },
    });
    return NextResponse.json({
      mode,
      reply: text,
      messageId: saved.id,
      at: saved.createdAt.toISOString(),
      ...extra,
    });
  }

  // Team online → human handles; just acknowledge and let admin reply (widget polls).
  if (online) {
    await prisma.chatSession.update({
      where: { id: sessionId },
      data: { mode: "human" },
    });
    return botReply(ACK[lang], "ack", "human");
  }

  // Offline → AI. Rule-based first.
  let reply = matchFAQ(message, lang);
  if (reply) return botReply(reply, "rule", "ai");

  // LLM fallback (only if key present).
  if (process.env.GROQ_API_KEY) {
    try {
      const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
      const c = await groq.chat.completions.create({
        model: "llama-3.1-8b-instant",
        messages: [
          { role: "system", content: SYSTEM_PROMPT[lang] },
          { role: "user", content: message },
        ],
        max_tokens: 300,
        temperature: 0.5,
      });
      reply = c.choices[0]?.message?.content?.trim() || null;
      if (reply) return botReply(reply, "llm", "ai");
    } catch {
      /* fall through to fallback */
    }
  }

  // AI couldn't answer → flag for human follow-up + suggest WhatsApp.
  await prisma.chatSession.update({
    where: { id: sessionId },
    data: { needsHuman: true, mode: "human" },
  });
  return botReply(FALLBACK[lang], "fallback", "fallback", { whatsapp: true });
}
