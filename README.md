# Universal Customer Website Template

This repository is a reusable starting point for high-quality customer websites. Copy it for a new customer, turn the discovery notes into an approved specification, generate the design direction, let Open Design build the complete frontend, and connect production services only after the frontend is frozen.

## Delivery flow

```text
customer discovery
  -> approved project specification
  -> approved design system and section-level motion plan
  -> approved page-level SEO specification
  -> prepared Open Design prompt
  -> Open Design frontend
  -> frontend freeze and handoff
  -> backend integration
  -> security audit
  -> release verification
```

## Fixed technical baseline

- Next.js 16 App Router with Turbopack
- React 19 and TypeScript strict mode
- Tailwind CSS 4
- Neon PostgreSQL with `@neondatabase/serverless`
- Drizzle ORM with versioned SQL migrations
- signed stateless admin sessions with `jose`
- optimistic admin filtering in `src/proxy.ts` plus server-side verification in protected boundaries
- a neutral login and admin shell that Open Design must preserve

Neon and Drizzle are template decisions, not decisions repeated for every customer. Customer discovery still selects deployment, storage, email, payments, CMS, analytics, and other external integrations.

## Start a customer project

The complete human-and-agent operating manual is `docs/PROJECT-WORKFLOW.md`.

1. Copy this folder and rename the new project.
2. Create `.env.local` from `.env.example` and set a unique `AUTH_SECRET` and `ADMIN_PASSWORD`. `DATABASE_URL` may remain empty until backend integration.
3. Follow `docs/ANTIGRAVITY_SETUP.md` once to connect the copied repository to Antigravity and Open Design.
4. In Antigravity, run `/start-customer-project`.
5. Complete discovery with `/discover-client` until `docs/PROJECT-SPEC.md` is approved.
6. Run `/generate-design-system` and approve `docs/DESIGN-SYSTEM.md`.
7. Complete and approve `docs/SEO-SPEC.md`, then run `/prepare-open-design`.
8. Give Open Design the returned prompt. Its exact file contract is `OPEN_DESIGN.md`.
9. Review with the approved-revision prompt, then freeze the accepted frontend with `/freeze-frontend`.
10. Provision the customer Neon project, add `DATABASE_URL`, and continue with `/connect-backend`.
11. Finish with `/security-audit` and `/release-check`.

Do not skip phase approvals. They keep customer facts, visual decisions, frontend code, backend work, and security work from being mixed together.

## Important files

| File | Purpose |
| --- | --- |
| `AGENTS.md` | Repository-wide instructions and source priority for AI agents |
| `docs/PROJECT-WORKFLOW.md` | Complete customer workflow, phase detection, approvals, responsibilities, and restart procedure |
| `OPEN_DESIGN.md` | Focused contract for complete frontend generation |
| `docs/ANTIGRAVITY_SETUP.md` | Human setup guide and available slash workflows |
| `docs/PROJECT-SPEC.md` | Approved customer requirements and page inventory |
| `docs/DESIGN-SYSTEM.md` | Approved customer-specific visual and motion direction |
| `docs/SEO-SPEC.md` | Approved per-route metadata, indexing, structured data, and redirect contract |
| `docs/OPEN-DESIGN-PROMPTS.md` | Reusable initial-build, revision, and completion prompts |
| `docs/FRONTEND-HANDOFF.md` | Frozen frontend contract for backend integration |
| `.agents/rules/` | Automatically applied workspace rules |
| `.agents/workflows/` | Manual Antigravity slash workflows |
| `.agents/skills/ui-ux-pro-max/` | Routed UI/UX design-system and motion knowledge |
| `src/db/schema.ts` | Fixed Drizzle schema entry point |
| `src/lib/repositories/` | Server-side business data access |
| `src/lib/auth/` | Session and administrator verification |
| `src/proxy.ts` | Optimistic protection for admin routes |

The large vendor knowledge base remains in `.ai-agents/ui-ux-pro-max-skill/`. Agents should access it through the routed UI/UX skill instead of loading the directory recursively.
