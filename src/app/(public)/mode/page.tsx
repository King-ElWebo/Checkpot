import type { Metadata } from "next";

import { Breadcrumbs } from "@/components/public/layout/breadcrumbs";
import { JsonLd } from "@/components/public/seo/json-ld";
import { breadcrumbJsonLd } from "@/components/public/seo/schema";
import { metadataFor } from "@/components/public/seo/metadata";
import { ImageCard } from "@/components/public/sections/image-card";
import { SectionHeading } from "@/components/public/sections/section-heading";
import { CtaLink } from "@/components/ui/cta-link";
import { currentCollection, outfits } from "@/content/fixtures/checkpot";

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
        <div className="container">
          <SectionHeading title="Neue Stücke, nicht als Warenkorb">
            <p>
              Diese Seite zeigt Orientierung und Stimmung. Preise, Größen und Verfügbarkeit werden nicht als
              Online-Shop geführt, sondern im Geschäft persönlich besprochen.
            </p>
          </SectionHeading>
          <div className="outfit-grid">
            {outfits.map((outfit) => (
              <ImageCard key={outfit.title} image={outfit.image} title={outfit.title} text={outfit.note} reveal />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
