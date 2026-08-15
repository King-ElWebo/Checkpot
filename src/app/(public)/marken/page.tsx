import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { StaggeredList } from "@/components/public/motion/staggered-list";
import { listPublishedBrands } from "@/lib/repositories/brands";

const DESCRIPTION = "Ausgewählte, faire und nachhaltige Modemarken bei Checkpot Hietzing.";
const CANONICAL = "/marken";

export const metadata: Metadata = {
  title: "Unsere Marken",
  description: DESCRIPTION,
  alternates: {
    canonical: CANONICAL,
  },
};

export default async function MarkenPage() {
  const activeBrands = await listPublishedBrands();

  return (
    <div className="flex flex-col">
      <div className="mx-auto w-full max-w-[1400px] px-4 pt-12 lg:px-6">
        <Breadcrumbs
          items={[
            { label: "Startseite", href: "/" },
            { label: "Marken", href: "/marken" },
          ]}
        />
      </div>

      <section className="mx-auto w-full max-w-[1400px] px-4 py-16 lg:px-6 lg:py-24">
        <div className="mx-auto mb-16 max-w-3xl text-center lg:mb-24">
          <span className="mb-4 block text-[13px] font-medium uppercase tracking-[0.08em] text-[#4A5568]">
            Unsere Partner
          </span>
          <h1 className="text-4xl font-normal leading-[1.1] tracking-tight text-[#1A1A1A] sm:text-5xl lg:text-6xl">
            Unsere Marken
          </h1>
          <p className="mt-8 text-lg leading-relaxed text-[#4A5568] sm:text-xl">
            Wir wählen unsere Labels sorgfältig nach Qualität, Passform und Stil aus. Viele 
            unserer Marken produzieren zudem nachhaltig und fair in Europa.
          </p>
        </div>

        <StaggeredList className="grid grid-cols-1 gap-x-8 gap-y-16 md:grid-cols-2 lg:grid-cols-3 lg:gap-y-24" staggerDelay={50}>
          {activeBrands.map((brand, index) => {
            const isFeatured = index % 5 === 0;
            return (
              <Link
                key={brand.slug}
                href={`/marken/${brand.slug}`}
                className={`group flex focus:outline-hidden focus-visible:ring-2 focus-visible:ring-[#C01718] focus-visible:ring-offset-4 rounded-sm ${
                  isFeatured 
                    ? "flex-col md:col-span-2 md:flex-row items-start md:items-center gap-8 lg:gap-16" 
                    : "flex-col items-start gap-6"
                }`}
              >
                {/* Visual Container */}
                <div className={`relative overflow-hidden bg-[#F9F9F8] rounded-sm shrink-0 w-full ${
                  isFeatured ? "md:w-[55%] aspect-[4/5] lg:aspect-[4/5]" : "aspect-[3/4]"
                }`}>
                  {brand.image ? (
                    <Image
                      src={brand.image.url}
                      alt={brand.image.alt || brand.name}
                      fill
                      sizes={isFeatured ? "(min-width: 1024px) 66vw, 100vw" : "(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"}
                      className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                      style={{ objectPosition: brand.image.focalPoint || "center" }}
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center p-12 text-center">
                      {brand.logo ? (
                        <div className="relative w-full h-16 opacity-40 transition-opacity duration-300 group-hover:opacity-80">
                          <Image src={brand.logo.url} alt={brand.logo.alt || brand.name} fill className="object-contain object-center" />
                        </div>
                      ) : (
                        <span className="font-display text-4xl text-[#1A1A1A]/30">{brand.name}</span>
                      )}
                    </div>
                  )}
                </div>

                {/* Text / Identity */}
                <div className={`flex flex-col items-start ${isFeatured ? "md:w-[45%] py-4 md:py-0" : "w-full"}`}>
                  {brand.logo ? (
                    <div className={`relative mb-6 w-3/4 max-w-[180px] ${isFeatured ? 'h-12' : 'h-10'}`}>
                      <Image 
                        src={brand.logo.url} 
                        alt={brand.logo.alt || brand.name} 
                        fill 
                        className="object-contain object-left" 
                      />
                    </div>
                  ) : (
                    <h2 className={`mb-4 font-display text-[#1A1A1A] transition-colors group-hover:text-[#C01718] ${isFeatured ? 'text-4xl lg:text-5xl' : 'text-3xl'}`}>
                      {brand.name}
                    </h2>
                  )}
                  
                  {brand.summary && (
                    <p className={`mb-8 leading-relaxed text-[#4A5568] ${isFeatured ? 'text-lg line-clamp-4' : 'text-[15px] line-clamp-3'}`}>
                      {brand.summary}
                    </p>
                  )}

                  <span className="mt-auto inline-flex items-center text-[13px] font-medium uppercase tracking-[0.08em] text-[#1A1A1A] transition-colors group-hover:text-[#C01718]">
                    Kollektion ansehen <span aria-hidden="true" className="ml-2 transition-transform group-hover:translate-x-1">→</span>
                  </span>
                </div>
              </Link>
            );
          })}
        </StaggeredList>
      </section>
    </div>
  );
}
