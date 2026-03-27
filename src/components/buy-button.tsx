"use client";

import { motion } from "framer-motion";
import { useState } from "react";

type Props = {
  productId: string;
  disabled?: boolean;
  stripeReady: boolean;
};

export function BuyButton({ productId, disabled, stripeReady }: Props) {
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  async function checkout() {
    setLoading(true);
    setErr(null);
    try {
      const r = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId, quantity: 1 }),
      });
      const data = (await r.json()) as { error?: string; url?: string };
      if (!r.ok) throw new Error(data.error ?? "Checkout failed");
      if (data.url) window.location.href = data.url;
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  if (!stripeReady) {
    return (
      <p className="text-sm text-muted">
        Online checkout is not configured yet. Add Stripe keys to enable purchases.
      </p>
    );
  }

  return (
    <div className="space-y-3">
      <motion.button
        type="button"
        whileHover={{ scale: disabled ? 1 : 1.02 }}
        whileTap={{ scale: disabled ? 1 : 0.98 }}
        onClick={() => void checkout()}
        disabled={disabled || loading}
        className="w-full rounded-full bg-foreground px-8 py-4 text-sm font-medium uppercase tracking-[0.2em] text-background transition-opacity disabled:cursor-not-allowed disabled:opacity-40"
      >
        {loading ? "Redirecting…" : disabled ? "Sold out" : "Purchase"}
      </motion.button>
      {err ? <p className="text-center text-sm text-red-400">{err}</p> : null}
    </div>
  );
}
