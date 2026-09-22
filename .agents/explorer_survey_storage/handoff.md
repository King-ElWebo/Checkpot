# Handoff Report: Storage & Media Technical Survey (Vercel Blob → Cloudflare R2)

**Agent Role:** Storage & Media Explorer  
**Task:** Authoritative survey on media storage and Vercel Blob → Cloudflare R2 migration  
**Working Directory:** `c:\Users\wilkb\Desktop\Projekte\checkpot\website\.agents\explorer_survey_storage`  
**Date:** 2026-09-21  

---

## 1. Observation

1. **Vercel Blob SDK in Actions:**
   - File: `src/app/admin/media/actions.ts`
   - Line 3: `import { put, del } from "@vercel/blob";`
   - Lines 64–66:
     ```typescript
     const blob = await put(`media/${secureFilename}`, file, {
       access: "public",
     });
     ```
   - Lines 174–178:
     ```typescript
     try {
       await del(dbMedia.url);
     } catch (err) {
       console.error("Vercel Blob deletion error:", err);
     }
     ```
   - Line 38: file size constraint: `if (file.size > 5 * 1024 * 1024) throw new Error(...)`
   - Lines 15–28: magic number verification: checks `PNG` (`89504e47`), `JPG` (`ffd8ff`), `WEBP` (`52494646` ... `57454250`).
   - Line 61: random UUID file naming: `const secureFilename = `${crypto.randomUUID()}.${ext}`;`
   - Lines 159–165: usage protection:
     ```typescript
     const usage = await getMediaUsage(id);
     if (usage.totalCount > 0 && !force) {
       throw new Error(
         `Dieses Bild wird derzeit bei ${usage.totalCount} Element(en) verwendet und kann nur mit expliziter Bestätigung gelöscht werden.`
       );
     }
     ```

2. **Package Dependencies:**
   - File: `package.json`
   - Line 18: `"@vercel/blob": "^2.8.0"`
   - Line 23: `"next": "^16.3.0"`
   - Line 24: `"react": "^19.2.8"`

3. **Remote Patterns in Next Config:**
   - File: `next.config.ts`
   - Lines 5–13:
     ```typescript
     images: {
       remotePatterns: [
         {
           protocol: "https",
           hostname: "*.public.blob.vercel-storage.com",
           port: "",
         },
       ],
     },
     ```

4. **Database Schema & Entity Relations:**
   - File: `src/db/schema.ts`
   - Lines 50–60: `media` table with `id: uuid`, `url: text`, `alt: text`, `title: text`, `rights: text`, `focalPoint: text`, `season: text`.
   - Lines 71–72: `brands.logoMediaId` and `brands.imageMediaId` reference `media.id` with `onDelete: "set null"`.
   - Line 101: `outfits.mediaId` references `media.id` with `onDelete: "set null"`.

5. **Live Database Inspection:**
   - Direct query to Neon database returned:
     - `TOTAL_MEDIA_RECORDS`: 23 rows.
     - 18 records hosted on Vercel Blob with hostname `hgrtkumqrh0cwc66.public.blob.vercel-storage.com`.
     - 5 records with local fallback `/customer/` paths.
     - 18 brands reference media items (`imageMediaId`).
     - 27 outfits reference media items (`mediaId`).
   - Vercel Blob URL key patterns: `media/<uuid>.<ext>`, `outfits/<timestamp>-<hash>.jpg`, `brands/<slug>.jpg`.

6. **Hardcoded Store Image in Static Pages:**
   - In `src/app/(public)/ueber-uns/page.tsx` (lines 137, 177), `src/app/(public)/kontakt/page.tsx` (line 235), `src/app/(public)/page.tsx` (line 284):
     `src="https://hgrtkumqrh0cwc66.public.blob.vercel-storage.com/store/checkpot-storefront-entrance.jpg"`

7. **Client-Side Image Optimization:**
   - File: `src/lib/image-compression.ts`
   - Resizes all uploaded images in the browser to `maxWidth = 1920` and compresses JPEG/WebP with `quality = 0.8`.

---

## 2. Logic Chain

1. **Native Workers Binding vs AWS SDK:**
   - Observation 1 & 2: Vercel Blob is called directly inside Next.js Server Actions (`uploadMediaAction`, `deleteMediaAction`).
   - Observation 2: Next.js 16 will run on Cloudflare Workers via vinext (or OpenNext fallback).
   - In vinext, `import { env } from "cloudflare:workers"` exposes `env.MEDIA_BUCKET` directly to Server Actions.
   - Using `@aws-sdk/client-s3` would add 400–600KB bundle overhead, require 3 extra access-key secrets, and incur AWS SigV4 SHA-256 CPU overhead on every upload/delete, jeopardizing the 10ms CPU limit on Workers Free tier.
   - **Inference:** The production application must use native Workers R2 bindings (`env.MEDIA_BUCKET`), while `@aws-sdk/client-s3` is reserved solely for out-of-band migration CLI scripts.

2. **Public Image Delivery Architecture:**
   - Public images on Checkpot are lookbook outfits and brand assets requested on every page visit.
   - A Worker route handler proxying R2 images would consume 1 Worker request and ~1–3ms CPU per uncached image request, rapidly depleting the 100,000 requests/day Workers Free quota.
   - Cloudflare R2 supports Custom Domains (e.g. `media.checkpot.at`) and managed public access (`*.r2.dev`) which serve static assets directly via Cloudflare's global edge CDN with 0 Worker invocations and 0 Worker CPU usage.
   - **Inference:** Media must be served publicly via R2 Custom Domain (production) or `*.r2.dev` (staging/dev).

