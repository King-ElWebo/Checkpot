# Technical Survey Report: Platform Dependencies, Environment, Routing, SEO & Cutover Architecture

**Agent:** Platform, SEO & Routing Explorer  
**Working Directory:** `.agents/explorer_survey_platform`  
**Date:** 2026-09-21T15:36:00Z  
**Target:** Checkpot Next.js 16 Cloudflare Workers Migration  

---

## 1. Executive Summary

This report delivers an exhaustive technical survey of the platform dependencies, runtime environment configuration, routing, SEO mechanics, and cutover/rollback architecture for migrating the Checkpot Next.js 16 application from Vercel to Cloudflare Workers with Cloudflare R2.

### Key Discoveries & Positive Findings
1. **Zero Implicit Vercel Runtime Lock-in:** The codebase contains **zero** runtime dependencies on Vercel system environment variables (`VERCEL_URL`, `VERCEL_ENV`, `VERCEL_GIT_*`). All absolute canonicals, sitemaps, OpenGraph metadata, and JSON-LD structured data rely on a central, environment-backed helper (`getSiteUrl()` in `src/lib/site-config.ts`), which defaults cleanly to `https://checkpot-hietzing.at`.
2. **Clean Analytics Decoupling:** `@vercel/analytics` and `@vercel/speed-insights` are isolated in a single client component (`src/components/public/consent/vercel-analytics.tsx`). Retiring them does **not** degrade the `ConsentManager`, Google Analytics 4 integration, or Google Consent Mode v2 Basic gating.
3. **Pure HTTP Database & Email Communications:** Neon PostgreSQL connectivity utilizes `@neondatabase/serverless` over HTTP (`drizzle-orm/neon-http`), and Resend email dispatch uses standard `fetch`. Neither requires Node.js TCP socket emulation or long-lived server daemon state.
4. **Durable, Serverless Rate Limiting:** The contact form and admin login rate limiters (`src/lib/rate-limiter.ts`) are backed by atomic UPSERT operations in Neon PostgreSQL (`rateLimits` table), guaranteeing instant distributed consistency across Cloudflare edge worker instances without requiring Redis or Upstash.
5. **Clean Routing Separation:** The 22 permanent HTTP 301 redirects in `next.config.ts` and the 8 HTTP 410 Gone responses in `src/proxy.ts` are completely disjoint sets, ensuring seamless preservation of search engine index equity.

### Action Items & Pre-Migration Security Warnings
- **Secret Protection:** `.gitignore` currently ignores `.env*` files but lacks explicit ignores for `.dev.vars`, `.dev.vars.*`, and `.wrangler/`. These must be added immediately to prevent secret leakage during local `wrangler dev` testing.
- **Hardcoded Media References:** Four public pages (`ueber-uns`, `kontakt`, `page.tsx`) contain hardcoded Vercel Blob URLs for the boutique storefront image (`https://hgrtkumqrh0cwc66.public.blob.vercel-storage.com/...`). `next.config.ts` remote patterns must keep `*.public.blob.vercel-storage.com` until these assets are replicated to R2 and updated.

---

## 2. Platform Dependencies Audit

### 2.1 Usage Analysis of `@vercel/analytics` and `@vercel/speed-insights`

The repository references Vercel's analytics packages exclusively in:
- `package.json` lines 17 & 19:
  - `"@vercel/analytics": "^2.0.1"`
  - `"@vercel/speed-insights": "^2.0.0"`
- `src/components/public/consent/vercel-analytics.tsx`:
  ```tsx
  import { Analytics } from "@vercel/analytics/next";
  import { SpeedInsights } from "@vercel/speed-insights/next";
  import { useConsent } from "./consent-context";

  export function VercelAnalytics() {
    const { consent } = useConsent();
    if (!consent?.analytics) {
      return null;
    }
    return (
      <>
        <Analytics />
        <SpeedInsights />
      </>
    );
  }
  ```
