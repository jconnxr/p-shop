import Link from "next/link";
import { logoutDrop } from "@/app/actions/auth";
import { formatUsd } from "@/lib/format";
import { prisma } from "@/lib/prisma";
import { parseImages } from "@/lib/products";
import { ProductCard } from "@/components/product-card";

export default async function ShopPage() {
  const settings = await prisma.siteSettings.findUnique({ where: { id: 1 } });
  const products = await prisma.product.findMany({
    where: { published: true },
    orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
  });

  return (
    <div className="mx-auto flex min-h-screen w-full max-w-6xl flex-col px-5 pb-24 pt-10 sm:px-8">
      <header className="mb-14 flex flex-col gap-6 border-b border-border pb-10 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.35em] text-muted">Current drop</p>
          <h1 className="mt-2 font-[family-name:var(--font-display)] text-4xl sm:text-5xl">
            {settings?.storeName ?? "Shop"}
          </h1>
          {settings?.storeTagline ? (
            <p className="mt-2 max-w-lg text-sm text-muted">{settings.storeTagline}</p>
          ) : null}
        </div>
        <form action={logoutDrop} className="shrink-0">
          <button
            type="submit"
            className="text-xs uppercase tracking-[0.25em] text-muted underline-offset-4 transition hover:text-foreground hover:underline"
          >
            Leave session
          </button>
        </form>
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
