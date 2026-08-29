# Checkpot Current Technical Status

## Last audited & updated
- Date: 2026-08-29
- Commit SHA: Phase 1 committed (`85adcc4`), Phase 2 Contact Form Backend completed
- Branch: `main`

---

## 1. Executive Summary

Phase 1 and Phase 2 of the backend completion are **COMPLETE**:
1. **Central Store Settings & Single Source of Truth (Phase 1)**: Business facts (store name, owner, street, postal code, city, country, phone, WhatsApp, email, structured opening hours) are stored in Neon (`system_settings` table, `key = 'store_details'`) and managed via `/admin/store` ("Geschäftsdaten").
2. **Central SITE_URL Configuration (Phase 1)**: Production domain assumptions are decoupled from fixtures. `getSiteUrl()` normalizes `process.env.SITE_URL` with fallback to `https://checkpot-hietzing.at`, driving root `metadataBase`, `sitemap.ts`, `robots.ts`, OpenGraph URLs, and JSON-LD structured data.
3. **Contact Form Backend & Email Delivery (Phase 2)**: The `/kontakt` form is fully functional. Submissions are processed by a dedicated Server Action with strict Zod validation (`src/lib/validations/contact.ts`), honeypot spam filtering, lightweight rate limiting, and email dispatch via Resend (`website@checkpot-hietzing.at` -> `christa.hausmair@outlook.at` with visitor `replyTo`). Zero inquiry data is persisted to Neon.
4. **Accessible Client Form UX (Phase 2)**: Replaced the static HTML form with a focused Client Component (`src/app/(public)/kontakt/contact-form.tsx`) providing pending loading indicators, inline field validation feedback, and clear success/failure states with screen reader accessibility.

Remaining items for subsequent phases:
- **Phase 3**: Media format handling (SVG upload support, PNG transparency preservation), brand SEO metadata connection, legacy URL redirect inventory.
- **Phase 4**: Legal cleanup (removal of developer placeholder boxes on `/impressum` and `/datenschutz`), login rate limiting, consent management.

---

## 2. Working (Fully Implemented & DB-Connected)

- **Contact Form Backend (Phase 2 Completed)**:
  - Form fields: `name`, `email`, `phone` (optional), `message`, and hidden `companyWebsite` honeypot.
  - Dedicated Zod schema in `src/lib/validations/contact.ts`.
  - Server Action `sendContactMessageAction` in `src/app/(public)/kontakt/actions.ts`.
  - Honeypot bot trap (silently returns success without dispatching email).
  - Sliding-window burst rate limiter (max 5 requests per 10 minutes per IP).
  - Strict non-persistence of personal inquiry data in Neon (no DB table, no CRM, no audit logs).
  - Resend email dispatch with sanitized plain-text and HTML templates (`website@checkpot-hietzing.at` -> `christa.hausmair@outlook.at`, `replyTo: visitor email`).
  - Accessible Client Component `ContactForm` with `aria-invalid`, `aria-describedby`, pending spinner, and `role="status"` live region confirmation.
- **Store Settings & Business Facts (Phase 1 Completed)**:
  - Database-backed via `systemSettings` (`key = "store_details"`).
  - Pure contracts & default constants in `src/lib/contracts/store-defaults.ts`.
  - Server-only repository `src/lib/repositories/store-settings.ts` deduplicated per-request with React `cache()`.
  - Dedicated Admin UI `/admin/store` with 4 structured sections (Geschäft & Inhaberin, Standort & Adresse, Kontaktdaten, Reguläre Öffnungszeiten).
  - Protected Server Action `saveStoreSettingsAction` with `requireAdmin()`, `storeSettingsSchema` Zod validation, and layout-level revalidation.
  - Public integration across Layout, Footer, Home, `/kontakt`, `/ueber-uns`, `/impressum`, `/datenschutz`, and `LocalBusiness` JSON-LD.
- **Central SITE_URL Management (Phase 1 Completed)**:
  - `src/lib/site-config.ts` (`getSiteUrl()`, `absoluteUrl()`).
  - `.env.example` documented with production and staging override instructions.
  - Integrated into root layout `metadataBase`, `sitemap.ts`, `robots.ts`, OpenGraph, Breadcrumbs, and JSON-LD.
- **Admin Authentication**: JWT session with `jose`, `timingSafeEqual` password check, `requireAdmin()` verifier on Server Actions, and `src/proxy.ts` middleware route protection.
- **Media Management**:
  - Drag-and-drop multi-upload to Vercel Blob.
  - Interactive `FocalPointPicker` saving focal coordinates (`X% Y%`).
  - Missing alt-text indicator badges.
  - Real-time `MediaUsage` lookup across brands (logo/image) and outfits.
  - Safe deletion with usage warning and forced override modal.
  - `MediaPicker` component for brand logos, brand images, and outfit photography.
