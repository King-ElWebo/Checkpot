import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { seoRoutes } from "@/content/fixtures/checkpot";
import { getStoreDetails } from "@/lib/repositories/store-settings";

const seo = seoRoutes.find((r) => r.route === "/datenschutz")!;

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

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function DatenschutzPage() {
  const storeDetails = await getStoreDetails();

  return (
    <div className="flex flex-col bg-white">
      <div className="mx-auto w-full max-w-3xl px-4 pt-12 lg:px-6">
        <Breadcrumbs
          items={[
            { label: "Startseite", href: "/" },
            { label: "Datenschutz", href: "/datenschutz" },
          ]}
        />
      </div>

      <section className="mx-auto w-full max-w-3xl px-4 py-12 lg:px-6 lg:py-20">
        <div className="prose prose-lg prose-p:text-[#4A5568] prose-p:leading-relaxed prose-h2:font-display prose-h2:text-2xl prose-h2:text-[#1A1A1A] prose-h2:mt-12 max-w-none">
          <h1 className="font-display text-4xl lg:text-5xl text-[#1A1A1A] tracking-tight mb-12">Datenschutzerklärung</h1>
          
          <p>
            Im Sinne des Artikel 6 Datenschutz-Grundverordnung (DSGVO) erfolgt die Verarbeitung Ihrer personenbezogenen Daten ausschließlich für Zwecke der Vertragserfüllung bzw. für Zwecke der Durchführung vorvertraglicher Maßnahmen (Beratung, Übersendung von Produktinformationen und Unterbreitung von Angeboten).
          </p>
          <p>
            Die Daten bleiben bis zur Beendigung der Geschäftsbeziehung oder bis zum Ablauf der geltenden Garantie-, Gewährleistungs-, Verjährungs- und gesetzlichen Aufbewahrungsfristen oder bis zur Beendigung von allfälligen Rechtsstreitigkeiten, bei denen die Daten als Beweis benötigt werden, gespeichert.
          </p>

          <h2>Kontakt mit uns</h2>
          <p>
            Wenn Sie per Formular auf der Website oder per E-Mail Kontakt mit uns aufnehmen, werden Ihre angegebenen Daten zwecks Bearbeitung der Anfrage und für den Fall von Anschlussfragen bei uns gespeichert. Diese Daten geben wir nicht ohne Ihre Einwilligung weiter.
          </p>

          <h2>Ihre Rechte</h2>
          <p>
            Im Sinne des Artikel 13 DSGVO wird ausdrücklich auf das Bestehen folgender Betroffenenrechte hingewiesen:
          </p>
          <ul>
            <li>Recht auf Auskunft über die betreffenden personenbezogenen Daten</li>
            <li>Recht auf Berichtigung</li>
            <li>Recht auf Löschung</li>
            <li>Recht auf Einschränkung der Verarbeitung</li>
            <li>Widerspruchsrecht gegen die Verarbeitung</li>
            <li>Recht auf Datenübertragbarkeit</li>
            <li>Beschwerderecht bei der Aufsichtsbehörde (Datenschutzbehörde)</li>
          </ul>

          <p>
            Verantwortlicher für die Datenverarbeitung: siehe Impressum
          </p>

          <p>
            <strong>Sie erreichen uns unter folgenden Kontaktdaten:</strong><br />
            {storeDetails.name}<br />
            {storeDetails.address.street}, {storeDetails.address.postalCode} {storeDetails.address.city}<br />
            E-Mail: {storeDetails.email}<br />
            Telefon: {storeDetails.phone}
          </p>
        </div>
      </section>
    </div>
  );
}
