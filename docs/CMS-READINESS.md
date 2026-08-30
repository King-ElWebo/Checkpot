# Checkpot CMS Readiness & Data Integrity Report

> Datum: 2026-08-30  
> Status: **READY FOR CONTENT POPULATION**  
> Verifizierte DB: Neon PostgreSQL  

---

## 1. Executive Status

Das Admin-CMS (`/admin`) und alle angebundenen Datenmodelle sind **vollständig einsatzbereit, getestet und technisch integer**. 

- Alle CRUD-Operationen (Erstellen, Bearbeiten, Löschen, Beziehungen verknüpfen) funktionieren atomar und sicher.
- Das Datenbankschema in Neon PostgreSQL ist sauber migriert (`0000`–`0004`), frei von verwaisten Join-Zeilen oder Fremdschlüssel-Konflikten.
- Die öffentliche Website (`/`, `/mode`, `/outfits`, `/marken`, `/marken/[slug]`, `/kontakt`, `/ueber-uns`) bezieht sämtliche dynamischen Geschäfts-, Sortiments- und SEO-Daten direkt aus der Datenbank.

---

## 2. Modul-Audit & Funktionsstatus

### A. Geschäftsdaten (`/admin/store`)
- **Status:** **READY**
- **Speicherort:** Neon Tabelle `system_settings` (`key = 'store_details'`).
- **Öffentliche Konsumenten:** Startseite, Footer, `/kontakt`, `/ueber-uns`, `/impressum`, `/datenschutz`, `LocalBusiness` JSON-LD Schema.
- **Fallback-Verhalten:** Sofern kein DB-Eintrag vorliegt, greift `DEFAULT_STORE_DETAILS` absolut fehlerfrei, ohne Schreibzugriffe auf die DB auszulösen.

### B. Marken (`/admin/brands`)
- **Status:** **READY**
- **Bestand:** Genau 15 freigegebene aktive Marken mit definierter Sortierung (`10`–`150`) sowie 3 inaktive Legacy-Marken (`Adini`, `Zilch`, `Happy Rainy Days`), die nicht öffentlich erscheinen.
- **Funktionen:** Bearbeitung von Name, Slug, Kurzbeschreibung, ausführlichem Text, verifizierten Stichpunkten (*„Gut zu wissen“*), SEO-Overrides (`title`, `description`, `ogTitle`, `ogDescription`), Logo- und Titelbild-Zuweisung.
- **Revalidierung:** Gezieltes Revalidieren von `/admin/brands`, `/marken`, `/marken/[slug]` und `sitemap.xml`.

### C. Mediathek (`/admin/media`)
- **Status:** **READY**
- **Upload & Sicherheit:** Strikte serverseitige Validierung (5 MB Limit, Magic-Bytes-Prüfung für PNG, JPG, WebP). SVG-Upload ist serverseitig bewusst gesperrt; Client-seitige Kompression erhält PNG-Transparenz ohne Alpha-Verflachung.
- **Metadaten:** Bearbeitung von Alt-Text, Titel, Bildrechten und interaktivem Fokuspunkt (`focalPoint`).
- **Löschschutz:** Bilder, die in Marken oder Outfits verwendet werden, können nicht versehentlich gelöscht werden (`getMediaUsage` Prüfung mit explizitem Force-Flag).

### D. Outfits & Lookbook (`/admin/outfits`)
- **Status:** **READY**
- **Bestand:** 6 Outfits in Neon hinterlegt.
- **Beziehungsverwaltung:** Multi-Marken-Zuweisung (`outfit_brands`), Taxonomie-Zuweisung (`outfit_category_assignments`), Kollektions-Zuweisung und Medien-Verknüpfung erfolgen atomar in `saveOutfitAtomic`.
- **Lösch-Sicherheit:** Beim Löschen eines Outfits werden Join-Tabellen automatisch kaskadierend bereinigt. Das verknüpfte Bild in der Mediathek bleibt unberührt.

### E. Kollektionen (`/admin/collections`)
- **Status:** **READY**
- **Bestand:** 3 Kollektionen aktiv.
- **Integration:** `/mode` wählt dynamisch die aktive und als `featured` markierte Kollektion aus und rendert Intro sowie verknüpfte Outfits.

### F. Outfit-Taxonomie (`/admin/outfit-categories`)
- **Status:** **READY**
- **Struktur:** 2-stufige Hierarchie aus Gruppen (`outfit_category_groups`, z.B. Stil, Farbwelt) und Kategorien (`outfit_categories`).
- **Filter-Logik auf `/outfits`:**
  - **ODER**-Verknüpfung innerhalb derselben Gruppe (z.B. Look A *oder* Look B).
  - **UND**-Verknüpfung über verschiedene Gruppen hinweg.
  - Inaktive Gruppen und Kategorien werden im Lookbook automatisch ausgeblendet.

