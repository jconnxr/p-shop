import { SignJWT, jwtVerify } from "jose";

const DROP = "drop" as const;
const ADMIN = "admin" as const;

export type SessionRole = typeof DROP | typeof ADMIN;

function getSecret() {
  const s = process.env.SESSION_SECRET;
  if (!s) throw new Error("SESSION_SECRET is not set");
  return new TextEncoder().encode(s);
}

export async function signSession(role: SessionRole) {
  return new SignJWT({ role })
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime("30d")
    .sign(getSecret());
}

export async function verifySessionToken(
  token: string | undefined,
  role: SessionRole,
): Promise<boolean> {
  if (!token) return false;
  try {
    const { payload } = await jwtVerify(token, getSecret());
    return payload.role === role;
  } catch {
    return false;
  }
}
