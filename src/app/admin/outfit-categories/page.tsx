import Link from "next/link";
import { getDatabase } from "@/db";
import { outfitCategoryGroups } from "@/db/schema";
import { asc } from "drizzle-orm";
import { deleteGroupAction, deleteCategoryAction } from "./actions";

export const dynamic = "force-dynamic";

export default async function CategoriesPage() {
  const database = getDatabase();
  const groups = await database.query.outfitCategoryGroups.findMany({
    with: { categories: true },
    orderBy: [asc(outfitCategoryGroups.sortOrder)],
  });

  return (
    <div className="dashboard-stack">
      <section className="page-intro" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <div className="eyebrow">Taxonomie</div>
          <h1>Outfit-Kategorien</h1>
        </div>
        <Link href="/admin/outfit-categories/groups/new" className="login-form button" style={{ display: "inline-flex", alignItems: "center", textDecoration: "none", padding: "0 18px", background: "var(--accent)", color: "white", borderRadius: "10px", minHeight: "44px", fontWeight: 700 }}>
          Gruppe hinzufügen
        </Link>
      </section>

      {groups.length === 0 ? (
        <section className="admin-panel" style={{ padding: "40px", textAlign: "center", color: "var(--muted)" }}>
          Keine Kategorie-Gruppen gefunden.
        </section>
      ) : (
        groups.map(group => (
          <section key={group.id} className="admin-panel" style={{ marginBottom: "32px" }}>
            <div style={{ padding: "20px", borderBottom: "1px solid var(--border)", display: "flex", justifyContent: "space-between", alignItems: "center", background: "var(--surface)" }}>
              <div>
                <h2 style={{ fontSize: "1.2rem", margin: "0 0 4px 0", display: "flex", alignItems: "center", gap: "8px" }}>
                  {group.name}
                  {!group.active && <span className="badge-featured" style={{ fontSize: "0.7rem", background: "#fecaca", color: "#991b1b" }}>Inaktiv</span>}
                </h2>
                <div style={{ fontSize: "0.9rem", color: "var(--muted)" }}>Slug: {group.slug}</div>
              </div>
              <div className="table-actions">
                <Link href={`/admin/outfit-categories/groups/${group.id}`} className="table-action-btn">
                  Gruppe bearbeiten
                </Link>
                <form action={async () => {
                  "use server";
                  await deleteGroupAction(group.id);
                }}>
                  <button type="submit" className="table-action-btn table-action-delete">
                    Löschen
                  </button>
                </form>
                <Link href={`/admin/outfit-categories/categories/new?groupId=${group.id}`} className="table-action-btn" style={{ background: "var(--foreground)", color: "white" }}>
                  + Kategorie
                </Link>
              </div>
            </div>
            
            <div className="admin-table-container">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Kategorie</th>
                    <th>Slug</th>
                    <th>Sortierung</th>
                    <th>Status</th>
                    <th>Aktion</th>
                  </tr>
                </thead>
                <tbody>
                  {group.categories.length === 0 ? (
                    <tr>
                      <td colSpan={5} style={{ textAlign: "center", color: "var(--muted)" }}>Keine Kategorien in dieser Gruppe.</td>
                    </tr>
                  ) : (
                    group.categories.sort((a, b) => a.sortOrder - b.sortOrder).map(cat => (
                      <tr key={cat.id}>
                        <td style={{ fontWeight: 600 }}>{cat.name}</td>
                        <td style={{ color: "var(--muted)" }}>{cat.slug}</td>
                        <td style={{ color: "var(--muted)" }}>{cat.sortOrder}</td>
                        <td>
                          <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                            <div className={`status-dot ${cat.active ? "status-dot-ready" : "status-dot-pending"}`}></div>
                            {cat.active ? "Aktiv" : "Inaktiv"}
                          </div>
                        </td>
                        <td>
                          <div className="table-actions">
                            <Link href={`/admin/outfit-categories/categories/${cat.id}`} className="table-action-btn">
                              Bearbeiten
                            </Link>
                            <form action={async () => {
                              "use server";
                              await deleteCategoryAction(cat.id);
                            }}>
                              <button type="submit" className="table-action-btn table-action-delete">
                                Löschen
                              </button>
                            </form>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </section>
        ))
      )}
    </div>
  );
}
