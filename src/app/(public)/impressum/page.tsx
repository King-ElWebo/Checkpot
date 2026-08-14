import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { storeDetails, seoRoutes } from "@/content/fixtures/checkpot";

const seo = seoRoutes.find((r) => r.route === "/impressum")!;

export const metadata: Metadata = {
  title: seo.title,
  description: seo.description,
  alternates: {
    canonical: seo.canonical,
  },
  robots: {
    index: false,
    follow: true,
  },
};

export default function ImpressumPage() {
  return (
    <div className="mx-auto max-w-4xl px-6 py-12 lg:px-8">
      <Breadcrumbs
        items={[
          { label: "Startseite", href: "/" },
          { label: "Impressum", href: "/impressum" },
        ]}
      />

      <div className="prose prose-lg prose-p:text-[#4A5568] prose-h2:text-[#1A1A1A] max-w-none">
        <h1 className="text-4xl font-normal tracking-tight text-[#1A1A1A]">Impressum</h1>
        
        <h2>Informationspflicht laut E-Commerce Gesetz</h2>
        <p>
          <strong>{storeDetails.name}</strong><br />
          Inhaberin: {storeDetails.owner}<br />
          {storeDetails.address.street}<br />
          {storeDetails.address.postalCode} {storeDetails.address.city}<br />
          Österreich
        </p>
        
        <p>
          <strong>Kontakt:</strong><br />
          Tel: {storeDetails.phone}<br />
          E-Mail: {storeDetails.email}
        </p>

        <div className="bg-[#F9F9F8] border-l-4 border-[#C01718] p-4 my-8">
          <p className="text-sm m-0">
            <strong>Hinweis für die Inhaberin:</strong> Weitere rechtliche Pflichtangaben (wie UID-Nummer, Firmenbuchnummer, Kammerzugehörigkeit, Aufsichtsbehörde) müssen nach rechtlicher Prüfung hier noch ergänzt werden.
          </p>
        </div>

        <h2>Haftungsausschluss</h2>
        <p>
          Trotz sorgfältiger inhaltlicher Kontrolle übernehmen wir keine Haftung für die Inhalte externer Links. 
          Für den Inhalt der verlinkten Seiten sind ausschließlich deren Betreiber verantwortlich.
        </p>
      </div>
    </div>
  );
}
