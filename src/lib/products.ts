export const MAX_PRODUCTS = 10;

export type ProductImage = { url: string; alt?: string };

export function parseImages(raw: string): ProductImage[] {
  try {
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [];
    return parsed
      .filter((x): x is ProductImage => typeof x === "object" && x !== null && "url" in x && typeof (x as ProductImage).url === "string")
      .map((x) => ({ url: x.url, alt: x.alt }));
  } catch {
    return [];
  }
}

export function stringifyImages(images: ProductImage[]): string {
  return JSON.stringify(images);
}

export function slugify(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
