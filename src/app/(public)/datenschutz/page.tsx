import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { storeDetails, seoRoutes } from "@/content/fixtures/checkpot";

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

export default function DatenschutzPage() {
  return (
    <div className="mx-auto max-w-4xl px-6 py-12 lg:px-8">
      <Breadcrumbs
        items={[
          { label: "Startseite", href: "/" },
          { label: "Datenschutz", href: "/datenschutz" },
        ]}
      />

      <div className="prose prose-lg prose-p:text-[#4A5568] prose-h2:text-[#1A1A1A] max-w-none">
        <h1 className="text-4xl font-normal tracking-tight text-[#1A1A1A]">Datenschutzerklärung</h1>
        
        <p>
          Der Schutz Ihrer persönlichen Daten ist uns ein besonderes Anliegen. Wir verarbeiten Ihre Daten daher 
          ausschließlich auf Grundlage der gesetzlichen Bestimmungen (DSGVO, TKG 2003). In diesen 
          Datenschutzinformationen informieren wir Sie über die wichtigsten Aspekte der Datenverarbeitung im 
          Rahmen unserer Website.
        </p>

        <h2>Kontakt mit uns</h2>
        <p>
          Wenn Sie per Formular auf der Website oder per E-Mail Kontakt mit uns aufnehmen, werden Ihre 
          angegebenen Daten zwecks Bearbeitung der Anfrage und für den Fall von Anschlussfragen bei uns gespeichert. 
          Diese Daten geben wir nicht ohne Ihre Einwilligung weiter.
        </p>

        <div className="bg-[#F9F9F8] border-l-4 border-[#C01718] p-4 my-8">
          <p className="text-sm m-0">
            <strong>Hinweis für die Inhaberin:</strong> Die vollständige Datenschutzerklärung (Server-Logs, Cookies, Analysetools, Webfonts etc.) muss entsprechend der finalen technischen Konfiguration der Website rechtlich abgestimmt und hier eingefügt werden.
          </p>
        </div>

        <h2>Ihre Rechte</h2>
        <p>
          Ihnen stehen grundsätzlich die Rechte auf Auskunft, Berichtigung, Löschung, Einschränkung, 
          Datenübertragbarkeit, Widerruf und Widerspruch zu. Wenn Sie glauben, dass die Verarbeitung Ihrer Daten gegen das 
          Datenschutzrecht verstößt oder Ihre datenschutzrechtlichen Ansprüche sonst in einer Weise verletzt worden sind, 
          können Sie sich bei der Aufsichtsbehörde beschweren. In Österreich ist dies die Datenschutzbehörde.
        </p>

        <p>
          <strong>Sie erreichen uns unter folgenden Kontaktdaten:</strong><br />
          {storeDetails.name}<br />
          {storeDetails.address.street}, {storeDetails.address.postalCode} {storeDetails.address.city}<br />
          E-Mail: {storeDetails.email}<br />
          Telefon: {storeDetails.phone}
        </p>
      </div>
    </div>
  );
}
