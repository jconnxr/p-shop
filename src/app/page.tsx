import { cookies } from "next/headers";
import Link from "next/link";
import { redirect } from "next/navigation";
import { verifySessionToken } from "@/lib/auth";
import { GateForm } from "@/components/gate-form";
import { prisma } from "@/lib/prisma";

export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  const sp = await searchParams;
  const c = await cookies();
  const token = c.get("drop_session")?.value;
  if (await verifySessionToken(token, "drop")) {
    const next = sp.next && sp.next.startsWith("/") ? sp.next : "/shop";
    redirect(next);
  }

  const settings = await prisma.siteSettings.findUnique({ where: { id: 1 } });
  const title = settings?.storeName ?? "Drop";
  const tagline = settings?.storeTagline ?? "";

  const nextPath = sp.next && sp.next.startsWith("/") ? sp.next : "/shop";

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-6 py-24">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.07]"
        style={{
          backgroundImage: `radial-gradient(circle at 20% 20%, var(--accent), transparent 45%),
            radial-gradient(circle at 80% 0%, #4a4438, transparent 40%)`,
        }}
      />
      <div className="relative space-y-3 text-center">
        <p className="text-xs uppercase tracking-[0.45em] text-muted">Private release</p>
        <h1 className="font-[family-name:var(--font-display)] text-5xl leading-[1.05] sm:text-7xl">
          {title}
        </h1>
        {tagline ? (
          <p className="mx-auto max-w-md text-sm leading-relaxed text-muted">{tagline}</p>
        ) : null}
      </div>
      <div className="relative mt-16 w-full max-w-sm">
        <GateForm nextPath={nextPath} />
      </div>
      <p className="relative mt-14 max-w-sm text-center text-xs leading-relaxed text-muted">
        Access is password-only for each drop. Your friend shares the password when the release goes
        live.
      </p>
      <Link
        href="/admin/login"
        className="relative mt-10 text-[11px] uppercase tracking-[0.3em] text-muted/60 transition hover:text-muted"
      >
        Admin
      </Link>
    </div>
  );
}
