import type { Metadata } from "next";
import Link from "next/link";
import { getDatabase } from "@/db";
import { outfits, brands, media, collections } from "@/db/schema";
import { count, eq, desc } from "drizzle-orm";

export const metadata: Metadata = {
  title: "Admin Dashboard | Checkpot",
};

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const database = getDatabase();

  const [
    totalOutfits,
    activeOutfits,
    totalBrands,
    activeBrands,
    totalMedia,
    totalCollections,
    recentOutfits,
  ] = await Promise.all([
    database.select({ count: count() }).from(outfits).then((r) => r[0]?.count || 0),
    database
      .select({ count: count() })
      .from(outfits)
      .where(eq(outfits.active, true))
      .then((r) => r[0]?.count || 0),
    database.select({ count: count() }).from(brands).then((r) => r[0]?.count || 0),
    database
      .select({ count: count() })
      .from(brands)
      .where(eq(brands.active, true))
      .then((r) => r[0]?.count || 0),
    database.select({ count: count() }).from(media).then((r) => r[0]?.count || 0),
    database.select({ count: count() }).from(collections).then((r) => r[0]?.count || 0),
    database.query.outfits.findMany({
      limit: 4,
      orderBy: [desc(outfits.createdAt)],
      with: { media: true },
    }),
  ]);

  return (
    <div className="dashboard-stack">
      {/* Intro & Welcome */}
      <section className="page-intro">
        <div className="eyebrow">Boutique CMS</div>
        <h1>Willkommen bei Checkpot Admin</h1>
        <p className="text-sm text-[#78716c] mt-1">
          Verwalten Sie Outfits, Marken und Mediathek für das Modegeschäft in Wien Hietzing.
        </p>
      </section>

      {/* Quick Action Cards */}
      <section className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Link
          href="/admin/outfits/new"
          className="group flex flex-col p-6 bg-white border border-[#e7e5e4] hover:border-[#C01718] hover:shadow-md rounded-2xl transition-all"
        >
          <div className="w-10 h-10 rounded-xl bg-[#fee2e2] text-[#C01718] flex items-center justify-center font-bold text-lg mb-3 group-hover:scale-105 transition-transform">
            +
          </div>
          <h3 className="font-bold text-base text-[#1c1917] group-hover:text-[#C01718] transition-colors">
            Neues Outfit anlegen
          </h3>
          <p className="text-xs text-[#78716c] mt-1">
            Foto hochladen, Marken und Filter zuweisen und im Lookbook veröffentlichen.
          </p>
        </Link>

        <Link
          href="/admin/brands/new"
          className="group flex flex-col p-6 bg-white border border-[#e7e5e4] hover:border-[#C01718] hover:shadow-md rounded-2xl transition-all"
        >
          <div className="w-10 h-10 rounded-xl bg-[#f5f5f4] text-[#1c1917] flex items-center justify-center font-bold text-lg mb-3 group-hover:scale-105 transition-transform">
            +
          </div>
          <h3 className="font-bold text-base text-[#1c1917] group-hover:text-[#C01718] transition-colors">
            Neue Marke anlegen
          </h3>
          <p className="text-xs text-[#78716c] mt-1">
            Logo und Beschreibung für eine Modemarke hinzufügen.
          </p>
        </Link>

        <Link
          href="/admin/media"
          className="group flex flex-col p-6 bg-white border border-[#e7e5e4] hover:border-[#C01718] hover:shadow-md rounded-2xl transition-all"
        >
          <div className="w-10 h-10 rounded-xl bg-[#f5f5f4] text-[#1c1917] flex items-center justify-center font-bold text-lg mb-3 group-hover:scale-105 transition-transform">
            📁
          </div>
          <h3 className="font-bold text-base text-[#1c1917] group-hover:text-[#C01718] transition-colors">
            Mediathek öffnen
          </h3>
          <p className="text-xs text-[#78716c] mt-1">
            Mehrere Bilder per Drag & Drop hochladen und Bildfokus anpassen.
          </p>
        </Link>
      </section>

      {/* Metrics Grid */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-4" aria-label="CMS Übersicht">
        <div className="p-5 bg-white border border-[#e7e5e4] rounded-xl flex flex-col">
          <span className="text-xs font-semibold uppercase tracking-wider text-[#78716c]">
            Aktive Outfits
          </span>
          <span className="text-3xl font-extrabold text-[#1c1917] mt-2">
            {activeOutfits}
            <span className="text-sm font-normal text-[#a8a29e] ml-1.5">/ {totalOutfits}</span>
          </span>
        </div>

        <div className="p-5 bg-white border border-[#e7e5e4] rounded-xl flex flex-col">
          <span className="text-xs font-semibold uppercase tracking-wider text-[#78716c]">
            Marken
          </span>
          <span className="text-3xl font-extrabold text-[#1c1917] mt-2">
            {activeBrands}
            <span className="text-sm font-normal text-[#a8a29e] ml-1.5">/ {totalBrands}</span>
          </span>
        </div>

        <div className="p-5 bg-white border border-[#e7e5e4] rounded-xl flex flex-col">
          <span className="text-xs font-semibold uppercase tracking-wider text-[#78716c]">
            Bilder in Mediathek
          </span>
          <span className="text-3xl font-extrabold text-[#1c1917] mt-2">
            {totalMedia}
          </span>
        </div>

        <div className="p-5 bg-white border border-[#e7e5e4] rounded-xl flex flex-col">
          <span className="text-xs font-semibold uppercase tracking-wider text-[#78716c]">
            Kollektionen
          </span>
          <span className="text-3xl font-extrabold text-[#1c1917] mt-2">
            {totalCollections}
          </span>
        </div>
      </section>

      {/* Recent Outfits Quick Grid */}
      <section className="admin-panel p-6 flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-[#1c1917]">Zuletzt bearbeitete Outfits</h2>
          <Link href="/admin/outfits" className="text-xs font-semibold text-[#C01718] hover:underline">
            Alle anzeigen →
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {recentOutfits.map((outfit) => (
            <Link
              key={outfit.id}
              href={`/admin/outfits/${outfit.id}`}
              className="group flex flex-col rounded-xl overflow-hidden border border-[#e7e5e4] bg-[#fafaf9] hover:border-[#1c1917] hover:shadow-xs transition-all"
            >
              <div className="relative aspect-[3/4] w-full overflow-hidden bg-white">
                {outfit.media ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={outfit.media.url}
                    alt={outfit.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                    style={{
                      objectPosition: outfit.media.focalPoint || "center",
                    }}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-xs text-[#a8a29e]">
                    Kein Bild
                  </div>
                )}
              </div>
              <div className="p-2.5 flex flex-col">
                <span className="text-xs font-bold text-[#1c1917] truncate group-hover:text-[#C01718]">
                  {outfit.title}
                </span>
                <span className="text-[10px] text-[#78716c]">
                  {outfit.active ? "Veröffentlicht" : "Entwurf"}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
