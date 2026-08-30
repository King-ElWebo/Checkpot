import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { listPublishedBrands } from "@/lib/repositories/brands";

const DESCRIPTION = "Ausgewählte Modemarken bei Checkpot in Wien Hietzing entdecken.";
const CANONICAL = "/marken";

export const metadata: Metadata = {
  title: "Unsere Marken",
  description: DESCRIPTION,
  alternates: {
    canonical: CANONICAL,
  },
};

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function MarkenPage() {
  const activeBrands = await listPublishedBrands();

  return (
    <div className="flex flex-col bg-white">
      {/* Top Breadcrumb Navigation */}
      <div className="mx-auto w-full max-w-[1240px] px-6 pt-8 sm:px-8 lg:pt-12">
        <Breadcrumbs
          items={[
            { label: "Startseite", href: "/" },
            { label: "Marken", href: "/marken" },
          ]}
        />
      </div>

      {/* Main Brands Section */}
      <section className="mx-auto w-full max-w-[1240px] px-6 pb-20 pt-8 sm:px-8 lg:pb-32 lg:pt-12">
        {/* Editorial Heading */}
        <div className="mx-auto mb-16 max-w-2xl text-center lg:mb-24">
          <span className="mb-3 block text-[13px] font-medium uppercase tracking-[0.08em] text-[#C01718]">
            Boutique Wien-Hietzing
          </span>
          <h1 className="font-display text-4xl font-normal leading-[1.1] tracking-tight text-[#1A1A1A] sm:text-5xl lg:text-6xl">
            Unsere Marken
          </h1>
          <p className="mt-6 text-lg leading-relaxed text-[#4A5568] sm:text-xl">
            Wir wählen unsere Modelabels sorgfältig nach Qualität, Passform und individuellem Stil aus.
            Entdecken Sie unsere Markenauswahl direkt vor Ort in Wien Hietzing.
          </p>
        </div>

        {/* 3-Column Responsive Grid */}
        <div className="grid grid-cols-1 gap-x-8 gap-y-16 md:grid-cols-2 lg:grid-cols-3 lg:gap-x-10 lg:gap-y-24">
          {activeBrands.map((brand) => (
            <Link
              key={brand.slug}
              href={`/marken/${brand.slug}`}
              className="group flex flex-col focus:outline-hidden focus-visible:ring-2 focus-visible:ring-[#C01718] focus-visible:ring-offset-4 rounded-sm"
            >
              {/* Visual Area */}
              <div className="relative w-full overflow-hidden rounded-sm bg-[#F7F6F3] border border-[#ECEAE4] aspect-[16/10]">
                {brand.image ? (
                  <Image
                    src={brand.image.url}
                    alt={brand.image.alt || brand.name}
                    fill
                    sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.02]"
                    style={{ objectPosition: brand.image.focalPoint || "center" }}
                  />
                ) : (
                  <div className="flex h-full w-full flex-col items-center justify-center p-6 text-center select-none">
                    <span className="font-display text-2xl tracking-tight text-[#1A1A1A]/75 transition-colors duration-300 group-hover:text-[#C01718] sm:text-[26px]">
                      {brand.name}
                    </span>
                    <span className="mt-2 text-[11px] font-medium uppercase tracking-[0.12em] text-[#718096]/70">
                      Kollektion in Hietzing
                    </span>
                  </div>
                )}
              </div>

              {/* Identity & Content */}
              <div className="mt-6 flex flex-1 flex-col items-start">
                <h2 className="font-display text-2xl font-normal tracking-tight text-[#1A1A1A] transition-colors duration-200 group-hover:text-[#C01718] sm:text-[26px] lg:text-[28px]">
                  {brand.name}
                </h2>

                {brand.summary && (
                  <p className="mt-2.5 leading-relaxed text-[#4A5568] text-[15px] sm:text-[16px] max-w-[440px]">
                    {brand.summary}
                  </p>
                )}

                <div className="mt-6 pt-1">
                  <span className="inline-flex items-center text-[13px] font-medium uppercase tracking-[0.08em] text-[#1A1A1A] transition-colors duration-200 group-hover:text-[#C01718]">
                    Kollektion ansehen{" "}
                    <span aria-hidden="true" className="ml-2 transition-transform duration-200 group-hover:translate-x-1">
                      →
                    </span>
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}

