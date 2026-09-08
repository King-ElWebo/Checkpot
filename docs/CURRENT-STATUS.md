# Checkpot Current Technical Status

## Last audited & updated
- Date: 2026-09-08 (Pre-Launch Repository & Documentation Hygiene Pass)
- Status: **PRE-LAUNCH / FRONTEND FROZEN FOR LAUNCH**
- Database: Neon PostgreSQL (12 tables, 15 active partner brands, 27 active outfits, 43 media assets)
- Baseline: Technical Pre-Launch Passes 1 & 2 complete; frontend visual polish complete & design frozen

---

## 1. Executive Summary

Phases 1 through 8 (Backend, Data Integrity, Brand Population, Security Hardening) as well as Technical Pre-Launch Passes 1 and 2 and Frontend Visual Polish are **COMPLETE**:

1. **Pre-Launch Passes 1 & 2 Complete**: Technical verification, code hygiene, runtime checks, and redirect/routing integrity verified.
2. **Frontend Visual Polish Complete & Frozen for Launch**: Mobile and desktop responsiveness, typography, and layout refinements accepted; public frontend is strictly frozen for launch.
3. **Assortment & Content Baseline**: Exactly 15 active partner brands with full verified German editorial text, claims, and SEO metadata; exactly 27 active outfits and 43 media assets managed in Neon PostgreSQL.
4. **Central Store Settings & Single Source of Truth**: Business facts are stored in Neon (`system_settings` table, `key = 'store_details'`) and managed via `/admin/store` ("Geschäftsdaten").
5. **Central SITE_URL Configuration**: Production domain assumptions decoupled from fixtures. `getSiteUrl()` normalizes `process.env.SITE_URL` with fallback to `https://checkpot-hietzing.at`, driving root `metadataBase`, `sitemap.ts`, `robots.ts`, OpenGraph URLs, and JSON-LD structured data.
6. **Contact Form Backend & Rate Limiting**: Submissions processed by dedicated Server Action with Zod validation (`src/lib/validations/contact.ts`), honeypot spam filtering, lightweight rate limiting, and email dispatch via Resend (`website@checkpot-hietzing.at` -> `christa.hausmair@outlook.at` with visitor `replyTo`). Zero inquiry data persisted to Neon.
7. **Security Hardening & Privacy**: Durable, concurrency-safe abuse protection in Neon PostgreSQL (`rate_limits` table with atomic SQL upserts). Pseudonymous privacy: subjects hashed via `HMAC-SHA256(RATE_LIMIT_SECRET, clientIp)` — zero raw IP addresses persisted or logged.
8. **Consent Management**: Built-in category-based consent manager active. Google Consent Mode v2 (Basic Mode) strictly blocks GA4 tags prior to explicit consent. Google Maps embedded map on `/kontakt` strictly consent-gated (local placeholder before consent, dynamic unmount on withdrawal). First-party `checkpot_consent` cookie (180 days, versioned) and permanent footer settings modal.
9. **Legacy SEO Migration**: 22 verified permanent `301` redirects in `next.config.ts`, 8 explicit `410 Gone` responses in `src/proxy.ts` for permanently obsolete URLs.

---

## 2. Release Readiness Classification

| Area | Status | Notes / Next Steps |
|---|---|---|
| **Frontend Design** | **FROZEN FOR LAUNCH** | Visual polish complete; desktop and mobile layouts accepted. Design strictly frozen. |
| **Backend & Application Logic** | **STABLE / FEATURE COMPLETE** | Complete, typed, validated, and audited. Iterative adjustments allowed. Acceptance report in `docs/BACKEND-ACCEPTANCE.md`. |
| **Database & Migrations** | **STABLE** | Neon PostgreSQL schema integrity verified (12 tables, 15 active partner brands, 27 active outfits, 43 media assets). |
| **Admin CMS & Workflows** | **STABLE** | Full CRUD, relation persistence, delete safety, and cache revalidation operational. |
| **Security & Rate Limiting** | **STABLE** | Durable login and contact rate limiters active with atomic SQL upserts. |
| **Consent Management** | **LIVE / BASIC MODE** | Built-in category-based consent manager active. Google Consent Mode v2 (Basic Mode) strictly blocks GA4 scripts before explicit consent. Google Maps iframe on `/kontakt` strictly gated before explicit consent. Dynamic unmount on withdrawal. First-party `checkpot_consent` cookie. |
| **Editorial Brand Content**| **15 / 15 LIVE** | 100% of the 15 active partner brands have fact-checked text, claims, and SEO metadata live in Neon DB. |
| **Active Outfit Inventory**| **27 ACTIVE LOOKS** | 27 active outfits live in database across collections and taxonomy categories. |
| **Legal Content & Impressum** | **RESOLVED & INTEGRATED** | Owner form returned 08.09.2026; confirmed UID (ATU64656223), GISA (26767192), WKO Wien, and MBA 13/14 integrated into `/impressum`. |
| **Email Delivery (Resend)** | **PENDING SETUP & TEST** | Awaiting production `RESEND_API_KEY` configuration and live end-to-end delivery test. |
| **Hosting Migration** | **PENDING** | Moving away from temporary Vercel hosting to target production hosting environment. |
| **Production Domain Cutover** | **PENDING** | Final DNS cutover to `checkpot-hietzing.at` pending after hosting migration. |
| **Live Smoke Test** | **PENDING** | Final production smoke test pending following deployment cutover. |

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
| `/marken/emily-van-den-berg` | 301 | `/marken/emily-van-den-bergh` | Brand spelling normalized with h |
| `/marken/emily-van-den-bergh-wien` | 301 | `/marken/emily-van-den-bergh` | Brand slug normalized |
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
| `BLOB_READ_WRITE_TOKEN`| No | Yes (for media uploads) | Yes | Read/write token for media blob storage | Documented |
| `RESEND_API_KEY` | No (build succeeds) | Yes (for contact form) | Yes | API key for transactional email dispatch via Resend | Documented |
| `RATE_LIMIT_SECRET` | No (falls back to `AUTH_SECRET`) | Optional | Yes | Dedicated HMAC secret for hashing rate-limit subject IPs | Documented |
| `NEXT_PUBLIC_GA_MEASUREMENT_ID` | No (build succeeds) | Optional (for GA4) | No (client/public) | Google Analytics 4 Measurement ID (Basic Mode v2) | Documented |

---

## 5. Verification Summary

```text
> npm run typecheck
tsc --noEmit -> Exit code 0 (PASS, 0 errors)

> npm run lint
eslint . -> Exit code 0 (PASS, 0 warnings/errors)

> npm run build
next build -> Exit code 0 (PASS, 35 static & dynamic routes compiled with Turbopack)
```
