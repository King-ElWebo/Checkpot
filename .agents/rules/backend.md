# Backend and Integration Rule

Apply this rule to Drizzle repositories, Neon, Route Handlers, Server Actions, auth, storage, email, admin features, migrations, and external integrations.

## Required inputs

- `@../../docs/PROJECT-SPEC.md`
- `@../../docs/SEO-SPEC.md`
- `@../../docs/FRONTEND-HANDOFF.md`

Backend work begins only after the frontend handoff is frozen or the user explicitly authorizes an earlier isolated backend task.

## Fixed database and data-access rules

- Use Neon PostgreSQL, `@neondatabase/serverless`, and Drizzle ORM. They are the fixed template database stack.
- Define tables and relations in `src/db/schema.ts` and keep reviewed SQL migrations in `drizzle/`.
- Keep connection construction in `src/db/index.ts`.
- Expose typed repository methods describing business intent.
- Only repository or dedicated server-only data-access modules may import `@/db`, Drizzle query APIs, or database environment variables.
- Route Handlers, Server Actions, pages, layouts, and presentation components must not contain raw Drizzle queries.
- Return `null` only for expected missing records; translate or rethrow infrastructure failures.
- Never return fixtures after a production read or write fails.
- Return minimal serializable DTOs rather than raw database rows.

Do not add Prisma, a second ORM, or runtime database-provider branches unless an explicitly approved migration requires them. Storage, email, payments, CMS, analytics, and other external providers still follow the project specification.

## Data rules

- Apply schema changes through reviewed, version-controlled migrations.
- Back important invariants with database constraints.
- Use transactions for atomic business operations.
- Cascade only unquestionably owned child records.
- Store money as integer minor units plus currency or a deliberate database decimal, never binary floating point.
- Bound collection queries with pagination or deliberate limits.

## Request and integration rules

- Treat JSON, forms, URL/query parameters, headers, webhooks, and files as untrusted.
- Parse input with focused schemas before business logic.
- Verify referenced records, roles, and ownership before mutation.
- Re-authorize every protected repository operation, Server Action, and Route Handler close to the data access.
- Server Components should not call the application's own HTTP API for server-side data.
- Preserve the approved frontend and connect data at composition boundaries.

## Baseline auth

The included `jose` session and single environment-backed admin credential are a neutral bootstrap. Preserve them when they satisfy the approved specification. Replace or extend them before release when the customer needs multiple users, password reset, MFA, per-user revocation, granular roles, or an external identity provider.

## Storage

Local writes to `public/uploads/` are development-only unless deployment guarantees persistent writable storage. Production storage follows the project specification. Upload and deletion live behind `src/lib/storage/` and require authorization and ownership checks.
