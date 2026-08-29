import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { imagery, seoRoutes } from "@/content/fixtures/checkpot";
import { getStoreDetails } from "@/lib/repositories/store-settings";

const seo = seoRoutes.find((r) => r.route === "/ueber-uns")!;

export const metadata: Metadata = {
  title: seo.title,
  description: seo.description,
  alternates: {
    canonical: seo.canonical,
  },
};

export default async function UeberUnsPage() {
  const storeDetails = await getStoreDetails();

  return (
    <div className="flex flex-col bg-[#F9F9F8]">
      <div className="mx-auto w-full max-w-[1400px] px-4 pt-12 lg:px-6">
        <Breadcrumbs
          items={[
            { label: "Startseite", href: "/" },
            { label: "Über uns", href: "/ueber-uns" },
          ]}
        />
      </div>

      {/* 1. OPENING */}
      <section className="mx-auto w-full max-w-[1400px] px-4 py-16 lg:px-6 lg:py-24">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-6 lg:col-start-1">
            <h1 className="font-display text-5xl lg:text-7xl text-[#1A1A1A] tracking-tight mb-8">
              Zeit für Ihren Stil
            </h1>
            <p className="text-xl lg:text-2xl text-[#1A1A1A] font-medium leading-relaxed mb-6">
              Hier wird nicht einfach nur Kleidung verkauft. Wir nehmen uns die Zeit, um herauszufinden, was wirklich zu Ihnen passt.
            </p>
            <p className="text-[17px] text-[#4A5568] leading-relaxed">
              Willkommen bei {storeDetails.name} – Ihrer Boutique für persönliche, ehrliche und kompetente Stilberatung in Wien.
            </p>
          </div>
          <div className="lg:col-span-6">
            <div className="relative aspect-[4/3] w-full overflow-hidden rounded-sm bg-[#E2E8F0]">
              <Image
                src={imagery.hero.src}
                alt={imagery.hero.alt}
                fill
                priority
                sizes="(min-width: 1024px) 50vw, 100vw"
                className="object-cover"
                style={{ objectPosition: imagery.hero.objectPosition }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* 2. CONSULTATION PHILOSOPHY */}
      <section className="bg-white border-y border-[#E2E8F0] px-4 py-20 lg:px-6 lg:py-32">
        <div className="mx-auto max-w-[1400px]">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
            <div className="lg:col-span-5">
              <span className="mb-4 block text-[13px] font-medium uppercase tracking-[0.08em] text-[#C01718]">
                Unsere Philosophie
              </span>
              <h2 className="font-display text-4xl lg:text-5xl text-[#1A1A1A] leading-[1.1] mb-8">
                Mode, die Ihre Persönlichkeit unterstreicht
              </h2>
            </div>
            <div className="lg:col-span-6 lg:col-start-7 prose prose-lg prose-p:text-[#4A5568] prose-p:leading-relaxed">
              <p className="text-xl text-[#1A1A1A] font-medium mb-8">
                „Bei uns finden Sie nicht die gängigen Trends, die alle tragen – sondern hochwertige, feminine Mode, die wir durch einfühlsame, persönliche Stilberatung perfekt auf den Typ der Kundin abstimmen.“
              </p>
              <p>
                Mode ist für uns mehr als nur Kleidung – sie ist Ausdruck der eigenen Identität. In einer Zeit, in der fast alles online bestellt und zurückgeschickt wird, glauben wir fest an den Wert der persönlichen Begegnung. Stoffe muss man fühlen, Schnitte muss man anprobieren.
              </p>
              <p>
                „Es gibt wenige Frauen, denen alle Farben passen“, weiß Christa Hausmair aus langjähriger Erfahrung. „Stures Festkrallen an Modemagazin-Vorgaben gibt es bei mir nicht. Es geht immer darum, die jeweilige Persönlichkeit zu verstärken.“ 
              </p>
              <p>
                Wir beraten Sie ehrlich zu Farben, Proportionen und Kombinationen – auch in Verbindung mit Ihren vorhandenen Lieblingsstücken. Das Ziel ist immer, dass Sie sich in Ihrer Kleidung rundum wohl und authentisch fühlen.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. CHRISTA & 4. PHOTOGRAPHIC STORY */}
      <section className="mx-auto w-full max-w-[1400px] px-4 py-20 lg:px-6 lg:py-32">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          <div className="lg:col-span-5 lg:order-2">
            <div className="relative aspect-[3/4] w-full overflow-hidden rounded-sm bg-[#E2E8F0] mb-8">
              <Image
                src={imagery.founder.src}
                alt={imagery.founder.alt}
                fill
                sizes="(min-width: 1024px) 40vw, 100vw"
                className="object-cover"
                style={{ objectPosition: imagery.founder.objectPosition }}
              />
            </div>
            <div className="grid grid-cols-2 gap-4 lg:gap-8">
              {imagery.storeDetails.map((img) => (
                <div key={img.src} className="relative aspect-[4/5] w-full overflow-hidden rounded-sm bg-[#E2E8F0]">
                  <Image
                    src={img.src}
                    alt={img.alt}
                    fill
                    sizes="(min-width: 1024px) 20vw, 50vw"
                    className="object-cover"
                    style={{ objectPosition: img.objectPosition }}
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="lg:col-span-6 lg:col-start-1 lg:order-1">
            <span className="mb-4 block text-[13px] font-medium uppercase tracking-[0.08em] text-[#4A5568]">
              Das Gesicht hinter Checkpot
            </span>
            <h2 className="font-display text-4xl lg:text-5xl text-[#1A1A1A] mb-8">
              {storeDetails.owner}
            </h2>
            <div className="space-y-6 text-[17px] text-[#4A5568] leading-relaxed">
              <p>
                Christa Hausmair lebt ihre Liebe zum geschmackvollen Textilen seit 2009 mit großer Freude in ihrem Geschäft in Hietzing aus. Mit viel Leidenschaft und einem sicheren Blick für Stil und Qualität wählt sie jede Saison die Kollektionen persönlich aus.
              </p>
              <p>
                Ein besonderes Herzensanliegen ist es ihr, Mode anzubieten, die unter fairen und nachhaltigen Bedingungen hergestellt wird – bevorzugt aus Europa.
              </p>
            </div>
            
            <div className="mt-16 rounded-sm bg-white p-10 border border-[#E2E8F0]">
              <h3 className="font-display text-2xl text-[#1A1A1A] mb-4">
                Wir freuen uns auf Sie
              </h3>
              <p className="text-[15px] text-[#4A5568] leading-relaxed mb-8">
                Besuchen Sie uns in unserer Boutique in {storeDetails.address.city} Hietzing. Wir nehmen uns gerne Zeit für Sie und finden gemeinsam Mode, die wirklich zu Ihnen passt.
              </p>
              <Link
                href="/kontakt"
                className="inline-flex items-center justify-center rounded-sm bg-[#1A1A1A] px-8 py-4 text-[13px] uppercase tracking-[0.08em] font-medium text-white transition-colors duration-200 ease-out hover:bg-[#C01718] focus:outline-hidden focus-visible:ring-2 focus-visible:ring-[#C01718] focus-visible:ring-offset-2"
              >
                Besuchen Sie uns in Hietzing
              </Link>
            </div>
          </div>

        </div>
      </section>
    </div>
  );
}
