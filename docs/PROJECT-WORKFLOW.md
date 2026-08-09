# Vollständiger Projekt-Workflow

Diese Datei ist die gemeinsame Arbeitsanleitung für den Projektinhaber, Coding Agents, Antigravity und Open Design. Sie erklärt den vollständigen Ablauf eines Kundenprojekts, die Freigabepunkte und die Verbindung zwischen den Projektdateien.

Die verbindliche Reihenfolge lautet:

```text
Kundenerfassung
  -> freigegebene Projektspezifikation
  -> freigegebenes Design-, Motion- und SEO-System
  -> vorbereiteter Open-Design-Prompt
  -> vollständiges öffentliches Frontend
  -> Frontend Freeze
  -> Backend-Integration
  -> Security Audit
  -> Release-Verifikation
```

Keine Phase darf übersprungen werden. Eine spätere Phase darf Entscheidungen einer freigegebenen früheren Phase nicht stillschweigend verändern.

## 1. Schnellstart für ein neues Kundenprojekt

1. Die vollständige Vorlage in einen neuen Kundenordner kopieren.
2. Den neuen Ordner als eigenes Projekt in Codex und Antigravity öffnen.
3. Prüfen, dass mindestens `AGENTS.md`, `OPEN_DESIGN.md`, `docs/`, `.agents/`, `src/` und `package.json` vorhanden sind.
4. `.env.example` als Grundlage für `.env.local` verwenden. Für jedes Projekt eigene Secrets setzen und niemals Secret-Werte in Markdown-Dateien oder Agent-Prompts schreiben.
5. In Antigravity `/start-customer-project` ausführen.
6. Kundenerfassung mit `/discover-client` abschließen.
7. Erst nach Freigabe von Spezifikation, Design, Motion und SEO Open Design starten.

Ein geeigneter erster Prompt für einen Coding Agent lautet:

```text
Das ist ein neues Kundenprojekt auf Basis der universellen Website-Vorlage.

Lies zuerst AGENTS.md und docs/PROJECT-WORKFLOW.md. Prüfe anschließend den
aktuellen Projektstatus, ohne bestehende Kundeninformationen zu überschreiben.
Starte mit der Kundenerfassung, stelle fehlende Fragen gebündelt und aktualisiere
nur die dafür vorgesehenen Vertragsdateien. Implementiere noch kein Frontend
und kein Backend. Nenne mir danach den erreichten Status und die exakt nächste
Aktion.
```

## 2. Informationen, die zu Beginn benötigt werden

Unvollständige Angaben sind erlaubt. Der Agent soll fehlende Informationen gesammelt erfragen und darf keine Kundenfakten erfinden.

### Unternehmen und Ziele

- Unternehmensname, Branche, Standort und Einzugsgebiet
- Leistungen, Produkte und Alleinstellungsmerkmale
- Hauptziel der Website und gewünschte Besucheraktionen
- Zielgruppen, Bedürfnisse und wichtigste Einwände
- bestehende Website und bekannte Probleme

### Seiten und Inhalte

- gewünschte öffentliche Seiten und Detailseiten
- Navigation und wichtigste Conversion-Wege
- vorhandene Texte, Bilder, Videos, Logos und Markenunterlagen
- Referenzen, Bewertungen, Teamdaten, Zertifikate und Downloads
- noch fehlende Inhalte mit verantwortlicher Person
- Impressum, Datenschutz und andere rechtliche Inhalte

### Funktionen und Betrieb

- Formulare, Buchungen, Newsletter, Suche oder Downloads
- Admin-, CMS- oder Redaktionsanforderungen
- E-Mail-, Storage-, Payment-, Analytics- und andere Integrationen
- Sprachen, Rollen, Zugriffsrechte und besondere Datenschutzanforderungen
- Hosting, Domain, Zeitplan und Abnahmeverantwortliche

### Design, Motion und SEO

- gewünschte Markenwirkung, Farben, Typografie und Bildsprache
- positive und negative Referenzseiten
- gewünschte Scroll-Erlebnisse, Animationen und ausdrücklich unerwünschte Effekte
- Verhalten von Animationen auf Mobilgeräten und bei Reduced Motion
- Hauptthemen, Suchintentionen, Regionen und wichtige Suchbegriffe pro Seite
- bestehende URLs, notwendige Weiterleitungen, Rankings und Backlinks

