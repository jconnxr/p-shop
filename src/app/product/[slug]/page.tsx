import Link from "next/link";
import { notFound } from "next/navigation";
import { BuyButton } from "@/components/buy-button";
import { ProductGallery } from "@/components/product-gallery";
import { StoreShell } from "@/components/store-chrome";
import { formatUsd } from "@/lib/format";
import { withDb } from "@/lib/db";
import { getMockProductBySlug } from "@/lib/mock-catalog";
import { prisma } from "@/lib/prisma";
import { parseImages } from "@/lib/products";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ slug: string }> };

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;
  const productResult = await withDb(() =>
    prisma.product.findFirst({
      where: { slug, published: true },
    }),
  );

  const product = productResult.ok ? productResult.value : getMockProductBySlug(slug);
  if (!product) notFound();

  const images = parseImages(product.images);
  const stripeReady = Boolean(
    process.env.STRIPE_SECRET_KEY && process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,
  );
  const soldOut = product.stock <= 0;
  const previewOnly = !productResult.ok;

  return (
    <StoreShell>
      <div className="mx-auto w-full max-w-5xl px-4 pb-16 pt-6 sm:px-6">
        <Link
          href="/shop"
          className="inline-flex text-[11px] font-semibold uppercase tracking-[0.2em] text-black/50 transition hover:text-black"
        >
          ← Shop
        </Link>

        {previewOnly ? (
          <p className="mt-4 text-[10px] uppercase tracking-[0.18em] text-black/40">Preview mode</p>
        ) : null}

        <div className="mt-8 grid gap-10 lg:grid-cols-2 lg:gap-14">
          <ProductGallery name={product.name} images={images} variant="light" />

          <div className="flex flex-col justify-center text-black">
            <p className="text-[11px] font-semibold uppercase tracking-[0.25em] text-black/45">Piece</p>
            <h1 className="mt-3 font-[family-name:var(--font-display)] text-3xl leading-tight sm:text-4xl">
              {product.name}
            </h1>
            <p className="mt-4 text-lg font-medium">{formatUsd(product.priceCents)}</p>

            {product.description ? (
              <div className="mt-6 max-w-prose whitespace-pre-wrap text-sm leading-relaxed text-black/65">
                {product.description}
              </div>
            ) : null}

            <div className="mt-10 space-y-2 border-t border-black/10 pt-8">
              <p className="text-[11px] font-semibold uppercase tracking-[0.15em] text-black/45">
                {soldOut ? "Sold out" : `${product.stock} left`}
              </p>
              <BuyButton
                productId={product.id}
                disabled={soldOut}
                stripeReady={stripeReady && !previewOnly}
                variant="light"
              />
            </div>
          </div>
        </div>
      </div>
    </StoreShell>
  );
}
