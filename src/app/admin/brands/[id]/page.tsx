import Link from "next/link";
import { redirect } from "next/navigation";
import { getDatabase } from "@/db";
import { brands } from "@/db/schema";
import { eq } from "drizzle-orm";
import { saveBrandAction } from "../actions";
import { listAllMediaForAdmin } from "@/lib/repositories/media";
import { MediaPicker } from "@/components/admin/media-picker";

export const dynamic = "force-dynamic";

export default async function BrandEditPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const isNew = id === "new";

  const database = getDatabase();

  const brand = !isNew
    ? (await database.query.brands.findFirst({
        where: eq(brands.id, id),
        with: {
          logo: true,
          image: true,
        },
      })) ?? null
    : null;

  if (!isNew && !brand) {
    redirect("/admin/brands");
  }

  const allMedia = await listAllMediaForAdmin();

  async function handleSave(formData: FormData) {
    "use server";
    await saveBrandAction(isNew ? null : id, formData);
    redirect("/admin/brands");
  }

  return (
    <div className="dashboard-stack">
      <section className="page-intro">
        <div className="eyebrow">Marken</div>
        <h1>{isNew ? "Neue Marke anlegen" : `Marke: ${brand?.name || "Bearbeiten"}`}</h1>
        <p className="text-xs text-[#78716c] mt-1">
          Pflegen Sie Markennamen, Bildmaterial, Beschreibungen und verifizierte Produktfakten.
        </p>
      </section>

      <form action={handleSave} className="flex flex-col gap-8 max-w-[880px]">
        {/* Card 1: Basis & Identität */}
        <section className="admin-panel p-6 sm:p-8 flex flex-col gap-6">
          <div>
            <h2 className="text-lg font-bold text-[#1c1917]">1. Markenidentität</h2>
            <p className="text-xs text-[#78716c] mt-0.5">
              Grundlegende Daten und URL-Struktur für die Marke.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 items-start">
            <div className="field-group">
              <label htmlFor="name">Markenname *</label>
              <input
                type="text"
                id="name"
                name="name"
                defaultValue={brand?.name || ""}
                placeholder="z.B. King Louie"
                required
              />
            </div>

            <div className="field-group">
              <label htmlFor="slug">Slug (URL-Pfad) *</label>
              <input
                type="text"
                id="slug"
                name="slug"
                defaultValue={brand?.slug || ""}
                placeholder="z.B. king-louie"
                required
              />
              <p className="text-[11px] text-[#b45309] mt-0.5 font-medium leading-tight">
                ⚠️ Änderungen am Slug verändern die öffentliche Marken-URL.
              </p>
            </div>
          </div>
        </section>

        {/* Card 2: Bilder & Medien */}
        <section className="admin-panel p-6 sm:p-8 flex flex-col gap-6">
          <div>
            <h2 className="text-lg font-bold text-[#1c1917]">2. Marken-Bilder</h2>
            <p className="text-xs text-[#78716c] mt-0.5">
              Logo (für Bookshelf & Übersichten) und Titelbild (für die Markendetailseite).
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
            {/* Logo Picker */}
            <MediaPicker
              name="logoMediaId"
              label="Markenlogo"
              initialMediaId={brand?.logoMediaId}
              initialMedia={brand?.logo}
              allMedia={allMedia}
              aspect="logo"
              helpText="Empfohlen: Freigestelltes PNG mit transparentem Hintergrund"
            />

            {/* Title Image Picker */}
            <MediaPicker
              name="imageMediaId"
              label="Titelbild / Kampagnenbild"
              initialMediaId={brand?.imageMediaId}
              initialMedia={brand?.image}
              allMedia={allMedia}
              aspect="photo"
              helpText="Wird als Hauptmotiv auf der Markendetailseite angezeigt"
            />
          </div>
        </section>

        {/* Card 3: Beschreibungen & Texte */}
        <section className="admin-panel p-6 sm:p-8 flex flex-col gap-6">
          <div>
            <h2 className="text-lg font-bold text-[#1c1917]">3. Texte & Beschreibung</h2>
            <p className="text-xs text-[#78716c] mt-0.5">
              Kuratierte Information für Website-Besucherinnen.
            </p>
          </div>

          <div className="field-group">
            <label htmlFor="summary">Kurzbeschreibung (Teaser)</label>
            <input
              type="text"
              id="summary"
              name="summary"
              defaultValue={brand?.summary || ""}
              placeholder="z.B. Nachhaltige feminine Vintage-Kleider aus Amsterdam"
            />
          </div>

          <div className="field-group">
            <label htmlFor="description">Detailbeschreibung</label>
            <textarea
              id="description"
              name="description"
              defaultValue={brand?.description || ""}
              placeholder="Ausführliche Information über die Marke, Philosophie, Passformen und Stilberatung bei Checkpot..."
              rows={6}
              className="w-full border border-[#d6d3d1] focus:border-[#1c1917] rounded-xl p-3.5 bg-white text-sm text-[#1c1917] focus:outline-hidden transition-colors"
            />
          </div>
        </section>

        {/* Card 4: Verifizierte Hinweise */}
        <section className="admin-panel p-6 sm:p-8 flex flex-col gap-6">
          <div>
            <h2 className="text-lg font-bold text-[#1c1917]">4. Verifizierte Hinweise (Gut zu wissen)</h2>
            <p className="text-xs text-[#78716c] mt-0.5">
              Faktische Produkt-, Material- oder Herkunftsmerkmale. Eine Aussage pro Zeile.
            </p>
          </div>

          <div className="field-group">
            <label htmlFor="verifiedClaims">Hinweise & Fakten (Zeilenweise)</label>
            <textarea
              id="verifiedClaims"
              name="verifiedClaims"
              defaultValue={(brand?.verifiedClaims || []).join("\n")}
              placeholder={"z.B. Faire Produktion in Portugal\nz.B. Zertifizierte Bio-Baumwolle (GOTS)\nz.B. Zertifiziertes Mitglied der Fair Wear Foundation"}
              rows={4}
              className="w-full border border-[#d6d3d1] focus:border-[#1c1917] rounded-xl p-3.5 bg-white text-sm text-[#1c1917] focus:outline-hidden transition-colors"
            />
            <p className="text-xs text-[#78716c] mt-1">
              Nur belegte Aussagen eintragen. Keine Nachhaltigkeits-, Zertifizierungs- oder Produktionsclaims ohne verlässliche Quelle.
            </p>
          </div>
        </section>

        {/* Card 5: SEO & Metadaten */}
        <section className="admin-panel p-6 sm:p-8 flex flex-col gap-6">
          <div>
            <h2 className="text-lg font-bold text-[#1c1917]">5. SEO & Suchmaschinen</h2>
            <p className="text-xs text-[#78716c] mt-0.5">
              Optionale Optimierung für Google & Social Sharing.
            </p>
          </div>

          <div className="field-group">
            <label htmlFor="seoTitle">SEO-Titel (Title Tag)</label>
            <input
              type="text"
              id="seoTitle"
              name="seoTitle"
              defaultValue={(brand?.seoMetadata as Record<string, string> | null)?.title || ""}
              placeholder="z.B. King Louie Kleider in Wien Hietzing | Checkpot"
              maxLength={70}
            />
            <p className="text-xs text-[#78716c] mt-0.5">
              Optional (max. 70 Zeichen). Wenn leer, wird automatisch &bdquo;{brand?.name || "Markenname"} bei Checkpot&ldquo; verwendet.
            </p>
          </div>

          <div className="field-group">
            <label htmlFor="seoDescription">Meta-Beschreibung (Description Tag)</label>
            <textarea
              id="seoDescription"
              name="seoDescription"
              defaultValue={(brand?.seoMetadata as Record<string, string> | null)?.description || ""}
              placeholder="z.B. Entdecken Sie die farbenfrohe Vintage-Kollektion von King Louie bei Checkpot in Wien Hietzing..."
              rows={3}
              maxLength={180}
              className="w-full border border-[#d6d3d1] focus:border-[#1c1917] rounded-xl p-3.5 bg-white text-sm text-[#1c1917] focus:outline-hidden transition-colors"
            />
            <p className="text-xs text-[#78716c] mt-0.5">
              Optional (max. 180 Zeichen). Wenn leer, wird automatisch die Kurzbeschreibung bzw. ein neutraler Standardtext verwendet.
            </p>
          </div>
        </section>

        {/* Card 6: Veröffentlichung & Sortierung */}
        <section className="admin-panel p-6 sm:p-8 flex flex-col gap-6">
          <div>
            <h2 className="text-lg font-bold text-[#1c1917]">6. Veröffentlichung & Sortierung</h2>
            <p className="text-xs text-[#78716c] mt-0.5">
              Status und Reihenfolge in der Website-Darstellung.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 items-center">
            <div className="p-4 bg-[#fafaf9] border border-[#e7e5e4] rounded-xl flex items-center gap-3">
              <input
                type="checkbox"
                id="active"
                name="active"
                value="true"
                defaultChecked={brand?.active}
                className="w-5 h-5 rounded text-[#C01718] focus:ring-[#C01718] cursor-pointer"
              />
              <label htmlFor="active" className="text-sm font-semibold text-[#1c1917] cursor-pointer">
                Veröffentlicht (Auf Website sichtbar)
              </label>
            </div>

            <div className="field-group">
              <label htmlFor="sortOrder">Sortierreihenfolge</label>
              <input
                type="number"
                id="sortOrder"
                name="sortOrder"
                defaultValue={brand?.sortOrder || 0}
                placeholder="0"
              />
            </div>
          </div>
        </section>

        {/* Action Buttons */}
        <div className="flex items-center gap-3 pt-2">
          <button
            type="submit"
            className="flex-1 py-3 px-6 rounded-xl bg-[#292524] text-white font-bold hover:bg-[#44403c] transition-colors shadow-sm cursor-pointer"
          >
            Marke speichern
          </button>
          <Link
            href="/admin/brands"
            className="secondary-button py-3 px-6 rounded-xl font-semibold flex items-center justify-center text-center"
          >
            Abbrechen
          </Link>
        </div>
      </form>
    </div>
  );
}
