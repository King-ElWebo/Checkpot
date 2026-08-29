# Checkpot Current Technical Status

## Last audited & updated
- Date: 2026-08-29
- Commit SHA: Phase 1 (`85adcc4`), Phase 2 (`02e73e6`), Phase 3A (`dfce5ed`), Phase 3B (`0e56cb3`), Phase 4 Security Hardening & Release Backend Preparation completed
- Branch: `main`

---

## 1. Executive Summary

Phases 1, 2, 3A, 3B, and 4 of the backend completion are **COMPLETE**:
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
7. **Security Hardening, Privacy Decision & Legal Cleanup (Phase 4)**:
   - Durable, concurrency-safe abuse protection implemented in Neon PostgreSQL (`rate_limits` table with atomic SQL upsert).
   - Applied durable rate limiting to Admin login (brute-force protection: max 5 failed attempts / 15 min window) and public contact form (max 5 submissions / 10 min window).
   - Pseudonymous privacy: subjects are hashed via `HMAC-SHA256(RATE_LIMIT_SECRET, clientIp)` — zero raw IP addresses are persisted or logged.
   - Privacy & Consent Audit: Verified that no tracking scripts, pixels, non-essential cookies, or third-party embeds exist. **Consent manager not currently required by implemented public functionality.**
   - Legal Cleanup: Removed developer placeholder callout boxes from `/impressum` and `/datenschutz`. Legal pages are technically clean but pending final customer/legal review.
   - Copy Correction: Removed unsupported geographic claim *"europäische Modelabels"* from `/marken` metadata and fixtures.

Remaining items for subsequent phases:
- **Phase 2.5 (Deferred)**: Controlled Resend inbox delivery verification (upon customer API key provisioning).
- **Release Phase**: Legacy URL redirect & 410 mapping inventory in `next.config.ts`, Vercel production deployment in Frankfurt (`fra1`).

---

## 2. Working (Fully Implemented & DB-Connected)

- **Abuse Protection & Rate Limiting (Phase 4 Completed)**:
  - Server-only durable rate limiter in [`src/lib/rate-limiter.ts`](file:///c:/Users/wilkb/Desktop/Projekte/checkpot/website/src/lib/rate-limiter.ts).
  - Backed by Neon PostgreSQL `rate_limits` table (`drizzle/0004_cool_brother_voodoo.sql` applied).
  - Concurrency-safe atomic SQL `ON CONFLICT DO UPDATE SET request_count = request_count + 1`.
  - Privacy-preserving `HMAC-SHA256` hashing of client identifiers with fallback to `AUTH_SECRET`.
  - Admin login brute-force blocker (429 status code on 5+ failed attempts, automatically reset on valid authentication).
  - Public contact form rate limiter (friendly Austrian German message on 5+ requests in 10 minutes).
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
  - Server Action `sendContactMessageAction` with Zod validation, honeypot protection, durable rate limiting, and zero DB persistence.
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

## 3. Privacy & Third-Party Service Technical Inventory

| Service / Integration | Interaction Layer | Data Transmitted | Client Cookies / Storage Set? | Consent Required? |
|---|---|---|---|---|
| **Vercel Hosting** | Server Infrastructure | HTTP request metadata (IP, User-Agent, Path) processed for routing | None (Zero non-essential cookies) | No (Strictly necessary hosting) |
| **Neon PostgreSQL** | Server Backend | Store settings, brand/outfit content, pseudonymous rate-limit hashes | None | No (Internal server storage) |
| **Vercel Blob** | Server Upload / CDN | Uploaded media files (PNG, JPG, WebP) served via static CDN URLs | None | No (Media delivery) |
| **Resend** | Server Action | Contact form payload (`name`, `email`, `phone`, `message`, `timestamp`) | None | No (User-initiated contact request) |
| **WhatsApp Outbound Link** | Client User Click | User navigates to `https://wa.me/43...` upon clicking link | None prior to click | No (External hyperlink) |
| **Google Maps Outbound Link** | Client User Click | User navigates to Google Maps route planning upon clicking link | None prior to click | No (External hyperlink) |
| **Next.js Google Fonts** | Build-time self-hosting | Fonts (`Outfit`, `Inter`) downloaded during build; served locally | None | No (Zero external font requests) |

**Consent Decision:** Consent manager not currently required by implemented public functionality.

---

## 4. Production Environment Variables Matrix

| Variable | Required for Build? | Required at Runtime? | Server Only? | Purpose | Current `.env.example` Status |
|---|---|---|---|---|---|
| `DATABASE_URL` | Yes (for static SSG paths) | Yes | Yes | Neon PostgreSQL connection string (pooled) | Documented |
| `SITE_URL` | No (has fallback) | Yes (recommended) | Yes | Central canonical domain (`https://checkpot-hietzing.at`) | Documented |
| `AUTH_SECRET` | No (fails on auth) | Yes (for admin) | Yes | 32+ char secret for signing HS256 admin JWT sessions | Documented |
| `ADMIN_PASSWORD` | No (fails on login) | Yes (for admin) | Yes | Passphrase for single-admin bootstrap login | Documented |
| `BLOB_READ_WRITE_TOKEN`| No | Yes (for media uploads) | Yes | Read/write token for Vercel Blob storage | Documented |
| `RESEND_API_KEY` | No (build succeeds) | Yes (for contact form) | Yes | API key for transactional email dispatch via Resend | Documented |
| `RATE_LIMIT_SECRET` | No (falls back to `AUTH_SECRET`) | Optional | Yes | Dedicated HMAC secret for hashing rate-limit subject IPs | Documented |

---

## 5. Legal Page Technical Status

- **`/impressum`**: Developer callout box removed. Layout and business details rendered from DB (`store_details`). **Status: TECHNICALLY CLEAN BUT LEGAL REVIEW PENDING (Customer must provide/verify UID, Firmenbuch, etc.).**
- **`/datenschutz`**: Developer callout box removed. Layout and contact references rendered from DB (`store_details`). **Status: TECHNICALLY CLEAN BUT LEGAL REVIEW PENDING (Customer must review against final third-party inventory).**

---

## 6. Brand Content Completeness Matrix (All 15 Approved Brands)

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

## 7. Quality Gates Verification

```text
> npm run typecheck
tsc --noEmit -> Exit code 0 (PASS, 0 errors)

> npm run lint
eslint . -> Exit code 0 (PASS, 0 warnings/errors)

> npm run build
next build -> Exit code 0 (PASS, 35 static & dynamic routes compiled with Turbopack)
```
