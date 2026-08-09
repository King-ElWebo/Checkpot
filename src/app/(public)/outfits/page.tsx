import type { Metadata } from "next";

import { Breadcrumbs } from "@/components/public/layout/breadcrumbs";
import { JsonLd } from "@/components/public/seo/json-ld";
import { breadcrumbJsonLd } from "@/components/public/seo/schema";
import { metadataFor } from "@/components/public/seo/metadata";
import { ImageCard } from "@/components/public/sections/image-card";
import { SectionHeading } from "@/components/public/sections/section-heading";
import { CtaLink } from "@/components/ui/cta-link";
import { outfits } from "@/content/fixtures/checkpot";

const breadcrumbs = [
  { label: "Start", href: "/" },
  { label: "Outfits", href: "/outfits" },
] as const;

export const metadata: Metadata = metadataFor("/outfits");

export default function OutfitsPage() {
  return (
    <div className="public-page">
      <JsonLd data={breadcrumbJsonLd([...breadcrumbs])} />
      <div className="container">
        <Breadcrumbs items={[...breadcrumbs]} />
      </div>
      <section className="container page-hero">
        <p className="public-eyebrow">Inspiration</p>
        <h1>Outfit-Inspirationen</h1>
        <p className="lead">
          Komplette Looks zeigen, wie neue Stücke getragen und kombiniert werden können. Die Auswahl bleibt bewusst
          redaktionell, nicht verkäuferisch.
        </p>
      </section>
      <section className="section">
        <div className="container">
          <div className="outfit-grid">
            {outfits.map((outfit) => (
              <ImageCard
                key={outfit.title}
                image={outfit.image}
                reveal
                title={outfit.title}
                text={`${outfit.season} · ${outfit.note}`}
              />
            ))}
          </div>
          <div className="inline-actions">
            <CtaLink href="/mode" label="Aktuelle Kollektion" variant="secondary" />
            <CtaLink href="/kontakt" label="Zum Outfit anfragen" />
          </div>
        </div>
      </section>
      <section className="section section-muted">
        <div className="container empty-state">
          <SectionHeading title="Wenn ein Outfit nicht mehr verfügbar ist">
            <p>
              Unveröffentlichte oder nicht mehr aktuelle Looks werden später über das Admin-System ausgeblendet. Die
              Seite bleibt mit einer klaren leeren Ansicht stabil, falls keine Outfits veröffentlicht sind.
            </p>
          </SectionHeading>
        </div>
      </section>
    </div>
  );
}
