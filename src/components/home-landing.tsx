"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useActionState, useEffect, useId, useRef } from "react";
import { useFormStatus } from "react-dom";
import { loginDrop } from "@/app/actions/auth";
import { StoreLogo } from "@/components/store-chrome";
import { useVisualViewport } from "@/hooks/use-visual-viewport";

const VIDEO_720 = "/p-shop-animation-720.mp4";
const VIDEO_1080 = "/p-shop-animation-1080.mp4";
const POSTER = "/p-shop-animation-poster@2x.jpg";

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

function pickVideoSrc(): string {
  if (typeof window === "undefined") return VIDEO_720;
  const narrow = window.matchMedia("(max-width: 768px)").matches;
  return narrow ? VIDEO_720 : VIDEO_1080;
}

export function HomeLanding({ nextPath, hasSession, storeName, passwordHint }: Props) {
  const router = useRouter();
  const videoRef = useRef<HTMLVideoElement>(null);
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

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    const src = pickVideoSrc();
    video.src = src;
    video.load();
    void video.play().catch(() => {});
  }, []);

  return (
    <div
      className="gate-splash flex min-h-dvh flex-col bg-white text-black"
      style={{ paddingBottom: keyboardInset > 0 ? keyboardInset : undefined }}
    >
      <header className="flex items-center justify-between px-4 pb-2 pt-[max(1rem,env(safe-area-inset-top))] sm:px-6">
        <span className="w-12" aria-hidden />
        <Link
          href="/admin/login"
          className="text-[11px] font-semibold uppercase tracking-[0.2em] text-black/45 transition hover:text-black"
        >
          Admin
        </Link>
      </header>

      <main className="flex flex-1 flex-col items-center justify-center px-6 pb-[max(2rem,env(safe-area-inset-bottom))]">
        <div className="flex w-full max-w-[20rem] flex-col items-center sm:max-w-[24rem]">
          <div className="w-full overflow-hidden">
            <video
              ref={videoRef}
              autoPlay
              muted
              loop
              playsInline
              preload="metadata"
              poster={POSTER}
              className="mx-auto aspect-square w-full max-w-[min(100%,18rem)] object-contain"
              aria-label={`${storeName} entrance animation`}
            />
          </div>

          <div className="mt-6 w-full">
            <StoreLogo className="mx-auto h-8 w-auto sm:h-9" />
          </div>

          {hasSession ? (
            <Link
              href={nextPath}
              className="mt-8 text-sm font-medium uppercase tracking-[0.35em] text-black transition hover:opacity-55"
            >
              Enter shop
            </Link>
          ) : (
            <form
              action={formAction}
              className="mt-8 flex w-full flex-col items-center gap-5"
            >
              <input type="hidden" name="next" value={nextPath} />

              <div className="w-full max-w-[13rem]">
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
                      inputRef.current?.scrollIntoView({ block: "center", behavior: "smooth" });
                    }, 280);
                  }}
                  className="w-full border-0 border-b border-black/25 bg-transparent py-2.5 text-center font-[family-name:var(--font-display)] text-base text-black outline-none placeholder:text-black/30 focus:border-black"
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
