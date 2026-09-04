import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { seoRoutes } from "@/content/fixtures/checkpot";
import { getStoreDetails } from "@/lib/repositories/store-settings";

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

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function ImpressumPage() {
  const storeDetails = await getStoreDetails();

  return (
    <div className="flex flex-col bg-[#F9F9F8]">
      {/* Breadcrumbs */}
      <div className="mx-auto w-full max-w-[1200px] px-6 pt-8 lg:px-8">
        <Breadcrumbs
          items={[
            { label: "Startseite", href: "/" },
            { label: "Impressum", href: "/impressum" },
          ]}
        />
      </div>

      {/* Page Header */}
      <header className="mx-auto w-full max-w-[1200px] px-6 pt-4 pb-12 lg:px-8 lg:pt-6 lg:pb-16">
        <div className="max-w-3xl">
          <div className="flex items-center gap-3 mb-3">
            <span className="w-8 h-[2px] bg-[#C01718]" aria-hidden="true" />
            <span className="text-[12px] sm:text-[13px] font-semibold uppercase tracking-[0.14em] text-[#C01718]">
              Rechtliche Angaben & Transparenz
            </span>
          </div>
          <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl text-[#1A1A1A] tracking-tight font-normal leading-[1.08] mb-6">
            Impressum
          </h1>
          <p className="text-lg sm:text-xl leading-relaxed text-[#4A5568]">
            Angaben und rechtliche Informationen gemäß § 5 E-Commerce-Gesetz (ECG),
            § 14 Unternehmensgesetzbuch (UGB) und § 25 Mediengesetz.
          </p>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="mx-auto w-full max-w-[1200px] px-6 pb-20 lg:px-8 lg:pb-28">
        <div className="flex flex-col gap-10 lg:gap-12">
          
          {/* Key Company Details Card */}
          <div className="bg-white border border-[#E5E2DC] rounded-sm p-6 sm:p-8 lg:p-10 shadow-[0_4px_20px_rgba(0,0,0,0.02)]">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
              
              {/* Column 1: Company & Ownership */}
              <div className="flex flex-col">
                <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#C01718] mb-2">
                  Medieninhaberin & Herausgeberin
                </span>
                <h2 className="font-display text-2xl lg:text-3xl text-[#1A1A1A] font-medium mb-4">
                  {storeDetails.name}
                </h2>
                
                <div className="space-y-2 text-[#4A5568] text-[15px] leading-relaxed">
                  <p>
                    <strong className="text-[#1A1A1A]">Inhaberin:</strong> {storeDetails.owner}
                  </p>
                  <p>
                    <strong className="text-[#1A1A1A]">Adresse:</strong><br />
                    {storeDetails.address.street}<br />
                    {storeDetails.address.postalCode} {storeDetails.address.city}, Österreich
                  </p>
                  <p className="pt-2">
                    <strong className="text-[#1A1A1A]">Unternehmensgegenstand:</strong><br />
                    Handel mit Damenbekleidung, Mode & Accessoires
                  </p>
                </div>
              </div>

              {/* Column 2: Direct Contact & Authorities */}
              <div className="flex flex-col">
                <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#C01718] mb-2">
                  Kontakt & Aufsichtsbehörde
                </span>
                <h3 className="font-display text-2xl lg:text-3xl text-[#1A1A1A] font-medium mb-4">
                  Direkter Kontakt
                </h3>

                <div className="space-y-3 text-[#4A5568] text-[15px] leading-relaxed mb-6">
                  <p className="flex items-center gap-2">
                    <span className="font-medium text-[#1A1A1A]">Telefon:</span>
                    <a
                      href={`tel:${storeDetails.phone.replace(/[^0-9+]/g, "")}`}
                      className="text-[#C01718] hover:underline font-medium focus:outline-hidden focus-visible:ring-2 focus-visible:ring-[#C01718]"
                    >
                      {storeDetails.phone}
                    </a>
                  </p>
                  <p className="flex items-center gap-2">
                    <span className="font-medium text-[#1A1A1A]">E-Mail:</span>
                    <a
                      href={`mailto:${storeDetails.email}`}
                      className="text-[#C01718] hover:underline font-medium focus:outline-hidden focus-visible:ring-2 focus-visible:ring-[#C01718]"
                    >
                      {storeDetails.email}
                    </a>
                  </p>
                </div>

                <div className="border-t border-[#ECEAE4] pt-4 space-y-2 text-[13px] text-[#718096] leading-relaxed">
                  <p>
                    <strong className="text-[#1A1A1A]">Kammerzugehörigkeit:</strong> Wirtschaftskammer Wien (WKO)
                  </p>
                  <p>
                    <strong className="text-[#1A1A1A]">Gewerbebehörde:</strong> Magistratisches Bezirksamt des XIII. Bezirkes (Wien-Hietzing)
                  </p>
                  <p>
                    <strong className="text-[#1A1A1A]">Anwendbare Vorschriften:</strong> Gewerbeordnung 1994 (GewO), abrufbar unter{" "}
                    <a
                      href="https://www.ris.bka.gv.at"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#C01718] hover:underline"
                    >
                      www.ris.bka.gv.at
                    </a>
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Legal Explanations Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
            
            {/* 1. Onlineangebote */}
            <div className="bg-white border border-[#E5E2DC] rounded-sm p-6 sm:p-8 flex flex-col">
              <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#C01718] mb-2">
                Abschnitt 01
              </span>
              <h3 className="font-display text-xl lg:text-2xl text-[#1A1A1A] font-medium mb-3">
                Inhalt des Onlineangebotes
              </h3>
              <p className="text-[14px] leading-relaxed text-[#4A5568]">
                Die Betreiberin übernimmt keinerlei Gewähr für die Aktualität, Korrektheit, Vollständigkeit oder Qualität der bereitgestellten Informationen. Haftungsansprüche materieller oder ideeller Art gegen die Autorin, welche durch die Nutzung oder Nichtnutzung fehlerhafter oder unvollständiger Informationen verursacht wurden, sind grundsätzlich ausgeschlossen, sofern kein nachweislich vorsätzliches oder grob fahrlässiges Verschulden vorliegt.
              </p>
            </div>

            {/* 2. Links & Verweise */}
            <div className="bg-white border border-[#E5E2DC] rounded-sm p-6 sm:p-8 flex flex-col">
              <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#C01718] mb-2">
                Abschnitt 02
              </span>
              <h3 className="font-display text-xl lg:text-2xl text-[#1A1A1A] font-medium mb-3">
                Verweise & Hyperlinks
              </h3>
              <p className="text-[14px] leading-relaxed text-[#4A5568]">
                Bei direkten oder indirekten Verweisen auf fremde Webseiten (&quot;Hyperlinks&quot;), die außerhalb des Verantwortungsbereiches der Betreiberin liegen, wird keine Haftung für deren Inhalte übernommen. Zum Zeitpunkt der Linksetzung waren keine illegalen Inhalte erkennbar. Für illegale, fehlerhafte oder unvollständige Inhalte und Schäden aus der Nutzung verlinkter Seiten haftet allein der jeweilige Anbieter.
              </p>
            </div>

            {/* 3. Urheberrecht */}
            <div className="bg-white border border-[#E5E2DC] rounded-sm p-6 sm:p-8 flex flex-col">
              <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#C01718] mb-2">
                Abschnitt 03
              </span>
              <h3 className="font-display text-xl lg:text-2xl text-[#1A1A1A] font-medium mb-3">
                Urheber- & Kennzeichenrecht
              </h3>
              <p className="text-[14px] leading-relaxed text-[#4A5568]">
                Das Copyright für veröffentlichte, von der Betreiberin selbst erstellte Objekte und Bildmaterialien bleibt allein bei Checkpot Hietzing. Eine Vervielfältigung oder Verwendung von Grafiken, Texten oder Fotos in anderen elektronischen oder gedruckten Publikationen ist ohne ausdrückliche schriftliche Zustimmung nicht gestattet. Alle innerhalb des Angebotes genannten Marken- und Warenzeichen Dritter unterliegen uneingeschränkt den Bestimmungen des jeweils gültigen Kennzeichenrechts.
              </p>
            </div>

            {/* 4. Streitbeilegung */}
            <div className="bg-white border border-[#E5E2DC] rounded-sm p-6 sm:p-8 flex flex-col">
              <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#C01718] mb-2">
                Abschnitt 04
              </span>
              <h3 className="font-display text-xl lg:text-2xl text-[#1A1A1A] font-medium mb-3">
                Streitbeilegung & Verbraucherinformation
              </h3>
              <p className="text-[14px] leading-relaxed text-[#4A5568]">
                Verbraucher haben die Möglichkeit, allfällige Anfragen oder Beschwerden direkt an unsere oben angegebene E-Mail-Adresse zu richten.
              </p>
            </div>
          </div>

          {/* Bottom Reassurance Banner */}
          <div className="bg-[#FAF9F6] border border-[#ECEAE4] rounded-sm p-8 lg:p-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="max-w-xl">
              <h3 className="font-display text-2xl text-[#1A1A1A] font-medium mb-2">
                Haben Sie Fragen zu unserem Angebot?
              </h3>
              <p className="text-[#4A5568] text-[15px] leading-relaxed">
                Wir legen großen Wert auf persönliche Transparenz und ein vertrauensvolles Miteinander. Besuchen Sie uns gerne direkt in Hietzing.
              </p>
            </div>
            <Link
              href="/kontakt"
              className="inline-flex items-center justify-center rounded-sm bg-[#C01718] px-7 py-3.5 text-[13px] font-medium uppercase tracking-[0.08em] !text-white text-white transition-colors duration-200 ease-out hover:bg-[#A01314] hover:!text-white shrink-0 self-start md:self-center focus:outline-hidden focus-visible:ring-2 focus-visible:ring-[#C01718]"
            >
              <span className="text-white font-medium">Kontakt aufnehmen →</span>
            </Link>
          </div>

        </div>
      </main>
    </div>
  );
}
