"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { signSession } from "@/lib/auth";
import { verifyAdminPassword } from "@/lib/admin-password";
import { verifyDropPassword } from "@/lib/drop-password";

const cookieBase = {
  httpOnly: true,
  sameSite: "lax" as const,
  secure: process.env.NODE_ENV === "production",
  path: "/",
  maxAge: 60 * 60 * 24 * 30,
};

export async function loginDrop(
  _prev: { error?: string; ok?: true } | null,
  formData: FormData,
): Promise<{ error?: string; ok?: true }> {
  const password = String(formData.get("password") ?? "").trim();

  if (!process.env.SESSION_SECRET?.trim()) {
    return {
      error:
        "Server misconfiguration: add SESSION_SECRET in Vercel → Settings → Environment Variables, then redeploy.",
    };
  }

  try {
    const ok = await verifyDropPassword(password);
    if (!ok) return { error: "Wrong password." };
    const token = await signSession("drop");
    const store = await cookies();
    store.set("drop_session", token, cookieBase);
  } catch (e) {
    console.error("loginDrop", e);
    return {
      error:
        "Could not sign in. Check DATABASE_URL on Vercel and that the database was seeded.",
    };
  }

  return { ok: true };
}

export async function logoutDrop() {
  const store = await cookies();
  store.delete("drop_session");
  redirect("/");
}

export async function loginAdmin(
  _prev: { error?: string } | null,
  formData: FormData,
): Promise<{ error?: string }> {
  const password = String(formData.get("password") ?? "");
  const rawNext = String(formData.get("next") ?? "/admin");
  const safeNext =
    rawNext.startsWith("/") && !rawNext.startsWith("//") ? rawNext : "/admin";

  if (!process.env.SESSION_SECRET?.trim()) {
    return {
      error:
        "Server misconfiguration: add SESSION_SECRET in Vercel → Settings → Environment Variables, then redeploy.",
    };
  }

  try {
    const ok = await verifyAdminPassword(password);
    if (!ok) return { error: "Wrong password." };
    const token = await signSession("admin");
    const store = await cookies();
    store.set("admin_session", token, cookieBase);
  } catch (e) {
    console.error("loginAdmin", e);
    return {
      error:
        "Could not sign in. Check DATABASE_URL on Vercel and that the database was seeded.",
    };
  }

  redirect(safeNext);
}

export async function logoutAdmin() {
  const store = await cookies();
  store.delete("admin_session");
  redirect("/admin/login");
}
