# Checkpot Current Technical Status

## Last audited & updated
- Date: 2026-08-29
- Commit SHA: Phase 1 (`85adcc4`), Phase 2 (`02e73e6`), Phase 3A Brand Reconciliation & Media Transparency Fixes
- Branch: `main`

---

## 1. Executive Summary

Phases 1, 2, and 3A of the backend completion are **COMPLETE**:
1. **Central Store Settings & Single Source of Truth (Phase 1)**: Business facts are stored in Neon (`system_settings` table, `key = 'store_details'`) and managed via `/admin/store` ("Geschäftsdaten").
2. **Central SITE_URL Configuration (Phase 1)**: Production domain assumptions are decoupled from fixtures. `getSiteUrl()` normalizes `process.env.SITE_URL` with fallback to `https://checkpot-hietzing.at`, driving root `metadataBase`, `sitemap.ts`, `robots.ts`, OpenGraph URLs, and JSON-LD structured data.
3. **Contact Form Backend & Email Delivery (Phase 2)**: Submissions are processed by a dedicated Server Action with Zod validation (`src/lib/validations/contact.ts`), honeypot spam filtering, lightweight rate limiting, and email dispatch via Resend (`website@checkpot-hietzing.at` -> `christa.hausmair@outlook.at` with visitor `replyTo`). Zero inquiry data is persisted to Neon.
4. **Media Upload & PNG Transparency Fix (Phase 3A)**: Client-side compression in `src/lib/image-compression.ts` no longer flattens transparent PNG logos to white JPEGs. PNG images maintain their native `image/png` MIME type and full alpha transparency. SVG upload is intentionally unsupported on the server for security hardening; UI recommendations now clearly specify `"PNG mit transparentem Hintergrund"`.
5. **Brand Assortment Reconciliation (Phase 3A)**: Reconciled the Neon database against the 15 approved Checkpot brands with defined sort order (10–150). Inactive legacy brands (`Zilch`, `Happy Rainy Days`, `Adini`) are deactivated (`active = false`) without deleting records or outfit relations.

Remaining items for subsequent phases:
- **Phase 3B**: Brand SEO metadata connection (`brand.seoMetadata` in `generateMetadata`), curated related brands, and legacy URL redirect/410 inventory.
- **Phase 4**: Legal cleanup (removal of developer placeholder boxes on `/impressum` and `/datenschutz`), login rate limiting, consent management.

---

## 2. Working (Fully Implemented & DB-Connected)

- **Brand Assortment & Public Brand Routes (Phase 3A Completed)**:
  - 15 active approved brands with normalized slugs and sort orders in Neon PostgreSQL.
  - Legacy brands (`Adini`, `Zilch`, `Happy Rainy Days`) deactivated cleanly (`active = false`), preserving outfit relationships and database IDs.
  - Public `/marken` grid renders all 15 active brands with responsive featured layouts.
  - Public `/marken/[slug]` generates static pages for all 15 active brands with defensive fallbacks for missing logos, images, descriptions, or outfits.
  - Homepage `BrandBookshelf` dynamically renders active brands with fallback typographic branding and logo isolation.
  - Dynamic `sitemap.ts` includes all 15 active brand detail URLs and excludes inactive brands.
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

## 3. Brand Content Completeness Matrix (Phase 3A)

