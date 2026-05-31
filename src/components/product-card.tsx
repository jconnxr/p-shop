"use client";

import Link from "next/link";
import type { ProductImage } from "@/lib/products";

type Props = {
  slug: string;
  name: string;
  priceLabel: string;
  image?: ProductImage;
};

export function ProductCard({ slug, name, priceLabel, image }: Props) {
  return (
    <article className="group">
      <Link href={`/product/${slug}`} className="block">
        <div className="relative aspect-[4/5] overflow-hidden bg-[#f4f4f4]">
          {image?.url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={image.url}
              alt={image.alt ?? name}
              className="h-full w-full object-cover object-center transition duration-500 group-hover:scale-[1.02]"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-xs uppercase tracking-widest text-black/35">
              No image
            </div>
          )}
        </div>
        <div className="mt-3 flex items-baseline justify-between gap-2 px-0.5">
          <h2 className="truncate text-[11px] font-semibold uppercase tracking-[0.06em] text-black sm:text-xs">
            {name}
          </h2>
          <span className="shrink-0 text-[11px] font-medium text-black/70 sm:text-xs">{priceLabel}</span>
        </div>
      </Link>
    </article>
  );
}