Zur manuellen Vorbereitung kann `docs/CLIENT-BRIEF.md` ausgefüllt werden. Bestätigte Informationen werden anschließend in `docs/PROJECT-SPEC.md` übertragen.

## 3. Startprotokoll für jeden Coding Agent

Wenn ein Agent ein bestehendes Projekt übernimmt oder nach einer Pause fortsetzt, muss er zuerst:

1. `AGENTS.md` und diese Datei lesen.
2. `git status` prüfen und fremde oder unzusammenhängende Änderungen bewahren.
3. Die Statuszeilen in `docs/PROJECT-SPEC.md`, `docs/DESIGN-SYSTEM.md`, `docs/SEO-SPEC.md` und `docs/FRONTEND-HANDOFF.md` prüfen.
4. Die aktuelle Phase aus diesen Statuswerten und dem vorhandenen Code ableiten.
5. Nur die für diese Phase vorgesehenen Dateien und Workflows laden.
6. Keine früheren Phasen blind wiederholen und keine bereits freigegebenen Entscheidungen ohne Zustimmung ändern.
7. Niemals Werte aus `.env.local` ausgeben oder in Dokumente übernehmen.
8. Vor Änderungen kurz nennen, welche Phase bearbeitet wird und welches Ergebnis erwartet wird.

### Phasenerkennung

| Zustand | Nächster Schritt |
| --- | --- |
| `PROJECT-SPEC.md` ist unvollständig oder `DRAFT` | `/discover-client` |
| Projektstatus ist `APPROVED_FOR_DESIGN`, Designstatus ist `NOT_GENERATED` | `/generate-design-system` |
| Design ist `APPROVED_FOR_FRONTEND`, SEO oder Motion ist unvollständig | offene Entscheidungen vervollständigen, dann `/prepare-open-design` |
| Vorbereitung meldet `READY_FOR_OPEN_DESIGN` | zurückgegebenen Prompt in Open Design ausführen |
| Frontend existiert, Handoff ist noch nicht eingefroren | prüfen und `/freeze-frontend` ausführen |
| Handoffstatus ist `FROZEN_FOR_BACKEND` | Infrastruktur bereitstellen und `/connect-backend` |
| Backend ist vollständig verbunden | `/security-audit` |
| Security Audit ist bestanden | `/release-check` |

Bei widersprüchlichen Statuswerten gilt die Quellenpriorität aus `AGENTS.md`. Der Agent muss den Widerspruch melden und darf ihn nicht durch Annahmen verdecken.

## 4. Phase 1 – Kundenerfassung und Projektspezifikation

Workflow:

```text
/discover-client
```

Der Workflow sammelt und ordnet Kundeninformationen. Die verbindlichen Ergebnisse werden ausschließlich in `docs/PROJECT-SPEC.md` geschrieben.

Vor der Freigabe müssen mindestens geklärt sein:

- Projektziel und Zielgruppen
- erforderliche Routen
- Funktionen und Content-Modelle
- vorhandene und fehlende Inhalte
- grobe Design- und Motion-Richtung
- SEO-, Sprach-, Analytics- und Rechtsanforderungen
- kundenspezifische externe Dienste
- explizit ausgeschlossene Anforderungen

Ergebnis: `docs/PROJECT-SPEC.md` erhält erst nach ausdrücklicher Zustimmung den Status `APPROVED_FOR_DESIGN`.

In dieser Phase nicht erlaubt:

- öffentliches Kundenfrontend bauen
- Datenbankschema für unbestätigte Funktionen erweitern
- Neon oder andere Produktionsdienste provisionieren
- erfundene Texte als bestätigte Kundeninhalte markieren

## 5. Phase 2 – Design-System und Motion-Plan

Workflow:

```text
/generate-design-system
```

Die lokale UI/UX-Pro-Max-Skill verarbeitet die freigegebene Spezifikation und erzeugt die Designrichtung in `docs/DESIGN-SYSTEM.md`.

Die Datei definiert:

