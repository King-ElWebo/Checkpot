# BRIEFING — 2026-09-21T15:38:00Z

## Mission
Authoritative technical survey on platform dependencies, environment configuration, routing, SEO, and rollback/cutover plans for Checkpot Next.js 16 Cloudflare Workers migration.

## 🔒 My Identity
- Archetype: explorer
- Roles: Platform, SEO & Routing Explorer
- Working directory: c:\Users\wilkb\Desktop\Projekte\checkpot\website\.agents\explorer_survey_platform
- Original parent: 32447248-350f-4fae-a61a-e695e44774cb
- Milestone: Cloudflare Migration Phase 1 - Technical Survey

## 🔒 Key Constraints
- Read-only investigation — do NOT implement source changes
- Only write metadata/reports in .agents/explorer_survey_platform/
- All findings must have concrete file paths and line numbers
- Production DNS must remain untouched
- Secrets must fail closed and never be committed

## Current Parent
- Conversation ID: 32447248-350f-4fae-a61a-e695e44774cb
- Updated: 2026-09-21T15:38:00Z

## Investigation State
- **Explored paths**: `src/components/public/consent/`, `src/lib/consent/`, `src/proxy.ts`, `next.config.ts`, `src/lib/site-config.ts`, `src/app/sitemap.ts`, `src/app/robots.ts`, `src/app/(public)/layout.tsx`, `src/app/(public)/kontakt/actions.ts`, `src/lib/rate-limiter.ts`, `src/db/index.ts`, `package.json`, `.gitignore`, `.env.example`, `docs/SEO-SPEC.md`, `docs/cloudflare-migration.md`
- **Key findings**:
  1. Zero `VERCEL_*` environment variables in codebase; central `getSiteUrl()` is 100% portable.
  2. `@vercel/analytics` and `@vercel/speed-insights` reside exclusively in `src/components/public/consent/vercel-analytics.tsx`; retiring them preserves `ConsentManager`, GA4 gating, and Google Consent Mode v2 Basic.
  3. 22 HTTP 301 redirects in `next.config.ts` and 8 HTTP 410 Gone routes in `src/proxy.ts` are completely disjoint and fully documented.
  4. Contact form uses durable Neon PostgreSQL atomic UPSERT rate limiting and Resend fetch; zero Node TCP dependencies.
  5. `.gitignore` requires immediate addition of `.dev.vars`, `.dev.vars.*`, and `.wrangler/` to avoid secret leakage.
  6. Zero-downtime rollback to Vercel is guaranteed by preserving production DNS, warm Vercel deployment, and original Vercel Blob media objects.
- **Unexplored areas**: None within platform/SEO/routing scope.

## Key Decisions Made
- Authored comprehensive technical survey report at `report.md`.
- Authored structured 5-component handoff report at `handoff.md`.
- Updated checklist in `progress.md`.

## Artifact Index
- `DISPATCH.md` — Incoming task dispatch record
- `progress.md` — Liveness and task checklist
- `BRIEFING.md` — Situational awareness and working memory
- `report.md` — Authoritative technical survey report
- `handoff.md` — Structured 5-component handoff report
