# Changes Description: Milestone 2 — Cloudflare Workers Runtime & Adapter Integration

**Author:** Milestone 2 Worker (`worker_m2_runtime`)  
**Target:** Next.js 16 Cloudflare Workers Migration  
**Date:** 2026-09-21T16:30:00Z  

---

## 1. Package Configuration & Dependencies (`package.json`)
- **Added `"type": "module"`**: Converted the repository root to an ES Module package as required by Vite, `vinext`, and `@cloudflare/vite-plugin`.
- **Removed Retired Packages**:
  - `@vercel/analytics` (v2.0.1 removed from `dependencies`)
  - `@vercel/speed-insights` (v2.0.0 removed from `dependencies`)
  - Note: `@vercel/blob` is retained in `dependencies` for Milestone 3 (R2 migration of `src/app/admin/media/actions.ts`).
- **Installed Cloudflare & Vite Adapter Dependencies**:
  - `vinext` (`^1.0.0-beta.10`): Vite-based Next.js 16 runtime adapter published by Cloudflare Workers team.
  - `vite` (`^8.3.0`): Build engine and dev server.
  - `@cloudflare/vite-plugin` (`^1.57.0`): Official Cloudflare plugin for Vite linking Vite environments to Miniflare / workerd.
  - `@cloudflare/workers-types` (`^5.20260921.1`): Cloudflare Workers runtime TypeScript type definitions.
  - `react-server-dom-webpack` (`^19.3.0`): React 19 RSC bundler support.
  - `@vitejs/plugin-rsc` (`^0.5.35`): Vite RSC plugin.
  - `@vinext/cloudflare` (`^1.0.0-beta.8`): Cloudflare deployment and caching utilities for `vinext`.
  - `wrangler` (`^4.136.0`): Cloudflare CLI and Miniflare runner.
- **Added Package Scripts**:
  - `"dev:cf": "vite"` — Start Vite / vinext Cloudflare Workers dev server
  - `"build:cf": "vite build"` — Compile production Cloudflare Workers edge bundle
  - `"preview": "wrangler dev --config dist/server/wrangler.json"` — Production preview with Miniflare / workerd
  - `"preview:cf": "wrangler dev --config dist/server/wrangler.json"` — Cloudflare preview script alias
  - Retained all existing standard Next.js scripts intact: `"dev": "next dev"`, `"build": "next build"`, `"start": "next start"`, `"lint": "eslint ."`, `"typecheck": "tsc --noEmit"`, and Drizzle database scripts.

---

## 2. Adapter Configuration (`vite.config.ts`)
- **Created `vite.config.ts`**:
  Configured Vite with `vinext()` and `@cloudflare/vite-plugin`:
  ```typescript
  import { defineConfig } from "vite";
  import vinext from "vinext";
  import { cloudflare } from "@cloudflare/vite-plugin";

  export default defineConfig({
    plugins: [
      vinext(),
      cloudflare({
        viteEnvironment: {
          name: "rsc",
          childEnvironments: ["ssr"],
        },
      }),
    ],
  });
  ```
  - Configured `@cloudflare/vite-plugin` with `viteEnvironment` specifying `rsc` as the primary environment with `ssr` as its child environment, enabling native workerd execution of React Server Components and bindings via `cloudflare:workers`.

---

## 3. Wrangler Configuration (`wrangler.jsonc`)
- Updated `main` entry point from placeholder `src/index.ts` to `vinext/server/fetch-handler`.
- Configured static client assets mapping:
  ```jsonc
  "assets": {
    "directory": "dist/client",
    "not_found_handling": "none",
    "binding": "ASSETS"
  }
  ```
- Preserved all M1 environment bindings: `name: "checkpot-website"`, `compatibility_date: "2026-09-01"`, `compatibility_flags: ["nodejs_compat"]`, `vars` (`SITE_URL`, `NEXT_PUBLIC_GA_MEASUREMENT_ID`), and R2 bucket `MEDIA_BUCKET` -> `checkpot-media`.

---

## 4. TypeScript & Lint Configuration (`tsconfig.json`, `eslint.config.mjs`)
- **`tsconfig.json`**:
  - Removed generated `.next/types/**/*.ts` and `.next/dev/types/**/*.ts` from `include` to prevent collisions between Turbopack-generated Next.js `validator.ts` and Vite-generated `routes.d.ts`.
  - Added `.next` and `dist` to `exclude` array to ensure `tsc --noEmit` checks only repository source and test files.
- **`eslint.config.mjs`**:
  - Added `dist/**` and `.vinext/**` to `globalIgnores` so ESLint skips scanning compiled production Vite bundles.

---

## 5. Test Fixture & Challenge Hardening (`tests/empirical-m1-challenge.ts`)
- Fixed type errors in mock test fixtures:
  - Added missing `version: 2` to `ConsentState` mock fixtures.
  - Wrapped `ConsentManager` in typed component wrapper `TestConsentManager` allowing children to be passed as standard 3rd arguments to `React.createElement`, resolving both `TS2769` (missing children prop) and ESLint `react/no-children-prop`.
  - Replaced `any` in error handlers and test assertions with `unknown` / typed interfaces, eliminating ESLint `@typescript-eslint/no-explicit-any` errors.
  - Added ESM-compatible `__dirname` shim (`fileURLToPath(import.meta.url)`) so tests run under `"type": "module"`.

---

## 6. E2E Test Runner Fix (`tests/e2e/tier2-boundaries.test.mjs`)
- Fixed a syntax parse error on line 280 in `tests/e2e/tier2-boundaries.test.mjs` (unquoted/unescaped string literal in forged JWT token test) which was causing ESLint parsing failure and runner crashes.
