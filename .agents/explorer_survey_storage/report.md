# Technical Survey: Media Storage Architecture & Vercel Blob → Cloudflare R2 Migration

**Author:** Storage & Media Explorer  
**Date:** 2026-09-21  
**Project:** Checkpot Next.js 16 Cloudflare Workers Migration  
**Status:** Complete & Ready for Implementation  

---

## Executive Summary

The Checkpot application currently relies on `@vercel/blob` for admin-uploaded image storage, Vercel Blob public hostnames (`hgrtkumqrh0cwc66.public.blob.vercel-storage.com`) persisted in Neon PostgreSQL, and Next.js Image optimization through Vercel's edge infrastructure.

This survey establishes the complete technical blueprint to migrate media storage to **Cloudflare R2** using **native Cloudflare Workers bindings** (`cloudflare:workers` `env.MEDIA_BUCKET` in vinext, with OpenNext fallback compatibility), zero-worker-overhead public CDN delivery, a non-destructive media migration script with SHA-256 byte verification, and an instantaneous database rollback mechanism.

---

## 1. Full Audit of Vercel Blob Dependencies

A comprehensive grep across the entire codebase identified the following direct dependencies on Vercel Blob:

| File Path | Location / Reference | Description / Purpose | Migration Action |
|-----------|----------------------|-----------------------|------------------|
| `package.json` | Line 18: `"@vercel/blob": "^2.8.0"` | Vercel Blob SDK dependency | Replace with native Workers R2 binding (`cloudflare:workers`); remove `@vercel/blob` from runtime dependencies (or keep in devDependencies for migration script if needed). |
| `src/app/admin/media/actions.ts` | Line 3: `import { put, del } from "@vercel/blob";` | Upload (`put`) and deletion (`del`) logic | Replace with modular storage adapter (`src/lib/storage/index.ts`) using `env.MEDIA_BUCKET`. |
| `src/app/admin/media/actions.ts` | Lines 63–66: `await put(\`media/${secureFilename}\`, file, { access: "public" })` | Server-side upload to Vercel Blob | Replaced by `bucket.put(key, buffer, { httpMetadata: ... })`. |
| `src/app/admin/media/actions.ts` | Lines 174–178: `await del(dbMedia.url)` | Deletion from Vercel Blob | Replaced by `bucket.delete(key)` with key extraction. |
| `next.config.ts` | Lines 6–12: `remotePatterns: [{ protocol: "https", hostname: "*.public.blob.vercel-storage.com" }]` | Allowed image origins for `<Image>` | Extend to include R2 custom domain (`media.checkpot.at`) and `*.r2.dev` while **retaining** `*.public.blob.vercel-storage.com` for rollback and transition. |
| `.env.example` | Lines 17–18: `BLOB_READ_WRITE_TOKEN=` | Vercel Blob API read/write token | Remove from runtime requirements; introduce `MEDIA_BUCKET` binding in `wrangler.jsonc` and `R2_PUBLIC_URL_PREFIX`. |
| `src/app/(public)/ueber-uns/page.tsx` | Lines 137, 177: hardcoded store photo URL | Store entrance photo URL | Update to use R2 custom domain or local public customer asset. |
| `src/app/(public)/kontakt/page.tsx` | Line 235: hardcoded store photo URL | Store entrance photo URL | Update to use R2 custom domain or local public customer asset. |
| `src/app/(public)/page.tsx` | Line 284: hardcoded store photo URL | Store entrance photo URL | Update to use R2 custom domain or local public customer asset. |
| Documentation | `README.md`, `PROJECT-SPEC.md`, `CMS-READINESS.md`, `CONTENT-MAP.md` | References to Vercel Blob | Update operational documentation after cutover. |

---

## 2. Existing Media Modeling & Database Inspection

### 2.1 Neon Database Schema (`src/db/schema.ts`)
The `media` table is defined as:
```typescript
export const media = pgTable("media", {
  id: uuid("id").defaultRandom().primaryKey(),
  url: text("url").notNull(),
  alt: text("alt"),
  title: text("title"),
  rights: text("rights"),
  focalPoint: text("focal_point"), // e.g., "50% 50%"
  season: text("season"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});
```

### 2.2 Relational Usage & Constraints
Foreign key references to `media.id`:
- `brands.logoMediaId`: `uuid("logo_media_id").references(() => media.id, { onDelete: "set null" })`
- `brands.imageMediaId`: `uuid("image_media_id").references(() => media.id, { onDelete: "set null" })`
- `outfits.mediaId`: `uuid("media_id").references(() => media.id, { onDelete: "set null" })`

