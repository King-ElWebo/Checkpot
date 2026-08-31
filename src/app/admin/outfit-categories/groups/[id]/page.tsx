import Link from "next/link";
import { redirect } from "next/navigation";
import { getDatabase } from "@/db";
import { outfitCategoryGroups } from "@/db/schema";
import { eq } from "drizzle-orm";
import { saveGroupAction } from "../../actions";

export default async function GroupEditPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const isNew = id === "new";
  const database = getDatabase();
  
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let item: any = null;
  if (!isNew) {
    item = await database.query.outfitCategoryGroups.findFirst({
      where: eq(outfitCategoryGroups.id, id),
    });
    if (!item) redirect("/admin/outfit-categories");
  }

  async function handleSave(formData: FormData) {
    "use server";
    await saveGroupAction(isNew ? null : id, formData);
    redirect("/admin/outfit-categories");
  }

  return (
    <div className="dashboard-stack max-w-[800px] mx-auto">
      <section className="page-intro">
        <div className="eyebrow">Taxonomie</div>
        <h1>{isNew ? "Neue Kategorie-Gruppe" : "Gruppe bearbeiten"}</h1>
      </section>

      <section className="login-panel" style={{ width: "100%" }}>
        <form action={handleSave} className="login-form" style={{ marginTop: 0 }}>
          
          <div className="field-group">
            <label htmlFor="name">Name * (z.B. Saison)</label>
            <input type="text" id="name" name="name" defaultValue={item?.name || ""} required />
          </div>

          <div className="field-group">
            <label htmlFor="slug">Slug * (z.B. saison)</label>
            <input type="text" id="slug" name="slug" defaultValue={item?.slug || ""} required pattern="[a-z0-9-]+" title="Nur Kleinbuchstaben, Zahlen und Bindestriche" />
          </div>

          <div className="field-group" style={{ flexDirection: "row", alignItems: "center", display: "flex", gap: "10px" }}>
            <input type="checkbox" id="active" name="active" value="true" defaultChecked={isNew ? true : item?.active} style={{ width: "24px", minHeight: "24px" }} />
            <label htmlFor="active" style={{ fontSize: "1rem" }}>Aktiv</label>
          </div>

          <div className="field-group">
            <label htmlFor="sortOrder">Sortierreihenfolge</label>
            <input type="number" id="sortOrder" name="sortOrder" defaultValue={item?.sortOrder || 0} />
          </div>

          <div style={{ display: "flex", gap: "12px", marginTop: "12px" }}>
            <button type="submit" style={{ flex: 1 }}>Speichern</button>
            <Link href="/admin/outfit-categories" className="secondary-button" style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", textDecoration: "none" }}>
              Abbrechen
            </Link>
          </div>
        </form>
      </section>
    </div>
  );
}