- `src/components/public/consent/consent-manager.tsx`:
  - Line 8: `import { VercelAnalytics } from "./vercel-analytics";`
  - Line 22: `<VercelAnalytics />` mounted as sibling to `<GoogleAnalytics />`.

### 2.2 Retirement Strategy: Keeping Privacy & Consent Intact

The application's privacy consent architecture follows a multi-tiered design:
1. **Consent Context & Cookie:** `src/lib/consent/types.ts` defines `ConsentState` with `necessary: true`, `analytics: boolean`, and `externalMedia: boolean`. Cookies are serialized as `checkpot_consent`.
2. **Google Consent Mode v2 Basic:** In `src/lib/consent/ga.ts`, consent state initializes with `analytics_storage: 'denied'`. When `analytics` consent is granted, `gtag("consent", "update", { analytics_storage: "granted" })` is dispatched. If consent is revoked, `cleanupGoogleAnalyticsCookies()` clears `_ga`, `_ga_*`, `_gid`, and `_gat`.
3. **Google Analytics Gating:** `src/components/public/consent/google-analytics.tsx` only loads `https://www.googletagmanager.com/gtag/js?id=...` when `consent?.analytics` is true and `NEXT_PUBLIC_GA_MEASUREMENT_ID` is set.

#### Implementation Steps for Retiring Vercel Analytics:
1. **Remove Component / Mount:**
   - Delete `src/components/public/consent/vercel-analytics.tsx`.
   - In `src/components/public/consent/consent-manager.tsx`, remove `import { VercelAnalytics }` and `<VercelAnalytics />`.
2. **Clean Dependencies:**
   - Run `npm uninstall @vercel/analytics @vercel/speed-insights`.
3. **Preserve `analytics` Category:**
   - The user-facing "Statistik / Analyse" category remains active solely for Google Analytics 4 (and any future Cloudflare Web Analytics if desired).
4. **Update UI Strings:**
   - `src/components/public/consent/consent-banner.tsx` (line 28): Change `"(Google Analytics & Vercel Analytics)"` to `"(Google Analytics)"`.
   - `src/components/public/consent/consent-settings-dialog.tsx` (lines 124 & 132): Change `"Google Analytics 4, Vercel Analytics & Speed Insights"` to `"Google Analytics 4"`.
5. **Update Privacy Policy (`src/app/(public)/datenschutz/page.tsx`):**
   - Line 171: Update Section 4 (Webhosting) to note the Cloudflare edge network infrastructure.
   - Lines 228–245: In Section 5 (Webanalyse & Performance), remove the subsection for `Vercel Web Analytics & Speed Insights` while retaining the `Google Analytics 4` disclosure.

### 2.3 Comprehensive Codebase Search for Vercel Artifacts

| Query Pattern | Matches Found | Evaluation & Action Required |
|---|---|---|
| `process.env.VERCEL_*` | 0 occurrences | Zero implicit runtime coupling. Complete autonomy from Vercel platform environment. |
| `@vercel/blob` | `src/app/admin/media/actions.ts:3` | To be migrated to Cloudflare R2 binding (`MEDIA_BUCKET`) by storage specialist. |
| `*.public.blob.vercel-storage.com` | `next.config.ts:9` + 4 page files | Retain in `images.remotePatterns` during transition. Copy underlying assets to R2. |
| `.vercel/` | `.gitignore:32` | Keep in `.gitignore` to avoid pushing local Vercel CLI metadata. |
| Legal / Docs mentions | `LEGAL-INPUTS-NEEDED.md`, `PROJECT-SPEC.md`, `CMS-READINESS.md` | Historical documentation; no runtime impact. |

### 2.4 Hardcoded Vercel Blob Assets in Public Pages

Four public pages directly reference the boutique entrance photography hosted on Vercel Blob:
1. `src/app/(public)/page.tsx` (Line 284)
2. `src/app/(public)/ueber-uns/page.tsx` (Lines 137 & 177)
3. `src/app/(public)/kontakt/page.tsx` (Line 235)

