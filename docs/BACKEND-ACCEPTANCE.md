# Checkpot Backend Acceptance

> Stand: 2026-08-30 (Phase 8 Final Technical Acceptance Audit)  
> Status: **BACKEND READY TO FREEZE**

---

## 1. Acceptance Date
- **Datum:** 2026-08-30
- **Auditor:** DeepMind Antigravity Pair-Programming Agent

---

## 2. Git Baseline
- **Branch:** `main`
- **Remote Baseline:** `origin/main` (synchronisiert bei `17dc428`)
- **Linear History:** 12 verifizierte lokale/gepushte Commits ohne Squashing oder Rebase-Konflikte.

---

## 3. Database
- **Provider:** Neon Serverless PostgreSQL (`@neondatabase/serverless` + Drizzle ORM).
- **Tabellenbestand (12 Tabellen):**
  - `system_settings`: 1 Zeile (`store_details`)
  - `media`: 16 Zeilen (100% Alt-Texte gepflegt, Integrität gewahrt)
  - `brands`: 18 Zeilen (15 aktive freigegebene Marken + 3 inaktive Legacy-Marken)
  - `collections`: 3 Zeilen (`Frühjahr / Sommer`, `Herbst / Winter`, `Frühlingserwachen in Hietzing`)
  - `outfits`: 6 Zeilen (4 aktive kanonische Outfits + 2 inaktive Duplikate)
  - `outfit_brands`: 4 Verknüpfungen
  - `outfit_category_groups`: 3 Gruppen (`Saison`, `Stil`, `Farbwelt`)
  - `outfit_categories`: 11 Kategorien
  - `outfit_category_assignments`: 18 Verknüpfungen
  - `page_content`: 1 Zeile
  - `rate_limits`: Concurrency-safe Tabelle mit atomarem SQL-Upsert
  - `audit_logs`: Strukturierte Protokollierung administrativer Aktionen
- **Integritätsstatus:** 0 verwaiste Fremdschlüssel, 0 fehlerhafte Joins, 0 ungültige Referenzen.

---

## 4. Authentication
- **Architektur:** Single-Admin Bootstrap via `ADMIN_PASSWORD`, signierte `jose` HS256 JWT-Sessions (`httpOnly`, `sameSite: lax`, `secure` in Production, 7 Tage Gültigkeit).
- **Schutz:** Optimistischer Middleware-Filter (`src/proxy.ts`) + strikte Server-Side Autorisierung (`requireAdmin()`) an allen geschützten Mutationsgrenzen und API-Routen.
- **Fail-Safe:** Ungültige oder abgelaufene Tokens werden fail-closed abgewiesen und erzwingen einen sauberen Login-Redirect.

---

## 5. Rate Limiting
- **Durable Persistence:** Atomare PostgreSQL Upserts in Neon (`rate_limits` Tabelle).
- **Login Brute-Force Schutz:** Maximal 5 Fehlversuche pro 15-Minuten-Fenster.
- **Kontaktformular Missbrauchsschutz:** Maximal 5 Einreichungen pro 10-Minuten-Fenster.
- **Datenschutz:** IP-Adressen werden ausschließlich als pseudonymer `HMAC-SHA256(RATE_LIMIT_SECRET, ip)` Hash gespeichert. Null Klartext-IPs oder Passwörter in Logs oder Datenbank.

---

## 6. Contact Form
- **Validierung:** Strikte Zod-Validierung (`src/lib/validations/contact.ts`).
- **Spamschutz:** Unsichtbares Honeypot-Feld blockiert automatisierte Bots vor der Verarbeitung.
- **E-Mail-Versand:** Vorbereitet via Resend Server Action. Zieladresse: `christa.hausmair@outlook.at`, Absender: `website@checkpot-hietzing.at`, `Reply-To`: E-Mail-Adresse des Besuchers.
- **Datenschutz:** Keine Speicherung von Nachrichten oder personenbezogenen Anfragedaten in der Neon-Datenbank.

---

## 7. Media
- **Upload Pipeline:** Client-seitige Bildoptimierung (`src/lib/image-compression.ts`), Erhalt von PNG-Transparenz und WebP-Kompression.
- **Sicherheitsfilter:** Server-seitige Magic-Byte-Prüfung und MIME-Type-Validierung (akzeptiert JPEG, PNG, WebP; SVG über reguläre Uploads gesperrt).
- **Löschschutz:** Medien in aktiver Verwendung (Marken-Logos, Titelbilder, Outfits) sind gegen versehentliches Löschen geschützt.

---

## 8. Store Settings
- **Single Source of Truth:** `system_settings` (Key `store_details`).
- **Verbraucher:** Header, Footer, `/kontakt`, `/ueber-uns`, `/impressum`, `/datenschutz`, `LocalBusiness` JSON-LD Structured Data.
- **Stabilität:** Öffentliche Routen lesen strikt; keine versehentlichen Bootstrap-Überschreibungen.

---

