# Core Workspace Rule

This rule is always active.

## Instruction priority

1. Current user request
2. `@../../docs/PROJECT-SPEC.md`
3. `@../../docs/DESIGN-SYSTEM.md` for customer-specific visual decisions
4. `@../../docs/SEO-SPEC.md` for page-level SEO decisions
5. `@../../docs/FRONTEND-HANDOFF.md` when its status is `FROZEN_FOR_BACKEND`
6. Task-specific workspace rule
7. `@../skills/ui-ux-pro-max/references/motion-principles.md` for generic motion craft

Never let generated recommendations or existing placeholder code override an approved customer decision.

## Required delivery order

`discovery -> specification approval -> design/SEO/motion approval -> Open Design preparation -> frontend -> frontend freeze -> backend -> security audit -> release verification`

Do not begin a later phase when its required document still has a blocking status.

## Repository boundaries

- Work only inside the current project unless the user explicitly expands scope.
- Preserve unrelated existing changes.
- Use Next.js App Router and Server Components by default.
- Keep interactive Client Components at the smallest practical leaf.
- Treat Next.js 16, React 19, strict TypeScript, Tailwind CSS 4, Neon, and Drizzle as the fixed template baseline.
- Keep presentation components independent from Drizzle, `@/db`, auth internals, CMS, storage, email, and payment SDKs.
- Put production database access behind server-only modules in `src/lib/repositories/`.
- Preserve `src/db/`, `drizzle/`, `src/lib/auth/`, `src/proxy.ts`, `/login`, and `/admin` during public-frontend generation.
- Keep customer facts in `docs/PROJECT-SPEC.md`, visual and motion decisions in `docs/DESIGN-SYSTEM.md`, SEO decisions in `docs/SEO-SPEC.md`, and dynamic frontend contracts in `docs/FRONTEND-HANDOFF.md`.

## Safety and quality

- Never run broad recursive deletion, reset unrelated work, expose secrets, or operate outside a verified path.
- Missing required configuration fails closed.
- Fixtures never conceal production failures.
- Do not use `any` to hide missing types, models, or migrations.
- Validate untrusted input and authorize privileged operations server-side.
- Treat Proxy and layouts as early UI gates, never as the only authorization boundary.
- Verify work in proportion to risk; compilation alone is not proof that a user flow works.
