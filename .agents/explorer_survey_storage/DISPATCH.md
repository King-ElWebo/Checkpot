## 2026-09-21T15:31:43Z
<USER_REQUEST>
You are the Storage & Media Explorer for the Checkpot Next.js 16 Cloudflare Workers migration.

Your working directory is:
`c:\Users\wilkb\Desktop\Projekte\checkpot\website\.agents\explorer_survey_storage`

Your parent orchestrator is:
Conversation ID: 32447248-350f-4fae-a61a-e695e44774cb

MANDATORY FIRST STEP: Read the authoritative user request at:
`c:\Users\wilkb\Desktop\Projekte\checkpot\website\.agents\ORIGINAL_REQUEST.md`
Also read:
`c:\Users\wilkb\Desktop\Projekte\checkpot\website\docs\cloudflare-migration.md`
and repository rules in `c:\Users\wilkb\Desktop\Projekte\checkpot\website\AGENTS.md`.

Your objective:
Conduct an authoritative technical survey on media storage and Vercel Blob -> Cloudflare R2 migration:
1. Audit all Vercel Blob references across the codebase (`src/app/admin/media/actions.ts`, `src/db/schema.ts`, `next.config.ts`, etc.).
2. Inspect existing media records: how media records are modeled in Neon (`src/db/schema.ts`), how URLs are structured (Vercel Blob hostnames), how many records exist if discoverable, and where media is rendered across the site (e.g. `next/image` components, remotePatterns).
3. Evaluate Cloudflare R2 integration options:
   - Native Workers R2 binding (`env.MEDIA_BUCKET` / `cloudflare:workers`) vs S3-compatible client (`@aws-sdk/client-s3`). How does the selected adapter (vinext or OpenNext) expose R2 bindings to Next.js Server Actions?
   - Upload security: admin authentication, 5MB limit, magic-byte MIME validation (JPEG, PNG, WebP), UUID keys, Neon DB persistence, delete protection (blocking delete if referenced by brands, outfits, etc.).
4. Design the migration strategy for existing media:
   - How to copy existing Vercel Blob objects to R2 without deleting original Blob objects.
   - How to verify object and byte integrity.
   - How to update or bridge Neon DB URLs with a safe rollback path.
5. Design R2 public image delivery architecture:
   - Public R2 bucket custom domain vs Worker route handler.
   - Content-Type, Cache-Control (immutable for UUID assets).
   - `next.config.ts` remotePatterns configuration to support both R2 and legacy Vercel Blob during transition.

Deliverables:
- Write a detailed analysis report to `c:\Users\wilkb\Desktop\Projekte\checkpot\website\.agents\explorer_survey_storage\report.md`
- Write a structured handoff report to `c:\Users\wilkb\Desktop\Projekte\checkpot\website\.agents\explorer_survey_storage\handoff.md`
- Update `progress.md` in your working directory with timestamps
- Send a completion message via `send_message` to your parent orchestrator with key conclusions and artifact paths.
</USER_REQUEST>
