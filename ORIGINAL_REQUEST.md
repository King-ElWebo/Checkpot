# Original User Request

## 2026-09-21T15:30:02Z

Migrate the production-ready Checkpot Next.js 16 application from its current Vercel-based deployment and storage architecture to a fully functional Cloudflare Workers architecture with Cloudflare R2 storage, strictly preserving all existing public routes, dynamic SSR, Neon database connectivity, admin authentication, CMS behavior, redirects, 410 responses, SEO, and consent management without DNS cutover or data loss.

Working directory: c:\Users\wilkb\Desktop\Projekte\checkpot\website
Integrity mode: development

Specification reference: `docs/cloudflare-migration.md` and repository baseline rules in `AGENTS.md`.

## Requirements

### R1. Cloudflare Workers Runtime & Adapter Integration
Integrate the officially recommended Cloudflare deployment adapter for Next.js 16 (preferring `vinext` per official Cloudflare guidance and the 88% compatibility audit, with fallback to OpenNext only if a blocking incompatibility is discovered) so the project builds and runs on Cloudflare Workers. Preserve standard local Next.js development workflow and configuration.

### R2. Media Storage Migration (Vercel Blob → Cloudflare R2)
Replace `@vercel/blob` in media upload and deletion actions (`src/app/admin/media/actions.ts`) with Cloudflare R2 storage using native Workers bindings (`cloudflare:workers` `env.MEDIA_BUCKET` or validated fallback). Maintain all existing upload security constraints: admin authentication, 5MB file size limit, magic-byte MIME validation (JPG, PNG, WebP), UUID-based file keys, metadata persistence in Neon, and usage/delete protection.

### R3. Existing Media Preservation & R2 Public Delivery
Safely migrate existing media records and objects from Vercel Blob to Cloudflare R2 without deleting original Vercel objects. Provide public delivery architecture for R2 images (via public bucket domain/custom domain or Worker route handler) ensuring correct `Content-Type` and immutable `Cache-Control`. Update `next.config.ts` remote patterns to allow R2 delivery while retaining Vercel Blob hostname during the transitional phase.

### R4. Platform Dependencies & Environment Configuration
Retire `@vercel/analytics` and `@vercel/speed-insights` cleanly while keeping `ConsentManager` and privacy consent gating intact. Configure `wrangler.jsonc` (or equivalent) with required variables, bindings, and compatibility flags. Ensure all secrets (`DATABASE_URL`, `SITE_URL`, `AUTH_SECRET`, `ADMIN_PASSWORD`, `RESEND_API_KEY`) remain fail-closed, are configured for local and Worker runtimes, and are never committed to version control.

### R5. End-to-End Verification & Rollback/Cutover Reporting
Objectively verify the migrated application in the Cloudflare Workers runtime (and deployed preview if credentials permit). Validate public routes (`/`, `/ueber-uns`, `/mode`, `/outfits`, `/marken`, `/marken/[slug]`, `/fair-trade`, `/kontakt`, `/impressum`, `/datenschutz`), Neon DB access, admin login/logout/CRUD, 301 redirects, 410 Gone paths, contact form with Resend, sitemap/robots, and consent banners. Verify Workers Free-tier CPU suitability under representative SSR load. Produce a comprehensive migration report with manual DNS cutover steps and an immediate Vercel rollback plan.

---

## Acceptance Criteria

### Build & Type Safety
- [ ] `npm run typecheck` passes with zero errors.
- [ ] `npm run lint` passes with zero errors.
- [ ] Next.js standard build and Cloudflare Workers build succeed cleanly.

### Cloudflare Runtime & Workers Compatibility
- [ ] Application starts and runs successfully in the Cloudflare Workers runtime environment (`wrangler dev` / Miniflare or vinext dev).
- [ ] No Node.js runtime incompatibilities or unhandled exceptions occur during request handling.
- [ ] Workers Free-tier CPU time is monitored and verified for representative SSR and admin routes.

### Database & Authentication Integrity
- [ ] Neon PostgreSQL reads and writes succeed over HTTP via `@neondatabase/serverless` and Drizzle ORM in the Cloudflare runtime.
- [ ] Unauthenticated requests to `/admin` redirect to `/login`; invalid credentials fail closed; valid credentials establish a signed `jose` session cookie.
- [ ] Authenticated admin flows (brands, collections, outfits, store info, media) load and function correctly.