### 2.3 Live Database Inspection Findings
A non-destructive query to the active Neon database revealed:
- **Total `media` records:** 23 rows.
- **Breakdown by URL Origin:**
  - **Vercel Blob (`hgrtkumqrh0cwc66.public.blob.vercel-storage.com`):** 18 records.
  - **Local Static Assets (`/customer/...`):** 5 fallback records from initial seeding.
- **Vercel Blob Storage Key Structure:**
  - `media/<uuid>.<ext>` (e.g., `media/c12bc15c-acae-4cb0-bd15-9d9bfb619c57.jpg`)
  - `media/<name>-<hash>.<ext>` (e.g., `media/checkpot-logo-50W8fYc6aBPigdFsZi3befoTr5ff3u.svg`)
  - `outfits/<timestamp>-<hash>.jpg` (e.g., `outfits/20260818_111155-mtg0qbn6.jpg`)
  - `brands/<slug>.jpg` (e.g., `brands/happy-rainy-days-v2.jpg`)
- **Entities referencing media:**
  - **18 Brands** have active `imageMediaId` links.
  - **27 Outfits** have active `mediaId` links.

### 2.4 Media Rendering across the Site
- **Admin UI (`src/app/admin/...`):**
  - Uses standard HTML `<img>` elements with `src={item.url}` and CSS `objectPosition: item.focalPoint`.
  - Client-side image compression occurs in `src/lib/image-compression.ts` before upload: images are scaled to a maximum width of 1920px and compressed at quality `0.8` (JPEG/WebP) or transparency-preserved PNG.
- **Public Website (`src/app/(public)/...`):**
  - Uses Next.js `<Image>` from `next/image` with `fill`, responsive `sizes`, `objectPosition: media.focalPoint`, and `priority` on key hero elements.
  - Requires permitted hostnames in `next.config.ts` under `images.remotePatterns`.

---

## 3. Cloudflare R2 Integration Evaluation

### 3.1 Native Workers R2 Binding vs S3-Compatible SDK (`@aws-sdk/client-s3`)

| Evaluation Dimension | Native Workers R2 Binding (`env.MEDIA_BUCKET`) | S3-Compatible Client (`@aws-sdk/client-s3`) | Recommendation |
|----------------------|------------------------------------------------|---------------------------------------------|----------------|
| **Runtime Environment** | Executes natively inside Cloudflare Workers via internal IPC (`workerd`). | Runs over HTTPS invoking Cloudflare S3 endpoints. | **Native Binding** |
| **Worker Bundle Size** | **0 KB overhead** (built-in Workers API). | **+400 KB - 600 KB** (AWS SDK Core, Client-S3, Smithy middleware). | **Native Binding** |
| **CPU Time Impact** | **Near-zero CPU time** (direct C++ IPC binding). | **High CPU overhead** (AWS SigV4 SHA-256 request signing per call). Threatens 10ms Free tier CPU limit. | **Native Binding** |
| **Credential Management** | **Zero secrets needed** in Worker (access controlled by Worker binding). | Requires 3 secrets: `R2_ACCOUNT_ID`, `R2_ACCESS_KEY_ID`, `R2_SECRET_ACCESS_KEY`. | **Native Binding** |
| **Adapter Exposure (vinext)** | `import { env } from "cloudflare:workers";` — works directly in Server Actions and Route Handlers. | Standard Node SDK or fetch. | **Native Binding** |
| **Adapter Exposure (OpenNext)** | `import { getCloudflareContext } from "@opennextjs/cloudflare"; const { env } = getCloudflareContext();` | Standard Node SDK or fetch. | **Native Binding** |

**Conclusion:** Native Workers R2 binding is definitively the superior and required architecture for the production application. The S3-compatible SDK should only be used in standalone CLI migration scripts running outside the Workers runtime (e.g. from developer machines).

### 3.2 Storage Provider Architecture & Abstraction
To keep Server Actions clean, decoupled, and testable across both vinext and OpenNext (as well as local development), a modular storage provider is recommended:
```typescript
// src/lib/storage/index.ts
export interface StorageService {
  put(key: string, data: ArrayBuffer | Uint8Array, options: { contentType: string; cacheControl?: string }): Promise<{ url: string; key: string }>;
  delete(keyOrUrl: string): Promise<void>;
}
```

