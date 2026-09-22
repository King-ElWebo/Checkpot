# Checkpot – Full Vercel → Cloudflare Migration

**Status:** `APPROVED_FOR_AUTONOMOUS_EXECUTION`

## 1. Mission

Migrate the existing Checkpot application from its current Vercel-based deployment and storage architecture to a fully functional Cloudflare-based production architecture.

The application itself is already feature-complete, visually finished, technically stable, and considered ready for launch.

This is **not** a redesign, product rewrite, backend rewrite, CMS rewrite, SEO rewrite, or architecture modernization project.

The objective is:

> Preserve the existing application and its complete behavior while replacing Vercel-specific infrastructure with an appropriate Cloudflare architecture.

Work autonomously until the migration has been implemented and independently verified, or until a genuine external/human blocker prevents further progress.

---

# 2. Instruction Priority for This Run

This file represents the **current explicitly approved user request** for this migration.

Read `AGENTS.md` for repository-wide technical constraints and use existing project documentation as context.

However:

* do not restart discovery;
* do not restart design;
* do not regenerate the frontend;
* do not repeat previous backend implementation phases;
* do not reopen completed content work;
* do not perform unrelated repository cleanup;
* do not modify historical Markdown reports merely because they are outdated.

Historical project documentation may contain information from earlier phases.

For this run, the application should be treated as an already working launch candidate whose runtime infrastructure is being migrated.

---

# 3. Current Application Baseline

The existing application uses approximately the following stack:

* Next.js 16 App Router
* React 19
* strict TypeScript
* Tailwind CSS
* Neon PostgreSQL
* `@neondatabase/serverless`
* Drizzle ORM using the Neon HTTP driver
* signed `jose` admin sessions
* custom admin CMS
* Resend for contact email
* Vercel Blob for media storage
* server-side rendering / dynamic rendering where currently configured
* existing consent management
* existing SEO metadata, redirects, sitemap and robots behavior

The existing application behavior is the baseline.

Do not remove functionality merely to simplify the Cloudflare migration.

---

# 4. Known Preliminary Compatibility Findings

A previous repository analysis found the application generally suitable for Cloudflare Workers.

Important observations include:

* no known filesystem dependency in application runtime code;
* no known `child_process` runtime dependency;
* no known native C++ runtime modules;
* Neon already uses its HTTP driver rather than a TCP PostgreSQL driver;
* Resend communicates over HTTP/fetch;
* server-side image compression is not required because upload compression occurs client-side;
* existing authentication uses lightweight crypto primitives;
* current media storage is Vercel-specific;
* the application contains significant dynamic/SSR behavior;
* current public traffic is low.

Treat these as preliminary findings, **not guaranteed facts**.

Verify them against the actual current repository before implementation.

---

# 5. Cloudflare Target Architecture

Research the **current official Cloudflare documentation** before choosing or installing the deployment adapter.

## Preferred deployment path

For the current Next.js version, evaluate the officially recommended Cloudflare deployment path first.

At the time this task was written, Cloudflare recommends **vinext for existing Next.js 16 applications on Cloudflare Workers**.

Therefore:

1. inspect current official Cloudflare documentation;
2. run the current vinext compatibility analysis/check for this repository;
3. evaluate its reported compatibility problems;
4. prefer vinext if the application can be migrated without unacceptable regressions;
5. initialize it non-destructively where appropriate;
6. verify the resulting Workers application.

Do **not** blindly force vinext if current compatibility testing reveals a material incompatibility.

If vinext cannot preserve required Checkpot functionality, evaluate Cloudflare OpenNext or another currently supported Cloudflare path and document why the fallback was necessary.

Do not use Cloudflare Pages for the full-stack application unless current official documentation provides a compelling reason; the target should normally be Cloudflare Workers.

---

# 6. Free-Tier Constraint

The target architecture should remain within Cloudflare's current free tiers where reasonably possible.

Before implementation, verify current official limits rather than trusting values embedded in old documentation or this task.

In particular verify:

* Workers request allowance;
* Workers CPU allowance;
* Worker bundle limits;
* static asset limits;
* Workers Builds allowance;
* R2 storage and operation allowances;
* image optimization limits;
* any required paid feature.

