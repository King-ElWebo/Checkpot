# SEO Specification

Status: `APPROVED_FOR_FRONTEND`

This file is the customer-specific SEO contract for Open Design, backend integration, and release verification. Set the status to `APPROVED_FOR_FRONTEND` only after every required public route has an approved search intent and metadata plan.

## Inputs

- Project specification: Checkpot Hietzing - `APPROVED_FOR_DESIGN`
- Approved domain: `https://checkpot-hietzing.at`
- Primary market and locations: Wien (besonders Hietzing) und Umgebung
- Languages and default locale: Deutsch / Österreich (`de-AT`)
- Existing website and migration source: `https://checkpot-hietzing.at`
- Keyword or search-intent research: Checkpot Hietzing, Boutique Hietzing, nachhaltige Mode Wien, Damenmode Hietzing
- Legal and compliance constraints: Impressum, Datenschutz (inkl. Consent-Management) erforderlich.

## Global settings

- Production origin (`SITE_URL`): `https://checkpot-hietzing.at`
- Site/organization name: Checkpot Hietzing
- Default title template: `%s | Checkpot Hietzing`
- Default description: Hochwertige feminine Damenmode und persönliche Stilberatung in Wien Hietzing. Nachhaltige Kollektionen und ausgewählte Marken.
- Default social image and alt text: `/customer/og-image.jpg` (Checkpot Hietzing Store Außenansicht)
- Twitter/X card: `summary_large_image`
- Indexing default: `index, follow`
- Canonical policy: Absolute URL basierend auf `SITE_URL`, ohne Parameter.
- Trailing-slash policy: Remove trailing slashes (Next.js default).
- Search-console owner: Christa Hausmair / Codex

### SEO status semantics

- `Approved` may be used only for a row that is factually reviewed, content-final and ready for its
  stated implementation phase.
- Any row still requiring substantive content, routing or evidence decisions is not final and must
  not be represented as approved.
- The complete legacy redirect inventory is a migration prerequisite. Open Design implements only
  the explicit approved mappings below and must not invent additional redirects.

## Route SEO matrix

| Route | Search intent | Primary topic | Title | Description | Canonical | OG image | Structured data | Index/follow |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `/` | Store finden / informieren | Boutique Hietzing, Checkpot Damenmoden | Damenmode & Stilberatung in Wien | Entdecken Sie hochwertige, feminine Damenmode bei Checkpot Hietzing. Persönliche Beratung und nachhaltige Marken in Wien. | `/` | Default | `LocalBusiness` | `index, follow` |
| `/ueber-uns` | Team / Vertrauen | Christa Hausmair, Boutique Geschichte | Über Checkpot & Christa | Seit 2009 Ihre Anlaufstelle für persönliche Modeberatung in Hietzing. Lernen Sie Christa Hausmair kennen. | `/ueber-uns` | Default | `BreadcrumbList` | `index, follow` |
| `/mode` | Aktuelle Kollektionen ansehen | Damenmode Kollektionen, neue Trends | Aktuelle Mode & Kollektionen | Die neuesten Trends und handverlesene Stücke für diese Saison. | `/mode` | Default | `BreadcrumbList` | `index, follow` |
| `/outfits` | Inspiration / Styling | Outfit-Inspirationen, Kombinationen | Outfit Inspirationen | Entdecken Sie komplette Looks und wie neue Stücke perfekt kombiniert werden. | `/outfits` | Default | `BreadcrumbList` | `index, follow` |
| `/marken` | Markenübersicht | Marken Hietzing (King Louie, Zilch, etc.) | Unsere Marken | Ausgewählte, faire und nachhaltige Modemarken bei Checkpot Hietzing. | `/marken` | Default | `BreadcrumbList` | `index, follow` |
| `/marken/[slug]` | Spezifische Marken in Wien suchen | [Markenname] Wien Hietzing | [Markenname] Kollektion | Aktuelle Kollektion von [Markenname] bei Checkpot in Wien Hietzing entdecken. | `/marken/[slug]` | Default | `BreadcrumbList` | `index, follow` |
| `/fair-trade` | Nachhaltigkeit / Faire Produktion | Nachhaltige Mode Wien, Fair Trade | Fair Trade & Nachhaltigkeit | Unsere Prinzipien für faire, nachhaltige und ökologische Damenmode. | `/fair-trade` | Default | `BreadcrumbList` | `index, follow` |
| `/kontakt` | Kontakt aufnehmen / Anfahrt | Adresse Checkpot, Öffnungszeiten, Telefon | Kontakt & Öffnungszeiten | Besuchen Sie uns auf der Hietzinger Hauptstraße 10-16. Hier finden Sie alle Kontaktdaten und Öffnungszeiten. | `/kontakt` | Default | `LocalBusiness`, `BreadcrumbList` | `index, follow` |
| `/impressum` | Rechtliche Informationen | Impressum | Impressum | Rechtliche Angaben zum Unternehmen Checkpot. | `/impressum` | None | `BreadcrumbList` | `noindex, follow` |
| `/datenschutz` | Rechtliche Informationen | Datenschutz | Datenschutz | Datenschutzerklärung von Checkpot Hietzing. | `/datenschutz` | None | `BreadcrumbList` | `noindex, follow` |

## Content and internal linking

