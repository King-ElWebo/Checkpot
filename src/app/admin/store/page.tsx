import Link from "next/link";
import { redirect } from "next/navigation";
import { getRawStoreSettings } from "@/lib/repositories/store-settings";
import { saveStoreSettingsAction } from "./actions";

export const dynamic = "force-dynamic";

export default async function AdminStoreSettingsPage() {
  const store = await getRawStoreSettings();

  async function handleSave(formData: FormData) {
    "use server";
    await saveStoreSettingsAction(formData);
    redirect("/admin/store?saved=1");
  }

  return (
    <div className="dashboard-stack">
      <section className="page-intro">
        <div className="eyebrow">Einstellungen</div>
        <h1>Geschäftsdaten & Öffnungszeiten</h1>
        <p className="text-sm text-[#78716c] mt-1">
          Verwalten Sie Kontaktdaten, Adresse und Öffnungszeiten. Diese Daten werden auf der gesamten Website (Header, Footer, Kontakt, Über uns, Impressum und Google-Suchdaten) automatisch aktualisiert.
        </p>
      </section>

      <form action={handleSave} className="flex flex-col gap-8 max-w-[840px]">
        {/* 1. Geschäft & Identität */}
        <section className="admin-panel p-6 sm:p-8 flex flex-col gap-6">
          <div>
            <h2 className="text-lg font-bold text-[#1c1917]">1. Geschäft & Inhaberin</h2>
            <p className="text-xs text-[#78716c] mt-0.5">
              Offizielle Geschäftsbezeichnung und Ansprechpartnerin.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="field-group">
              <label htmlFor="name">Geschäftsname *</label>
              <input
                type="text"
                id="name"
                name="name"
                defaultValue={store.name}
                placeholder="z.B. Checkpot Hietzing"
                required
              />
            </div>

            <div className="field-group">
              <label htmlFor="owner">Inhaberin / Name *</label>
              <input
                type="text"
                id="owner"
                name="owner"
                defaultValue={store.owner}
                placeholder="z.B. Christa Hausmair"
                required
              />
            </div>
          </div>
        </section>

        {/* 2. Adresse */}
        <section className="admin-panel p-6 sm:p-8 flex flex-col gap-6">
          <div>
            <h2 className="text-lg font-bold text-[#1c1917]">2. Standort & Adresse</h2>
            <p className="text-xs text-[#78716c] mt-0.5">
              Geschäftsadresse für Kundenbesuche und Routenplanung.
            </p>
          </div>

          <div className="field-group">
            <label htmlFor="street">Straße & Hausnummer *</label>
            <input
              type="text"
              id="street"
              name="street"
              defaultValue={store.address.street}
              placeholder="z.B. Hietzinger Hauptstraße 10-16"
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="field-group">
              <label htmlFor="postalCode">PLZ *</label>
              <input
                type="text"
                id="postalCode"
                name="postalCode"
                defaultValue={store.address.postalCode}
                placeholder="z.B. 1130"
                required
              />
            </div>

            <div className="field-group">
              <label htmlFor="city">Ort / Stadt *</label>
              <input
                type="text"
                id="city"
                name="city"
                defaultValue={store.address.city}
                placeholder="z.B. Wien"
                required
              />
            </div>

            <div className="field-group">
              <label htmlFor="country">Land *</label>
              <input
                type="text"
                id="country"
                name="country"
                defaultValue={store.address.country}
                placeholder="z.B. AT"
                required
              />
            </div>
          </div>
        </section>

        {/* 3. Kontaktwege */}
        <section className="admin-panel p-6 sm:p-8 flex flex-col gap-6">
          <div>
            <h2 className="text-lg font-bold text-[#1c1917]">3. Kontaktdaten</h2>
            <p className="text-xs text-[#78716c] mt-0.5">
              Direkte Erreichbarkeit per Telefon, WhatsApp und E-Mail.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="field-group">
              <label htmlFor="phone">Telefonnummer *</label>
              <input
                type="text"
                id="phone"
                name="phone"
                defaultValue={store.phone}
                placeholder="z.B. (01) 877 58 87"
                required
              />
            </div>

            <div className="field-group">
              <label htmlFor="whatsapp">WhatsApp-Nummer *</label>
              <input
                type="text"
                id="whatsapp"
                name="whatsapp"
                defaultValue={store.whatsapp}
                placeholder="z.B. 0676 3772514"
                required
              />
            </div>

            <div className="field-group">
              <label htmlFor="email">Öffentliche E-Mail *</label>
              <input
                type="email"
                id="email"
                name="email"
                defaultValue={store.email}
                placeholder="z.B. store@checkpot-hietzing.at"
                required
              />
            </div>
          </div>
        </section>

        {/* 4. Öffnungszeiten */}
        <section className="admin-panel p-6 sm:p-8 flex flex-col gap-6">
          <div>
            <h2 className="text-lg font-bold text-[#1c1917]">4. Reguläre Öffnungszeiten</h2>
            <p className="text-xs text-[#78716c] mt-0.5">
              Zeiten im 24h-Format (HH:MM). Wird automatisch für Schema.org Suchmaschinen formatiert.
            </p>
          </div>

          {/* Montag bis Freitag */}
          <div className="p-4 bg-[#fafaf9] border border-[#e7e5e4] rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="font-bold text-sm text-[#1c1917]">Montag bis Freitag</div>
              <div className="text-xs text-[#78716c]">Reguläre Wochentage</div>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-1.5">
                <span className="text-xs text-[#78716c]">Von:</span>
                <input
                  type="text"
                  name="weekdayOpens"
                  defaultValue={store.hours.weekday.opens}
                  placeholder="10:00"
                  className="w-20 text-center font-mono text-xs"
                  required
                />
              </div>

              <div className="flex items-center gap-1.5">
                <span className="text-xs text-[#78716c]">Bis:</span>
                <input
                  type="text"
                  name="weekdayCloses"
                  defaultValue={store.hours.weekday.closes}
                  placeholder="18:00"
                  className="w-20 text-center font-mono text-xs"
                  required
                />
              </div>

              <label className="flex items-center gap-1.5 text-xs text-[#1c1917] cursor-pointer ml-2">
                <input
                  type="checkbox"
                  name="weekdayClosed"
                  value="true"
                  defaultChecked={store.hours.weekday.closed}
                  className="w-4 h-4 rounded text-[#C01718]"
                />
                <span>Geschlossen</span>
              </label>
            </div>
          </div>

          {/* Samstag */}
          <div className="p-4 bg-[#fafaf9] border border-[#e7e5e4] rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="font-bold text-sm text-[#1c1917]">Samstag</div>
              <div className="text-xs text-[#78716c]">Wochenend-Öffnung</div>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-1.5">
                <span className="text-xs text-[#78716c]">Von:</span>
                <input
                  type="text"
                  name="saturdayOpens"
                  defaultValue={store.hours.saturday.opens}
                  placeholder="10:00"
                  className="w-20 text-center font-mono text-xs"
                  required
                />
              </div>

              <div className="flex items-center gap-1.5">
                <span className="text-xs text-[#78716c]">Bis:</span>
                <input
                  type="text"
                  name="saturdayCloses"
                  defaultValue={store.hours.saturday.closes}
                  placeholder="14:00"
                  className="w-20 text-center font-mono text-xs"
                  required
                />
              </div>

              <label className="flex items-center gap-1.5 text-xs text-[#1c1917] cursor-pointer ml-2">
                <input
                  type="checkbox"
                  name="saturdayClosed"
                  value="true"
                  defaultChecked={store.hours.saturday.closed}
                  className="w-4 h-4 rounded text-[#C01718]"
                />
                <span>Geschlossen</span>
              </label>
            </div>
          </div>
        </section>

        {/* Action Buttons */}
        <div className="flex items-center gap-3 pt-2">
          <button
            type="submit"
            className="flex-1 py-3 px-6 rounded-xl bg-[#292524] text-white font-bold hover:bg-[#44403c] transition-colors shadow-sm cursor-pointer"
          >
            Geschäftsdaten speichern
          </button>
          <Link
            href="/admin"
            className="secondary-button py-3 px-6 rounded-xl font-semibold flex items-center justify-center text-center"
          >
            Zurück zur Übersicht
          </Link>
        </div>
      </form>
    </div>
  );
}
