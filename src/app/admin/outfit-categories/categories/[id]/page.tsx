import Link from "next/link";
import { redirect } from "next/navigation";
import { getDatabase } from "@/db";
import { outfitCategories, outfitCategoryGroups } from "@/db/schema";
import { eq, asc } from "drizzle-orm";
import { saveCategoryAction } from "../../actions";

export default async function CategoryEditPage({ params, searchParams }: { params: Promise<{ id: string }>, searchParams: Promise<{ groupId?: string }> }) {
  const { id } = await params;
  const { groupId: initialGroupId } = await searchParams;
  const isNew = id === "new";
  const database = getDatabase();
  
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let item: any = null;
  if (!isNew) {
    item = await database.query.outfitCategories.findFirst({
      where: eq(outfitCategories.id, id),
    });
    if (!item) redirect("/admin/outfit-categories");
  }

  const allGroups = await database.query.outfitCategoryGroups.findMany({
    orderBy: [asc(outfitCategoryGroups.sortOrder)],
  });

  if (allGroups.length === 0) {
    return (
      <div className="dashboard-stack">
        <section className="admin-panel" style={{ padding: "40px", textAlign: "center" }}>
          Bitte erstellen Sie zuerst eine Gruppe.
        </section>
      </div>
    );
  }

  const defaultGroupId = item?.groupId || initialGroupId || allGroups[0].id;

  async function handleSave(formData: FormData) {
    "use server";
    await saveCategoryAction(isNew ? null : id, formData);
    redirect("/admin/outfit-categories");
  }

  return (
    <div className="dashboard-stack">
      <section className="page-intro">
        <div className="eyebrow">Taxonomie</div>
        <h1>{isNew ? "Neue Kategorie" : "Kategorie bearbeiten"}</h1>
      </section>

      <section className="login-panel" style={{ width: "100%", maxWidth: "800px" }}>
        <form action={handleSave} className="login-form" style={{ marginTop: 0 }}>
          
          <div className="field-group">
            <label htmlFor="groupId">Gruppe</label>
            <select id="groupId" name="groupId" defaultValue={defaultGroupId} style={{ minHeight: "48px", width: "100%", border: "1px solid #d6d3d1", borderRadius: "10px", padding: "0 14px", background: "var(--surface)" }}>
              {allGroups.map(g => (
                <option key={g.id} value={g.id}>{g.name}</option>
              ))}
            </select>
          </div>

          <div className="field-group">
            <label htmlFor="name">Name * (z.B. Sommer)</label>
            <input type="text" id="name" name="name" defaultValue={item?.name || ""} required />
          </div>

          <div className="field-group">
            <label htmlFor="slug">Slug * (z.B. sommer)</label>
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
