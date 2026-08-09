# Generate Design System

Description: Produce the approved customer-specific visual system before frontend implementation.

1. Read `docs/PROJECT-SPEC.md` and stop if it is not `APPROVED_FOR_DESIGN`.
2. Use the `ui-ux-pro-max` skill.
3. Generate recommendations from the bundled search tool using the approved site type, industry, audience, and brand adjectives.
4. Compare recommendations with customer references, existing brand assets, content needs, accessibility, performance, and `.agents/skills/ui-ux-pro-max/references/motion-principles.md`.
5. Accept, adjust, or reject each major recommendation deliberately.
6. Define the global motion character and a section-level decision for every prominent section, including purpose, trigger, replay, mobile, reduced motion, performance constraints, and implementation approach.
7. Use `none` deliberately where motion adds no value; do not prescribe one generic reveal for every section.
8. Write the resolved direction to `docs/DESIGN-SYSTEM.md` with status `APPROVED_FOR_FRONTEND`.
9. Include semantic colors, typography, spacing, widths, radii, borders, shadows, icons, imagery, component character, responsive principles, motion, and explicit anti-patterns.
10. Do not build pages or connect backend services.
11. Report the query used, important deviations from generated advice, unresolved SEO or motion decisions, and whether `/prepare-open-design` can run.
