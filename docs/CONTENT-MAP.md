# Checkpot Content Map

> Stand: 2026-08-30 (Phase 7A.1)  
> Status: **Struktur-, Taxonomie- und Beziehungs-Bereinigung abgeschlossen**

Dieses Dokument bildet die bereinigte inhaltliche Struktur, Taxonomie-Hierarchie, Outfit-Zuordnungen und den Asset-Status für den Webauftritt ab.

---

## 1. Outfit-Taxonomie

Die Taxonomie ist in drei Gruppen gegliedert. Filter innerhalb derselben Gruppe werden als **ODER**, Filter über verschiedene Gruppen hinweg als **UND** ausgewertet. Kategorien ohne aktive Outfits (`Ganzjährig`, `Retro`, `Pastell`) bleiben in der Datenbank für die Admin-Verwaltung erhalten, werden im öffentlichen Lookbook jedoch erst sichtbar, sobald mindestens ein aktives Outfit zugeordnet ist.

| Gruppe (Slug) | Sort | Kategorie (Slug) | Sort | Öffentliche Sichtbarkeit | Zugeordnete aktive Outfits |
|---|---|---|---|---|---|
| **Saison** (`saison`) | 10 | **Frühling/Sommer** (`fruehling-sommer`) | 10 | Aktiv | 2 (`Musterkleid Sommer`, `Outfit 2: Blue Summer`) |
| | | **Herbst/Winter** (`herbst-winter`) | 20 | Aktiv | 2 (`Blauer Winter Look`, `Outfit 1: Autumn Layer`) |
| | | **Ganzjährig** (`ganzjaehrig`) | 30 | *Ausgeblendet (0 aktive Looks)* | 0 |
| **Stil** (`stil`) | 20 | **Lässig** (`laessig`) | 10 | Aktiv | 2 (`Outfit 1: Autumn Layer`, `Outfit 2: Blue Summer`) |
| | | **Klassisch** (`klassisch`) | 20 | Aktiv | 1 (`Blauer Winter Look`) |
| | | **Feminin** (`feminin`) | 30 | Aktiv | 1 (`Musterkleid Sommer`) |
| | | **Retro** (`retro`) | 40 | *Ausgeblendet (0 aktive Looks)* | 0 |
| **Farbwelt** (`farbwelt`) | 30 | **Kräftige Farben** (`kraeftige-farben`) | 10 | Aktiv | 2 (`Blauer Winter Look`, `Outfit 2: Blue Summer`) |
| | | **Naturtöne** (`naturtoene`) | 20 | Aktiv | 1 (`Outfit 1: Autumn Layer`) |
| | | **Muster** (`muster`) | 30 | Aktiv | 1 (`Musterkleid Sommer`) |
| | | **Pastell** (`pastell`) | 40 | *Ausgeblendet (0 aktive Looks)* | 0 |

---

## 2. Reale Outfits (4 aktive kanonische Looks)

| ID / Titel | Bild-Quelle | Kollektion | Marken-Zuordnung | Taxonomie-Kategorien | Startseite (Featured) | Status & Historie |
|---|---|---|---|---|---|---|
| **Musterkleid Sommer** | Vercel Blob (`outfit-summer-pattern.jpg`) | Frühjahr / Sommer | `Zilch` *(DB-Relation erhalten; öffentlich gefiltert)* | Frühling/Sommer, Feminin, Muster | **Ja** (Top 1) | **Aktiv (Kanonisch)**. Reale Marke bei nächstem Lookbook-Shooting zuweisen. |
| **Blauer Winter Look** | Vercel Blob (`outfit-blue-winter.jpg`) | Herbst / Winter | `Sorgenfri` *(Aktiv)* | Herbst/Winter, Klassisch, Kräftige Farben | **Ja** (Top 2) | **Aktiv (Kanonisch)**. Sorgenfri Winter-Look. |
| **Outfit 1: Autumn Layer** | `/customer/outfit-autumn-layer.jpg` | Herbst / Winter | *(Keine)* | Herbst/Winter, Lässig, Naturtöne | **Ja** (Top 3) | **Aktiv (Kanonisch)**. Kollektion auf Herbst/Winter korrigiert. |
| **Outfit 2: Blue Summer** | `/customer/outfit-blue-summer.jpg` | Frühlingserwachen in Hietzing | *(Keine)* | Frühling/Sommer, Lässig, Kräftige Farben | **Nein** | **Aktiv (Kanonisch)**. Sommer-Lookbook. |
| *Outfit 3: Blue Winter* | `/customer/outfit-blue-winter.jpg` | Frühlingserwachen in Hietzing | `Sorgenfri` | Herbst/Winter, Klassisch, Kräftige Farben | *Nein* | **Inaktiviert** *(Redundantes Duplikat von „Blauer Winter Look“; Datensatz erhalten)* |
| *Outfit 4: Summer Pattern* | `/customer/outfit-summer-pattern.jpg` | Frühlingserwachen in Hietzing | `Zilch` | Frühling/Sommer, Feminin, Muster | *Nein* | **Inaktiviert** *(Redundantes Duplikat von „Musterkleid Sommer“; Datensatz erhalten)* |

