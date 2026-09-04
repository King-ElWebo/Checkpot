# Checkpot – Rechtliche Pflichtangaben & Fakten-Checkliste (Launch-Voraussetzung)

> **Wichtiger Hinweis:** Dieses Dokument stellt eine rein technische Bestandsaufnahme der im aktuellen Code implementierten IT-Dienste sowie der benötigten betrieblichen Pflichtangaben dar (keine Rechtsberatung). Die markierten betrieblichen und rechtlichen Angaben müssen von der Inhaberin / der steuerlichen bzw. rechtlichen Vertretung vor dem endgültigen Go-Live geprüft, ergänzt und freigegeben werden.

---

## 1. Impressum (Offenlegung nach ECG, UGB, GewO & Mediengesetz)

Die technische Struktur für das Impressum ist unter `/impressum` implementiert und bezieht Kernstammdaten dynamisch aus der Datenbank (`store_details`). Folgende Angaben sind im Code hinterlegt bzw. müssen vor dem Launch final durch die Inhaberin bestätigt werden:

| Fachthema / Angabe | Aktueller technischer Status im Code | Erforderliche Prüfung / To-Do für Inhaberin (Christa Hausmair) |
|---|---|---|
| **Firmenwortlaut / Name** | Vorhanden (`Checkpot Damenmoden`) | Bitte exakten behördlich registrierten Firmenwortlaut bestätigen (z.B. Einzelunternehmen vs. eingetragene Unternehmerin `e.U.`). |
| **Inhaberin** | Vorhanden (`Christa Hausmair`) | Bestätigt. |
| **Standort / Geschäftsadresse** | Vorhanden (`Hietzinger Hauptstraße 10-16, 1130 Wien`) | Bestätigt. |
| **Telefon & E-Mail** | Vorhanden (`+43 1 876 54 32`, `christa.hausmair@outlook.at`) | Bitte bestätigen, ob dies die offizielle Impressums- und Kundenkontakt-E-Mail ist. |
| **UID-Nummer** | *Ausständig* | Sofern vorhanden, UID-Nummer (z.B. `ATU...`) angeben oder Bestätigung, dass keine UID vorliegt / Kleinunternehmerregelung greift. |
| **Firmenbuchnummer & -gericht** | *Ausständig* | Falls im Firmenbuch eingetragen: Firmenbuchnummer (FN ...) und Handelsgericht Wien angeben; falls nicht eingetragen, als nicht eingetragenes Einzelunternehmen bestätigen. |
| **Zuständige Gewerbebehörde** | Vorläufig hinterlegt (`Magistratisches Bezirksamt des XIII. Bezirkes (Wien-Hietzing)`) | Formell durch Inhaberin bzw. Gewerbeschein bestätigen. |
| **Kammerzugehörigkeit** | Vorläufig hinterlegt (`Wirtschaftskammer Wien (WKO)`) | Formell bestätigen (inkl. genauer Fachgruppe, z.B. Einzelhandel mit Mode- und Freizeitartikeln). |
| **Anwendbare berufsrechtliche Vorschriften** | Vorläufig hinterlegt (`Gewerbeordnung 1994 (GewO)`, einsehbar unter [www.ris.bka.gv.at](https://www.ris.bka.gv.at)) | Formell bestätigen. |
| **Unternehmensgegenstand** | Vorläufig hinterlegt (`Handel mit Damenbekleidung, Mode & Accessoires`) | Wortlaut bestätigen. |
| **Streitbeilegung & Verbraucherinfo** | Obsolet gewordener Link zur EU-ODR-Plattform wurde entfernt; neutraler Hinweis auf direkte Kontaktaufnahme per E-Mail ist aktiv. | Prüfen, ob eine gesetzliche oder freiwillige Verpflichtung zu einer alternativen Streitbeilegungsstelle (z.B. Internet Ombudsstelle) besteht. |

---

## 2. Datenschutzerklärung (DSGVO-Transparenzpflicht nach Art. 13 DSGVO)

Die Datenschutzerklärung unter `/datenschutz` spiegelt die im aktuellen Code tatsächlich implementierten Dienste und Verarbeitungen wider.

### A) Vom Code technisch verifizierte Bestandsaufnahme

| Eingesetzter Dienst / Komponente | Tatsächlicher technischer Datenfluss im Code | Datenschutzrechtlicher Status |
|---|---|---|
| **Vercel Inc. (Webhosting)** | Auslieferung der Website, Verarbeitung von Server-Logdaten (IP-Adresse, Browser, Zeitstempel zur Bereitstellung der Verbindung und Gefahrenabwehr). | Berechtigtes Interesse (Art. 6 Abs. 1 lit. f DSGVO). AVV / Data Processing Addendum mit Vercel erforderlich. Genaue Hosting-Region mit Live-Projektkonfiguration abgleichen. |
| **Neon Inc. (PostgreSQL Datenbank)** | Speicherung von CMS-Daten (Geschäftsdaten, Sortiment, Marken, Outfits, Medienverweise) und pseudonymisierten Rate-Limit-Zählern. **Keine Speicherung von Kontaktanfragen oder Besucher-Trackingdaten.** | Berechtigtes Interesse / Vertragserfüllung. AVV mit Neon erforderlich. |
| **Vercel Blob Storage** | Speicherung und Auslieferung von Produkt- und Markenfotos. | Im Vercel DPA enthalten. |
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

Folgende Punkte müssen vor dem Go-Live von der Inhaberin / der steuerlichen bzw. rechtlichen Beratung final freigegeben werden:

- [ ] **Firmenwortlaut & Rechtsform:** Genaue behördliche Schreibweise für das Impressum bestätigen (Einzelunternehmen vs. e.U.).
- [ ] **UID-Nummer:** Klären, ob eine UID-Nummer angegeben werden muss oder der Kleinunternehmerstatus greift.
- [ ] **Firmenbuch:** Klären, ob eine Firmenbucheintragung vorliegt (FN-Nummer) oder formell bestätigen, dass keine Eintragung existiert.
- [ ] **Gewerbebehörde & Kammer:** Magistratisches Bezirksamt und Wirtschaftskammer-Angaben auf Richtigkeit mit dem Gewerbeschein abgleichen.
- [ ] **E-Mail-Empfängerin:** Bestätigen, dass `christa.hausmair@outlook.at` die gewünschte operative Zieladresse für Kontaktanfragen ist.
- [ ] **Auftragsverarbeitungs-Verträge (AVV):** Abschluss/Bestätigung der AVVs mit Vercel, Neon, Resend und ggf. Google (über die jeweiligen Accounts).
- [ ] **Datenschutzerklärung & Impressum:** Endgültige Freigabe der Texte durch die Inhaberin / Rechtsberatung.
- [ ] **Produktions-Keys & Domain:** DNS-Zugang für `checkpot-hietzing.at` sowie Bereitstellung von `RESEND_API_KEY` und optional `NEXT_PUBLIC_GA_MEASUREMENT_ID` für die Live-Umgebung.
