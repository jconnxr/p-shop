import type { Metadata } from "next";
import { cookies } from "next/headers";
import { HomeLanding } from "@/components/home-landing";
import { verifySessionToken } from "@/lib/auth";
import { envDropPassword } from "@/lib/drop-password";

export const metadata: Metadata = {
  title: "Iveywood — Private drop",
};

export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  const sp = await searchParams;
  const c = await cookies();
  const token = c.get("drop_session")?.value;
  const hasSession = await verifySessionToken(token, "drop");
  const nextPath = sp.next && sp.next.startsWith("/") ? sp.next : "/shop";
  const passwordHint =
    process.env.NODE_ENV === "development" ? envDropPassword() : undefined;

  return (
    <HomeLanding
      nextPath={nextPath}
      hasSession={hasSession}
      storeName="Iveywood"
      passwordHint={passwordHint}
    />
  );
}