---

## 3. Kollektionen-Struktur

| Kollektion | Saison | Aktiv | Startseite (Featured) | Aktive Outfits | Rolle auf `/mode` |
|---|---|---|---|---|---|
| **Frühjahr / Sommer** | 2026 | Ja | Ja | 1 (`Musterkleid Sommer`) | Frühjahr/Sommer Sortiment |
| **Herbst / Winter** | 2026 | Ja | Nein | 2 (`Blauer Winter Look`, `Outfit 1: Autumn Layer`) | Herbst/Winter Sortiment |
| **Frühlingserwachen in Hietzing** | Frühjahr 2026 | Ja | Ja | 1 (`Outfit 2: Blue Summer`) | Aktuelle Saison-Kollektion |

---

## 4. Marken-Assets & Bildzuordnung (15 aktive Partnermarken)

| Marke | Sort | Logo-Status | Titelbild | Konfidenz | Bildquelle | Empfehlung |
|---|---|---|---|---|---|---|
| **Sorgenfri** | 10 | MISSING | `/customer/store-christa-counter.jpg` | GENERIC | Store-Fotografie | TEMPORÄR BEHALTEN (Echtes Kollektionsbild vor Launch) |
| **Lykka du Nord** | 20 | MISSING | *Kein Bild* | - | - | Bild benötigt |
| **Seasalt** | 30 | MISSING | *Kein Bild* | - | - | Bild benötigt |
| **Pretty Vacant** | 40 | MISSING | *Kein Bild* | - | - | Bild benötigt |
| **Cissi och Selma** | 50 | MISSING | *Kein Bild* | - | - | Bild benötigt |
| **Danefae** | 60 | MISSING | *Kein Bild* | - | - | Bild benötigt |
| **LaLamour** | 70 | MISSING | *Kein Bild* | - | - | Bild benötigt |
| **Nomads** | 80 | MISSING | *Kein Bild* | - | - | Bild benötigt |
| **Circus** | 90 | MISSING | *Kein Bild* | - | - | Bild benötigt |
| **Angels** | 100 | MISSING | `/customer/store-sustainable-shelf.jpg` | GENERIC | Store-Fotografie | TEMPORÄR BEHALTEN |
| **Stehmann** | 110 | MISSING | *Kein Bild* | - | - | Bild benötigt |
| **Emily van den Berg** | 120 | MISSING | `/customer/store-detail-scarves.jpg` | GENERIC | Store-Fotografie | TEMPORÄR BEHALTEN |
| **Madness** | 130 | MISSING | `/customer/store-detail-flowers.jpg` | GENERIC | Store-Fotografie | TEMPORÄR BEHALTEN |
| **Heidekönigin** | 140 | MISSING | *Kein Bild* | - | - | Bild benötigt |
| **King Louie** | 150 | MISSING | `/customer/christa-storefront.jpg` | GENERIC | Store-Fotografie | TEMPORÄR BEHALTEN |

---

## 5. Mediathek & Metadaten-Qualität

- **Gesamtanzahl Bilder:** 16
- **Alt-Texte:** 100% vollständig auf allen fotografischen Medien.
- **Fokus-Punkte:** Standard-Zentrierung greift über Next.js / CSS `center`; gezielte Fokus-Punkte nur dort gesetzt, wo redaktionell erforderlich (z.B. Detailaufnahmen).
- **Rechte-Dokumentation:** 16 / 16 im Backlog zur Klärung durch Kundin.

---

## 6. Entscheidungsbedarf für Redaktion / Inhaberin (Human Review)

1. **Marken-Logos (15):** Freigestellte PNG-Dateien für die 15 aktiven Labels bereitstellen.
2. **Marken-Kollektionsbilder (10 fehlend, 5 generisch):** Bereitstellen herstellereigener Kampagnenfotos.
3. **Reale Marken bei Outfits:** Bestätigen der exakten Labels für "Autumn Layer" und "Blue Summer".