**Asset URL:** `https://hgrtkumqrh0cwc66.public.blob.vercel-storage.com/store/checkpot-storefront-entrance.jpg`

**Recommendation:**
- During the media migration, ensure `store/checkpot-storefront-entrance.jpg` is copied into the R2 bucket.
- Keep `hostname: "*.public.blob.vercel-storage.com"` in `next.config.ts` until the R2 migration is executed, ensuring zero broken images during testing.

---

## 3. Environment Configuration & Secrets Management

### 3.1 Comprehensive Environment Variable Inventory

| Variable Name | Sensitivity | Default / Fallback | Fail-Closed Policy | Target Cloudflare Configuration |
|---|---|---|---|---|
| `DATABASE_URL` | **Secret** | None | **Throws Error:** `DATABASE_URL is required before database access is allowed.` (`src/db/index.ts:12`) | `wrangler secret put DATABASE_URL` / `.dev.vars` |
| `SITE_URL` | Public / Runtime | `https://checkpot-hietzing.at` | **Safe Fallback:** Normalizes via `getSiteUrl()` (`src/lib/site-config.ts:6`) | `wrangler.jsonc` `vars.SITE_URL` |
| `AUTH_SECRET` | **Secret** | None | **Throws Error:** Must be ≥ 32 chars. Admin auth & preview fail closed. (`src/lib/auth/session.ts:15`) | `wrangler secret put AUTH_SECRET` / `.dev.vars` |
| `ADMIN_PASSWORD` | **Secret** | None | **Fails Closed:** `verifyAdminPassword` returns `false` if undefined. (`src/lib/auth/password.ts:9`) | `wrangler secret put ADMIN_PASSWORD` / `.dev.vars` |
| `RESEND_API_KEY` | **Secret** | None | **Fails Gracefully:** Logs warning, notifies user to call/email. (`src/app/(public)/kontakt/actions.ts:84`) | `wrangler secret put RESEND_API_KEY` / `.dev.vars` |
| `RATE_LIMIT_SECRET`| **Secret** | Falls back to `AUTH_SECRET` | Uses `AUTH_SECRET` or static emergency salt. | `wrangler secret put RATE_LIMIT_SECRET` / `.dev.vars` |
| `NEXT_PUBLIC_GA_MEASUREMENT_ID` | Public / Client | Undefined | If undefined, GA4 component returns `null` silently. (`src/components/public/consent/google-analytics.tsx:33`) | `wrangler.jsonc` `vars.NEXT_PUBLIC_GA_MEASUREMENT_ID` |
| `BLOB_READ_WRITE_TOKEN` | **Secret** (Legacy) | None | Handled by storage migration. Retire once R2 is fully active. | Keep in `.dev.vars` temporarily if legacy reading needed. |

### 3.2 Secrets Fail-Closed Verification
- **Database (`src/db/index.ts`):** Validated on initial access. Missing `DATABASE_URL` halts execution before any malformed query executes.
- **Admin Session (`src/lib/auth/session.ts`):** `jwtVerify` throws on invalid signatures or missing keys. Rejects unauthenticated requests to `/admin` with immediate redirect to `/login`.
- **Admin Login (`src/lib/auth/password.ts`):** Constant-time comparison `timingSafeEqual` prevents timing side-channels. If `ADMIN_PASSWORD` is unset, all login attempts evaluate to `false`.
- **Site Preview (`src/lib/auth/preview.ts`):** Token validation fails closed to public maintenance/coming-soon shell if `AUTH_SECRET` is unset or token is tampered.

### 3.3 Proposed `wrangler.jsonc` Architecture

The Cloudflare Workers configuration must accommodate both local emulation via `wrangler dev` (Miniflare) and production builds:

