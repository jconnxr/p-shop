import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

export const DEFAULT_ADMIN_PASSWORD = "admin";

function normalizeEnv(value: string | undefined): string | undefined {
  if (!value) return undefined;
  const trimmed = value.trim().replace(/^["']|["']$/g, "");
  return trimmed || undefined;
}

export function envAdminPassword(): string | undefined {
  const fromEnv = normalizeEnv(process.env.ADMIN_PASSWORD);
  if (fromEnv) return fromEnv;
  if (process.env.NODE_ENV === "development") return DEFAULT_ADMIN_PASSWORD;
  return undefined;
}

export async function verifyAdminPassword(password: string): Promise<boolean> {
  const input = password.trim();
  if (!input) return false;

  const candidates = new Set<string>();
  const envPass = envAdminPassword();
  if (envPass) candidates.add(envPass);
  candidates.add(DEFAULT_ADMIN_PASSWORD);

  for (const candidate of candidates) {
    if (input === candidate) return true;
  }

  try {
    const settings = await prisma.siteSettings.findUnique({ where: { id: 1 } });
    if (!settings) return false;
    return bcrypt.compare(input, settings.adminPasswordHash);
  } catch {
    return false;
  }
}
