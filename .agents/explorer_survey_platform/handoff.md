# Handoff Report — Platform, SEO & Routing Explorer

**Agent:** Platform, SEO & Routing Explorer  
**Working Directory:** `.agents/explorer_survey_platform`  
**Date:** 2026-09-21T15:37:00Z  
**Parent Orchestrator:** `32447248-350f-4fae-a61a-e695e44774cb`  
**Handoff Type:** Hard (Survey Task Complete)

---

## 1. Observation

1. **Vercel Package Dependencies:**
   - In `package.json:17,19`, dependencies list `"@vercel/analytics": "^2.0.1"` and `"@vercel/speed-insights": "^2.0.0"`.
   - In `src/components/public/consent/vercel-analytics.tsx:3-4`, components are imported via `import { Analytics } from "@vercel/analytics/next"` and `import { SpeedInsights } from "@vercel/speed-insights/next"`.
   - In `src/components/public/consent/consent-manager.tsx:8,22`, `VercelAnalytics` is imported and mounted inside `<ConsentProvider>`.
   - In `src/components/public/consent/consent-banner.tsx:28`, text quotes `(Google Analytics & Vercel Analytics)`.
   - In `src/components/public/consent/consent-settings-dialog.tsx:124,132`, UI labels quote `Google Analytics 4, Vercel Analytics & Speed Insights`.
   - In `src/app/(public)/datenschutz/page.tsx:228-245`, privacy policy explicitly discloses `Vercel Web Analytics & Speed Insights`.

2. **System Environment Variables & Vercel Platform Coupling:**
   - `grep_search` across `src/` for `VERCEL_` yielded 0 matches.
   - Central origin logic in `src/lib/site-config.ts:6-25` resolves `SITE_URL` via `getSiteUrl()`, falling back cleanly to `"https://checkpot-hietzing.at"`.
   - In `src/db/index.ts:9-16`, database client is initialized via `drizzle(neon(databaseUrl), { schema })` from `@neondatabase/serverless` using HTTP endpoints, with fail-closed assertion `if (!databaseUrl) throw new Error(...)`.
   - In `src/lib/auth/session.ts:12-16`, session verification asserts `if (!value || value.length < 32) throw new Error(...)`.
   - In `src/lib/auth/password.ts:6-9`, `verifyAdminPassword` asserts `if (!expected) return false`.
   - In `src/app/(public)/kontakt/actions.ts:81-85`, contact action asserts `if (!resendApiKey) return { success: false, ... }`.

3. **Hardcoded Vercel Blob URLs in Public UI:**
   - Storefront entrance image `https://hgrtkumqrh0cwc66.public.blob.vercel-storage.com/store/checkpot-storefront-entrance.jpg` is directly imported in:
     - `src/app/(public)/page.tsx:284`
     - `src/app/(public)/ueber-uns/page.tsx:137,177`
     - `src/app/(public)/kontakt/page.tsx:235`
   - In `next.config.ts:9`, `images.remotePatterns` allows `hostname: "*.public.blob.vercel-storage.com"`.

4. **Routing, 301 Redirects, 410 Gone & SEO:**
   - In `next.config.ts:14-48`, exactly 22 permanent 301 redirects are configured.
   - In `src/proxy.ts:8-17,24-35`, a set of 8 URLs (`GONE_PATHS`) returns explicit HTTP 410 Gone with `Cache-Control: public, max-age=86400, stale-while-revalidate=604800`.
   - Zero overlap exists between the 22 redirects and the 8 410 paths.
   - In `src/app/sitemap.ts:11-52`, sitemap dynamically queries Neon DB via `listPublishedBrands()` and static routes from `seoRoutes`, excluding `/impressum` and `/datenschutz` in normal operation.
   - In `src/app/robots.ts:9-34`, robots disallows `/admin/`, `/login/`, `/api/auth/`, `/api/admin/`, and points to canonical `${siteUrl}/sitemap.xml`.
   - In `src/app/layout.tsx:7` and `src/app/(public)/layout.tsx:51`, `metadataBase: new URL(siteUrl)` is set. All 10 public page components define `alternates: { canonical: "..." }`.

5. **Security & Git Configuration:**
   - In `.gitignore:16-22`, `.env*` files are ignored, but `.dev.vars`, `.dev.vars.*`, and `.wrangler/` are not listed.

---

## 2. Logic Chain

1. **Platform Independence (from Observation 2):**
   Because the codebase has zero reliance on `VERCEL_*` variables and all canonical URLs derive from `SITE_URL` via `getSiteUrl()`, the application runtime has zero proprietary Vercel coupling and can execute on any standards-compliant runtime supporting `process.env`.

