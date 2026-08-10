import Link from "next/link";
import type { Metadata } from "next";

import { Breadcrumbs } from "@/components/public/layout/breadcrumbs";
import { JsonLd } from "@/components/public/seo/json-ld";
import { breadcrumbJsonLd } from "@/components/public/seo/schema";
import { metadataFor } from "@/components/public/seo/metadata";
import { SectionHeading } from "@/components/public/sections/section-heading";
import { CtaLink } from "@/components/ui/cta-link";
import { brands } from "@/content/fixtures/checkpot";

const breadcrumbs = [
  { label: "Start", href: "/" },
  { label: "Marken", href: "/marken" },
] as const;

export const metadata: Metadata = metadataFor("/marken");

export default function BrandsPage() {
  const activeBrands = brands.filter((brand) => brand.active);

  return (
    <div className="public-page">
      <JsonLd data={breadcrumbJsonLd([...breadcrumbs])} />
      <div className="container">
        <Breadcrumbs items={[...breadcrumbs]} />
      </div>
      <section className="container page-hero">
        <p className="public-eyebrow">Ausgewählte Labels</p>
        <h1>Unsere Marken</h1>
        <p className="lead">
          Checkpot führt Marken, die zu persönlicher Beratung, femininer Mode und einem bewussten Besuch im Geschäft
          passen. Die Übersicht hilft bei der Orientierung, bevor Christa die passende Auswahl zeigt.
        </p>
      </section>
      <section className="section">
        <div className="container">
          {activeBrands.length > 0 ? (
            <div className="brand-index">
              {activeBrands.map((brand) => (
                <Link className="brand-tile" href={`/marken/${brand.slug}`} key={brand.slug}>
                  <span className="brand-initial" aria-hidden="true">
                    {brand.name.slice(0, 1)}
                  </span>
                  <span>
                    <strong>{brand.name}</strong>
                    <p>{brand.summary}</p>
                    <span>{brand.note}</span>
                  </span>
                </Link>
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <SectionHeading title="Noch keine Marken veröffentlicht">
                <p>Christa stellt die Markenübersicht persönlich zusammen. Bis dahin hilft der direkte Kontakt im Geschäft.</p>
              </SectionHeading>
              <CtaLink href="/kontakt" label="Kontakt aufnehmen" />
            </div>
          )}
          <div className="inline-actions">
            <CtaLink href="/outfits" label="Outfits ansehen" variant="secondary" />
            <CtaLink href="/kontakt" label="Geschäft besuchen" />
          </div>
        </div>
      </section>
    </div>
  );
}
