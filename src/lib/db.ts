import { Prisma } from "@prisma/client";

export function isDbConnectionError(error: unknown): boolean {
  if (error instanceof Prisma.PrismaClientInitializationError) return true;
  if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P1001") {
    return true;
  }
  return false;
}

export type DbResult<T> = { ok: true; value: T } | { ok: false; unavailable: true };

const DB_TIMEOUT_MS = 1_500;

function dbTimeout(): Promise<never> {
  return new Promise((_, reject) => {
    setTimeout(() => reject(new Error("DB_TIMEOUT")), DB_TIMEOUT_MS);
  });
}

export async function withDb<T>(fn: () => Promise<T>): Promise<DbResult<T>> {
  try {
    const value = await Promise.race([fn(), dbTimeout()]);
    return { ok: true, value };
  } catch (error) {
    if (error instanceof Error && error.message === "DB_TIMEOUT") {
      console.error("Database timed out");
      return { ok: false, unavailable: true };
    }
    if (isDbConnectionError(error)) {
      console.error("Database unavailable:", error);
      return { ok: false, unavailable: true };
    }
    throw error;
  }
}
