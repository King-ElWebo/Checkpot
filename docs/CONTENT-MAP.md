# Checkpot Content Map

> Stand: 2026-08-30 (Phase 7A)  
> Status: **Struktur-, Taxonomie- und Asset-Zuordnung abgeschlossen**

Dieses Dokument bildet die reale inhaltliche Struktur, Taxonomie-Hierarchie, Outfit-Zuordnungen und den Asset-Status für den Webauftritt ab.

---

## 1. Outfit-Taxonomie

Die Taxonomie ist in drei Gruppen gegliedert. Filter innerhalb derselben Gruppe werden als **ODER**, Filter über verschiedene Gruppen hinweg als **UND** ausgewertet.

| Gruppe (Slug) | Sort | Kategorie (Slug) | Sort | Zugeordnete Outfits |
|---|---|---|---|---|
| **Saison** (`saison`) | 10 | **Frühling/Sommer** (`fruehling-sommer`) | 10 | 3 (`Musterkleid Sommer`, `Outfit 2: Blue Summer`, `Outfit 4: Summer Pattern`) |
| | | **Herbst/Winter** (`herbst-winter`) | 20 | 3 (`Blauer Winter Look`, `Outfit 1: Autumn Layer`, `Outfit 3: Blue Winter`) |
| | | **Ganzjährig** (`ganzjaehrig`) | 30 | 0 |
| **Stil** (`stil`) | 20 | **Lässig** (`laessig`) | 10 | 2 (`Outfit 1: Autumn Layer`, `Outfit 2: Blue Summer`) |
| | | **Klassisch** (`klassisch`) | 20 | 2 (`Blauer Winter Look`, `Outfit 3: Blue Winter`) |
| | | **Feminin** (`feminin`) | 30 | 2 (`Musterkleid Sommer`, `Outfit 4: Summer Pattern`) |
| | | **Retro** (`retro`) | 40 | 0 |
| **Farbwelt** (`farbwelt`) | 30 | **Kräftige Farben** (`kraeftige-farben`) | 10 | 3 (`Blauer Winter Look`, `Outfit 2: Blue Summer`, `Outfit 3: Blue Winter`) |
| | | **Naturtöne** (`naturtoene`) | 20 | 1 (`Outfit 1: Autumn Layer`) |
| | | **Muster** (`muster`) | 30 | 2 (`Musterkleid Sommer`, `Outfit 4: Summer Pattern`) |
| | | **Pastell** (`pastell`) | 40 | 0 |

---

## 2. Bestehende Outfits (6 Looks)

| ID / Titel | Bild-Quelle | Kollektion | Marken-Zuordnung | Taxonomie-Kategorien | Startseite (Featured) | Status / Redaktioneller Hinweis |
|---|---|---|---|---|---|---|
| **Musterkleid Sommer** | Vercel Blob (`outfit-summer-pattern.jpg`) | Frühjahr / Sommer | `Zilch` *(Legacy-Marke)* | Frühling/Sommer, Feminin, Muster | Ja | Historisches Outfit. Bild identisch mit Outfit 4. |
| **Blauer Winter Look** | Vercel Blob (`outfit-blue-winter.jpg`) | Herbst / Winter | `Sorgenfri` | Herbst/Winter, Klassisch, Kräftige Farben | Ja | Bild identisch mit Outfit 3. |
| **Outfit 1: Autumn Layer** | `/customer/outfit-autumn-layer.jpg` | Frühlingserwachen in Hietzing | *(Keine)* | Herbst/Winter, Lässig, Naturtöne | Ja | Lagenlook. Marken-Zuordnung zur Prüfung. |
| **Outfit 2: Blue Summer** | `/customer/outfit-blue-summer.jpg` | Frühlingserwachen in Hietzing | *(Keine)* | Frühling/Sommer, Lässig, Kräftige Farben | Ja | Sommer-Look. Marken-Zuordnung zur Prüfung. |
| **Outfit 3: Blue Winter** | `/customer/outfit-blue-winter.jpg` | Frühlingserwachen in Hietzing | `Sorgenfri` | Herbst/Winter, Klassisch, Kräftige Farben | Ja | Sorgenfri Winter-Look. |
| **Outfit 4: Summer Pattern** | `/customer/outfit-summer-pattern.jpg` | Frühlingserwachen in Hietzing | `Zilch` *(Legacy-Marke)* | Frühling/Sommer, Feminin, Muster | Ja | Sommerkleid. |

---

## 3. Kollektionen-Struktur

| Kollektion | Saison | Aktiv | Startseite (Featured) | Outfits | Rolle auf `/mode` |
|---|---|---|---|---|---|
| **Frühjahr / Sommer** | 2026 | Ja | Ja | 1 | Bestehende Kollektion |
| **Herbst / Winter** | 2026 | Ja | Nein | 1 | Saison-Archiv |
| **Frühlingserwachen in Hietzing** | Frühjahr 2026 | Ja | Ja | 4 | Aktuelle Haupt-Saison-Kollektion |

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
- **Alt-Texte:** 100% vollständig (0 Lücken bei fotografischen Medien).
- **Fokus-Punkte:** 100% bei allen Outfit- und Marken-Bildern auf `50% 50%` gesetzt.
- **Rechte-Dokumentation:** 16 / 16 ausstehend (keine Annahmen getroffen; Klärung durch Kundin im Backlog).

---

## 6. Entscheidungsbedarf für Redaktion / Inhaberin (Human Review)

1. **Marken-Logos:** 15 freigestellte PNG-Dateien der Labels bereitstellen.
2. **Kollektionsfotos für Marken:** Entscheiden, ob die 5 generischen Geschäftsbilder durch offizielle Lookbook-Bilder der Hersteller ersetzt werden sollen.
3. **Outfit-Bereinigung:** Bestätigen, ob die doppelten Outfits ("Musterkleid Sommer" / "Outfit 4" und "Blauer Winter Look" / "Outfit 3") zusammengeführt werden sollen.
4. **Marken bei Outfits 1 & 2:** Exakte Labels für "Autumn Layer" und "Blue Summer" nachtragen.
