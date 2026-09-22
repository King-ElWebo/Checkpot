# Test Infrastructure: Checkpot Cloudflare Workers Migration

## 1. Overview & Architecture

This document specifies the architecture, methodology, and execution manual for the Checkpot Next.js 16 Cloudflare Workers and R2 Migration Dual-Track E2E Test Suite.

The test suite is designed as an **opaque-box verification system** strictly derived from:
- `ORIGINAL_REQUEST.md` (Requirements R1–R5 and Acceptance Criteria)
- `PROJECT.md` (Architecture, 22 Inventoried Features, Interface Contracts)
- `docs/cloudflare-migration.md` (Technical specifications and runtime constraints)

```
┌─────────────────────────────────────────────────────────────────────────┐
│                           E2E TEST RUNNER                               │
│                      (scripts/e2e-runner.mjs)                           │
│                                                                         │
│   Native Node.js ESM  •  fetch API  •  node:perf_hooks  •  Zero SDKs    │
└────────────────────────────────────┬────────────────────────────────────┘
                                     │ HTTP / HTTPS
                                     ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                      TEST TARGET RUNTIME                                │
│       Local Dev (localhost:3000)  /  Wrangler Dev (Miniflare)           │
│       Cloudflare Workers Preview  /  Production Host                    │
├─────────────────────────────────────────────────────────────────────────┤
│ Tier 1: Feature Coverage (110 tests — 22 features × 5 happy paths)      │
│ Tier 2: Boundary & Corner Cases (110 tests — negative & edge tests)     │
│ Tier 3: Cross-Feature Combinations (21 tests — pairwise interactions)   │
│ Tier 4: Real-World User Scenarios (34 tests — 5 end-to-end journeys)    │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## 2. Design Principles & Anti-Facade Guarantees

1. **Zero Runtime Internal Dependencies**:
   The test harness does not import Next.js internals, Drizzle schema, or server-only modules. It interacts strictly over HTTP network calls via native `fetch`.
2. **Deterministic Output & Authoritative Expectations**:
   Every test assertion derives its expected status codes, headers, and body substrings directly from documented specifications:
   - HTTP 301 redirects match `next.config.ts` rules.
   - HTTP 410 Gone responses match `src/proxy.ts` historical URL lists.
   - Security headers match Cloudflare deployment baselines.
   - Consent gating matches Google Consent Mode v2 Basic standards.
3. **No Facade Testing**:
   Tests do not perform tautological `assert(true)` checks for network behavior. Real HTTP requests are executed against the running target; status codes, headers, and response payloads are inspected.
4. **Latency & Free-Tier CPU Verification**:
   The runner measures wall-clock duration for every request, computing minimum, average, p50, p95, and maximum latency statistics to verify compliance with Cloudflare Workers Free-Tier CPU budgets (<10ms CPU time / low response latency).

---

## 3. 4-Tier Test Classification Matrix

| Tier | Category | Purpose | Test Count | Files |
|------|----------|---------|------------|-------|
| **Tier 1** | Feature Coverage | Isolated happy-path verification for every inventoried feature | 110 tests (5 per feature) | `tests/e2e/tier1-features.test.mjs` |
| **Tier 2** | Boundary & Corner Cases | Negative inputs, invalid payloads, non-existent slugs (404), tampered auth, oversized uploads, magic-byte failures, rate limits | 110 tests (5 per feature) | `tests/e2e/tier2-boundaries.test.mjs` |
| **Tier 3** | Cross-Feature Combinations | Pairwise subsystem interactions (Brands + Outfits, Consent + GA, Honeypot + Rate Limit, Admin Auth + Media) | 21 tests (10 suites) | `tests/e2e/tier3-combinations.test.mjs` |
| **Tier 4** | Real-World Application Scenarios | Multi-step visitor journeys, legacy SEO redirections, store media validation, consent lifecycle, and admin management | 34 tests (5 journeys) | `tests/e2e/tier4-scenarios.test.mjs` |
| **Total** | **Full Suite** | **Complete opaque-box verification** | **275 tests** | |

---

## 4. Feature Inventory Coverage Matrix

The table below maps all 22 features from `PROJECT.md` to their corresponding test suites and assertions:

| # | Feature Name | Milestone | Tier 1 Tests (Happy Path) | Tier 2 Tests (Boundaries) | Tier 3/4 Coverage |
|---|--------------|-----------|---------------------------|---------------------------|-------------------|
| 1 | Vercel Analytics Retirement | M1 | F1-T1 – F1-T5 | F1-B1 – F1-B5 | Combo 2, Scenario 4 |
| 2 | Consent Manager Preservation | M1 | F2-T1 – F2-T5 | F2-B1 – F2-B5 | Combo 2, Combo 3, Scenario 4 |
| 3 | Environment & Secrets Hygiene | M1 | F3-T1 – F3-T5 | F3-B1 – F3-B5 | Combo 5, Scenario 5 |
| 4 | Base Wrangler Config & Headers | M1 | F4-T1 – F4-T5 | F4-B1 – F4-B5 | Combo 8, Scenario 2 |
| 5 | vinext Adapter / App Router | M2 | F5-T1 – F5-T5 | F5-B1 – F5-B5 | Combo 7, Scenario 1 |
| 6 | Workers Build & Static Assets | M2 | F6-T1 – F6-T5 | F6-B1 – F6-B5 | Combo 10, Scenario 3 |
| 7 | HTTP Database Compatibility | M2 | F7-T1 – F7-T5 | F7-B1 – F7-B5 | Combo 1, Scenario 1 |
| 8 | Web Crypto & Admin Auth | M2 | F8-T1 – F8-T5 | F8-B1 – F8-B5 | Combo 5, Scenario 5 |
| 9 | Proxy 410 & Route Interception | M2 | F9-T1 – F9-T5 | F9-B1 – F9-B5 | Combo 6, Combo 8, Scenario 2 |
| 10 | R2 Storage Service Abstraction | M3 | F10-T1 – F10-T5 | F10-B1 – F10-B5 | Combo 10, Scenario 3 |
| 11 | Media Upload Action Migration | M3 | F11-T1 – F11-T5 | F11-B1 – F11-B5 | Combo 5, Scenario 5 |
| 12 | Media Delete Action Migration | M3 | F12-T1 – F12-T5 | F12-B1 – F12-B5 | Combo 5, Scenario 5 |
| 13 | Image Delivery & next/image | M3 | F13-T1 – F13-T5 | F13-B1 – F13-B5 | Combo 10, Scenario 3 |
| 14 | Store Image Normalization | M3 | F14-T1 – F14-T5 | F14-B1 – F14-B5 | Combo 1, Scenario 3 |
| 15 | Non-Destructive Blob->R2 Script | M4 | F15-T1 – F15-T5 | F15-B1 – F15-B5 | Ledger validation |
| 16 | Media Migration Ledger & Rollback | M4 | F16-T1 – F16-T5 | F16-B1 – F16-B5 | Rollback validation |
| 17 | Database Media URL Update | M4 | F17-T1 – F17-T5 | F17-B1 – F17-B5 | Combo 1, Scenario 1 |
| 18 | Dual Track E2E Test Suite | E2E | F18-T1 – F18-T5 | F18-B1 – F18-B5 | Harness architecture |
| 19 | E2E Test Suite Verification | M5 | F19-T1 – F19-T5 | F19-B1 – F19-B5 | Route suite execution |
| 20 | Adversarial Coverage Hardening | M5 | F20-T1 – F20-T5 | F20-B1 – F20-B5 | Combo 4, Scenario 5 |
| 21 | Workers Free-Tier CPU Checks | M5 | F21-T1 – F21-T5 | F21-B1 – F21-B5 | Latency monitoring |
| 22 | Migration Report & Cutover Guide | M5 | F22-T1 – F22-T5 | F22-B1 – F22-B5 | Canonical/SEO suite |

---

## 5. Test Runner Usage & Invocation Guide

### Command Line Interface

```bash
# Run the complete test suite against default local target (http://localhost:3000)
node scripts/e2e-runner.mjs

