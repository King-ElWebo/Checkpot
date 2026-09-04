# Project Specification

Status: `APPROVED_FOR_DESIGN`

Diese Datei enthält den derzeit belegbaren Stand der Kundenerfassung. Angaben aus der Altwebsite,
dem aktuellen Webauftritt, Analytics-/Search-Console-Exporten und dem gelieferten Medienbestand sind
als bestätigt, widersprüchlich oder offen gekennzeichnet. Die Spezifikation darf erst nach Klärung
der Blocker auf `APPROVED_FOR_DESIGN` gesetzt werden.

## 1. Project summary

- Project name: Relaunch Checkpot Hietzing
- Customer: Christa Hausmair / Checkpot
- Site type: Lokale, mehrseitige Boutique-, Marken- und Inspirationswebsite ohne Online-Shop und ohne
  Blog/Magazin. Die Website lädt in das stationäre Geschäft ein, führt in Angebot und Beratung ein
  und zeigt, was Checkpot besonders gut macht und warum sich ein Besuch lohnt.
- Confirmed business positioning: Hochwertige feminine Damenmode, persönliche typgerechte
  Stilberatung, ausgewählte Marken sowie fair und/oder nachhaltig produzierte Kollektionen
- Business goal: Menschen finden Checkpot über markenbezogene Google-Suchen und besuchen danach das
  stationäre Geschäft; zusätzlich soll der Auftritt informieren, Vertrauen schaffen, die bestehende
  Website modernisieren und das reale Geschäft authentisch widerspiegeln
- Primary conversion: Besuch des stationären Geschäfts; messbarer digitaler Vorläufer sind
  Kontaktanfragen und Klicks auf relevante Kontakt-/Routenaktionen
- Target audience: Weibliche Privat- und Bestandskundinnen, im Briefing mit 35-99 Jahren und Wien
  samt Umgebung angegeben; lokal und regional ausgerichtet
- Launch target: Kein fixes Datum; Umsetzung und Freigaben sollen zügig erfolgen
- Decision makers: Finale Freigaben erfolgen gemeinsam durch den Auftraggeber und Christa Hausmair;
  die Rückmeldeschleifen sollen kurzfristig erfolgen
- Current public domain: `https://checkpot-hietzing.at`
- Business start: 1 January 2009
- Delivery responsibility: Codex übernimmt Planung, Spezifikation, Prompt-Erstellung, Review und
  laufende Überwachung. Die eigentliche Implementierung erfolgt anschließend in Antigravity mit
  Gemini 3.1 Pro und muss gegen diese Spezifikation geprüft werden.

### Confirmed public facts requiring final customer verification

- Store: Checkpot Hietzing / Checkpot Damenmoden
- Founder/owner and project contact confirmed by questionnaire: Christa Hausmair
- Public telephone: `(01) 877 58 87` (Bestandsangabe; vor Veröffentlichung nochmals gegenprüfen)
- WhatsApp/mobile contact: `0676 3772514`
- Public email: `store@checkpot-hietzing.at` (Bestandsangabe; vor Veröffentlichung nochmals
  gegenprüfen)
- Contact-form recipient: `christa.hausmair@outlook.at`
- Opening hours: Monday-Friday 10:00-18:00, Saturday 10:00-14:00; im Admin dynamisch änderbar
- Address: `Hietzinger Hauptstraße 10-16, 1130 Wien`
- Legal/company display name: `Checkpot`; die für Impressum und Rechnungsdaten erforderlichen
  vollständigen Rechtsträgerangaben liefert der Kunde mit den Rechtstexten
- The legacy occurrence `Christa Wilk` is treated as stale/incorrect unless the customer states
  otherwise; new content uses Christa Hausmair

## 2. Confirmed scope

The following route inventory is approved based on the customer answers, current site, legacy
content and search-performance data.

### Approved required routes