## 9. Brands
- **Aktives Sortiment (15 Marken):**
  1. `Sorgenfri` (#10)
  2. `Lykka du Nord` (#20)
  3. `Seasalt` (#30)
  4. `Pretty Vacant` (#40)
  5. `Cissi och Selma` (#50)
  6. `Danefae` (#60)
  7. `LaLamour` (#70)
  8. `Nomads` (#80)
  9. `Circus` (#90)
  10. `Angels` (#100)
  11. `Stehmann` (#110)
  12. `Emily van den Bergh` (#120) — *Offizieller Name und Slug `emily-van-den-bergh` in Phase 8 migriert.*
  13. `Madness` (#130)
  14. `Heidekönigin` (#140)
  15. `King Louie` (#150)
- **Inaktive Legacy-Marken (3 Marken):** `Adini`, `Zilch`, `Happy Rainy Days` (sauber deaktiviert).
- **Redaktionelle Daten:** 15/15 Marken besitzen geprüfte Summaries, Hauptbeschreibungen, Verified Claims und SEO-Metadaten.

---

## 10. Outfits
- **Kanonischer Bestand:** 4 aktive Outfits (`Musterkleid Sommer`, `Blauer Winter Look`, `Outfit 1: Autumn Layer`, `Outfit 2: Blue Summer`).
- **Featured:** Genau 3 Outfits für die Startseite markiert.
- **Inaktive Marken-Filterung:** Legacy-Verknüpfungen (z.B. Zilch) werden auf öffentlichen Seiten ausgeblendet, ohne die historische DB-Relation zu zerstören.

---

## 11. Collections
- **Bestand:** 3 Kollektionen (`Frühjahr / Sommer`, `Herbst / Winter`, `Frühlingserwachen in Hietzing`).
- **Zuordnungen:** Alle 4 aktiven Outfits sind konsistent zugeordnet.

---

## 12. Taxonomy
- **Gruppen (3):** `Saison`, `Stil`, `Farbwelt`.
- **Kategorien (11):** Im Admin voll editierbar; auf der öffentlichen Website werden nur Kategorien mit aktiven Outfit-Zuweisungen gerendert (OR innerhalb einer Gruppe, AND über Gruppen hinweg).

---

## 13. SEO / Redirects
- **301 Permanente Weiterleitungen (22):**
  - Alle historischen GSC/GA4-Pfade abgedeckt.
  - `/marken/emily-van-den-berg` $\rightarrow$ `/marken/emily-van-den-bergh` (1 Hop)
  - `/marken/emily-van-den-bergh-wien` $\rightarrow$ `/marken/emily-van-den-bergh` (1 Hop, keine Kette)
- **410 Gone (8 Routen):** Dauerhaft entfernte Alt-Inhalte (`/marken/zilch-wien`, `/marken/adini-wien`, `/schrankcheck-alt/schrankcheck`, etc.) antworten mit HTTP 410.
- **Sitemap & Robots:** Dynamisches `sitemap.xml` und `robots.txt` schließen geschützte Admin- und API-Pfade aus und referenzieren die kanonische `SITE_URL`.

---

## 14. Revalidation
- **Admin Server Actions:** Gezieltes `revalidatePath()` für `/`, `/marken`, `/marken/[slug]`, `/outfits`, `/admin/*` nach jeder Mutation.

---

## 15. Environment Configuration
- **Präsenz der Variablen (Namen):**
  - `DATABASE_URL`: Konfiguriert (Neon PostgreSQL Pooled Connection).
  - `SITE_URL`: Konfiguriert (`https://checkpot-hietzing.at`).
  - `AUTH_SECRET`: Konfiguriert (32+ Zeichen HS256 Secret).
  - `ADMIN_PASSWORD`: Konfiguriert (Sicheres Admin-Passwort).
  - `BLOB_READ_WRITE_TOKEN`: Konfiguriert (Vercel Blob Storage).
  - `RESEND_API_KEY`: Vorbereitet (Transaktions-E-Mails).
  - `RATE_LIMIT_SECRET`: Konfiguriert (Dediziertes HMAC-Secret).

---

## 16. Vercel & Production Runtime
- **Next.js Version:** 16.3.0 mit Turbopack & React 19.
- **Build-Ergebnis:** 35 Routen (statisch SSG + dynamisch SSR) kompilieren in ca. 2.0s fehlerfrei.
- **Header-Sicherheit:** `poweredByHeader: false` in `next.config.ts`.

---

## 17. Runtime Logs & Privacy
- **Logging-Audit:** Keine Passwörter, Klartext-IPs, E-Mail-Inhalte, Connection-Strings oder JWT-Tokens in Logs.

---

## 18. Backup / Recovery
- **Neon PostgreSQL:** Automatische Point-in-Time Recovery (PITR) und tägliche Snapshots auf Serverless-Ebene verfügbar.

---

## 19. Security
- **Fail-Closed:** Alle Secrets und Authentifizierungsgrenzen schließen bei Fehlen oder Fehlern sofort ab.
- **Client-Bundle:** Null Server-Secrets oder Datenbank-Module im Client-JS-Bundle.

---

## 20. Bekannte nicht-technische offene Punkte (Non-Backend Items)
1. **Marken-Assets:** 15 transparente PNG-Logos und 10 Lookbook-Titelbilder stehen im Fachhändler-Backlog (`docs/BRAND-ASSETS-HUMAN-REVIEW.md`).
2. **Rechtstexte:** Finale Prüfung der Texte auf `/impressum` und `/datenschutz` durch die Inhaberin (`docs/LEGAL-INPUTS-NEEDED.md`).
3. **Phase 2.5 E-Mail-Live-Test:** Verifizierung des realen E-Mail-Eingangs nach Bereitstellung des Resend API Keys.
4. **Domain-DNS-Umschaltung:** Aufschaltung der Produktiv-Domain `checkpot-hietzing.at` (bleibt bis zum finalen Go-Live beim Althoster).

---

## 21. Final Decision

# **BACKEND READY TO FREEZE**

Das gesamte Backend, die Datenbankarchitektur, die Sicherheitsmechanismen, das Admin-CMS und die öffentlichen Datenpipelines sind technisch fehlerfrei, verifiziert und abnahmebereit für den Freeze.
