# Milestone 1: Changes Report

## Overview
Milestone 1 cleanly retires Vercel Analytics (`@vercel/analytics`) and Vercel Speed Insights (`@vercel/speed-insights`), updates consent UI and legal disclosures, establishes fail-closed Cloudflare local secret templates, and configures the base Cloudflare Workers / R2 configuration.

## Files Modified & Created

### 1. `src/components/public/consent/consent-manager.tsx`
- **Action**: Modified
- **Details**:
  - Removed import `import { VercelAnalytics } from "./vercel-analytics";`
  - Removed `<VercelAnalytics />` JSX tag from the `<ConsentProvider>` tree.
  - Kept `<GoogleAnalytics />`, `<ConsentBanner />`, `<ConsentSettingsDialog />`, and `ConsentProvider` untouched.

### 2. `src/components/public/consent/vercel-analytics.tsx`
- **Action**: Modified (Clean Deprecation / No-op Stub)
- **Details**:
  - Removed `@vercel/analytics/next` and `@vercel/speed-insights/next` package imports.
  - Replaced implementation with a lightweight, no-op `export function VercelAnalytics() { return null; }` stub with deprecation documentation.
  - Guarantees zero runtime tracking and prevents build-time import breakage if uncommitted files reference the component.

### 3. `src/components/public/consent/consent-banner.tsx`
- **Action**: Modified
- **Details**:
  - Line 28: Updated consent description from `"(Google Analytics & Vercel Analytics)"` to `"(Google Analytics)"`.
  - Maintained all button actions, focus styling, and legal link to `/datenschutz`.

### 4. `src/components/public/consent/consent-settings-dialog.tsx`
- **Action**: Modified
- **Details**:
  - Line 124: Updated category subtitle from `"Google Analytics 4, Vercel Analytics & Speed Insights"` to `"Google Analytics 4"`.
  - Line 132: Updated checkbox `aria-label` from `"Statistik (Google Analytics 4, Vercel Analytics & Speed Insights) aktivieren"` to `"Statistik (Google Analytics 4) aktivieren"`.
  - Preserved full keyboard accessibility (focus trapping, escape key, ARIA dialog roles).

### 5. `src/app/(public)/datenschutz/page.tsx`
- **Action**: Modified
- **Details**:
  - Section 01 (Hosting): Updated provider notice to reflect Cloudflare edge infrastructure (`Cloudflare, Inc., 101 Townsend St, San Francisco, CA 94107, USA`).
  - Section 05 (Webanalyse): Renamed section heading to `Webanalyse & Statistik (Google Analytics 4)` and completely removed the `Vercel Web Analytics & Speed Insights` subsection.
  - Fully retained DSGVO/TKG 2021 disclosures for Google Analytics 4 (Basic Consent Mode, IP anonymization, no remarketing/signals), revocation process, Google Maps, and data subject rights.

### 6. `.gitignore`
- **Action**: Modified
- **Details**:
  - Added explicit ignore patterns for Cloudflare Workers secret files and build cache:
    ```gitignore
    # Cloudflare Workers & secrets
    .dev.vars
    .dev.vars.*
    !.dev.vars.example
    .wrangler/
    ```

### 7. `.dev.vars.example`
- **Action**: Created
- **Details**:
  - Created documented local environment configuration template with fail-closed dummy examples for:
    - `DATABASE_URL`
    - `SITE_URL`
    - `AUTH_SECRET`
    - `ADMIN_PASSWORD`
    - `RESEND_API_KEY`
    - `RATE_LIMIT_SECRET`
    - `NEXT_PUBLIC_GA_MEASUREMENT_ID`
  - Explicitly marked as safe dummy values for local `wrangler dev` (Miniflare) use.

### 8. `wrangler.jsonc`
- **Action**: Created
- **Details**:
  - Created base Cloudflare Workers configuration conforming to Cloudflare Workers JSON schema:
    ```jsonc
    {
      "$schema": "node_modules/wrangler/config-schema.json",
      "name": "checkpot-website",
      "main": "src/index.ts",
      "compatibility_date": "2026-09-01",
      "compatibility_flags": ["nodejs_compat"],
      "vars": {
        "SITE_URL": "https://checkpot-hietzing.at",
        "NEXT_PUBLIC_GA_MEASUREMENT_ID": "G-LBFJND2204"
      },
      "r2_buckets": [
        {
          "binding": "MEDIA_BUCKET",
          "bucket_name": "checkpot-media"
        }
      ]
    }
    ```
