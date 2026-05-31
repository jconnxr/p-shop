import Link from "next/link";

type Props = { searchParams: Promise<{ session_id?: string }> };

export default async function CheckoutSuccessPage({ searchParams }: Props) {
  const sp = await searchParams;
  const id = sp.session_id;

  return (
    <div className="mx-auto flex min-h-screen max-w-lg flex-col items-center justify-center px-6 py-24 text-center">
      <p className="text-xs uppercase tracking-[0.35em] text-muted">Thank you</p>
      <h1 className="mt-4 font-[family-name:var(--font-display)] text-4xl">Order received</h1>
      <p className="mt-6 text-sm leading-relaxed text-muted">
        Payment confirmed. You will receive a receipt from Stripe if email was provided at checkout.
      </p>
      {id ? (
        <p className="mt-4 font-mono text-xs text-muted/80">
          Reference: <span className="text-foreground/80">{id.slice(0, 24)}…</span>
        </p>
      ) : null}
      <Link
        href="/shop"
        className="mt-12 inline-flex rounded-full border border-border px-8 py-3 text-xs uppercase tracking-[0.2em] transition hover:border-accent hover:text-accent"
      >
        Return to shop
      </Link>
    </div>
  );
}
