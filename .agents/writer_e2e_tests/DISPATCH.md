## 2026-09-21T15:39:31Z

You are the E2E Test Writer for the Checkpot Next.js 16 Cloudflare Workers migration.

Your working directory is:
`c:\Users\wilkb\Desktop\Projekte\checkpot\website\.agents\writer_e2e_tests`

Your parent orchestrator is:
Conversation ID: 32447248-350f-4fae-a61a-e695e44774cb

MANDATORY FIRST STEP: Read the authoritative user request at:
`c:\Users\wilkb\Desktop\Projekte\checkpot\website\.agents\ORIGINAL_REQUEST.md`
Also read:
`c:\Users\wilkb\Desktop\Projekte\checkpot\website\.agents\orchestrator_1\PROJECT.md`
and specification reference in `docs/cloudflare-migration.md`.

File Ownership:
You own exclusively:
- `tests/e2e/*`
- `scripts/e2e-runner.mjs`
- `TEST_INFRA.md`
- `TEST_READY.md`

Your Objective (Dual Track E2E Test Suite Creation):
Design and implement a comprehensive opaque-box E2E test suite derived strictly from user requirements, covering all 22 inventoried features across 4 tiers:
- **Tier 1 - Feature Coverage (>=5 tests per feature)**: Isolated happy-path tests for each feature (public routes, SSR rendering, dynamic brand pages, admin login redirect, contact form validation, sitemap/robots, 301 redirects, 410 Gone routes, consent banner, etc.).
- **Tier 2 - Boundary & Corner Cases (>=5 tests per feature)**: Empty inputs, invalid payloads, non-existent slugs (e.g. `/marken/non-existent-brand` returns 404), invalid auth tokens, oversized uploads (>5MB), invalid MIME magic bytes, rate-limit threshold trigger, trailing slashes, case variations.
- **Tier 3 - Cross-Feature Combinations (pairwise coverage)**: Brand page + Outfit media relationships; Consent denial + analytics suppression; Honeypot trigger + rate limit interaction; Admin auth session + media picker queries.
- **Tier 4 - Real-World Application Scenarios (>=5 realistic scenarios)**:
  1. Full visitor journey: Home -> Ueber uns -> Mode -> Outfits -> Brand detail -> Contact form submission.
  2. Legacy SEO user: Accessing legacy 301 paths (e.g. `/aktuelles/`, `/sortiment/damen/`) and 410 paths (e.g. `/wp-login.php`, `/xmlrpc.php`), verifying exact status codes and headers.
  3. Store media verification: Verify store entrance image renders and public asset headers (Content-Type, Cache-Control).
  4. Privacy & Consent lifecycle: Initial load (no GA) -> Accept Analytics -> Consent Mode update -> Decline.
  5. Admin management lifecycle: Unauthenticated redirect -> Login attempt -> Admin dashboard -> Media inspection.

Test Suite Architecture:
- Test runner: `scripts/e2e-runner.mjs` using native Node.js / fetch (independent of internal Next.js modules, tests against a target URL e.g. `http://localhost:3000` or configured `TEST_TARGET_URL`).
- Create `TEST_INFRA.md` at workspace root detailing test methodology, feature inventory coverage matrix, and runner invocation.
- Once all tests are written, publish `TEST_READY.md` at workspace root with the exact coverage table and execution command.

Deliverables:
- Write `TEST_INFRA.md` and `TEST_READY.md` at workspace root (`c:\Users\wilkb\Desktop\Projekte\checkpot\website`)
- Write test runner and test specs in `scripts/e2e-runner.mjs` and `tests/e2e/`
- Write handoff report to `c:\Users\wilkb\Desktop\Projekte\checkpot\website\.agents\writer_e2e_tests\handoff.md`
- Send completion message via `send_message` to parent orchestrator.
