import type { Metadata } from "next";
import Link from "next/link";
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
    <div className="flex flex-col bg-[#F9F9F8]">
      {/* Breadcrumbs */}
      <div className="mx-auto w-full max-w-[1200px] px-6 pt-8 lg:px-8">
        <Breadcrumbs
          items={[
            { label: "Startseite", href: "/" },
            { label: "Datenschutz", href: "/datenschutz" },
          ]}
        />
      </div>

      {/* Page Header */}
      <header className="mx-auto w-full max-w-[1200px] px-6 pt-4 pb-12 lg:px-8 lg:pt-6 lg:pb-16">
        <div className="max-w-3xl">
          <div className="flex items-center gap-3 mb-3">
            <span className="w-8 h-[2px] bg-[#C01718]" aria-hidden="true" />
            <span className="text-[12px] sm:text-[13px] font-semibold uppercase tracking-[0.14em] text-[#C01718]">
              Privatsphäre & Sicherheit
            </span>
          </div>
          <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl text-[#1A1A1A] tracking-tight font-normal leading-[1.08] mb-6">
            Datenschutzerklärung
          </h1>
          <p className="text-lg sm:text-xl leading-relaxed text-[#4A5568]">
            Der Schutz Ihrer persönlichen Daten ist uns ein wichtiges Anliegen. Wir verarbeiten Ihre
            Daten vertraulich und streng nach den gesetzlichen Vorschriften (DSGVO, TKG 2021).
          </p>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="mx-auto w-full max-w-[1200px] px-6 pb-20 lg:px-8 lg:pb-28">
        <div className="flex flex-col gap-10 lg:gap-12">
          
          {/* Trust Highlights Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white border border-[#E5E2DC] rounded-sm p-6 flex flex-col shadow-[0_2px_8px_rgba(0,0,0,0.02)]">
              <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#C01718] mb-2">
                Transparenz
              </span>
              <h2 className="font-display text-xl text-[#1A1A1A] font-medium mb-2">
                Keine Werbe-Tracker
              </h2>
              <p className="text-[14px] leading-relaxed text-[#4A5568]">
                Wir setzen keine Werbenetzwerke oder Tracking-Pixel Dritter ein. Ihre Besuchsdaten werden nicht für Werbezwecke weiterverarbeitet.
              </p>
            </div>

            <div className="bg-white border border-[#E5E2DC] rounded-sm p-6 flex flex-col shadow-[0_2px_8px_rgba(0,0,0,0.02)]">
              <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#C01718] mb-2">
                Zweckbindung
              </span>
              <h2 className="font-display text-xl text-[#1A1A1A] font-medium mb-2">
                Reine Beratung & Kontakt
              </h2>
              <p className="text-[14px] leading-relaxed text-[#4A5568]">
                Ihre Angaben dienen ausschließlich der Beantwortung Ihrer Anfragen und der persönlichen Kundenbetreuung in unserer Boutique.
              </p>
            </div>

            <div className="bg-white border border-[#E5E2DC] rounded-sm p-6 flex flex-col shadow-[0_2px_8px_rgba(0,0,0,0.02)]">
              <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#C01718] mb-2">
                Kontrolle
              </span>
              <h2 className="font-display text-xl text-[#1A1A1A] font-medium mb-2">
                Volle Betroffenenrechte
              </h2>
              <p className="text-[14px] leading-relaxed text-[#4A5568]">
                Sie haben jederzeit das Recht auf kostenfreie Auskunft, Berichtigung, Sperrung oder Löschung Ihrer gespeicherten Daten.
              </p>
            </div>
          </div>

          {/* Responsible Entity Card */}
          <div className="bg-white border border-[#E5E2DC] rounded-sm p-6 sm:p-8 lg:p-10 shadow-[0_4px_20px_rgba(0,0,0,0.02)]">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
              <div>
                <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#C01718] mb-2 block">
                  Verantwortliche Stelle
                </span>
                <h3 className="font-display text-2xl lg:text-3xl text-[#1A1A1A] font-medium mb-4">
                  {storeDetails.name}
                </h3>
                <div className="space-y-2 text-[#4A5568] text-[15px] leading-relaxed">
                  <p>
                    <strong className="text-[#1A1A1A]">Inhaberin:</strong> {storeDetails.owner}
                  </p>
                  <p>
                    <strong className="text-[#1A1A1A]">Adresse:</strong><br />
                    {storeDetails.address.street}<br />
                    {storeDetails.address.postalCode} {storeDetails.address.city}, Österreich
                  </p>
                </div>
              </div>

              <div>
                <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#C01718] mb-2 block">
                  Datenschutz-Kontakt
                </span>
                <h3 className="font-display text-2xl lg:text-3xl text-[#1A1A1A] font-medium mb-4">
                  Ansprechpartnerin
                </h3>
                <div className="space-y-3 text-[#4A5568] text-[15px] leading-relaxed">
                  <p>
                    Bei Fragen zur Erhebung, Verarbeitung oder Nutzung Ihrer personenbezogenen Daten
                    können Sie sich jederzeit direkt an uns wenden:
                  </p>
                  <p className="flex items-center gap-2 pt-1">
                    <span className="font-medium text-[#1A1A1A]">E-Mail:</span>
                    <a
                      href={`mailto:${storeDetails.email}`}
                      className="text-[#C01718] hover:underline font-medium focus:outline-hidden focus-visible:ring-2 focus-visible:ring-[#C01718]"
                    >
                      {storeDetails.email}
                    </a>
                  </p>
                  <p className="flex items-center gap-2">
                    <span className="font-medium text-[#1A1A1A]">Telefon:</span>
                    <a
                      href={`tel:${storeDetails.phone.replace(/[^0-9+]/g, "")}`}
                      className="text-[#C01718] hover:underline font-medium focus:outline-hidden focus-visible:ring-2 focus-visible:ring-[#C01718]"
                    >
                      {storeDetails.phone}
                    </a>
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Legal Explanations Sections */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
            
            {/* 1. Rechtsgrundlage & Zwecke */}
            <div className="bg-white border border-[#E5E2DC] rounded-sm p-6 sm:p-8 flex flex-col">
              <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#C01718] mb-2">
                Abschnitt 01
              </span>
              <h3 className="font-display text-xl lg:text-2xl text-[#1A1A1A] font-medium mb-3">
                Zweck & Rechtsgrundlage (Art. 6 DSGVO)
              </h3>
              <p className="text-[14px] leading-relaxed text-[#4A5568]">
                Die Verarbeitung personenbezogener Daten erfolgt ausschließlich zur Vertragserfüllung bzw. zur Durchführung vorvertraglicher Maßnahmen (Art. 6 Abs. 1 lit. b DSGVO), wie etwa zur individuellen Beratung, Übersendung von Kollektionsinformationen oder zur Bearbeitung von Anfragen, die Sie über das Kontaktformular oder per E-Mail an uns richten.
              </p>
            </div>

            {/* 2. Speicherdauer */}
            <div className="bg-white border border-[#E5E2DC] rounded-sm p-6 sm:p-8 flex flex-col">
              <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#C01718] mb-2">
                Abschnitt 02
              </span>
              <h3 className="font-display text-xl lg:text-2xl text-[#1A1A1A] font-medium mb-3">
                Speicherdauer & Fristen
              </h3>
              <p className="text-[14px] leading-relaxed text-[#4A5568]">
                Ihre Daten werden so lange gespeichert, wie dies für die Abwicklung der Geschäftsbeziehung, für Gewährleistungs- und Garantieansprüche oder auf Grund gesetzlicher steuer- und unternehmensrechtlicher Aufbewahrungspflichten (z. B. nach BAO / UGB) erforderlich ist. Nach Ablauf dieser Fristen werden die Daten gelöscht.
              </p>
            </div>

            {/* 3. Cookies & Google Analytics 4 (Consent Mode v2 Basic) */}
            <div className="bg-white border border-[#E5E2DC] rounded-sm p-6 sm:p-8 flex flex-col">
              <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#C01718] mb-2">
                Abschnitt 03
              </span>
              <h3 className="font-display text-xl lg:text-2xl text-[#1A1A1A] font-medium mb-3">
                Cookies, Webanalyse & Externe Medien
              </h3>
              <div className="text-[14px] leading-relaxed text-[#4A5568] space-y-3">
                <p>
                  <strong>Technisch notwendige Cookies:</strong> Wir setzen das First-Party-Cookie <code className="text-[12px] bg-[#FAF9F6] px-1 py-0.5 rounded-xs border border-[#ECEAE4]">checkpot_consent</code> (Gültigkeit: 180 Tage) ein, um Ihre Datenschutzauswahl zu speichern.
                </p>
                <p>
                  <strong>Google Analytics 4 (Google Consent Mode v2 Basic):</strong> Bei Erteilung Ihrer freiwilligen Einwilligung (Art. 6 Abs. 1 lit. a DSGVO) nutzen wir Google Analytics 4 (Google Ireland Limited, Gordon House, Barrow Street, Dublin 4, Irland). Vor Ihrer Zustimmung werden keinerlei Analyseskripte, Tags oder Cookies geladen und keine Daten an Google übermittelt. Werbefunktionen, Google Signals und personalisierte Werbung sind dauerhaft deaktiviert. Bei Widerruf über den Link <em>„Cookie-Einstellungen“</em> werden Analyse-Cookies automatisch bereinigt.
                </p>
                <p>
                  <strong>Google Maps (Externe Medien):</strong> Auf unserer Kontaktseite bieten wir zur Anreiseplanung eine interaktive Standortkarte von Google Maps (Google Ireland Limited, Gordon House, Barrow Street, Dublin 4, Irland; Mutterkonzern: Google LLC, 1600 Amphitheatre Parkway, Mountain View, CA 94043, USA) an. Die Karte wird erst nach Ihrer ausdrücklichen Einwilligung (Art. 6 Abs. 1 lit. a DSGVO) durch Klick auf <em>„Karte anzeigen“</em> oder über die <em>„Cookie-Einstellungen“</em> geladen. Erst mit dem Laden wird eine Verbindung zu den Servern von Google hergestellt, wobei Ihre IP-Adresse sowie Browser- und Gerätedaten an Google übertragen werden. Sie können diese Einwilligung jederzeit mit Wirkung für die Zukunft über die <em>„Cookie-Einstellungen“</em> im Footer widerrufen; in diesem Fall wird die Karte entladen und der lokale Platzhalter wiederhergestellt. Ohne Einwilligung bleiben Adresse und ein externer Routenplanungs-Link ohne Datenübertragung an Dritte nutzbar.
                </p>
                <p className="text-[12.5px] text-[#718096]">
                  Weitere Informationen finden Sie in der{" "}
                  <a
                    href="https://policies.google.com/privacy"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#C01718] underline hover:text-[#A01314]"
                  >
                    Google Datenschutzerklärung ↗
                  </a>{" "}
                  sowie den{" "}
                  <a
                    href="https://www.google.com/intl/de_at/help/terms_maps/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#C01718] underline hover:text-[#A01314]"
                  >
                    Zusätzlichen Nutzungsbedingungen für Google Maps ↗
                  </a>
                  .
                </p>
              </div>
            </div>

            {/* 4. Betroffenenrechte */}
            <div className="bg-white border border-[#E5E2DC] rounded-sm p-6 sm:p-8 flex flex-col">
              <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#C01718] mb-2">
                Abschnitt 04
              </span>
              <h3 className="font-display text-xl lg:text-2xl text-[#1A1A1A] font-medium mb-3">
                Ihre Rechte als betroffene Person
              </h3>
              <p className="text-[14px] leading-relaxed text-[#4A5568] mb-3">
                Gemäß Art. 13 ff. DSGVO stehen Ihnen folgende Betroffenenrechte uneingeschränkt zu:
              </p>
              <ul className="space-y-1.5 text-[13px] text-[#4A5568]">
                <li className="flex items-start gap-2">
                  <span className="text-[#C01718] font-bold" aria-hidden="true">•</span>
                  <span><strong>Auskunftsrecht (Art. 15 DSGVO):</strong> Auskunft über verarbeitete Daten.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#C01718] font-bold" aria-hidden="true">•</span>
                  <span><strong>Berichtigungsrecht (Art. 16 DSGVO):</strong> Korrektur unrichtiger Daten.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#C01718] font-bold" aria-hidden="true">•</span>
                  <span><strong>Löschungsrecht (Art. 17 DSGVO):</strong> Löschung nicht mehr benötigter Daten.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#C01718] font-bold" aria-hidden="true">•</span>
                  <span><strong>Einschränkung der Verarbeitung (Art. 18 DSGVO)</strong></span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#C01718] font-bold" aria-hidden="true">•</span>
                  <span><strong>Datenübertragbarkeit (Art. 20 DSGVO)</strong> &amp; <strong>Widerspruch (Art. 21 DSGVO)</strong></span>
                </li>
              </ul>
            </div>

            {/* 5. Aufsichtsbehörde */}
            <div className="bg-white border border-[#E5E2DC] rounded-sm p-6 sm:p-8 flex flex-col md:col-span-2">
              <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#C01718] mb-2">
                Abschnitt 05
              </span>
              <h3 className="font-display text-xl lg:text-2xl text-[#1A1A1A] font-medium mb-3">
                Beschwerderecht bei der Aufsichtsbehörde
              </h3>
              <p className="text-[14px] leading-relaxed text-[#4A5568] mb-3">
                Wenn Sie der Ansicht sind, dass die Verarbeitung Ihrer Daten gegen das Datenschutzrecht verstößt, haben Sie das Recht auf Beschwerde bei der zuständigen Aufsichtsbehörde:
              </p>
              <div className="bg-[#FAF9F6] border border-[#ECEAE4] rounded-xs p-4 text-[13px] text-[#4A5568] space-y-1">
                <p><strong className="text-[#1A1A1A]">Österreichische Datenschutzbehörde</strong></p>
                <p>Barichgasse 40-42, 1030 Wien</p>
                <p>E-Mail: <a href="mailto:dsb@dsb.gv.at" className="text-[#C01718] hover:underline">dsb@dsb.gv.at</a></p>
                <p>Web: <a href="https://www.dsb.gv.at" target="_blank" rel="noopener noreferrer" className="text-[#C01718] hover:underline">www.dsb.gv.at ↗</a></p>
              </div>
            </div>
          </div>

          {/* Bottom Reassurance Banner */}
          <div className="bg-[#FAF9F6] border border-[#ECEAE4] rounded-sm p-8 lg:p-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="max-w-xl">
              <h3 className="font-display text-2xl text-[#1A1A1A] font-medium mb-2">
                Fragen zu Ihren Daten?
              </h3>
              <p className="text-[#4A5568] text-[15px] leading-relaxed">
                Wir beantworten alle Anfragen zu Datenschutz und Ihren Betroffenenrechten zeitnah und persönlich.
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
