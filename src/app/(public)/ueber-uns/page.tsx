import type { Metadata } from "next";

import { Breadcrumbs } from "@/components/public/layout/breadcrumbs";
import { JsonLd } from "@/components/public/seo/json-ld";
import { breadcrumbJsonLd } from "@/components/public/seo/schema";
import { metadataFor } from "@/components/public/seo/metadata";
import { ImageCard } from "@/components/public/sections/image-card";
import { SectionHeading } from "@/components/public/sections/section-heading";
import { CtaLink } from "@/components/ui/cta-link";
import { imagery } from "@/content/fixtures/checkpot";

const breadcrumbs = [
  { label: "Start", href: "/" },
  { label: "Über uns", href: "/ueber-uns" },
] as const;

export const metadata: Metadata = metadataFor("/ueber-uns");

export default function AboutPage() {
  return (
    <div className="public-page">
      <JsonLd data={breadcrumbJsonLd([...breadcrumbs])} />
      <div className="container">
        <Breadcrumbs items={[...breadcrumbs]} />
      </div>
      <section className="container page-hero">
        <p className="public-eyebrow">Seit 2009</p>
        <h1>Über Checkpot & Christa</h1>
        <p className="lead">
          Checkpot ist Christa Hausmairs persönliche Boutique in Hietzing: freundlich, direkt, farbig und mit dem Blick
          für Kundinnen, die Mode im echten Leben tragen.
        </p>
      </section>
      <section className="section">
        <div className="container split">
          <ImageCard image={imagery.founder} ratio="portrait" title="Christa Hausmair" text="Gründerin und persönliche Ansprechpartnerin." />
          <div>
            <SectionHeading title="Beratung mit Ruhe und Blick fürs Detail">
              <p>
                Seit 2009 steht Checkpot für persönliche Stilberatung und ausgewählte feminine Mode in Wien Hietzing.
                Die Auswahl ist bewusst kuratiert: Stücke sollen kombinierbar sein, zur Trägerin passen und im Geschäft
                in Ruhe anprobiert werden.
              </p>
            </SectionHeading>
            <p className="lead">
              Der Relaunch zeigt dieses reale Geschäft: keine Shop-Raster, keine künstliche Inszenierung, sondern
              Menschen, Outfits, Materialien und ein Ort, an dem Beratung zählt.
            </p>
            <div className="inline-actions">
              <CtaLink href="/mode" label="Aktuelle Mode ansehen" />
              <CtaLink href="/kontakt" label="Besuch planen" variant="secondary" />
            </div>
          </div>
        </div>
      </section>
      <section className="section section-muted">
        <div className="container grid-2">
          {imagery.storeDetails.map((image) => (
            <ImageCard key={image.src} image={image} ratio="landscape" />
          ))}
        </div>
      </section>
    </div>
  );
}
