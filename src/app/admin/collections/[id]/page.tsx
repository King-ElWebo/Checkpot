import Link from "next/link";
import { redirect } from "next/navigation";
import { getDatabase } from "@/db";
import { collections } from "@/db/schema";
import { eq } from "drizzle-orm";
import { saveCollectionAction } from "../actions";

export const dynamic = "force-dynamic";

export default async function CollectionEditPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const isNew = id === "new";
  const database = getDatabase();

  const item = !isNew
    ? (await database.query.collections.findFirst({
        where: eq(collections.id, id),
      })) ?? null
    : null;

  if (!isNew && !item) {
    redirect("/admin/collections");
  }

  async function handleSave(formData: FormData) {
    "use server";
    await saveCollectionAction(isNew ? null : id, formData);
    redirect("/admin/collections");
  }

  return (
    <div className="dashboard-stack">
      <section className="page-intro">
        <div className="eyebrow">Kollektionen</div>
        <h1>{isNew ? "Neue Kollektion" : "Kollektion bearbeiten"}</h1>
        <p className="text-xs text-[#78716c] mt-1">
          Kuratierte Kollektion für die Mode-Übersicht auf der Website.
        </p>
      </section>

      <form action={handleSave} className="flex flex-col gap-8 max-w-[880px]">
        <section className="admin-panel p-6 sm:p-8 flex flex-col gap-6">
          <div className="field-group">
            <label htmlFor="title">Titel *</label>
            <input
              type="text"
              id="title"
              name="title"
              defaultValue={item?.title || ""}
              placeholder="z.B. Frühjahrskollektion"
              required
            />
          </div>

          <div className="field-group">
            <label htmlFor="season">Saison (z.B. Frühjahr/Sommer 2026)</label>
            <input
              type="text"
              id="season"
              name="season"
              defaultValue={item?.season || ""}
              placeholder="z.B. Frühjahr / Sommer 2026"
            />
          </div>

          <div className="field-group">
            <label htmlFor="intro">Einleitungstext</label>
            <textarea
              id="intro"
              name="intro"
              defaultValue={item?.intro || ""}
              rows={5}
              placeholder="Kurze redaktionelle Beschreibung der Kollektion..."
              className="w-full border border-[#d6d3d1] focus:border-[#1c1917] rounded-xl p-3.5 bg-white text-sm text-[#1c1917] focus:outline-hidden transition-colors"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 items-start pt-2">
            <div className="field-group">
              <label htmlFor="active">Sichtbarkeit</label>
              <label
                htmlFor="active"
                className="h-[46px] min-h-[46px] px-3.5 bg-[#fafaf9] hover:bg-[#f5f5f4] border border-[#d6d3d1] hover:border-[#a8a29e] rounded-xl flex items-center gap-3 cursor-pointer transition-colors"
              >
                <input
                  type="checkbox"
                  id="active"
                  name="active"
                  value="true"
                  defaultChecked={item?.active}
                  className="w-4 h-4 rounded text-[#C01718] focus:ring-[#C01718] cursor-pointer"
                />
                <span className="text-sm font-medium text-[#1c1917]">Veröffentlicht</span>
              </label>
            </div>

            <div className="field-group">
              <label htmlFor="featured">Hervorhebung</label>
              <label
                htmlFor="featured"
                className="h-[46px] min-h-[46px] px-3.5 bg-[#fafaf9] hover:bg-[#f5f5f4] border border-[#d6d3d1] hover:border-[#a8a29e] rounded-xl flex items-center gap-3 cursor-pointer transition-colors"
              >
                <input
                  type="checkbox"
                  id="featured"
                  name="featured"
                  value="true"
                  defaultChecked={item?.featured}
                  className="w-4 h-4 rounded text-[#C01718] focus:ring-[#C01718] cursor-pointer"
                />
                <span className="text-sm font-medium text-[#1c1917]">Hervorgehoben</span>
              </label>
            </div>

            <div className="field-group">
              <label htmlFor="sortOrder">Sortierreihenfolge</label>
              <input
                type="number"
                id="sortOrder"
                name="sortOrder"
                defaultValue={item?.sortOrder || 0}
                placeholder="0"
              />
            </div>
          </div>
        </section>

        {/* Action Buttons */}
        <div className="flex items-center gap-3 pt-2">
          <button
            type="submit"
            className="flex-1 h-12 py-0 px-6 rounded-xl bg-[#292524] text-white font-bold hover:bg-[#44403c] transition-colors shadow-sm cursor-pointer flex items-center justify-center text-sm"
          >
            Kollektion speichern
          </button>
          <Link
            href="/admin/collections"
            className="h-12 py-0 px-6 rounded-xl border border-[#d6d3d1] hover:border-[#a8a29e] bg-white hover:bg-[#fafaf9] text-[#1c1917] font-semibold flex items-center justify-center text-center transition-colors text-sm"
          >
            Abbrechen
          </Link>
        </div>
      </form>
    </div>
  );
}
