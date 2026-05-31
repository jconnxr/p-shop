import { SignJWT, jwtVerify } from "jose";

export type SessionRole = "drop" | "admin";

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
  const s = process.env.SESSION_SECRET;
  if (!s) return false;
  try {
    const { payload } = await jwtVerify(token, new TextEncoder().encode(s));
    return payload.role === role;
  } catch {
    return false;
  }
}
