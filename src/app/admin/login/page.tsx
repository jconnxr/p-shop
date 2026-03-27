import Link from "next/link";
import { AdminLoginForm } from "@/components/admin-login-form";

export default async function AdminLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  const sp = await searchParams;
  const next = sp.next && sp.next.startsWith("/") ? sp.next : "/admin";

  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-6 py-16">
      <div className="w-full max-w-sm space-y-8">
        <div className="text-center">
          <p className="text-xs uppercase tracking-[0.35em] text-muted">Protected</p>
          <h1 className="mt-3 font-[family-name:var(--font-display)] text-4xl">Admin</h1>
        </div>
        <AdminLoginForm nextPath={next} />
        <Link
          href="/"
          className="block text-center text-xs uppercase tracking-[0.25em] text-muted transition hover:text-foreground"
        >
          ← Storefront gate
        </Link>
      </div>
    </div>
  );
}
