"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useActionState, useEffect, useRef } from "react";
import { useFormStatus } from "react-dom";
import { loginDrop } from "@/app/actions/auth";

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
  const coarse = window.matchMedia("(pointer: coarse)").matches;
  const narrow = window.matchMedia("(max-width: 768px)").matches;
  const lowMem = navigator.deviceMemory != null && navigator.deviceMemory <= 4;
  if (coarse || narrow || lowMem) return VIDEO_720;
  return VIDEO_1080;
}

export function HomeLanding({ nextPath, hasSession, storeName, passwordHint }: Props) {
  const router = useRouter();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [state, formAction] = useActionState(loginDrop, null);

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

  return (
    <div className="fixed inset-0 overflow-hidden bg-black text-white">
      <video
        ref={videoRef}
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
        poster={POSTER}
        className="absolute inset-0 h-full w-full object-cover object-center [transform:translateZ(0)] [-webkit-backface-visibility:hidden]"
        aria-label={`${storeName} entrance animation`}
      />

      <header className="pointer-events-none absolute inset-x-0 top-0 z-30 flex justify-center px-6 pt-6 sm:pt-8">
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

      <nav className="absolute right-6 top-6 z-30 flex gap-6 text-[11px] uppercase tracking-[0.28em] text-white/45 sm:right-8 sm:top-8">
        <Link href="/admin/login" className="transition hover:text-white/80">
          Admin
        </Link>
      </nav>

      <div className="absolute inset-0 z-20 flex items-center justify-center px-6">
        {hasSession ? (
          <div className="flex flex-col items-center gap-6">
            <Link
              href={nextPath}
              className="text-sm uppercase tracking-[0.4em] text-white/85 transition hover:text-white"
            >
              Enter shop
            </Link>
          </div>
        ) : (
          <form
            action={formAction}
            className="flex w-[min(100%,14rem)] flex-col items-center gap-5"
          >
            <input type="hidden" name="next" value={nextPath} />

            <label htmlFor="drop-password" className="sr-only">
              Password
            </label>
            <input
              id="drop-password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              autoFocus
              placeholder="Password"
              className="w-full border-0 border-b border-white/35 bg-transparent py-2 text-center text-sm tracking-widest text-white outline-none placeholder:text-white/35 focus:border-white/70"
            />
            <button
              type="submit"
              className="text-sm uppercase tracking-[0.4em] text-white/85 transition hover:text-white disabled:opacity-40"
            >
              <SubmitLabel />
            </button>
            {passwordHint ? (
              <p className="text-[10px] uppercase tracking-[0.25em] text-white/30">Dev: {passwordHint}</p>
            ) : null}

            {state?.error ? (
              <p className="max-w-xs text-center text-xs text-red-300/90" role="alert">
                {state.error}
              </p>
            ) : null}
          </form>
        )}
      </div>
    </div>
  );
}
