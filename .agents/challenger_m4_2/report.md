# Adversarial Challenge & Verification Report — Milestone 4 (Existing Media Migration & Ledger)

**Agent**: Challenger 2 (M4) — Empirical Challenger  
**Timestamp**: 2026-09-21T20:53:30Z  
**Target Milestone**: Milestone 4 (Existing Media Migration & Ledger)  
**Verdict**: **APPROVE**  
**Overall Risk Assessment**: **LOW**

---

## Challenge Summary

As Challenger 2 (Empirical Challenger), we performed an independent, adversarial audit and empirical stress test of Milestone 4's cutover, staging, and rollback architecture. We verified that:
1. The rollback mechanism (`scripts/rollback-media-urls.mjs`) guarantees clean, non-destructive restoration of all original Vercel Blob URLs.
2. Zero destructive operations exist across `scripts/` (no `@vercel/blob` calls, no `del()`, no HTTP `DELETE`, no SQL `DELETE`/`DROP`/`TRUNCATE`).
3. Vercel Blob original media items remain fully accessible and untouched online (verified via live HTTP HEAD requests returning HTTP 200).
4. `next.config.ts` simultaneously permits both legacy Vercel Blob and Cloudflare R2 domains with `images.unoptimized: true`, guaranteeing zero visual regressions or broken images during transitional states or instant rollbacks.
5. Build and type verification (`npm run typecheck` and `npm run lint`) succeed cleanly with zero errors.

---

## Challenges & Stress Tests

### [Low Risk] Challenge 1: Idempotency and State Synchronization between Ledger and Database

- **Assumption Challenged**: That running `scripts/rollback-media-urls.mjs` will reliably find all records and restore them even if `scripts/apply-media-urls.mjs` did not mutate `media-migration-ledger.json` on disk.
- **Attack Scenario**:
  - `scripts/apply-media-urls.mjs` updates the Neon database directly with `UPDATE media SET url = ${item.targetUrl} WHERE id = ${item.id}`, leaving `media-migration-ledger.json` status as `"verified_staged"`.
  - If `scripts/rollback-media-urls.mjs` expected `item.status === "migrated"`, it would filter out all 59 records and restore 0 records.
- **Empirical Verification & Findings**:
  - Inspected `scripts/rollback-media-urls.mjs` lines 27–29:
    ```javascript
    const itemsToRollback = ledgerData.items.filter(
      (item) => item.status === "verified_staged" || item.status === "migrated"
    );
    ```
  - Both `"verified_staged"` and `"migrated"` statuses are explicitly handled.
  - In our simulation test (`scratch/test-m4-challenge.mjs`), 100% of the 59 staged records were selected and restored bit-for-bit to their exact original Vercel Blob URLs without touching the 5 local records (`/customer/...`).
- **Blast Radius**: None. The rollback filter is resilient to whether the ledger status has been mutated or remains `"verified_staged"`.
- **Mitigation**: Verified working as designed.

### [Low Risk] Challenge 2: Accidental Data Purge or Deletion in Migration & Rollback Tooling

- **Assumption Challenged**: That migration or rollback scripts could invoke destructive methods (e.g. `@vercel/blob` `del()`, REST API `DELETE`, `fs.rmSync`, SQL `DELETE` / `TRUNCATE`).
- **Attack Scenario**: An operator running migration or rollback might inadvertently trigger object deletion in Vercel Blob or Neon database.
- **Empirical Verification & Findings**:
  - Full codebase grep across `scripts/` for `del(`, `delete`, `DELETE`, `unlink`, `rmdir`, `rmSync`, `truncate`, `drop`:
    - ZERO destructive calls detected.
    - Only occurrences of "del" were substrings within variable/message identifiers (e.g., "delivery").
    - Database operations in `scripts/apply-media-urls.mjs` and `scripts/rollback-media-urls.mjs` are strictly parameterized `UPDATE` statements (`UPDATE media SET url = $1, updated_at = NOW() WHERE id = $2`).
    - `@vercel/blob` has been completely uninstalled from `package.json` dependencies and devDependencies, preventing any programmatic Blob deletion calls.
  - Live probe: We issued HTTP HEAD requests to live Vercel Blob assets referenced in `media-migration-ledger.json`:
    - `https://hgrtkumqrh0cwc66.public.blob.vercel-storage.com/media/outfit-summer-pattern-iibaXETsX4Mh06BS7MTrwqUtDWTUAB.jpg` -> `HTTP 200 OK`
    - `https://hgrtkumqrh0cwc66.public.blob.vercel-storage.com/media/outfit-blue-winter-FxLUMNWLPxDDu6HLqyX1StD6m3gprv.jpg` -> `HTTP 200 OK`
    - `https://hgrtkumqrh0cwc66.public.blob.vercel-storage.com/media/checkpot-logo-50W8fYc6aBPigdFsZi3befoTr5ff3u.svg` -> `HTTP 200 OK`
    - `https://hgrtkumqrh0cwc66.public.blob.vercel-storage.com/media/d496b763-d280-4337-a70d-aaf8601b76ad.jpg` -> `HTTP 200 OK`
    - `https://hgrtkumqrh0cwc66.public.blob.vercel-storage.com/media/118489bd-2ff8-4166-ba97-e3068c7c1e78.jpg` -> `HTTP 200 OK`
