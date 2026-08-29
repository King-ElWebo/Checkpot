# Checkpot Current Technical Status

## Last audited & updated
- Date: 2026-08-29
- Commit SHA: Phase 1 (`85adcc4`), Phase 2 (`02e73e6`), Phase 3A (`dfce5ed`), Phase 3B Brand SEO & Verified Claims completed
- Branch: `main`

---

## 1. Executive Summary

Phases 1, 2, 3A, and 3B of the backend completion are **COMPLETE**:
1. **Central Store Settings & Single Source of Truth (Phase 1)**: Business facts are stored in Neon (`system_settings` table, `key = 'store_details'`) and managed via `/admin/store` ("Geschäftsdaten").
2. **Central SITE_URL Configuration (Phase 1)**: Production domain assumptions are decoupled from fixtures. `getSiteUrl()` normalizes `process.env.SITE_URL` with fallback to `https://checkpot-hietzing.at`, driving root `metadataBase`, `sitemap.ts`, `robots.ts`, OpenGraph URLs, and JSON-LD structured data.
3. **Contact Form Backend & Email Delivery (Phase 2)**: Submissions are processed by a dedicated Server Action with Zod validation (`src/lib/validations/contact.ts`), honeypot spam filtering, lightweight rate limiting, and email dispatch via Resend (`website@checkpot-hietzing.at` -> `christa.hausmair@outlook.at` with visitor `replyTo`). Zero inquiry data is persisted to Neon.
4. **Media Upload & PNG Transparency Fix (Phase 3A)**: Client-side compression in `src/lib/image-compression.ts` preserves PNG alpha transparency and WebP formats. SVG upload is intentionally unsupported on the server for security hardening; UI recommendations specify `"PNG mit transparentem Hintergrund"`.
5. **Brand Assortment Reconciliation (Phase 3A)**: Reconciled the Neon database against the 15 approved Checkpot brands with defined sort order (10–150). Inactive legacy brands (`Zilch`, `Happy Rainy Days`, `Adini`) are deactivated (`active = false`) without deleting records or outfit relations.
6. **Brand SEO, Claims & Public Data Integration (Phase 3B)**:
   - `brands.seoMetadata` is strictly typed (`BrandSeoMetadata`), editable in Admin, and consumed by `generateMetadata` in `/marken/[slug]` with hierarchical fallbacks.
   - `brands.verifiedClaims` is safely validated, editable line-by-line in Admin, and rendered under *"Gut zu wissen"* on `/marken/[slug]`.
   - Replaced random "related brand" slice with deterministic assortment wrap-around helper `getAdditionalPublishedBrands()`.
   - Audited and eliminated dead legacy business fixtures (`brands[]`, `outfits[]`, `currentCollection`, `getBrandBySlug()`, `getRelatedBrands()`) from `src/content/fixtures/checkpot.ts`.

Remaining items for subsequent phases:
- **Phase 4**: Legal cleanup (removal of developer placeholder boxes on `/impressum` and `/datenschutz`), login rate limiting, consent management.
- **Release Phase**: Legacy URL redirect & 410 mapping inventory, production environment deployment verification in Frankfurt (`fra1`).

---

## 2. Working (Fully Implemented & DB-Connected)

- **Brand Module & SEO / Claims (Phase 3B Completed)**:
  - Strongly typed `BrandSeoMetadata` schema with length limits (title: 70 chars, description: 180 chars).
  - Admin Brand editor with dedicated "5. SEO & Suchmaschinen" and "4. Verifizierte Hinweise" sections.
  - Slug modification warning banner (*"⚠️ Änderungen am Slug verändern die öffentliche Marken-URL"*).
  - Multi-path targeted cache invalidation on save (`/marken`, `/marken/{new-slug}`, `/marken/{old-slug}`, `/`, `/sitemap.xml`).
  - Hierarchical `generateMetadata` resolution on `/marken/[slug]`:
    - Title: `seoMetadata.title` $\rightarrow$ `${brand.name} bei Checkpot`
    - Description: `seoMetadata.description` $\rightarrow$ `brand.summary` $\rightarrow$ `${brand.name} bei Checkpot in Wien Hietzing entdecken.`
    - OpenGraph: `seoMetadata.ogTitle` / `seoMetadata.ogDescription` / `brand.image.url`
  - Verified claims rendering under *"Gut zu wissen"* on `/marken/[slug]` with zero empty boxes when omitted.
  - Deterministic `getAdditionalPublishedBrands(brand.id, 3)` wrapping around the assortment in `sortOrder`.