| Route | Purpose | Main sections | Primary CTA | Content owner | Interactions | Content status |
| --- | --- | --- | --- | --- | --- | --- |
| `/` | Position the boutique and invite a local visit | Hero, value proposition, personal advice, current outfits/collection, brand highlights, fair/sustainable fashion, store/contact facts | Outfits ansehen / Marken entdecken / Geschäft besuchen | Customer | CTA links, subtle motion, external route-planning link | Legacy copy and authentic images available; rewrite needed |
| `/ueber-uns` | Build trust through founder, story and store impressions | Founder portrait, story since 2009, advice philosophy, store gallery | Contact / visit store | Customer | Gallery/lightbox optional | Legacy copy and store photography available; route and naming approved |
| `/mode` | Present current collections and new pieces without commerce | Current season introduction, curated gallery, availability disclaimer, visit CTA | Outfits ansehen / Geschäft besuchen | Customer | Responsive image-led gallery | Spring/summer 2026 gallery available; admin-managed publishing required |
| `/outfits` | Show complete coordinated looks and how new pieces are worn | Curated outfit photos, optional short styling notes, store availability, visit CTA | Geschäft besuchen / zum Outfit anfragen | Customer | Image-led editorial gallery; no cart or product checkout | Confirmed; admin-managed upload and publishing required |
| `/marken` | Explain and browse the currently stocked labels | Brand overview, differentiators, verified sustainability/availability notes | Marke entdecken / Geschäft besuchen | Customer | Brand cards and detail links | Initial brand list confirmed; admin-expandable |
| `/marken/[slug]` | Preserve brand search intent and introduce labels stocked at Checkpot | Brand introduction, current availability, relevant collections/outfits, store CTA | Aktuelle Kollektion ansehen / Geschäft besuchen | Customer | Dynamic detail pages | Confirmed in principle; routes generated from published admin records |
| `/fair-trade` | Substantiate the sustainability position | Store principles, verified certifications/standards, brand examples | View brands / visit store | Customer | Primarily editorial | Legacy FWF/GOTS copy exists; current claims and permissions unverified |
| `/kontakt` | Make store visit and contact effortless | Address, dynamic opening hours, external route link, phone, email and form | Route / call / WhatsApp / Nachricht | Customer | Click-to-call, email, WhatsApp, form and external route-planning link; no embedded map | Address, hours, form recipient, WhatsApp number and route behavior confirmed |
| `/impressum` | Legal provider disclosure | Approved legal notice | None | Customer/legal counsel | None | Existing text is not approved for reuse |
| `/datenschutz` | Explain processing and third-party services | Approved privacy notice, analytics/consent details | Consent settings if applicable | Customer/legal counsel | Consent settings link | Existing text is not approved for reuse |

The final route for the founder and store story is `/ueber-uns`. Its visible page title may be
`Über Checkpot & Christa` or a semantically equivalent approved wording. `/ueber-checkpot` is not a
canonical public route and must be consolidated to `/ueber-uns` wherever it occurs in specifications.

### Explicitly out of scope

- Multilingual delivery is not required; the questionnaire selects German only.
- Online shop, cart, checkout, payment, transactional product catalogue and customer accounts.
- Blog, magazine and SEO knowledge section.
- Customer accounts, membership, newsletter, booking, downloads, live chat, payment integration and
  other complex functions are not selected in the detailed function section and remain out of scope.

## 3. Content and assets

- Copy owner: Customer and service provider collaboratively; existing material is a content basis and
  texts are expected to be rewritten with SEO considerations
- Existing copy: Approximately 29 KB of exported legacy website text covering home, team, brands,
  fair trade, contact, legal pages and historical material; obsolete wardrobe-consultation copy is
  explicitly excluded
- Logo and brand assets: Red handwritten Checkpot wordmark plus print files in PDF/AI/PSD and PNG/JPG
- Photography/video: 1,631 readable raster images plus two MP4 files; the collection contains store,
  founder/advice and seasonal fashion imagery
- Asset structure: Most website images exist as original/HD/thumbnail variants; 60 files are exact
  duplicates. The latest supplied collection folder is spring/summer 2026.
- Intended image sources: Own photos and product photos. The customer confirms that the supplied
  image and video materials may be used for the project.
- Existing content or URL migration: Required because the live domain has indexed pages, rankings and
  backlinks. A complete inventory of known legacy URLs must assign each URL to keep, direct redirect,
  archive or `410`. Relevant legacy mode, brand and contact URLs redirect to the closest equivalent
  new route; obsolete URLs without an equivalent are deliberately archived or return `410`. Beyond
  the explicitly approved `/team` and `/brands` mappings, no final redirect is configured before the
  SEO inventory is complete.
- Legal-content owner: The Auftraggeber supplies and manually maintains the approved legal texts;
  existing legal text is historical reference only
