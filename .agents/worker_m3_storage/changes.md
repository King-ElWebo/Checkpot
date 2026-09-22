# Milestone 3 Changes: Media Storage Migration (Vercel Blob → Cloudflare R2)

**Worker:** Milestone 3 Worker (`worker_m3_storage`)  
**Date:** 2026-09-21T20:34:00Z  

---

## 1. Summary of Changes

Milestone 3 successfully decouples media storage and delivery from Vercel Blob and migrates the architecture to **Cloudflare R2** using native Workers bindings (`cloudflare:workers` `env.MEDIA_BUCKET` via `R2Bucket`), with an intelligent fallback for local Node.js development. All upload security checks (admin authentication, 5MB limit, magic-byte MIME validation, secure UUID naming, immutable caching headers, Neon DB persistence, usage deletion guard) have been strictly preserved. `@vercel/blob` has been completely eliminated from dependencies and imports. Next.js image optimization is configured for Workers edge execution via `unoptimized: true` with dual-origin remote patterns, and storefront entrance images across public pages are normalized to use canonical R2 delivery with fallbacks.

---

## 2. File Modification Details

### 2.1 `src/lib/storage/index.ts` (New File)
- **Purpose:** Centralized Cloudflare R2 storage abstraction service.
- **Key Functions:**
  - `uploadFile(key: string, file: File | Blob | Uint8Array, options: { contentType: string; cacheControl?: string }): Promise<{ url: string; key: string }>`:
    - Normalizes destination key via `extractStorageKey`.
    - Resolves `MEDIA_BUCKET` binding dynamically from `cloudflare:workers` or `globalThis`.
    - Converts `File`/`Blob` via `arrayBuffer()` or passes `Uint8Array` directly.
    - Sets `httpMetadata` (`contentType` and immutable `cacheControl`).
    - Provides graceful local fallback logging simulated upload when running in local Node development (`process.env.NODE_ENV === "development"`).
    - Fails closed in production if binding is unavailable.
  - `deleteFile(keyOrUrl: string): Promise<void>`:
    - Extracts storage key from relative path or full URL.
    - Executes `bucket.delete(cleanKey)`.
    - Provides graceful local fallback logging simulated deletion in dev mode.
  - `getPublicUrl(key: string): string`:
    - Constructs `${getPublicUrlPrefix()}/${cleanKey}` ensuring no double slashes.
  - `getPublicUrlPrefix(): string`:
    - Reads from `R2_PUBLIC_URL_PREFIX`, `NEXT_PUBLIC_R2_PUBLIC_URL_PREFIX`, or `NEXT_PUBLIC_R2_PUBLIC_DOMAIN`, defaulting to canonical `https://media.checkpot.at`.
  - `getStorefrontImageUrl(): string` & `STOREFRONT_IMAGE_URL`:
    - Normalizes storefront image resolution: defaults to `getPublicUrl("store/checkpot-storefront-entrance.jpg")` with local fallback support (`/customer/christa-storefront.jpg`) and legacy Blob fallback (`LEGACY_BLOB_STOREFRONT_IMAGE_URL`).

### 2.2 `src/lib/storage/cloudflare.d.ts` (New File)
- **Purpose:** Ambient module declaration for `declare module "cloudflare:workers"`.
- **Content:** Types `env.MEDIA_BUCKET` as `import("@cloudflare/workers-types").R2Bucket`.

### 2.3 `src/app/admin/media/actions.ts`
- **Replaced `@vercel/blob`:**
  - Removed `import { put, del } from "@vercel/blob"`.
  - Added `import { uploadFile, deleteFile } from "@/lib/storage"`.
- **Upload Action (`uploadMediaAction`):**
  - Replaced `put(\`media/${secureFilename}\`, file, { access: "public" })` with:
    ```typescript
    const key = `media/${secureFilename}`;
    const contentType = ext === "jpg" ? "image/jpeg" : ext === "png" ? "image/png" : "image/webp";

    const { url } = await uploadFile(key, file, {
      contentType,
      cacheControl: "public, max-age=31536000, immutable",
    });
    ```
  - Preserved all security controls: `requireAdmin()`, 5MB size limit (`file.size > 5 * 1024 * 1024`), magic bytes verification (PNG `89504e47`, JPG `ffd8ff`, WEBP `52494646`...`57454250`), UUID naming (`crypto.randomUUID()`), and Neon DB insertion.
- **Delete Action (`deleteMediaAction`):**
  - Replaced `await del(dbMedia.url)` with `await deleteFile(dbMedia.url)`.
  - Preserved usage guard (`getMediaUsage(id)` with `force` bypass requirement) and cascade deletion (R2 object removal + Neon DB record deletion + cache revalidation).

### 2.4 `next.config.ts`
- **Image Optimization Configuration:**
  - Added `images.unoptimized: true`: Prevents runtime Sharp/libvips compilation dependencies on Workers edge nodes; images are pre-compressed and resized client-side before upload via `compressImage()`.
  - Updated `images.remotePatterns` with dual-origin support:
    - Retained `*.public.blob.vercel-storage.com` for zero-downtime transitional support.
    - Added `media.checkpot.at` (canonical R2 custom domain).
    - Added `*.r2.dev` (staging / Cloudflare managed public bucket domain).
    - Added `*.cloudflarestorage.com` (S3 API direct endpoint).

### 2.5 `package.json`
- **Dependency Removal:**
  - Removed `"@vercel/blob": "^2.8.0"` from `dependencies`.
  - Verified 0 remaining imports of `@vercel/blob` across `src/`.

### 2.6 Storefront Image Normalization Across Public Pages
- Replaced hardcoded Vercel Blob URL `https://hgrtkumqrh0cwc66.public.blob.vercel-storage.com/store/checkpot-storefront-entrance.jpg` with `src={STOREFRONT_IMAGE_URL}` from `@/lib/storage` in:
  - `src/app/(public)/page.tsx` (line 284)
  - `src/app/(public)/ueber-uns/page.tsx` (lines 137, 177)
  - `src/app/(public)/kontakt/page.tsx` (line 235)

### 2.7 `tests/empirical-m3-storage.ts` (New Test Suite)
- Authored 14 empirical verification tests covering:
  - Key extraction for relative paths and full URLs.
  - Public URL prefix defaults and environment variable overrides.
  - Storefront image resolution and fallback modes (R2, local, legacy Blob).
  - Development fallback behavior for upload and deletion when bindings are absent.
  - Genuine `R2Bucket` mock verification confirming parameters (`key`, `value`, `httpMetadata.contentType`, `httpMetadata.cacheControl`).
  - Package dependencies audit ensuring `@vercel/blob` is absent.
  - Source code audit ensuring 0 lingering `@vercel/blob` imports in `src/`.
  - `next.config.ts` validation (`unoptimized: true` and remotePatterns).
  - Public page template verification ensuring `STOREFRONT_IMAGE_URL` usage.
