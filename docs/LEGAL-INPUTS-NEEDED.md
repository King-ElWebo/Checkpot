# Checkpot – Rechtliche Pflichtangaben & Fakten-Checkliste (Launch-Voraussetzung)

> **Wichtiger Hinweis:** Dieses Dokument stellt eine rein technische Bestandsaufnahme der benötigten betrieblichen Pflichtangaben dar (keine Rechtsberatung). Diese Angaben müssen von der Inhaberin / der steuerlichen bzw. rechtlichen Vertretung vor dem endgültigen Go-Live bereitgestellt und rechtlich freigegeben werden.

---

## 1. Impressum (Offenlegung nach ECG, UGB, GewO & Mediengesetz)

Die technische Struktur für das Impressum ist unter `/impressum` implementiert und bezieht Basisdaten dynamisch aus den Geschäftsdaten. Folgende Pflichtfelder müssen vor dem Launch final geprüft bzw. ergänzt werden:

| Fachthema / Angabe | Aktueller technischer Status | Benötigte Angabe / To-Do für Inhaberin |
|---|---|---|
| **Vollständiger Firmenname** | Vorhanden (`Checkpot Damenmoden e.U.` bzw. Einzelunternehmen) | Bitte exakten behördlich registrierten Firmenwortlaut bestätigen. |
| **Inhaberin** | Vorhanden (`Christa Hausmair`) | Bestätigt. |
| **Standort / Geschäftsadresse** | Vorhanden (`Hietzinger Hauptstraße 10-16, 1130 Wien`) | Bestätigt. |
| **Telefon & E-Mail** | Vorhanden (`+43 1 876 54 32`, `christa.hausmair@outlook.at`) | Bitte bestätigen, ob offizielle Kundenkontakt-E-Mail. |
| **UID-Nummer (Umsatzsteuer-Identifikationsnummer)** | *Ausständig* | Sofern vorhanden, UID-Nummer (z.B. `ATU...`) eintragen oder Hinweis auf Kleinunternehmerregelung / Nicht-Vorhandensein bestätigen. |
| **Firmenbuchnummer & Firmenbuchgericht** | *Ausständig* | Falls im Firmenbuch eingetragen (z.B. `FN ...`), Nummer und Handelsgericht Wien angeben; falls nicht eingetragen, bestätigen. |
| **Zuständige Gewerbebehörde** | *Ausständig* | Typischerweise: `Magistratisches Bezirksamt für den 13./14. Bezirk` (Wien). Bitte bestätigen. |
| **Kammerzugehörigkeit** | *Ausständig* | Typischerweise: `Wirtschaftskammer Wien (WKW)`, Fachgruppe Mode- und Freizeitartikel / Einzelhandel. |
| **Anwendbare berufsrechtliche Vorschriften** | *Ausständig* | Typischerweise: `Gewerbeordnung 1994 (GewO)` – einsehbar unter [www.ris.bka.gv.at](https://www.ris.bka.gv.at). |
| **Unternehmensgegenstand** | *Ausständig* | Kurze Angabe: `Einzelhandel mit Damenbekleidung, Textilien und Accessoires`. |

---

## 2. Datenschutzerklärung (DSGVO-Transparenzpflicht nach Art. 13 DSGVO)

Die Datenschutzerklärung unter `/datenschutz` muss exakt die tatsächlich eingesetzten IT-Dienste widerspiegeln. Folgende Dienste sind technisch aktiv:

| Eingesetzter Dienst | Zweck & Datenfluss | Auftragsverarbeiter-Vertrag (AVV) / Status |
|---|---|---|
| **Vercel Inc. (Hosting & Edge)** | Auslieferung der Website, Verarbeitung von Server-Logdaten (IP-Adresse, Browser, Zeitstempel zur Bereitstellung der Verbindung). Server-Region: Frankfurt (`fra1`). | AVV / Data Processing Addendum mit Vercel erforderlich. |
| **Neon Inc. (PostgreSQL Datenbank)** | Speicherung administrativer Geschäftsdaten, Sortiment (Marken, Outfits, Medien) sowie pseudonymisierter Abuse-Control-Hashes (Rate-Limiting). | AVV mit Neon erforderlich. |
| **Vercel Blob Storage** | Speicherung und Auslieferung von Produkt- und Markenfotos. | Im Vercel DPA enthalten. |
| **Resend Inc. (E-Mail Delivery)** | Weiterleitung von Kontaktformular-Anfragen (`Name`, `E-Mail`, `Telefon`, `Nachricht`) an `christa.hausmair@outlook.at`. Keine dauerhafte Datenhaltung auf der Website-Datenbank. | AVV mit Resend erforderlich. |
| **Pseudonymes Rate-Limiting** | Schutz vor Missbrauch des Kontaktformulars und Login-Brute-Force. IP-Adressen werden ausschließlich als unumkehrbarer HMAC-SHA256 Hash temporär verarbeitet; keine Klartext-Speicherung. | Berechtigtes Interesse (Art. 6 Abs. 1 lit. f DSGVO). |
| **Schriftarten (Self-Hosted)** | Google Fonts (`Outfit`, `Inter`) werden beim Build-Prozess lokal heruntergeladen und vom eigenen Server ausgeliefert. **Keine Verbindungsdaten fließen an Google-Server.** | Keine gesonderte Einwilligung erforderlich. |
| **Externe Verlinkungen (WhatsApp & Google Maps)** | Reine Hyperlinks (`<a>`-Tags) zu externen Plattformen. Eine Datenübertragung an WhatsApp/Meta oder Google findet erst nach aktivem Klick der Nutzerin statt. | Keine Consent-Pflicht vor dem Klick. |
| **Cookies / Tracking** | **Keine Marketing- oder Analyse-Cookies im Einsatz.** Es wird ausschließlich ein technisch notwendiges Session-Cookie (`admin_session`, HttpOnly, SameSite=Lax) für angemeldete Administratoren gesetzt. | Kein Cookie-Banner erforderlich. |

---

## 3. Launch-Freigabe-Checkliste für die Inhaberin

- [ ] UID-Nummer und Firmenbuch-Status für das Impressum geklärt und in den Geschäftsdaten (`/admin/store`) bzw. Impressum eingetragen.
- [ ] Gewerbebehörde und Kammerangaben bestätigt.
- [ ] Datenschutzerklärung durch Inhaberin / Rechtsberatung anhand der obenstehenden technischen Bestandsaufnahme freigegeben.
- [ ] Domain-Inhaberschaft und DNS-Zugang für `checkpot-hietzing.at` zur Vercel-Aufschaltung bereit.
