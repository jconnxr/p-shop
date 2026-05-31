import { NextResponse } from "next/server";
import Stripe from "stripe";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

export async function POST(req: Request) {
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  const key = process.env.STRIPE_SECRET_KEY;
  if (!secret || !key) {
    return NextResponse.json({ error: "Not configured" }, { status: 503 });
  }

  const body = await req.text();
  const sig = req.headers.get("stripe-signature");
  if (!sig) {
    return NextResponse.json({ error: "Missing signature" }, { status: 400 });
  }

  const stripe = new Stripe(key);
  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, sig, secret);
  } catch {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const productId = session.metadata?.productId;
    const qtyRaw = session.metadata?.quantity;
    const qty = qtyRaw ? Number.parseInt(qtyRaw, 10) : 1;
    if (productId && session.payment_status === "paid") {
      const dup = await prisma.order.findUnique({
        where: { stripeSessionId: session.id },
      });
      if (!dup) {
        const product = await prisma.product.findUnique({ where: { id: productId } });
        if (product) {
          const q = Number.isFinite(qty) ? qty : 1;
          const newStock = Math.max(0, product.stock - q);
          await prisma.$transaction([
            prisma.product.update({
              where: { id: product.id },
              data: { stock: newStock },
            }),
            prisma.order.create({
              data: {
                stripeSessionId: session.id,
                email: session.customer_details?.email ?? session.customer_email ?? null,
                status: "paid",
                totalCents: session.amount_total ?? product.priceCents * q,
                lineItemsJson: JSON.stringify([
                  {
                    productId: product.id,
                    name: product.name,
                    quantity: q,
                    unitAmount: product.priceCents,
                  },
                ]),
              },
            }),
          ]);
        }
      }
    }
  }

  return NextResponse.json({ received: true });
}
