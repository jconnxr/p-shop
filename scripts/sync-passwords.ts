/**
 * Sync storefront + admin password hashes in Postgres to match .env / defaults.
 * Run: npx tsx scripts/sync-passwords.ts
 */
import bcrypt from "bcryptjs";
import { PrismaClient } from "@prisma/client";

const drop =
  process.env.DROP_PASSWORD?.trim().replace(/^["']|["']$/g, "") || "test101";
const admin =
  process.env.ADMIN_PASSWORD?.trim().replace(/^["']|["']$/g, "") || "admin";

const prisma = new PrismaClient();

async function main() {
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
      storefrontPasswordHash: await bcrypt.hash(drop, 12),
      adminPasswordHash: await bcrypt.hash(admin, 12),
    },
  });
  console.log("Passwords synced. Storefront:", drop, "| Admin:", admin);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