Implementation pattern for vinext:
```typescript
import { env } from "cloudflare:workers";

export async function uploadToR2(key: string, data: ArrayBuffer, contentType: string): Promise<string> {
  await env.MEDIA_BUCKET.put(key, data, {
    httpMetadata: {
      contentType,
      cacheControl: "public, max-age=31536000, immutable",
    },
  });
  const prefix = process.env.R2_PUBLIC_URL_PREFIX || "https://media.checkpot.at";
  return `${prefix.replace(/\/$/, "")}/${key}`;
}

export async function deleteFromR2(keyOrUrl: string): Promise<void> {
  const key = extractKeyFromUrl(keyOrUrl);
  if (key) {
    await env.MEDIA_BUCKET.delete(key);
  }
}
```

### 3.3 Upload Security & Validation
All existing security guarantees from `src/app/admin/media/actions.ts` must be preserved:
1. **Admin Authentication:** Guarded by `await requireAdmin()`, which validates the signed `jose` JWT admin session cookie. Unauthenticated calls fail closed.
2. **5MB Size Enforcement:** `if (file.size > 5 * 1024 * 1024) throw new Error(...)`.
3. **Magic-Byte MIME Validation:** Inspects raw file bytes via `Uint8Array`:
   - PNG: `89504e47`
   - JPEG: `ffd8ff`
   - WebP: `52494646` (RIFF) + `57454250` (WEBP)
   - Disallowed formats (e.g., SVG uploads via admin form, EXE, HTML, scripts) fail immediately.
4. **Collision-Proof Keys:** Filename generated via `crypto.randomUUID() + "." + ext`. User filenames are preserved only in the `media.title` database column.
5. **Database Consistency:** Insert into Neon `media` table occurs immediately after successful upload.
6. **Reference & Delete Protection:**
   - Calls `getMediaUsage(id)`.
   - If referenced by any brand (`logoMediaId` or `imageMediaId`) or outfit (`mediaId`), deletion is blocked unless `force === true`.
   - On deletion, both the R2 object and the database row are removed, and all affected Next.js routes (`/admin/media`, `/admin/brands`, `/admin/outfits`, `/`, `/marken`, `/outfits`, `/mode`) are revalidated via `revalidatePath`.

---

## 4. Media Migration Strategy (Vercel Blob → Cloudflare R2)

### 4.1 Zero-Downtime Migration Principles
1. **Non-Destructive:** Original Vercel Blob objects are **never deleted** during migration.
2. **Byte-Level Integrity:** Every transferred object is verified with SHA-256 before updating database pointers.
3. **Instant Rollback:** A JSON ledger is produced prior to database mutations, allowing 1-second restoration of original URLs.

### 4.2 Step-by-Step Migration Workflow
```
[1. Inventory] Scan Neon DB for all media where url contains vercel-storage.com
      │
      ▼
[2. Download & Hash] Fetch each object over HTTPS, compute SHA-256 and byteLength
      │
      ▼
[3. Upload to R2] Put object into R2 bucket with identical key and HTTP metadata
      │
      ▼
[4. Verify Integrity] Fetch object from R2 (or HEAD), compare byteLength and SHA-256
      │
      ▼
[5. Ledger Creation] Write migration-ledger.json (ID, Old URL, New URL, SHA-256)
      │
      ▼
[6. Update Neon DB] In a single transaction or batch, UPDATE media SET url = new_url
```

### 4.3 Key Extraction & URL Mapping
Because Vercel Blob URLs follow the structure:
`https://hgrtkumqrh0cwc66.public.blob.vercel-storage.com/<pathname>`
The R2 object key is simply:
`key = new URL(vercelUrl).pathname.replace(/^\//, "")`
For example:
- `https://.../outfits/20260818_111155-mtg0qbn6.jpg` → `outfits/20260818_111155-mtg0qbn6.jpg`
- `https://.../media/c12bc15c-acae-4cb0-bd15-9d9bfb619c57.jpg` → `media/c12bc15c-acae-4cb0-bd15-9d9bfb619c57.jpg`

New R2 Public URL:
`${R2_PUBLIC_URL_PREFIX}/${key}` (e.g. `https://media.checkpot.at/media/c12bc15c-acae-4cb0-bd15-9d9bfb619c57.jpg`).

### 4.4 Rollback Path
If any issue arises:
1. Run `node scripts/rollback-media-urls.mjs`.
2. The script iterates `migration-ledger.json` and executes:
   `UPDATE media SET url = $originalUrl WHERE id = $id`.
3. Because Vercel Blob objects were never deleted, all media immediately resolve to Vercel Blob again with zero data loss.

---

## 5. R2 Public Image Delivery Architecture

