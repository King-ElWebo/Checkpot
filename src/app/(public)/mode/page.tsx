import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { seoRoutes } from "@/content/fixtures/checkpot";
import { listPublishedCollections } from "@/lib/repositories/collections";

const seo = seoRoutes.find((r) => r.route === "/mode")!;

export const metadata: Metadata = {
  title: seo.title,
  description: seo.description,
  alternates: {
    canonical: seo.canonical,
  },
};

export default async function ModePage() {
  const collections = await listPublishedCollections();
  const currentCollection = collections.find(c => c.featured) || collections[0];

  if (!currentCollection) {
    return (
      <div className="flex flex-col items-center py-32">
        <h1 className="font-display text-3xl font-medium text-[#1A1A1A]">Derzeit keine aktuelle Kollektion</h1>
      </div>
    );
  }

  const images = currentCollection.outfits.map(o => o.media).filter(Boolean);

  return (
    <div className="flex flex-col bg-white">
      <div className="mx-auto w-full max-w-[1400px] px-4 pt-12 lg:px-6">
        <Breadcrumbs
          items={[
            { label: "Startseite", href: "/" },
            { label: "Mode", href: "/mode" },
          ]}
        />
      </div>

      <section className="mx-auto w-full max-w-[1400px] px-4 py-16 lg:px-6 lg:py-24">
        <div className="mb-16 lg:mb-24 flex flex-col items-center text-center max-w-4xl mx-auto">
          {currentCollection.season && (
            <span className="mb-6 block text-[13px] font-medium uppercase tracking-[0.08em] text-[#C01718]">
              {currentCollection.season}
            </span>
          )}
          <h1 className="font-display text-5xl lg:text-7xl text-[#1A1A1A] tracking-tight mb-8">
            {currentCollection.title}
          </h1>
          {currentCollection.intro && (
            <p className="text-xl lg:text-2xl text-[#4A5568] leading-relaxed max-w-2xl">
              {currentCollection.intro}
            </p>
          )}
        </div>

        {images.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-12">
            {images.map((image, i) => {
              // Creating a varied editorial layout without StaggeredList
              const isLarge = i % 3 === 0;
              const colSpan = isLarge ? "lg:col-span-8" : "lg:col-span-4";
              const aspect = isLarge ? "aspect-[4/3] lg:aspect-[16/9]" : "aspect-[3/4]";
              
              if (!image) return null;

              return (
                <div key={image.id} className={`${colSpan} flex flex-col group`}>
                  <div className={`relative w-full overflow-hidden rounded-sm bg-[#E2E8F0] ${aspect}`}>
                    <Image
                      src={image.url}
                      alt={image.alt || ""}
                      fill
                      sizes={isLarge ? "(min-width: 1024px) 66vw, 100vw" : "(min-width: 1024px) 33vw, 50vw"}
                      className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                      style={image.focalPoint ? { objectPosition: image.focalPoint } : {}}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        )}
        
        <div className="mt-24 lg:mt-32 border-t border-[#E2E8F0] pt-16 lg:pt-20 flex flex-col lg:flex-row items-center justify-between gap-12">
          <div className="lg:max-w-xl">
            <h2 className="font-display text-3xl text-[#1A1A1A] mb-4">Lassen Sie sich inspirieren</h2>
            <p className="text-[17px] text-[#4A5568] leading-relaxed">
              Unsere Kollektionen werden regelmäßig erneuert. Besuchen Sie uns im Geschäft in Hietzing, um die aktuelle Verfügbarkeit zu prüfen, die Stoffe zu fühlen und neue Lieblingsstücke zu entdecken.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
            <Link
              href="/outfits"
              className="inline-flex items-center justify-center rounded-sm bg-[#1A1A1A] px-8 py-4 text-[13px] uppercase tracking-[0.08em] font-medium text-white transition-colors duration-200 ease-out hover:bg-[#333333] focus:outline-hidden focus-visible:ring-2 focus-visible:ring-[#1A1A1A] focus-visible:ring-offset-2"
            >
              Outfit Inspirationen
            </Link>
            <Link
              href="/kontakt"
              className="inline-flex items-center justify-center rounded-sm border border-[#E2E8F0] bg-white px-8 py-4 text-[13px] uppercase tracking-[0.08em] font-medium text-[#1A1A1A] transition-colors duration-200 ease-out hover:bg-[#F9F9F8] hover:border-[#1A1A1A] focus:outline-hidden focus-visible:ring-2 focus-visible:ring-[#1A1A1A] focus-visible:ring-offset-2"
            >
              Geschäft besuchen
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
