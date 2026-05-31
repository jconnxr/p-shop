import { NextResponse } from "next/server";
import Stripe from "stripe";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { parseImages } from "@/lib/products";

const bodySchema = z.object({
  productId: z.string().min(1),
  quantity: z.number().int().min(1).max(10).optional(),
});

export async function POST(req: Request) {
  const secret = process.env.STRIPE_SECRET_KEY;
  const appUrl = process.env.NEXT_PUBLIC_APP_URL;
  if (!secret || !appUrl) {
    return NextResponse.json(
      { error: "Payments are not configured. Add Stripe keys in the environment." },
      { status: 503 },
    );
  }

  let json: unknown;
  try {
    json = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = bodySchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const quantity = parsed.data.quantity ?? 1;
  const product = await prisma.product.findFirst({
    where: { id: parsed.data.productId, published: true },
  });
  if (!product) {
    return NextResponse.json({ error: "Product not available" }, { status: 404 });
  }
  if (product.stock < quantity) {
    return NextResponse.json({ error: "Not enough stock" }, { status: 400 });
  }

  const images = parseImages(product.images);
  const base = appUrl.replace(/\/$/, "");
  const stripeImage = (() => {
    const u = images[0]?.url;
    if (!u) return undefined;
    if (/^https?:\/\//i.test(u)) return u;
    if (u.startsWith("/")) return `${base}${u}`;
    return u;
  })();
  const stripe = new Stripe(secret);
  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    line_items: [
      {
        quantity,
        price_data: {
          currency: "usd",
          unit_amount: product.priceCents,
          product_data: {
            name: product.name,
            description: product.description.slice(0, 500) || undefined,
            images: stripeImage ? [stripeImage] : undefined,
          },
        },
      },
    ],
    success_url: `${appUrl}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${appUrl}/product/${product.slug}`,
    metadata: {
      productId: product.id,
      quantity: String(quantity),
    },
  });

  if (!session.url) {
    return NextResponse.json({ error: "Could not start checkout" }, { status: 500 });
  }

  return NextResponse.json({ url: session.url });
}
