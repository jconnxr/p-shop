import { stringifyImages, type ProductImage } from "@/lib/products";

export type CatalogProduct = {
  id: string;
  slug: string;
  name: string;
  description: string;
  priceCents: number;
  stock: number;
  images: string;
};

const MOCK_IMAGES = (items: ProductImage[]) => stringifyImages(items);

/** Fallback catalog when Postgres is not running (local preview). */
export const MOCK_STORE = {
  storeName: "Night Market",
  storeTagline: "Vintage graphic tees · mock drop preview",
};

export const MOCK_PRODUCTS: CatalogProduct[] = [
  {
    id: "mock-cognitive-surplus",
    slug: "cognitive-surplus-botanical-tee",
    name: "Cognitive Surplus — Botanical",
    description:
      "Black tee with a mint/teal vintage science illustration: trees, leaves, fungi, and textbook-style diagram lines.",
    priceCents: 4800,
    stock: 12,
    images: MOCK_IMAGES([
      {
        url: "/mock-drop/cognitive-surplus.png",
        alt: "Black graphic tee with botanical science illustration",
      },
    ]),
  },
  {
    id: "mock-crepe",
    slug: "crepe-vintage-street-tee",
    name: "Crêpe — Natural White",
    description:
      "Boxy natural-white tee on concrete. Big “Crêpe” type with a retro breakfast graphic.",
    priceCents: 5200,
    stock: 8,
    images: MOCK_IMAGES([
      {
        url: "/mock-drop/crepe-tee.png",
        alt: "Off-white Crêpe graphic tee flat lay on concrete",
      },
    ]),
  },
  {
    id: "mock-france-98",
    slug: "france-98-stadium-tee",
    name: "France ’98 — Stadium Back",
    description:
      "Washed charcoal with a hand-drawn back print: COUPE DU MONDE, abstract stadium pitch, FRANCE 98.",
    priceCents: 5600,
    stock: 6,
    images: MOCK_IMAGES([
      {
        url: "/mock-drop/france-98-stadium.png",
        alt: "Back of France 98 graphic tee",
      },
    ]),
  },
  {
    id: "mock-cowboys",
    slug: "cowboys-world-champions-tee",
    name: "Cowboys — World Champions ’92–’93",
    description:
      "Vintage sports graphic: DALLAS COWBOYS, silver 3D type, helmet, 92/93, WORLD CHAMPIONS.",
    priceCents: 5400,
    stock: 9,
    images: MOCK_IMAGES([
      {
        url: "/mock-drop/cowboys-champions.png",
        alt: "Dallas Cowboys World Champions graphic tee",
      },
    ]),
  },
  {
    id: "mock-pep-boys",
    slug: "pep-boys-classic-tee",
    name: "The Pep Boys — Manny, Moe & Jack",
    description:
      "Classic white tee with the retro Pep Boys script and founder caricatures.",
    priceCents: 4400,
    stock: 15,
    images: MOCK_IMAGES([
      {
        url: "/mock-drop/pep-boys.png",
        alt: "Vintage Pep Boys graphic t-shirt",
      },
    ]),
  },
];

export function getMockProductBySlug(slug: string): CatalogProduct | undefined {
  return MOCK_PRODUCTS.find((p) => p.slug === slug);
}
