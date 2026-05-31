"use server";

import bcrypt from "bcryptjs";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { MAX_PRODUCTS, slugify, stringifyImages, type ProductImage } from "@/lib/products";

const imageSchema = z.object({
  url: z
    .string()
    .refine(
      (s) => /^https?:\/\//i.test(s) || s.startsWith("/"),
      "Image must be an https URL or a site path starting with /",
    ),
  alt: z.string().optional(),
});

function parsePriceToCents(formData: FormData): number | null {
  const raw = String(formData.get("price") ?? "").trim();
  const n = Number.parseFloat(raw);
  if (!Number.isFinite(n) || n < 0.01) return null;
  return Math.round(n * 100);
}

const productSchema = z.object({
  name: z.string().min(1).max(120),
  description: z.string().max(8000).optional(),
  priceCents: z.number().int().min(1),
  stock: z.coerce.number().int().min(0),
  published: z.coerce.boolean().optional(),
  sortOrder: z.coerce.number().int().min(0).max(999).optional(),
  images: z.array(imageSchema).max(8),
});

export async function updatePasswords(
  _prev: { error?: string; ok?: boolean } | null,
  formData: FormData,
) {
  const storefront = String(formData.get("storefrontPassword") ?? "").trim();
  const admin = String(formData.get("adminPassword") ?? "").trim();
  if (storefront.length < 8) return { error: "Storefront password must be at least 8 characters." };
  if (admin.length < 8) return { error: "Admin password must be at least 8 characters." };
  const storefrontPasswordHash = await bcrypt.hash(storefront, 12);
  const adminPasswordHash = await bcrypt.hash(admin, 12);
  await prisma.siteSettings.update({
    where: { id: 1 },
    data: { storefrontPasswordHash, adminPasswordHash },
  });
  revalidatePath("/admin");
  return { ok: true as const };
}

const settingsSchema = z.object({
  storeName: z.string().min(1).max(80),
  storeTagline: z.string().max(200).optional(),
});

export async function updateStoreSettings(
  _prev: { error?: string; ok?: boolean } | null,
  formData: FormData,
) {
  const parsed = settingsSchema.safeParse({
    storeName: formData.get("storeName"),
    storeTagline: formData.get("storeTagline") ?? "",
  });
  if (!parsed.success) return { error: parsed.error.flatten().formErrors.join(" ") };
  await prisma.siteSettings.update({
    where: { id: 1 },
    data: parsed.data,
  });
  revalidatePath("/");
  revalidatePath("/shop");
  revalidatePath("/admin");
  return { ok: true as const };
}

export async function createProduct(
  _prev: { error?: string } | null,
  formData: FormData,
) {
  const count = await prisma.product.count();
  if (count >= MAX_PRODUCTS) {
    return { error: `You can list at most ${MAX_PRODUCTS} items. Archive one to add another.` };
  }
  const rawImages = String(formData.get("imagesJson") ?? "[]");
  let images: ProductImage[];
  try {
    images = z.array(imageSchema).parse(JSON.parse(rawImages));
  } catch {
    return { error: "Invalid images JSON." };
  }
  const priceCents = parsePriceToCents(formData);
  if (priceCents === null) return { error: "Enter a valid price (USD)." };
  const parsed = productSchema.safeParse({
    name: formData.get("name"),
    description: formData.get("description") ?? "",
    priceCents,
    stock: formData.get("stock"),
    published: formData.get("published") === "on" || formData.get("published") === "true",
    sortOrder: formData.get("sortOrder") ?? 0,
    images,
  });
  if (!parsed.success) return { error: parsed.error.flatten().formErrors.join(" ") };
  const base = slugify(parsed.data.name);
  let slug = base;
  let n = 0;
  while (await prisma.product.findUnique({ where: { slug } })) {
    n += 1;
    slug = `${base}-${n}`;
  }
  await prisma.product.create({
    data: {
      name: parsed.data.name,
      slug,
      description: parsed.data.description ?? "",
      priceCents: parsed.data.priceCents,
      stock: parsed.data.stock,
      published: parsed.data.published ?? true,
      sortOrder: parsed.data.sortOrder ?? 0,
      images: stringifyImages(parsed.data.images),
    },
  });
  revalidatePath("/shop");
  revalidatePath("/admin/products");
  redirect("/admin/products");
}

export async function updateProduct(
  id: string,
  _prev: { error?: string } | null,
  formData: FormData,
) {
  const rawImages = String(formData.get("imagesJson") ?? "[]");
  let images: ProductImage[];
  try {
    images = z.array(imageSchema).parse(JSON.parse(rawImages));
  } catch {
    return { error: "Invalid images JSON." };
  }
  const priceCents = parsePriceToCents(formData);
  if (priceCents === null) return { error: "Enter a valid price (USD)." };
  const parsed = productSchema.safeParse({
    name: formData.get("name"),
    description: formData.get("description") ?? "",
    priceCents,
    stock: formData.get("stock"),
    published: formData.get("published") === "on" || formData.get("published") === "true",
    sortOrder: formData.get("sortOrder") ?? 0,
    images,
  });
  if (!parsed.success) return { error: parsed.error.flatten().formErrors.join(" ") };
  const existing = await prisma.product.findUnique({ where: { id } });
  if (!existing) return { error: "Product not found." };
  let slug = existing.slug;
  if (parsed.data.name !== existing.name) {
    const base = slugify(parsed.data.name);
    slug = base;
    let n = 0;
    while (true) {
      const clash = await prisma.product.findFirst({ where: { slug, NOT: { id } } });
      if (!clash) break;
      n += 1;
      slug = `${base}-${n}`;
    }
  }
  await prisma.product.update({
    where: { id },
    data: {
      name: parsed.data.name,
      slug,
      description: parsed.data.description ?? "",
      priceCents: parsed.data.priceCents,
      stock: parsed.data.stock,
      published: parsed.data.published ?? true,
      sortOrder: parsed.data.sortOrder ?? 0,
      images: stringifyImages(parsed.data.images),
    },
  });
  revalidatePath("/shop");
  revalidatePath(`/product/${slug}`);
  revalidatePath("/admin/products");
  redirect("/admin/products");
}

export async function deleteProduct(id: string) {
  const p = await prisma.product.findUnique({ where: { id } });
  if (!p) return { error: "Not found." };
  await prisma.product.delete({ where: { id } });
  revalidatePath("/shop");
  revalidatePath("/admin/products");
  return { ok: true as const };
}