# Run against a custom target (e.g. Cloudflare Workers preview or staging)
node scripts/e2e-runner.mjs --target https://checkpot-preview.workers.dev

# Run using the TEST_TARGET_URL environment variable
TEST_TARGET_URL=http://localhost:3000 node scripts/e2e-runner.mjs

# Run only a specific tier
node scripts/e2e-runner.mjs --tier 1
node scripts/e2e-runner.mjs --tier 2
node scripts/e2e-runner.mjs --tier 3
node scripts/e2e-runner.mjs --tier 4

# Run specific feature tests using regex filter
node scripts/e2e-runner.mjs --filter "Feature 9"
node scripts/e2e-runner.mjs --filter "Scenario 1"

# Stop on first failure (--bail) with verbose error details (-v)
node scripts/e2e-runner.mjs --bail -v

# Output machine-readable JSON results (for CI/CD pipelines)
node scripts/e2e-runner.mjs --json

# Dry run mode: list matching tests without executing network calls
node scripts/e2e-runner.mjs --dry-run
```

### Exit Codes

| Exit Code | Meaning |
|-----------|---------|
| `0` | All executed tests passed successfully. |
| `1` | One or more tests failed. |
| `2` | Configuration error, invalid CLI flags, or unhandled runner exception. |

---

## 6. Real-World Scenarios Specification (Tier 4)

### Scenario 1: Full Visitor Journey
- **Step 1**: Land on Homepage `/` (verify branding, navigation links to `/mode`, `/outfits`, `/marken`, `/kontakt`, hero imagery).
- **Step 2**: Navigate to Über uns `/ueber-uns` (verify founder Christa story, store history, storefront images).
- **Step 3**: Explore Mode `/mode` (verify current seasonal collection previews).
- **Step 4**: Check Lookbook `/outfits` (verify outfit cards and style combinations).
- **Step 5**: View Brand detail `/marken/king-louie` (verify brand story, verified claims, brand looks, focalPoint styling).
- **Step 6**: Proceed to Kontakt `/kontakt` (verify store address `Hietzinger Hauptstraße 34A`, opening hours, postal code).
- **Step 7**: Inspect contact form fields (name, email, message, hidden honeypot `companyWebsite`).

### Scenario 2: Legacy SEO User Journey
- **Step 1–6**: Access legacy alias URLs (`/team`, `/brands`, `/home`, `/kontakt/impressum`, `/mode/fair_trade`, `/marken/madness-wien`) -> verify HTTP 301 redirects and follow destinations to HTTP 200.
- **Step 7–8**: Access obsolete legacy URLs (`/marken/zilch-wien`, `/schrankcheck-alt/schrankcheck`) -> verify HTTP 410 Gone with `text/plain` and `Cache-Control: public`.
- **Step 9**: Probe malicious WordPress paths (`/wp-login.php`, `/xmlrpc.php`) -> verify clean 404/410 handling without application crash.

### Scenario 3: Store Media Verification
- **Step 1**: Inspect homepage for store imagery.
- **Step 2–5**: Directly fetch storefront and interior photos (`/customer/christa-storefront.jpg`, `/customer/christa-boutique-selection.jpg`, `/customer/store-detail-scarves.jpg`, `/customer/store-detail-flowers.jpg`) -> verify HTTP 200, `Content-Type: image/jpeg`, and `Cache-Control`.
- **Step 6**: Fetch OpenGraph preview image `/customer/og-image.jpg` -> verify HTTP 200 and image MIME type.

### Scenario 4: Privacy & Consent Lifecycle
- **Step 1**: Initial clean visitor request (no cookies) -> verify strict suppression of Google Analytics (`googletagmanager.com/gtag/js`).
- **Step 2**: Visitor grants analytics consent (`checkpot_consent` with `analytics: true`) -> verify page loads with consent acknowledged.
- **Step 3**: Visitor updates preferences (`analytics: false, externalMedia: true`) -> verify GA4 script suppressed while external media permitted.
- **Step 4**: Visitor declines all cookies -> verify strict suppression across all public routes.
- **Step 5**: Review privacy policy `/datenschutz` -> verify DSGVO compliance text and consent settings trigger.

### Scenario 5: Admin Management Lifecycle
- **Step 1**: Unauthenticated request to `/admin` -> returns 307/302 redirect to `/login`.
- **Step 2**: Unauthenticated request to `/api/admin/media` -> returns 401 Unauthorized JSON.
- **Step 3**: Visitor navigates to `/login` -> returns 200 OK credentials form.
- **Step 4**: Failed login attempt with incorrect credentials -> returns 401 JSON `{ error: "Ungültige Anmeldedaten." }`.
- **Step 5**: Failed login attempt with empty password -> returns 400 or 401 JSON.
- **Step 6**: Synthetic admin token verification -> fails closed unless signed with valid secret.
- **Step 7**: Logout request to `/api/auth/logout` -> returns 200 OK and deletes `admin_session` cookie.

---

## 7. Quality Assurance & Self-Verification Protocol

1. **Self-Contained Execution**: All test files live under `tests/e2e/` and the runner under `scripts/e2e-runner.mjs`.
2. **Strict File Ownership**: No implementation files were modified. The test writer owns strictly `tests/e2e/*`, `scripts/e2e-runner.mjs`, `TEST_INFRA.md`, and `TEST_READY.md`.
3. **Continuous Integration**: The test suite can run in any standard Node.js 18+ environment without requiring headless browsers, Xvfb, or Docker containers.
