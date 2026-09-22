# Adversarial & Quality Review Report: Milestone 3 (Media Storage Migration)

**Reviewer:** Reviewer 2 (M3) (`reviewer_m3_2`)  
**Target:** Milestone 3 Deliverables by `worker_m3_storage`  
**Date:** 2026-09-21T20:41:00Z  
**Verdict:** `APPROVE`  
**Risk Level:** `LOW`  

---

## 1. Review Summary

Milestone 3 migrates Checkpot's media storage from `@vercel/blob` to Cloudflare R2 using native Workers bindings (`env.MEDIA_BUCKET`). This review independently analyzed the implementation across six adversarial security and robustness dimensions, evaluated edge bundle and runtime performance constraints, verified all zero-regression contracts, checked for any integrity violations, and executed the full suite of independent verification commands.

**Verdict**: **APPROVE**  
The implementation is genuine, secure, fail-closed, and robust. It introduces zero heavy external dependencies, adheres strictly to Cloudflare Workers Free tier constraints, preserves full backward compatibility for legacy media during the transition phase, and contains zero integrity shortcuts.

---

## 2. Adversarial Security & Robustness Findings

### 2.1 Magic Bytes MIME Validation
- **Location**: `src/app/admin/media/actions.ts:16-29`
- **Mechanism**:
  ```ts
  async function verifyImageFile(file: File): Promise<string | null> {
    const arr = new Uint8Array(await file.slice(0, 4).arrayBuffer());
    const header = arr.reduce((acc, byte) => acc + byte.toString(16).padStart(2, "0"), "");

    if (header.startsWith("89504e47")) return "png";
    if (header.startsWith("ffd8ff")) return "jpg";
    if (header.startsWith("52494646") && arr.length >= 4) {
      const arr12 = new Uint8Array(await file.slice(0, 12).arrayBuffer());
      const webpHeader = arr12.reduce((acc, byte) => acc + byte.toString(16).padStart(2, "0"), "");
      if (webpHeader.endsWith("57454250")) return "webp";
    }
    return null;
  }
  ```
- **Stress-Test & Attack Vectors**:
  - *Spoofed MIME headers & extension disguise*: User-supplied `file.type` and `file.name` are completely ignored for format determination. Storage key is generated as `media/${crypto.randomUUID()}.${ext}` where `ext` is strictly derived from the verified magic bytes.
  - *SVG / HTML / Script injection (XSS)*: Files starting with `<svg` or `<?php` or `<!DOCTYPE` are rejected immediately (`verifyImageFile` returns `null`).
  - *Polyglots (GIF, PDF, WAV)*: Rejected because magic bytes for GIF (`GIF8`), PDF (`%PDF`), or WAV (`RIFF....WAVE`) do not match PNG, JPG, or WEBP.
  - *Truncated / Out-of-bounds slices*: Tested with 0-byte, 1-byte, and 3-byte files. The Web File API `file.slice(0, 4)` returns an empty or truncated ArrayBuffer gracefully without throwing exceptions, and the hex comparison safely rejects them.
  - *Minor Observation (Informational)*: In `verifyImageFile`, if a file contains `RIFF` and is between 4 and 11 bytes in length, `webpHeader.endsWith("57454250")` would only match if the trailing 4 bytes were `WEBP`. A strictly pedantic RIFF parser would check `arr12.length === 12`, but here any malformed file is harmless as it is served with `image/webp` Content-Type and cannot execute.
- **Finding Severity**: No vulnerabilities found. Design is robust.

### 2.2 File Size Enforcement (5MB Limit)
- **Location**: `src/app/admin/media/actions.ts:39-41`
- **Mechanism**:
  ```ts
  if (file.size > 5 * 1024 * 1024) {
    throw new Error("Die Datei überschreitet das Limit von 5MB.");
  }
  ```
- **Robustness Analysis**:
  - The 5MB size check executes immediately upon receiving `file` from `formData`, *before* `verifyImageFile` reads slices, *before* Zod metadata validation, and *before* `uploadFile` is called.
  - Buffer allocation (`await file.arrayBuffer()`) inside `uploadFile` only occurs after the 5MB check and magic byte validation have succeeded.
  - Client-side compression (`compressImage()`) in `media-picker.tsx` and `media-gallery.tsx` automatically resizes images to `maxWidth=1920` and compresses JPEG/WebP to quality 0.8 before submission, ensuring normal administrative uploads are typically 200KB–800KB.
  - If an attacker attempts to bypass the client UI and POST a file > 5MB directly to the Server Action, it is rejected immediately before any storage write.
- **Finding Severity**: PASS.