- **Brands Module**:
  - Full Admin CRUD with Zod validation.
  - Public `/marken` grid with responsive layouts and active filter.
  - Public `/marken/[slug]` detail page with brand story, logo, campaign photo, and related outfits.
  - Homepage `BrandBookshelf` dynamically rendering all published brands.
  - Dynamic sitemap inclusion for published brands.
- **Outfits & Lookbook Module**:
  - Full Admin CRUD with multi-brand and multi-category assignment.
  - Atomic multi-table writes via `saveOutfitAtomic` using `database.batch()`.
  - Public `/outfits` Lookbook with taxonomy filter bar (OR within group, AND across groups).
  - Homepage featured outfits section (up to 3 items).
- **Outfit Taxonomy (Categories & Groups)**:
  - Admin CRUD for taxonomy groups and categories with slug validation and deletion safety checks.
- **Collections & Mode Module**:
  - Admin CRUD for seasonal collections.
  - Public `/mode` dynamically rendering featured/current collection and its outfits with responsive multi-image layouts.
- **Targeted Revalidation**:
  - Brand, Outfit, and Store Settings mutations trigger specific `revalidatePath` calls for affected detail pages, lists, layout, and homepage.
- **Quality Gates**:
  - `npm run typecheck`: PASS (0 errors)
  - `npm run lint`: PASS (0 warnings/errors)
  - `npm run build`: PASS (28 static & dynamic routes compiled with Turbopack)

---

## 3. Partially Implemented

- **Email Delivery Verification**: Code and templates are complete; real inbox delivery test remains pending entry of customer `RESEND_API_KEY` in production/staging.
- **Collections / Mode Gallery Relation**: Collections rely on outfits referencing the collection (`outfits.collectionId`). No direct gallery image relation.
- **Brand SEO & Claims**: `brands.seoMetadata` and `brands.verifiedClaims` exist in the database schema, but are neither editable in Admin nor consumed by `generateMetadata` or public brand pages.
- **Related Brands**: `/marken/[slug]` generates related brands by taking a random slice of other brands rather than using explicit relationships.
- **Media Format Handling**:
  - Magic byte validation handles PNG, JPG, and WEBP, but rejects SVG.
  - Client compression flattens PNG logos to white JPEGs.
- **Legacy Redirects**: Basic redirects for `/team` and `/brands` exist in `next.config.ts`, but the full legacy URL migration/410 inventory is missing.

---

## 4. Missing (Gaps for Subsequent Phases)

- **Consent Management (Phase 4)**:
  - Category-based consent manager (for future tracking/third-party scripts).
- **Legal Content Review (Phase 4)**:
  - Replacement of developer placeholders on `/impressum` and `/datenschutz`.
  - Privacy policy alignment with email-only contact processing.

---

## 5. Launch Blockers (P0)

1. **Visible Developer Placeholders**: Prominent alert boxes with "Hinweis für die Inhaberin" appear on public `/impressum` and `/datenschutz` (Scheduled for Phase 4).
2. **Vercel Deployment Environment Configuration**: Vercel environment variables (`DATABASE_URL`, `BLOB_READ_WRITE_TOKEN`, `AUTH_SECRET`, `ADMIN_PASSWORD`, `RESEND_API_KEY`, `SITE_URL`) must be configured and verified in Frankfurt (`fra1`).

---

## 6. Public Route Data-Source Matrix

