import { PasswordSettingsForm, StoreSettingsForm } from "@/components/settings-forms";
import { prisma } from "@/lib/prisma";

export default async function AdminSettingsPage() {
  const settings = await prisma.siteSettings.findUnique({ where: { id: 1 } });

  return (
    <div className="space-y-16">
      <div>
        <h1 className="font-[family-name:var(--font-display)] text-3xl">Settings</h1>
        <p className="mt-2 text-sm text-muted">Branding and access for drops.</p>
      </div>

      <section className="space-y-6 rounded-sm border border-border bg-card/40 p-8">
        <h2 className="text-sm uppercase tracking-[0.25em] text-muted">Branding</h2>
        <StoreSettingsForm
          storeName={settings?.storeName ?? "Studio"}
          storeTagline={settings?.storeTagline ?? ""}
        />
      </section>

      <section className="space-y-6 rounded-sm border border-border bg-card/40 p-8">
        <h2 className="text-sm uppercase tracking-[0.25em] text-muted">Passwords</h2>
        <PasswordSettingsForm />
      </section>
    </div>
  );
}
