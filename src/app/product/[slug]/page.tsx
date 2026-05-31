import Link from "next/link";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";
import { BuyButton } from "@/components/buy-button";
import { ProductGallery } from "@/components/product-gallery";
import { formatUsd } from "@/lib/format";
import { withDb } from "@/lib/db";
import { getMockProductBySlug } from "@/lib/mock-catalog";
import { prisma } from "@/lib/prisma";
import { parseImages } from "@/lib/products";

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
    <div className="mx-auto min-h-screen w-full max-w-6xl px-5 pb-24 pt-10 sm:px-8">
      <Link
        href="/shop"
        className="inline-flex text-xs uppercase tracking-[0.25em] text-muted transition hover:text-foreground"
      >
        ← Back to drop
      </Link>

      {previewOnly ? (
        <p className="mt-6 text-[10px] uppercase tracking-[0.2em] text-muted/80">
          Preview mode — checkout needs a running database
        </p>
      ) : null}

      <div className="mt-10 grid gap-12 lg:grid-cols-2 lg:gap-16">
        <ProductGallery name={product.name} images={images} />

        <div className="flex flex-col justify-center">
          <p className="text-xs uppercase tracking-[0.35em] text-muted">Piece</p>
          <h1 className="mt-3 font-[family-name:var(--font-display)] text-4xl leading-tight sm:text-5xl">
            {product.name}
          </h1>
          <p className="mt-6 text-lg text-muted">{formatUsd(product.priceCents)}</p>

          {product.description ? (
            <div className="mt-8 max-w-prose whitespace-pre-wrap text-sm leading-relaxed text-muted/90">
              {product.description}
            </div>
          ) : null}

          <div className="mt-10 space-y-2 border-t border-border pt-10">
            <p className="text-xs uppercase tracking-[0.2em] text-muted">
              {soldOut ? "Sold out" : `${product.stock} left`}
            </p>
            <BuyButton
              productId={product.id}
              disabled={soldOut || previewOnly}
              stripeReady={stripeReady && !previewOnly}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
