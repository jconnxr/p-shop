import { notFound } from "next/navigation";
import { ProductEditorForm } from "@/components/product-editor-form";
import { prisma } from "@/lib/prisma";
import { parseImages } from "@/lib/products";

type Props = { params: Promise<{ id: string }> };

export default async function EditProductPage({ params }: Props) {
  const { id } = await params;
  const product = await prisma.product.findUnique({ where: { id } });
  if (!product) notFound();

  const images = parseImages(product.images);

  return (
    <div className="space-y-10">
      <div>
        <h1 className="font-[family-name:var(--font-display)] text-3xl">Edit piece</h1>
        <p className="mt-2 font-mono text-xs text-muted">/{product.slug}</p>
      </div>
      <ProductEditorForm
        mode={{ type: "edit", productId: product.id }}
        initial={{
          name: product.name,
          description: product.description,
          price: (product.priceCents / 100).toFixed(2),
          stock: product.stock,
          sortOrder: product.sortOrder,
          published: product.published,
          images,
        }}
      />
    </div>
  );
}
