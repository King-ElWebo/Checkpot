# Universal Website Project Instructions

This repository is copied for each customer website. The required delivery sequence is:

`discovery -> approved specification -> approved design, SEO, and motion -> prepared Open Design prompt -> complete frontend -> frontend freeze -> backend integration -> security audit -> release verification`

## Sources of truth

Use this priority when instructions conflict:

1. current user request;
2. `docs/PROJECT-SPEC.md`;
3. `docs/DESIGN-SYSTEM.md` for customer-specific visual decisions;
4. `docs/SEO-SPEC.md` for page-level metadata, indexing, structured data, and redirects;
5. `docs/FRONTEND-HANDOFF.md` when its status is `FROZEN_FOR_BACKEND`;
6. the relevant rule in `.agents/rules/`;
7. `.agents/skills/ui-ux-pro-max/references/motion-principles.md` for generic motion and interaction craft.

Do not treat generated UI recommendations, fixture data, old reports, or existing insecure code as requirements.

## Tool routing

- End-to-end operating manual and phase detection: `docs/PROJECT-WORKFLOW.md`
- Customer discovery: `.agents/workflows/discover-client.md`
- Design-system generation: `.agents/skills/ui-ux-pro-max/SKILL.md`
- Open Design preparation: `.agents/workflows/prepare-open-design.md`
- Open Design frontend: `OPEN_DESIGN.md`
- Backend integration: `.agents/workflows/connect-backend.md`
- Security audit: `.agents/workflows/security-audit.md`
- Release verification: `.agents/workflows/release-check.md`

Antigravity-specific setup and slash commands are documented in `docs/ANTIGRAVITY_SETUP.md`. Every agent joining or resuming the project must read `docs/PROJECT-WORKFLOW.md` before selecting the next phase.

## Fixed technical baseline

- Next.js 16 App Router with Turbopack, React 19, TypeScript strict mode, and Tailwind CSS 4.
- Neon PostgreSQL through `@neondatabase/serverless` and Drizzle ORM is the fixed database stack.
- Database definitions live in `src/db/schema.ts`; generated, reviewed SQL migrations live in `drizzle/`.
- Public/complex business data access lives in server-only modules under `src/lib/repositories/`; simple local admin CRUD may use Drizzle directly if validated and authorized.
- The neutral single-admin bootstrap uses signed `jose` sessions, `src/proxy.ts` for optimistic route filtering, and a server-side verifier at protected boundaries.
- Open Design builds the customer-specific public frontend while preserving the existing database, authentication, login, and admin foundation.

Do not introduce Prisma, a second ORM, a runtime database-provider switch, or an alternative auth architecture unless the current user request or approved project specification explicitly requires a migration.

## Universal boundaries

- Public presentation components receive typed serializable props and do not import Drizzle, `@/db`, auth internals, or external provider SDKs.
- Public production database access goes through `src/lib/repositories/`. Client components and shared presentation components must not contain Drizzle/database logic.
- External storage, email, payment, analytics, CMS, and other services are selected per approved project specification.
- Fixtures are for frontend development and tests, never production failure fallback.
- Backend integration preserves the approved frontend and replaces data only at composition boundaries.
- Every untrusted payload is validated.
- Privileged server operations authorize independently of `proxy.ts` and layouts.
- Required secrets fail closed; hardcoded sessions and fallback passwords are forbidden.
- New code must not use `any` to hide missing types, schemas, or migrations.
- Completion requires relevant type, build, browser, responsive, accessibility, and failure-state verification.

## Change discipline

Keep customer facts in `docs/PROJECT-SPEC.md`, visual and motion decisions in `docs/DESIGN-SYSTEM.md`, SEO decisions in `docs/SEO-SPEC.md`, and dynamic frontend contracts in `docs/FRONTEND-HANDOFF.md`. Update the appropriate document when implementation changes its contract.

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
