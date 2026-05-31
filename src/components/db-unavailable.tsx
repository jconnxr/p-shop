export function DbUnavailableNotice() {
  return (
    <div
      role="alert"
      className="rounded-sm border border-amber-400/30 bg-amber-950/40 px-4 py-3 text-center text-sm leading-relaxed text-amber-100/90 backdrop-blur-md"
    >
      <p className="font-medium">Database not connected</p>
      <p className="mt-2 text-xs text-amber-100/70">
        Start Postgres with <code className="text-foreground/90">docker compose up -d</code>, then run{" "}
        <code className="text-foreground/90">npm run db:migrate</code> and{" "}
        <code className="text-foreground/90">npm run db:seed</code>.
      </p>
    </div>
  );
}
