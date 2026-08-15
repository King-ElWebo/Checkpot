import Link from "next/link";
import { redirect } from "next/navigation";
import { getDatabase } from "@/db";
import { brands } from "@/db/schema";
import { eq } from "drizzle-orm";
import { saveBrandAction } from "../actions";
import { listAllMediaForAdmin } from "@/lib/repositories/media";
import { MediaPicker } from "@/components/admin/media-picker";

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
      </section>

      <form action={handleSave} className="flex flex-col gap-8 max-w-[840px]">
        {/* Card 1: Basis & Identität */}
        <section className="admin-panel p-6 sm:p-8 flex flex-col gap-6">
          <div>
            <h2 className="text-lg font-bold text-[#1c1917]">1. Markenidentität</h2>
            <p className="text-xs text-[#78716c] mt-0.5">
              Grundlegende Daten und URL-Struktur für die Marke.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Logo Picker */}
            <MediaPicker
              name="logoMediaId"
              label="Markenlogo"
              initialMediaId={brand?.logoMediaId}
              initialMedia={brand?.logo}
              allMedia={allMedia}
              aspect="logo"
              helpText="Empfohlen: Freigestelltes PNG/SVG"
            />

            {/* Title Image Picker */}
            <MediaPicker
              name="imageMediaId"
              label="Titelbild / Kampagnenbild"
              initialMediaId={brand?.imageMediaId}
              initialMedia={brand?.image}
              allMedia={allMedia}
              aspect="photo"
              helpText="Wird groß auf der Markenseite gezeigt"
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
              rows={5}
              style={{
                width: "100%",
                border: "1px solid #d6d3d1",
                borderRadius: "10px",
                padding: "14px",
                background: "var(--surface)",
                fontFamily: "inherit",
              }}
            />
          </div>
        </section>

        {/* Card 4: Veröffentlichung & Sortierung */}
        <section className="admin-panel p-6 sm:p-8 flex flex-col gap-6">
          <div>
            <h2 className="text-lg font-bold text-[#1c1917]">4. Veröffentlichung</h2>
            <p className="text-xs text-[#78716c] mt-0.5">
              Status und Reihenfolge in der Website-Darstellung.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 items-center">
            <div className="field-group" style={{ flexDirection: "row", alignItems: "center", display: "flex", gap: "10px" }}>
              <input
                type="checkbox"
                id="active"
                name="active"
                value="true"
                defaultChecked={brand?.active}
                style={{ width: "22px", minHeight: "22px" }}
              />
              <label htmlFor="active" style={{ fontSize: "0.95rem", cursor: "pointer" }}>
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