```jsonc
{
  "$schema": "node_modules/wrangler/config-schema.json",
  "name": "checkpot-website",
  "main": ".vinext/worker.js", // Configured per chosen adapter (e.g. vinext)
  "compatibility_date": "2024-09-23",
  "compatibility_flags": [
    "nodejs_compat"
  ],
  "assets": {
    "directory": ".vinext/assets",
    "binding": "ASSETS"
  },
  "vars": {
    "SITE_URL": "https://checkpot-hietzing.at",
    "NEXT_PUBLIC_GA_MEASUREMENT_ID": "",
    "NODE_ENV": "production"
  },
  "r2_buckets": [
    {
      "binding": "MEDIA_BUCKET",
      "bucket_name": "checkpot-media",
      "preview_bucket_name": "checkpot-media-preview"
    }
  ],
  "observability": {
    "enabled": true
  },
  "env": {
    "preview": {
      "vars": {
        "SITE_URL": "https://preview.checkpot-hietzing.at",
        "NODE_ENV": "production"
      },
      "r2_buckets": [
        {
          "binding": "MEDIA_BUCKET",
          "bucket_name": "checkpot-media-preview"
        }
      ]
    }
  }
}
```

### 3.4 Git Ignore & Secret Protection Protocols

**Critical Vulnerability Mitigation:**
Currently, `.gitignore` excludes `.env` and `.env*.local` but does **not** include Wrangler-specific secret files.

**Required Additions to `.gitignore`:**
```gitignore
# Cloudflare Workers & Wrangler
.wrangler/
.dev.vars
.dev.vars.*
!.dev.vars.example
```

**Template for `.dev.vars.example`:**
```env
# Local secrets for wrangler dev (Miniflare)
# Copy to .dev.vars for local testing. NEVER commit .dev.vars!
DATABASE_URL="postgresql://user:pass@ep-example-pooler.eu-central-1.aws.neon.tech/neondb?sslmode=require"
AUTH_SECRET="your-at-least-32-characters-auth-secret-here-12345"
ADMIN_PASSWORD="your-strong-admin-password"
RESEND_API_KEY="re_123456789_abcdefg"
RATE_LIMIT_SECRET="your-rate-limit-secret-salt"
```

---

## 4. Routing, SEO & Public Form Architecture

### 4.1 Next.js 16 Routing Architecture (`next.config.ts` vs `src/proxy.ts`)

Next.js 16 App Router processes incoming requests through a strict pipeline:
```
1. next.config.ts (headers)
   ↓
2. next.config.ts (redirects)   ---> 22 Permanent HTTP 301 Redirects
   ↓
3. src/proxy.ts (Proxy/Middleware) -> 8 Permanent HTTP 410 Gone Responses
                                   -> Admin Session Route Protection
                                   -> Request Header x-pathname Propagation
   ↓
4. Static Assets & Metadata Routes -> /sitemap.xml, /robots.txt, /favicon.ico
   ↓
5. Page Server Components & Layouts -> (public) layout, SSR pages
```

### 4.2 Full Inventory of 22 HTTP 301 Permanent Redirects

All 22 redirects are declared in `next.config.ts` lines 14–48:

