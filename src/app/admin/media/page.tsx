import Link from "next/link";
import { getDatabase } from "@/db";
import { media } from "@/db/schema";
import { desc } from "drizzle-orm";
import { deleteMediaAction } from "./actions";

export const dynamic = "force-dynamic";

export default async function MediaPage() {
  const database = getDatabase();
  const mediaItems = await database.query.media.findMany({
    orderBy: [desc(media.createdAt)],
  });

  return (
    <div className="dashboard-stack">
      <section className="page-intro" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <div className="eyebrow">Medien</div>
          <h1>Bilder & Uploads</h1>
        </div>
        <Link href="/admin/media/upload" className="login-form button" style={{ display: "inline-flex", alignItems: "center", textDecoration: "none", padding: "0 18px", background: "var(--accent)", color: "white", borderRadius: "10px", minHeight: "44px", fontWeight: 700 }}>
          Bild hochladen
        </Link>
      </section>

      <section className="admin-panel">
        <div className="admin-table-container">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Vorschau</th>
                <th>Dateiname / Titel</th>
                <th>Datum</th>
                <th>Aktion</th>
              </tr>
            </thead>
            <tbody>
              {mediaItems.length === 0 ? (
                <tr>
                  <td colSpan={4} style={{ textAlign: "center", color: "var(--muted)" }}>Keine Medien gefunden.</td>
                </tr>
              ) : (
                mediaItems.map((item) => (
                  <tr key={item.id}>
                    <td>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={item.url} alt={item.alt || ""} style={{ width: "52px", height: "52px", objectFit: "cover", borderRadius: "8px", display: "block" }} />
                    </td>
                    <td>
                      <div style={{ fontWeight: 600 }}>{item.title || "Ohne Titel"}</div>
                      <div style={{ fontSize: "0.8rem", color: "var(--muted)", wordBreak: "break-all" }}>{item.url.split("/").pop()}</div>
                    </td>
                    <td style={{ fontSize: "0.85rem", color: "var(--muted)" }}>
                      {item.createdAt.toLocaleDateString("de-AT")}
                    </td>
                    <td>
                      <div className="table-actions">
                        <form action={async () => {
                          "use server";
                          await deleteMediaAction(item.id, item.url);
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
