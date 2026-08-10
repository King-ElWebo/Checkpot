import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";

import { JsonLd } from "@/components/public/seo/json-ld";
import { localBusinessJsonLd } from "@/components/public/seo/schema";
import { metadataFor } from "@/components/public/seo/metadata";
import { ImageCard } from "@/components/public/sections/image-card";
import { SectionHeading } from "@/components/public/sections/section-heading";
import { CtaLink } from "@/components/ui/cta-link";
import { brands, currentCollection, imagery, outfits, storeDetails } from "@/content/fixtures/checkpot";

export const metadata: Metadata = metadataFor("/");

export default function HomePage() {
  const featuredBrands = brands.slice(0, 3);
  const featuredOutfits = outfits.slice(0, 3);

  return (
    <div className="public-page">
      <JsonLd data={localBusinessJsonLd()} />
      <section className="container hero">
        <div className="hero-copy">
          <p className="public-eyebrow">Damenmode in Wien Hietzing</p>
          <h1>Willkommen bei Checkpot Hietzing</h1>
          <p>
            Hochwertige feminine Mode, persönliche typgerechte Beratung und ausgewählte Marken in einem Geschäft,
            das zum Anprobieren, Kombinieren und Wiederkommen einlädt.
          </p>
          <div className="hero-actions">
            <CtaLink href="/outfits" label="Outfits ansehen" />
            <CtaLink href="/kontakt" label="Geschäft besuchen" variant="secondary" />
          </div>
          <div className="hero-note" aria-label="Kurzprofil">
            <span>Seit 2009 in Hietzing</span>
            <span>Persönliche Beratung durch Christa Hausmair</span>
            <span>Mode zum Anprobieren, Kombinieren und Wohlfühlen</span>
          </div>
        </div>
        <div className="hero-media">
          <Image
            fill
            alt={imagery.hero.alt}
            preload
            sizes="(max-width: 980px) 100vw, 45vw"
            src={imagery.hero.src}
            style={{ objectPosition: imagery.hero.objectPosition }}
          />
        </div>
      </section>

      <section className="section section-muted">
        <div className="container split">
          <div>
            <SectionHeading eyebrow="Beratung" title="Mode, die im Gespräch entsteht">
              <p>
                Die Website gibt einen ersten Eindruck. Im Geschäft geht es um das, was online schwer zu spüren ist:
                Farben sehen, Stoffe fühlen, Proportionen prüfen und gemeinsam kombinieren.
              </p>
            </SectionHeading>
            <div className="inline-actions">
              <CtaLink href="/ueber-uns" label="Christa kennenlernen" variant="secondary" />
              <CtaLink href="/kontakt" label="Kontakt aufnehmen" variant="text" />
            </div>
          </div>
          <ImageCard image={imagery.storeDetails[0]} ratio="landscape" title="Ruhig kuratiert" text="Auswahl statt Masse." />
        </div>
      </section>

      <section className="section">
        <div className="container">
          <SectionHeading eyebrow="Aktuelle Auswahl" title={currentCollection.title}>
            <p>{currentCollection.intro}</p>
          </SectionHeading>
          <div className="outfit-grid">
            {featuredOutfits.map((outfit) => (
              <ImageCard
                key={outfit.title}
                image={outfit.image}
                title={outfit.title}
                text={`${outfit.season} · ${outfit.note}`}
                sizes="(max-width: 720px) 100vw, (max-width: 1200px) 50vw, 25vw"
              />
            ))}
          </div>
          <div className="inline-actions">
            <CtaLink href="/mode" label="Aktuelle Mode ansehen" variant="secondary" />
            <CtaLink href="/outfits" label="Weitere Outfits" variant="text" />
          </div>
        </div>
      </section>

      <section className="section section-muted">
        <div className="container">
          <SectionHeading eyebrow="Marken" title="Ausgewählte Labels, persönlich erklärt">
            <p>
              Die Markenübersicht hilft bei der Orientierung. Im Geschäft zeigt Christa, welche Farben, Schnitte und
              Kombinationen zu Ihnen passen.
            </p>
          </SectionHeading>
          <div className="brand-index">
            {featuredBrands.map((brand) => (
              <Link className="brand-tile" data-reveal="item" href={`/marken/${brand.slug}`} key={brand.slug}>
                <span>
                  <span className="brand-initial" aria-hidden="true">
                    {brand.name.slice(0, 1)}
                  </span>
                </span>
                <span>
                  <strong>{brand.name}</strong>
                  <p>{brand.summary}</p>
                </span>
              </Link>
            ))}
          </div>
          <div className="inline-actions">
            <CtaLink href="/marken" label="Alle Marken ansehen" />
            <CtaLink href="/fair-trade" label="Fair-Trade-Haltung lesen" variant="secondary" />
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container grid-2">
          <div className="card">
            <p className="public-eyebrow">Besuch planen</p>
            <h2>{storeDetails.address.display}</h2>
            <p>
              {storeDetails.hours.map((hour) => `${hour.label}: ${hour.value}`).join(" · ")}. Die Adresse bleibt
              sichtbar und kopierbar; der Routenlink öffnet extern.
            </p>
            <div className="contact-actions">
              <CtaLink external href={storeDetails.routePlanningHref} label="Route planen" />
              <CtaLink href="/kontakt" label="Alle Kontaktdaten" variant="secondary" />
            </div>
          </div>
          <div className="card">
            <p className="public-eyebrow">Nachhaltiger einkaufen</p>
            <h2>Bewusst auswählen, länger Freude haben</h2>
            <p>
              Checkpot zeigt fair und nachhaltig orientierte Mode nur dort als konkrete Eigenschaft, wo sie zur Marke
              oder zum Stück belegt ist. Im Gespräch wird erklärt, was aktuell gilt und gut zu Ihnen passt.
            </p>
            <CtaLink href="/fair-trade" label="Prinzipien lesen" variant="text" />
          </div>
        </div>
      </section>
    </div>
  );
}
