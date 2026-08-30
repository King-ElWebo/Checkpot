# Checkpot Current Technical Status

## Last audited & updated
- Date: 2026-08-30
- Commit SHA: Phase 1 (`85adcc4`), Phase 2 (`02e73e6`), Phase 3A (`dfce5ed`), Phase 3B (`0e56cb3`), Phase 4 (`15c0b0b`), Phase 5 (`948098f`), Phase 6 (`e8108c5`), Phase 7A Content Structure & Taxonomy Complete (local)
- Branch: `main` (synchronized baseline with `origin/main` at `948098f`)

---

## 1. Executive Summary

Phases 1 through 7A of the backend completion are **COMPLETE**:
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
8. **Release Preparation, Git Push & Legacy SEO Migration (Phase 5)**:
   - Synchronized previous commits to remote repository (`origin/main` at `948098f`).
   - Audited all verified historical URLs from GSC and GA4 exports.
   - Configured 21 verified permanent `301` redirects in `next.config.ts` (handling historical `/home/*`, `/ueber_uns/*`, `/kontakt/*`, `/mode/*`, and `/marken/*` aliases).
   - Configured 8 explicit `410 Gone` responses in `src/proxy.ts` for permanently obsolete URLs (`zilch-wien`, `adini-wien`, `happy-rainy-days-wien`, `hatley`, `thought-braintree-wien`, `herbstwinter-kollektion-2023-`, `herbst-winter-2018`, `schrankcheck`).
   - Created SEO source of truth artifact: `seo_analysis/legacy_url_migration.csv`.
   - Created customer checklist artifact: `docs/LEGAL-INPUTS-NEEDED.md`.
9. **CMS Readiness, Data Integrity & Admin Workflow QA (Phase 6)**:
   - Audited all 11 database tables in Neon PostgreSQL: 0 foreign key violations, 0 dangling join rows.
   - Verified end-to-end CRUD, atomic relation persistence, delete safety, and targeted cache revalidation across Store Settings, Brands, Media, Outfits, Collections, and Taxonomy.
   - Created full CMS readiness report: `docs/CMS-READINESS.md`.
10. **Content Structure, Taxonomy & Existing Asset Assignment (Phase 7A)**:
   - Created 3-group outfit taxonomy in Neon (`Saison`, `Stil`, `Farbwelt`) with 11 clear categories.
   - Categorized all 6 existing outfits with evidence-based seasonal, style, and colorway tags.
   - Connected evidenced Outfit $\rightarrow$ Brand relationships (`Sorgenfri`, `Zilch`).
   - Resolved media metadata gaps: 100% alt texts on photographic assets, focal points initialized to `50% 50%`.
   - Generated `docs/CONTENT-MAP.md` mapping taxonomy, outfits, collections, and brand assets.
   - Updated `docs/CONTENT-BACKLOG.md` for editorial brand content population (Phase 7B).

---

## 2. Release Readiness Classification

| Area | Status | Notes / Next Steps |
|---|---|---|
| **Code Architecture** | **READY** | All routes, components, Server Actions, and repositories typed and validated. |
| **Database & Migrations** | **READY** | Drizzle migrations (`0000` through `0004`) applied to Neon PostgreSQL. Integrity verified. |
| **Outfit Taxonomy & Filter**| **READY** | 3 groups, 11 categories in DB; OR within group, AND across groups verified on `/outfits`. |
| **Admin CMS & Workflows** | **READY** | Full CRUD, relation persistence, delete safety, and revalidation operational. |
| **Security & Rate Limiting** | **READY** | Durable login and contact rate limiters active with atomic SQL upserts. |
| **SEO & URL Migration** | **READY** | 21 redirects (301) and 8 gone routes (410) active; sitemap & robots verified. |
| **Consent Management** | **READY** | Audited: no non-essential cookies, trackers or third-party embeds. Banner not required. |
| **Environment Configuration** | **PARTIAL** | Local `.env.local` configured; production variables must be added in Vercel dashboard. |
| **Email Delivery (Phase 2.5)** | **DEFERRED** | Awaiting customer provisioning of `RESEND_API_KEY` for controlled verification. |
| **Legal Content** | **PARTIAL** | Technically clean; awaiting customer review and factual inputs (`docs/LEGAL-INPUTS-NEEDED.md`). |
| **Editorial Brand Content**| **PARTIAL** | 15 active brands present in DB; marketing text/claims to be populated by customer in Admin (`docs/CONTENT-BACKLOG.md`). |
| **Frontend Design** | **FROZEN** | Design system frozen for backend delivery; no visual regressions introduced. |

---

## 3. Legacy URL Migration Inventory (`seo_analysis/legacy_url_migration.csv`)