### Storage & Media Delivery
- [ ] New image uploads via admin pass magic-byte verification, store in R2, and create Neon DB records.
- [ ] Image deletion removes the R2 object and DB entry, while referenced images are blocked from deletion unless force-confirmed.
- [ ] Existing media items referenced in Neon are copied to R2 without deleting original Vercel Blob objects; byte integrity is verified.
- [ ] Public image delivery serves correct `Content-Type` headers and caching for both migrated R2 and legacy Blob assets.

### Routing, SEO & Privacy
- [ ] All configured 301 redirects in `next.config.ts` return HTTP 301 to the correct target.
- [ ] All configured legacy paths in `proxy.ts` return explicit HTTP 410 Gone.
- [ ] `sitemap.xml` and `robots.txt` render valid XML and robots directives.
- [ ] Consent manager, Google Analytics consent gating, and contact form submission with honeypot and rate limiting remain functional.

### Safety & Cutover
- [ ] Production DNS is NOT changed.
- [ ] Vercel deployment and Vercel Blob media are preserved as a zero-downtime rollback path.
- [ ] A final migration report is generated documenting the architecture, verification logs, remaining manual DNS cutover actions, and rollback commands, classified as `COMPLETE` or `COMPLETE_WITH_MANUAL_CUTOVER`.

## Follow-up — 2026-09-21T20:47:26Z

The server has restarted and rate limits have fully cleared. Resume Teamwork orchestration immediately.

### Current Repository & Milestone Status:
1. **Milestone 1**: DONE (Vercel analytics retired, Google Consent Mode v2 Basic preserved, `.dev.vars.example` and `wrangler.jsonc` created, `.gitignore` updated).
2. **Milestone 2**: DONE (`vinext` + `@cloudflare/vite-plugin` integrated with Next.js 16, ESM `"type": "module"`, `npm run build` passes 29/29 routes, `npm run build:cf` compiles 281 kB edge worker bundle, 5-agent verification swarm APPROVED).
3. **Milestone 3**: DONE (`src/lib/storage/index.ts` with native `env.MEDIA_BUCKET`, `src/app/admin/media/actions.ts` refactored to R2 with magic-byte MIME validation, 5MB limit, UUID keys, delete cascade protection; `next.config.ts` unoptimized + dual-domain remotePatterns; `@vercel/blob` removed; auditor M3 verdict CLEAN).
4. **Milestone 4**: Implementation complete (`scripts/migrate-media-to-r2.mjs` ran with 59/59 Vercel Blob assets downloaded, SHA-256 verified, and staged at `dist/r2-migration-staging/`; `media-migration-ledger.json`, `scripts/rollback-media-urls.mjs`, and `scripts/apply-media-urls.mjs` created; zero original Vercel objects deleted).
5. **Cloudflare Runtime Environment**:
   - Local Cloudflare Workers runtime (`wrangler dev`) is running on `http://127.0.0.1:8787` with `.dev.vars` configured.
   - E2E test runner is available: `node scripts/e2e-runner.mjs --target http://127.0.0.1:8787`.

### Required Actions:
- Do NOT redo completed Milestones 1, 2, or 3.
- Finalize Milestone 4 verification gate (migration ledger, non-destructive staging, rollback path).
- Transition to Milestone 5:
  - Run the 4-tier 275-scenario E2E test suite against the live Cloudflare Workers runtime (`http://127.0.0.1:8787`).
  - Diagnose, repair, and rerun any failing tests.
  - Execute adversarial / white-box hardening.
  - Perform Workers Free-tier CPU benchmark (<10ms threshold per `docs/cloudflare-migration.md` §16).
  - Produce the final migration report `docs/MIGRATION-REPORT.md` (architecture, storage, removed dependencies, verification results, manual cutover steps, rollback instructions, and final classification).
- Spawn workers/reviewers/challengers as needed and proceed autonomously until `COMPLETE` or `COMPLETE_WITH_MANUAL_CUTOVER`.

