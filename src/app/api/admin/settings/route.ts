import { NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import { isTeamOnline, setTeamOnline } from "@/lib/settings";

export async function GET() {
  const s = await getSession();
  if (!s) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  return NextResponse.json({ teamOnline: await isTeamOnline() });
}

export async function POST(req: Request) {
  const s = await getSession();
  if (!s) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = await req.json().catch(() => ({}));
  await setTeamOnline(Boolean(body.teamOnline));
  return NextResponse.json({ teamOnline: Boolean(body.teamOnline) });
}
