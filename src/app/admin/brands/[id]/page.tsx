import Link from "next/link";
import { redirect } from "next/navigation";
import { getDatabase } from "@/db";
import { brands, media } from "@/db/schema";
import { desc, eq } from "drizzle-orm";
import { saveBrandAction } from "../actions";

export default async function BrandEditPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const isNew = id === "new";

  const database = getDatabase();
  
  let brand: any = null;
  if (!isNew) {
    brand = await database.query.brands.findFirst({
      where: eq(brands.id, id),
    });
    if (!brand) redirect("/admin/brands");
  }

  const allMedia = await database.query.media.findMany({
    orderBy: [desc(media.createdAt)],
  });

  async function handleSave(formData: FormData) {
    "use server";
    await saveBrandAction(isNew ? null : id, formData);
    redirect("/admin/brands");
  }

  return (
    <div className="dashboard-stack">
      <section className="page-intro">
        <div className="eyebrow">Marken</div>
        <h1>{isNew ? "Neue Marke" : "Marke bearbeiten"}</h1>
      </section>

      <section className="login-panel" style={{ width: "100%", maxWidth: "800px" }}>
        <form action={handleSave} className="login-form" style={{ marginTop: 0 }}>
          
          <div className="field-group">
            <label htmlFor="name">Name *</label>
            <input type="text" id="name" name="name" defaultValue={brand?.name || ""} required />
          </div>

          <div className="field-group">
            <label htmlFor="slug">Slug (URL-Pfad) *</label>
            <input type="text" id="slug" name="slug" defaultValue={brand?.slug || ""} required />
          </div>

          <div className="field-group">
            <label htmlFor="summary">Kurzbeschreibung</label>
            <input type="text" id="summary" name="summary" defaultValue={brand?.summary || ""} />
          </div>

          <div className="field-group">
            <label htmlFor="description">Detailbeschreibung</label>
            <textarea 
              id="description" 
              name="description" 
              defaultValue={brand?.description || ""} 
              rows={5}
              style={{ width: "100%", border: "1px solid #d6d3d1", borderRadius: "10px", padding: "14px", background: "var(--surface)", fontFamily: "inherit" }}
            />
          </div>

          <div className="field-group" style={{ flexDirection: "row", alignItems: "center", display: "flex", gap: "10px" }}>
            <input type="checkbox" id="active" name="active" value="true" defaultChecked={brand?.active} style={{ width: "24px", minHeight: "24px" }} />
            <label htmlFor="active" style={{ fontSize: "1rem" }}>Veröffentlicht (Aktiv)</label>
          </div>

          <div className="field-group">
            <label htmlFor="sortOrder">Sortierreihenfolge</label>
            <input type="number" id="sortOrder" name="sortOrder" defaultValue={brand?.sortOrder || 0} />
          </div>

          <div className="field-group">
            <label htmlFor="logoMediaId">Logo Bild</label>
            <select id="logoMediaId" name="logoMediaId" defaultValue={brand?.logoMediaId || ""} style={{ minHeight: "48px", width: "100%", border: "1px solid #d6d3d1", borderRadius: "10px", padding: "0 14px", background: "var(--surface)" }}>
              <option value="">Kein Logo</option>
              {allMedia.map(m => (
                <option key={m.id} value={m.id}>{m.title || m.url.split("/").pop()}</option>
              ))}
            </select>
          </div>

          <div className="field-group">
            <label htmlFor="imageMediaId">Titelbild</label>
            <select id="imageMediaId" name="imageMediaId" defaultValue={brand?.imageMediaId || ""} style={{ minHeight: "48px", width: "100%", border: "1px solid #d6d3d1", borderRadius: "10px", padding: "0 14px", background: "var(--surface)" }}>
              <option value="">Kein Titelbild</option>
              {allMedia.map(m => (
                <option key={m.id} value={m.id}>{m.title || m.url.split("/").pop()}</option>
              ))}
            </select>
          </div>

          <div style={{ display: "flex", gap: "12px", marginTop: "12px" }}>
            <button type="submit" style={{ flex: 1 }}>Speichern</button>
            <Link href="/admin/brands" className="secondary-button" style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", textDecoration: "none" }}>
              Abbrechen
            </Link>
          </div>
        </form>
      </section>
    </div>
  );
}
