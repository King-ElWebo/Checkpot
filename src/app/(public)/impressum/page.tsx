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
    <div className="flex flex-col bg-white">
      <div className="mx-auto w-full max-w-3xl px-4 pt-12 lg:px-6">
        <Breadcrumbs
          items={[
            { label: "Startseite", href: "/" },
            { label: "Impressum", href: "/impressum" },
          ]}
        />
      </div>

      <section className="mx-auto w-full max-w-3xl px-4 py-12 lg:px-6 lg:py-20">
        <div className="prose prose-lg prose-p:text-[#4A5568] prose-p:leading-relaxed prose-h2:font-display prose-h2:text-2xl prose-h2:text-[#1A1A1A] prose-h2:mt-12 max-w-none">
          <h1 className="font-display text-4xl lg:text-5xl text-[#1A1A1A] tracking-tight mb-12">Impressum</h1>
          
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

          <div className="bg-[#F9F9F8] border-l-4 border-[#C01718] p-6 my-10 rounded-r-sm">
            <p className="text-[15px] m-0 text-[#1A1A1A]">
              <strong>Hinweis für die Inhaberin:</strong> Weitere rechtliche Pflichtangaben (wie UID-Nummer, Firmenbuchnummer, Kammerzugehörigkeit, Aufsichtsbehörde) müssen nach rechtlicher Prüfung hier noch ergänzt werden.
            </p>
          </div>

          <h2>1. Inhalt des Onlineangebotes</h2>
          <p>
            Der Autor übernimmt keinerlei Gewähr für die Aktualität, Korrektheit, Vollständigkeit oder Qualität der bereitgestellten Informationen. Haftungsansprüche gegen den Autor, welche sich auf Schäden materieller oder ideeller Art beziehen, die durch die Nutzung oder Nichtnutzung der dargebotenen Informationen bzw. durch die Nutzung fehlerhafter und unvollständiger Informationen verursacht wurden, sind grundsätzlich ausgeschlossen, sofern seitens des Autors kein nachweislich vorsätzliches oder grob fahrlässiges Verschulden vorliegt.
          </p>

          <h2>2. Verweise und Links</h2>
          <p>
            Bei direkten oder indirekten Verweisen auf fremde Webseiten (&quot;Hyperlinks&quot;), die außerhalb des Verantwortungsbereiches des Autors liegen, würde eine Haftungsverpflichtung ausschließlich in dem Fall in Kraft treten, in dem der Autor von den Inhalten Kenntnis hat und es ihm technisch möglich und zumutbar wäre, die Nutzung im Falle rechtswidriger Inhalte zu verhindern. Deshalb distanziert er sich hiermit ausdrücklich von allen Inhalten aller verlinkten /verknüpften Seiten, die nach der Linksetzung verändert wurden.
          </p>

          <h2>3. Urheber- und Kennzeichenrecht</h2>
          <p>
            Das Copyright für veröffentlichte, vom Autor selbst erstellte Objekte bleibt allein beim Autor der Seiten. Eine Vervielfältigung oder Verwendung solcher Grafiken, Tondokumente, Videosequenzen und Texte in anderen elektronischen oder gedruckten Publikationen ist ohne ausdrückliche Zustimmung des Autors nicht gestattet.
          </p>
        </div>
      </section>
    </div>
  );
}