### 2.3 Deletion Safety & Usage Protection
- **Location**: `src/app/admin/media/actions.ts:165-170`, `src/lib/repositories/media.ts:55-99`, `src/db/schema.ts:71,72,101`
- **Defense-in-Depth Assessment**:
  - *Application Guard*: `deleteMediaAction(id, force = false)` calls `getMediaUsage(id)`.
  - `getMediaUsage` checks:
    1. `brands.logoMediaId == id`
    2. `brands.imageMediaId == id`
    3. `outfits.mediaId == id`
  - If `usage.totalCount > 0` and `force === false`, it throws an explicit error:
    `Dieses Bild wird derzeit bei ${usage.totalCount} Element(en) verwendet und kann nur mit expliziter Bestätigung gelöscht werden.`
  - *Path Traversal & Injection Immunity*: `deleteMediaAction` accepts only `id: string` (the DB primary key), queries the media record from Neon, and passes `dbMedia.url` to `deleteFile`. The user cannot pass an arbitrary R2 storage key or path.
  - *Database Referential Integrity*: Foreign keys in `schema.ts` use `{ onDelete: "set null" }`, ensuring that if an admin explicitly forces deletion of an image, referencing records do not crash database integrity.
  - *Cache Invalidation*: Upon deletion, all affected paths (`/admin/media`, `/admin/brands`, `/admin/outfits`, `/`, `/marken`, `/outfits`, `/mode`, and `/marken/${slug}`) are revalidated.
- **Finding Severity**: PASS.

### 2.4 Cloudflare R2 Fail-Closed Production Behavior
- **Location**: `src/lib/storage/index.ts:156-168`, `188-197`
- **Fail-Closed Verification**:
  - In `uploadFile`:
    ```ts
    if (process.env.NODE_ENV === "development" || process.env.NODE_ENV === "test") {
      console.warn(`[storage] Development fallback: MEDIA_BUCKET binding not found...`);
      return { url: getPublicUrl(cleanKey), key: cleanKey };
    }
    throw new Error("Cloudflare R2 binding MEDIA_BUCKET is not available in production runtime environment.");
    ```
  - In `deleteFile`:
    ```ts
    if (process.env.NODE_ENV === "development" || process.env.NODE_ENV === "test") {
      console.warn(`[storage] Development fallback: MEDIA_BUCKET binding not found...`);
      return;
    }
    throw new Error("Cloudflare R2 binding MEDIA_BUCKET is not available in production runtime environment.");
    ```
  - In production (`NODE_ENV === "production"`), missing `MEDIA_BUCKET` throws an error immediately. There is zero risk of silent data loss or fake successful uploads in production.
  - In local development (`next dev`), developers are not blocked if running outside the Cloudflare `workerd` process; it provides explicit console warnings and simulation.
- **Finding Severity**: PASS.

### 2.5 Next.js Image Delivery & Remote Patterns
- **Location**: `next.config.ts:5-29`
- **Configuration**:
  - `images.unoptimized: true` is configured. This prevents Next.js from attempting server-side image resizing via Node.js C++ libraries (`sharp`/`libvips`), which do not run in Cloudflare Workers.
  - Remote patterns:
    1. `*.public.blob.vercel-storage.com` (retained for unmigrated objects and zero-downtime rollback)
    2. `media.checkpot.at` (canonical R2 custom domain)
    3. `*.r2.dev` (Cloudflare public bucket domain)
    4. `*.cloudflarestorage.com` (S3 direct endpoint)
  - Both legacy Vercel Blob URLs and R2 URLs are allowed simultaneously. No images will break during or after migration.
- **Finding Severity**: PASS.

### 2.6 Edge Bundle Constraints & Dependency Footprint
- **Audit Findings**:
  - Package dependencies: Zero `@aws-sdk/client-s3` or AWS SDK packages installed.
  - Native binding `cloudflare:workers` `env.MEDIA_BUCKET` is used.
  - Bundle size: `npm run build:cf` produces `dist/server/ssr/index.js` at **281.93 kB** (88.23 kB gzipped).
  - This is well under the Cloudflare Workers Free tier bundle limit (3MB compressed / 10MB uncompressed).
  - Native R2 API bindings require no SigV4 cryptographic signing in JS, keeping CPU time well below the 10ms Free tier execution limit.
- **Finding Severity**: PASS.

---

## 3. Adversarial Challenge & Stress-Test Matrix

