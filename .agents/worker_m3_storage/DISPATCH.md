## 2026-09-21T20:16:00Z
You are the Milestone 3 Worker for the Checkpot Next.js 16 Cloudflare Workers migration.

Your working directory is:
`c:\Users\wilkb\Desktop\Projekte\checkpot\website\.agents\worker_m3_storage`

Your parent orchestrator is:
Conversation ID: 32447248-350f-4fae-a61a-e695e44774cb

MANDATORY FIRST STEP: Read the authoritative user request at:
`c:\Users\wilkb\Desktop\Projekte\checkpot\website\.agents\ORIGINAL_REQUEST.md`
Also read:
`c:\Users\wilkb\Desktop\Projekte\checkpot\website\.agents\orchestrator_1\PROJECT.md`
and the survey handoff at:
`c:\Users\wilkb\Desktop\Projekte\checkpot\website\.agents\explorer_survey_storage\handoff.md`
and survey report at:
`c:\Users\wilkb\Desktop\Projekte\checkpot\website\.agents\explorer_survey_storage\report.md`.

MANDATORY INTEGRITY WARNING:
DO NOT CHEAT. All implementations must be genuine. DO NOT hardcode test results, create dummy/facade implementations, or circumvent the intended task. A teamwork_preview_auditor will independently verify your work. Integrity violations WILL be detected and your work WILL be rejected.

File Ownership:
You own exclusively:
- `src/lib/storage/*`
- `src/app/admin/media/actions.ts`
- `next.config.ts`
- `package.json` (removing `@vercel/blob` dependency)
- Storefront image references in `src/app/(public)/page.tsx`, `src/app/(public)/ueber-uns/page.tsx`, `src/app/(public)/kontakt/page.tsx`

Your Objective (Milestone 3: Media Storage Migration — Vercel Blob -> Cloudflare R2):
1. R2 Storage Abstraction (`src/lib/storage/index.ts`):
   - Implement storage service using Cloudflare Workers R2 binding (`env.MEDIA_BUCKET` via `cloudflare:workers` or runtime environment).
   - Functions required:
     - `uploadFile(key: string, file: File | Blob | Uint8Array, options: { contentType: string, cacheControl?: string }): Promise<{ url: string, key: string }>`
     - `deleteFile(key: string): Promise<void>`
     - `getPublicUrl(key: string): string` (defaults to `https://media.checkpot.at/${key}` or transitional domain from env/vars).
   - Ensure a graceful development fallback for local Node development outside Workerd if ever needed.
2. Media Actions Refactor (`src/app/admin/media/actions.ts`):
   - Replace `@vercel/blob` (`put` and `del`) with the new R2 storage abstraction.
   - Strictly preserve all security and validation constraints:
     - `requireAdmin()` authentication check.
     - 5MB maximum file size check (`5 * 1024 * 1024`).
     - Magic-byte MIME verification (JPEG: `ffd8ff`, PNG: `89504e47`, WebP: `52494646` ... `57454250`).
     - Secure UUID filename generation (`media/${crypto.randomUUID()}.${ext}`).
     - Immutable caching header (`Cache-Control: "public, max-age=31536000, immutable"`).
     - Neon DB persistence: insert record into `media` table.
     - Usage protection on delete: check `getMediaUsage(id)`; reject delete if `usage.totalCount > 0` unless `force === true`.
     - Cascade delete: delete object from R2 and delete record from Neon.
3. Image Delivery & Next.js Configuration (`next.config.ts`):
   - Set `images.unoptimized: true` (uploaded media is already compressed in browser via `compressImage()`, avoiding server-side Sharp dependencies on Workers).
   - In `images.remotePatterns`, add R2 domains:
     - `media.checkpot.at`
     - `*.r2.dev`
     - `*.cloudflarestorage.com`
     - Retain `*.public.blob.vercel-storage.com` to guarantee zero visual downtime during transitional phase.
4. Normalize Hardcoded Store Image in Public Pages:
   - In `src/app/(public)/page.tsx:284`, `src/app/(public)/ueber-uns/page.tsx:137,177`, and `src/app/(public)/kontakt/page.tsx:235`, normalize the storefront entrance image URL so it resolves via R2 public delivery or local fallback while retaining the legacy Blob fallback.
5. Package Dependencies:
   - Remove `@vercel/blob` from `package.json` dependencies and ensure zero imports remain across the repository.
6. Verification:
   - Run `npm run typecheck` (0 errors).
   - Run `npm run lint` (0 errors).
   - Run `npm run build` (standard build passes).
   - Run `npm run build:cf` (Workers edge build passes).
   - Document commands, code diffs, and verification logs in your handoff.

Deliverables:
- Write changes description to `c:\Users\wilkb\Desktop\Projekte\checkpot\website\.agents\worker_m3_storage\changes.md`
- Write handoff report to `c:\Users\wilkb\Desktop\Projekte\checkpot\website\.agents\worker_m3_storage\handoff.md`
- Send completion message via `send_message` to parent orchestrator.
