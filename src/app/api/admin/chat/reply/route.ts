import { NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  const s = await getSession();
  if (!s) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json().catch(() => ({}));
  const sessionId = String(body.sessionId || "");
  const message = String(body.message || "").trim().slice(0, 2000);
  if (!sessionId || !message)
    return NextResponse.json({ error: "Bad request" }, { status: 400 });

  const saved = await prisma.chatMessage.create({
    data: { sessionId, role: "admin", message, source: "human" },
  });
  await prisma.chatSession.update({
    where: { id: sessionId },
    data: { mode: "human", needsHuman: false },
  });

  return NextResponse.json({
    ok: true,
    message: { id: saved.id, role: "admin", message, at: saved.createdAt.toISOString() },
  });
}
