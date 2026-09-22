# BRIEFING — 2026-09-21T15:38:20Z

## Mission
Conduct an authoritative technical survey on media storage and Vercel Blob -> Cloudflare R2 migration for Checkpot Next.js 16.

## 🔒 My Identity
- Archetype: explorer
- Roles: Storage & Media Explorer
- Working directory: c:\Users\wilkb\Desktop\Projekte\checkpot\website\.agents\explorer_survey_storage
- Original parent: 32447248-350f-4fae-a61a-e695e44774cb
- Milestone: Storage & Media Technical Survey for Cloudflare R2 Migration

## 🔒 Key Constraints
- Read-only investigation — do NOT implement
- Audit all Vercel Blob references across codebase
- Analyze Neon DB schema & media modeling
- Evaluate Cloudflare R2 integration (native bindings vs AWS SDK S3 client in OpenNext / vinext)
- Design upload security, migration strategy (zero downtime, safe rollback), and public delivery architecture

## Current Parent
- Conversation ID: 32447248-350f-4fae-a61a-e695e44774cb
- Updated: not yet

## Investigation State
- **Explored paths**:
  - `src/app/admin/media/actions.ts`: uploadMediaAction, deleteMediaAction, checkMediaUsageAction, updateMediaMetadataAction
  - `src/db/schema.ts`: media table, brands/outfits foreign keys and relations
  - `src/lib/repositories/media.ts`: getMediaById, listAllMediaForAdmin, getMediaUsage
  - `next.config.ts`: remotePatterns and image configuration
  - `src/lib/image-compression.ts`: client-side pre-upload resizing and WebP/JPEG compression
  - `src/components/admin/media-picker.tsx`, `media-gallery.tsx`, `upload/page.tsx`: UI consumers
  - Public pages: `/ueber-uns`, `/kontakt`, `/`, `/mode`, `/outfits`, `/marken`: `<Image>` usage and hardcoded store photo URLs
  - Neon DB live probe: 23 total media records (18 on Vercel Blob, 5 local fallback), 18 brands and 27 outfits referenced
- **Key findings**:
  - Native Workers R2 binding (`env.MEDIA_BUCKET`) is vastly superior to `@aws-sdk/client-s3` (0KB bundle vs 500KB+, 0ms SigV4 CPU overhead, zero access-key secrets).
  - Serving images directly via R2 Custom Domain (`media.checkpot.at`) or `*.r2.dev` costs 0 Worker requests and 0 Worker CPU time, protecting the 100k requests/day free tier quota.
  - Non-destructive migration script with SHA-256 byte parity verification and `migration-ledger.json` enables an instant 1-second database rollback.
  - Setting `images.unoptimized: true` in `next.config.ts` prevents runtime Sharp errors on Workers while preserving full layout responsiveness.
- **Unexplored areas**: None within media storage survey scope.

## Key Decisions Made
- Architecture decision: Native Workers R2 binding (`cloudflare:workers` `env.MEDIA_BUCKET`) for production.
- Delivery decision: R2 Custom Domain for zero-compute edge CDN delivery.
- Safety decision: Non-destructive copy from Vercel Blob, SHA-256 verification, and migration ledger for rollback.
- Configuration decision: Retain `*.public.blob.vercel-storage.com` in `remotePatterns` alongside R2 domains.

## Artifact Index
- DISPATCH.md — incoming dispatch instructions
- BRIEFING.md — persistent working memory
- progress.md — liveness heartbeat
- report.md — detailed technical survey report
- handoff.md — structured handoff report