- Historical catalogue order: Appears tied to the COVID period and is not assumed to remain in scope

## 4. Visual direction

- Existing brand cues: Red handwritten Checkpot wordmark, red/white communication, colourful fashion
  photography, personal and local boutique character
- Brand adjectives: Individual, fair, ecological/sustainable, human, creative, serious, bold and
  exclusive; the result should feel younger and more authentic
- Preferred references and reasons: No reference websites supplied or required; the established
  natural, human and Scandinavian direction is approved
- Rejected styles: No luxury aesthetic, childish treatment, restless shop-like grids, ecommerce
  presentation, strong animation or other product-obscuring presentation
- Color constraints: Primary brand red `#C01718` with white and suitable calm neutral/natural tones
- Typography constraints: Existing logo lettering is fixed for the wordmark. `Outfit` is the approved
  heading typeface; `Inter` is the approved body and UI typeface. The resulting typography must feel
  classic-elegant, calm and highly legible.
- Imagery direction: Natural, human, emotional and calm rather than technical; authentic founder,
  store, outfit and fashion imagery is the visual focus
- Design character: Scandinavian, natural/sustainable, light/friendly and confidently elegant.
  Corners may be moderately softened but must not become fully pill-shaped or look like round balls.
  Depth is restrained and supports hierarchy rather than producing a glossy/technical 3D style.
- Motion intensity: Performance-first, subtle and purposeful. Simple hover effects, gentle reveals
  and a controlled slider/carousel are welcome; no flashy effects, aggressive parallax or animations
  that compete with the products, especially for the older core audience.
- Priority scroll-storytelling sections: None required; homepage sequencing may use subtle reveals but
  must remain immediately readable and product-led
- Preferred motion references: None supplied; use the approved restrained motion direction
- Prohibited motion or effects: No autoplay spectacle, rapid movement, excessive parallax, neon/glow
  effects, bouncing UI, scroll hijacking or motion that hides/delays product imagery
- Required brand rules: Preserve the Checkpot wordmark, use `#C01718` as the recognizable accent,
  keep product/outfit photography dominant and avoid luxury, childish, shop-like or restless styling

The resolved visual and section-level motion system will be recorded in `docs/DESIGN-SYSTEM.md`.

## 5. Functional requirements

| Feature | User | Required behavior | Success state | Failure state | Status |
| --- | --- | --- | --- | --- | --- |
| Click-to-call | Visitor | Starts a phone call from supported devices | Dialler opens with approved number | Number remains visible/copyable | Proposed default |
| Contact form | Visitor | Sends `name`, `surname`, `email` and `message` after validation to `christa.hausmair@outlook.at` without persisting the inquiry in Neon/admin | Accessible confirmation without exposing personal data | Field-level validation, server error and phone/email alternative | Confirmed; sender `website@checkpot-hietzing.at` via Resend |
| WhatsApp contact | Visitor | Opens a conversation with `0676 3772514` and clearly labels the external handoff | Correct business recipient opens | Phone/email remain available | Confirmed |
| Route planning | Visitor | Shows the address as text and opens the approved destination only through a clearly labeled external `Route planen` link; no map is embedded | Correct external route destination opens | Address remains visible and copyable | Confirmed; privacy-friendly external handoff |
| Collection/outfit gallery | Visitor | Browse published collections, new pieces and complete outfit imagery responsively | Images load with meaningful alt handling and show how pieces are worn | Stable fallback and no broken layout | Confirmed; admin-managed |
| Brand browsing | Visitor | Browse published current labels and their related outfits/collections | Relevant overview/detail opens | Unavailable brands are unpublished, not advertised | Confirmed; admin-managed |
| Consent management | Visitor | Accept/reject non-essential services by category and reopen settings | Choice persists and scripts respect it | Site core remains usable without consent | Confirmed; built-in category-based solution preferred to avoid recurring fees |

## 6. Content models

