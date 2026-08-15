import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { seoRoutes } from "@/content/fixtures/checkpot";
import { listPublishedOutfits } from "@/lib/repositories/outfits";

const seo = seoRoutes.find((r) => r.route === "/outfits")!;

export const metadata: Metadata = {
  title: seo.title,
  description: seo.description,
  alternates: {
    canonical: seo.canonical,
  },
};

const getOutfitLayout = (index: number) => {
  const mod = index % 5;
  switch (mod) {
    case 0: // Large left
      return {
        gridClass: "col-span-1 md:col-span-7 lg:col-span-7",
        aspectClass: "aspect-[4/5] lg:aspect-[4/3]",
        sizes: "(min-width: 1024px) 60vw, (min-width: 768px) 60vw, 100vw",
        textClass: "lg:w-3/4"
      };
    case 1: // Small right
      return {
        gridClass: "col-span-1 md:col-span-5 lg:col-span-4 lg:col-start-9 md:mt-16 lg:mt-32",
        aspectClass: "aspect-[3/4]",
        sizes: "(min-width: 1024px) 33vw, (min-width: 768px) 40vw, 100vw",
        textClass: ""
      };
    case 2: // Med left
      return {
        gridClass: "col-span-1 md:col-span-5 lg:col-span-5",
        aspectClass: "aspect-[3/4]",
        sizes: "(min-width: 1024px) 40vw, (min-width: 768px) 40vw, 100vw",
        textClass: ""
      };
    case 3: // Large right
      return {
        gridClass: "col-span-1 md:col-span-7 lg:col-span-6 lg:col-start-7 md:-mt-12 lg:-mt-24",
        aspectClass: "aspect-[4/5]",
        sizes: "(min-width: 1024px) 50vw, (min-width: 768px) 60vw, 100vw",
        textClass: ""
      };
    case 4: // Wide center
      return {
        gridClass: "col-span-1 md:col-span-12 lg:col-span-10 lg:col-start-2 lg:mt-12",
        aspectClass: "aspect-[4/5] md:aspect-[16/9] lg:aspect-[2/1]",
        sizes: "(min-width: 1024px) 80vw, 100vw",
        textClass: "md:w-2/3 lg:w-1/2 mx-auto text-center"
      };
  }
  return { gridClass: "", aspectClass: "", sizes: "", textClass: "" };
};

export default async function OutfitsPage() {
  const dbOutfits = await listPublishedOutfits();

  return (
    <div className="flex flex-col bg-[#F9F9F8]">
      <div className="mx-auto w-full max-w-[1400px] px-4 pt-12 lg:px-6">
        <Breadcrumbs
          items={[
            { label: "Startseite", href: "/" },
            { label: "Outfits", href: "/outfits" },
          ]}
        />
      </div>

      <section className="mx-auto w-full max-w-[1400px] px-4 py-12 lg:px-6 lg:py-20">
        
        {/* Strong but concise opening */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-end mb-16 lg:mb-24">
          <div className="lg:col-span-6">
            <h1 className="font-display text-5xl lg:text-7xl text-[#1A1A1A] tracking-tight mb-6">
              Unsere Looks
            </h1>
            <p className="text-xl text-[#1A1A1A] font-medium leading-relaxed">
              Inspirationen aus dem Checkpot.
            </p>
          </div>
          <div className="lg:col-span-5 lg:col-start-8">
            <p className="text-[#4A5568] leading-relaxed text-[15px]">
              Wir zeigen Ihnen, wie Mode wirkt, wenn sie richtig kombiniert wird. Alle Stücke können Sie direkt bei uns im Geschäft in Hietzing entdecken und anprobieren. Wir beraten Sie gerne persönlich.
            </p>
          </div>
        </div>

        {dbOutfits.length > 0 ? (
          <div className="grid grid-cols-1 gap-y-20 gap-x-8 md:grid-cols-12 lg:gap-y-32 lg:gap-x-12">
            {dbOutfits.map((outfit, index) => {
              const { gridClass, aspectClass, sizes, textClass } = getOutfitLayout(index);
              
              const activeBrands = outfit.outfitBrands
                ?.map(ob => ob.brand)
                .filter(b => b?.active) || [];

              return (
                <div key={outfit.id} className={`group flex flex-col ${gridClass}`}>
                  <div className={`relative w-full overflow-hidden bg-[#E2E8F0] rounded-sm mb-6 ${aspectClass}`}>
                    {outfit.media && (
                      <Image
                        src={outfit.media.url}
                        alt={outfit.media.alt || outfit.title}
                        fill
                        sizes={sizes}
                        className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.02]"
                        style={outfit.media.focalPoint ? { objectPosition: outfit.media.focalPoint } : {}}
                      />
                    )}
                  </div>
                  
                  <div className={`flex flex-col items-start ${textClass} ${index % 5 === 4 ? 'items-center' : ''}`}>
                    {outfit.collection?.season && (
                      <span className="mb-4 text-[12px] font-medium uppercase tracking-[0.08em] text-[#C01718]">
                        {outfit.collection.season}
                      </span>
                    )}
                    
                    <h2 className="font-display text-3xl lg:text-4xl text-[#1A1A1A] mb-4">
                      {outfit.title}
                    </h2>
                    
                    {outfit.note && (
                      <p className="text-[15px] leading-relaxed text-[#4A5568] mb-6">
                        {outfit.note}
                      </p>
                    )}

                    {outfit.availabilityNote && (
                      <p className="text-[13px] font-medium uppercase tracking-[0.08em] text-[#1A1A1A] mb-6 border-l-2 border-[#C01718] pl-3 py-1 bg-white">
                        {outfit.availabilityNote}
                      </p>
                    )}
                    
                    {activeBrands.length > 0 && (
                      <div className="mt-auto text-[14px] text-[#4A5568]">
                        Mit {activeBrands.map((b, i) => {
                          const isLast = i === activeBrands.length - 1;
                          const isSecondToLast = i === activeBrands.length - 2;
                          return (
                            <span key={b.slug}>
                              <Link 
                                href={`/marken/${b.slug}`} 
                                className="underline decoration-1 underline-offset-4 hover:text-[#C01718] transition-colors focus:outline-hidden focus-visible:ring-2 focus-visible:ring-[#C01718] rounded-sm"
                              >
                                {b.name}
                              </Link>
                              {isSecondToLast ? " & " : isLast ? "" : ", "}
                            </span>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center rounded-sm border border-dashed border-[#E2E8F0] bg-white py-32 text-center">
            <h2 className="mb-4 font-display text-3xl text-[#1A1A1A]">
              Neue Outfits in Vorbereitung
            </h2>
            <p className="mb-8 text-lg text-[#4A5568] max-w-lg">
              Wir stellen gerade neue Kombinationen für Sie zusammen. Besuchen Sie uns in der Zwischenzeit gerne im Geschäft, um die neuesten Stücke zu entdecken.
            </p>
            <Link
              href="/kontakt"
              className="inline-flex items-center justify-center rounded-sm bg-[#1A1A1A] px-8 py-4 text-[13px] uppercase tracking-[0.08em] font-medium text-white transition-colors duration-200 ease-out hover:bg-[#C01718] focus:outline-hidden focus-visible:ring-2 focus-visible:ring-[#C01718] focus-visible:ring-offset-2"
            >
              Besuch planen
            </Link>
          </div>
        )}
      </section>
    </div>
  );
}
