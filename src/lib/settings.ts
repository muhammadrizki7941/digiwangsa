import "server-only";
import { prisma } from "@/lib/prisma";

const TEAM_ONLINE = "team_online";
const WHATSAPP = "whatsapp_number";

export async function getSetting(
  key: string,
  fallback = ""
): Promise<string> {
  const s = await prisma.setting.findUnique({ where: { key } });
  return s?.value ?? fallback;
}

export async function setSetting(key: string, value: string): Promise<void> {
  await prisma.setting.upsert({
    where: { key },
    update: { value },
    create: { key, value },
  });
}

export async function isTeamOnline(): Promise<boolean> {
  return (await getSetting(TEAM_ONLINE)) === "true";
}

export async function setTeamOnline(value: boolean): Promise<void> {
  await setSetting(TEAM_ONLINE, String(value));
}

const DEFAULT_WA = process.env.NEXT_PUBLIC_WHATSAPP || "6280000000000";

export async function getWhatsappNumber(): Promise<string> {
  const raw = await getSetting(WHATSAPP, DEFAULT_WA);
  // keep digits only (wa.me format)
  return raw.replace(/[^0-9]/g, "") || DEFAULT_WA;
}