- Farben, Typografie, Abstände, Radien, Schatten und Bildbehandlung
- Navigations-, Button-, Karten-, Formular- und Feedbackmuster
- Responsive Verhalten
- Motion-Charakter, Dauer, Easing und Interaktionsfeedback
- eine konkrete Motion-Entscheidung für jeden wichtigen Seitenabschnitt
- Mobile- und `prefers-reduced-motion`-Fallbacks
- Performance-Grenzen für Scroll-Animationen

Animationen brauchen einen Zweck. Ein generisches Fade-in für alle Abschnitte ist keine ausreichende Motion-Spezifikation. Essenzielle Inhalte müssen auch ohne JavaScript sichtbar bleiben.

Ergebnis: Nach visueller Zustimmung erhält `docs/DESIGN-SYSTEM.md` den Status `APPROVED_FOR_FRONTEND`.

## 6. Phase 3 – SEO-Spezifikation und Open-Design-Vorbereitung

SEO-Entscheidungen werden pro Route in `docs/SEO-SPEC.md` dokumentiert:

- Suchintention und Hauptthema
- Title und Description
- Canonical URL
- Indexierungsstatus
- Open-Graph-Daten
- strukturierte Daten
- Sitemap- und Robots-Verhalten
- bestehende URLs und Weiterleitungen

Danach ausführen:

```text
/prepare-open-design
```

Der Workflow vergleicht Routen, SEO-Matrix, Motion-Matrix und Assets. Fehlende Angaben werden gebündelt erfragt. Erst wenn alles vollständig ist, wird SEO auf `APPROVED_FOR_FRONTEND` gesetzt und der Workflow meldet `READY_FOR_OPEN_DESIGN`.

Das Ergebnis ist ein kurzer Launcher-Prompt aus `docs/OPEN-DESIGN-PROMPTS.md`. Kundeninformationen werden nicht in einen riesigen Einmal-Prompt dupliziert; Open Design liest die freigegebenen Dateien als Quellen der Wahrheit.

## 7. Phase 4 – Frontend mit Open Design

Der von `/prepare-open-design` zurückgegebene Prompt wird unverändert in Open Design ausgeführt. Die genaue Dateistruktur und die geschützten Bereiche stehen in `OPEN_DESIGN.md`.

Open Design erstellt das öffentliche Frontend hauptsächlich unter:

```text
src/app/(public)/
src/components/public/
src/components/ui/
src/content/fixtures/
src/lib/contracts/
public/customer/
```

Zusätzlich werden die freigegebenen SEO-Artefakte wie `sitemap.ts`, `robots.ts`, Metadata, Canonicals, Open-Graph-Bilder und strukturierte Daten umgesetzt.

Open Design muss erhalten:

- `src/db/` und `drizzle/`
- `src/lib/auth/`
- `src/lib/repositories/`
- `src/proxy.ts`
- `/login`, `/admin` und `/api/auth`

Das Frontend verwendet zu diesem Zeitpunkt typisierte Props und Fixtures. Es verbindet keine Produktionsdatenbank und keine externen Produktionsdienste.

Für Korrekturen wird der Abschnitt „Approved revision“ aus `docs/OPEN-DESIGN-PROMPTS.md` verwendet. Änderungen müssen innerhalb der freigegebenen Spezifikation bleiben oder zuerst in den zuständigen Vertragsdateien genehmigt werden.

## 8. Phase 5 – Frontend Freeze und Handoff

Workflow:

```text
/freeze-frontend
```

Geprüft werden alle Routen, Komponenten, UI-Zustände, Breakpoints, Tastaturbedienung, Fokus, Kontrast, Metadaten und freigegebenen Animationen. Scroll-Verhalten wird auch auf kleinen Viewports, Touch-Geräten, bei schneller Richtungsänderung und mit Reduced Motion geprüft.

Zusätzlich müssen TypeScript, ESLint und der Produktions-Build bestehen. Relevante Browserprüfungen müssen auf Mobile und Desktop erfolgen.

Der Agent dokumentiert in `docs/FRONTEND-HANDOFF.md`:

- implementierte Routen und wiederverwendbare Komponenten
- Props, Fixture-Typen und spätere Datenquellen
- Formulare, Mutationen und Validierung
- Auth-, Admin-, Medien- und externe Service-Abhängigkeiten
- SEO- und Motion-Implementierung
- Lade-, Leer-, Fehler-, Erfolgs- und Disabled-Zustände