| Old Path | Action | Target Path | Rationale / Evidence |
|---|---|---|---|
| `/team` | 301 | `/ueber-uns` | Core consolidation to about page |
| `/brands` | 301 | `/marken` | Core consolidation to brand overview |
| `/home` | 301 | `/` | Legacy homepage alias |
| `/home/checkpot_damenmoden_1130_wien_` | 301 | `/` | Legacy homepage long slug alias |
| `/ueber_uns` | 301 | `/ueber-uns` | Underscore slug alias |
| `/ueber_uns/unser_team` | 301 | `/ueber-uns` | Subpage consolidated into about |
| `/ueber_uns/fotos-vom-geschaeft` | 301 | `/ueber-uns` | Subpage consolidated into about |
| `/kontakt/kontakt` | 301 | `/kontakt` | Redundant nested contact slug |
| `/kontakt/impressum` | 301 | `/impressum` | Nested impressum alias |
| `/kontakt/datenschutz` | 301 | `/datenschutz` | Nested datenschutz alias |
| `/mode/unsere-marken` | 301 | `/marken` | Legacy brand link under mode |
| `/mode/fair_trade` | 301 | `/fair-trade` | Underscore slug alias |
| `/mode/vorschau-auf-herbst-winter-2025` | 301 | `/mode` | Seasonal archive consolidated |
| `/mode/vorschau-auf-fruehjahr-sommer-2026` | 301 | `/mode` | Seasonal archive consolidated |
| `/mode/vorschau-auf-fruehling-sommer-2025` | 301 | `/mode` | Seasonal archive consolidated |
| `/marken/king-louie-wien` | 301 | `/marken/king-louie` | Brand slug normalized |
| `/marken/madness-wien` | 301 | `/marken/madness` | Brand slug normalized |
| `/marken/angels-wien` | 301 | `/marken/angels` | Brand slug normalized |
| `/marken/sorgenfri-wien` | 301 | `/marken/sorgenfri` | Brand slug normalized |
| `/marken/emily-van-den-bergh-wien` | 301 | `/marken/emily-van-den-berg` | Brand slug normalized (historical spelling with 'h') |
| `/marken/nomads-clothing-` | 301 | `/marken/nomads` | Trailing hyphen slug normalized |
| `/marken/zilch-wien` | 410 | *(none)* | Inactive legacy brand permanently removed |
| `/marken/adini-wien` | 410 | *(none)* | Inactive legacy brand permanently removed |
| `/marken/happy-rainy-days-wien` | 410 | *(none)* | Inactive legacy brand permanently removed |
| `/marken/hatley` | 410 | *(none)* | Inactive legacy brand permanently removed |
| `/marken/thought-braintree-wien` | 410 | *(none)* | Inactive legacy brand permanently removed |
| `/mode/herbstwinter-kollektion-2023-` | 410 | *(none)* | Obsolete 2023 seasonal archive |
| `/mode/herbst-winter-2018` | 410 | *(none)* | Obsolete 2018 seasonal archive |
| `/schrankcheck-alt/schrankcheck` | 410 | *(none)* | Discontinued service |

---

## 4. Production Environment Variables Matrix

| Variable | Required for Build? | Required at Runtime? | Server Only? | Purpose | Current `.env.example` Status |
|---|---|---|---|---|---|
| `DATABASE_URL` | Yes (for static SSG paths) | Yes | Yes | Neon PostgreSQL pooled connection string | Documented |
| `SITE_URL` | No (has fallback) | Yes | Yes | Central canonical domain (`https://checkpot-hietzing.at`) | Documented |
| `AUTH_SECRET` | No (fails on auth) | Yes (for admin) | Yes | 32+ char secret for signing HS256 admin JWT sessions | Documented |
| `ADMIN_PASSWORD` | No (fails on login) | Yes (for admin) | Yes | Passphrase for single-admin bootstrap login | Documented |
| `BLOB_READ_WRITE_TOKEN`| No | Yes (for media uploads) | Yes | Read/write token for Vercel Blob storage | Documented |
| `RESEND_API_KEY` | No (build succeeds) | Yes (for contact form) | Yes | API key for transactional email dispatch via Resend | Documented |
| `RATE_LIMIT_SECRET` | No (falls back to `AUTH_SECRET`) | Optional | Yes | Dedicated HMAC secret for hashing rate-limit subject IPs | Documented |

---

## 5. Phase 2.5 Pending Checklist (Email Delivery Verification)

- [ ] Customer provisions `RESEND_API_KEY` in Vercel dashboard.
- [ ] Verify `checkpot-hietzing.at` sender domain in Resend dashboard (DNS TXT/MX records).
- [ ] Trigger one real test submission via `/kontakt`.
- [ ] Confirm email received at `christa.hausmair@outlook.at`.
- [ ] Confirm `Reply-To` header correctly routes replies to the visitor's email address.

---

## 6. Verification Summary

```text
> npm run typecheck
tsc --noEmit -> Exit code 0 (PASS, 0 errors)

> npm run lint
eslint . -> Exit code 0 (PASS, 0 warnings/errors)

> npm run build
next build -> Exit code 0 (PASS, 35 static & dynamic routes compiled with Turbopack)
```
