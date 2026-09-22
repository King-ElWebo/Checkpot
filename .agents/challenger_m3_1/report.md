# Milestone 3 Empirical Challenge Report: Media Storage Migration (Vercel Blob -> Cloudflare R2)

**Challenger:** Challenger 1 (M3) (`challenger_m3_1`)  
**Target Milestone:** Milestone 3 (Media Storage & R2 Integration)  
**Parent Orchestrator:** `32447248-350f-4fae-a61a-e695e44774cb`  
**Date:** 2026-09-21T22:42:00+02:00  
**Verdict:** **APPROVE** (Low Risk, Non-Blocking Caveat Noted)

---

## Challenge Summary

**Overall risk assessment**: **LOW**

The Milestone 3 implementation successfully replaces `@vercel/blob` with Cloudflare R2 native Workers bindings (`env.MEDIA_BUCKET`), implements robust development fallbacks, preserves upload security constraints (magic bytes, 5MB limit, UUID filenames, metadata DB persistence, deletion usage locks), configures `next.config.ts` (`images.unoptimized = true` and 4 remote patterns), and normalizes public storefront images.

All 14 baseline empirical tests pass with exit code 0. In addition, Challenger 1 authored and executed an expanded 29-test empirical stress harness (`tests/challenger-1-m3-empirical.ts`) covering payload types (`Uint8Array`, `Blob`, `File`), binding resolution hierarchies, production fail-closed behavior, magic-byte tampering, and Workers edge bundle integrity. All 29 stress tests passed with exit code 0.

Build outputs (`npm run typecheck`, `npm run lint`, `npm run build` [29/29 routes], `npm run build:cf` [281.93 kB bundle]) compiled cleanly. Zero occurrences of `@vercel/blob` exist in `package.json` or `src/`.

---

## Challenges & Stress-Testing Findings

### [Low] Challenge 1: Bare Scheme URL Input to `extractStorageKey`

- **Assumption challenged**: That any string starting with `http://` or `https://` passed to `extractStorageKey` can be parsed by `new URL()` or will have its scheme stripped upon failure.
- **Attack scenario**: If an invalid URL such as `"https://"` (scheme without host or path) is passed to `extractStorageKey("https://")`, `new URL("https://")` throws a `TypeError: Invalid URL`. In the catch block of `src/lib/storage/index.ts` (lines 25-27), the code returns `trimmed.replace(/^\/+/, "")`. Because `"https://"` starts with `"h"` rather than `"/"`, no characters are removed, and the function returns `"https://"`.
- **Blast radius**: Minimal to zero.
  1. In standard application flows, `extractStorageKey` is called with:
     - Generated keys: `media/<uuid>.<ext>`
     - Storefront entrance key: `store/checkpot-storefront-entrance.jpg`
     - Database media URLs: `https://media.checkpot.at/media/<uuid>.<ext>` or `https://*.public.blob.vercel-storage.com/media/<uuid>.<ext>`
  2. All database records and upload workflows produce valid URLs that parse cleanly via `new URL()`.
  3. In `deleteFile("https://")`, the call does not throw an unhandled exception. Moreover, in `src/app/admin/media/actions.ts:180-183`, `deleteFile` is wrapped in a `try/catch` block, guaranteeing that even an R2 deletion anomaly will never crash admin deletion or corrupt Neon DB integrity.
- **Mitigation**:
  In future maintenance, the catch block in `src/lib/storage/index.ts:26` could be hardened with a regex:
  ```ts
  try {
    const url = new URL(trimmed);
    return url.pathname.replace(/^\/+/, "");
  } catch {
    return trimmed.replace(/^https?:\/\/[^/]*\/?/, "").replace(/^\/+/, "");
  }
  ```
  This is a minor cosmetic enhancement, not a blocker for Milestone 3 completion.

---

### [Info] Challenge 2: Bundle Size & AWS SDK Bloat Verification

- **Assumption challenged**: That R2 integration might accidentally pull in `@aws-sdk/client-s3` or other heavyweight S3 clients, causing Cloudflare Workers free-tier bundle bloat and CPU-intensive AWS SigV4 signing overhead.
- **Attack scenario**: Inspect `dist/server/ssr/index.js` and `package.json` for S3 client dependencies.
- **Empirical result**:
  - `package.json` contains zero AWS SDK dependencies.
  - `dist/server/ssr/index.js` does not contain `@aws-sdk/client-s3`.
  - The entire Cloudflare Workers edge bundle is only **281.93 kB** (gzip: **88.23 kB**), well below Cloudflare Workers limits.
  - Uses native Workers binding `R2Bucket` methods (`put`, `delete`), eliminating HMAC-SHA256 signature computation overhead and ensuring <10ms CPU compatibility on Workers Free tier.

---

### [Info] Challenge 3: Image Optimization & Workers Edge Constraints