| Route | H1 | Required supporting topics | Primary internal links | Content owner | Status |
| --- | --- | --- | --- | --- | --- |
| `/` | Willkommen bei Checkpot Hietzing | Nachhaltigkeit, Beratung, Marken | `/marken`, `/outfits`, `/ueber-uns`, `/kontakt` | Customer | Approved |
| `/ueber-uns` | Über Checkpot & Christa | Geschichte seit 2009, persönliche Beratung, Geschäft | `/`, `/mode`, `/kontakt` | Customer | Approved |
| `/mode` | Aktuelle Mode & Kollektionen | Saison, ausgewählte Stücke, Verfügbarkeit im Geschäft | `/outfits`, `/marken`, `/kontakt` | Customer | Approved |
| `/outfits` | Outfit-Inspirationen | Komplette Looks, Styling, Verfügbarkeit im Geschäft | `/mode`, `/marken`, `/kontakt` | Customer | Approved |
| `/marken` | Unsere Marken | Aktuell geführte Marken, belegte Besonderheiten | `/marken/[slug]`, `/outfits`, `/kontakt` | Customer | Approved |
| `/marken/[slug]` | `[Markenname] bei Checkpot` | Marke, aktuelle Verfügbarkeit, belegte Eigenschaften | `/marken`, `/kontakt`, passende `/marken/[related-slug]` sofern vorhanden | Customer | Approved |
| `/fair-trade` | Fair Trade & Nachhaltigkeit | Belegte Standards, Prinzipien, passende Marken | `/marken`, `/kontakt` | Customer | Approved |
| `/kontakt` | Kontakt & Öffnungszeiten | Adresse, Öffnungszeiten, Kontaktwege, externer Routenlink | `/`, `/ueber-uns` | Customer | Approved |
| `/impressum` | Impressum | Freigegebene Anbieterangaben | `/kontakt`, `/datenschutz` | Customer/legal counsel | Approved |
| `/datenschutz` | Datenschutz | Freigegebene Verarbeitung und Einwilligungsinformationen | `/kontakt`, `/impressum` | Customer/legal counsel | Approved |

Every public route includes the global footer links `/kontakt`, `/impressum` and `/datenschutz`.
Every public subpage includes a visible breadcrumb path beginning at `/`; the breadcrumb links and
labels must match its `BreadcrumbList` structured data.

## Structured data

| Route/type | Schema.org type | Required source fields | Validation owner | Status |
| --- | --- | --- | --- | --- |
| `/` and `/kontakt` | `LocalBusiness` | Only verified visible name, address, telephone and opening hours | Auftraggeber / Christa Hausmair | Approved |
| Public subpages | `BreadcrumbList` | Visible breadcrumb labels and their canonical URLs | Auftraggeber / Christa Hausmair | Approved |

Structured data must match visible page content. Omit any field that is not supported by current
approved evidence. Do not invent or infer reviews, ratings, geo coordinates, opening hours, social
profiles or other business facts. Editorial collections and outfits must not emit `Product`, `Offer`
or ecommerce structured data.

## Technical SEO artifacts

| Artifact | Required implementation |
| --- | --- |
| Page metadata | Static `metadata` in Next.js Server Components, `generateMetadata` for `/marken/[slug]` |
| Canonicals | Absolute URLs derived from `https://checkpot-hietzing.at` |
| Sitemap | `src/app/sitemap.ts`; exclude `/impressum` and `/datenschutz` |
| Robots | `src/app/robots.ts`; allow all except admin/login (if added later) |
| Social image | Use global `opengraph-image.tsx` or static default |
| Icons | `app/favicon.ico`, `app/icon.png`, `app/apple-icon.png` |
| Structured data | Page-specific server-rendered JSON-LD: `LocalBusiness` on `/` and `/kontakt`; matching `BreadcrumbList` on public subpages |
| Redirects | Implement only the explicitly approved mappings below during Open Design; complete the remaining direct redirect/`410` map after the legacy SEO inventory and before migration release |

## Redirect and migration map

| Old URL | New URL | Status code | Reason | Verified |
| --- | --- | --- | --- | --- |
| `/team` | `/ueber-uns` | 301 | Approved consolidation to the final about route | Approved |
| `/brands` | `/marken` | 301 | Approved consolidation to the brand overview | Approved |

Migration rules for all remaining legacy URLs:

- Complete an inventory of every known old URL before final migration configuration.
- Redirect relevant legacy mode, brand and contact URLs directly to the closest equivalent new route.
- Deliberately archive or return `410` for obsolete URLs without a meaningful replacement.
- Do not create speculative mappings, redirect chains or blanket redirects to the homepage.
- The inventory and all additional mappings require SEO review before implementation; this downstream
  migration task does not authorize Open Design to guess legacy routes.

## Localization

- Locale URL strategy: Kein Prefix (`de-AT` default)
- Default-locale behavior: `lang="de-AT"` im `<html>` Tag.
- `hreflang` mapping: N/A (single language)
- Translated metadata owner: N/A
- Localized sitemap behavior: N/A

## Approval gate

- [x] Every required public route is represented.
- [x] Titles, descriptions, canonicals, and index directives are approved.
- [x] Social-image ownership and alt text are known.
- [x] Structured-data fields come from visible approved content.
- [x] Explicit redirects, migration policy and ownership of the complete legacy inventory are recorded.
- [x] Sitemap, robots, icons, and `SITE_URL` behavior are defined.
- [x] Admin, login, preview, and private routes cannot be indexed accidentally.

Set status to `APPROVED_FOR_FRONTEND` only when no unresolved item can materially change routing, page content, metadata, or structured data.