- **Media Management & Transparency Preservation (Phase 3A Completed)**:
  - Client-side image compression (`src/lib/image-compression.ts`) preserves PNG alpha transparency and WebP formats.
  - JPEG compression optimizes photographic imagery without affecting PNG logos.
  - Server-side magic-byte verification enforces `image/jpeg`, `image/png`, and `image/webp`.
  - Multi-upload, focal point picking, safe deletion with usage checks, and `MediaPicker` UI.
- **Contact Form Backend (Phase 2 Completed)**:
  - Server Action `sendContactMessageAction` with Zod validation, honeypot protection, rate limiting, and zero DB persistence.
  - Resend email dispatch with sanitized plain-text and HTML templates (`website@checkpot-hietzing.at` -> `christa.hausmair@outlook.at`).
  - Accessible Client Component `ContactForm` with `aria-invalid`, `aria-describedby`, and live-region feedback.
- **Store Settings & Business Facts (Phase 1 Completed)**:
  - Database-backed via `systemSettings` (`key = "store_details"`).
  - Server-only repository `src/lib/repositories/store-settings.ts` deduplicated per-request with React `cache()`.
  - Dedicated Admin UI `/admin/store` ("Geschäftsdaten").
  - Public integration across Layout, Footer, Home, `/kontakt`, `/ueber-uns`, `/impressum`, `/datenschutz`, and `LocalBusiness` JSON-LD.
- **Central SITE_URL Management (Phase 1 Completed)**:
  - `src/lib/site-config.ts` (`getSiteUrl()`, `absoluteUrl()`).
  - Integrated into root layout `metadataBase`, `sitemap.ts`, `robots.ts`, OpenGraph, Breadcrumbs, and JSON-LD.
- **Admin Authentication**: JWT session with `jose`, `timingSafeEqual` password check, `requireAdmin()` verifier on Server Actions, and `src/proxy.ts` middleware route protection.
- **Outfits & Lookbook Module**: Full Admin CRUD with multi-brand and multi-category assignment; public `/outfits` Lookbook with taxonomy filter bar.
- **Outfit Taxonomy (Categories & Groups)**: Admin CRUD for taxonomy groups and categories.
- **Collections & Mode Module**: Admin CRUD for seasonal collections; public `/mode` page.
- **Quality Gates**:
  - `npm run typecheck`: PASS (0 errors)
  - `npm run lint`: PASS (0 warnings/errors)
  - `npm run build`: PASS (35 static & dynamic routes compiled with Turbopack)

---

## 3. Brand Content Completeness Matrix (All 15 Approved Brands)

