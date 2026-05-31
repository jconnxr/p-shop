import Link from "next/link";
import { logoutDrop } from "@/app/actions/auth";

export const dynamic = "force-dynamic";
import { ProductCard } from "@/components/product-card";
import { formatUsd } from "@/lib/format";
import { withDb } from "@/lib/db";
import { MOCK_PRODUCTS, MOCK_STORE } from "@/lib/mock-catalog";
import { prisma } from "@/lib/prisma";
import { parseImages } from "@/lib/products";

export default async function ShopPage() {
  const data = await withDb(async () => {
    const [settings, products] = await Promise.all([
      prisma.siteSettings.findUnique({ where: { id: 1 } }),
      prisma.product.findMany({
        where: { published: true },
        orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
      }),
    ]);
    return { settings, products };
  });

  const usingMock = !data.ok;
  const settings = data.ok ? data.value.settings : null;
  const products = data.ok ? data.value.products : MOCK_PRODUCTS;
  const storeName = settings?.storeName ?? MOCK_STORE.storeName;
  const storeTagline = settings?.storeTagline ?? MOCK_STORE.storeTagline;

  return (
    <div className="mx-auto flex min-h-screen w-full max-w-6xl flex-col px-5 pb-24 pt-10 sm:px-8">
      {usingMock ? (
        <p className="mb-6 text-center text-[10px] uppercase tracking-[0.2em] text-muted/80">
          Preview mode — start Postgres and run <code className="text-foreground/70">npm run db:seed</code> for
          live data
        </p>
      ) : null}

      <header className="mb-14 flex flex-col gap-6 border-b border-border pb-10 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.35em] text-muted">Current drop</p>
          <h1 className="mt-2 font-[family-name:var(--font-display)] text-4xl sm:text-5xl">{storeName}</h1>
          {storeTagline ? (
            <p className="mt-2 max-w-lg text-sm text-muted">{storeTagline}</p>
          ) : null}
        </div>
        <div className="flex shrink-0 flex-col items-end gap-3 sm:flex-row sm:items-center sm:gap-6">
          <Link
            href="/"
            className="text-xs uppercase tracking-[0.25em] text-muted underline-offset-4 transition hover:text-foreground hover:underline"
          >
            Home
          </Link>
          <form action={logoutDrop}>
            <button
              type="submit"
              className="text-xs uppercase tracking-[0.25em] text-muted underline-offset-4 transition hover:text-foreground hover:underline"
            >
              Sign out
            </button>
          </form>
        </div>
      </header>

      {products.length === 0 ? (
        <p className="text-center text-muted">
          Nothing listed yet. Check back after the next drop is published.
        </p>
      ) : (
        <div className="grid gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((p, i) => {
            const imgs = parseImages(p.images);
            return (
              <ProductCard
                key={p.id}
                slug={p.slug}
                name={p.name}
                priceLabel={formatUsd(p.priceCents)}
                image={imgs[0]}
                index={i}
              />
            );
          })}
        </div>
      )}

      <footer className="mt-auto pt-24 text-center text-[11px] uppercase tracking-[0.25em] text-muted/70">
        <Link href="/admin" className="transition hover:text-muted">
          Manage drop
        </Link>
      </footer>
    </div>
  );
}