Do not enable a paid Cloudflare product or automatic paid overage without explicit user approval.

If full application behavior cannot reliably operate within the free Workers CPU allowance, do not hide this fact.

Measure or otherwise verify representative runtime behavior and report the expected requirement clearly.

---

# 7. Runtime Compatibility Audit

Before making broad changes, perform a complete migration audit.

Inspect at minimum:

* Node.js APIs;
* crypto APIs;
* `Buffer`;
* environment variables;
* Server Components;
* Server Actions;
* Route Handlers;
* `proxy.ts`;
* cookies;
* redirects;
* 410 responses;
* dynamic metadata;
* `next/image`;
* Neon database access;
* Drizzle;
* Resend;
* admin authentication;
* media upload and deletion;
* rate limiting;
* consent management;
* Google Analytics integration;
* external media / Google Maps behavior;
* sitemap;
* robots;
* static assets;
* runtime caching;
* deployment configuration.

Search the entire repository for:

* `vercel`
* `@vercel`
* Vercel Blob URLs
* Vercel environment assumptions
* Vercel-specific configuration
* other platform-specific dependencies

Do not assume the previous audit found everything.

---

# 8. Preserve Existing Application Architecture

Unless a change is technically necessary for Cloudflare compatibility, preserve:

* public design;
* responsive layouts;
* routes;
* content;
* CMS behavior;
* Neon database;
* Drizzle schema;
* existing database migrations;
* public repositories/data-access model;
* authentication model;
* admin behavior;
* form validation;
* rate limiting semantics;
* Resend integration;
* consent behavior;
* analytics behavior;
* SEO;
* structured data;
* 301 redirects;
* 410 routes;
* sitemap;
* robots;
* existing business logic.

Avoid unrelated refactors.

Do not introduce a second database.

Do not replace Neon unless an actual verified incompatibility makes it unavoidable.

Do not replace the authentication architecture merely because another approach is more Cloudflare-native.

---

# 9. Media Storage Migration: Vercel Blob → Cloudflare R2

Replace Vercel Blob as the active production media storage provider with Cloudflare R2.

Known current dependency:

* `@vercel/blob`
* media upload/delete logic in `src/app/admin/media/actions.ts`
* Vercel Blob public URLs stored in Neon
* Vercel Blob host configuration in `next.config.ts`
* `BLOB_READ_WRITE_TOKEN`

Audit for further dependencies.

## Preferred R2 integration

Evaluate the native Cloudflare Workers R2 binding before introducing an S3 SDK.

Prefer a native R2 Worker binding when it:

* integrates cleanly with the selected Next.js/Cloudflare adapter;
* supports existing upload/delete requirements;
* reduces bundle size;
* avoids unnecessary access-key secrets;
* remains maintainable.

Use the S3-compatible API and `@aws-sdk/client-s3` only if there is a concrete technical reason for doing so.

Document the reason if the S3 API is chosen.

## Required storage behavior

Preserve:

* authenticated admin uploads;
* maximum file-size enforcement;
* magic-byte/file-type validation;
* supported JPEG/PNG/WebP formats;
* secure UUID filenames;
* metadata persistence in Neon;
* image display;
* media picker;
* media relationships;
* safe deletion;
* existing reference/delete protection;
* revalidation behavior;
* admin error states.

---

# 10. Existing Vercel Blob Data Must Be Migrated Safely

The migration is not complete merely when **new uploads** work with R2.

Existing media stored in Vercel Blob and referenced by URLs in Neon must continue to work after the migration.

Create a safe migration strategy for existing media.

The strategy should:

1. identify all existing media records in Neon;
2. identify which objects are hosted by Vercel Blob;
3. copy the corresponding objects into R2;
4. preserve file integrity;
5. preserve metadata and relationships;
6. map each old object to its new R2 location;
7. update database URLs safely;
8. verify record count and object count;
9. verify representative files byte/content-wise where practical;
10. verify every referenced media object resolves correctly;
11. preserve rollback information.

Do not delete the original Vercel Blob objects as part of the initial migration.

Do not perform an irreversible mass update without a tested rollback path.

If production database credentials are being used, prefer preparing and verifying the migration mechanism before executing destructive or irreversible steps.

---

# 11. R2 Public Delivery

Determine the appropriate public delivery architecture for R2 media.

