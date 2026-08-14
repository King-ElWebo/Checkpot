import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { FadeIn } from "@/components/public/motion/fade-in";
import { StaggeredList } from "@/components/public/motion/staggered-list";
import { currentCollection, seoRoutes } from "@/content/fixtures/checkpot";

const seo = seoRoutes.find((r) => r.route === "/mode")!;

export const metadata: Metadata = {
  title: seo.title,
  description: seo.description,
  alternates: {
    canonical: seo.canonical,
  },
};

export default function ModePage() {
  return (
    <div className="flex flex-col">
      <div className="mx-auto w-full max-w-[1400px] px-4 pt-12 lg:px-6">
        <Breadcrumbs
          items={[
            { label: "Startseite", href: "/" },
            { label: "Mode", href: "/mode" },
          ]}
        />
      </div>

      <section className="mx-auto w-full max-w-[1400px] px-4 py-16 lg:px-6 lg:py-24">
        <div className="mx-auto max-w-3xl text-center">
          <span className="mb-4 block text-[13px] font-medium uppercase tracking-[0.08em] text-[#C01718]">
            {currentCollection.season}
          </span>
          <h1 className="mb-6 text-4xl font-normal leading-[1.1] tracking-tight text-[#1A1A1A] sm:text-5xl lg:text-6xl">
            {currentCollection.title}
          </h1>
          <p className="mt-8 text-lg leading-relaxed text-[#4A5568] sm:text-xl">
            {currentCollection.intro}
          </p>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/outfits"
              className="inline-flex items-center justify-center rounded-md bg-[#C01718] px-8 py-3.5 text-[15px] font-medium text-white transition-colors duration-150 ease-out hover:bg-[#A01314] focus:outline-hidden focus-visible:ring-2 focus-visible:ring-[#C01718] focus-visible:ring-offset-2"
            >
              Outfit Inspirationen
            </Link>
            <Link
              href="/kontakt"
              className="inline-flex items-center justify-center rounded-md bg-[#F9F9F8] px-8 py-3.5 text-[15px] font-medium text-[#1A1A1A] transition-colors duration-150 ease-out hover:bg-[#E2E8F0] focus:outline-hidden focus-visible:ring-2 focus-visible:ring-[#1A1A1A] focus-visible:ring-offset-2"
            >
              Geschäft besuchen
            </Link>
          </div>
        </div>

        <StaggeredList className="mt-20 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 lg:gap-12" staggerDelay={100}>
          {currentCollection.images.map((image) => (
            <div key={image.src} className="flex flex-col group">
              <div className="relative aspect-[3/4] w-full overflow-hidden rounded-md bg-[#F9F9F8]">
                <Image
                  src={image.src}
                  alt={image.alt}
                  fill
                  sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                  className="object-cover transition-transform duration-500 ease-out hover:scale-[1.02]"
                  style={{ objectPosition: image.objectPosition }}
                />
              </div>
            </div>
          ))}
        </StaggeredList>
        
        <FadeIn delay={300} className="mt-24 border-t border-[#E2E8F0] pt-12 text-center">
          <p className="text-[15px] text-[#4A5568] max-w-2xl mx-auto">
            Unsere Kollektionen werden regelmäßig erneuert. Die hier gezeigten Bilder dienen der Inspiration.
            Besuchen Sie uns im Geschäft, um die aktuelle Verfügbarkeit zu prüfen und neue Lieblingsstücke zu entdecken.
          </p>
        </FadeIn>
      </section>
    </div>
  );
}
