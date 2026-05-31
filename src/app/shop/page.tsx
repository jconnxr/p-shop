import { StoreShell } from "@/components/store-chrome";
import { ProductCard } from "@/components/product-card";
import { formatUsd } from "@/lib/format";
import { withDb } from "@/lib/db";
import { MOCK_PRODUCTS } from "@/lib/mock-catalog";
import { prisma } from "@/lib/prisma";
import { parseImages } from "@/lib/products";

export const dynamic = "force-dynamic";

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
  const products = data.ok ? data.value.products : MOCK_PRODUCTS;

  return (
    <StoreShell>
      <div className="mx-auto w-full max-w-5xl px-3 pb-10 pt-5 sm:px-6 sm:pt-8">
        {usingMock ? (
          <p className="mb-4 text-center text-[10px] uppercase tracking-[0.18em] text-black/40">
            Preview mode
          </p>
        ) : null}

        {products.length === 0 ? (
          <p className="py-20 text-center text-sm text-black/50">Nothing in the drop yet.</p>
        ) : (
          <div className="grid grid-cols-2 gap-x-3 gap-y-8 sm:gap-x-5 sm:gap-y-10">
            {products.map((p) => {
              const imgs = parseImages(p.images);
              return (
                <ProductCard
                  key={p.id}
                  slug={p.slug}
                  name={p.name}
                  priceLabel={formatUsd(p.priceCents)}
                  image={imgs[0]}
                />
              );
            })}
          </div>
        )}
      </div>
    </StoreShell>
  );
}
