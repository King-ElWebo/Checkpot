import { getRawStoreSettings } from "@/lib/repositories/store-settings";
import { StoreForm } from "./store-form";

export const dynamic = "force-dynamic";

export default async function AdminStoreSettingsPage() {
  const store = await getRawStoreSettings();

  return (
    <div className="dashboard-stack">
      <section className="page-intro">
        <div className="eyebrow">Einstellungen</div>
        <h1>Geschäftsdaten & Öffnungszeiten</h1>
        <p className="text-sm text-[#78716c] mt-1">
          Verwalten Sie Kontaktdaten, Adresse und Öffnungszeiten. Diese Daten werden auf der gesamten Website (Header, Footer, Kontakt, Über uns, Impressum und Google-Suchdaten) automatisch aktualisiert.
        </p>
      </section>

      <StoreForm initialData={store} />
    </div>
  );
}