For development or staging, a temporary Cloudflare-provided development URL may be acceptable.

For production, prefer an appropriate production-grade Cloudflare configuration such as a custom domain attached to the R2 bucket where supported and suitable.

Do not hard-code temporary development URLs into permanent production data.

Ensure:

* appropriate caching;
* correct `Content-Type`;
* long-lived immutable caching where safe;
* no public write capability;
* upload and delete remain authorized application operations.

---

# 12. Image Handling

Do not automatically set:

```ts
images: {
  unoptimized: true
}
```

solely because Vercel Image Optimization is being removed.

First investigate the current Cloudflare/vinext image support and current Cloudflare Images free-tier capabilities.

Compare realistic options for this project:

* Cloudflare-supported image optimization;
* `next/image` behavior under vinext;
* direct optimized R2 originals;
* `unoptimized: true` if that is genuinely the simplest and most reliable option.

The application already performs client-side preprocessing for uploaded media, so avoiding runtime resizing may be entirely reasonable.

The final choice should prioritize:

1. reliable Cloudflare compatibility;
2. zero or predictable cost;
3. correct responsive behavior;
4. acceptable page performance;
5. minimal complexity.

Document the chosen strategy.

---

# 13. Environment Variables and Bindings

Replace Vercel-specific runtime configuration with Cloudflare configuration.

Audit all environment variables.

Expected existing configuration includes approximately:

* `DATABASE_URL`
* `SITE_URL`
* `AUTH_SECRET`
* `ADMIN_PASSWORD`
* `BLOB_READ_WRITE_TOKEN`
* `RESEND_API_KEY`
* `RATE_LIMIT_SECRET`
* `NEXT_PUBLIC_GA_MEASUREMENT_ID`

After migration:

* remove `BLOB_READ_WRITE_TOKEN` if no longer required;
* configure R2 through the selected binding/API mechanism;
* preserve all required secrets;
* ensure secrets are never committed;
* create/update `.env.example` only as needed;
* configure Wrangler variables/bindings correctly;
* distinguish development/staging/production where appropriate.

Never print secret values into Markdown reports or logs.

---

# 14. Build and Deployment Configuration

Add the current Cloudflare deployment configuration required by the selected adapter.

This may include, depending on the current supported path:

* vinext configuration;
* Vite configuration;
* `wrangler.jsonc` or equivalent;
* Cloudflare bindings;
* Cloudflare-specific type generation;
* package scripts such as preview/deploy/typegen;
* compatibility flags if actually required.

Use generated/current recommended configuration where possible rather than inventing an outdated setup manually.

Keep the existing local Next.js development workflow operational where reasonably possible.

Do not remove the ability to run ordinary local development unless the target adapter absolutely requires it.

Review obsolete deployment configuration such as Vercel-specific or unused platform files, but remove only files proven to be obsolete.

---

# 15. Node.js Version

Determine the correct current Node.js version supported by:

* Next.js 16;
* the chosen Cloudflare build path;
* vinext/OpenNext;
* Workers Builds.

Pin/configure it only if needed.

Do not blindly copy an old Node 20/22 recommendation without verifying current official requirements.

---

# 16. Workers Free-Tier CPU Verification

This project aims to remain on Cloudflare Workers Free if practical.

Do not conclude that the 10 ms CPU limit is safe merely because database/network wait time does not count.

The application performs SSR, authentication, JWT operations, validation and other server-side logic.

After deployment to an appropriate Cloudflare preview/staging environment:

* test representative public SSR requests;
* test authenticated admin requests;
* test contact handling;
* test media operations;
* inspect available Worker runtime metrics/logs;
* look specifically for CPU-limit failures such as Worker resource-limit errors.

If the application systematically exceeds the current free-plan CPU limit, report that clearly.

Do not weaken functionality merely to claim free-tier compatibility.

---

# 17. Parallel Multi-Agent Execution

This task is intended for Antigravity Teamwork.

Use parallel analysis and implementation where dependencies permit.

Good candidates for parallel investigation include:

* Cloudflare/vinext compatibility research;
* Vercel dependency audit;
* R2 migration design;
* current runtime compatibility audit;
* verification/test-plan creation.

Do not parallelize tightly coupled edits merely for the sake of parallelism.

