## 2026-09-21T15:39:31Z

You are the Milestone 1 Worker for the Checkpot Next.js 16 Cloudflare Workers migration.

Your working directory is:
`c:\Users\wilkb\Desktop\Projekte\checkpot\website\.agents\worker_m1_platform`

Your parent orchestrator is:
Conversation ID: 32447248-350f-4fae-a61a-e695e44774cb

MANDATORY FIRST STEP: Read the authoritative user request at:
`c:\Users\wilkb\Desktop\Projekte\checkpot\website\.agents\ORIGINAL_REQUEST.md`
Also read:
`c:\Users\wilkb\Desktop\Projekte\checkpot\website\.agents\orchestrator_1\PROJECT.md`
and the survey handoff at:
`c:\Users\wilkb\Desktop\Projekte\checkpot\website\.agents\explorer_survey_platform\handoff.md`
and survey report at:
`c:\Users\wilkb\Desktop\Projekte\checkpot\website\.agents\explorer_survey_platform\report.md`.

MANDATORY INTEGRITY WARNING:
DO NOT CHEAT. All implementations must be genuine. DO NOT hardcode test results, create dummy/facade implementations, or circumvent the intended task. A teamwork_preview_auditor will independently verify your work. Integrity violations WILL be detected and your work WILL be rejected.

File Ownership:
You own exclusively:
- `src/components/public/consent/*`
- `src/app/(public)/datenschutz/page.tsx`
- `.gitignore`
- `wrangler.jsonc`
- `.dev.vars.example`

Your Objective (Milestone 1: Platform Dependencies & Environment Hygiene):
1. Cleanly retire `@vercel/analytics` and `@vercel/speed-insights`:
   - In `src/components/public/consent/consent-manager.tsx`, remove import and mounting of `VercelAnalytics`.
   - Remove or empty `src/components/public/consent/vercel-analytics.tsx`.
   - Update `consent-banner.tsx:28` (remove "(Google Analytics & Vercel Analytics)" -> "(Google Analytics)").
   - Update `consent-settings-dialog.tsx:124,132` (remove references to Vercel Analytics & Speed Insights).
   - In `src/app/(public)/datenschutz/page.tsx`, update or retire the section referencing Vercel Web Analytics & Speed Insights so it accurately reflects current architecture while preserving all other privacy notices.
   - Verify that Google Analytics 4, Google Consent Mode v2 Basic, and ConsentProvider remain 100% functional.
2. Security & Environment Configuration:
   - Update `.gitignore` to include:
     ```gitignore
     # Cloudflare Workers & secrets
     .dev.vars
     .dev.vars.*
     .wrangler/
     ```
   - Create `.dev.vars.example` documenting all required secrets with fail-closed dummy examples (never real secrets):
     - `DATABASE_URL`
     - `SITE_URL`
     - `AUTH_SECRET`
     - `ADMIN_PASSWORD`
     - `RESEND_API_KEY`
     - `RATE_LIMIT_SECRET`
     - `NEXT_PUBLIC_GA_MEASUREMENT_ID`
   - Create `wrangler.jsonc` with Cloudflare configuration:
     ```jsonc
     {
       "$schema": "node_modules/wrangler/config-schema.json",
       "name": "checkpot-website",
       "main": "src/index.ts", // or as required by adapter
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
3. Verification:
   - Run `npm run typecheck` and `npm run lint`. Ensure ZERO errors.
   - Document commands and results in your handoff.

Deliverables:
- Write changes description to `c:\Users\wilkb\Desktop\Projekte\checkpot\website\.agents\worker_m1_platform\changes.md`
- Write handoff to `c:\Users\wilkb\Desktop\Projekte\checkpot\website\.agents\worker_m1_platform\handoff.md`
- Send completion message via `send_message` to parent orchestrator.
