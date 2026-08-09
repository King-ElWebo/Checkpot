# Start Customer Project

Description: Validate a freshly copied template and begin the customer delivery flow without mixing phases.

1. Read `AGENTS.md`, `docs/ANTIGRAVITY_SETUP.md`, and `docs/PROJECT-SPEC.md`.
2. Inspect the repository status and preserve unrelated changes.
3. Confirm that `.agents/rules/`, `.agents/workflows/`, `.agents/workflows/prepare-open-design.md`, and `.agents/skills/ui-ux-pro-max/SKILL.md` exist.
4. Confirm that the UI/UX vendor search script exists without reading its whole source tree.
5. Confirm the fixed baseline exists: `src/db/schema.ts`, `src/db/index.ts`, `drizzle.config.ts`, `src/lib/auth/`, `src/proxy.ts`, `/login`, and `/admin`.
6. Confirm `.env.example` documents `DATABASE_URL`, `AUTH_SECRET`, and `ADMIN_PASSWORD`. Never print values from `.env.local`.
7. Run install only if dependencies are absent, then run type checking, lint, and the production build; report concrete blockers.
8. Do not require `DATABASE_URL` until database access or migrations begin. Authentication verification requires project-specific local secrets.
9. Confirm `docs/SEO-SPEC.md` and `docs/OPEN-DESIGN-PROMPTS.md` exist, then check whether `docs/PROJECT-SPEC.md` contains customer information.
10. If discovery is incomplete, call `/discover-client`.
11. If the specification is `APPROVED_FOR_DESIGN` but the design system is incomplete, call `/generate-design-system`.
12. If design, SEO, and motion are approved, call `/prepare-open-design`.
13. Stop when the project is ready to connect to Open Design. Do not provision Neon or begin backend work.
14. Report the exact next action to the user.
