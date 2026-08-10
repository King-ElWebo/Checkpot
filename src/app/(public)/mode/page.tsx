import type { Metadata } from "next";

import { Breadcrumbs } from "@/components/public/layout/breadcrumbs";
import { JsonLd } from "@/components/public/seo/json-ld";
import { breadcrumbJsonLd } from "@/components/public/seo/schema";
import { metadataFor } from "@/components/public/seo/metadata";
import { ImageCard } from "@/components/public/sections/image-card";
import { SectionHeading } from "@/components/public/sections/section-heading";
import { CtaLink } from "@/components/ui/cta-link";
import { currentCollection, imagery, outfits } from "@/content/fixtures/checkpot";

const breadcrumbs = [
  { label: "Start", href: "/" },
  { label: "Mode", href: "/mode" },
] as const;

export const metadata: Metadata = metadataFor("/mode");

export default function FashionPage() {
  return (
    <div className="public-page">
      <JsonLd data={breadcrumbJsonLd([...breadcrumbs])} />
      <div className="container">
        <Breadcrumbs items={[...breadcrumbs]} />
      </div>
      <section className="container page-hero">
        <p className="public-eyebrow">{currentCollection.season}</p>
        <h1>Aktuelle Mode & Kollektionen</h1>
        <p className="lead">{currentCollection.intro}</p>
        <div className="inline-actions">
          <CtaLink href="/outfits" label="Outfits ansehen" />
          <CtaLink href="/kontakt" label="Geschäft besuchen" variant="secondary" />
        </div>
      </section>
      <section className="section">
        <div className="container brand-context">
          <div>
            <SectionHeading title="Saison, Farben und Materialien">
              <p>
                Die aktuelle Saison ist farbig und freundlich: leichte Kleider, gemusterte Stoffe, ruhige Stricklagen
                und Kombinationen, die im Geschäft direkt angehalten und ausprobiert werden können.
              </p>
            </SectionHeading>
            <div className="inline-actions">
              <CtaLink href="/outfits" label="Komplette Looks ansehen" variant="secondary" />
              <CtaLink href="/marken" label="Marken entdecken" variant="text" />
            </div>
          </div>
          <div className="editorial-collage" aria-label="Aktuelle Eindrücke aus der Checkpot Auswahl">
            <ImageCard
              image={outfits[0].image}
              ratio="portrait"
              sizes="(max-width: 720px) 100vw, (max-width: 1200px) 50vw, 36vw"
            />
            <ImageCard image={imagery.textileDetail} ratio="square" sizes="(max-width: 720px) 100vw, 24vw" />
            <ImageCard image={outfits[1].image} ratio="landscape" sizes="(max-width: 720px) 100vw, 24vw" />
          </div>
        </div>
      </section>
      <section className="section section-muted">
        <div className="container">
          <SectionHeading title="Ein erster Blick auf die Auswahl">
            <p>
              Die Bilder zeigen die Richtung der Saison. Für Größen, Passform und gute Kombinationen ist Christas
              Beratung vor Ort der nächste Schritt.
            </p>
          </SectionHeading>
          <div className="grid-3">
            {outfits.slice(0, 3).map((outfit) => (
              <ImageCard
                key={outfit.title}
                image={outfit.image}
                title={outfit.title}
                text={outfit.note}
                ratio="landscape"
                sizes="(max-width: 720px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