| # | Brand Name | Slug | Summary | Description | Verified Claims | SEO Title | SEO Desc | Logo | Title Image | Outfits | Content Readiness |
|---|---|---|---|---|---|---|---|---|---|---|---|
| 1 | Sorgenfri | `sorgenfri` | MISSING | MISSING | NONE | AUTO | AUTO | MISSING | YES | 1 Outfit | Content Pending |
| 2 | Lykka du Nord | `lykka-du-nord` | MISSING | MISSING | NONE | AUTO | AUTO | MISSING | MISSING | 0 Outfits | Content Pending |
| 3 | Seasalt | `seasalt` | MISSING | MISSING | NONE | AUTO | AUTO | MISSING | MISSING | 0 Outfits | Content Pending |
| 4 | Pretty Vacant | `pretty-vacant` | MISSING | MISSING | NONE | AUTO | AUTO | MISSING | MISSING | 0 Outfits | Content Pending |
| 5 | Cissi och Selma | `cissi-och-selma` | MISSING | MISSING | NONE | AUTO | AUTO | MISSING | MISSING | 0 Outfits | Content Pending |
| 6 | Danefae | `danefae` | MISSING | MISSING | NONE | AUTO | AUTO | MISSING | MISSING | 0 Outfits | Content Pending |
| 7 | LaLamour | `lalamour` | MISSING | MISSING | NONE | AUTO | AUTO | MISSING | MISSING | 0 Outfits | Content Pending |
| 8 | Nomads | `nomads` | MISSING | MISSING | NONE | AUTO | AUTO | MISSING | MISSING | 0 Outfits | Content Pending |
| 9 | Circus | `circus` | MISSING | MISSING | NONE | AUTO | AUTO | MISSING | MISSING | 0 Outfits | Content Pending |
| 10 | Angels | `angels` | MISSING | MISSING | NONE | AUTO | AUTO | MISSING | YES | 0 Outfits | Content Pending |
| 11 | Stehmann | `stehmann` | MISSING | MISSING | NONE | AUTO | AUTO | MISSING | MISSING | 0 Outfits | Content Pending |
| 12 | Emily van den Berg | `emily-van-den-berg` | MISSING | MISSING | NONE | AUTO | AUTO | MISSING | YES | 0 Outfits | Content Pending |
| 13 | Madness | `madness` | MISSING | MISSING | NONE | AUTO | AUTO | MISSING | YES | 0 Outfits | Content Pending |
| 14 | Heidekönigin | `heidekoenigin` | MISSING | MISSING | NONE | AUTO | AUTO | MISSING | MISSING | 0 Outfits | Content Pending |
| 15 | King Louie | `king-louie` | MISSING | MISSING | NONE | AUTO | AUTO | MISSING | YES | 0 Outfits | Content Pending |

---

## 4. Fixture Inventory Audit

- **Removed Dead Legacy Business Fixtures:**
  - `brands[]` (8 legacy hardcoded brand definitions removed)
  - `outfits[]` (4 legacy hardcoded outfit definitions removed)
  - `currentCollection` (hardcoded collection intro removed)
  - `getBrandBySlug()` and `getRelatedBrands()` (legacy helper functions removed)
- **Intentionally Retained Static Data in `src/content/fixtures/checkpot.ts`:**
  - `siteUrl`: Dynamically resolved via `getSiteUrl()`
  - `storeDetails`: Dynamically referenced via `DEFAULT_STORE_DETAILS`
  - `navigationLinks`: Central header navigation routes
  - `imagery`: Static photography assets for `/ueber-uns`, `/fair-trade`, and `/kontakt`
  - `seoRoutes`: Static route SEO metadata records for static pages

---

## 5. Partially Implemented / Gaps for Subsequent Phases

- **Legal Content Review (Phase 4)**: Removal of developer placeholder alert boxes from `/impressum` and `/datenschutz`.
- **Consent Management (Phase 4)**: Category-based consent manager (for future tracking/third-party scripts).
- **Legacy URL Redirects (Release Phase)**: Complete SEO redirect mapping for historical Checkpot URLs in `next.config.ts`.
- **Email Delivery Verification (Phase 2.5 Deferred)**: Controlled test email once customer provisions `RESEND_API_KEY`.

---

## 6. Launch Blockers (P0)

1. **Visible Developer Placeholders**: Prominent alert boxes with "Hinweis für die Inhaberin" appear on public `/impressum` and `/datenschutz` (Scheduled for Phase 4).
2. **Vercel Deployment Environment Configuration**: Vercel environment variables (`DATABASE_URL`, `BLOB_READ_WRITE_TOKEN`, `AUTH_SECRET`, `ADMIN_PASSWORD`, `RESEND_API_KEY`, `SITE_URL`) must be configured and verified in Frankfurt (`fra1`).

---

## 7. Verification Summary

```text
> npm run typecheck
tsc --noEmit -> Exit code 0 (PASS, 0 errors)

> npm run lint
eslint . -> Exit code 0 (PASS, 0 warnings/errors)

> npm run build
next build -> Exit code 0 (PASS, 35 static & dynamic routes compiled)
```
