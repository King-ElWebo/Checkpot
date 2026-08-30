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
      <section className="page-intro flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="eyebrow">Taxonomie</div>
          <h1>Outfit-Kategorien</h1>
          <p className="text-xs text-[#78716c] mt-1">
            Verwalten Sie Filtergruppen (z.B. Saison, Stil, Farbwelt) und die zugehörigen Kategorien für das Lookbook.
          </p>
        </div>
        <Link
          href="/admin/outfit-categories/groups/new"
          className="admin-primary-btn"
        >
          <span style={{ color: "#ffffff" }}>+ Gruppe hinzufügen</span>
        </Link>
      </section>

      {groups.length === 0 ? (
        <section className="admin-panel p-10 text-center text-[#78716c] text-sm">
          Keine Kategorie-Gruppen gefunden.
        </section>
      ) : (
        groups.map((group) => (
          <section key={group.id} className="admin-panel mb-8 overflow-hidden">
            {/* Group Header */}
            <div className="p-5 border-b border-[#e7e5e4] flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#fafaf9]">
              <div>
                <h2 className="text-base font-bold text-[#1c1917] flex items-center gap-2 m-0">
                  {group.name}
                  {!group.active && (
                    <span className="px-2 py-0.5 text-[11px] font-semibold rounded-md bg-red-100 text-red-800">
                      Inaktiv
                    </span>
                  )}
                </h2>
                <div className="text-xs text-[#78716c] mt-0.5">Slug: {group.slug}</div>
              </div>

              {/* Group Action Buttons */}
              <div className="table-actions">
                <Link
                  href={`/admin/outfit-categories/groups/${group.id}`}
                  className="table-action-btn"
                >
                  Gruppe bearbeiten
                </Link>
                <form
                  action={async () => {
                    "use server";
                    await deleteGroupAction(group.id);
                  }}
                >
                  <button
                    type="submit"
                    className="table-action-btn table-action-delete"
                  >
                    Löschen
                  </button>
                </form>
                <Link
                  href={`/admin/outfit-categories/categories/new?groupId=${group.id}`}
                  className="table-action-btn table-action-primary"
                >
                  <span style={{ color: "#ffffff" }}>+ Kategorie</span>
                </Link>
              </div>
            </div>

            {/* Categories Table */}
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
                      <td colSpan={5} className="text-center text-[#78716c] py-6 text-xs">
                        Keine Kategorien in dieser Gruppe.
                      </td>
                    </tr>
                  ) : (
                    group.categories
                      .sort((a, b) => a.sortOrder - b.sortOrder)
                      .map((cat) => (
                        <tr key={cat.id}>
                          <td className="font-semibold text-[#1c1917]">{cat.name}</td>
                          <td className="text-[#78716c] font-mono text-xs">{cat.slug}</td>
                          <td className="text-[#78716c]">{cat.sortOrder}</td>
                          <td>
                            <div className="flex items-center gap-2">
                              <div
                                className={`w-2 h-2 rounded-full ${
                                  cat.active ? "bg-emerald-500" : "bg-amber-500"
                                }`}
                              ></div>
                              <span className="text-xs font-medium text-[#1c1917]">
                                {cat.active ? "Aktiv" : "Inaktiv"}
                              </span>
                            </div>
                          </td>
                          <td>
                            <div className="table-actions">
                              <Link
                                href={`/admin/outfit-categories/categories/${cat.id}`}
                                className="table-action-btn"
                              >
                                Bearbeiten
                              </Link>
                              <form
                                action={async () => {
                                  "use server";
                                  await deleteCategoryAction(cat.id);
                                }}
                              >
                                <button
                                  type="submit"
                                  className="table-action-btn table-action-delete"
                                >
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
