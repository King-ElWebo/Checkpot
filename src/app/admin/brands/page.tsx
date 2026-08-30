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
    with: {
      logo: true,
      image: true,
      outfitBrands: true,
    },
  });

  return (
    <div className="dashboard-stack">
      <section className="page-intro" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <div className="eyebrow">Marken</div>
          <h1>Alle Partnermarken</h1>
          <p className="text-sm text-[#78716c] mt-1">
            {allBrands.length} {allBrands.length === 1 ? "Marke" : "Marken"} im Sortiment von Checkpot.
          </p>
        </div>
        <Link
          href="/admin/brands/new"
          className="admin-primary-btn"
        >
          <span style={{ color: "#ffffff" }}>+ Neue Marke anlegen</span>
        </Link>
      </section>

      <section className="admin-panel">
        <div className="admin-table-container">
          <table className="admin-table">
            <thead>
              <tr>
                <th style={{ width: "80px" }}>Logo</th>
                <th>Markenname</th>
                <th>Titelbild</th>
                <th>Outfits</th>
                <th>Status</th>
                <th style={{ textAlign: "right" }}>Aktion</th>
              </tr>
            </thead>
            <tbody>
              {allBrands.length === 0 ? (
                <tr>
                  <td colSpan={6} style={{ textAlign: "center", padding: "40px", color: "var(--muted)" }}>
                    Keine Marken gefunden.
                  </td>
                </tr>
              ) : (
                allBrands.map((brand) => (
                  <tr key={brand.id}>
                    <td>
                      {brand.logo ? (
                        <div style={{ width: "56px", height: "40px", background: "white", border: "1px solid #e7e5e4", borderRadius: "8px", padding: "4px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={brand.logo.url}
                            alt={brand.name}
                            style={{ maxWidth: "100%", maxHeight: "100%", objectFit: "contain" }}
                          />
                        </div>
                      ) : (
                        <div style={{ width: "56px", height: "40px", background: "#f5f5f4", border: "1px dashed #d6d3d1", borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "10px", color: "#a8a29e" }}>
                          Kein Logo
                        </div>
                      )}
                    </td>
                    <td>
                      <div style={{ fontWeight: 700, color: "#1c1917", fontSize: "0.95rem" }}>
                        {brand.name}
                      </div>
                      <div style={{ fontSize: "0.8rem", color: "var(--muted)" }}>
                        /marken/{brand.slug}
                      </div>
                    </td>
                    <td>
                      {brand.image ? (
                        <div style={{ width: "64px", height: "40px", borderRadius: "8px", overflow: "hidden", border: "1px solid #e7e5e4" }}>
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={brand.image.url}
                            alt=""
                            style={{
                              width: "100%",
                              height: "100%",
                              objectFit: "cover",
                              objectPosition: brand.image.focalPoint || "center",
                            }}
                          />
                        </div>
                      ) : (
                        <span style={{ fontSize: "0.8rem", color: "#a8a29e" }}>–</span>
                      )}
                    </td>
                    <td>
                      <span style={{ fontSize: "0.85rem", color: "#44403c", fontWeight: 600 }}>
                        {brand.outfitBrands.length} {brand.outfitBrands.length === 1 ? "Look" : "Looks"}
                      </span>
                    </td>
                    <td>
                      <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                        <div className={`status-dot ${brand.active ? "status-dot-ready" : "status-dot-pending"}`}></div>
                        <span style={{ fontSize: "0.85rem", fontWeight: 500 }}>
                          {brand.active ? "Veröffentlicht" : "Entwurf"}
                        </span>
                      </div>
                    </td>
                    <td style={{ textAlign: "right" }}>
                      <div className="table-actions" style={{ justifyContent: "flex-end" }}>
                        <Link href={`/admin/brands/${brand.id}`} className="table-action-btn" style={{ fontWeight: 600 }}>
                          Bearbeiten
                        </Link>
                        <form
                          action={async () => {
                            "use server";
                            await deleteBrandAction(brand.id);
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
