"use client";

import { motion } from "framer-motion";
import { useFormState, useFormStatus } from "react-dom";
import { createProduct, updateProduct } from "@/app/actions/admin";
import type { ProductImage } from "@/lib/products";
import { stringifyImages } from "@/lib/products";

type Mode = { type: "create" } | { type: "edit"; productId: string };

function SubmitLabel({ label }: { label: string }) {
  const { pending } = useFormStatus();
  return pending ? "Saving…" : label;
}

export function ProductEditorForm({
  mode,
  initial,
}: {
  mode: Mode;
  initial?: {
    name: string;
    description: string;
    price: string;
    stock: number;
    sortOrder: number;
    published: boolean;
    images: ProductImage[];
  };
}) {
  const action =
    mode.type === "create"
      ? createProduct
      : updateProduct.bind(null, mode.productId);

  const [state, formAction] = useFormState(action, null);

  const defaultImages = initial?.images?.length
    ? stringifyImages(initial.images)
    : `[{"url":"https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=1200&q=80","alt":"Sample"}]`;

  return (
    <motion.form
      action={formAction}
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="mx-auto max-w-xl space-y-6"
    >
      {state?.error ? (
        <p className="rounded-sm border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-300">
          {state.error}
        </p>
      ) : null}

      <div className="space-y-2">
        <label className="text-xs uppercase tracking-[0.2em] text-muted" htmlFor="name">
          Name
        </label>
        <input
          id="name"
          name="name"
          required
          defaultValue={initial?.name}
          className="w-full border border-border bg-card px-4 py-3 text-sm outline-none focus:border-accent"
        />
      </div>

      <div className="space-y-2">
        <label className="text-xs uppercase tracking-[0.2em] text-muted" htmlFor="description">
          Description
        </label>
        <textarea
          id="description"
          name="description"
          rows={5}
          defaultValue={initial?.description}
          className="w-full border border-border bg-card px-4 py-3 text-sm outline-none focus:border-accent"
        />
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <div className="space-y-2">
          <label className="text-xs uppercase tracking-[0.2em] text-muted" htmlFor="price">
            Price (USD)
          </label>
          <input
            id="price"
            name="price"
            type="text"
            inputMode="decimal"
            required
            placeholder="120.00"
            defaultValue={initial?.price}
            className="w-full border border-border bg-card px-4 py-3 text-sm outline-none focus:border-accent"
          />
        </div>
        <div className="space-y-2">
          <label className="text-xs uppercase tracking-[0.2em] text-muted" htmlFor="stock">
            Stock
          </label>
          <input
            id="stock"
            name="stock"
            type="number"
            min={0}
            required
            defaultValue={initial?.stock ?? 0}
            className="w-full border border-border bg-card px-4 py-3 text-sm outline-none focus:border-accent"
          />
        </div>
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <div className="space-y-2">
          <label className="text-xs uppercase tracking-[0.2em] text-muted" htmlFor="sortOrder">
            Sort order
          </label>
          <input
            id="sortOrder"
            name="sortOrder"
            type="number"
            min={0}
            defaultValue={initial?.sortOrder ?? 0}
            className="w-full border border-border bg-card px-4 py-3 text-sm outline-none focus:border-accent"
          />
        </div>
        <div className="flex items-end pb-2">
          <label className="flex cursor-pointer items-center gap-3 text-sm">
            <input
              name="published"
              type="checkbox"
              defaultChecked={initial?.published ?? true}
              className="h-4 w-4 accent-accent"
            />
            Published on storefront
          </label>
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-xs uppercase tracking-[0.2em] text-muted" htmlFor="imagesJson">
          Images (JSON)
        </label>
        <textarea
          id="imagesJson"
          name="imagesJson"
          rows={6}
          defaultValue={defaultImages}
          className="w-full border border-border bg-card px-4 py-3 font-mono text-xs leading-relaxed outline-none focus:border-accent"
        />
        <p className="text-xs text-muted">
          Array of objects with public image URLs. Example:{" "}
          <code className="text-foreground/80">[&#123;&quot;url&quot;:&quot;https://…&quot;&#125;]</code>
        </p>
      </div>

      <button
        type="submit"
        className="w-full rounded-full bg-foreground py-3 text-xs font-medium uppercase tracking-[0.2em] text-background"
      >
        <SubmitLabel label={mode.type === "create" ? "Create piece" : "Save changes"} />
      </button>
    </motion.form>
  );
}
