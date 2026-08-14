import Link from "next/link";
import { getDatabase } from "@/db";
import { brands } from "@/db/schema";
import { asc } from "drizzle-orm";
import { deleteBrandAction } from "./actions";

export const dynamic = "force-dynamic";

export default async function BrandsPage() {
  const database = getDatabase();
  const allBrands = await database.query.brands.findMany({
    orderBy: [asc(brands.sortOrder)],
  });

  return (
    <div className="dashboard-stack">
      <section className="page-intro" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <div className="eyebrow">Marken</div>
          <h1>Alle Marken</h1>
        </div>
        <Link href="/admin/brands/new" className="login-form button" style={{ display: "inline-flex", alignItems: "center", textDecoration: "none", padding: "0 18px", background: "var(--accent)", color: "white", borderRadius: "10px", minHeight: "44px", fontWeight: 700 }}>
          Marke hinzufügen
        </Link>
      </section>

      <section className="admin-panel">
        <div className="admin-table-container">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Slug</th>
                <th>Status</th>
                <th>Aktion</th>
              </tr>
            </thead>
            <tbody>
              {allBrands.length === 0 ? (
                <tr>
                  <td colSpan={4} style={{ textAlign: "center", color: "var(--muted)" }}>Keine Marken gefunden.</td>
                </tr>
              ) : (
                allBrands.map((brand) => (
                  <tr key={brand.id}>
                    <td style={{ fontWeight: 600 }}>{brand.name}</td>
                    <td style={{ color: "var(--muted)" }}>{brand.slug}</td>
                    <td>
                      <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                        <div className={`status-dot ${brand.active ? "status-dot-ready" : "status-dot-pending"}`}></div>
                        {brand.active ? "Veröffentlicht" : "Entwurf"}
                      </div>
                    </td>
                    <td>
                      <div className="table-actions">
                        <Link href={`/admin/brands/${brand.id}`} className="table-action-btn">
                          Bearbeiten
                        </Link>
                        <form action={async () => {
                          "use server";
                          await deleteBrandAction(brand.id);
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
