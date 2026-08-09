# Prepare Open Design

Description: Resolve the final frontend, SEO, and motion contracts and produce the exact launcher prompt for Open Design.

1. Read `AGENTS.md`, `OPEN_DESIGN.md`, `docs/PROJECT-SPEC.md`, `docs/DESIGN-SYSTEM.md`, `docs/SEO-SPEC.md`, and `docs/OPEN-DESIGN-PROMPTS.md`.
2. Stop if the project specification is not `APPROVED_FOR_DESIGN` or the design system is not `APPROVED_FOR_FRONTEND`.
3. Compare the required-route list with the SEO route matrix and the section-level motion matrix.
4. Ask one short grouped round of questions for missing titles, search intent, canonicals, structured data, scroll storytelling, mobile behavior, or reduced-motion behavior.
5. Write confirmed SEO decisions to `docs/SEO-SPEC.md` and confirmed motion decisions to `docs/DESIGN-SYSTEM.md`; require explicit approval for material additions.
6. Reject invented customer facts, unsupported SEO claims, generic animation on every section, and motion without an approved purpose.
7. Set `docs/SEO-SPEC.md` to `APPROVED_FOR_FRONTEND` only when all required routes and technical artifacts are resolved.
8. Confirm the Open Design output layout has no route conflict with `src/app/page.tsx` and preserves every protected foundation path.
9. Confirm required customer assets exist or are explicitly marked as placeholders with an owner.
10. Select the initial-build prompt from `docs/OPEN-DESIGN-PROMPTS.md`; do not duplicate the full customer brief into the prompt.
11. Return the final prompt verbatim, the approved input files, asset gaps, and a `READY_FOR_OPEN_DESIGN` or `BLOCKED` verdict.
12. Do not build pages, connect services, create migrations, or modify the protected application foundation.
