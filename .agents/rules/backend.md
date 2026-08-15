# Backend and Integration Rule

Apply this rule to Drizzle repositories, Neon, Route Handlers, Server Actions, auth, storage, email, admin features, migrations, and external integrations.

## Required inputs

- `@../../docs/PROJECT-SPEC.md`
- `@../../docs/SEO-SPEC.md`
- `@../../docs/FRONTEND-HANDOFF.md`

Backend work begins only after the frontend handoff is frozen or the user explicitly authorizes an earlier isolated backend task.

## Fixed database and data-access rules (Hybrid Architecture)

- Use Neon PostgreSQL, `@neondatabase/serverless`, and Drizzle ORM. They are the fixed template database stack. Do not add a second ORM or runtime database-provider branches unless an explicitly approved migration requires them.
- Define tables and relations in `src/db/schema.ts` and keep reviewed SQL migrations in `drizzle/`.
- Keep connection construction in `src/db/index.ts`.

### Public Reads
- Public pages should use repositories / dedicated server-only read modules for reusable domain reads.
- Shared definitions such as "published brands", "published outfits", sorting, active filtering, media joins, and public DTO shaping belong in these modules.
- Public presentation components must not contain Drizzle/database implementation details.

### Admin — Simple Local CRUD
- Server Actions and Server Components in the protected Admin area MAY directly use Drizzle / `getDatabase()` for simple, local CRUD operations.
- This is allowed only when:
  - the code is server-only;
  - authorization is checked with the approved central admin verifier;
  - untrusted input is validated before mutation (TypeScript casts are not validation; use focused runtime schemas like Zod);
  - the query is small and clearly scoped to that Admin feature;
  - no significant business logic is duplicated;
  - no reusable public-domain read logic is being recreated;
  - the operation does not become difficult to reason about because of multiple dependent writes.

### Admin — Complex Domain Operations
Use a dedicated repository/service/server-only domain module when an operation involves one or more of:
- multiple related tables;
- atomic multi-step writes (operations that must succeed or fail together);
- reusable business rules;
- shared logic used by several actions/pages;
- non-trivial ownership/reference validation;
- complex relation updates;
- orchestration across storage/database/external providers;
- logic that would otherwise be duplicated;
- functionality likely to need isolated testing.

### Database Boundaries
- Client Components must never import the database, Drizzle, database environment variables, or server-only data-access modules.
- Shared presentation components must remain database-agnostic.
- Database access must remain server-only.
- Do not expose raw database rows to client/presentation boundaries when a smaller DTO is appropriate.
- Return `null` only for expected missing records; translate or rethrow infrastructure failures. Never return fixtures after a production read or write fails.

### Repository Layer Purpose
Repositories are not mandatory wrappers around every SQL/Drizzle statement. Their purpose is to centralize reusable reads, domain semantics, complex data operations, DTO shaping, shared filtering/sorting rules, and business logic that benefits from one authoritative implementation. Avoid trivial wrappers that only rename a single obvious Drizzle call without adding reuse, domain meaning, validation, composition, or testability.

## Data rules

- Apply schema changes through reviewed, version-controlled migrations.
- Back important invariants with database constraints.
- Operations that must succeed or fail together should be encapsulated clearly and use the database driver's supported atomic/batch mechanism. Prefer moving such logic into a dedicated domain/service module once the operation becomes non-trivial. Direct DB access does not mean complex write sequences may be spread casually across page/action code.
- Cascade only unquestionably owned child records.
- Store money as integer minor units plus currency or a deliberate database decimal, never binary floating point.
- Bound collection queries with pagination or deliberate limits.

## Request and integration rules

- Treat JSON, forms, URL/query parameters, headers, webhooks, and files as untrusted.
- Parse input with focused schemas (e.g., Zod) before business logic. Direct Admin CRUD is only acceptable after focused runtime validation of untrusted FormData/input. TypeScript casts are not validation.
- Verify referenced records, roles, and ownership before mutation.
- A protected Admin layout is not sufficient authorization for mutations. Every privileged Server Action, Route Handler, and server mutation must call the approved central verifier close to the data access/write. Direct Admin Drizzle access does not relax any auth or security requirement.
- Server Components should not call the application's own HTTP API for server-side data.
- Preserve the approved frontend and connect data at composition boundaries.

## Baseline auth

The included `jose` session and single environment-backed admin credential are a neutral bootstrap. Preserve them when they satisfy the approved specification. Replace or extend them before release when the customer needs multiple users, password reset, MFA, per-user revocation, granular roles, or an external identity provider.

## Storage

Local writes to `public/uploads/` are development-only unless deployment guarantees persistent writable storage. Production storage follows the project specification. Upload and deletion live behind `src/lib/storage/` and require authorization and ownership checks.