| Category | Source Path | Target Destination | Status Code | Verification Method |
|---|---|---|---|---|
| **Core Aliases** | `/team` | `/ueber-uns` | 301 | `curl -I http://localhost:8787/team` |
| | `/brands` | `/marken` | 301 | `curl -I http://localhost:8787/brands` |
| | `/home` | `/` | 301 | `curl -I http://localhost:8787/home` |
| | `/home/checkpot_damenmoden_1130_wien_` | `/` | 301 | `curl -I http://localhost:8787/home/checkpot_...` |
| **About / Boutique** | `/ueber_uns` | `/ueber-uns` | 301 | `curl -I http://localhost:8787/ueber_uns` |
| | `/ueber_uns/unser_team` | `/ueber-uns` | 301 | `curl -I http://localhost:8787/ueber_uns/unser_team` |
| | `/ueber_uns/fotos-vom-geschaeft`| `/ueber-uns` | 301 | `curl -I http://localhost:8787/ueber_uns/fotos-...` |
| **Contact / Legal** | `/kontakt/kontakt` | `/kontakt` | 301 | `curl -I http://localhost:8787/kontakt/kontakt` |
| | `/kontakt/impressum` | `/impressum` | 301 | `curl -I http://localhost:8787/kontakt/impressum` |
| | `/kontakt/datenschutz` | `/datenschutz` | 301 | `curl -I http://localhost:8787/kontakt/datenschutz` |
| **Mode & Collections**| `/mode/unsere-marken` | `/marken` | 301 | `curl -I http://localhost:8787/mode/unsere-marken` |
| | `/mode/fair_trade` | `/fair-trade` | 301 | `curl -I http://localhost:8787/mode/fair_trade` |
| | `/mode/vorschau-auf-herbst-winter-2025` | `/mode` | 301 | `curl -I http://localhost:8787/mode/vorschau-auf-herbst-winter-2025` |
| | `/mode/vorschau-auf-fruehjahr-sommer-2026`| `/mode` | 301 | `curl -I http://localhost:8787/mode/vorschau-auf-fruehjahr-sommer-2026` |
| | `/mode/vorschau-auf-fruehling-sommer-2025`| `/mode` | 301 | `curl -I http://localhost:8787/mode/vorschau-auf-fruehling-sommer-2025` |
| **Brand Normalization**| `/marken/king-louie-wien` | `/marken/king-louie` | 301 | `curl -I http://localhost:8787/marken/king-louie-wien` |
| | `/marken/madness-wien` | `/marken/madness` | 301 | `curl -I http://localhost:8787/marken/madness-wien` |
| | `/marken/angels-wien` | `/marken/angels` | 301 | `curl -I http://localhost:8787/marken/angels-wien` |
| | `/marken/sorgenfri-wien` | `/marken/sorgenfri` | 301 | `curl -I http://localhost:8787/marken/sorgenfri-wien` |
| | `/marken/emily-van-den-berg` | `/marken/emily-van-den-bergh` | 301 | `curl -I http://localhost:8787/marken/emily-van-den-berg` |
| | `/marken/emily-van-den-bergh-wien`| `/marken/emily-van-den-bergh` | 301 | `curl -I http://localhost:8787/marken/emily-van-den-bergh-wien` |
| | `/marken/nomads-clothing-` | `/marken/nomads` | 301 | `curl -I http://localhost:8787/marken/nomads-clothing-` |

### 4.3 Full Inventory of 8 HTTP 410 Gone Responses in `src/proxy.ts`

Defined in `src/proxy.ts` (lines 8–17 & 24–35). These represent legacy indexed URLs identified from Google Search Console where inventory was permanently discontinued:

```ts
const GONE_PATHS = new Set([
  "/marken/zilch-wien",
  "/marken/adini-wien",
  "/marken/happy-rainy-days-wien",
  "/marken/hatley",
  "/marken/thought-braintree-wien",
  "/mode/herbstwinter-kollektion-2023-",
  "/mode/herbst-winter-2018",
  "/schrankcheck-alt/schrankcheck",
]);
```

**HTTP 410 Response Specification:**
- Status: `410 Gone`
- Body: `"410 Gone - Dieser Inhalt wurde dauerhaft entfernt und ist nicht mehr verfügbar."`
- Headers:
  - `Content-Type: text/plain; charset=utf-8`
  - `Cache-Control: public, max-age=86400, stale-while-revalidate=604800` (allows edge caching of the 410 response for 24h, saving CPU time).

**Disjoint Validation:** There is zero collision between the 22 redirect rules and the 8 410 paths.

### 4.4 Dynamic Sitemap & Robots Configuration

