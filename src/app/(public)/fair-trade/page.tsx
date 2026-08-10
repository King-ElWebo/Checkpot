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
  { label: "Fair Trade", href: "/fair-trade" },
] as const;

export const metadata: Metadata = metadataFor("/fair-trade");

export default function FairTradePage() {
  return (
    <div className="public-page">
      <JsonLd data={breadcrumbJsonLd([...breadcrumbs])} />
      <div className="container">
        <Breadcrumbs items={[...breadcrumbs]} />
      </div>
      <section className="container page-hero">
        <p className="public-eyebrow">Bewusst auswählen</p>
        <h1>Fair Trade & Nachhaltigkeit</h1>
        <p className="lead">
          Checkpot behandelt faire und nachhaltige Mode als Beratungsthema: konkret, belegbar und bezogen auf die
          jeweilige Marke oder das jeweilige Stück.
        </p>
      </section>
      <section className="section">
        <div className="container brand-context">
          <ImageCard image={imagery.sustainabilityShelf} ratio="portrait" sizes="(max-width: 980px) 100vw, 42vw" />
          <div>
            <SectionHeading title="Drei einfache Prinzipien">
              <p>
                Nachhaltigkeit bleibt bei Checkpot konkret: nicht als pauschales Versprechen, sondern als sorgfältige
                Auswahl und ehrliche Beratung zu den jeweiligen Stücken.
              </p>
            </SectionHeading>
            <ul className="principle-list">
              <li>Weniger Masse, mehr Auswahl mit Blick auf Tragegefühl, Farbe und Kombinierbarkeit.</li>
              <li>Begriffe wie fair trade, 100% Baumwolle oder Global Organic Textile Standard (GOTS) nur dort, wo sie aktuell belegbar sind.</li>
              <li>Persönliche Beratung, damit ein Stück häufiger getragen wird und lange Freude macht.</li>
            </ul>
          </div>
        </div>
      </section>
      <section className="section section-muted">
        <div className="container">
          <SectionHeading title="Fragen direkt im Geschäft klären">
            <p>
              Wenn Sie eine bestimmte Marke, ein Material oder eine Zertifizierung prüfen möchten, ist Checkpot direkt
              erreichbar und zeigt die aktuelle Auswahl vor Ort.
            </p>
          </SectionHeading>
          <div className="inline-actions">
            <CtaLink href="/marken" label="Marken ansehen" variant="secondary" />
            <CtaLink href="/kontakt" label="Kontakt aufnehmen" />
          </div>
        </div>
      </section>
    </div>
  );
}
