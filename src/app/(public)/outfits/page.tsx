import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { FadeIn } from "@/components/public/motion/fade-in";
import { outfits, brands, seoRoutes } from "@/content/fixtures/checkpot";

const seo = seoRoutes.find((r) => r.route === "/outfits")!;

export const metadata: Metadata = {
  title: seo.title,
  description: seo.description,
  alternates: {
    canonical: seo.canonical,
  },
};

export default function OutfitsPage() {
  return (
    <div className="flex flex-col">
      <div className="mx-auto w-full max-w-[1400px] px-4 pt-12 lg:px-6">
        <Breadcrumbs
          items={[
            { label: "Startseite", href: "/" },
            { label: "Outfits", href: "/outfits" },
          ]}
        />
      </div>

      <section className="mx-auto w-full max-w-[1400px] px-4 py-16 lg:px-6 lg:py-24">
        <div className="mx-auto mb-16 max-w-3xl text-center lg:mb-24">
          <span className="mb-4 block text-[13px] font-medium uppercase tracking-[0.08em] text-[#4A5568]">
            Die Auswahl
          </span>
          <h1 className="text-4xl font-normal leading-[1.1] tracking-tight text-[#1A1A1A] sm:text-5xl lg:text-6xl">
            Outfit Inspirationen
          </h1>
          <p className="mt-8 text-lg leading-relaxed text-[#4A5568] sm:text-xl">
            Gute Mode lebt von der richtigen Kombination. Hier zeigen wir Ihnen komplette Looks
            und Inspirationen, wie wir sie im Geschäft empfehlen.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-12 md:grid-cols-2 lg:gap-16">
          {outfits.map((outfit, index) => {
            return (
              <FadeIn key={outfit.title} duration={700} translateY={20}>
                <div className="group flex flex-col focus-within:ring-2 focus-within:ring-[#C01718] focus-within:ring-offset-4 rounded-md">
                  <div className="relative aspect-[3/4] w-full overflow-hidden rounded-md bg-[#F9F9F8]">
                    <Image
                      src={outfit.image.src}
                      alt={outfit.image.alt}
                      fill
                      sizes="(min-width: 1024px) 50vw, 100vw"
                      className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.02]"
                      style={{ objectPosition: outfit.image.objectPosition }}
                    />
                  </div>
                  <div className="mt-6 flex flex-col items-start">
                    <span className="mb-3 text-[12px] font-medium uppercase tracking-widest text-[#C01718]">
                      {outfit.season}
                    </span>
                    <h2 className="text-2xl font-normal text-[#1A1A1A] lg:text-3xl transition-colors group-hover:text-[#C01718]">
                      {outfit.title}
                    </h2>
                    <p className="mt-3 text-[15px] leading-relaxed text-[#4A5568]">
                      {outfit.note}
                    </p>
                    
                    {outfit.brandSlugs.length > 0 && (
                      <div className="mt-6 flex flex-wrap items-center gap-x-2 gap-y-1">
                        <span className="text-[13px] font-medium uppercase tracking-wider text-[#1A1A1A] mr-1">
                          Marken:
                        </span>
                        {outfit.brandSlugs.map((slug) => {
                          const brand = brands.find((b) => b.slug === slug);
                          if (!brand) return null;
                          return (
                            <Link
                              key={slug}
                              href={`/marken/${slug}`}
                              className="text-[13px] text-[#4A5568] transition-colors hover:text-[#C01718]"
                            >
                              {brand.name}
                            </Link>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </div>
              </FadeIn>
            );
          })}
        </div>
      </section>
    </div>
  );
}
