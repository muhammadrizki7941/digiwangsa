import { NextResponse, type NextRequest } from "next/server";
import { jwtVerify } from "jose";
import { SESSION_COOKIE } from "@/lib/session-config";

const key = new TextEncoder().encode(
  process.env.AUTH_SECRET || "dev-insecure-secret-change-me"
);

async function isValid(token?: string): Promise<boolean> {
  if (!token) return false;
  try {
    await jwtVerify(token, key, { algorithms: ["HS256"] });
    return true;
  } catch {
    return false;
  }
}

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const isLogin = pathname === "/admin/login";
  const valid = await isValid(req.cookies.get(SESSION_COOKIE)?.value);

  // Unauthenticated → bounce to login (except the login page itself).
  if (!valid && !isLogin) {
    return NextResponse.redirect(new URL("/admin/login", req.url));
  }
  // Already authenticated → skip login page.
  if (valid && isLogin) {
    return NextResponse.redirect(new URL("/admin", req.url));
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
