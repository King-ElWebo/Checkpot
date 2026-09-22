# Milestone 3 Independent Review & Adversarial Critic Report

**Milestone:** M3 — Media Storage Migration (Vercel Blob → Cloudflare R2)  
**Reviewer:** Reviewer 1 (M3) (`reviewer_m3_1`)  
**Parent Orchestrator:** `32447248-350f-4fae-a61a-e695e44774cb`  
**Date:** 2026-09-21T20:42:00Z  
**Repository:** `c:\Users\wilkb\Desktop\Projekte\checkpot\website`  

---

## 1. Review Summary

**Verdict: REQUEST_CHANGES**

### Executive Summary
The core implementation of Milestone 3 by Worker M3 is technically robust and exceptionally clean:
- `@vercel/blob` has been completely purged from `package.json` and all source code files in `src/` (0 occurrences found).
- Cloudflare R2 native Workers binding (`MEDIA_BUCKET` typed as `R2Bucket`) has been implemented in `src/lib/storage/index.ts` with fail-closed behavior in production and a graceful warning fallback in local development (`NODE_ENV === "development"`).
- All security guards in `src/app/admin/media/actions.ts` (`requireAdmin()`, 5MB size ceiling, magic-byte MIME validation for PNG/JPG/WebP, UUID key generation, DB metadata insertion in Neon, and `getMediaUsage` cascade delete protection) are strictly preserved.
- `next.config.ts` correctly enables `images.unoptimized: true` and configures all 4 required hostnames (`media.checkpot.at`, `*.r2.dev`, `*.cloudflarestorage.com`, and `*.public.blob.vercel-storage.com`).
- Public storefront entrance images across `page.tsx`, `ueber-uns/page.tsx`, and `kontakt/page.tsx` have been normalized to use `STOREFRONT_IMAGE_URL`.
- `npm run lint`, `npx tsx tests/empirical-m3-storage.ts`, and `npm run build:cf` all succeed cleanly with exit code 0.

However, an adversarial audit and full build run revealed **two blockers** that require resolution before Milestone 3 can be fully approved:
1. **Critical/Major:** `npm run typecheck` and standard `npm run build` fail with exit code 1 due to `tests/adversarial-m3-storage.ts` attempting to reassign `process.env.NODE_ENV` as a read-only property under TypeScript strict mode (`error TS2540`). Because `tsconfig.json` includes `**/*.ts`, this untracked test file blocks standard builds across the entire workspace.
2. **Minor Edge Case:** `extractStorageKey` in `src/lib/storage/index.ts` fails on incomplete or malformed URLs (e.g. `extractStorageKey("https://")` returns `"https://"` instead of `""`), which can lead to malformed keys in downstream delete or public URL formation.

---

## 2. Findings

### Finding 1 [Major — Must Fix]: TypeScript Compilation Failure in `tests/adversarial-m3-storage.ts`
- **What:** `npm run typecheck` and `npm run build` both fail with exit code 1 due to 4 TypeScript errors:
  ```text
  tests/adversarial-m3-storage.ts(315,15): error TS2540: Cannot assign to 'NODE_ENV' because it is a read-only property.
  tests/adversarial-m3-storage.ts(333,15): error TS2540: Cannot assign to 'NODE_ENV' because it is a read-only property.
  tests/adversarial-m3-storage.ts(338,15): error TS2540: Cannot assign to 'NODE_ENV' because it is a read-only property.
  tests/adversarial-m3-storage.ts(344,15): error TS2540: Cannot assign to 'NODE_ENV' because it is a read-only property.
  ```
- **Where:** `tests/adversarial-m3-storage.ts:315, 333, 338, 344`
- **Why:** In TypeScript with `@types/node` in strict mode, `process.env.NODE_ENV` is typed as read-only. Assigning directly to `process.env.NODE_ENV = "production"` violates the compiler contract. Because `next build` runs `tsc` during the build phase, standard production builds are blocked.
- **Suggestion:** Cast `process.env` in `tests/adversarial-m3-storage.ts` using the same pattern implemented in `tests/empirical-m3-storage.ts`:
  ```ts
  const env = process.env as Record<string, string | undefined>;
  const origEnv = env.NODE_ENV;
  env.NODE_ENV = "production";
  // ...
  env.NODE_ENV = origEnv;
  ```

### Finding 2 [Minor — Quality / Robustness]: Incomplete URL Handling in `extractStorageKey`
- **What:** When passed a malformed or protocol-only string like `"https://"`, `extractStorageKey` returns `"https://"` instead of an empty string `""`.
- **Where:** `src/lib/storage/index.ts:18-30`
  ```ts
  export function extractStorageKey(keyOrUrl: string): string {
    if (!keyOrUrl) return "";
    const trimmed = keyOrUrl.trim();
    if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) {
      try {
        const url = new URL(trimmed);
        return url.pathname.replace(/^\/+/, "");
      } catch {
        return trimmed.replace(/^\/+/, "");
      }
    }
    return trimmed.replace(/^\/+/, "");
  }
  ```
