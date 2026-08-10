import type { Metadata } from "next";
import Image from "next/image";

import { Breadcrumbs } from "@/components/public/layout/breadcrumbs";
import { ContactForm } from "@/components/public/forms/contact-form";
import { JsonLd } from "@/components/public/seo/json-ld";
import { breadcrumbJsonLd, localBusinessJsonLd } from "@/components/public/seo/schema";
import { metadataFor } from "@/components/public/seo/metadata";
import { CtaLink } from "@/components/ui/cta-link";
import { imagery, storeDetails } from "@/content/fixtures/checkpot";

const breadcrumbs = [
  { label: "Start", href: "/" },
  { label: "Kontakt", href: "/kontakt" },
] as const;

export const metadata: Metadata = metadataFor("/kontakt");

export default function ContactPage() {
  return (
    <div className="public-page">
      <JsonLd data={localBusinessJsonLd()} />
      <JsonLd data={breadcrumbJsonLd([...breadcrumbs])} />
      <div className="container">
        <Breadcrumbs items={[...breadcrumbs]} />
      </div>
      <section className="container page-hero">
        <p className="public-eyebrow">Besuch planen</p>
        <h1>Kontakt & Öffnungszeiten</h1>
        <p className="lead">
          Kommen Sie vorbei, rufen Sie an oder schreiben Sie eine Nachricht. Die Adresse bleibt gut lesbar und der
          Routenlink öffnet die Planung extern.
        </p>
      </section>
      <section className="section">
        <div className="container contact-layout">
          <div className="contact-card">
            <h2>Checkpot Hietzing</h2>
            <div className="contact-photo">
              <span aria-hidden="true">Bild folgt</span>
              <Image
                alt={imagery.storeDetails[0].alt}
                fill
                loading="lazy"
                sizes="(max-width: 980px) 100vw, 34vw"
                src={imagery.storeDetails[0].src}
                style={{ objectPosition: imagery.storeDetails[0].objectPosition }}
              />
            </div>
            <dl className="contact-list">
              <div>
                <dt>Adresse</dt>
                <dd>{storeDetails.address.display}</dd>
              </div>
              <div>
                <dt>Öffnungszeiten</dt>
                <dd>{storeDetails.hours.map((hour) => `${hour.label} ${hour.value}`).join(" · ")}</dd>
              </div>
              <div>
                <dt>Telefon</dt>
                <dd>
                  <a href={storeDetails.phoneHref}>{storeDetails.phone}</a>
                </dd>
              </div>
              <div>
                <dt>WhatsApp</dt>
                <dd>
                  <a href={storeDetails.whatsappHref} rel="noopener noreferrer" target="_blank">
                    {storeDetails.whatsapp}
                  </a>
                </dd>
              </div>
              <div>
                <dt>E-Mail</dt>
                <dd>
                  <a href={storeDetails.emailHref}>{storeDetails.email}</a>
                </dd>
              </div>
            </dl>
            <div className="contact-actions">
              <CtaLink external href={storeDetails.routePlanningHref} label="Route planen" />
              <CtaLink href={storeDetails.phoneHref} label="Anrufen" variant="secondary" />
            </div>
          </div>
          <div className="contact-card">
            <h2>Nachricht schreiben</h2>
            <p>
              Haben Sie eine Frage zu einem Look, einer Marke oder einem Besuch im Geschäft? Schreiben Sie kurz, worum
              es geht.
            </p>
            <ContactForm />
          </div>
        </div>
      </section>
    </div>
  );
}
