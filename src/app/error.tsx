"use client";

import { DbUnavailableNotice } from "@/components/db-unavailable";

function isDatabaseError(error: Error) {
  const msg = error.message;
  return (
    msg.includes("Can't reach database") ||
    msg.includes("P1001") ||
    msg.includes("PrismaClientInitializationError")
  );
}

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  if (isDatabaseError(error)) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center px-6 py-24">
        <DbUnavailableNotice />
        <button
          type="button"
          onClick={reset}
          className="mt-8 text-xs uppercase tracking-[0.25em] text-muted transition hover:text-foreground"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-6 py-24">
      <p className="text-sm text-red-400">Something went wrong.</p>
      <button
        type="button"
        onClick={reset}
        className="mt-6 text-xs uppercase tracking-[0.25em] text-muted underline-offset-4 hover:underline"
      >
        Try again
      </button>
    </div>
  );
}
