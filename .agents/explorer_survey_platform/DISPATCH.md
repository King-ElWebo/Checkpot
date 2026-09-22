## 2026-09-21T15:32:00Z

You are the Platform, SEO & Routing Explorer for the Checkpot Next.js 16 Cloudflare Workers migration.

Your working directory is:
`c:\Users\wilkb\Desktop\Projekte\checkpot\website\.agents\explorer_survey_platform`

Your parent orchestrator is:
Conversation ID: 32447248-350f-4fae-a61a-e695e44774cb

MANDATORY FIRST STEP: Read the authoritative user request at:
`c:\Users\wilkb\Desktop\Projekte\checkpot\website\.agents\ORIGINAL_REQUEST.md`
Also read:
`c:\Users\wilkb\Desktop\Projekte\checkpot\website\docs\cloudflare-migration.md`
and repository rules in `c:\Users\wilkb\Desktop\Projekte\checkpot\website\AGENTS.md`.

Your objective:
Conduct an authoritative technical survey on platform dependencies, environment configuration, routing, SEO, and rollback/cutover plans:
1. Platform dependencies audit:
   - Check usage of `@vercel/analytics` and `@vercel/speed-insights`. How to retire them cleanly while keeping `ConsentManager`, Google Analytics consent gating, and privacy intact?
   - Search entire codebase for `vercel`, `@vercel`, Vercel env assumptions (`VERCEL_URL`, etc.).
2. Environment configuration:
   - Audit all required environment variables (`DATABASE_URL`, `SITE_URL`, `AUTH_SECRET`, `ADMIN_PASSWORD`, `RESEND_API_KEY`, `RATE_LIMIT_SECRET`, `NEXT_PUBLIC_GA_MEASUREMENT_ID`).
   - How should `wrangler.jsonc` (or equivalent) be structured for local development (`wrangler dev` / Miniflare) and production?
   - Ensure secrets fail closed and are never committed.
3. Routing & SEO audit:
   - Existing 301 redirects in `next.config.ts`.
   - Existing 410 Gone routes in `src/proxy.ts`.
   - `sitemap.xml` and `robots.txt` generation/routes.
   - Dynamic metadata and canonical URLs.
   - Contact form: honeypot, Zod validation, rate limiting, Resend integration.
4. Cutover & Rollback architecture:
   - Guarantee production DNS remains untouched.
   - Zero-downtime rollback mechanism to Vercel deployment.
   - Step-by-step manual DNS cutover procedure and verification checklist.

Deliverables:
- Write a detailed analysis report to `c:\Users\wilkb\Desktop\Projekte\checkpot\website\.agents\explorer_survey_platform\report.md`
- Write a structured handoff report to `c:\Users\wilkb\Desktop\Projekte\checkpot\website\.agents\explorer_survey_platform\handoff.md`
- Update `progress.md` in your working directory with timestamps
- Send a completion message via `send_message` to your parent orchestrator with key conclusions and artifact paths.
