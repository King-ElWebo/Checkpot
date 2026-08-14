import Link from "next/link";
import { getDatabase } from "@/db";
import { outfits } from "@/db/schema";
import { asc } from "drizzle-orm";
import { deleteOutfitAction } from "./actions";

export const dynamic = "force-dynamic";

export default async function OutfitsPage() {
  const database = getDatabase();
  const items = await database.query.outfits.findMany({
    orderBy: [asc(outfits.sortOrder)],
    with: {
      media: true,
      collection: true,
    }
  });

  return (
    <div className="dashboard-stack">
      <section className="page-intro" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <div className="eyebrow">Outfits</div>
          <h1>Alle Outfits & Looks</h1>
        </div>
        <Link href="/admin/outfits/new" className="login-form button" style={{ display: "inline-flex", alignItems: "center", textDecoration: "none", padding: "0 18px", background: "var(--accent)", color: "white", borderRadius: "10px", minHeight: "44px", fontWeight: 700 }}>
          Outfit hinzufügen
        </Link>
      </section>

      <section className="admin-panel">
        <div className="admin-table-container">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Bild</th>
                <th>Titel</th>
                <th>Kollektion</th>
                <th>Status</th>
                <th>Aktion</th>
              </tr>
            </thead>
            <tbody>
              {items.length === 0 ? (
                <tr>
                  <td colSpan={5} style={{ textAlign: "center", color: "var(--muted)" }}>Keine Outfits gefunden.</td>
                </tr>
              ) : (
                items.map((item) => (
                  <tr key={item.id}>
                    <td>
                      {item.media ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={item.media.url} alt="" style={{ width: "52px", height: "52px", objectFit: "cover", borderRadius: "8px", display: "block" }} />
                      ) : (
                        <div style={{ width: "52px", height: "52px", background: "var(--border)", borderRadius: "8px" }} />
                      )}
                    </td>
                    <td style={{ fontWeight: 600 }}>
                      {item.title}
                      {item.featured && <span className="badge-featured">Featured</span>}
                    </td>
                    <td style={{ color: "var(--muted)" }}>{item.collection?.title || "–"}</td>
                    <td>
                      <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                        <div className={`status-dot ${item.active ? "status-dot-ready" : "status-dot-pending"}`}></div>
                        {item.active ? "Veröffentlicht" : "Entwurf"}
                      </div>
                    </td>
                    <td>
                      <div className="table-actions">
                        <Link href={`/admin/outfits/${item.id}`} className="table-action-btn">
                          Bearbeiten
                        </Link>
                        <form action={async () => {
                          "use server";
                          await deleteOutfitAction(item.id);
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
