# Connect Backend

Description: Connect the frozen frontend to the selected production services while preserving its approved design.

1. Read `docs/PROJECT-SPEC.md`, `docs/SEO-SPEC.md`, `docs/FRONTEND-HANDOFF.md`, `.agents/rules/backend.md`, and `.agents/rules/security.md`.
2. Stop if the frontend handoff is not `FROZEN_FOR_BACKEND`, unless the user explicitly authorizes an isolated backend task.
3. Compare the specification, SEO contract, handoff, fixture types, `src/db/schema.ts`, existing migrations, repositories, and code. Report contradictions before implementation.
4. Use the fixed Neon/Drizzle database stack. Confirm the Neon project, branch/region, `DATABASE_URL`, and approved storage, email, payment, CMS, and other external integrations.
5. Define strict serializable domain contracts and map each handoff read or mutation to a business-intent repository method.
6. Extend `src/db/schema.ts`, generate a migration with `npm run db:generate`, review the SQL for data loss and constraints, then apply it with `npm run db:migrate` only against the intended database.
7. Keep Drizzle queries inside `src/lib/repositories/` or another explicitly server-only DAL module.
8. Connect Server Components and dynamic `generateMetadata` directly to repositories for reads. Prefer Server Actions for internal UI mutations and Route Handlers for webhooks or external/public APIs.
9. Re-validate and re-authorize inside every mutation boundary; do not rely on `src/proxy.ts` or an admin layout.
10. Preserve the baseline `jose` auth only if it satisfies the approved specification; otherwise implement the approved extension deliberately.
11. Implement requested admin modules, storage, forms, email, payments, CMS, and integrations.
12. Preserve loading, empty, error, submitting, and success states from the frontend.
13. Remove fixture fallbacks from production composition and return real failures safely.
14. Document environment variables, Neon provisioning, migration order, seed data, external-provider setup, and deployment constraints.
15. Run type checking, lint, production build, migration checks, and targeted integration/browser verification.
16. Report implemented features, checks, migrations, environment requirements, limitations, and readiness for `/security-audit`.
