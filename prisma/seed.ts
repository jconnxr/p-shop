import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

/** Local assets in /public/mock-drop — your product photos. */
const MOCK_TEES = [
  {
    slug: "cognitive-surplus-botanical-tee",
    name: "Cognitive Surplus — Botanical",
    description:
      "Black tee with a mint/teal vintage science illustration: trees, leaves, fungi, and textbook-style diagram lines. Inner tag: Cognitive Surplus, 100% combed ring-spun cotton.",
    priceCents: 4800,
    stock: 12,
    sortOrder: 0,
    images: [
      {
        url: "/mock-drop/cognitive-surplus.png",
        alt: "Black graphic tee with botanical science illustration",
      },
    ],
  },
  {
    slug: "crepe-vintage-street-tee",
    name: "Crêpe — Natural White",
    description:
      "Boxy natural-white tee on concrete. Big “Crêpe” type with a retro breakfast graphic—screen-print texture and soft, faded color.",
    priceCents: 5200,
    stock: 8,
    sortOrder: 1,
    images: [
      {
        url: "/mock-drop/crepe-tee.png",
        alt: "Off-white Crêpe graphic tee flat lay on concrete",
      },
    ],
  },
  {
    slug: "france-98-stadium-tee",
    name: "France ’98 — Stadium Back",
    description:
      "Washed charcoal with a hand-drawn back print: COUPE DU MONDE, abstract stadium pitch, FRANCE 98. Loud art, quiet fade.",
    priceCents: 5600,
    stock: 6,
    sortOrder: 2,
    images: [
      {
        url: "/mock-drop/france-98-stadium.png",
        alt: "Back of France 98 graphic tee",
      },
    ],
  },
  {
    slug: "cowboys-world-champions-tee",
    name: "Cowboys — World Champions ’92–’93",
    description:
      "Vintage sports graphic: DALLAS COWBOYS, silver 3D type, helmet, 92/93, WORLD CHAMPIONS. Salt-and-pepper wash on charcoal.",
    priceCents: 5400,
    stock: 9,
    sortOrder: 3,
    images: [
      {
        url: "/mock-drop/cowboys-champions.png",
        alt: "Dallas Cowboys World Champions graphic tee",
      },
    ],
  },
  {
    slug: "pep-boys-classic-tee",
    name: "The Pep Boys — Manny, Moe & Jack",
    description:
      "Classic white tee with the retro Pep Boys script and founder caricatures—navy and red, streetwear-meets-garage culture.",
    priceCents: 4400,
    stock: 15,
    sortOrder: 4,
    images: [
      {
        url: "/mock-drop/pep-boys.png",
        alt: "Vintage Pep Boys graphic t-shirt",
      },
    ],
  },
];

const LEGACY_MOCK_SLUGS = [
  "sunfade-ringer-tee",
  "tour-94-faded-print",
  "wolf-pack-thrift-find",
  "skate-archive-wash",
  "desert-heat-mineral-dye",
];

async function main() {
  const drop = process.env.SEED_DROP_PASSWORD ?? "drop2026";
  const admin = process.env.SEED_ADMIN_PASSWORD ?? "admin2026";
  await prisma.siteSettings.upsert({
    where: { id: 1 },
    create: {
      id: 1,
      storefrontPasswordHash: await bcrypt.hash(drop, 12),
      adminPasswordHash: await bcrypt.hash(admin, 12),
      storeName: "Night Market",
      storeTagline: "Vintage graphic tees · mock drop preview",
    },
    update: {
      storeName: "Night Market",
      storeTagline: "Vintage graphic tees · mock drop preview",
    },
  });

  await prisma.product.deleteMany({
    where: { slug: { in: LEGACY_MOCK_SLUGS } },
  });

  for (const item of MOCK_TEES) {
    const imagesJson = JSON.stringify(item.images);
    await prisma.product.upsert({
      where: { slug: item.slug },
      create: {
        name: item.name,
        slug: item.slug,
        description: item.description,
        priceCents: item.priceCents,
        stock: item.stock,
        published: true,
        sortOrder: item.sortOrder,
        images: imagesJson,
      },
      update: {
        name: item.name,
        description: item.description,
        priceCents: item.priceCents,
        stock: item.stock,
        published: true,
        sortOrder: item.sortOrder,
        images: imagesJson,
      },
    });
  }

  // eslint-disable-next-line no-console
  console.log("Seeded. Storefront password:", drop);
  // eslint-disable-next-line no-console
  console.log("Seeded. Admin password:", admin);
  // eslint-disable-next-line no-console
  console.log("Mock drop: 5 tees using /public/mock-drop images.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
