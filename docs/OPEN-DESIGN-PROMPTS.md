# Open Design Prompts

These launcher prompts are intentionally short. The approved Markdown contracts carry the customer context; do not duplicate them into an unmaintainable one-off prompt and never paste secrets into Open Design.

## How the prompt is prepared

1. Consolidate customer facts in `docs/PROJECT-SPEC.md`.
2. Approve the visual and section-level motion direction in `docs/DESIGN-SYSTEM.md`.
3. Approve page-level SEO in `docs/SEO-SPEC.md`.
4. Run `/prepare-open-design`.
5. Use the generated launcher below and append only the current approved change request.

## Initial full-frontend build

```text
Execute only the approved public-frontend phase of this repository.

Read AGENTS.md and OPEN_DESIGN.md, then fully read every required contract routed from OPEN_DESIGN.md. Treat docs/PROJECT-SPEC.md, docs/DESIGN-SYSTEM.md, and docs/SEO-SPEC.md as approved customer-specific sources of truth.

Build every approved public route using the exact file layout in OPEN_DESIGN.md. Implement the approved responsive layouts, UI states, metadata, structured data, and section-level motion plan, including scroll animations, mobile fallbacks, and prefers-reduced-motion behavior.

Use typed serializable contracts and realistic fixtures only. Do not connect production services or create migrations. Preserve the protected database, auth, login, admin, and Proxy foundation exactly as required by OPEN_DESIGN.md.

Verify the frontend in a browser at the required widths. Before finishing, complete docs/FRONTEND-HANDOFF.md with routes, component contracts, fixtures, reads, mutations, SEO artifacts, motion implementation, media needs, and unresolved issues.
```

## Approved revision

```text
Revise the existing public frontend only for the approved change request below.

Re-read OPEN_DESIGN.md, docs/PROJECT-SPEC.md, docs/DESIGN-SYSTEM.md, docs/SEO-SPEC.md, and docs/FRONTEND-HANDOFF.md. Preserve accepted routes, visual direction, component contracts, SEO decisions, motion behavior, and the protected technical foundation unless the change request explicitly updates one of those contracts.

Approved change request:
[describe the accepted customer feedback precisely]

Verify affected mobile and desktop routes, reduced motion, metadata, and relevant UI states. Update docs/FRONTEND-HANDOFF.md when a contract changes.
```

## Completion and handoff

```text
Perform a frontend-completeness pass without starting backend integration.

Compare every required route and acceptance criterion against docs/PROJECT-SPEC.md, docs/DESIGN-SYSTEM.md, docs/SEO-SPEC.md, OPEN_DESIGN.md, and the current implementation. Fix in-scope frontend defects, verify responsive behavior, accessibility, metadata, structured data, scroll/motion behavior, reduced motion, loading, empty, validation, error, success, and submitting states.

Complete docs/FRONTEND-HANDOFF.md. Do not connect Neon, Drizzle queries, auth changes, storage, email, payments, CMS, or external APIs.
```