3. **Safe, Non-Destructive Data Migration:**
   - Observation 5: Exactly 18 media items are hosted on Vercel Blob; 18 brands and 27 outfits link to them.
   - Observation 6: A store entrance image is also referenced in static JSX pages.
   - Because Vercel Blob URLs are publicly accessible via HTTP, an automated migration script can download each object, calculate its SHA-256 hash, upload it to R2 with identical key (`media/...`, `outfits/...`, `brands/...`, `store/...`), and verify byte-size and SHA-256 hash match before touching the database.
   - Original Vercel Blob objects are never deleted during migration, guaranteeing zero data loss.
   - A migration ledger (`migration-ledger.json`) enables an instantaneous 1-second rollback script (`scripts/rollback-media-urls.mjs`) by running `UPDATE media SET url = originalUrl WHERE id = id`.

4. **Image Handling in `next.config.ts`:**
   - Observation 7: All uploaded media are pre-compressed and scaled in the browser (`compressImage()`).
   - Observation 3: Current `remotePatterns` only permits `*.public.blob.vercel-storage.com`.
   - Cloudflare Workers runtime lacks native `sharp`/`libvips` C++ libraries, and Cloudflare Image Resizing is a paid zone feature.
   - **Inference:** Setting `images.unoptimized: true` in `next.config.ts` and expanding `remotePatterns` to permit `media.checkpot.at`, `*.r2.dev`, and `*.public.blob.vercel-storage.com` ensures that `<Image>` components render cleanly without runtime server-side image processing costs.

---

## 3. Caveats

1. **R2 Public Domain DNS Cutover Constraint:**
   - The user rule strictly forbids production DNS cutovers during this migration.
   - Therefore, while `media.checkpot.at` is designed as the canonical production domain, during transitional testing, R2 bucket "Public Access" (`*.r2.dev`) or a development URL must be used until the owner authorizes DNS domain binding.
2. **Local Development Outside Workerd:**
   - If a developer runs standard `next dev` (without `vinext dev` or Miniflare), `cloudflare:workers` is not available in Node.js. A storage abstraction (`src/lib/storage/index.ts`) must gracefully detect the environment and provide an informative warning/mock if storage operations are invoked in standalone Node.
3. **Hardcoded Static JSX Assets:**
   - `store/checkpot-storefront-entrance.jpg` is hardcoded in 3 JSX files. Updating this requires editing the static JSX templates to use the configured R2 domain or local `/customer/` asset.

---

## 4. Conclusion

1. **Active Media Replacement:**
   Replace `@vercel/blob` in `src/app/admin/media/actions.ts` with a dedicated storage service (`src/lib/storage/index.ts`) backed by `env.MEDIA_BUCKET.put()` and `env.MEDIA_BUCKET.delete()`.
2. **Upload Security Preservation:**
   Keep all existing validation intact: `requireAdmin()`, 5MB limit, magic-byte checking for PNG/JPEG/WebP, UUID filename generation, `httpMetadata` with `Cache-Control: "public, max-age=31536000, immutable"`, and delete protection when media is referenced by brands or outfits.
3. **Existing Media Migration Strategy:**
   Run a non-destructive migration script (`scripts/migrate-media-to-r2.mjs`) that:
   - Downloads all 18 Vercel Blob assets and static store assets.
   - Computes SHA-256 and byte length.
   - Uploads to R2 preserving path keys.
   - Verifies SHA-256 byte parity.
   - Writes `media-migration-ledger.json` for rollback.
   - Updates `media.url` in Neon DB in a single safe transaction.
4. **Delivery & Remote Patterns:**
   Update `next.config.ts` with `unoptimized: true` and add `media.checkpot.at`, `*.r2.dev`, and `*.cloudflarestorage.com` to `remotePatterns` alongside `*.public.blob.vercel-storage.com`.

---

## 5. Verification Method

1. **Static & Type Verification:**
   - Inspect `report.md` at `c:\Users\wilkb\Desktop\Projekte\checkpot\website\.agents\explorer_survey_storage\report.md`.
   - Run `npm run typecheck` to verify no broken types in media modules.
2. **Database Integrity Verification:**
   - Query Neon DB: `SELECT count(*), url FROM media GROUP BY url;` to verify all media URLs resolve.
   - Check usage references: `SELECT count(*) FROM brands WHERE logo_media_id IS NOT NULL OR image_media_id IS NOT NULL;` (18 brands).
3. **Upload / Delete Verification (Post-Implementation):**
   - In `wrangler dev` / `vinext dev`, log into `/admin/media` and upload a test WebP/PNG/JPG image.
   - Verify file appears in R2 bucket via `wrangler r2 object get <bucket>/media/<uuid>.<ext>`.
   - Verify DB row is created in Neon.
   - Attempt to delete a referenced image: verify deletion is blocked with a 400 error unless forced.
   - Delete an unreferenced image: verify object is removed from R2 and row deleted from Neon.
4. **Delivery Verification:**
   - Visit `/outfits`, `/marken`, `/ueber-uns` in browser or curl; verify images render with HTTP 200 and `Cache-Control: public, max-age=31536000, immutable`.
