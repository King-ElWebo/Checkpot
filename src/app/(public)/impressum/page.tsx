import type { Metadata } from "next";

import { Breadcrumbs } from "@/components/public/layout/breadcrumbs";
import { JsonLd } from "@/components/public/seo/json-ld";
import { breadcrumbJsonLd } from "@/components/public/seo/schema";
import { metadataFor } from "@/components/public/seo/metadata";
import { CtaLink } from "@/components/ui/cta-link";
import { storeDetails } from "@/content/fixtures/checkpot";

const breadcrumbs = [
  { label: "Start", href: "/" },
  { label: "Impressum", href: "/impressum" },
] as const;

export const metadata: Metadata = metadataFor("/impressum");

export default function ImprintPage() {
  return (
    <div className="public-page">
      <JsonLd data={breadcrumbJsonLd([...breadcrumbs])} />
      <div className="container">
        <Breadcrumbs items={[...breadcrumbs]} />
      </div>
      <section className="container section">
        <article className="legal-content">
          <h1>Impressum</h1>
          <p>
            Die finalen österreichischen Anbieterangaben werden vor Veröffentlichung ergänzt. Bis dahin werden nur die
            bereits freigegebenen öffentlichen Kontaktdaten angezeigt.
          </p>
          <h2>Kontakt</h2>
          <p>{storeDetails.name}</p>
          <p>{storeDetails.address.display}</p>
          <p>
            Telefon: <a href={storeDetails.phoneHref}>{storeDetails.phone}</a>
            <br />
            E-Mail: <a href={storeDetails.emailHref}>{storeDetails.email}</a>
          </p>
          <h2>Rechtsträgerangaben</h2>
          <p>Rechtsträger-, Behörden- und Kammerangaben folgen mit den freigegebenen Rechtstexten.</p>
          <div className="inline-actions">
            <CtaLink href="/kontakt" label="Kontakt" variant="secondary" />
            <CtaLink href="/datenschutz" label="Datenschutz" variant="text" />
          </div>
        </article>
      </section>
    </div>
  );
}
