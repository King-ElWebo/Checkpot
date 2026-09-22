## 2026-09-21T16:09:58Z

You are the Milestone 2 Worker for the Checkpot Next.js 16 Cloudflare Workers migration.

Your working directory is:
`c:\Users\wilkb\Desktop\Projekte\checkpot\website\.agents\worker_m2_runtime`

Your parent orchestrator is:
Conversation ID: 32447248-350f-4fae-a61a-e695e44774cb

MANDATORY FIRST STEP: Read the authoritative user request at:
`c:\Users\wilkb\Desktop\Projekte\checkpot\website\.agents\ORIGINAL_REQUEST.md`
Also read:
`c:\Users\wilkb\Desktop\Projekte\checkpot\website\.agents\orchestrator_1\PROJECT.md`
and the survey handoff at:
`c:\Users\wilkb\Desktop\Projekte\checkpot\website\.agents\explorer_survey_runtime\handoff.md`
and survey report at:
`c:\Users\wilkb\Desktop\Projekte\checkpot\website\.agents\explorer_survey_runtime\report.md`.

MANDATORY INTEGRITY WARNING:
DO NOT CHEAT. All implementations must be genuine. DO NOT hardcode test results, create dummy/facade implementations, or circumvent the intended task. A teamwork_preview_auditor will independently verify your work. Integrity violations WILL be detected and your work WILL be rejected.

File Ownership:
You own exclusively:
- `package.json`
- `vite.config.ts`
- `tsconfig.json`
- `tests/empirical-m1-challenge.ts` (if test fixtures need fixing for typecheck)
- Adapter-specific files (e.g. `wrangler.jsonc` updates for main entry point if required)

Your Objective (Milestone 2: Cloudflare Workers Runtime & Adapter Integration):
1. Package Configuration:
   - Add `"type": "module"` to `package.json` as required by Vite/vinext.
   - Remove `@vercel/analytics` and `@vercel/speed-insights` from dependencies in `package.json` (retired in M1).
2. Adapter Integration:
   - Configure `vinext` with `@cloudflare/vite-plugin` per official Cloudflare guidance and the 88% compatibility audit.
   - Create `vite.config.ts` exporting the Vite configuration with `vinext()` and Cloudflare plugins.
   - Configure `wrangler.jsonc` main entry if needed by the adapter (or preserve default).
   - Add package scripts:
     - `"build:cf"`: build for Cloudflare Workers
     - `"dev:cf"` / `"preview:cf"`: preview or dev with Wrangler / Miniflare
   - Ensure the existing standard Next.js scripts (`dev`, `build`, `start`, `typecheck`, `lint`) continue to function cleanly.
3. Test Fixture Fix:
   - In `tests/empirical-m1-challenge.ts`, fix any missing props on mock test fixtures (e.g. `version` on `ConsentState`, `children` on `ConsentManager`) so that `npm run typecheck` passes with zero errors across the entire repository.
4. Verification:
   - Run `npm run typecheck` to verify zero TypeScript errors.
   - Run `npm run lint` to verify zero ESLint errors.
   - Run `npm run build` to verify standard Next.js build passes.
   - Run the Cloudflare Workers build command to verify edge bundle compilation succeeds.
   - Document all commands, outputs, bundle sizes, and verification results in your handoff.

Deliverables:
- Write changes description to `c:\Users\wilkb\Desktop\Projekte\checkpot\website\.agents\worker_m2_runtime\changes.md`
- Write handoff report to `c:\Users\wilkb\Desktop\Projekte\checkpot\website\.agents\worker_m2_runtime\handoff.md`
- Send completion message via `send_message` to parent orchestrator.
