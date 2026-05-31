"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useActionState, useEffect, useId, useRef } from "react";
import { useFormStatus } from "react-dom";
import { loginDrop } from "@/app/actions/auth";
import { GateLogoAnimation } from "@/components/gate-logo-animation";
import { StoreLogo } from "@/components/store-chrome";
import { useVisualViewport } from "@/hooks/use-visual-viewport";

type Props = {
  nextPath: string;
  hasSession: boolean;
  storeName: string;
  passwordHint?: string;
};

function SubmitLabel() {
  const { pending } = useFormStatus();
  return pending ? "…" : "Enter";
}

export function HomeLanding({ nextPath, hasSession, storeName, passwordHint }: Props) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const inputId = useId();
  const [state, formAction] = useActionState(loginDrop, null);
  const { keyboardInset } = useVisualViewport();

  useEffect(() => {
    if (state?.ok) {
      router.replace(nextPath);
      router.refresh();
    }
  }, [state, nextPath, router]);

  return (
    <div
      className="gate-splash flex min-h-dvh flex-col bg-white text-black"
      style={{ paddingBottom: keyboardInset > 0 ? keyboardInset : undefined }}
    >
      <header className="flex shrink-0 items-center justify-end px-4 pb-0 pt-[max(0.75rem,env(safe-area-inset-top))] sm:px-6">
        <Link
          href="/admin/login"
          className="text-[11px] font-semibold uppercase tracking-[0.2em] text-black/40 transition hover:text-black"
        >
          Admin
        </Link>
      </header>

      <main className="flex min-h-0 flex-1 flex-col items-center justify-center px-4 pb-[max(1.5rem,env(safe-area-inset-bottom))] pt-2">
        <GateLogoAnimation storeName={storeName} className="gate-hero-logo" />

        <div className="mt-6 flex w-full max-w-[16rem] flex-col items-center sm:mt-8">
          <StoreLogo className="h-7 w-auto sm:h-8" />

          {hasSession ? (
            <Link
              href={nextPath}
              className="mt-7 text-sm font-medium uppercase tracking-[0.35em] text-black transition hover:opacity-55"
            >
              Enter shop
            </Link>
          ) : (
            <form
              action={formAction}
              className="mt-7 flex w-full flex-col items-center gap-4"
            >
              <input type="hidden" name="next" value={nextPath} />

              <div className="w-full">
                <label htmlFor={inputId} className="sr-only">
                  Password
                </label>
                <input
                  ref={inputRef}
                  id={inputId}
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  enterKeyHint="go"
                  required
                  placeholder="Password"
                  onFocus={() => {
                    window.setTimeout(() => {
                      inputRef.current?.scrollIntoView({ block: "nearest", behavior: "smooth" });
                    }, 280);
                  }}
                  className="w-full border-0 border-b border-black/25 bg-transparent py-2 text-center font-[family-name:var(--font-display)] text-base text-black outline-none placeholder:text-black/30 focus:border-black"
                />
              </div>

              <button
                type="submit"
                className="font-[family-name:var(--font-display)] text-sm uppercase tracking-[0.35em] text-black transition hover:opacity-55 disabled:opacity-35"
              >
                <SubmitLabel />
              </button>

              {passwordHint ? (
                <p className="text-[10px] uppercase tracking-[0.22em] text-black/35">
                  Dev: {passwordHint}
                </p>
              ) : null}

              {state?.error ? (
                <p className="text-center text-sm text-red-600" role="alert">
                  {state.error}
                </p>
              ) : null}
            </form>
          )}
        </div>
      </main>
    </div>
  );
}