#### 1. Sitemap (`src/app/sitemap.ts`)
- Configured with `export const dynamic = "force-dynamic"` and `export const revalidate = 0`.
- Behavior:
  - Checks `getSiteAccess().maintenanceMode`. If active, emits only `/impressum` and `/datenschutz` with priority `0.5`.
  - In standard operation, extracts static public routes from `seoRoutes` (filtered by `index: true`, excluding `/impressum` and `/datenschutz`), plus queries Neon DB via `listPublishedBrands()` to dynamically emit `/marken/${brand.slug}` at priority `0.65`.
  - All URLs are canonicalized via `getSiteUrl()`.

#### 2. Robots (`src/app/robots.ts`)
- In standard mode:
  ```txt
  User-agent: *
  Allow: /
  Disallow: /admin/
  Disallow: /login/
  Disallow: /api/auth/
  Disallow: /api/admin/
  Sitemap: https://checkpot-hietzing.at/sitemap.xml
  Host: https://checkpot-hietzing.at
  ```
- In maintenance mode:
  - `Disallow: /`
  - `Allow: /impressum`
  - `Allow: /datenschutz`

### 4.5 Dynamic Metadata & Canonical URLs

1. **Root `metadataBase`:** Defined in `src/app/layout.tsx` (`new URL(getSiteUrl())`) and repeated in `src/app/(public)/layout.tsx`.
2. **Canonical Alternates:**
   - Every public route specifies `alternates: { canonical: "..." }`.
   - Relative canonical paths (e.g. `/marken/king-louie`) automatically resolve against `metadataBase` to produce absolute URLs (`https://checkpot-hietzing.at/marken/king-louie`).
3. **OpenGraph & Twitter Cards:**
   - Standard social image: `/customer/og-image.jpg` (1200×630px, Checkpot Hietzing Store Außenansicht).
   - Card type: `summary_large_image`.
   - Brand detail pages dynamically inject the brand's hero image URL into `openGraph.images` if available.

### 4.6 Contact Form Architecture

The contact form (`src/app/(public)/kontakt/actions.ts`) provides full anti-spam, validation, rate limiting, and email dispatch without database persistence:
1. **Client IP Resolution:**
   - Evaluates `x-forwarded-for`, `x-real-ip`.
   - *Cloudflare Enhancement:* On Workers, `cf-connecting-ip` is the authoritative client IP header. The action should look up `headerList.get("cf-connecting-ip") || headerList.get("x-forwarded-for") || ...`.
2. **Distributed Atomic Rate Limiter:**
   - Scoped to `contact`, 5 requests per 10 minutes (600s window).
   - Hashes IP using HMAC-SHA256 (`RATE_LIMIT_SECRET` or `AUTH_SECRET`).
   - Atomically records attempts in Neon PostgreSQL (`rateLimits` table) using `onConflictDoUpdate`.
   - Completely independent of serverless host memory. Works identically across Cloudflare Workers.
3. **Bot Honeypot:**
   - Field `companyWebsite`. Hidden from human visitors via CSS.
   - If filled by an automated bot, the action returns `{ success: true }` silently without dispatching email or persisting data.
4. **Zod Input Validation:**
   - Schema `contactSchema` verifies name (2–100 chars), email format, optional phone, and message (10–2000 chars).
5. **Resend Dispatch:**
   - Dispatches via `new Resend(resendApiKey).emails.send()`.
   - Plain text + styled HTML email delivered to `christa.hausmair@outlook.at`.
   - `replyTo` set directly to visitor's email.
   - Operates over standard HTTPS fetch; zero Node TCP dependencies.

---

## 5. Cutover & Rollback Architecture

### 5.1 Production DNS Isolation Guarantee

**Rule 1:** Production DNS records for `checkpot-hietzing.at` and `www.checkpot-hietzing.at` **must remain completely untouched** during the entire migration, testing, and verification phases.

**Testing Environment Boundaries:**
- All functional testing must occur on:
  1. Local Miniflare / Workers runtime (`http://localhost:8787` or similar).
  2. Cloudflare non-production preview/staging deployment (e.g. `checkpot-preview.workers.dev` or a dedicated staging subdomain `staging.checkpot-hietzing.at`).
