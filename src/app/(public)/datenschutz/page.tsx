import type { Metadata } from "next";

import { Breadcrumbs } from "@/components/public/layout/breadcrumbs";
import { JsonLd } from "@/components/public/seo/json-ld";
import { breadcrumbJsonLd } from "@/components/public/seo/schema";
import { metadataFor } from "@/components/public/seo/metadata";
import { CtaLink } from "@/components/ui/cta-link";

const breadcrumbs = [
  { label: "Start", href: "/" },
  { label: "Datenschutz", href: "/datenschutz" },
] as const;

export const metadata: Metadata = metadataFor("/datenschutz");

export default function PrivacyPage() {
  return (
    <div className="public-page">
      <JsonLd data={breadcrumbJsonLd([...breadcrumbs])} />
      <div className="container">
        <Breadcrumbs items={[...breadcrumbs]} />
      </div>
      <section className="container section">
        <article className="legal-content">
          <h1>Datenschutz</h1>
          <p>
            Die finale Datenschutzerklärung wird mit den tatsächlich eingesetzten Diensten bereitgestellt. Bis zur
            Veröffentlichung gilt: Externe Dienste werden nicht ohne die dafür vorgesehene Zustimmung geladen.
          </p>
          <h2>Kontaktformular</h2>
          <p>
            Das Kontaktformular fragt Vorname, Nachname, E-Mail-Adresse und Nachricht ab. Die endgültige Verarbeitung
            wird in der freigegebenen Datenschutzerklärung beschrieben.
          </p>
          <h2>Externe Links</h2>
          <p>
            Route planen und WhatsApp sind klar beschriftete externe Links. Erst ein Klick verlässt die Website.
          </p>
          <div className="inline-actions">
            <CtaLink href="/kontakt" label="Kontakt" variant="secondary" />
            <CtaLink href="/impressum" label="Impressum" variant="text" />
          </div>
        </article>
      </section>
    </div>
  );
}