| # | Brand Name | Slug | Sort | Active | Logo | Title Image | Summary / Desc | Outfits | Assortment Status |
|---|---|---|---|---|---|---|---|---|---|
| 1 | Sorgenfri | `sorgenfri` | 10 | Yes | MISSING | YES | MISSING | 1 Outfit | Content Incomplete |
| 2 | Lykka du Nord | `lykka-du-nord` | 20 | Yes | MISSING | MISSING | MISSING | 0 Outfits | Content Incomplete |
| 3 | Seasalt | `seasalt` | 30 | Yes | MISSING | MISSING | MISSING | 0 Outfits | Content Incomplete |
| 4 | Pretty Vacant | `pretty-vacant` | 40 | Yes | MISSING | MISSING | MISSING | 0 Outfits | Content Incomplete |
| 5 | Cissi och Selma | `cissi-och-selma` | 50 | Yes | MISSING | MISSING | MISSING | 0 Outfits | Content Incomplete |
| 6 | Danefae | `danefae` | 60 | Yes | MISSING | MISSING | MISSING | 0 Outfits | Content Incomplete |
| 7 | LaLamour | `lalamour` | 70 | Yes | MISSING | MISSING | MISSING | 0 Outfits | Content Incomplete |
| 8 | Nomads | `nomads` | 80 | Yes | MISSING | MISSING | MISSING | 0 Outfits | Content Incomplete |
| 9 | Circus | `circus` | 90 | Yes | MISSING | MISSING | MISSING | 0 Outfits | Content Incomplete |
| 10 | Angels | `angels` | 100 | Yes | MISSING | YES | MISSING | 0 Outfits | Content Incomplete |
| 11 | Stehmann | `stehmann` | 110 | Yes | MISSING | MISSING | MISSING | 0 Outfits | Content Incomplete |
| 12 | Emily van den Berg | `emily-van-den-berg` | 120 | Yes | MISSING | YES | MISSING | 0 Outfits | Content Incomplete |
| 13 | Madness | `madness` | 130 | Yes | MISSING | YES | MISSING | 0 Outfits | Content Incomplete |
| 14 | Heidekönigin | `heidekoenigin` | 140 | Yes | MISSING | MISSING | MISSING | 0 Outfits | Content Incomplete |
| 15 | King Louie | `king-louie` | 150 | Yes | MISSING | YES | MISSING | 0 Outfits | Content Incomplete |
| - | *Zilch (Legacy)* | `zilch` | 1 | No | NONE | YES | NONE | 1 Outfit | Deactivated |
| - | *Happy Rainy Days (Legacy)* | `happy-rainy-days` | 5 | No | NONE | YES | NONE | 0 Outfits | Deactivated |
| - | *Adini (Legacy)* | `adini` | 0 | No | NONE | YES | NONE | 0 Outfits | Deactivated |

---

## 4. Partially Implemented / Gaps for Subsequent Phases

- **Brand SEO & Claims (Phase 3B)**: `brands.seoMetadata` and `brands.verifiedClaims` exist in the database schema, but are not yet wired to `generateMetadata` or public brand pages.
- **Related Brands (Phase 3B)**: `/marken/[slug]` generates related brands by taking a slice of other active brands rather than explicit relationships.
- **Legacy URL Redirects (Phase 3B)**: Complete SEO redirect mapping for historical Checkpot URLs.
- **Legal Content Review (Phase 4)**: Removal of developer placeholder alert boxes from `/impressum` and `/datenschutz`.
- **Consent Management (Phase 4)**: Category-based consent manager (for future tracking/third-party scripts).

---

## 5. Launch Blockers (P0)

1. **Visible Developer Placeholders**: Prominent alert boxes with "Hinweis für die Inhaberin" appear on public `/impressum` and `/datenschutz` (Scheduled for Phase 4).
2. **Vercel Deployment Environment Configuration**: Vercel environment variables (`DATABASE_URL`, `BLOB_READ_WRITE_TOKEN`, `AUTH_SECRET`, `ADMIN_PASSWORD`, `RESEND_API_KEY`, `SITE_URL`) must be configured and verified in Frankfurt (`fra1`).

---

## 6. Verification Summary

```text
> npm run typecheck
tsc --noEmit -> Exit code 0 (PASS, 0 errors)

> npm run lint
eslint . -> Exit code 0 (PASS, 0 warnings/errors)

> npm run build
next build -> Exit code 0 (PASS, 35 static & dynamic routes compiled)
```