- No DNS records pointing to Vercel (`cname.vercel-dns.com` or `76.76.21.21`) may be altered.

### 5.2 Zero-Downtime Rollback Mechanism to Vercel

The architecture is deliberately designed to allow an instant, non-destructive fallback to Vercel at any time:

```
[ Visitor / Search Engine ]
             │
      (Production DNS)
      ┌──────┴──────┐
      ▼             ▼
 [ Cloudflare ]   [ Vercel ]  <--- Remains 100% Warm & Deployed
      │             │
      └──────┬──────┘
             ▼
      [ Neon PostgreSQL ]  <--- Common Database (Non-destructive schema)
             │
      ┌──────┴──────┐
      ▼             ▼
 [ Cloudflare R2 ] [ Vercel Blob ] <--- Original Objects Untouched
```

#### Why Rollback is Zero-Downtime:
1. **Vercel Deployment Remains Live:** The Vercel project is not deleted or altered. It continues running the current production build.
2. **Neon Database Schema Compatibility:** Database operations during the migration are strictly additive. The `media` table stores a standard `url: string`. Whether a media URL points to Vercel Blob (`*.public.blob.vercel-storage.com`) or Cloudflare R2 (`https://media.checkpot-hietzing.at/...`), both Vercel and Cloudflare Next.js builds can render both domains because `images.remotePatterns` will permit both.
3. **No Deletion of Original Media:** All original objects in Vercel Blob remain preserved.
4. **Restoration Time:** If a rollback is triggered, reverting DNS records back to Vercel takes effect within the configured DNS TTL (typically 5 minutes / 300 seconds).

### 5.3 Step-by-Step Manual DNS Cutover Procedure

This procedure is documented for the project owner to execute when the Cloudflare deployment has been fully verified and approved.

#### Phase A: Pre-Cutover Preparation (T-48 Hours)
1. **Reduce DNS TTL:**
   - Log in to domain registrar / DNS provider for `checkpot-hietzing.at`.
   - Lower TTL for Apex `@` and `www` records from 86400 (24h) to `300` (5 minutes).
   - Wait 48 hours to ensure stale caches expire worldwide.
2. **Cloudflare Zone & Custom Domain Setup:**
   - In Cloudflare Dashboard, configure custom domain for Worker: `checkpot-hietzing.at` and `www.checkpot-hietzing.at`.
   - Verify SSL/TLS mode is set to **Full (Strict)**.
   - In Cloudflare R2, attach the public bucket custom domain (e.g. `media.checkpot-hietzing.at`).
3. **Verify Secrets & Environment:**
   - Run `wrangler secret list` to verify `DATABASE_URL`, `AUTH_SECRET`, `ADMIN_PASSWORD`, and `RESEND_API_KEY` are provisioned in Cloudflare.

#### Phase B: Cutover Execution (T-0)
1. **Update DNS Records:**
   - Change `@` (Apex) record to Cloudflare Worker custom domain / Cloudflare Anycast IPs.
   - Change `www` CNAME to Cloudflare Worker custom domain.
2. **Monitor DNS Propagation:**
   - Execute:
     ```bash
     nslookup checkpot-hietzing.at 1.1.1.1
     nslookup checkpot-hietzing.at 8.8.8.8
     ```

#### Phase C: Immediate Post-Cutover Verification Protocol
Run the following verification commands against the live production origin:

