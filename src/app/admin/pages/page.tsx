import Link from "next/link";
import { getDatabase } from "@/db";
import { pageContent } from "@/db/schema";
import { asc } from "drizzle-orm";
import { deletePageAction } from "./actions";

export const dynamic = "force-dynamic";

export default async function PagesPage() {
  const database = getDatabase();
  const items = await database.query.pageContent.findMany({
    orderBy: [asc(pageContent.routeKey)],
  });

  return (
    <div className="dashboard-stack">
      <section className="page-intro" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <div className="eyebrow">Seiteninhalte</div>
          <h1>Statische Seiten bearbeiten</h1>
        </div>
        <Link href="/admin/pages/new" className="admin-primary-btn">
          <span style={{ color: "#ffffff" }}>+ Seite hinzufügen</span>
        </Link>
      </section>

      <section className="admin-panel">
        <div className="admin-table-container">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Route Key</th>
                <th>Status</th>
                <th>Aktion</th>
              </tr>
            </thead>
            <tbody>
              {items.length === 0 ? (
                <tr>
                  <td colSpan={3} style={{ textAlign: "center", color: "var(--muted)" }}>Keine Seiten gefunden.</td>
                </tr>
              ) : (
                items.map((item) => (
                  <tr key={item.id}>
                    <td style={{ fontWeight: 600 }}>{item.routeKey}</td>
                    <td>
                      <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                        <div className={`status-dot ${item.visibility ? "status-dot-ready" : "status-dot-pending"}`}></div>
                        {item.visibility ? "Sichtbar" : "Versteckt"}
                      </div>
                    </td>
                    <td>
                      <div className="table-actions">
                        <Link href={`/admin/pages/${item.id}`} className="table-action-btn">
                          Bearbeiten
                        </Link>
                        <form action={async () => {
                          "use server";
                          await deletePageAction(item.id);
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
