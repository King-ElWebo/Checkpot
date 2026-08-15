import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
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
    <div className="flex flex-col bg-white">
      <div className="mx-auto w-full max-w-[1400px] px-4 pt-12 lg:px-6">
        <Breadcrumbs
          items={[
            { label: "Startseite", href: "/" },
            { label: "Nachhaltigkeit", href: "/fair-trade" },
          ]}
        />
      </div>

      <section className="mx-auto w-full max-w-[1400px] px-4 py-16 lg:px-6 lg:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          
          <div className="lg:col-span-6 lg:order-2">
            <div className="relative aspect-[4/5] w-full overflow-hidden rounded-sm bg-[#E2E8F0] mb-8">
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
          </div>

          <div className="lg:col-span-5 lg:col-start-1 lg:order-1 lg:pt-8">
            <span className="mb-4 block text-[13px] font-medium uppercase tracking-[0.08em] text-[#C01718]">
              Werte
            </span>
            <h1 className="font-display text-5xl lg:text-7xl text-[#1A1A1A] tracking-tight mb-8">
              Nachhaltigkeit
            </h1>
            <p className="text-xl text-[#1A1A1A] font-medium leading-relaxed mb-12">
              Gute Mode sollte nicht nur gut aussehen, sondern auch mit einem guten Gefühl getragen werden können.
            </p>

            <div className="space-y-12">
              <div>
                <h2 className="font-display text-2xl text-[#1A1A1A] mb-4">
                  Unsere Prinzipien
                </h2>
                <div className="prose prose-lg prose-p:text-[#4A5568] prose-p:leading-relaxed">
                  <p>
                    Bei Checkpot achten wir bewusst auf die Herkunft und Fertigung unserer Kollektionen. Wir bevorzugen Marken, die transparent kommunizieren, wo und wie ihre Kleidung produziert wird.
                  </p>
                  <p>
                    Einige unserer Marken produzieren zum großen Teil in Europa, verwenden natürliche Materialien oder sind Pioniere im Bereich der Öko-Textilproduktion.
                  </p>
                </div>
              </div>
              
              <div>
                <h2 className="font-display text-2xl text-[#1A1A1A] mb-4">
                  Bewusster Konsum & Qualität
                </h2>
                <div className="prose prose-lg prose-p:text-[#4A5568] prose-p:leading-relaxed">
                  <p>
                    Qualität bedeutet für uns in erster Linie Langlebigkeit. Ein Kleidungsstück, das viele Jahre Freude bereitet und nicht nach einer Saison aussortiert werden muss, ist der wichtigste Schritt zu mehr Nachhaltigkeit im Kleiderschrank.
                  </p>
                  <p>
                    Wir unterstützen Sie durch unsere persönliche, typgerechte Beratung dabei, genau die Stücke zu finden, die wirklich zu Ihnen passen und sich gut in Ihre Garderobe einfügen. Das schützt vor Fehlkäufen und schont Ressourcen.
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-16">
              <Link
                href="/marken"
                className="inline-flex items-center justify-center rounded-sm bg-[#1A1A1A] px-8 py-4 text-[13px] uppercase tracking-[0.08em] font-medium text-white transition-colors duration-200 ease-out hover:bg-[#333333] focus:outline-hidden focus-visible:ring-2 focus-visible:ring-[#1A1A1A] focus-visible:ring-offset-2"
              >
                Unsere Marken entdecken
              </Link>
            </div>
          </div>

        </div>
      </section>
    </div>
  );
}
