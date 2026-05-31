"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useActionState, useEffect, useId, useRef, useState } from "react";
import { useFormStatus } from "react-dom";
import { loginDrop } from "@/app/actions/auth";
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
  return pending ? "Checking…" : "Enter";
}

function pickVideoSrc(): string {
  if (typeof window === "undefined") return VIDEO_720;
  const coarse = window.matchMedia("(pointer: coarse)").matches;
  const narrow = window.matchMedia("(max-width: 768px)").matches;
  const lowMem = navigator.deviceMemory != null && navigator.deviceMemory <= 4;
  if (coarse || narrow || lowMem) return VIDEO_720;
  return VIDEO_1080;
}

function GateForm({
  nextPath,
  passwordHint,
  state,
  formAction,
}: {
  nextPath: string;
  passwordHint?: string;
  state: { error?: string; ok?: true } | null;
  formAction: (payload: FormData) => void;
}) {
  const inputId = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const { keyboardInset, keyboardOpen } = useVisualViewport();

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 768px)");
    const apply = () => setIsMobile(mq.matches);
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, []);

  const bottomStyle = isMobile
    ? { bottom: keyboardOpen ? keyboardInset : 0 }
    : undefined;

  return (
    <div
      className="gate-dock fixed inset-x-0 z-20 flex justify-center px-4 sm:inset-0 sm:items-center sm:px-6"
      style={bottomStyle}
      data-keyboard={keyboardOpen ? "open" : "closed"}
    >
      <div
        className={`gate-panel w-full max-w-[22rem] sm:max-w-[14rem] ${
          keyboardOpen ? "gate-panel--focused" : ""
        }`}
      >
        <form action={formAction} className="flex flex-col gap-4 sm:gap-5">
          <input type="hidden" name="next" value={nextPath} />

          <div className="space-y-2 text-center sm:space-y-2">
            <label
              htmlFor={inputId}
              className="block text-[11px] uppercase tracking-[0.32em] text-white/55 sm:sr-only"
            >
              Drop password
            </label>

            <div className="relative">
              <input
                ref={inputRef}
                id={inputId}
                name="password"
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                enterKeyHint="go"
                required
                autoFocus={!isMobile}
                placeholder="Password"
                onFocus={() => {
                  if (isMobile) {
                    window.setTimeout(() => {
                      inputRef.current?.scrollIntoView({ block: "nearest", behavior: "smooth" });
                    }, 300);
                  }
                }}
                className="gate-input w-full rounded-xl border border-white/20 bg-white/[0.08] px-4 py-3.5 text-center text-base tracking-widest text-white outline-none placeholder:text-white/35 focus:border-white/50 focus:bg-white/[0.12] sm:rounded-none sm:border-0 sm:border-b sm:border-white/35 sm:bg-transparent sm:px-0 sm:py-2 sm:text-center sm:focus:border-white/70"
              />
              {isMobile ? (
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] uppercase tracking-[0.2em] text-white/45"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              ) : null}
            </div>
          </div>

          <button
            type="submit"
            className="gate-submit min-h-[3rem] w-full rounded-full border border-white/25 bg-white text-sm font-medium uppercase tracking-[0.28em] text-black transition active:scale-[0.98] disabled:opacity-50 sm:min-h-0 sm:w-full sm:border-0 sm:bg-transparent sm:py-0 sm:text-white/85 sm:active:scale-100 sm:hover:text-white"
          >
            <SubmitLabel />
          </button>

          {passwordHint ? (
            <p className="text-center text-[10px] uppercase tracking-[0.22em] text-white/30">
              Dev: {passwordHint}
            </p>
          ) : null}

          {state?.error ? (
            <p className="text-center text-sm text-red-300/95" role="alert">
              {state.error}
            </p>
          ) : null}
        </form>
      </div>
    </div>
  );
}

export function HomeLanding({ nextPath, hasSession, storeName, passwordHint }: Props) {
  const router = useRouter();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [state, formAction] = useActionState(loginDrop, null);
  const { keyboardOpen } = useVisualViewport();

  useEffect(() => {
    if (state?.ok) {
      router.replace(nextPath);
      router.refresh();
    }
  }, [state, nextPath, router]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const applySrc = () => {
      const src = pickVideoSrc();
      if (video.dataset.src === src) return;
      video.dataset.src = src;
      video.src = src;
      video.load();
      void video.play().catch(() => {});
    };

    applySrc();
    const desktopMq = window.matchMedia("(min-width: 1024px)");
    desktopMq.addEventListener("change", applySrc);
    return () => desktopMq.removeEventListener("change", applySrc);
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle("gate-keyboard-open", keyboardOpen);
    return () => document.documentElement.classList.remove("gate-keyboard-open");
  }, [keyboardOpen]);

  return (
    <div className="gate-root fixed inset-0 overflow-hidden bg-black text-white">
      <video
        ref={videoRef}
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
        poster={POSTER}
        className={`absolute inset-0 h-full w-full object-cover object-center transition-[filter,transform] duration-300 [transform:translateZ(0)] [-webkit-backface-visibility:hidden] ${
          keyboardOpen ? "scale-[1.02] brightness-[0.55]" : "brightness-100"
        }`}
        aria-label={`${storeName} entrance animation`}
      />

      <header className="pointer-events-none absolute inset-x-0 top-0 z-30 flex justify-center px-6 pt-[max(1.5rem,env(safe-area-inset-top))] sm:pt-8">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/iveywood-logo-hd.png"
          srcSet="/iveywood-logo-sm.png 200w, /iveywood-logo-hd.png 320w"
          sizes="160px"
          alt={storeName}
          width={160}
          height={64}
          decoding="async"
          className="h-7 w-auto opacity-90 sm:h-8"
        />
      </header>

      <nav className="absolute right-4 top-[max(1.25rem,env(safe-area-inset-top))] z-30 sm:right-8 sm:top-8">
        <Link
          href="/admin/login"
          className="inline-flex min-h-11 min-w-11 items-center justify-center text-[11px] uppercase tracking-[0.28em] text-white/45 transition hover:text-white/80"
        >
          Admin
        </Link>
      </nav>

      {hasSession ? (
        <div className="gate-dock fixed inset-x-0 bottom-0 z-20 flex justify-center px-4 pb-[max(1.25rem,env(safe-area-inset-bottom))] sm:inset-0 sm:items-center sm:pb-0">
          <Link
            href={nextPath}
            className="inline-flex min-h-12 items-center justify-center text-sm uppercase tracking-[0.4em] text-white/85 transition hover:text-white"
          >
            Enter shop
          </Link>
        </div>
      ) : (
        <GateForm
          nextPath={nextPath}
          passwordHint={passwordHint}
          state={state}
          formAction={formAction}
        />
      )}
    </div>
  );
}
