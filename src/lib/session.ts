import "server-only";
import { SignJWT, jwtVerify, type JWTPayload } from "jose";
import { cookies } from "next/headers";
import { SESSION_COOKIE } from "./session-config";

export { SESSION_COOKIE };

export type SessionPayload = {
  id: string;
  email: string;
  name: string;
};

const key = new TextEncoder().encode(
  process.env.AUTH_SECRET || "dev-insecure-secret-change-me"
);

export async function encryptSession(payload: SessionPayload): Promise<string> {
  return new SignJWT(payload as unknown as JWTPayload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(key);
}

export async function decryptSession(
  token?: string
): Promise<SessionPayload | null> {
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, key, { algorithms: ["HS256"] });
    return { id: payload.id as string, email: payload.email as string, name: payload.name as string };
  } catch {
    return null;
  }
}

/** Read the current admin session in Server Components / actions. */
export async function getSession(): Promise<SessionPayload | null> {
  const store = await cookies();
  return decryptSession(store.get(SESSION_COOKIE)?.value);
}
