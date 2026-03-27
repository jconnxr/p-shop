import { redirect } from "next/navigation";
import { ProductEditorForm } from "@/components/product-editor-form";
import { prisma } from "@/lib/prisma";
import { MAX_PRODUCTS } from "@/lib/products";

export default async function NewProductPage() {
  const count = await prisma.product.count();
  if (count >= MAX_PRODUCTS) {
    redirect("/admin/products");
  }

  return (
    <div className="space-y-10">
      <div>
        <h1 className="font-[family-name:var(--font-display)] text-3xl">New piece</h1>
        <p className="mt-2 text-sm text-muted">
          You can publish up to {MAX_PRODUCTS} items per drop.
        </p>
      </div>
      <ProductEditorForm mode={{ type: "create" }} />
    </div>
  );
}