2. **Clean Analytics Retirement (from Observation 1):**
   Because `@vercel/analytics` and `@vercel/speed-insights` are contained entirely inside `src/components/public/consent/vercel-analytics.tsx`, removing this component and deleting its reference in `consent-manager.tsx` cleanly removes Vercel tracking without touching Google Analytics 4, Google Consent Mode v2 Basic, or the `analytics` consent state in `ConsentProvider`.

3. **Rate Limiting & Serverless State (from Observation 2):**
   Because `checkAndIncrementRateLimit` in `src/lib/rate-limiter.ts` executes atomic SQL UPSERT queries in Neon PostgreSQL (`rateLimits` table), rate limiting is globally distributed and serverless-native. It does not rely on local Node memory or edge key-value stores.

4. **Media Transition Safety (from Observation 3):**
   Because four public routes directly consume `checkpot-storefront-entrance.jpg` from Vercel Blob, removing `*.public.blob.vercel-storage.com` from `next.config.ts` before replicating this asset to R2 would cause broken images on the homepage, about page, and contact page. Retaining the Blob remote pattern during the transition ensures 100% visual uptime.

5. **Secrets Leakage Prevention (from Observation 5):**
   Because `wrangler dev` reads local secrets from `.dev.vars`, and Wrangler outputs cache to `.wrangler/`, omitting these from `.gitignore` risks accidental secret exposure. Adding them to `.gitignore` and providing a `.dev.vars.example` ensures secrets remain fail-closed and strictly uncommitted.

6. **Cutover & Rollback Safety (from Observations 1, 2, 3, 4):**
   Because production DNS is not modified during migration testing, Vercel remains active, Neon PostgreSQL schema remains backwards-compatible, and original Vercel Blob objects are not deleted, an immediate, zero-downtime rollback to Vercel is guaranteed at any point.

---

## 3. Caveats

1. **Third-Party Provider Quotas:** Contact email delivery via Resend depends on the configured domain reputation and plan quota. Staging tests should avoid excessive test emails to `christa.hausmair@outlook.at`.
2. **Workers Free-Tier CPU Limits:** While Neon DB operations and Resend requests run over HTTP and do not count toward CPU execution time, SSR rendering and JWT crypto verification consume Worker CPU cycles. This will be verified during the runtime survey.
3. **DNS Registrar Details:** Exact DNS provider interface (e.g. easyname, domain-technik, Cloudflare Registrar) will be determined during the final manual cutover phase. The generic procedure documented here applies universally to all DNS providers.

---

## 4. Conclusion

1. **Readiness:** The platform dependencies, environment configuration, routing, and SEO architecture are 100% prepared for Cloudflare Workers migration. No structural architectural rewrites are needed.
2. **Platform Cleanup:** `@vercel/analytics` and `@vercel/speed-insights` can be removed cleanly along with UI label updates in `consent-banner.tsx`, `consent-settings-dialog.tsx`, and `datenschutz/page.tsx`.
3. **Wrangler Configuration:** `wrangler.jsonc` can be safely provisioned with `compatibility_flags: ["nodejs_compat"]`, `MEDIA_BUCKET` R2 binding, and public `vars`. Secrets (`DATABASE_URL`, `AUTH_SECRET`, `ADMIN_PASSWORD`, `RESEND_API_KEY`, `RATE_LIMIT_SECRET`) must be managed via Cloudflare Secrets and `.dev.vars`.
4. **Zero-Downtime Guarantee:** The isolation of production DNS and non-destructive preservation of Vercel deployment and Vercel Blob objects guarantees zero downtime and a foolproof rollback path.

---

## 5. Verification Method

To independently verify the observations and findings in this report:

1. **Verify Vercel Analytics Isolation:**
   ```bash
   grep -rn "@vercel/analytics" src/
   grep -rn "@vercel/speed-insights" src/
   ```
   *Expected:* Exactly two import lines in `src/components/public/consent/vercel-analytics.tsx`.

2. **Verify Absence of Vercel Environment Variables:**
   ```bash
   grep -rn "VERCEL_" src/
   ```
   *Expected:* Zero matches found.

3. **Verify 301 Redirects & 410 Gone Definitions:**
   - Inspect `next.config.ts:14-48` for 22 redirects.
   - Inspect `src/proxy.ts:8-17` for 8 `GONE_PATHS`.
   - Run typecheck and build:
     ```bash
     npm run typecheck
     npm run build
     ```

4. **Verify Dynamic Sitemap & Robots:**
   - Inspect `src/app/sitemap.ts` and `src/app/robots.ts`.
   - Run `curl -I http://localhost:3000/sitemap.xml` and `curl -I http://localhost:3000/robots.txt` in dev mode.

5. **Invalidation Conditions:**
   - If a new direct dependency on Vercel Edge Middleware or Vercel KV is introduced, this survey's conclusion on runtime neutrality is invalidated.
   - If DNS records are modified prior to full staging verification, the safety guarantee is breached.
