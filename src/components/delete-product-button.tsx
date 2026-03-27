"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { deleteProduct } from "@/app/actions/admin";

export function DeleteProductButton({ productId, name }: { productId: string; name: string }) {
  const [pending, startTransition] = useTransition();
  const router = useRouter();

  return (
    <button
      type="button"
      disabled={pending}
      onClick={() => {
        if (!window.confirm(`Delete “${name}”? This cannot be undone.`)) return;
        startTransition(async () => {
          await deleteProduct(productId);
          router.refresh();
        });
      }}
      className="text-xs uppercase tracking-[0.15em] text-red-400/90 transition hover:text-red-300 disabled:opacity-50"
    >
      {pending ? "…" : "Delete"}
    </button>
  );
}
