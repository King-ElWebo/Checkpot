# Checkpot – Rechtliche Pflichtangaben & Fakten-Checkliste (Launch-Voraussetzung)

> **Workflow-Status:** Formularrücklauf am 08.09.2026 erfolgt. Pflichtangaben mit WKO Firmen A-Z, Gewerbedatenbank und Stadt Wien abgeglichen und im Impressum integriert. Ausstehende Punkte (AVVs, Hosting-Migration, Resend-Key, DNS) verbleiben für die Launch-Phase.  
> **Wichtiger Hinweis:** Dieses Dokument stellt eine technische Bestandsaufnahme der im Code implementierten IT-Dienste sowie der betrieblichen Pflichtangaben dar (keine Rechtsberatung).

---

## 1. Impressum (Offenlegung nach ECG, UGB, GewO & Mediengesetz)

Die rechtlichen Stammdaten wurden anhand des von Christa Hausmair am 08.09.2026 ausgefüllten Datenblatts sowie der behördlichen Abgleiche (WKO Gewerbedatenbank, Stadt Wien, RIS) verifiziert und unter `/impressum` integriert:

| Fachthema / Angabe | Status im Code & Veröffentlichung | Verifizierte Datenquelle & Ergebnis |
|---|---|---|
| **Medieninhaberin & Name** | **RESOLVED** (Veröffentlicht) | `Christa Hausmair` (WKO Firmen A-Z / Gewerbedatenbank). Christas handschriftliche Angabe `CHECKPOT` wird als Geschäftsbezeichnung geführt, nicht als Firmenname. |
| **Rechtsform** | **RESOLVED** (Veröffentlicht) | `Einzelunternehmen` (Owner-Formular 08.09.2026 & WKO). |
| **Geschäftsbezeichnung** | **RESOLVED** (Veröffentlicht) | `Checkpot Hietzing Boutique` (WKO Gewerbedatenbank). |
| **Standort / Geschäftsadresse** | **RESOLVED** (Veröffentlicht) | `Hietzinger Hauptstraße 10-16, 1130 Wien, Österreich` (Owner-Formular & WKO). |
| **Telefon & E-Mail** | **RESOLVED** (Veröffentlicht) | `(01) 877 58 87`, `store@checkpot-hietzing.at` (Zentral über Store Settings verwaltet). |
| **UID-Nummer** | **RESOLVED** (Veröffentlicht) | `ATU64656223` (Owner-Formular 08.09.2026). |
| **GISA-Zahl** | **RESOLVED** (Veröffentlicht) | `26767192` (WKO Gewerbedatenbank). |
| **Gewerbewortlaut** | **RESOLVED** (Veröffentlicht) | `Handelsgewerbe und Handelsagent` (WKO Gewerbedatenbank; Christas Angabe `Textileinzelhandel` beschreibt den Berufszweig). |
| **Berufszweig** | **RESOLVED** (Veröffentlicht) | `Einzelhandel mit Bekleidung und Textilien` (WKO Firmen A-Z). |
| **Kammerzugehörigkeit** | **RESOLVED** (Veröffentlicht) | `Wirtschaftskammer Wien (WKO)` (WKO Firmen A-Z). |
| **Fachorganisation** | **RESOLVED** (Veröffentlicht) | `Landesgremium Wien des Einzelhandels mit Mode und Freizeitartikeln` (WKO Fachgruppenstruktur). |
| **Zuständige Gewerbebehörde** | **RESOLVED** (Veröffentlicht) | `Magistratisches Bezirksamt für den 13. und 14. Bezirk` (Hietzinger Kai 1-3, 1130 Wien; Stadt Wien / ECG Behörde). Christas Eintragung `Handelsgewerbe und Handelsagentur` war eine Verwechslung mit dem Gewerbewortlaut. |
| **Anwendbare Vorschriften** | **RESOLVED** (Veröffentlicht) | `Gewerbeordnung 1994 (GewO)`, einsehbar unter [www.ris.bka.gv.at](https://www.ris.bka.gv.at) (§ 5 Abs. 1 Z 6 ECG / RIS). |
| **Firmenbuchnummer & -gericht** | **UNRESOLVED / ENTFÄLLT** | Im Owner-Formular mit Schrägstrich markiert; keine Firmenbucheintragung nachweisbar. Gemäß § 5 Abs. 1 Z 4 ECG nur *sofern vorhanden* anzugeben; entfällt im Impressum ohne Erfindung eines Negativvermerks. |
| **Verbraucher-Streitbeilegung** | **RESOLVED (NEUTRAL)** | Im Owner-Formular mit Schrägstrich markiert (weder Ja noch Nein). Neutraler Hinweis auf direkte Kontaktaufnahme per E-Mail ist aktiv; kein veralteter EU-ODR-Link. |

---

## 2. Datenschutzerklärung (DSGVO-Transparenzpflicht nach Art. 13 DSGVO)

Die Datenschutzerklärung unter `/datenschutz` spiegelt die im aktuellen Code tatsächlich implementierten Dienste und Verarbeitungen wider. Die verantwortliche Stelle ist mit `Checkpot Damenmoden / Inhaberin: Christa Hausmair` ausgewiesen.

### A) Vom Code technisch verifizierte Bestandsaufnahme

| Eingesetzter Dienst / Komponente | Tatsächlicher technischer Datenfluss im Code | Datenschutzrechtlicher Status |
|---|---|---|
| **Webhosting (Aktuell Vercel / Hosting-Migration ausstehend)** | Auslieferung der Website, Verarbeitung von Server-Logdaten (IP-Adresse, Browser, Zeitstempel zur Bereitstellung der Verbindung und Gefahrenabwehr). | Berechtigtes Interesse (Art. 6 Abs. 1 lit. f DSGVO). AVV mit dem finalen Hosting-Provider erforderlich (aktuell Vercel; nach erfolgter Migration mit Ziel-Host abzuschließen). |
| **Neon Inc. (PostgreSQL Datenbank)** | Speicherung von CMS-Daten (Geschäftsdaten, Sortiment, Marken, Outfits, Medienverweise) und pseudonymisierten Rate-Limit-Zählern. **Keine Speicherung von Kontaktanfragen oder Besucher-Trackingdaten.** | Berechtigtes Interesse / Vertragserfüllung. AVV mit Neon erforderlich. |
| **Vercel Blob Storage** | Speicherung und Auslieferung von Produkt- und Markenfotos. | Im Vercel DPA enthalten (ggf. analog zur Hosting-Migration zu migrieren). |
| **Resend Inc. (E-Mail Delivery)** | Weiterleitung von Kontaktformular-Anfragen (`Name`, `E-Mail`, optionale `Telefonnummer`, `Nachricht`) direkt per E-Mail an `christa.hausmair@outlook.at`. **Keine Speicherung in der Website-Datenbank.** | Vorvertragliche Maßnahmen / Berechtigtes Interesse (Art. 6 Abs. 1 lit. b / f DSGVO). AVV mit Resend erforderlich. |
| **Pseudonymes Rate-Limiting** | Schutz vor Missbrauch des Kontaktformulars und Admin-Login-Brute-Force. IP-Adressen werden ausschließlich als unumkehrbarer `HMAC-SHA256`-Hash mit serverseitigem Secret temporär verarbeitet. Keine Klartext-IPs in der Datenbank. | Berechtigtes Interesse (Art. 6 Abs. 1 lit. f DSGVO). |
| **Schriftarten (Self-Hosted via Next.js)** | Google Fonts (`Outfit`, `Inter`) werden beim Build-Prozess lokal eingebunden und vom eigenen Server ausgeliefert. **Keine Verbindungsdaten fließen an Google-Server.** | Keine Einwilligung erforderlich. |
| **Technisch notwendiges Cookie (`checkpot_consent`)** | First-Party-Cookie (`checkpot_consent`, 180 Tage Gültigkeit, SameSite=Lax). Speichert ausschließlich die gewählten Einstellungen für Statistik und externe Medien. | Technisch notwendig zur Nachweiserbringung und Einhaltung der Wahl (§ 165 Abs. 3 TKG 2021). |
| **Technisch notwendiges Admin-Session-Cookie (`admin_session`)** | Signiertes JWT (`jose`, HS256), HttpOnly, SameSite=Lax. Nur für authentifizierte Administratoren im geschützten CMS-Bereich. | Technisch notwendig für Session-Verwaltung. |
| **Google Analytics 4 (Optionale Webanalyse)** | Google Consent Mode v2 Basic Mode. **Strikte Vorab-Blockierung:** Vor Erteilung der expliziten Einwilligung werden keinerlei Skripte geladen, keine Tags ausgeführt und keine Cookies gesetzt. Bei Widerruf: Stop der Erfassung und bestmögliche browserseitige Bereinigung von `_ga*`-Cookies. | Einwilligung (Art. 6 Abs. 1 lit. a DSGVO). Google Ads/Analytics DPA erforderlich. |
| **Google Maps (Optionale Externe Medien)** | Interaktive Karte auf `/kontakt`. **Strikte Vorab-Blockierung:** Vor Einwilligung wird nur ein lokaler Platzhalter angezeigt; kein iframe, keine Netzwerkanfragen an Google. Bei Widerruf: iframe wird sofort entladen und Platzhalter wiederhergestellt. | Einwilligung (Art. 6 Abs. 1 lit. a DSGVO). |
| **Externe Hyperlinks (Maps-Routenlink & WhatsApp)** | Reine Hyperlinks (`<a>`-Tags) zu externen Plattformen. Verbindungsaufbau zu Drittanbietern erfolgt erst nach aktivem Klick der Nutzerin auf den Link. | Keine Vorab-Einwilligung erforderlich; transparente Information in der Datenschutzerklärung. |

---

## 3. Launch-Freigabe-Checkliste für die Inhaberin

- [x] **Firmenwortlaut & Rechtsform:** Verifiziert als `Christa Hausmair`, Einzelunternehmen; Geschäftsbezeichnung `Checkpot Hietzing Boutique`.
- [x] **UID-Nummer:** `ATU64656223` von Inhaberin am 08.09.2026 bestätigt und im Impressum hinterlegt.
- [x] **Gewerbebehörde & Kammer:** WKO Wien, Landesgremium Mode/Freizeitartikel, MBA 13/14 verifiziert und hinterlegt.
- [x] **GISA-Zahl:** `26767192` aus Gewerbedatenbank im Impressum hinterlegt.
- [ ] **Firmenbuch:** Keine Eintragung nachweisbar; Angaben entfallen im Impressum ordnungsgemäß.
- [ ] **Auftragsverarbeitungs-Verträge (AVV):** Bestätigung/Abschluss der AVVs mit Ziel-Hostingprovider (nach Migration), Neon, Resend und ggf. Google.
- [ ] **Produktions-Keys & Domain:** DNS-Zugang für `checkpot-hietzing.at` sowie Bereitstellung von `RESEND_API_KEY` und optional `NEXT_PUBLIC_GA_MEASUREMENT_ID` für die Live-Umgebung.