Nur nach visueller Abnahme und bestandener Prüfung erhält die Datei den Status `FROZEN_FOR_BACKEND`.

## 9. Phase 6 – Backend und Produktionsdaten

Vor Beginn:

- kundenspezifisches Neon-Projekt erstellen
- korrekte `DATABASE_URL` und `SITE_URL` setzen
- einzigartige Auth-Secrets konfigurieren
- Zielumgebung vor jeder Migration verifizieren
- benötigte externe Provider aus der freigegebenen Spezifikation auswählen

Workflow:

```text
/connect-backend
```

Der verbindliche Datenfluss lautet:

```text
Neon PostgreSQL
  -> Drizzle-Schema und geprüfte SQL-Migrationen
  -> server-only Repository-Schicht
  -> Server Components, Server Actions oder Route Handlers
  -> typisierte serialisierbare Props
  -> eingefrorene Präsentationskomponenten
```

Regeln:

- Produktionszugriffe erfolgen nur über `src/lib/repositories/`.
- Präsentationskomponenten importieren weder Drizzle noch Auth-Interna oder Provider-SDKs.
- Jede nicht vertrauenswürdige Eingabe wird validiert.
- Jede privilegierte Operation autorisiert serverseitig neu.
- Fixtures dürfen niemals stiller Produktions-Fallback sein.
- Das freigegebene Design wird nicht für bequemere Backend-Anbindung umgebaut.
- Dynamische Metadata darf über die Repository-Schicht mit Produktionsdaten versorgt werden.

Migrationen erst nach Prüfung des Zielsystems ausführen. Schemaänderungen und SQL-Migrationen gehören gemeinsam in die Änderung.

## 10. Phase 7 – Security Audit

Workflow:

```text
/security-audit
```

Der Audit prüft unter anderem:

- Authentifizierung, Autorisierung und geschützte Servergrenzen
- Session-, Cookie- und Secret-Handhabung
- Eingabevalidierung und sichere Fehlerantworten
- Datenbank- und Repository-Grenzen
- Uploads und externe Provider
- Rate Limiting und Missbrauchsschutz
- Security Header und Dependency-Risiken
- Datenschutzrelevante Datenflüsse

`noindex`, `robots.txt`, versteckte Navigation und `proxy.ts` allein sind keine Autorisierung. Geschützte Operationen müssen unabhängig serverseitig prüfen.

Kritische oder hohe Befunde blockieren die Veröffentlichung. Behebungen werden anschließend erneut geprüft.

## 11. Phase 8 – Release-Verifikation

Workflow:

```text
/release-check
```

Der Release Check prüft die vollständige Geschichte vom Browser über API und Repository bis zur Datenbank. Dazu gehören:

- alle vereinbarten öffentlichen und geschützten Abläufe
- Responsive Design, Accessibility und Motion-Fallbacks
- SEO-Matrix, Sitemap, Robots, Canonicals, Social Preview und strukturierte Daten
- Fehler-, Lade-, Leer- und Erfolgszustände
- Production Build, Typen, Lint und relevante Tests
- notwendige Umgebungsvariablen ohne Ausgabe ihrer Werte
- Migrationen, Redirects und externe Integrationen
- Monitoring, Backups, Analytics, Consent und rechtliche Inhalte, sofern erforderlich

Eine Veröffentlichung ist nur freigegeben, wenn alle Blocker behoben oder vom verantwortlichen Menschen ausdrücklich als akzeptiertes Restrisiko dokumentiert wurden.

## 12. Verbindung der wichtigsten Dateien

