import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";

import { Breadcrumbs } from "@/components/public/layout/breadcrumbs";
import { JsonLd } from "@/components/public/seo/json-ld";
import { breadcrumbJsonLd } from "@/components/public/seo/schema";
import { ImageCard } from "@/components/public/sections/image-card";
import { SectionHeading } from "@/components/public/sections/section-heading";
import { CtaLink } from "@/components/ui/cta-link";
import { brands, getBrandBySlug, getRelatedBrands, siteUrl } from "@/content/fixtures/checkpot";

type BrandPageProps = {
  params: Promise<{ slug: string }>;
};

export const dynamicParams = false;

export function generateStaticParams() {
  return brands.filter((brand) => brand.active).map((brand) => ({ slug: brand.slug }));
}

export async function generateMetadata({ params }: BrandPageProps): Promise<Metadata> {
  const { slug } = await params;
  const brand = getBrandBySlug(slug);

  if (!brand) {
    return {};
  }

  const canonical = `/marken/${brand.slug}`;

  return {
    title: `${brand.name} Kollektion`,
    description: `Aktuelle Kollektion von ${brand.name} bei Checkpot in Wien Hietzing entdecken.`,
    alternates: { canonical },
    robots: { index: true, follow: true },
    openGraph: {
      title: `${brand.name} Kollektion | Checkpot Hietzing`,
      description: brand.summary,
      url: new URL(canonical, siteUrl).toString(),
      siteName: "Checkpot Hietzing",
      images: [{ url: "/customer/og-image.jpg", width: 1200, height: 630, alt: "Checkpot Hietzing Store Außenansicht" }],
      locale: "de_AT",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: `${brand.name} Kollektion | Checkpot Hietzing`,
      description: brand.summary,
      images: ["/customer/og-image.jpg"],
    },
  };
}

export default async function BrandDetailPage({ params }: BrandPageProps) {
  const { slug } = await params;
  const brand = getBrandBySlug(slug);

  if (!brand) {
    notFound();
  }

  const breadcrumbs = [
    { label: "Start", href: "/" },
    { label: "Marken", href: "/marken" },
    { label: brand.name, href: `/marken/${brand.slug}` },
  ] as const;
  const relatedBrands = getRelatedBrands(brand);

  return (
    <div className="public-page">
      <JsonLd data={breadcrumbJsonLd([...breadcrumbs])} />
      <div className="container">
        <Breadcrumbs items={[...breadcrumbs]} />
      </div>
      <section className="container brand-detail">
        <ImageCard image={brand.image} ratio="portrait" title={`${brand.name} bei Checkpot`} text={brand.note} />
        <div className="brand-detail-copy">
          <p className="public-eyebrow">Marke</p>
          <h1>{brand.name} bei Checkpot</h1>
          <p className="lead">{brand.detail}</p>
          <p>{brand.note} Checkpot zeigt hier keine Preise, keine Lagerbestände und keine Online-Bestellung.</p>
          <div className="inline-actions">
            <CtaLink href="/mode" label="Aktuelle Kollektion ansehen" />
            <CtaLink href="/kontakt" label="Geschäft besuchen" variant="secondary" />
          </div>
        </div>
      </section>
      {relatedBrands.length > 0 ? (
        <section className="section section-muted">
          <div className="container">
            <SectionHeading title="Passende Marken">
              <p>Diese Labels passen in der aktuellen Fixture-Auswahl thematisch zu {brand.name}.</p>
            </SectionHeading>
            <div className="grid-3">
              {relatedBrands.map((related) => (
                <Link className="brand-card" href={`/marken/${related.slug}`} key={related.slug}>
                  <ImageCard image={related.image} title={related.name} text={related.summary} ratio="landscape" />
                </Link>
              ))}
            </div>
          </div>
        </section>
      ) : null}
    </div>
  );
}
