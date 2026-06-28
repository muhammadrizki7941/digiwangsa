import { NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const s = await getSession();
  if (!s) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const sessions = await prisma.chatSession.findMany({
    orderBy: { updatedAt: "desc" },
    take: 50,
    include: { messages: { orderBy: { createdAt: "desc" }, take: 1 } },
  });

  return NextResponse.json({
    sessions: sessions.map((x) => ({
      id: x.id,
      mode: x.mode,
      needsHuman: x.needsHuman,
      updatedAt: x.updatedAt.toISOString(),
      last: x.messages[0]?.message ?? "",
      lastRole: x.messages[0]?.role ?? "",
    })),
  });
}
