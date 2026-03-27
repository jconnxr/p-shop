"use client";

import { motion } from "framer-motion";
import { useFormState, useFormStatus } from "react-dom";
import { loginAdmin } from "@/app/actions/auth";

function SubmitLabel() {
  const { pending } = useFormStatus();
  return pending ? "Signing in…" : "Continue";
}

export function AdminLoginForm({ nextPath }: { nextPath: string }) {
  const [state, formAction] = useFormState(loginAdmin, null);

  return (
    <motion.form
      action={formAction}
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-5"
    >
      <input type="hidden" name="next" value={nextPath} />
      <div className="space-y-2">
        <label htmlFor="admin-password" className="text-xs uppercase tracking-[0.2em] text-muted">
          Password
        </label>
        <input
          id="admin-password"
          name="password"
          type="password"
          required
          className="w-full border border-border bg-card px-4 py-3 text-sm outline-none focus:border-accent"
        />
      </div>
      {state?.error ? (
        <p className="text-center text-sm text-red-400" role="alert">
          {state.error}
        </p>
      ) : null}
      <button
        type="submit"
        className="w-full rounded-full bg-foreground py-3 text-xs font-medium uppercase tracking-[0.2em] text-background"
      >
        <SubmitLabel />
      </button>
    </motion.form>
  );
}