The Project Orchestrator should determine appropriate file ownership and dependencies between workstreams.

Use independent review/audit agents to challenge implementation claims.

A worker claiming success is not sufficient evidence of completion.

---

# 18. Autonomous Failure Handling

For ordinary implementation problems, continue autonomously.

Examples:

* TypeScript errors;
* build errors;
* lint errors;
* configuration errors;
* imports;
* vinext compatibility problems;
* Worker runtime errors;
* R2 binding errors;
* Cloudflare configuration mistakes;
* image configuration issues;
* test failures.

For such problems:

1. diagnose;
2. fix;
3. rerun verification;
4. try an alternative documented approach if the first approach fails.

Do not stop for routine engineering decisions.

Escalate only when a decision genuinely requires the owner, such as:

* destructive production database operation;
* paid Cloudflare service required;
* production DNS/domain cutover;
* loss of existing functionality;
* unrecoverable data migration ambiguity;
* credentials/account permission unavailable;
* architecture change outside this migration's scope.

---

# 19. Production Safety

The following actions are NOT authorized:

* production DNS cutover;
* deleting Vercel deployment before Cloudflare is verified;
* deleting existing Vercel Blob media;
* destructive database migrations;
* deleting customer data;
* changing production domain ownership;
* purchasing Cloudflare paid products;
* enabling automatic paid overage;
* rewriting unrelated product functionality.

Maintain a rollback path until Cloudflare has passed final verification.

---

# 20. Verification Requirements

Compilation alone does not count as success.

## Static verification

Run all available relevant checks, including at minimum:

```bash
npm run typecheck
npm run lint
npm run build
```

Also run the current Cloudflare/vinext-specific build and compatibility checks.

---

# 21. Cloudflare Runtime Verification

Run the application in the actual target-compatible Cloudflare runtime.

Where possible, perform both:

1. local Workers runtime verification;
2. deployed non-production Workers preview/staging verification.

Do not mark runtime compatibility as complete based only on Node.js `next dev`.

---

# 22. Public Website Smoke Tests

Verify representative public behavior at minimum:

* `/`
* `/ueber-uns`
* `/mode`
* `/outfits`
* `/marken`
* at least one real `/marken/[slug]`
* `/fair-trade`
* `/kontakt`
* `/impressum`
* `/datenschutz`

Verify:

* HTTP success;
* rendering;
* navigation;
* major images;
* responsive behavior where practical;
* obvious runtime errors;
* browser console errors where relevant.

---

# 23. SEO and Routing Verification

Verify existing behavior including:

* existing 301 redirects;
* existing 410 Gone routes;
* canonical URLs;
* dynamic metadata;
* `sitemap.xml`;
* `robots.txt`;
* structured data;
* public/private indexing behavior.

Migration must not silently degrade SEO migration behavior.

---

# 24. Neon / Database Verification

From the Cloudflare runtime verify:

* connection to Neon;
* public database reads;
* dynamic content;
* representative repository queries;
* protected admin reads.

If a safe staging/test environment is available, also verify a controlled write operation.

Do not modify production data merely to prove connectivity if an isolated test is available.

---

# 25. Authentication Verification

Verify:

* unauthenticated `/admin` behavior;
* login page;
* invalid login;
* valid test login where credentials are safely available;
* authenticated admin navigation;
* server-side authorization;
* session cookie behavior;
* session verification under Cloudflare;
* logout.

Authentication must remain fail-closed.

---

# 26. Media Verification

After the R2 implementation, verify:

### New media

* upload a test JPEG/PNG/WebP;
* client-side compression still works;
* server-side validation still works;
* object is stored in R2;
* database media record is created;
* media appears correctly in admin;
* media renders publicly where referenced.

### Delete

* unreferenced test object can be deleted;
* referenced media remains protected;
* database state stays consistent;
* R2 object deletion behaves correctly.

### Existing media

* existing production media remain accessible;
* migrated R2 objects resolve correctly;
* DB references are correct;
* no broken media appear on representative pages.

---

# 27. Consent and Analytics Verification

Preserve existing privacy behavior.

Verify:

* consent banner;
* necessary category behavior;
* Google Analytics does not load before required consent;
* external media behavior remains correctly consent-gated;
* withdrawing consent has the existing expected effect;
* no migration introduces unexpected third-party requests.