| Datei | Enthält | Wird hauptsächlich verwendet von |
| --- | --- | --- |
| `AGENTS.md` | globale Regeln, Quellenpriorität und technische Grenzen | jedem Coding Agent |
| `docs/PROJECT-WORKFLOW.md` | vollständiger Ablauf und Phasenerkennung | Projektinhaber und alle Agents |
| `docs/CLIENT-BRIEF.md` | rohe Kundeneingaben | Discovery |
| `docs/PROJECT-SPEC.md` | freigegebene Kundenfakten, Seiten und Funktionen | Design, Open Design, Backend und Tests |
| `docs/DESIGN-SYSTEM.md` | visuelle Regeln und Motion-Matrix | Open Design und Frontend-Prüfung |
| `docs/SEO-SPEC.md` | SEO-Vertrag pro Route | Open Design, Backend-Metadata und Release Check |
| `docs/OPEN-DESIGN-PROMPTS.md` | Start-, Revisions- und Abschluss-Prompts | Open Design |
| `OPEN_DESIGN.md` | erlaubte Ausgabeorte und geschützte Foundation | Open Design und Frontend Freeze |
| `docs/FRONTEND-HANDOFF.md` | eingefrorener UI- und Datenvertrag | Backend-Integration |
| `.agents/rules/` | automatisch angewandte Fachregeln | Antigravity und kompatible Agents |
| `.agents/workflows/` | ausführbare Phasenabläufe | Antigravity |

## 13. Zuständigkeiten

### Projektinhaber oder Kunde

- liefert Fakten, Inhalte, Zugänge und Freigaben
- entscheidet bei Design-, Motion-, SEO- und Scope-Fragen
- genehmigt Migrationen und produktive externe Änderungen
- nimmt Frontend und Release ab

### Coding Agent

- liest den aktuellen Stand und erkennt die Phase
- strukturiert Informationen und meldet Widersprüche
- ändert nur Dateien innerhalb der aktuellen Phase
- implementiert und prüft technische Arbeit nach den Verträgen
- dokumentiert Beweise, offene Punkte und nächste Aktion

### Antigravity

- führt die definierten Slash-Workflows aus
- aktiviert passende Rules und Skills
- hält Phasen, Freigaben und Dateigrenzen ein

### Open Design

- baut ausschließlich das freigegebene öffentliche Frontend
- folgt Projekt-, Design-, Motion- und SEO-Verträgen
- erhält Auth-, Admin-, Datenbank- und Repository-Foundation
- verbindet keine Produktionsdienste

## 14. Pausieren, Fortsetzen und Änderungen nach Freigabe

Beim Fortsetzen genügt dieser Prompt:

```text
Lies AGENTS.md und docs/PROJECT-WORKFLOW.md. Ermittle den aktuellen Projektstand
aus den Statusfeldern, dem Code und git status. Führe keine abgeschlossene Phase
erneut aus. Nenne mir zuerst aktuelle Phase, offene Blocker und exakt nächste
Aktion und arbeite dann innerhalb dieser Phase weiter.
```

Ändert der Kunde nach einer Freigabe den Umfang:

1. Änderung zuerst in `docs/PROJECT-SPEC.md` festhalten und bestätigen.
2. Betroffene Design-, Motion- oder SEO-Verträge aktualisieren.
3. Auswirkungen auf Frontend-Handoff, Datenmodell, Kosten und Termin bestimmen.
4. Nur betroffene Phasen erneut prüfen.
5. Frontend Freeze, Security Audit oder Release Check erneut durchführen, wenn deren Vertrag betroffen ist.

## 15. Definition of Done

Ein Kundenprojekt ist erst abgeschlossen, wenn:

- Spezifikation, Design, Motion und SEO ausdrücklich freigegeben sind
- alle vereinbarten Seiten und Zustände umgesetzt sind
- das Frontend eingefroren und der Handoff vollständig ist
- Produktionsdaten nur über validierte und autorisierte Servergrenzen fließen
- Migrationen geprüft und auf der richtigen Datenbank ausgeführt wurden
- Security Audit keine offenen Release-Blocker enthält
- Typecheck, Lint, Build und relevante Tests bestehen
- Browser-, Responsive-, Accessibility-, SEO- und Motion-Prüfungen bestanden sind
- Produktionskonfiguration, Monitoring, Backups und rechtliche Anforderungen geklärt sind
- die abschließende menschliche Abnahme dokumentiert ist

## Kurzreferenz

```text
/start-customer-project
/discover-client
/generate-design-system
/prepare-open-design
[Open Design mit zurückgegebenem Prompt]
/freeze-frontend
/connect-backend
/security-audit
/release-check
```