| Model | Fields | Relationships | Editable by | Publishing behavior | Status |
| --- | --- | --- | --- | --- | --- |
| Brand | name, slug, summary, verified claims, imagery, sort order, active/current status, SEO fields | Collections/outfits | Administrator | Draft/publish; new brands can be added without code changes | Confirmed. Initial set: Adini, Zilch, Sorgenfri, King Louie, Angels, Happy Rainy Days, Emily van den Bergh, Madness |
| Seasonal collection | title, season/year, intro, gallery, featured/current status, SEO fields | Images, brands and outfits | Administrator | Draft/publish; current items highlighted, older entries can be archived | Confirmed |
| Outfit | title, short styling note, image/gallery, optional availability note, featured status, sort order, SEO fields | Optional brands and collection | Administrator | Draft/publish/archive; no price, stock counter, cart or checkout | Confirmed |
| Store details | address, regular/special opening hours, public telephone, WhatsApp, public email, map destination | Global site UI | Administrator | Changes update all occurrences atomically; telephone and email are not hardcoded | Confirmed |
| Page content | route/section key, headings, rich text, CTA labels/targets, visibility, SEO fields | Media, brands, outfits, services | Administrator | Controlled editable sections; layout/design remains code-owned | Confirmed scope of `alles editierbar` |
| Media asset | file, alt/purpose, rights/source, focal point, season, status | Brands/collections/outfits/pages | Administrator | Optimized derivatives generated from approved originals | Confirmed; customer uploads outfit and new-item imagery |

## 7. Technical decisions

### Fixed template baseline

- Framework: Next.js 16 App Router
- Database: Neon PostgreSQL
- ORM and migrations: Drizzle ORM and versioned SQL under `drizzle/`
- Data-access boundary: Hybrid approach (server-only business repositories under `src/lib/repositories/` for reusable/public domain reads and complex operations; direct Drizzle usage allowed for simple, local, protected Admin CRUD)
- Admin bootstrap: one environment-backed administrator with signed `jose` session, protected by
  `src/proxy.ts` and server-side verification

### Architectural Decision: Hybrid Data-Access Approach
Checkpot uses a hybrid data-access model:
- Checkpot is a small, single-admin content system.
- For simple protected CRUD (e.g., in Admin Server Actions), an additional repository indirection can add complexity without enough benefit. Direct Drizzle usage is permitted here provided it is validated, server-only, and securely authorized.
- Repositories/services remain explicitly required where they materially improve reuse, consistency, atomicity, or domain clarity (such as public data reads, or complex multi-table mutations).
- This decision can be revisited if the system grows to multiple admins, richer permissions, more integrations, or significantly more complex domain behavior.

### Customer-specific decisions

- Cost constraint: The private/pre-release test phase should operate at `€0/month` within documented
  free-tier limits. No automatic paid overage may be enabled. Vercel must be upgraded to a plan that
  permits commercial use before the Checkpot production site becomes publicly available.
- Deployment target: Vercel for testing and later production. The customer requests Hobby during the
  test phase and a later paid upgrade. Because Vercel restricts Hobby to personal/non-commercial use,
  this is recorded only as a temporary private/pre-release environment and is a mandatory release
  blocker; a Pro trial or Pro plan is the safer compliant test path.
- Function region: Frankfurt, Germany (`fra1`), explicitly configured instead of Vercel's US default
- Neon project, owner, region and branch: Create/verify a customer-owned Neon project in Frankfurt;
  the locally present `DATABASE_URL` is not assumed to belong to production and no discovery-time
  migration has been run
- Storage provider: Vercel Blob for admin image uploads, created as a public-media store in Frankfurt
  (`fra1`). Store only metadata and relations in Neon, not image binaries. The Blob region is fixed at
  creation and must be verified before uploading customer media.
- Is the single-admin bootstrap sufficient: Yes; one administrator
- Required users, roles, MFA, password reset, or session revocation: No additional roles requested;
  secure bootstrap, session expiry and server-side revocation remain mandatory implementation details
- Email provider: Resend with verified sender `website@checkpot-hietzing.at`, Ireland sending region
  and recipient `christa.hausmair@outlook.at`. International metadata processing is accepted only
  with the applicable DPA/transfer safeguards and accurate privacy disclosure. Inquiry bodies are not
  copied into Neon or the admin.
- Payment provider: None; no commerce or payment processing
- CMS or editorial integration: Use the included custom admin. Store facts, opening hours, page copy,
  brands, collections, outfits, services, media and SEO fields must be editable. Layout, components,
  design tokens, code and security configuration are not content-managed.
