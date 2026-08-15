import Link from "next/link";
import { redirect } from "next/navigation";
import { getDatabase } from "@/db";
import { outfits } from "@/db/schema";
import { eq } from "drizzle-orm";
import { saveOutfitAction } from "../actions";
import { listAllMediaForAdmin } from "@/lib/repositories/media";
import { MediaPicker } from "@/components/admin/media-picker";

export default async function OutfitEditPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const isNew = id === "new";
  const database = getDatabase();

  const item = !isNew
    ? (await database.query.outfits.findFirst({
        where: eq(outfits.id, id),
        with: {
          media: true,
          outfitBrands: true,
          outfitCategoryAssignments: true,
        },
      })) ?? null
    : null;

  if (!isNew && !item) {
    redirect("/admin/outfits");
  }

  const allMedia = await listAllMediaForAdmin();
  const allCollections = await database.query.collections.findMany({
    orderBy: (collections, { asc }) => [asc(collections.sortOrder)],
  });
  const allBrands = await database.query.brands.findMany({
    orderBy: (brands, { asc }) => [asc(brands.name)],
  });

  const categoryGroups = await database.query.outfitCategoryGroups.findMany({
    with: { categories: true },
    orderBy: (groups, { asc }) => [asc(groups.sortOrder)],
  });

  const selectedBrandIds: string[] =
    item?.outfitBrands?.map((ob) => ob.brandId) || [];
  const selectedCategoryIds: string[] =
    item?.outfitCategoryAssignments?.map((oca) => oca.categoryId) || [];

  async function handleSave(formData: FormData) {
    "use server";
    await saveOutfitAction(isNew ? null : id, formData);
    redirect("/admin/outfits");
  }

  return (
    <div className="dashboard-stack">
      <section className="page-intro">
        <div className="eyebrow">Outfits & Lookbook</div>
        <h1>{isNew ? "Neues Outfit erstellen" : `Outfit: ${item?.title || "Bearbeiten"}`}</h1>
      </section>

      <form action={handleSave} className="flex flex-col gap-8 max-w-[840px]">
        {/* Card A: Basisdaten */}
        <section className="admin-panel p-6 sm:p-8 flex flex-col gap-6">
          <div>
            <h2 className="text-lg font-bold text-[#1c1917]">A. Basisangaben</h2>
            <p className="text-xs text-[#78716c] mt-0.5">
              Titel und Styling-Hinweise für Kundinnen.
            </p>
          </div>

          <div className="field-group">
            <label htmlFor="title">Outfit-Titel *</label>
            <input
              type="text"
              id="title"
              name="title"
              defaultValue={item?.title || ""}
              placeholder="z.B. Sommerkleid mit Cardigan"
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="field-group">
              <label htmlFor="note">Styling-Notiz</label>
              <input
                type="text"
                id="note"
                name="note"
                defaultValue={item?.note || ""}
                placeholder="z.B. Lässig kombiniert für kühlere Abende"
              />
            </div>

            <div className="field-group">
              <label htmlFor="availabilityNote">Verfügbarkeits-Hinweis</label>
              <input
                type="text"
                id="availabilityNote"
                name="availabilityNote"
                defaultValue={item?.availabilityNote || ""}
                placeholder="z.B. In Größen 36–44 vorrätig"
              />
            </div>
          </div>
        </section>

        {/* Card B: Outfit-Foto */}
        <section className="admin-panel p-6 sm:p-8 flex flex-col gap-6">
          <div>
            <h2 className="text-lg font-bold text-[#1c1917]">B. Outfit-Fotografie</h2>
            <p className="text-xs text-[#78716c] mt-0.5">
              Hochwertiges Foto des Stylings. Wird im Lookbook und auf der Startseite präsentiert.
            </p>
          </div>

          <MediaPicker
            name="mediaId"
            label="Hauptfoto des Outfits"
            initialMediaId={item?.mediaId}
            initialMedia={item?.media}
            allMedia={allMedia}
            aspect="photo"
            helpText="Hochformat (3:4 oder 4:5) empfohlen"
          />
        </section>

        {/* Card C: Zuordnung (Kollektion, Marken, Kategorien) */}
        <section className="admin-panel p-6 sm:p-8 flex flex-col gap-8">
          <div>
            <h2 className="text-lg font-bold text-[#1c1917]">C. Zuordnung & Filter</h2>
            <p className="text-xs text-[#78716c] mt-0.5">
              Damit Kundinnen das Outfit gezielt nach Saison, Stil und Marke filtern können.
            </p>
          </div>

          {/* Kollektion Dropdown */}
          <div className="field-group">
            <label htmlFor="collectionId">Zugehörige Saison / Kollektion</label>
            <select
              id="collectionId"
              name="collectionId"
              defaultValue={item?.collectionId || ""}
              style={{
                minHeight: "48px",
                width: "100%",
                border: "1px solid #d6d3d1",
                borderRadius: "10px",
                padding: "0 14px",
                background: "var(--surface)",
              }}
            >
              <option value="">Keine Kollektionsbindung</option>
              {allCollections.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.title} {c.season ? `(${c.season})` : ""}
                </option>
              ))}
            </select>
          </div>

          {/* Enthaltene Marken */}
          <div className="flex flex-col gap-3">
            <label className="text-sm font-bold text-[#1c1917]">
              Enthaltene Marken im Look
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 p-4 border border-[#e7e5e4] rounded-xl bg-[#fafaf9]">
              {allBrands.map((b) => (
                <label
                  key={b.id}
                  className="flex items-center gap-2 text-sm text-[#1c1917] p-1.5 rounded-lg hover:bg-[#f5f5f4] cursor-pointer select-none"
                >
                  <input
                    type="checkbox"
                    name="brandIds"
                    value={b.id}
                    defaultChecked={selectedBrandIds.includes(b.id)}
                    className="w-4 h-4 rounded text-[#C01718] border-[#d6d3d1] focus:ring-[#C01718]"
                  />
                  <span className="truncate">{b.name}</span>
                </label>
              ))}
              {allBrands.length === 0 && (
                <div className="col-span-full text-xs text-[#78716c] italic">
                  Noch keine Marken vorhanden.
                </div>
              )}
            </div>
          </div>

          {/* Kategorien / Filtergruppen */}
          <div className="flex flex-col gap-5">
            <div>
              <label className="text-sm font-bold text-[#1c1917]">
                Kategorien & Stil-Filter
              </label>
              <p className="text-xs text-[#78716c] mt-0.5">
                Wird im Lookbook für die Filterleiste verwendet.
              </p>
            </div>

            <div className="flex flex-col gap-5 p-5 border border-[#e7e5e4] rounded-xl bg-[#fafaf9]">
              {categoryGroups.map((group) => (
                <div key={group.id} className="flex flex-col gap-2.5">
                  <div className="text-xs font-bold uppercase tracking-wider text-[#78716c] border-b border-[#e7e5e4]/80 pb-1">
                    {group.name}
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {group.categories
                      .sort((a, b) => a.sortOrder - b.sortOrder)
                      .map((cat) => (
                        <label
                          key={cat.id}
                          className="flex items-center gap-2 text-sm text-[#1c1917] p-1 rounded-md hover:bg-[#f5f5f4] cursor-pointer select-none"
                        >
                          <input
                            type="checkbox"
                            name="categoryIds"
                            value={cat.id}
                            defaultChecked={selectedCategoryIds.includes(cat.id)}
                            className="w-4 h-4 rounded text-[#C01718] border-[#d6d3d1] focus:ring-[#C01718]"
                          />
                          <span className="truncate">{cat.name}</span>
                        </label>
                      ))}
                  </div>
                </div>
              ))}
              {categoryGroups.length === 0 && (
                <div className="text-xs text-[#78716c] italic">
                  Keine Kategorien vorhanden. Erstellen Sie Kategorien unter &quot;Taxonomie&quot;.
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Card D: Veröffentlichung & Sortierung */}
        <section className="admin-panel p-6 sm:p-8 flex flex-col gap-6">
          <div>
            <h2 className="text-lg font-bold text-[#1c1917]">D. Veröffentlichung & Sichtbarkeit</h2>
            <p className="text-xs text-[#78716c] mt-0.5">
              Steuern Sie, wo und wie das Outfit angezeigt wird.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-center">
            <div className="field-group" style={{ flexDirection: "row", alignItems: "center", display: "flex", gap: "10px" }}>
              <input
                type="checkbox"
                id="active"
                name="active"
                value="true"
                defaultChecked={item?.active ?? false}
                style={{ width: "22px", minHeight: "22px" }}
              />
              <label htmlFor="active" style={{ fontSize: "0.95rem", cursor: "pointer" }}>
                Veröffentlicht
              </label>
            </div>

            <div className="field-group" style={{ flexDirection: "row", alignItems: "center", display: "flex", gap: "10px" }}>
              <input
                type="checkbox"
                id="featured"
                name="featured"
                value="true"
                defaultChecked={item?.featured ?? false}
                style={{ width: "22px", minHeight: "22px" }}
              />
              <label htmlFor="featured" style={{ fontSize: "0.95rem", cursor: "pointer" }}>
                Startseite (Featured)
              </label>
            </div>

            <div className="field-group">
              <label htmlFor="sortOrder">Sortierung</label>
              <input
                type="number"
                id="sortOrder"
                name="sortOrder"
                defaultValue={item?.sortOrder || 0}
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
            Outfit speichern
          </button>
          <Link
            href="/admin/outfits"
            className="secondary-button py-3 px-6 rounded-xl font-semibold flex items-center justify-center text-center"
          >
            Abbrechen
          </Link>
        </div>
      </form>
    </div>
  );
}
