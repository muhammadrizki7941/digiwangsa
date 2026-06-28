import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

/** Public polling endpoint: returns bot/admin messages newer than `after`. */
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const sessionId = searchParams.get("sessionId");
  const after = searchParams.get("after");
  if (!sessionId) return NextResponse.json({ messages: [] });

  const messages = await prisma.chatMessage.findMany({
    where: {
      sessionId,
      role: { in: ["bot", "admin"] },
      ...(after ? { createdAt: { gt: new Date(after) } } : {}),
    },
    orderBy: { createdAt: "asc" },
    take: 50,
  });

  return NextResponse.json({
    messages: messages.map((m) => ({
      id: m.id,
      role: m.role,
      message: m.message,
      at: m.createdAt.toISOString(),
    })),
  });
}
