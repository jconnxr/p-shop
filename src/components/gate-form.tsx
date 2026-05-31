"use client";

import { motion } from "framer-motion";
import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { loginDrop } from "@/app/actions/auth";

function SubmitLabel() {
  const { pending } = useFormStatus();
  return pending ? "Checking…" : "Enter";
}

export function GateForm({
  nextPath,
  variant = "default",
}: {
  nextPath: string;
  variant?: "default" | "overlay" | "minimal";
}) {
  const [state, formAction] = useActionState(loginDrop, null);
  const overlay = variant === "overlay";
  const minimal = variant === "minimal";

  return (
    <motion.form
      action={formAction}
      initial={{ opacity: 0, y: minimal ? 6 : 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: minimal ? 0 : 0.15 }}
      className={minimal ? "w-full space-y-2" : "w-full space-y-5"}
    >
      <input type="hidden" name="next" value={nextPath} />
      <div className={minimal ? "flex flex-col gap-2 sm:flex-row sm:items-end" : "space-y-2"}>
        <div className={minimal ? "min-w-0 flex-1 space-y-1.5" : "space-y-2"}>
          <label
            htmlFor="password"
            className={
              minimal
                ? "text-[10px] uppercase tracking-[0.22em] text-foreground/45"
                : overlay
                  ? "text-xs uppercase tracking-[0.25em] text-foreground/60"
                  : "text-xs uppercase tracking-[0.25em] text-muted"
            }
          >
            Drop password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            autoComplete="current-password"
            required
            className={
              minimal
                ? "w-full border border-foreground/15 bg-foreground/[0.04] px-3 py-2.5 text-sm text-foreground backdrop-blur-sm outline-none transition placeholder:text-foreground/25 focus:border-foreground/30 focus:bg-foreground/[0.07]"
                : overlay
                  ? "w-full border border-foreground/20 bg-foreground/5 px-4 py-3 text-foreground backdrop-blur-md outline-none transition placeholder:text-foreground/30 focus:border-foreground/45 focus:bg-foreground/10"
                  : "w-full rounded-none border border-border bg-card px-4 py-3 text-foreground outline-none ring-0 transition focus:border-accent"
            }
            placeholder="••••••••"
          />
        </div>
        <motion.button
          type="submit"
          whileHover={{ scale: minimal ? 1.01 : 1.02 }}
          whileTap={{ scale: minimal ? 0.99 : 0.98 }}
          className={
            minimal
              ? "shrink-0 rounded-full border border-foreground/20 bg-foreground/85 px-6 py-2.5 text-[11px] font-medium uppercase tracking-[0.18em] text-background transition hover:bg-foreground disabled:opacity-50 sm:mb-0.5"
              : overlay
                ? "w-full rounded-full border border-foreground/25 bg-foreground/90 py-4 text-sm font-medium uppercase tracking-[0.2em] text-background backdrop-blur-sm transition hover:bg-foreground disabled:opacity-50"
                : "w-full rounded-full bg-foreground py-4 text-sm font-medium uppercase tracking-[0.2em] text-background disabled:opacity-50"
          }
        >
          <SubmitLabel />
        </motion.button>
      </div>
      {state?.error ? (
        <p
          className={`text-red-400/90 ${minimal ? "text-xs" : "text-center text-sm"}`}
          role="alert"
        >
          {state.error}
        </p>
      ) : null}
    </motion.form>
  );
}