- Other integrations: Retain Google Analytics, YouTube, Meta Pixel and Google reCAPTCHA; all
  non-essential embedded services must remain blocked until the required consent category is granted.
  No Google Map or other map is embedded. Route planning and WhatsApp are clearly labeled external
  links that transfer the visitor only after an intentional click. Instagram and Facebook links are
  added by the customer later.
- Caching/revalidation expectations: Public content is delivered statically by default or with
  revalidation where editorial freshness requires it. Later backend mutations trigger targeted
  invalidation of the affected routes, records or cache tags. A change to one item must not cause a
  blanket revalidation of every public page unless that item genuinely affects all pages.
- Backup/restore expectations: Encrypted local exports of Neon records and Vercel Blob media are kept
  by Christa at least monthly and additionally before major content or migration changes; a restore
  test is required before release and after any material backup-process change
- Contact inquiry storage: Email delivery only; no inquiry record or message copy is stored in Neon or
  exposed in the admin. Only security-minimal transient processing and technical failure logging may
  occur, without logging message bodies.
- Domain/DNS owner and deployment access: Shared responsibility of the Auftraggeber and Christa
  Hausmair; exact account holder and access handoff must be documented before launch

Changing the fixed database, ORM, or auth baseline requires an explicitly approved architectural
migration. External services are implemented only when selected in this specification.

## 8. Languages, SEO, analytics, and legal

- Languages and default locale: German/Austria (`de-AT`) only
- URL locale strategy: No locale prefix for the German-only site
- SEO targets confirmed by data: Brand/store searches, especially Checkpot Hietzing, boutique
  Hietzing, King Louie Wien and other stocked brands
- Primary markets and locations: Vienna and surrounding area, with Hietzing as the store's local focus
- Existing domain and migration source: `https://checkpot-hietzing.at`
- Search-intent or keyword research owner: Codex prepares the SEO plan from the supplied Search
  Console/GA evidence; the Auftraggeber and Christa approve customer claims and priorities
- Redirect requirements: Required. A complete SEO inventory maps all known legacy URLs before launch.
  `/team` redirects directly to `/ueber-uns`; `/brands` redirects directly to `/marken`. Relevant old
  mode, brand and contact routes map to the closest equivalent route. Obsolete URLs with no equivalent
  are deliberately archived or return `410`. No additional final redirect is configured before the
  inventory is complete, and redirect chains are prohibited.
- Structured data: `LocalBusiness` is approved for `/` and `/kontakt`; `BreadcrumbList` is approved
  for public subpages and must match visible breadcrumbs. Only verified, visibly consistent business
  facts may be emitted. No invented reviews, geo data, opening hours, social links, `Product`, `Offer`,
  cart or ecommerce markup may be used.
- Analytics evidence: GA4 property `Checkpot Damenmoden – GA4` under account `Bizkit`; exported period
  2025-06-01 to 2026-08-09 has 1,068 users, 1,449 sessions and no configured key events/conversions
- Search Console evidence: 2025-04-08 to 2026-08-07, 1,510 clicks, 43,773 impressions and 3.45% CTR;
  mobile produced 1,065 clicks versus 416 desktop clicks
- Search Console coverage export: 24 indexed and 8 non-indexed URLs; unresolved groups include
  duplicate canonical, 404, 403, robots-blocked and crawled-not-indexed pages
- Consent management: Required for Google Analytics, YouTube, Meta Pixel and reCAPTCHA.
  Prefer a built-in category-based consent layer with no recurring provider fee; exact categories,
  consent-mode behavior and legal wording are finalized with the customer-supplied privacy text. The
  external route-planning link does not load a map or map-provider content inside the website.
- Privacy or data-residency constraints: Primary operational application data, media and compute are
  placed in Frankfurt through Neon, Vercel Blob and Vercel Functions. International services such as
  Resend, Google and Meta may be used only with the required consent controls, contracts/DPAs,
  transfer safeguards and accurate customer-approved legal texts. Local encrypted backups stay with
  Christa in Austria.
- Legal texts: The Auftraggeber provides and manually maintains the approved Austrian/EU-compliant
  versions; technical implementation must reflect the actually deployed services

### Approved messaging guardrails

- Desired themes include fair trade, GOTS, 100% cotton, sustainable, pattern-rich and colourful.
- `GOTS`, `fair trade`, `100% cotton` and comparable objective claims may be shown only for the exact
  brand, collection or garment for which current evidence exists; they are not blanket claims about
  every item in the store.