- **Assumption challenged**: Next.js image optimization requires Node C++ native bindings (`sharp` / `libvips`) or paid Cloudflare Image Resizing.
- **Attack scenario**: Check whether `<Image>` components trigger server-side resizing errors in the Cloudflare runtime.
- **Empirical result**:
  - `next.config.ts` explicitly configures `images.unoptimized = true`.
  - Client-side pre-compression in `src/lib/image-compression.ts` handles resizing (`maxWidth = 1920`, JPEG/WebP quality `0.8`) before uploading.
  - Four remote patterns are configured to ensure uninterrupted delivery:
    1. `media.checkpot.at` (canonical custom domain)
    2. `*.r2.dev` (staging / Cloudflare managed public domain)
    3. `*.cloudflarestorage.com` (S3 API direct endpoint)
    4. `*.public.blob.vercel-storage.com` (legacy Vercel Blob rollback path)
  - Result: Fully verified, zero image breakage, zero dependency on server-side image processing.

---

## Stress Test Results

### 1. Baseline Test Suite (`tests/empirical-m3-storage.ts`): 14/14 PASS
- `extractStorageKey handles relative paths and leading slashes` -> `PASS`
- `extractStorageKey extracts pathname from full URLs` -> `PASS`
- `getPublicUrlPrefix defaults to https://media.checkpot.at` -> `PASS`
- `getPublicUrl generates correct public URL without duplicate slashes` -> `PASS`
- `Storefront image resolves to R2 default domain` -> `PASS`
- `Storefront image supports local fallback flag` -> `PASS`
- `Storefront image supports legacy blob fallback flag` -> `PASS`
- `uploadFile executes graceful dev fallback when MEDIA_BUCKET is absent` -> `PASS`
- `deleteFile executes graceful dev fallback when MEDIA_BUCKET is absent` -> `PASS`
- `uploadFile and deleteFile interact correctly with R2Bucket binding` -> `PASS`
- `package.json does not contain @vercel/blob` -> `PASS`
- `Zero @vercel/blob imports exist in src/` -> `PASS`
- `next.config.ts has unoptimized: true and includes R2 remotePatterns` -> `PASS`
- `Storefront images in public pages use STOREFRONT_IMAGE_URL` -> `PASS`

### 2. Challenger 1 Comprehensive Stress Suite (`tests/challenger-1-m3-empirical.ts`): 29/29 PASS
- `extractStorageKey handles normal relative paths` -> `PASS`
- `extractStorageKey handles single and multiple leading slashes` -> `PASS`
- `extractStorageKey extracts pathname from valid HTTP/HTTPS URLs` -> `PASS`
- `extractStorageKey strips query parameters and hash fragments from full URLs` -> `PASS`
- `extractStorageKey handles empty, null, undefined, whitespace` -> `PASS`
- `getPublicUrlPrefix defaults to https://media.checkpot.at when env is clean` -> `PASS`
- `getPublicUrlPrefix prioritizes R2_PUBLIC_URL_PREFIX and strips trailing slashes` -> `PASS`
- `getPublicUrlPrefix respects NEXT_PUBLIC_R2_PUBLIC_DOMAIN` -> `PASS`
- `getPublicUrl formats correct canonical URL with clean slash separation` -> `PASS`
- `Default storefront URL points to R2 canonical domain` -> `PASS`
- `getStorefrontImageUrl respects NEXT_PUBLIC_STORE_IMAGE_URL override` -> `PASS`
- `getStorefrontImageUrl respects NEXT_PUBLIC_USE_LOCAL_STORE_IMAGE` -> `PASS`
- `getStorefrontImageUrl respects NEXT_PUBLIC_USE_LEGACY_BLOB` -> `PASS`
- `uploadFile handles Uint8Array, Blob, and File payloads against R2 binding` -> `PASS`
- `uploadFile supports globalThis.env.MEDIA_BUCKET binding resolution` -> `PASS`
- `deleteFile invokes bucket.delete with normalized key from full URL or relative key` -> `PASS`
- `uploadFile and deleteFile fail closed in NODE_ENV=production when binding is missing` -> `PASS`
- `deleteFile on empty or blank input returns early without throwing` -> `PASS`
- `Magic byte: Valid PNG accepted` -> `PASS`
- `Magic byte: Valid JPG (SOI) accepted` -> `PASS`
- `Magic byte: Valid WebP accepted` -> `PASS`
- `Magic byte: Malicious or non-image payloads rejected (WAV, PDF, HTML, Empty)` -> `PASS`
- `next.config.ts has images.unoptimized = true` -> `PASS`
- `next.config.ts remotePatterns includes R2 and legacy Blob domains` -> `PASS`
- `wrangler.jsonc defines MEDIA_BUCKET binding with bucket_name checkpot-media` -> `PASS`
- `Zero occurrences of @vercel/blob in package.json and src/` -> `PASS`
- `Public storefront images normalize to STOREFRONT_IMAGE_URL` -> `PASS`
- `Cloudflare Workers bundle dist/server/ssr/index.js exists and is free of @vercel/blob` -> `PASS`
- `Cloudflare Workers bundle does not include heavy @aws-sdk/client-s3` -> `PASS`

---

## Unchallenged Areas

- **Live Cloudflare R2 Remote Bucket Mutation**: The test runs were executed against simulated and mock R2 bucket bindings and local development runtimes. Live Cloudflare API / dashboard interaction is out of scope until deployment/cutover phase in Milestone 5.
- **Milestone 4 Media Migration Ledger Execution**: Actual migration of 18 existing database media objects from Vercel Blob to R2 is assigned to Milestone 4 (`scripts/migrate-media-to-r2.mjs`).
