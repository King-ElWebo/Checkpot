import type { Metadata } from "next";

import { Breadcrumbs } from "@/components/public/layout/breadcrumbs";
import { JsonLd } from "@/components/public/seo/json-ld";
import { breadcrumbJsonLd } from "@/components/public/seo/schema";
import { metadataFor } from "@/components/public/seo/metadata";
import { SectionHeading } from "@/components/public/sections/section-heading";
import { CtaLink } from "@/components/ui/cta-link";

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
        <div className="container grid-3">
          <div className="card">
            <h2>Auswahl statt Masse</h2>
            <p>
              Die Website zeigt kein endloses Sortiment. Im Geschäft wird erklärt, welche Stücke zur Saison, zur
              Kundin und zu vorhandenen Lieblingsstücken passen.
            </p>
          </div>
          <div className="card">
            <h2>Belegte Aussagen</h2>
            <p>
              Begriffe wie fair trade, 100% Baumwolle oder Global Organic Textile Standard (GOTS) werden nur dort
              verwendet, wo sie für Marke, Kollektion oder Kleidungsstück aktuell belegbar sind.
            </p>
          </div>
          <div className="card">
            <h2>Länger tragbar</h2>
            <p>
              Gute Beratung hilft, Fehlkäufe zu vermeiden: Farben, Materialgefühl, Schnitt und Kombination werden vor
              Ort geprüft.
            </p>
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
