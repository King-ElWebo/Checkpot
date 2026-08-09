---
name: ui-ux-pro-max
description: Generates and refines a customer-specific web design system using the bundled UI/UX Pro Max knowledge base. Use for website visual direction, page planning, colors, typography, responsive layout, accessibility, interaction design, scroll animation, motion guidance, frontend generation, or UI quality reviews.
---

# UI/UX Pro Max

Use the bundled search engine as a recommendation tool, then reconcile its output with the approved customer brief and project motion principles.

## Design-system workflow

1. Read `docs/PROJECT-SPEC.md`. Stop if its status is not `APPROVED_FOR_DESIGN` or if visual blockers remain.
2. Build a compact query from site type, industry, audience, and three to five approved brand adjectives.
3. Run:

   ```powershell
   python .ai-agents/ui-ux-pro-max-skill/src/ui-ux-pro-max/scripts/search.py "<query>" --design-system -p "<project name>"
   ```

4. If the script is missing, report that the local vendor package must be restored. Do not invent search results.
5. Treat generated styles, colors, fonts, and effects as candidates—not requirements.
6. Reject recommendations that conflict with the customer specification, accessibility, content needs, performance, or the existing brand.
7. Read `references/motion-principles.md` for motion, interaction, reduced motion, and performance. Do not treat motion guidance as a visual brand brief.
8. Define a section-level motion decision for every prominent section. Record purpose, trigger, replay, mobile, reduced motion, performance constraints, and implementation approach; use `none` when motion adds no value.
9. Write the resolved decisions to `docs/DESIGN-SYSTEM.md` before building pages.

## Frontend guidance

- Use `docs/DESIGN-SYSTEM.md` as the visual contract.
- Keep the page system coherent without making every page visually identical.
- Prefer semantic structure and resilient responsive layout over screenshot-perfect fixed coordinates.
- Define tokens centrally and avoid unexplained arbitrary values.
- Provide keyboard, focus, touch, contrast, and reduced-motion behavior.
- Use animation to explain state or provide feedback; avoid decorative motion that delays frequent actions.
- Do not solve scroll storytelling with one repeated fade-up preset. Vary motion only when hierarchy and narrative justify it.
- Keep essential content visible without JavaScript and define mobile and reduced-motion fallbacks before implementation.

## Review workflow

When reviewing an existing frontend:

1. Compare it with `docs/PROJECT-SPEC.md` and `docs/DESIGN-SYSTEM.md`.
2. Inspect required routes at mobile and desktop widths.
3. Check hierarchy, spacing, typography, contrast, focus, touch targets, overflow, motion, and all specified UI states.
4. Fix issues within the approved direction instead of replacing the direction with a fresh generic recommendation.
5. Update `docs/FRONTEND-HANDOFF.md` if props, forms, or data-dependent states change.

Read `references/motion-principles.md` whenever the task includes animation, interactive states, frontend generation, or UI review.

Read `references/motion-playbook.md` only when advanced gestures, orchestration, animation debugging, or implementation examples are needed.

Read `references/motion-playbook.md` when the approved design includes sticky storytelling, scroll-progress sequences, parallax, image masks, coordinated reveals, or gesture-linked motion. `references/motion-principles.md` remains binding when the playbook uses stronger absolute wording.

For query construction and result mapping, read `references/query-guide.md` only when generating or materially revising a design system.
