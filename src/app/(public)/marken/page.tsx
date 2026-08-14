import Link from "next/link";
import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { StaggeredList } from "@/components/public/motion/staggered-list";
import { listPublishedBrands } from "@/lib/repositories/brands";
import { siteUrl } from "@/content/fixtures/checkpot";

const TITLE = "Unsere Marken | Checkpot Hietzing";
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

        <StaggeredList className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3" staggerDelay={50}>
          {activeBrands.map((brand) => (
            <Link
              key={brand.slug}
              href={`/marken/${brand.slug}`}
              className="group flex flex-col justify-between rounded-md bg-[#F9F9F8] p-8 transition-colors duration-150 ease-out hover:bg-[#E2E8F0] focus:outline-hidden focus-visible:ring-2 focus-visible:ring-[#C01718]"
            >
              <div>
                <h2 className="text-2xl font-normal tracking-tight text-[#1A1A1A] transition-colors group-hover:text-[#C01718] sm:text-3xl">
                  {brand.name}
                </h2>
                <div className="mt-5 h-[1px] w-12 bg-[#E2E8F0] transition-colors group-hover:bg-[#C01718]/30" />
                <p className="mt-5 text-[15px] leading-relaxed text-[#4A5568]">
                  {brand.summary}
                </p>
              </div>
              <div className="mt-10">
                <span className="inline-block text-[13px] font-medium uppercase tracking-[0.08em] text-[#1A1A1A] transition-colors group-hover:text-[#C01718]">
                  Kollektion ansehen <span aria-hidden="true" className="ml-1 inline-block transition-transform group-hover:translate-x-1">→</span>
                </span>
              </div>
            </Link>
          ))}
        </StaggeredList>
      </section>
    </div>
  );
}
