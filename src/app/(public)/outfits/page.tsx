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
          Komplette Looks zeigen, wie Farben, Schnitte und Schichten zusammenwirken. Im Geschäft lässt sich alles in
          Ruhe anprobieren und mit eigenen Lieblingsstücken weiterdenken.
        </p>
      </section>
      <section className="section">
        <div className="container">
          {outfits.length > 0 ? (
            <>
              <div className="lookbook-grid">
                {outfits.map((outfit, index) => (
                  <ImageCard
                    key={outfit.title}
                    image={outfit.image}
                    reveal
                    ratio={index === 1 ? "landscape" : "portrait"}
                    title={outfit.title}
                    text={`${outfit.season} · ${outfit.note}`}
                    sizes="(max-width: 720px) 100vw, (max-width: 1200px) 50vw, 32vw"
                  />
                ))}
              </div>
              <div className="inline-actions">
                <CtaLink href="/mode" label="Aktuelle Kollektion" variant="secondary" />
                <CtaLink href="/kontakt" label="Outfit besprechen" />
              </div>
            </>
          ) : (
            <div className="empty-state">
              <SectionHeading title="Neue Looks folgen">
                <p>Christa stellt die nächste Auswahl gerade zusammen. Für aktuelle Kombinationen lohnt sich der Besuch im Geschäft.</p>
              </SectionHeading>
              <CtaLink href="/kontakt" label="Besuch planen" />
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
