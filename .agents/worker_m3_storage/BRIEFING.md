# BRIEFING — 2026-09-21T20:36:00Z

## Mission
Milestone 3 Worker: Migrate media storage from Vercel Blob to Cloudflare R2, refactor media server actions, update Next.js image configuration, normalize storefront image references, remove @vercel/blob, and verify builds (typecheck, lint, build, build:cf).

## 🔒 My Identity
- Archetype: implementer / qa
- Roles: implementer, qa
- Working directory: c:\Users\wilkb\Desktop\Projekte\checkpot\website\.agents\worker_m3_storage
- Original parent: 32447248-350f-4fae-a61a-e695e44774cb
- Milestone: Milestone 3: Media Storage Migration (Vercel Blob -> Cloudflare R2)

## 🔒 Key Constraints
- File ownership:
  - `src/lib/storage/*`
  - `src/app/admin/media/actions.ts`
  - `next.config.ts`
  - `package.json` (removing `@vercel/blob`)
  - Storefront image references in `src/app/(public)/page.tsx`, `src/app/(public)/ueber-uns/page.tsx`, `src/app/(public)/kontakt/page.tsx`
- Must preserve all media upload security checks (auth, 5MB size, magic-byte MIME validation, secure UUID filename, immutable caching header, Neon DB record, cascade delete, usage protection).
- Unoptimized images in next.config.ts for Workers runtime compatibility.
- Remote patterns include R2 domains and preserve legacy blob for zero downtime.
- Must pass `npm run typecheck`, `npm run lint`, `npm run build`, `npm run build:cf`.
- Genuine implementation — no cheating, facade, or dummy logic.

## Current Parent
- Conversation ID: 32447248-350f-4fae-a61a-e695e44774cb
- Updated: 2026-09-21T20:36:00Z

## Task Summary
- **What to build**:
  1. `src/lib/storage/index.ts`: R2 storage abstraction with `uploadFile`, `deleteFile`, `getPublicUrl`, with Cloudflare Workers R2 binding (`MEDIA_BUCKET`) and local dev fallback.
  2. `src/app/admin/media/actions.ts`: Refactor to use R2 storage abstraction instead of `@vercel/blob`.
  3. `next.config.ts`: Add `images.unoptimized: true` and remotePatterns for R2 & legacy Blob.
  4. Normalize storefront entrance images in `page.tsx`, `ueber-uns/page.tsx`, and `kontakt/page.tsx`.
  5. Remove `@vercel/blob` from `package.json` and ensure no imports remain.
  6. Verify typecheck, lint, standard build, and edge build (`build:cf`).
- **Success criteria**: All tests/builds pass, zero @vercel/blob references, robust R2 integration.
- **Interface contracts**: PROJECT.md, survey report and handoff.
- **Code layout**: src/lib/storage, src/app/admin/media, src/app/(public)

## Key Decisions Made
- Native Workers R2 binding (`MEDIA_BUCKET` via `cloudflare:workers`) used for runtime upload and deletion, avoiding AWS SDK bundle bloat and CPU signing overhead.
- Dynamic loader with graceful dev fallback in `src/lib/storage/index.ts` allows standard Next.js local Node development (`next dev` / `next build`) without runtime module resolution crashes.
- Ambient type definition `src/lib/storage/cloudflare.d.ts` provides clean typing without polluting global DOM types.
- Set `images.unoptimized: true` in `next.config.ts` because client-side pre-compression via `compressImage()` already resizes images, avoiding server-side Sharp/libvips binary requirements.
- Retained `*.public.blob.vercel-storage.com` alongside `media.checkpot.at`, `*.r2.dev`, and `*.cloudflarestorage.com` in `remotePatterns` for zero visual downtime during migration.
- Normalized storefront entrance images to `STOREFRONT_IMAGE_URL` across `page.tsx`, `ueber-uns/page.tsx`, and `kontakt/page.tsx`.

## Artifact Index
- `.agents/worker_m3_storage/DISPATCH.md` — assignment
- `.agents/worker_m3_storage/BRIEFING.md` — persistent memory
- `.agents/worker_m3_storage/progress.md` — heartbeat and progress tracker
- `.agents/worker_m3_storage/changes.md` — detailed change log
- `.agents/worker_m3_storage/handoff.md` — final handoff report
- `tests/empirical-m3-storage.ts` — empirical test suite (14/14 pass)

## Change Tracker
- **Files modified**:
  - `src/lib/storage/index.ts` (created): R2 storage abstraction service
  - `src/lib/storage/cloudflare.d.ts` (created): ambient typing for cloudflare:workers
  - `src/app/admin/media/actions.ts`: refactored upload/delete to use R2 storage abstraction
  - `next.config.ts`: added images.unoptimized and R2 remotePatterns
  - `package.json`: removed @vercel/blob dependency
  - `src/app/(public)/page.tsx`: normalized storefront image to STOREFRONT_IMAGE_URL
  - `src/app/(public)/ueber-uns/page.tsx`: normalized storefront images to STOREFRONT_IMAGE_URL
  - `src/app/(public)/kontakt/page.tsx`: normalized storefront image to STOREFRONT_IMAGE_URL
  - `tests/empirical-m3-storage.ts`: empirical verification test suite
- **Build status**: PASS (typecheck: 0 errors, lint: 0 errors, build: 29 routes, build:cf: 282 kB bundle)
- **Pending issues**: None

## Quality Status
- **Build/test result**: All builds and tests passed cleanly.
- **Lint status**: 0 errors, 13 pre-existing non-blocking warnings in test/scratch files.
- **Tests added/modified**: 14 tests in `tests/empirical-m3-storage.ts` (100% pass).

## Loaded Skills
- None
