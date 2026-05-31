"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import type { ProductImage } from "@/lib/products";

export function ProductGallery({ name, images }: { name: string; images: ProductImage[] }) {
  const [active, setActive] = useState(0);
  const current = images[active];

  if (images.length === 0) {
    return (
      <div className="flex aspect-[3/4] items-center justify-center rounded-sm bg-card ring-1 ring-border">
        <span className="text-sm text-muted">No images</span>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="relative aspect-[3/4] overflow-hidden rounded-sm bg-card ring-1 ring-border">
        <AnimatePresence mode="wait">
          <motion.div
            key={current.url}
            initial={{ opacity: 0.35, scale: 1.02 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            className="absolute inset-0"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={current.url}
              alt={current.alt ?? name}
              className="h-full w-full object-cover"
            />
          </motion.div>
        </AnimatePresence>
      </div>
      {images.length > 1 ? (
        <div className="flex gap-2 overflow-x-auto pb-1">
          {images.map((img, i) => (
            <button
              key={img.url}
              type="button"
              onClick={() => setActive(i)}
              className={`relative h-16 w-14 shrink-0 overflow-hidden rounded-sm ring-1 transition ${
                i === active ? "ring-accent" : "ring-border opacity-70 hover:opacity-100"
              }`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={img.url} alt="" className="h-full w-full object-cover" />
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