- **Why:** `new URL("https://")` throws a `TypeError: Invalid URL`. The `catch` block executes `trimmed.replace(/^\/+/, "")`, which returns `"https://"`. Downstream callers such as `deleteFile("https://")` then invoke `bucket.delete("https://")` rather than aborting early via `if (!cleanKey) return;`.
- **Suggestion:** In `extractStorageKey`, harden the catch block or add an explicit check:
  ```ts
  try {
    const url = new URL(trimmed);
    return url.pathname.replace(/^\/+/, "");
  } catch {
    // If it started with http(s):// but is not a valid URL, strip the scheme or return empty
    const withoutScheme = trimmed.replace(/^https?:\/\//i, "").replace(/^\/+/, "");
    return withoutScheme;
  }
  ```

---

## 3. Verified Claims

| Claim | Verification Method | Result | Evidence |
|---|---|---|---|
| Complete removal of `@vercel/blob` | Ripgrep across `src/` and `package.json` | **PASS** | 0 imports in `src/`, 0 dependencies in `package.json` |
| R2 Storage Abstraction (`src/lib/storage/index.ts`) | Code review & mock execution via `tests/empirical-m3-storage.ts` | **PASS** | Native `env.MEDIA_BUCKET` binding resolution, dev fallback simulation, fail-closed in production |
| Admin authentication preserved | Code inspection of `src/app/admin/media/actions.ts` | **PASS** | `await requireAdmin()` called on line 32 (`uploadMediaAction`), line 101 (`updateMediaMetadataAction`), line 147 (`checkMediaUsageAction`), line 152 (`deleteMediaAction`) |
| 5MB file upload limit preserved | Code inspection & boundary tests | **PASS** | `if (file.size > 5 * 1024 * 1024) throw new Error(...)` |
| Magic-byte MIME validation | Code inspection & adversarial attack tests | **PASS** | PNG (`89504e47`), JPG (`ffd8ff`), WebP (`52494646`...`57454250`). Tested against SVG XSS, PHP shells, WAV, AVI, ZIP |
| Secure UUID filename generation | Code inspection | **PASS** | `crypto.randomUUID() + "." + ext` |
| Cascade delete protection preserved | Code inspection | **PASS** | `getMediaUsage(id)` blocks deletion if `usage.totalCount > 0` unless `force === true` |
| Next.js image optimization & hostnames | Code inspection of `next.config.ts` | **PASS** | `unoptimized: true`, remotePatterns: `media.checkpot.at`, `*.r2.dev`, `*.cloudflarestorage.com`, `*.public.blob.vercel-storage.com` |
| Public storefront entrance image normalization | Code inspection of `page.tsx`, `ueber-uns/page.tsx`, `kontakt/page.tsx` | **PASS** | All 4 hardcoded occurrences replaced with `STOREFRONT_IMAGE_URL` |
| ESLint check | `npm run lint` | **PASS** | 0 errors (17 warnings in scratch/tests) |
| Empirical storage test suite | `npx tsx tests/empirical-m3-storage.ts` | **PASS** | 14/14 tests passed cleanly |
| Cloudflare Workers edge build | `npm run build:cf` | **PASS** | Edge bundle `dist/server/ssr/index.js` (281.93 kB) generated cleanly |
| TypeScript check | `npm run typecheck` | **FAIL** | 4 errors in `tests/adversarial-m3-storage.ts` (`TS2540`) |
| Standard Next.js build | `npm run build` | **FAIL** | Fails at TypeScript compilation step due to `tests/adversarial-m3-storage.ts` |

---

## 4. Adversarial & Integrity Audit

1. **Hardcoded Test Results / Facades:**
   - Evaluated `src/lib/storage/index.ts` and `src/app/admin/media/actions.ts`.
   - Verified that storage operations interact with genuine R2 bindings (`bucket.put`, `bucket.delete`) and pass proper HTTP metadata (`contentType`, `cacheControl`).
   - Development fallback mode is explicitly gated by `process.env.NODE_ENV === "development" || process.env.NODE_ENV === "test"`. In production, it unconditionally throws.
   - Integrity verdict: **NO INTEGRITY VIOLATION**.

2. **Security & Authentication Bypass:**
   - `requireAdmin()` executes Web Crypto signed JWT session verification before any file slicing, validation, or DB interaction occurs.
   - Admin action endpoints cannot be invoked anonymously.

3. **MIME & Upload Attacks:**
   - Magic-byte validation checks binary file headers independently of the user-supplied `file.type` or `file.name`.
   - SVG files with embedded script tags fail magic-byte validation and are rejected.
   - Executables, PHP scripts, and RIFF WAV/AVI files are rejected.

---

## 5. Coverage Gaps & Unverified Items

1. **Live Cloudflare R2 Remote Bucket Access:**
   - Live network I/O against production Cloudflare R2 bucket `checkpot-media` cannot be executed without active Cloudflare production API credentials in the local environment.
   - Runtime binding interaction was thoroughly verified via simulated `R2Bucket` binding mock and workerd compatibility build (`npm run build:cf`).
2. **Existing 18 Database Media Records:**
   - Existing records in Neon DB currently retain URLs pointing to Vercel Blob (`*.public.blob.vercel-storage.com`).
   - This is by design: Milestone 4 is explicitly dedicated to the non-destructive copy of Blob objects to R2 and updating the database ledger.

---

## 6. Required Actions for Approval

1. Update `tests/adversarial-m3-storage.ts` to cast `process.env` so that `NODE_ENV` assignments do not trigger `TS2540`.
2. (Recommended) Harden `extractStorageKey` in `src/lib/storage/index.ts` to return `""` or strip schemes when given malformed URL strings like `"https://"`.
3. Re-run `npm run typecheck` and `npm run build` to verify that both exit with code 0.