- **Blast Radius**: None. Zero data has been purged or deleted.
- **Mitigation**: Non-destructive guarantee confirmed.

### [Low Risk] Challenge 3: Next.js Image Component Rejection During Transitional Dual-Origin State

- **Assumption Challenged**: That Next.js will serve images without runtime exception or broken image icons regardless of whether URLs point to Vercel Blob or R2.
- **Attack Scenario**: If `next.config.ts` only authorized R2 hostnames, rolling back to Vercel Blob URLs would cause Next.js `<Image>` components to throw `Invalid src prop on next/image, hostname is not configured under images.remotePatterns`.
- **Empirical Verification & Findings**:
  - Inspected `next.config.ts` lines 5–29:
    ```typescript
    images: {
      unoptimized: true,
      remotePatterns: [
        {
          protocol: "https",
          hostname: "*.public.blob.vercel-storage.com",
          port: "",
        },
        {
          protocol: "https",
          hostname: "media.checkpot.at",
          port: "",
        },
        {
          protocol: "https",
          hostname: "*.r2.dev",
          port: "",
        },
        {
          protocol: "https",
          hostname: "*.cloudflarestorage.com",
          port: "",
        },
      ],
    },
    ```
  - Both Vercel Blob (`*.public.blob.vercel-storage.com`) and Cloudflare R2 (`media.checkpot.at`, `*.r2.dev`, `*.cloudflarestorage.com`) are configured.
  - `unoptimized: true` is set, ensuring edge-safe direct URL rendering without dependency on Node.js image optimization servers.
- **Blast Radius**: None. Image rendering is dual-origin ready.

---

## Stress Test Results

| Test Scenario | Expected Behavior | Actual Behavior | Result |
|---|---|---|---|
| Destructive Operation Audit across `scripts/` | 0 destructive calls | 0 calls found (`del()`, `DELETE`, `truncate`, `drop`) | **PASS** |
| Ledger Schema & Item Count | 64 total records (59 staged, 5 local) | 64 total records (59 staged, 5 local) | **PASS** |
| Cutover URL Transformation | 59 records updated to `https://media.checkpot.at/*` | 59 records mapped to R2 URLs, 5 local untouched | **PASS** |
| Full Rollback Round-Trip Simulation | 100% of 59 records restored to exact Vercel Blob URLs | 59/59 records restored bit-for-bit | **PASS** |
| Remote Vercel Blob Liveness Check | HTTP 200 on live Vercel Blob assets | All sampled URLs returned HTTP 200 | **PASS** |
| `next.config.ts` Remote Patterns Check | Both Vercel Blob & R2 allowed; unoptimized=true | All hostnames present; unoptimized=true | **PASS** |
| Typecheck (`npm run typecheck`) | Exit code 0, no errors | Exit code 0, 0 errors | **PASS** |
| Linter (`npm run lint`) | Exit code 0, 0 errors | Exit code 0, 0 errors, 17 warnings (tests/scratch) | **PASS** |

---

## Unchallenged Areas

- **Production DNS Modification**: Out of scope per migration constraints (DNS cutover is deferred to user manual action).
- **Physical R2 Bucket Staged Sync via Sentry/S3 CLI**: Live R2 write requires Cloudflare API tokens / S3 credentials configured in production environment, which is handled via Worker runtime bindings.

---

## Final Recommendation

Milestone 4 satisfies all non-destructive, cutover, and rollback requirements. All empirical verification steps completed successfully.
Verdict: **APPROVE**.