| Route | Data Source | DB-Backed? | Static Fixture? | Hardcoded / Static Copy? | Admin-Editable? | Revalidated? | SEO Data Source | Concrete Gaps |
|---|---|---|---|---|---|---|---|---|
| `/` | Hybrid | **Yes (Outfits, Brands, Store Details)** | No | Yes (Hero copy, story copy, hero image) | **Yes (Outfits, Brands, Store Details)** | Yes | `LocalBusiness` JSON-LD from `getStoreDetails()`; root layout metadata | None for store facts. |
| `/mode` | Hybrid | Partial | Yes (`seoRoutes`) | Yes (Fallback store shelf photo) | Partial (Collection title, season, intro & outfits from DB; no direct media gallery) | Yes | `seoRoutes` fixture | SEO metadata from fixture. Images depend on assigned outfits. |
| `/outfits` | DB-backed | Full | No | Yes (Metadata in `page.tsx`) | Yes (Outfits, taxonomy, brands) | Yes | Hardcoded in `page.tsx` | Metadata ignores SEO spec constants. |
| `/marken` | Hybrid | Partial | No | Yes (Headline, intro text, metadata) | Partial (Brands list, logos, photos, teasers from DB; page intro is static) | Yes | Hardcoded in `page.tsx` | Verified claims not displayed. |
| `/marken/[slug]` | DB-backed | Full | No | Yes (Store info box copy) | Partial (Brand data from DB; `seoMetadata` & `verifiedClaims` ignored) | Yes | `generateMetadata` (name + summary) | `seoMetadata` stored in DB is ignored. Related brands is random slice. |
| `/ueber-uns` | Hybrid | **Yes (Store Details)** | Yes (`imagery`, `seoRoutes`) | Yes (Story text, quotes, layout images) | **Yes (Store facts)** | Yes (via layout) | `seoRoutes` fixture | None for store facts. |
| `/fair-trade` | Fixtures & Static | No | Yes (`seoRoutes`, `imagery`) | Yes (All principles text, layout image) | No | No | `seoRoutes` fixture | Entire page is static/fixture-driven. Claims require customer verification. |
| `/kontakt` | Hybrid | **Yes (Store Details & Contact Action)** | Yes (`seoRoutes`, `imagery`) | Yes (Static layout images) | **Yes (Store facts)** | Yes | `LocalBusiness` JSON-LD from `getStoreDetails()`; `seoRoutes` fixture | None. Contact form fully integrated. |
| `/impressum` | Hybrid | **Yes (Store Details)** | Yes (`seoRoutes`) | Yes (Legal text, placeholder box) | **Yes (Store facts)** | Yes | `seoRoutes` fixture (`robots: noindex`) | Visible developer placeholder note. Missing tax/legal entity data. |
| `/datenschutz` | Hybrid | **Yes (Store Details)** | Yes (`seoRoutes`) | Yes (Privacy text, placeholder box) | **Yes (Store facts)** | Yes | `seoRoutes` fixture (`robots: noindex`) | Visible developer placeholder note. |

---

## 7. Security Findings

- **Auth Verification**: Strong. All admin mutations call `await requireAdmin()` directly inside Server Actions. `src/proxy.ts` acts as optimistic route filter.
- **Session Tokens**: Signed JWT using `jose` HS256 with 8-hour expiry, `httpOnly`, `sameSite: "lax"`, and `secure` in production.
- **Input Validation**: Strict Zod schemas used for all admin forms and public contact forms.
- **Upload Hardening**: Server-side magic-number verification prevents MIME-type spoofing; files stored with `crypto.randomUUID()`.
- **Contact Form Privacy & Anti-Spam**:
  - Honeypot hidden input traps automated spam bots without alerting them.
  - Sliding-window rate limiter restricts rapid IP bursts.
  - Zero database persistence of inquiry text or personal visitor details.
  - HTML body sanitized with character escaping to prevent injection.

---

## 8. Deployment & Environment Findings

- **Framework Compatibility**: Next.js 16.3.0 App Router with Turbopack builds cleanly.
- **Storage**: Vercel Blob configured for `*.public.blob.vercel-storage.com`.
- **Region Placement**: Frankfurt (`fra1`) specified for Neon, Vercel Functions, and Vercel Blob.
- **Central Environment Variables**:
  - `DATABASE_URL` (Neon PostgreSQL pooled connection)
  - `SITE_URL` (Driving canonicals, metadataBase, sitemap, robots, JSON-LD)
  - `AUTH_SECRET` (JWT signing secret, min 32 chars)
  - `ADMIN_PASSWORD` (Single-admin bootstrap password)
  - `BLOB_READ_WRITE_TOKEN` (Vercel Blob token)
  - `RESEND_API_KEY` (Required for contact form email delivery)

---

## 9. Verification Summary

```text
> npm run typecheck
tsc --noEmit -> Exit code 0 (PASS, 0 errors)

> npm run lint
eslint . -> Exit code 0 (PASS, 0 warnings/errors)

> npm run build
next build -> Exit code 0 (PASS, 28 static & dynamic routes compiled)
```

---

## 10. Prioritized Action Items

- **Phase 3 (P1 - Required Backend Completion)**:
  1. Fix media upload to support SVG files (for vector brand logos) and preserve PNG transparency during client compression.
  2. Wire `brand.seoMetadata` in `/marken/[slug]` `generateMetadata`.
  3. Clean up and complete legacy URL redirects and 410 mappings in `next.config.ts`.

- **Phase 4 (P2 - Legal & Security Polish)**:
  1. Remove developer placeholder alert boxes from `/impressum` and `/datenschutz` and align privacy policy.
  2. Add login rate limiting for `/api/auth/login`.
  3. Add category-based consent management if analytics or external scripts are activated.
  4. Customer verification of claims on `/fair-trade` and `/marken`.