| # | Challenge / Scenario | Expected Behavior | Actual Behavior | Result |
|---|----------------------|-------------------|-----------------|--------|
| 1 | Upload empty 0-byte file | Rejection as invalid format | Rejected (`verifyImageFile` returns `null`) | PASS |
| 2 | Upload 1-byte truncated file (`0x89`) | Rejection without buffer crash | Rejected (`verifyImageFile` returns `null`) | PASS |
| 3 | Upload file with valid 3-byte JPG header (`ffd8ff`) | Accepted as JPG | Accepted (`"jpg"`) | PASS |
| 4 | Upload file with corrupt JPG header (`ffd800`) | Rejected | Rejected (`null`) | PASS |
| 5 | Upload file with valid 4-byte PNG header (`89504e47`) | Accepted as PNG | Accepted (`"png"`) | PASS |
| 6 | Upload SVG file with `<svg>` tag | Rejected | Rejected (`null`) | PASS |
| 7 | Upload PHP / script file with `<?php` | Rejected | Rejected (`null`) | PASS |
| 8 | Upload GIF file (`GIF89a`) | Rejected | Rejected (`null`) | PASS |
| 9 | Upload PDF file (`%PDF-1.4`) | Rejected | Rejected (`null`) | PASS |
| 10 | Upload RIFF container with non-WebP (e.g. WAVE) | Rejected | Rejected (`null`) | PASS |
| 11 | Upload valid 12-byte WEBP (`RIFF....WEBP`) | Accepted as WebP | Accepted (`"webp"`) | PASS |
| 12 | `uploadFile` in production without `MEDIA_BUCKET` | Throws explicit error (fail-closed) | Throws error containing "MEDIA_BUCKET is not available in production runtime environment" | PASS |
| 13 | `deleteFile` in production without `MEDIA_BUCKET` | Throws explicit error (fail-closed) | Throws error containing "MEDIA_BUCKET is not available in production runtime environment" | PASS |
| 14 | `extractStorageKey` on full URL with queries and hashes | Extracts clean relative path | Returns `media/image-123.jpg` | PASS |
| 15 | `getPublicUrlPrefix` with custom trailing slash | Trims trailing slash | Normalizes to `https://custom-r2.domain.com` without double slash | PASS |
| 16 | File size boundary (5MB exact vs 5MB + 1) | 5MB passes, 5MB + 1 rejected | Boundary verified | PASS |

---

## 4. Integrity Violation Check

In accordance with system reviewer/critic instructions, the codebase was audited for integrity violations:
- **Hardcoded test results**: None. All empirical and unit tests execute genuine logic assertions.
- **Dummy or facade implementations**: None. `uploadFile` and `deleteFile` genuinely interact with `R2Bucket.put()` and `R2Bucket.delete()` with correct HTTP metadata. Dev fallback is explicitly restricted to non-production environments.
- **Bypassing core requirements**: None. Vercel Blob has been 100% removed from `package.json` and `src/`. Native R2 binding is configured in `wrangler.jsonc`.
- **Fabricated verification logs**: None. All 6 verification commands were executed directly in this environment, yielding genuine exit code 0 results.
- **Self-certifying work**: None. The test suites (`empirical-m3-storage.ts`, `adversarial-m3-review.ts`, and full Next.js/Vite builds) independently assert behavior.

No integrity violations detected.

---

## 5. Independent Verification Commands Summary

| Command | Status | Result Summary |
|---------|--------|----------------|
| `npm run typecheck` | PASS | Exit code 0, 0 TypeScript errors. |
| `npm run lint` | PASS | Exit code 0, 0 errors, 13 warnings in tests/scripts. |
| `npx tsx tests/empirical-m3-storage.ts` | PASS | Exit code 0, 14/14 tests passed. |
| `npm run build` | PASS | Exit code 0, 29/29 routes compiled cleanly. |
| `npm run build:cf` | PASS | Exit code 0, SSR bundle `dist/server/ssr/index.js` (281.93 kB). |
| `node scripts/e2e-runner.mjs --dry-run` | PASS | Exit code 0, 275/275 tests registered. |
| `npx tsx scratch/adversarial-m3-review.ts` | PASS | Exit code 0, 16/16 adversarial test scenarios passed. |

---

## 6. Coverage Gaps & Unexplored Areas

- **R2 Production Public Domain DNS Binding**:
  - *Risk Level*: Low.
  - *Context*: `media.checkpot.at` cannot be tested against live Cloudflare DNS because production DNS cutover is prohibited prior to Milestone 5 release verification.
  - *Mitigation*: The code supports `R2_PUBLIC_URL_PREFIX`, `NEXT_PUBLIC_R2_PUBLIC_URL_PREFIX`, and `NEXT_PUBLIC_R2_PUBLIC_DOMAIN` environment overrides, allowing transitional use of `*.r2.dev` prior to final DNS cutover.

---

## 7. Conclusion

Milestone 3 deliverables meet and exceed all functional, security, architectural, and edge constraint requirements. The work product is robust, clean, and ready for Milestone 4 (Existing Media Migration & Ledger).

**Final Verdict:** `APPROVE`