---

# 28. Contact Form Verification

Verify:

* rendering;
* Zod/input validation;
* honeypot;
* rate limiting;
* Resend runtime compatibility;
* success/error handling.

Avoid sending unnecessary real emails to the customer.

Use a safe test path or controlled staging verification where possible.

---

# 29. Performance Verification

Check representative public pages after migration.

At minimum evaluate:

* unexpected runtime latency;
* image loading;
* obvious regressions in page rendering;
* Worker errors;
* excessive CPU;
* excessive requests/subrequests;
* asset caching.

Do not make unrelated frontend design changes as part of performance work.

---

# 30. Definition of Done

The migration may be marked `COMPLETE` only if all applicable criteria below are objectively verified.

* [ ] Current Cloudflare deployment approach researched from official documentation.
* [ ] vinext compatibility check performed.
* [ ] Selected Cloudflare adapter/path documented.
* [ ] Cloudflare Workers build succeeds.
* [ ] Application runs in an actual Workers-compatible runtime.
* [ ] Deployed non-production Worker/preview works where credentials permit.
* [ ] Existing public routes function.
* [ ] Neon database reads function.
* [ ] Authentication functions.
* [ ] Admin functions.
* [ ] Existing redirects function.
* [ ] Existing 410 responses function.
* [ ] SEO artifacts remain correct.
* [ ] Vercel Blob dependency has been replaced for active media operations.
* [ ] New uploads use R2.
* [ ] R2 deletion works.
* [ ] Existing Vercel Blob media have a safe migration path.
* [ ] Existing media migration has been verified before old objects are removed.
* [ ] `next/image` / image delivery strategy has been explicitly verified.
* [ ] Contact form remains functional.
* [ ] Consent behavior remains functional.
* [ ] `npm run typecheck` passes.
* [ ] `npm run lint` passes.
* [ ] existing Next.js build passes where still applicable.
* [ ] Cloudflare-specific build passes.
* [ ] browser/runtime smoke tests pass.
* [ ] no significant existing functionality was removed.
* [ ] no production data was damaged.
* [ ] no unexpected paid Cloudflare requirement was silently introduced.
* [ ] Workers Free CPU suitability was verified rather than merely assumed.
* [ ] production DNS has NOT been switched as part of this task.

---

# 31. Completion Classification

Finish the task with exactly one of:

## `COMPLETE`

Implementation and technical verification succeeded and only the explicitly excluded production cutover remains.

## `COMPLETE_WITH_MANUAL_CUTOVER`

The Cloudflare application is technically ready and verified, but production deployment requires explicit owner actions such as:

* DNS change;
* domain binding;
* production secrets;
* final R2 custom domain;
* final media cutover.

## `BLOCKED`

A genuine unresolved technical or external blocker prevents completion.

Do not use `COMPLETE` merely because the code compiles.

---

# 32. Final Migration Report

Before finishing, create a concise migration report containing:

### Architecture

* selected Cloudflare deployment path;
* reason for vinext/OpenNext choice;
* Worker configuration;
* runtime compatibility decisions.

### Storage

* R2 integration approach;
* binding/API choice;
* public delivery architecture;
* existing Blob migration strategy;
* number of media records/objects migrated or pending;
* rollback strategy.

### Removed Vercel dependencies

List each Vercel-specific dependency removed or intentionally retained temporarily.

### Environment

List required environment-variable and binding names.

Do not include secret values.

### Verification

Report actual results for:

* typecheck;
* lint;
* builds;
* Workers preview;
* public routes;
* redirects;
* 410 routes;
* Neon;
* auth;
* admin;
* media;
* consent;
* contact;
* browser smoke tests;
* Free-tier CPU/runtime observations.

### Remaining manual actions

Provide exact manual steps still required before production cutover.

### Rollback

Explain how to return to the current Vercel deployment if a problem appears during the final launch.

---

# 33. Final Rule

The migration goal is not:

> "Cloudflare configuration exists."

The migration goal is:

> **The existing Checkpot application operates on Cloudflare with its current functionality preserved and independently verified, while Vercel-specific infrastructure has been replaced where required and a safe production cutover path exists.**
