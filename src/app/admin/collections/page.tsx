import Link from "next/link";
import { getDatabase } from "@/db";
import { collections } from "@/db/schema";
import { asc } from "drizzle-orm";
import { deleteCollectionAction } from "./actions";

export const dynamic = "force-dynamic";

export default async function CollectionsPage() {
  const database = getDatabase();
  const items = await database.query.collections.findMany({
    orderBy: [asc(collections.sortOrder)],
  });

  return (
    <div className="dashboard-stack">
      <section className="page-intro" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <div className="eyebrow">Kollektionen</div>
          <h1>Alle Kollektionen</h1>
        </div>
        <Link href="/admin/collections/new" className="login-form button" style={{ display: "inline-flex", alignItems: "center", textDecoration: "none", padding: "0 18px", background: "var(--accent)", color: "white", borderRadius: "10px", minHeight: "44px", fontWeight: 700 }}>
          Kollektion hinzufügen
        </Link>
      </section>

      <section className="admin-panel">
        <div className="admin-table-container">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Titel</th>
                <th>Saison</th>
                <th>Status</th>
                <th>Aktion</th>
              </tr>
            </thead>
            <tbody>
              {items.length === 0 ? (
                <tr>
                  <td colSpan={4} style={{ textAlign: "center", color: "var(--muted)" }}>Keine Kollektionen gefunden.</td>
                </tr>
              ) : (
                items.map((item) => (
                  <tr key={item.id}>
                    <td style={{ fontWeight: 600 }}>
                      {item.title}
                      {item.featured && <span className="badge-featured">Featured</span>}
                    </td>
                    <td style={{ color: "var(--muted)" }}>{item.season}</td>
                    <td>
                      <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                        <div className={`status-dot ${item.active ? "status-dot-ready" : "status-dot-pending"}`}></div>
                        {item.active ? "Veröffentlicht" : "Entwurf"}
                      </div>
                    </td>
                    <td>
                      <div className="table-actions">
                        <Link href={`/admin/collections/${item.id}`} className="table-action-btn">
                          Bearbeiten
                        </Link>
                        <form action={async () => {
                          "use server";
                          await deleteCollectionAction(item.id);
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
    </div>
  );
}
