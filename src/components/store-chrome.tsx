import Link from "next/link";
import { logoutDrop } from "@/app/actions/auth";

export function StoreLogo({ className = "h-6 w-auto sm:h-7" }: { className?: string }) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src="/iveywood-logo-combined.png"
      alt="Iveywood"
      width={140}
      height={48}
      className={className}
      decoding="async"
    />
  );
}

export function StoreHeader() {
  return (
    <header className="store-header sticky top-0 z-40 border-b border-black/10 bg-white px-4 py-4 sm:px-6">
      <div className="mx-auto flex max-w-5xl items-center justify-between gap-4">
        <Link href="/shop" className="shrink-0" aria-label="Shop home">
          <StoreLogo />
        </Link>
        <nav className="flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.1em] text-black sm:gap-5 sm:text-[13px]">
          <Link href="/shop" className="transition hover:opacity-55">
            Shop
          </Link>
          <Link href="/" className="transition hover:opacity-55">
            Home
          </Link>
          <form action={logoutDrop} className="inline">
            <button type="submit" className="transition hover:opacity-55">
              Exit
            </button>
          </form>
        </nav>
      </div>
    </header>
  );
}

export function StoreFooter() {
  return (
    <footer className="store-footer border-t border-black/10 bg-white px-4 py-12 sm:px-6">
      <div className="mx-auto flex max-w-5xl flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
        <div className="space-y-1 text-[13px] font-medium uppercase tracking-[0.08em] text-black">
          <p>All sales final</p>
          <p className="text-black/55">© {new Date().getFullYear()}, Iveywood</p>
        </div>
        <Link
          href="/admin"
          className="text-[11px] uppercase tracking-[0.2em] text-black/45 transition hover:text-black"
        >
          Admin
        </Link>
      </div>
    </footer>
  );
}

export function StoreShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="storefront flex min-h-dvh flex-col bg-white text-black">
      <StoreHeader />
      <main className="flex-1">{children}</main>
      <StoreFooter />
    </div>
  );
}
