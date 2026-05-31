"use client";

import { useEffect, useRef } from "react";

const VIDEO_720 = "/p-shop-animation-720.mp4";
const VIDEO_1080 = "/p-shop-animation-1080.mp4";
const WEBM_ALPHA = "/p-shop-animation-alpha.webm";

function pickMp4Src(): string {
  if (typeof window === "undefined") return VIDEO_720;
  return window.matchMedia("(max-width: 768px)").matches ? VIDEO_720 : VIDEO_1080;
}

function canPlayAlphaWebm(): boolean {
  if (typeof document === "undefined") return false;
  const v = document.createElement("video");
  return v.canPlayType('video/webm; codecs="vp09.00.10.08"') !== "";
}

/** Navy (#02183d) + black keyed out so only the IW mark shows on white. */
function keyAlpha(r: number, g: number, b: number): number {
  const lum = Math.max(r, g, b);
  if (lum < 48) return 0;
  if (lum < 110 && b > r + 6 && b > g + 4 && r < 55) return 0;
  if (lum < 72 && r < 30 && g < 50 && b < 90) return 0;
  if (lum < 95) {
    const keyness = 1 - lum / 95;
    if (b > r && b > g && keyness > 0.35) return Math.round(255 * (1 - keyness));
  }
  return 255;
}

type Props = {
  storeName: string;
  className?: string;
};

export function GateLogoAnimation({ storeName, className }: Props) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const useWebmRef = useRef(false);

  useEffect(() => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    const wrap = wrapRef.current;
    if (!video || !canvas || !wrap) return;

    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    useWebmRef.current = canPlayAlphaWebm();
    video.src = useWebmRef.current ? WEBM_ALPHA : pickMp4Src();
    video.load();

    let raf = 0;
    let running = true;

    const dpr = () => Math.min(window.devicePixelRatio || 1, 2);

    const layout = () => {
      if (!video.videoWidth) return;
      const cssW = wrap.clientWidth || video.videoWidth;
      const cssH = (cssW / video.videoWidth) * video.videoHeight;
      const scale = dpr();
      canvas.width = Math.round(cssW * scale);
      canvas.height = Math.round(cssH * scale);
      canvas.style.width = `${cssW}px`;
      canvas.style.height = `${cssH}px`;
    };

    const paint = () => {
      if (!running) return;
      const scale = dpr();
      const cssW = canvas.width / scale;
      const cssH = canvas.height / scale;

      if (video.readyState >= 2 && cssW > 0 && cssH > 0) {
        ctx.setTransform(scale, 0, 0, scale, 0, 0);
        ctx.clearRect(0, 0, cssW, cssH);
        ctx.drawImage(video, 0, 0, cssW, cssH);

        if (!useWebmRef.current) {
          const frame = ctx.getImageData(0, 0, canvas.width, canvas.height);
          const d = frame.data;
          for (let i = 0; i < d.length; i += 4) {
            d[i + 3] = keyAlpha(d[i], d[i + 1], d[i + 2]);
          }
          ctx.putImageData(frame, 0, 0);
        }
      }

      raf = requestAnimationFrame(paint);
    };

    const onMeta = () => layout();
    const onResize = () => layout();

    video.addEventListener("loadedmetadata", onMeta);
    window.addEventListener("resize", onResize);
    void video.play().catch(() => {});
    paint();

    return () => {
      running = false;
      cancelAnimationFrame(raf);
      video.removeEventListener("loadedmetadata", onMeta);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return (
    <div ref={wrapRef} className={className}>
      <video
        ref={videoRef}
        className="gate-logo-animation__source"
        muted
        loop
        playsInline
        preload="auto"
        aria-hidden
      />
      <canvas
        ref={canvasRef}
        className="gate-logo-animation__canvas"
        role="img"
        aria-label={`${storeName} logo animation`}
      />
    </div>
  );
}
