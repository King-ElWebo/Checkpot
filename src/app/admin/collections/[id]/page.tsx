import Link from "next/link";
import { redirect } from "next/navigation";
import { getDatabase } from "@/db";
import { collections } from "@/db/schema";
import { eq } from "drizzle-orm";
import { saveCollectionAction } from "../actions";

export default async function CollectionEditPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const isNew = id === "new";
  const database = getDatabase();
  
  let item: any = null;
  if (!isNew) {
    item = await database.query.collections.findFirst({
      where: eq(collections.id, id),
    });
    if (!item) redirect("/admin/collections");
  }

  async function handleSave(formData: FormData) {
    "use server";
    await saveCollectionAction(isNew ? null : id, formData);
    redirect("/admin/collections");
  }

  return (
    <div className="dashboard-stack">
      <section className="page-intro">
        <div className="eyebrow">Kollektionen</div>
        <h1>{isNew ? "Neue Kollektion" : "Kollektion bearbeiten"}</h1>
      </section>

      <section className="login-panel" style={{ width: "100%", maxWidth: "800px" }}>
        <form action={handleSave} className="login-form" style={{ marginTop: 0 }}>
          
          <div className="field-group">
            <label htmlFor="title">Titel *</label>
            <input type="text" id="title" name="title" defaultValue={item?.title || ""} required />
          </div>

          <div className="field-group">
            <label htmlFor="season">Saison (z.B. Frühjahr/Sommer 2026)</label>
            <input type="text" id="season" name="season" defaultValue={item?.season || ""} />
          </div>

          <div className="field-group">
            <label htmlFor="intro">Einleitungstext</label>
            <textarea 
              id="intro" 
              name="intro" 
              defaultValue={item?.intro || ""} 
              rows={5}
              style={{ width: "100%", border: "1px solid #d6d3d1", borderRadius: "10px", padding: "14px", background: "var(--surface)", fontFamily: "inherit" }}
            />
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
            <Link href="/admin/collections" className="secondary-button" style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", textDecoration: "none" }}>
              Abbrechen
            </Link>
          </div>
        </form>
      </section>
    </div>
  );
}
