import Link from "next/link";
import { logoutAdmin } from "@/app/actions/auth";

export default function AdminDashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto flex min-h-screen w-full max-w-5xl flex-col px-4 py-8 sm:px-6">
      <nav className="mb-10 flex flex-col gap-6 border-b border-border pb-6 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap gap-x-8 gap-y-3 text-sm">
          <Link className="text-muted transition hover:text-foreground" href="/admin">
            Overview
          </Link>
          <Link className="text-muted transition hover:text-foreground" href="/admin/products">
            Products
          </Link>
          <Link className="text-muted transition hover:text-foreground" href="/admin/orders">
            Orders
          </Link>
          <Link className="text-muted transition hover:text-foreground" href="/admin/settings">
            Settings
          </Link>
        </div>
        <form action={logoutAdmin}>
          <button
            type="submit"
            className="text-xs uppercase tracking-[0.25em] text-muted transition hover:text-foreground"
          >
            Sign out
          </button>
        </form>
      </nav>
      {children}
    </div>
  );
}
