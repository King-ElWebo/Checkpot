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
      outfitBrands: {
        with: {
          brand: {
            columns: {
              name: true,
            },
          },
        },
      },
      outfitCategoryAssignments: {
        with: {
          category: {
            columns: {
              name: true,
            },
          },
        },
      },
    },
  });

  return (
    <div className="dashboard-stack">
      <section className="page-intro" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <div className="eyebrow">Outfits & Lookbook</div>
          <h1>Alle Outfits & Stylings</h1>
          <p className="text-sm text-[#78716c] mt-1">
            {items.length} {items.length === 1 ? "Outfit" : "Outfits"} im Lookbook.
          </p>
        </div>
        <Link
          href="/admin/outfits/new"
          className="login-form button"
          style={{
            display: "inline-flex",
            alignItems: "center",
            textDecoration: "none",
            padding: "0 20px",
            background: "var(--accent)",
            color: "white",
            borderRadius: "12px",
            minHeight: "44px",
            fontWeight: 700,
          }}
        >
          + Neues Outfit anlegen
        </Link>
      </section>

      <section className="admin-panel">
        <div className="admin-table-container">
          <table className="admin-table">
            <thead>
              <tr>
                <th style={{ width: "90px" }}>Foto</th>
                <th>Titel & Styling</th>
                <th>Kollektion</th>
                <th>Marken & Filter</th>
                <th>Status</th>
                <th style={{ textAlign: "right" }}>Aktion</th>
              </tr>
            </thead>
            <tbody>
              {items.length === 0 ? (
                <tr>
                  <td colSpan={6} style={{ textAlign: "center", padding: "40px", color: "var(--muted)" }}>
                    Keine Outfits gefunden.
                  </td>
                </tr>
              ) : (
                items.map((item) => (
                  <tr key={item.id}>
                    <td>
                      {item.media ? (
                        <div style={{ width: "68px", height: "88px", borderRadius: "10px", overflow: "hidden", border: "1px solid #e7e5e4", background: "#f5f5f4" }}>
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={item.media.url}
                            alt=""
                            style={{
                              width: "100%",
                              height: "100%",
                              objectFit: "cover",
                              objectPosition: item.media.focalPoint || "center",
                            }}
                          />
                        </div>
                      ) : (
                        <div style={{ width: "68px", height: "88px", background: "#f5f5f4", border: "1px dashed #d6d3d1", borderRadius: "10px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "10px", color: "#a8a29e", textAlign: "center", padding: "4px" }}>
                          Kein Bild
                        </div>
                      )}
                    </td>
                    <td>
                      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                        <span style={{ fontWeight: 700, color: "#1c1917", fontSize: "1rem" }}>
                          {item.title}
                        </span>
                        {item.featured && (
                          <span style={{ fontSize: "10px", fontWeight: 700, padding: "2px 8px", borderRadius: "6px", background: "#fee2e2", color: "#991b1b" }}>
                            Startseite
                          </span>
                        )}
                      </div>
                      {item.note && (
                        <div style={{ fontSize: "0.8rem", color: "var(--muted)", marginTop: "2px", maxWidth: "340px" }}>
                          {item.note}
                        </div>
                      )}
                    </td>
                    <td>
                      <span style={{ fontSize: "0.85rem", color: "#44403c", fontWeight: 500 }}>
                        {item.collection?.title || "–"}
                      </span>
                    </td>
                    <td>
                      <div style={{ display: "flex", flexWrap: "wrap", gap: "4px", maxWidth: "260px" }}>
                        {item.outfitBrands.map((ob, idx) => (
                          <span
                            key={idx}
                            style={{
                              fontSize: "11px",
                              padding: "2px 6px",
                              background: "#f5f5f4",
                              border: "1px solid #e7e5e4",
                              borderRadius: "4px",
                              color: "#1c1917",
                            }}
                          >
                            {ob.brand.name}
                          </span>
                        ))}
                        {item.outfitCategoryAssignments.length > 0 && (
                          <span
                            style={{
                              fontSize: "11px",
                              padding: "2px 6px",
                              background: "#eff6ff",
                              border: "1px solid #dbeafe",
                              borderRadius: "4px",
                              color: "#1e40af",
                            }}
                          >
                            {item.outfitCategoryAssignments.length} {item.outfitCategoryAssignments.length === 1 ? "Filter" : "Filter"}
                          </span>
                        )}
                        {item.outfitBrands.length === 0 && item.outfitCategoryAssignments.length === 0 && (
                          <span style={{ fontSize: "0.8rem", color: "#a8a29e" }}>–</span>
                        )}
                      </div>
                    </td>
                    <td>
                      <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                        <div className={`status-dot ${item.active ? "status-dot-ready" : "status-dot-pending"}`}></div>
                        <span style={{ fontSize: "0.85rem", fontWeight: 500 }}>
                          {item.active ? "Veröffentlicht" : "Entwurf"}
                        </span>
                      </div>
                    </td>
                    <td style={{ textAlign: "right" }}>
                      <div className="table-actions" style={{ justifyContent: "flex-end" }}>
                        <Link href={`/admin/outfits/${item.id}`} className="table-action-btn" style={{ fontWeight: 600 }}>
                          Bearbeiten
                        </Link>
                        <form
                          action={async () => {
                            "use server";
                            await deleteOutfitAction(item.id);
                          }}
                        >
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
