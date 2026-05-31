import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { MAX_PRODUCTS } from "@/lib/products";

export default async function AdminHomePage() {
  const [productCount, orderCount, settings] = await Promise.all([
    prisma.product.count(),
    prisma.order.count(),
    prisma.siteSettings.findUnique({ where: { id: 1 } }),
  ]);

  return (
    <div className="space-y-10">
      <div>
        <h1 className="font-[family-name:var(--font-display)] text-3xl">Overview</h1>
        <p className="mt-2 text-sm text-muted">
          {settings?.storeName ?? "Shop"} — up to {MAX_PRODUCTS} pieces per drop.
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-3">
        <div className="rounded-sm border border-border bg-card p-6">
          <p className="text-xs uppercase tracking-[0.2em] text-muted">Listed</p>
          <p className="mt-2 text-3xl tabular-nums">{productCount}</p>
          <p className="mt-1 text-xs text-muted">of {MAX_PRODUCTS} max</p>
        </div>
        <div className="rounded-sm border border-border bg-card p-6">
          <p className="text-xs uppercase tracking-[0.2em] text-muted">Orders</p>
          <p className="mt-2 text-3xl tabular-nums">{orderCount}</p>
        </div>
        <div className="rounded-sm border border-border bg-card p-6">
          <p className="text-xs uppercase tracking-[0.2em] text-muted">Storefront</p>
          <Link href="/" className="mt-3 inline-block text-sm text-accent underline-offset-4 hover:underline">
            Open gate page
          </Link>
        </div>
      </div>
    </div>
  );
}
