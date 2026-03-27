"use client";

import { motion } from "framer-motion";
import { useFormState, useFormStatus } from "react-dom";
import { updatePasswords, updateStoreSettings } from "@/app/actions/admin";

function Submit({ label }: { label: string }) {
  const { pending } = useFormStatus();
  return pending ? "Saving…" : label;
}

export function StoreSettingsForm({
  storeName,
  storeTagline,
}: {
  storeName: string;
  storeTagline: string;
}) {
  const [state, action] = useFormState(updateStoreSettings, null);

  return (
    <motion.form action={action} className="space-y-5" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      {state?.error ? (
        <p className="text-sm text-red-400" role="alert">
          {state.error}
        </p>
      ) : null}
      {state?.ok ? (
        <p className="text-sm text-emerald-400/90" role="status">
          Store details updated.
        </p>
      ) : null}
      <div className="space-y-2">
        <label className="text-xs uppercase tracking-[0.2em] text-muted" htmlFor="storeName">
          Store name
        </label>
        <input
          id="storeName"
          name="storeName"
          required
          defaultValue={storeName}
          className="w-full border border-border bg-card px-4 py-3 text-sm outline-none focus:border-accent"
        />
      </div>
      <div className="space-y-2">
        <label className="text-xs uppercase tracking-[0.2em] text-muted" htmlFor="storeTagline">
          Tagline
        </label>
        <input
          id="storeTagline"
          name="storeTagline"
          defaultValue={storeTagline}
          className="w-full border border-border bg-card px-4 py-3 text-sm outline-none focus:border-accent"
        />
      </div>
      <button
        type="submit"
        className="rounded-full border border-border px-6 py-2 text-xs uppercase tracking-[0.2em] transition hover:border-accent"
      >
        <Submit label="Update branding" />
      </button>
    </motion.form>
  );
}

export function PasswordSettingsForm() {
  const [state, action] = useFormState(updatePasswords, null);

  return (
    <motion.form action={action} className="space-y-5" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <p className="text-sm text-muted">
        Set a new storefront password (for the drop gate) and a new admin password. Minimum 8 characters
        each.
      </p>
      {state?.error ? (
        <p className="text-sm text-red-400" role="alert">
          {state.error}
        </p>
      ) : null}
      {state?.ok ? (
        <p className="text-sm text-emerald-400/90" role="status">
          Passwords updated. Share the new storefront password with your circle for the next drop.
        </p>
      ) : null}
      <div className="space-y-2">
        <label className="text-xs uppercase tracking-[0.2em] text-muted" htmlFor="storefrontPassword">
          New storefront password
        </label>
        <input
          id="storefrontPassword"
          name="storefrontPassword"
          type="password"
          autoComplete="new-password"
          required
          minLength={8}
          className="w-full border border-border bg-card px-4 py-3 text-sm outline-none focus:border-accent"
        />
      </div>
      <div className="space-y-2">
        <label className="text-xs uppercase tracking-[0.2em] text-muted" htmlFor="adminPassword">
          New admin password
        </label>
        <input
          id="adminPassword"
          name="adminPassword"
          type="password"
          autoComplete="new-password"
          required
          minLength={8}
          className="w-full border border-border bg-card px-4 py-3 text-sm outline-none focus:border-accent"
        />
      </div>
      <button
        type="submit"
        className="rounded-full bg-foreground px-6 py-2 text-xs font-medium uppercase tracking-[0.2em] text-background"
      >
        <Submit label="Update passwords" />
      </button>
    </motion.form>
  );
}
