# Project: Checkpot Next.js 16 Cloudflare Workers & R2 Migration

## Architecture
- **Framework & Runtime**: Next.js 16 App Router on Cloudflare Workers using `vinext` adapter (Vite-based edge bundler) with `@opennextjs/cloudflare` as verified fallback.
- **Database**: Neon PostgreSQL via HTTP using `@neondatabase/serverless` and Drizzle ORM (`drizzle-orm/neon-http`). No TCP socket emulation required.
- **Media Storage**: Cloudflare R2 via native Workers binding (`cloudflare:workers` `env.MEDIA_BUCKET`) for runtime operations (upload, delete). Static public delivery via Cloudflare R2 Custom Domain / `*.r2.dev` with immutable edge caching.
- **Authentication**: Signed `jose` session tokens using Web Crypto (`crypto.subtle`) and `timingSafeEqual` via `nodejs_compat`.
- **Security & Privacy**: Google Analytics 4 with Google Consent Mode v2 Basic, fail-closed secrets in `.dev.vars` / Cloudflare Secrets, serverless rate-limiting via atomic SQL UPSERTs.
- **Preserved Assets**: Original Vercel deployment and Vercel Blob media objects remain untouched for zero-downtime rollback; production DNS remains untouched during migration.

---

## Feature Inventory

| # | Feature | Description | Milestone | Source |
|---|---------|-------------|-----------|--------|
| 1 | Vercel Analytics Retirement | Retire `@vercel/analytics` and `@vercel/speed-insights` cleanly from `vercel-analytics.tsx` and `consent-manager.tsx` | M1 | ORIGINAL_REQUEST R4, Survey |
| 2 | Consent Manager Preservation | Retain `ConsentManager`, GA4, Google Consent Mode v2 Basic, update consent texts in banner, dialog, and datenschutz | M1 | ORIGINAL_REQUEST R4, Survey |
| 3 | Environment & Secrets Hygiene | Update `.gitignore` with `.dev.vars*` and `.wrangler/`; configure fail-closed `.dev.vars.example` | M1 | ORIGINAL_REQUEST R4, Survey |
| 4 | Base Wrangler Configuration | Create `wrangler.jsonc` with nodejs_compat, vars, and R2 bucket binding | M1 | ORIGINAL_REQUEST R4, Survey |
| 5 | vinext Adapter Integration | Install and configure `vinext` with `@cloudflare/vite-plugin`, `vite.config.ts`, and `"type": "module"` | M2 | ORIGINAL_REQUEST R1, Survey |
| 6 | Workers Build Scripts | Wire package scripts (`build:cf`, `preview`, `dev:cf`) and ensure standard `npm run build` compatibility | M2 | ORIGINAL_REQUEST R1, Survey |
| 7 | HTTP Database Compatibility | Verify `@neondatabase/serverless` and `drizzle-orm/neon-http` under Cloudflare Workers runtime | M2 | ORIGINAL_REQUEST R1, R5, Survey |
| 8 | Web Crypto & Session Verification | Verify `jose` JWT signing/verification and `timingSafeEqual` under Workers `nodejs_compat` | M2 | ORIGINAL_REQUEST R1, R5, Survey |
| 9 | Proxy & Routing Interception | Verify `src/proxy.ts` 410 Gone routes and admin session protection in Workers runtime | M2 | ORIGINAL_REQUEST R1, R5, Survey |
| 10 | R2 Storage Service Abstraction | Create `src/lib/storage/index.ts` using `cloudflare:workers` `env.MEDIA_BUCKET` with graceful Node dev fallback | M3 | ORIGINAL_REQUEST R2, Survey |
| 11 | Media Upload Action Migration | Refactor `uploadMediaAction` in `src/app/admin/media/actions.ts` to use R2 storage, retaining 5MB limit, magic-bytes, UUID naming | M3 | ORIGINAL_REQUEST R2, Survey |
| 12 | Media Delete Action Migration | Refactor `deleteMediaAction` to use R2 storage, retaining cascade reference protection | M3 | ORIGINAL_REQUEST R2, Survey |
| 13 | Image Delivery Configuration | Update `next.config.ts` with `images.unoptimized: true` and add R2 hostnames alongside Vercel Blob in `remotePatterns` | M3 | ORIGINAL_REQUEST R3, Survey |
| 14 | Hardcoded Store Image Normalization | Update hardcoded Vercel Blob storefront image references in `page.tsx`, `ueber-uns`, and `kontakt` | M3 | ORIGINAL_REQUEST R3, Survey |
| 15 | Non-Destructive Blob->R2 Migration Script | Implement `scripts/migrate-media-to-r2.mjs` to copy 18 Blob objects to R2 with SHA-256 integrity verification | M4 | ORIGINAL_REQUEST R3, Survey |
| 16 | Media Migration Ledger & Rollback Script | Generate `media-migration-ledger.json` and `scripts/rollback-media-urls.mjs` for 1-second URL rollback | M4 | ORIGINAL_REQUEST R3, Survey |
| 17 | Database Media URL Update | Update Neon DB `media.url` records to point to R2 public delivery URLs without deleting Blob objects | M4 | ORIGINAL_REQUEST R3, Survey |
| 18 | Dual Track E2E Test Suite | Build independent opaque-box test suite (Tiers 1-4) published via `TEST_READY.md` | E2E Track | Project Pattern |
| 19 | E2E Test Suite Verification | Pass 100% of Tiers 1-4 tests on Cloudflare Workers runtime | M5 | ORIGINAL_REQUEST R5, Project Pattern |
| 20 | Adversarial Coverage Hardening | White-box adversarial testing (Tier 5) by Challengers to eliminate edge-case bugs | M5 | Project Pattern Tier 5 |
| 21 | Workers Free-Tier CPU Verification | Benchmark CPU execution time across SSR routes and admin flows to guarantee <10ms compatibility | M5 | ORIGINAL_REQUEST R5, docs/cloudflare-migration §16 |
| 22 | Migration Report & Cutover Guide | Compile comprehensive `docs/MIGRATION-REPORT.md` with verification proofs, manual DNS steps, and rollback plan | M5 | ORIGINAL_REQUEST R5, docs/cloudflare-migration §32 |

