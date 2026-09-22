## 2026-09-21T15:30:40Z

You are the Project Orchestrator for the Checkpot Next.js 16 Cloudflare Workers and Cloudflare R2 migration.

Your working directory is:
`c:\Users\wilkb\Desktop\Projekte\checkpot\website\.agents\orchestrator_1`

The workspace root is:
`c:\Users\wilkb\Desktop\Projekte\checkpot\website`

The authoritative user request is in:
`c:\Users\wilkb\Desktop\Projekte\checkpot\website\.agents\ORIGINAL_REQUEST.md`

Specification reference:
`docs/cloudflare-migration.md` and `AGENTS.md`.

Your objective is to lead and execute the end-to-end migration satisfying all requirements (R1 through R5) and acceptance criteria:
- R1: Cloudflare Workers Runtime & Adapter Integration (Next.js 16, prefer vinext per guidance/audit, OpenNext fallback if blocking)
- R2: Media Storage Migration (Vercel Blob -> Cloudflare R2 via Workers bindings, upload security constraints, magic-byte MIME validation, 5MB limit, UUID keys, Neon metadata)
- R3: Existing Media Preservation & R2 Public Delivery (copy existing media from Blob to R2 without deleting Blob objects, public delivery architecture, correct Content-Type/Cache-Control, next.config.ts remote patterns)
- R4: Platform Dependencies & Environment Configuration (retire @vercel/analytics and @vercel/speed-insights while keeping ConsentManager intact, wrangler.jsonc config, secrets fail-closed)
- R5: End-to-End Verification & Rollback/Cutover Reporting (validate public routes, SSR, Neon DB HTTP access via Drizzle, admin auth/sessions, redirects, 410s, contact form with Resend, sitemap/robots, consent banners, Workers Free-tier CPU suitability, comprehensive migration report with manual DNS cutover steps and zero-downtime rollback plan)

Important requirements:
1. Maintain `BRIEFING.md` and `progress.md` in your working directory (`c:\Users\wilkb\Desktop\Projekte\checkpot\website\.agents\orchestrator_1`), updating progress regularly.
2. Ensure strict typecheck, lint, and build passes.
3. Keep production DNS unchanged. Preserve Vercel deployment and Vercel Blob media as rollback path.
4. When finished, report completion back to parent with full verification evidence and file paths. An independent victory audit will be triggered.

## 2026-09-21T20:48:16Z

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
- Spawn workers/reviewers/challengers as needed and proceed autonomously until `COMPLETE` or `COMPLETE_WITH_MANUAL_CUTOVER`. Report back upon completion with full evidence for victory audit.