```bash
# 1. Verify HTTPS and SSL handshake
curl -Iv https://checkpot-hietzing.at

# 2. Verify 301 redirects work correctly
curl -I https://checkpot-hietzing.at/team
# Expected: HTTP/2 301, Location: /ueber-uns

curl -I https://checkpot-hietzing.at/brands
# Expected: HTTP/2 301, Location: /marken

# 3. Verify 410 Gone routes return 410
curl -I https://checkpot-hietzing.at/marken/zilch-wien
# Expected: HTTP/2 410 Gone

# 4. Verify Sitemap and Robots
curl -I https://checkpot-hietzing.at/sitemap.xml
curl -I https://checkpot-hietzing.at/robots.txt

# 5. Verify Core Public Pages load with HTTP 200
curl -s -o /dev/null -w "%{http_code}\n" https://checkpot-hietzing.at/
curl -s -o /dev/null -w "%{http_code}\n" https://checkpot-hietzing.at/ueber-uns
curl -s -o /dev/null -w "%{http_code}\n" https://checkpot-hietzing.at/mode
curl -s -o /dev/null -w "%{http_code}\n" https://checkpot-hietzing.at/outfits
curl -s -o /dev/null -w "%{http_code}\n" https://checkpot-hietzing.at/marken
curl -s -o /dev/null -w "%{http_code}\n" https://checkpot-hietzing.at/fair-trade
curl -s -o /dev/null -w "%{http_code}\n" https://checkpot-hietzing.at/kontakt
curl -s -o /dev/null -w "%{http_code}\n" https://checkpot-hietzing.at/impressum
curl -s -o /dev/null -w "%{http_code}\n" https://checkpot-hietzing.at/datenschutz

# 6. Verify Admin protection
curl -I https://checkpot-hietzing.at/admin
# Expected: HTTP/2 307/302 Redirect to /login
```

#### Phase D: Post-Cutover Stabilization (T+48 Hours)
- Once live traffic has run on Cloudflare Workers without error for 48 hours:
  - Increase DNS TTL back to standard value (e.g. `3600` or `86400`).
  - Keep Vercel deployment as standby for 14 days before decommissioning.

### 5.4 Rollback Procedure & Decision Matrix

#### Rollback Triggers:
Initiate immediate rollback if any of the following occur during cutover:
1. Cloudflare Workers CPU limit exceeded systematically (> 10ms on Free tier) causing 1101/1102 Worker errors.
2. SSL certificate failure or persistent handshake timeouts.
3. Unhandled runtime exception preventing public SSR rendering.
4. Database connection failure over Neon HTTP in production.

#### Step-by-Step Rollback Execution:
1. **Revert DNS Records:**
   - In DNS management, update Apex `@` and `www` records back to Vercel:
     - `@` A record: `76.76.21.21`
     - `www` CNAME record: `cname.vercel-dns.com`
2. **Verify Traffic Restoration:**
   - Verify traffic returns to Vercel within 5 minutes (governed by 300s TTL).
   - Test `https://checkpot-hietzing.at/` to confirm normal Vercel operation.
3. **Investigate Root Cause in Staging:**
   - Debug Cloudflare Workers logs and metrics without public impact.

---

## 6. Actionable Recommendations & Implementation Blueprint

1. **Retire Vercel Analytics Packages:**
   - Remove `@vercel/analytics` and `@vercel/speed-insights`.
   - Remove `<VercelAnalytics />` from `src/components/public/consent/consent-manager.tsx`.
   - Update labels in `consent-banner.tsx`, `consent-settings-dialog.tsx`, and `datenschutz/page.tsx`.
2. **Update `.gitignore`:**
   - Add `.wrangler/`, `.dev.vars`, and `.dev.vars.*`.
   - Create `.dev.vars.example` for secure local team onboarding.
3. **Configure `wrangler.jsonc`:**
   - Set `compatibility_date`, `nodejs_compat`, R2 bucket binding `MEDIA_BUCKET`, and public `vars`.
4. **Update `next.config.ts` Remote Patterns:**
   - Include R2 public media domain (`*.r2.dev` or custom domain) while maintaining `*.public.blob.vercel-storage.com` throughout the transition.
5. **Update Client IP Resolution in Contact Action:**
   - Add `cf-connecting-ip` to header inspection in `src/app/(public)/kontakt/actions.ts`.
6. **Preserve Production DNS:**
   - Perform all integration, CPU measurement, and smoke tests strictly on preview/staging endpoints.