---

## Milestones

| # | Name | Scope | Dependencies | Status |
|---|------|-------|-------------|--------|
| M1 | Platform Dependencies & Environment Hygiene | Features 1, 2, 3, 4: Clean Vercel Analytics removal, consent text updates, .gitignore, wrangler.jsonc base | none | DONE |
| M2 | Cloudflare Workers Runtime & Adapter Integration | Features 5, 6, 7, 8, 9: vinext adapter setup, vite.config.ts, build scripts, proxy/SSR/auth/DB compatibility verification | M1 | DONE |
| M3 | Media Storage & R2 Integration | Features 10, 11, 12, 13, 14: R2 storage abstraction, media actions refactor, magic-bytes, unoptimized next/image, remotePatterns | M1, M2 | DONE |
| M4 | Existing Media Migration & Ledger | Features 15, 16, 17: Non-destructive copy from Vercel Blob to R2, SHA-256 verification, migration ledger, rollback script, DB update | M3 | DONE |
| M5 | Final Milestone: 100% E2E Test Pass & Cutover/Rollback Report | Features 19, 20, 21, 22: Pass 100% E2E tests (Tiers 1-4), adversarial hardening (Tier 5), CPU benchmark, migration report | M1, M2, M3, M4, E2E Track | DONE |
| E2E | E2E Testing Track (Parallel) | Feature 18: Independent test suite design (Tiers 1-4) published as TEST_READY.md | none | DONE (275 tests) |

---

## Interface Contracts

### M1 ↔ M2 (Environment & Config Contract)
- `wrangler.jsonc` defines:
  ```jsonc
  {
    "name": "checkpot-website",
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
- `.dev.vars` contains local development secrets: `DATABASE_URL`, `AUTH_SECRET`, `ADMIN_PASSWORD`, `RESEND_API_KEY`, `RATE_LIMIT_SECRET`.

### M2 ↔ M3 (Cloudflare Binding Contract)
- Storage abstraction `src/lib/storage/index.ts` consumes `env.MEDIA_BUCKET` typed as `R2Bucket` from `cloudflare:workers`.
- When running in standard Node (`next dev`), storage abstraction checks `process.env.NODE_ENV === "development"` and provides a graceful warning or local file emulation rather than throwing a runtime module-resolution error.

### M3 ↔ M4 (Media Keys & Public Delivery Contract)
- Object keys in R2 strictly mirror the path structure:
  - `media/<uuid>.<ext>`
  - `brands/<slug>.<ext>`
  - `outfits/<timestamp>-<hash>.<ext>`
  - `store/<filename>.<ext>`
- Public URL structure: `${R2_PUBLIC_DOMAIN}/${key}` where `R2_PUBLIC_DOMAIN` defaults to `https://media.checkpot.at` or transitional `*.r2.dev`.
- Database `media.url` stores the full public URL.

### E2E Testing Track ↔ Implementation Track (`TEST_READY.md`)
- Opaque-box test harness executable via `npm run test:e2e` or `node scripts/e2e-runner.mjs`.
- Exit code 0 indicates all tests passed.
- Output includes per-tier pass/fail metrics and error summaries.

---

## Code Layout & File Ownership Boundaries

To prevent concurrent worker collisions, file ownership is strictly partitioned:
- **M1 Worker**:
  - Owns: `src/components/public/consent/*`, `.gitignore`, `wrangler.jsonc`, `.dev.vars.example`
- **M2 Worker**:
  - Owns: `package.json`, `vite.config.ts`, `tsconfig.json`, adapter configuration files, build verification scripts
- **M3 Worker**:
  - Owns: `src/lib/storage/*`, `src/app/admin/media/actions.ts`, `next.config.ts`, static store image references in `src/app/(public)/*`
- **M4 Worker**:
  - Owns: `scripts/migrate-media-to-r2.mjs`, `scripts/rollback-media-urls.mjs`, `media-migration-ledger.json`
- **E2E Testing Worker / Writer**:
  - Owns: `tests/e2e/*`, `scripts/e2e-runner.mjs`, `TEST_INFRA.md`, `TEST_READY.md`
- **M5 Worker**:
  - Owns: Bug fixes across codebase for E2E failures, `docs/MIGRATION-REPORT.md`
