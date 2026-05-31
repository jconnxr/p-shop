import Link from "next/link";
import { formatUsd } from "@/lib/format";
import { prisma } from "@/lib/prisma";
import { MAX_PRODUCTS } from "@/lib/products";
import { DeleteProductButton } from "@/components/delete-product-button";

export default async function AdminProductsPage() {
  const products = await prisma.product.findMany({
    orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
  });

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="font-[family-name:var(--font-display)] text-3xl">Products</h1>
          <p className="mt-1 text-sm text-muted">
            {products.length} / {MAX_PRODUCTS} slots used
          </p>
        </div>
        {products.length >= MAX_PRODUCTS ? (
          <span className="inline-flex cursor-not-allowed justify-center rounded-full bg-border px-6 py-3 text-xs uppercase tracking-[0.2em] text-muted">
            All slots full
          </span>
        ) : (
          <Link
            href="/admin/products/new"
            className="inline-flex justify-center rounded-full bg-foreground px-6 py-3 text-xs uppercase tracking-[0.2em] text-background transition hover:opacity-90"
          >
            Add piece
          </Link>
        )}
      </div>

      {products.length === 0 ? (
        <p className="text-sm text-muted">No products yet.</p>
      ) : (
        <div className="overflow-x-auto rounded-sm border border-border">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead className="border-b border-border bg-card/80 text-xs uppercase tracking-[0.15em] text-muted">
              <tr>
                <th className="px-4 py-3 font-medium">Name</th>
                <th className="px-4 py-3 font-medium">Price</th>
                <th className="px-4 py-3 font-medium">Stock</th>
                <th className="px-4 py-3 font-medium">Published</th>
                <th className="px-4 py-3 font-medium" />
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={p.id} className="border-b border-border/80 last:border-0">
                  <td className="px-4 py-4">
                    <Link href={`/admin/products/${p.id}`} className="hover:underline">
                      {p.name}
                    </Link>
                    <div className="mt-1 font-mono text-[11px] text-muted">/{p.slug}</div>
                  </td>
                  <td className="px-4 py-4 tabular-nums">{formatUsd(p.priceCents)}</td>
                  <td className="px-4 py-4 tabular-nums">{p.stock}</td>
                  <td className="px-4 py-4">{p.published ? "Yes" : "No"}</td>
                  <td className="px-4 py-4 text-right">
                    <DeleteProductButton productId={p.id} name={p.name} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
