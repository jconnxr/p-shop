import { formatUsd } from "@/lib/format";
import { prisma } from "@/lib/prisma";

export default async function AdminOrdersPage() {
  const orders = await prisma.order.findMany({
    orderBy: { createdAt: "desc" },
    take: 100,
  });

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-[family-name:var(--font-display)] text-3xl">Orders</h1>
        <p className="mt-2 text-sm text-muted">Paid checkouts recorded via Stripe webhooks.</p>
      </div>

      {orders.length === 0 ? (
        <p className="text-sm text-muted">No orders yet.</p>
      ) : (
        <div className="overflow-x-auto rounded-sm border border-border">
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead className="border-b border-border bg-card/80 text-xs uppercase tracking-[0.15em] text-muted">
              <tr>
                <th className="px-4 py-3 font-medium">When</th>
                <th className="px-4 py-3 font-medium">Total</th>
                <th className="px-4 py-3 font-medium">Email</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium">Stripe session</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((o) => (
                <tr key={o.id} className="border-b border-border/80 last:border-0">
                  <td className="px-4 py-4 text-muted">
                    {o.createdAt.toLocaleString(undefined, {
                      dateStyle: "medium",
                      timeStyle: "short",
                    })}
                  </td>
                  <td className="px-4 py-4 tabular-nums">{formatUsd(o.totalCents)}</td>
                  <td className="px-4 py-4">{o.email ?? "—"}</td>
                  <td className="px-4 py-4 capitalize">{o.status}</td>
                  <td className="px-4 py-4 font-mono text-[11px] text-muted">
                    {o.stripeSessionId ?? "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