- The acronym is written as `Global Organic Textile Standard (GOTS)` where it is explained.

Route-level metadata, indexing, social images, structured data and the full redirect map will be
resolved in `docs/SEO-SPEC.md` after route approval.

## 9. Quality requirements

- Supported browsers/devices: Current and two previous major versions of Chrome, Safari, Firefox and
  Edge, plus current iOS and Android browsers
- Accessibility target: WCAG 2.2 AA. Semantic HTML, sufficient contrast, visible focus states, full
  keyboard operability and meaningful alternative text are mandatory.
- Performance target: High priority in the customer briefing; proposed measurable target is passing
  Core Web Vitals at the 75th percentile where sufficient field data exists, with mobile-first
  image/video budgets
- Required responsive widths: Proposed verification at 390, 768, 1024, 1440 and wide desktop
- Monitoring/logging: Use provider-native Vercel runtime/deployment logs, GA4 health/conversion checks
  after consent and documented manual release checks; do not log contact message bodies or secrets
- Media quality: No unoptimized multi-megabyte originals may be sent directly where an optimized
  derivative is sufficient

## 10. Open decisions

### Blocking before design

- None. The route inventory, visual direction and customer scope are approved for design planning.

### Blocking before backend

- Upgrade Vercel from the temporary test plan to a commercial-use-compatible plan before public
  production release
- Verify customer ownership and Frankfurt placement for Vercel Functions, Vercel Blob and Neon; no
  discovery-time credentials or default US regions may silently become production
- Complete and verify the Resend domain/DNS setup for `website@checkpot-hietzing.at`, including the
  selected Ireland sending region and required privacy documentation
- Implement and verify the approved encrypted local backup/restore routine owned by Christa

### Non-blocking follow-ups

- Curated asset shortlist and archive policy for historical seasonal galleries
- Final alt text, crop/focal-point decisions and social-preview imagery
- Social-media profile URLs; Instagram and Facebook are selected as active/future channels

## 11. Acceptance criteria

- [ ] Every approved public route exists and has a documented purpose, owner, primary CTA and content
      status.
- [ ] All public occurrences of address, hours, phone, email, owner name and legal entity match the
      authoritative approved data.
- [ ] Every retained legacy URL returns the approved content or one direct permanent redirect; no
      redirect chains exist.
- [ ] High-value brand/store search pages are preserved or deliberately consolidated with an approved
      redirect and equivalent search intent.
- [ ] Mobile and desktop layouts are approved at the documented verification widths.
- [ ] All required functions work with real approved services and expose accessible success/error
      states.
- [ ] Non-essential analytics and external-media embeds (Google Analytics 4, Google Maps on `/kontakt`) run strictly under the approved category-based consent model (blocked before consent, dynamically revocable); route planning remains additionally accessible as an external link.
- [ ] No brand, exclusivity, sustainability, certification or business claim is published without
      customer-approved evidence.
- [ ] Privileged operations are authorized server-side and every untrusted payload is validated.
- [ ] Every required route has approved metadata, canonical, indexing, social image and structured-data
      behavior in `docs/SEO-SPEC.md`.
- [ ] Every prominent section has an approved motion decision or explicit `none`, including mobile and
      reduced-motion behavior.
- [ ] WCAG target, keyboard/focus behavior, type check, lint, production build and critical browser
      journeys pass before release.
- [ ] Production secrets, domain, analytics ownership, deployment, backups and monitoring are assigned
      to named owners before launch.

## 12. Discovery evidence reviewed

- Repository instructions, workflows, configs, application foundation and migration baseline
- Current public pages on `checkpot-hietzing.at`
- 23 GA4/Search Console CSV exports
- Exported legacy website copy
- 1,631 readable raster images, two MP4 videos and supplied PDF/AI/PSD brand/print files
- Search performance, coverage issues, existing backlinks and current/legacy route inventory
- Completed 20-page customer website briefing questionnaire dated 3 June 2026, including AcroForm
  values and visual page verification

## Approval gate

Status is `APPROVED_FOR_DESIGN`. Design-system, SEO and motion planning may begin. This approval does
not authorize Codex to implement application code; implementation remains assigned to Antigravity
with Gemini 3.1 Pro and must follow the approved delivery sequence. Backend and release blockers must
be closed before their respective gates.
