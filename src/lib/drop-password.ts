import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

/** Plaintext from DROP_PASSWORD env (local / override). */
export function envDropPassword(): string | undefined {
  const p = process.env.DROP_PASSWORD?.trim();
  return p || undefined;
}

export async function verifyDropPassword(password: string): Promise<boolean> {
  const envPass = envDropPassword();
  if (envPass && password === envPass) return true;

  try {
    const settings = await prisma.siteSettings.findUnique({ where: { id: 1 } });
    if (!settings) return false;
    return bcrypt.compare(password, settings.storefrontPasswordHash);
  } catch {
    return false;
  }
}
