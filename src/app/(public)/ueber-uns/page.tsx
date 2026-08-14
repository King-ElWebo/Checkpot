import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { FadeIn } from "@/components/public/motion/fade-in";
import { storeDetails, imagery, seoRoutes } from "@/content/fixtures/checkpot";

const seo = seoRoutes.find((r) => r.route === "/ueber-uns")!;

export const metadata: Metadata = {
  title: seo.title,
  description: seo.description,
  alternates: {
    canonical: seo.canonical,
  },
};

export default function UeberUnsPage() {
  return (
    <div className="flex flex-col">
      <div className="mx-auto w-full max-w-[1400px] px-4 pt-12 lg:px-6">
        <Breadcrumbs
          items={[
            { label: "Startseite", href: "/" },
            { label: "Über uns", href: "/ueber-uns" },
          ]}
        />
      </div>

      <section className="mx-auto w-full max-w-[1400px] px-4 py-20 lg:px-6 lg:py-28">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12 lg:gap-16">
          <FadeIn className="lg:col-span-5 lg:col-start-2">
            <div className="relative aspect-[3/4] w-full overflow-hidden rounded-md bg-[#F9F9F8]">
              <Image
                src={imagery.founder.src}
                alt={imagery.founder.alt}
                fill
                priority
                sizes="(min-width: 1024px) 50vw, 100vw"
                className="object-cover"
                style={{ objectPosition: imagery.founder.objectPosition }}
              />
            </div>
          </FadeIn>
          
          <FadeIn delay={150} className="flex flex-col justify-center lg:col-span-5 lg:col-start-8">
            <span className="mb-4 block text-[13px] font-medium uppercase tracking-[0.08em] text-[#4A5568]">
              Unsere Geschichte
            </span>
            <h1 className="mb-8 text-4xl font-normal leading-[1.1] tracking-tight text-[#1A1A1A] sm:text-5xl lg:text-6xl">
              Über Checkpot & Christa
            </h1>
            <div className="space-y-6 text-lg text-[#4A5568]">
              <p>
                Checkpot wurde von {storeDetails.owner} im Jahr 2009 mit einer klaren Vision
                gegründet: Eine Boutique zu schaffen, in der Frauen nicht einfach nur
                einkaufen, sondern sich gut beraten und rundum wohl fühlen.
              </p>
              <p>
                Mode ist für uns mehr als nur Kleidung – sie ist Ausdruck der Persönlichkeit.
                Deshalb nehmen wir uns für jede Kundin Zeit, hören zu und suchen gemeinsam nach
                Stücken, die nicht nur schön aussehen, sondern auch zum Leben und Alltag
                passen.
              </p>
              <p>
                In einer Zeit, in der fast alles online bestellt wird, glauben wir an den
                Wert der persönlichen Begegnung. Stoffe muss man fühlen, Schnitte muss man
                anprobieren.
              </p>
            </div>
            <div className="mt-10 flex flex-wrap items-center gap-4">
              <Link
                href="/kontakt"
                className="inline-flex items-center justify-center rounded-md bg-[#C01718] px-8 py-3.5 text-[15px] font-medium text-white transition-colors duration-150 ease-out hover:bg-[#A01314] focus:outline-hidden focus-visible:ring-2 focus-visible:ring-[#C01718] focus-visible:ring-offset-2"
              >
                Besuchen Sie uns
              </Link>
              <Link
                href="/mode"
                className="inline-flex items-center justify-center rounded-md bg-[#F9F9F8] px-8 py-3.5 text-[15px] font-medium text-[#1A1A1A] transition-colors duration-150 ease-out hover:bg-[#E2E8F0] focus:outline-hidden focus-visible:ring-2 focus-visible:ring-[#1A1A1A] focus-visible:ring-offset-2"
              >
                Mode entdecken
              </Link>
            </div>
          </FadeIn>
        </div>
      </section>

      <section className="bg-[#F9F9F8] px-4 py-20 lg:px-6 lg:py-28">
        <div className="mx-auto max-w-[1400px]">
          <div className="mb-12 text-center lg:mb-16">
            <h2 className="text-3xl font-normal tracking-tight text-[#1A1A1A] sm:text-4xl lg:text-5xl">
              Eindrücke aus der Boutique
            </h2>
          </div>
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:gap-16">
            {imagery.storeDetails.map((img, i) => (
              <FadeIn key={img.src} delay={i * 150} className="relative aspect-[4/3] w-full overflow-hidden rounded-md bg-white">
                <Image
                  src={img.src}
                  alt={img.alt}
                  fill
                  sizes="(min-width: 640px) 50vw, 100vw"
                  className="object-cover transition-transform duration-500 ease-out hover:scale-[1.02]"
                  style={{ objectPosition: img.objectPosition }}
                />
              </FadeIn>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
