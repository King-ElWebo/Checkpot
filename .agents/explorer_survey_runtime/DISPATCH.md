## 2026-09-21T15:31:43Z

You are the Runtime & Adapter Spec Miner for the Checkpot Next.js 16 Cloudflare Workers migration.

Your working directory is:
`c:\Users\wilkb\Desktop\Projekte\checkpot\website\.agents\explorer_survey_runtime`

Your parent orchestrator is:
Conversation ID: 32447248-350f-4fae-a61a-e695e44774cb

MANDATORY FIRST STEP: Read the authoritative user request at:
`c:\Users\wilkb\Desktop\Projekte\checkpot\website\.agents\ORIGINAL_REQUEST.md`
Also read:
`c:\Users\wilkb\Desktop\Projekte\checkpot\website\docs\cloudflare-migration.md`
and repository rules in `c:\Users\wilkb\Desktop\Projekte\checkpot\website\AGENTS.md`.

Your objective:
Conduct an authoritative technical survey on Cloudflare Workers runtime and adapter integration for this Next.js 16 application:
1. Examine Next.js 16 adapter options: evaluate `vinext` per official Cloudflare guidance and the compatibility audit, versus `@opennextjs/cloudflare` (OpenNext). Check current dependencies in `package.json`, `next.config.ts`, `tsconfig.json`. Can vinext or opennext run this Next.js 16 App Router app cleanly? What commands/configs are needed?
2. Audit runtime compatibility:
   - Neon PostgreSQL over HTTP (`@neondatabase/serverless`, Drizzle ORM in `src/db/`). Any TCP/node socket dependencies?
   - Signed `jose` session auth and admin routes in `src/lib/auth/`, `src/app/admin/`, `src/proxy.ts`. Any Node crypto vs Web Crypto issues?
   - Server Actions, Route Handlers, Server Components, client components.
   - Resend contact email over HTTP/fetch.
   - Any Node.js built-ins (`fs`, `child_process`, `path`, etc.) or C++ native modules used in runtime code?
3. Check Cloudflare Workers Free-tier limits (CPU time, subrequests, bundle size) and assess potential bottlenecks.
4. Document all required packages, scripts, configuration files (e.g. `wrangler.jsonc`, `vite.config.ts` if vinext, etc.), and runtime shims.

Deliverables:
- Write a detailed analysis report to `c:\Users\wilkb\Desktop\Projekte\checkpot\website\.agents\explorer_survey_runtime\report.md`
- Write a structured handoff report to `c:\Users\wilkb\Desktop\Projekte\checkpot\website\.agents\explorer_survey_runtime\handoff.md`
- Update `progress.md` in your working directory with timestamps
- Send a completion message via `send_message` to your parent orchestrator with the key conclusions and artifact paths.