### G. Authentifizierung & Sicherheit
- **Status:** **READY**
- **Schutz:** Alle Admin-Routen und geschützten Server Actions erfordern gültige `jose` HS256 JWT-Admin-Sessions (`requireAdmin()`).
- **Dauerhafter Missbrauchsschutz:** PostgreSQL-basiertes atomares Rate-Limiting für Login (max. 5 Fehlversuche / 15 Min.) und Kontaktformular (max. 5 Anfragen / 10 Min.) mit irreversibler HMAC-SHA256 Pseudonymisierung.

---

## 3. Revalidierungs-Matrix

| Admin-Aktion | Betroffene Datenbank-Tabelle | Revalidierte öffentliche Pfade | Status |
|---|---|---|---|
| Geschäftsdaten speichern | `system_settings` | `/`, `/kontakt`, `/ueber-uns`, `/impressum`, `/datenschutz`, `/sitemap.xml`, `layout` | Exakt |
| Marke anlegen / speichern | `brands` | `/admin/brands`, `/marken`, `/marken/[slug]`, `/`, `/sitemap.xml` | Exakt |
| Marke löschen | `brands` | `/admin/brands`, `/marken`, `/marken/[slug]`, `/`, `/sitemap.xml` | Exakt |
| Outfit anlegen / speichern | `outfits`, `outfit_brands`, `outfit_category_assignments` | `/admin/outfits`, `/outfits`, `/`, `/mode`, `/marken/[slug]` (zugeordnete Marken) | Exakt |
| Outfit löschen | `outfits` | `/admin/outfits`, `/outfits`, `/`, `/mode`, `/marken/[slug]` | Exakt |
| Kollektion speichern / löschen | `collections` | `/admin/collections`, `/mode`, `/`, `/outfits` | Exakt |
| Taxonomie speichern / löschen | `outfit_category_groups`, `outfit_categories` | `/admin/outfit-categories`, `/outfits` | Exakt |
| Bild-Metadaten aktualisieren | `media` | `/admin/media`, `/admin/brands`, `/admin/outfits`, `/`, `/marken`, `/outfits`, `/mode` | Exakt |
| Bild löschen | `media` | `/admin/media`, `/admin/brands`, `/admin/outfits`, `/`, `/marken`, `/outfits`, `/mode` | Exakt |

---

## 4. Bekannte nicht-blockierende redaktionelle Aufgaben

Folgende Inhalte sind aktuell unvollständig und können nun direkt über das CMS eingepflegt werden (siehe [`docs/CONTENT-BACKLOG.md`](file:///c:/Users/wilkb/Desktop/Projekte/checkpot/website/docs/CONTENT-BACKLOG.md)):
1. **15 Marken-Logos:** Hochladen freigestellter PNG-Dateien.
2. **10 Marken-Titelbilder:** Zuweisen aussagekräftiger Kollektions-/Modelfotos.
3. **Marken-Beschreibungstexte & Stichpunkte:** Einpflegen von Summaries, Beschreibungen und *„Gut zu wissen“*-Merkmalen.
4. **Outfit-Zuordnungen & Taxonomie:** Verknüpfung der Lookbook-Fotos mit Marken und Filterkategorien.
5. **Rechtliche Fakten:** Ergänzung fehlender Impressums-Pflichtangaben laut [`docs/LEGAL-INPUTS-NEEDED.md`](file:///c:/Users/wilkb/Desktop/Projekte/checkpot/website/docs/LEGAL-INPUTS-NEEDED.md).

---

## 5. Bewusst zurückgestellte Infrastruktur- & Release-Aufgaben

1. **Vercel Produktions-Umgebungsvariablen:** Hinterlegung von `DATABASE_URL`, `SITE_URL`, `AUTH_SECRET`, `ADMIN_PASSWORD` und `BLOB_READ_WRITE_TOKEN` im Vercel-Dashboard (wird in einem separaten Schritt nach Abschluss der Inhaltspflege durchgeführt).
2. **Phase 2.5 (Resend E-Mail-Live-Test):** Bereitstellung des Resend API-Keys und Verifikation der Absender-Domain.
3. **Finale rechtliche Freigabe:** Prüfung durch Inhaberin / rechtliche Vertretung.
4. **Design-Feinschliff:** Bleibt eingefroren; keine weiteren visuellen Änderungen vor Content-Finalisierung.
