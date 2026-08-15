import Link from "next/link";
import { redirect } from "next/navigation";
import { getDatabase } from "@/db";
import { outfits, media, collections, brands } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import { saveOutfitAction } from "../actions";

export default async function OutfitEditPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const isNew = id === "new";
  const database = getDatabase();
  
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let item: any = null;
  if (!isNew) {
    item = await database.query.outfits.findFirst({
      where: eq(outfits.id, id),
      with: { outfitBrands: true, outfitCategoryAssignments: true }
    });
    if (!item) redirect("/admin/outfits");
  }

  const allMedia = await database.query.media.findMany({ orderBy: [desc(media.createdAt)] });
  const allCollections = await database.query.collections.findMany();
  const allBrands = await database.query.brands.findMany();
  
  const categoryGroups = await database.query.outfitCategoryGroups.findMany({
    with: { categories: true },
    orderBy: (groups, { asc }) => [asc(groups.sortOrder)]
  });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const selectedBrandIds = item?.outfitBrands?.map((ob: any) => ob.brandId) || [];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const selectedCategoryIds = item?.outfitCategoryAssignments?.map((oca: any) => oca.categoryId) || [];

  async function handleSave(formData: FormData) {
    "use server";
    await saveOutfitAction(isNew ? null : id, formData);
    redirect("/admin/outfits");
  }

  return (
    <div className="dashboard-stack">
      <section className="page-intro">
        <div className="eyebrow">Outfits</div>
        <h1>{isNew ? "Neues Outfit" : "Outfit bearbeiten"}</h1>
      </section>

      <section className="login-panel" style={{ width: "100%", maxWidth: "800px" }}>
        <form action={handleSave} className="login-form" style={{ marginTop: 0 }}>
          
          <div className="field-group">
            <label htmlFor="title">Titel *</label>
            <input type="text" id="title" name="title" defaultValue={item?.title || ""} required />
          </div>

          <div className="field-group">
            <label htmlFor="note">Styling-Notiz</label>
            <input type="text" id="note" name="note" defaultValue={item?.note || ""} />
          </div>

          <div className="field-group">
            <label htmlFor="availabilityNote">Verfügbarkeits-Notiz (z.B. Ausverkauft)</label>
            <input type="text" id="availabilityNote" name="availabilityNote" defaultValue={item?.availabilityNote || ""} />
          </div>

          <div className="field-group">
            <label htmlFor="collectionId">Zugehörige Kollektion</label>
            <select id="collectionId" name="collectionId" defaultValue={item?.collectionId || ""} style={{ minHeight: "48px", width: "100%", border: "1px solid #d6d3d1", borderRadius: "10px", padding: "0 14px", background: "var(--surface)" }}>
              <option value="">Keine Kollektion</option>
              {allCollections.map(c => (
                <option key={c.id} value={c.id}>{c.title} ({c.season})</option>
              ))}
            </select>
          </div>

          <div className="field-group">
            <label htmlFor="mediaId">Outfit-Bild</label>
            <select id="mediaId" name="mediaId" defaultValue={item?.mediaId || ""} style={{ minHeight: "48px", width: "100%", border: "1px solid #d6d3d1", borderRadius: "10px", padding: "0 14px", background: "var(--surface)" }}>
              <option value="">Kein Bild</option>
              {allMedia.map(m => (
                <option key={m.id} value={m.id}>{m.title || m.url.split("/").pop()}</option>
              ))}
            </select>
          </div>

          <div className="field-group">
            <label>Enthaltene Marken im Outfit</label>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", padding: "16px", border: "1px solid var(--border)", borderRadius: "10px" }}>
              {allBrands.map(b => (
                <label key={b.id} style={{ display: "flex", gap: "8px", fontWeight: "normal", fontSize: "1rem" }}>
                  <input type="checkbox" name="brandIds" value={b.id} defaultChecked={selectedBrandIds.includes(b.id)} style={{ width: "20px", height: "20px", margin: 0, padding: 0 }} />
                  {b.name}
                </label>
              ))}
            </div>
          </div>

          <div className="field-group">
            <label>Kategorien</label>
            <div style={{ display: "flex", flexDirection: "column", gap: "20px", padding: "16px", border: "1px solid var(--border)", borderRadius: "10px", background: "var(--surface)" }}>
              {categoryGroups.map(group => (
                <div key={group.id} style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                  <div style={{ fontWeight: 600, fontSize: "0.9rem", color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                    {group.name}
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
                    {group.categories.sort((a, b) => a.sortOrder - b.sortOrder).map(cat => (
                      <label key={cat.id} style={{ display: "flex", gap: "8px", fontWeight: "normal", fontSize: "1rem" }}>
                        <input type="checkbox" name="categoryIds" value={cat.id} defaultChecked={selectedCategoryIds.includes(cat.id)} style={{ width: "20px", height: "20px", margin: 0, padding: 0 }} />
                        {cat.name}
                      </label>
                    ))}
                  </div>
                </div>
              ))}
              {categoryGroups.length === 0 && (
                <div style={{ color: "var(--muted)", fontStyle: "italic" }}>Keine Kategorien vorhanden.</div>
              )}
            </div>
          </div>

          <div className="field-group" style={{ flexDirection: "row", alignItems: "center", display: "flex", gap: "10px" }}>
            <input type="checkbox" id="active" name="active" value="true" defaultChecked={item?.active} style={{ width: "24px", minHeight: "24px" }} />
            <label htmlFor="active" style={{ fontSize: "1rem" }}>Veröffentlicht (Aktiv)</label>
          </div>

          <div className="field-group" style={{ flexDirection: "row", alignItems: "center", display: "flex", gap: "10px" }}>
            <input type="checkbox" id="featured" name="featured" value="true" defaultChecked={item?.featured} style={{ width: "24px", minHeight: "24px" }} />
            <label htmlFor="featured" style={{ fontSize: "1rem" }}>Hervorgehoben (Featured)</label>
          </div>

          <div className="field-group">
            <label htmlFor="sortOrder">Sortierreihenfolge</label>
            <input type="number" id="sortOrder" name="sortOrder" defaultValue={item?.sortOrder || 0} />
          </div>

          <div style={{ display: "flex", gap: "12px", marginTop: "12px" }}>
            <button type="submit" style={{ flex: 1 }}>Speichern</button>
            <Link href="/admin/outfits" className="secondary-button" style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", textDecoration: "none" }}>
              Abbrechen
            </Link>
          </div>
        </form>
      </section>
    </div>
  );
}
