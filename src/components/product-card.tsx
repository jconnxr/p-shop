"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import type { ProductImage } from "@/lib/products";

type Props = {
  slug: string;
  name: string;
  priceLabel: string;
  image?: ProductImage;
  index: number;
};

export function ProductCard({ slug, name, priceLabel, image, index }: Props) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.55, delay: index * 0.06, ease: [0.22, 1, 0.36, 1] }}
      className="group"
    >
      <Link href={`/product/${slug}`} className="block">
        <div className="relative aspect-[3/4] overflow-hidden rounded-sm bg-card ring-1 ring-border transition-transform duration-500 group-hover:ring-accent/40">
          {image?.url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={image.url}
              alt={image.alt ?? name}
              className="h-full w-full object-cover transition duration-700 group-hover:scale-[1.03]"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-sm text-muted">No image</div>
          )}
        </div>
        <div className="mt-5 flex items-start justify-between gap-4">
          <h2 className="font-[family-name:var(--font-display)] text-2xl leading-tight tracking-tight">
            {name}
          </h2>
          <span className="shrink-0 text-sm uppercase tracking-widest text-muted">{priceLabel}</span>
        </div>
      </Link>
    </motion.article>
  );
}
