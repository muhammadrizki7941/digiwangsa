import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendLeadEmail } from "@/lib/mail";

const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(req: Request) {
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const name = String(body.name || "").trim();
  const whatsapp = String(body.whatsapp || "").trim();
  const email = String(body.email || "").trim();
  const business = String(body.business || "").trim() || null;
  const social = String(body.social || "").trim() || null;
  const description = String(body.description || "").trim();

  if (!name || !whatsapp || !email || !description) {
    return NextResponse.json({ error: "Lengkapi data wajib." }, { status: 400 });
  }
  if (!emailRe.test(email)) {
    return NextResponse.json({ error: "Email tidak valid." }, { status: 400 });
  }

  const lead = await prisma.lead.create({
    data: { name, whatsapp, email, business, social, description },
  });

  // Best-effort email notification (never blocks the lead).
  try {
    await sendLeadEmail({ name, whatsapp, email, business, social, description });
  } catch (e) {
    console.error("Lead email failed:", e);
  }

  return NextResponse.json({ ok: true, id: lead.id });
}