### 5.1 Delivery Method Comparison: Custom Domain vs Worker Route Handler

| Aspect | R2 Bucket Custom Domain (Recommended) | Worker Route Handler (`/api/media/[...key]`) |
|--------|---------------------------------------|---------------------------------------------|
| **Architecture** | Direct CNAME (`media.checkpot.at`) to Cloudflare R2 bucket. | Next.js API route reading `env.MEDIA_BUCKET.get(key)`. |
| **Worker Request Impact** | **0 Worker requests consumed.** Images served directly by Cloudflare CDN. | **1 Worker request per uncached image request.** Quickly burns 100k free requests/day. |
| **Worker CPU Impact** | **0 ms CPU.** | Consumes 1–3 ms CPU per image stream response. |
| **Edge Caching** | Native Cloudflare CDN tier caching at all global PoPs. | Requires manual `Cache-Control` header tuning and cache API handling. |
| **Development URL** | Cloudflare R2 managed `*.r2.dev` public bucket URL before DNS cutover. | Local route handler. |

**Decision:**
- **Production:** Attach a Cloudflare custom domain (`media.checkpot.at`) to the R2 bucket.
- **Staging / Preview:** Enable Cloudflare R2 "Public Access" on the bucket, providing `https://pub-<hash>.r2.dev` (or worker proxy if public access is restricted).
- **Environment Variable:** `R2_PUBLIC_URL_PREFIX` controls the base URL dynamically.

### 5.2 HTTP Metadata & Caching
Because all uploaded files receive immutable UUID filenames (`crypto.randomUUID()`), they are content-addressable and never mutated in place:
- **`Content-Type`:** Set accurately during upload (`image/jpeg`, `image/png`, `image/webp`).
- **`Cache-Control`:** `public, max-age=31536000, immutable`.
- Cloudflare CDN and client browsers cache the image for up to 1 year without conditional revalidation requests.

### 5.3 `next.config.ts` Remote Patterns (Dual Support)
To support both legacy Vercel Blob assets and new Cloudflare R2 assets during and after migration:
```typescript
// next.config.ts
const nextConfig: NextConfig = {
  poweredByHeader: false,
  images: {
    unoptimized: true, // Prevents server-side Sharp dependencies on Workers; images are already client-compressed
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.public.blob.vercel-storage.com",
      },
      {
        protocol: "https",
        hostname: "media.checkpot.at",
      },
      {
        protocol: "https",
        hostname: "*.r2.dev",
      },
      {
        protocol: "https",
        hostname: "*.cloudflarestorage.com",
      },
    ],
  },
  // ... redirects and headers ...
};
```

### 5.4 Image Optimization Analysis
In `next.config.ts`, setting `images.unoptimized: true` is strongly recommended for the following technical reasons:
1. Cloudflare Workers (`workerd`) does not support Node.js native binary extensions (`sharp` / `libvips`).
2. Checkpot's upload workflow (`src/lib/image-compression.ts`) already compresses and resizes all images in the client browser before upload to a maximum 1920px width and ~200–400KB size.
3. Enabling Cloudflare Image Resizing at runtime requires a paid Cloudflare Pro/Business plan, violating the strict Free-tier constraint.
4. Setting `unoptimized: true` allows `next/image` to continue providing exact layout dimensions, `sizes`, aspect ratios, and focal point styling while loading the optimized R2 original directly via Cloudflare CDN.

---

## 6. Implementation Readiness & Risk Matrix

| Risk Factor | Likelihood | Impact | Mitigation |
|-------------|------------|--------|------------|
| **Breaking changes to public images during migration** | Low | High | Retain `*.public.blob.vercel-storage.com` in `remotePatterns`. Run migration script non-destructively. |
| **Worker CPU limit exceeded during upload** | Very Low | High | Use native `env.MEDIA_BUCKET.put()` which executes via internal IPC, consuming negligible CPU. Avoid `@aws-sdk/client-s3` in Worker runtime. |
| **Incomplete data copy or corrupt image files** | Low | High | Verify every transferred object via SHA-256 comparison and byte-size parity before database URL updates. |
| **Local dev without Workers binding** | Medium | Medium | Graceful storage fallback in `src/lib/storage/index.ts` that warns or mocks storage when `env.MEDIA_BUCKET` is undefined during standalone `next dev`. |
| **Hardcoded static page image references** | Low | Low | Identified store photo URL in 3 static JSX files (`/ueber-uns`, `/kontakt`, `/`); update to use local `/customer/` asset or R2 URL. |
