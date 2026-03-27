"use client";

import { motion } from "framer-motion";
import { useFormState, useFormStatus } from "react-dom";
import { loginDrop } from "@/app/actions/auth";

function SubmitLabel() {
  const { pending } = useFormStatus();
  return pending ? "Checking…" : "Enter";
}

export function GateForm({ nextPath }: { nextPath: string }) {
  const [state, formAction] = useFormState(loginDrop, null);

  return (
    <motion.form
      action={formAction}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.15 }}
      className="w-full max-w-sm space-y-6"
    >
      <input type="hidden" name="next" value={nextPath} />
      <div className="space-y-2">
        <label htmlFor="password" className="text-xs uppercase tracking-[0.25em] text-muted">
          Drop password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
          className="w-full rounded-none border border-border bg-card px-4 py-3 text-foreground outline-none ring-0 transition focus:border-accent"
          placeholder="••••••••"
        />
      </div>
      {state?.error ? (
        <p className="text-center text-sm text-red-400" role="alert">
          {state.error}
        </p>
      ) : null}
      <motion.button
        type="submit"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="w-full rounded-full bg-foreground py-4 text-sm font-medium uppercase tracking-[0.2em] text-background disabled:opacity-50"
      >
        <SubmitLabel />
      </motion.button>
    </motion.form>
  );
}
