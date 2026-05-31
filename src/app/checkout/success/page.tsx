import Link from "next/link";
import { StoreShell } from "@/components/store-chrome";

type Props = { searchParams: Promise<{ session_id?: string }> };

export default async function CheckoutSuccessPage({ searchParams }: Props) {
  const sp = await searchParams;
  const id = sp.session_id;

  return (
    <StoreShell>
      <div className="mx-auto flex max-w-lg flex-col items-center px-6 py-24 text-center text-black">
        <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-black/45">Thank you</p>
        <h1 className="mt-4 font-[family-name:var(--font-display)] text-4xl">Order received</h1>
        <p className="mt-6 text-sm leading-relaxed text-black/60">
          Payment confirmed. You will receive a receipt from Stripe if email was provided at checkout.
        </p>
        {id ? (
          <p className="mt-4 font-mono text-xs text-black/45">
            Reference: {id.slice(0, 24)}…
          </p>
        ) : null}
        <Link
          href="/shop"
          className="mt-12 inline-flex border border-black px-8 py-3 text-[11px] font-semibold uppercase tracking-[0.2em] transition hover:bg-black hover:text-white"
        >
          Return to shop
        </Link>
      </div>
    </StoreShell>
  );
}
