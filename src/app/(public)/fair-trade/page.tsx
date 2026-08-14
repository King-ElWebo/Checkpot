import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { FadeIn } from "@/components/public/motion/fade-in";
import { seoRoutes, imagery } from "@/content/fixtures/checkpot";

const seo = seoRoutes.find((r) => r.route === "/fair-trade")!;

export const metadata: Metadata = {
  title: seo.title,
  description: seo.description,
  alternates: {
    canonical: seo.canonical,
  },
};

export default function FairTradePage() {
  return (
    <div className="flex flex-col">
      <div className="mx-auto w-full max-w-[1400px] px-4 pt-12 lg:px-6">
        <Breadcrumbs
          items={[
            { label: "Startseite", href: "/" },
            { label: "Fair Trade", href: "/fair-trade" },
          ]}
        />
      </div>

      <section className="mx-auto w-full max-w-[1400px] px-4 py-16 lg:px-6 lg:py-24">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12 lg:gap-16">
          <FadeIn className="order-2 lg:order-1 lg:col-span-5 lg:col-start-2">
            <span className="mb-4 block text-[13px] font-medium uppercase tracking-[0.08em] text-[#4A5568]">
              Werte
            </span>
            <h1 className="mb-8 text-4xl font-normal leading-[1.1] tracking-tight text-[#1A1A1A] sm:text-5xl lg:text-6xl">
              Fair Trade & Nachhaltigkeit
            </h1>
            <p className="mb-10 text-lg leading-relaxed text-[#4A5568] sm:text-xl">
              Gute Mode sollte nicht nur gut aussehen, sondern auch mit gutem Gewissen getragen werden.
            </p>

            <div className="space-y-8 text-[15px] leading-relaxed text-[#4A5568]">
              <div>
                <h2 className="mb-3 text-[13px] font-medium uppercase tracking-[0.08em] text-[#1A1A1A]">
                  Unsere Prinzipien
                </h2>
                <p>
                  Bei Checkpot achten wir bewusst auf die Herkunft unserer Kollektionen. Wir 
                  bevorzugen Marken, die transparent kommunizieren, wo und wie ihre Kleidung produziert wird.
                </p>
                <p className="mt-4">
                  Qualität bedeutet für uns auch Langlebigkeit. Ein Kleidungsstück, das viele Jahre 
                  Freude bereitet und nicht nach einer Saison aussortiert werden muss, ist der 
                  erste und wichtigste Schritt zu mehr Nachhaltigkeit im Kleiderschrank.
                </p>
              </div>
              
              <div>
                <h2 className="mb-3 text-[13px] font-medium uppercase tracking-[0.08em] text-[#1A1A1A]">
                  Bewusster Konsum
                </h2>
                <p>
                  Wir unterstützen Sie durch unsere persönliche Beratung dabei, genau die Stücke zu finden, 
                  die wirklich zu Ihnen passen und sich gut in Ihre Garderobe einfügen. Fehlkäufe werden 
                  so vermieden, was Ressourcen schont.
                </p>
              </div>
            </div>

            <div className="mt-12">
              <Link
                href="/marken"
                className="inline-flex items-center justify-center rounded-md bg-[#C01718] px-8 py-3.5 text-[15px] font-medium text-white transition-colors duration-150 ease-out hover:bg-[#A01314] focus:outline-hidden focus-visible:ring-2 focus-visible:ring-[#C01718] focus-visible:ring-offset-2"
              >
                Unsere Marken entdecken
              </Link>
            </div>
          </FadeIn>

          <FadeIn delay={150} className="order-1 lg:order-2 lg:col-span-5 lg:col-start-8">
            <div className="relative aspect-[4/5] w-full overflow-hidden rounded-md bg-[#F9F9F8]">
              <Image
                src={imagery.sustainabilityShelf.src}
                alt={imagery.sustainabilityShelf.alt}
                fill
                priority
                sizes="(min-width: 1024px) 50vw, 100vw"
                className="object-cover"
                style={{ objectPosition: imagery.sustainabilityShelf.objectPosition }}
              />
            </div>
          </FadeIn>
        </div>
      </section>
    </div>
  );
}
