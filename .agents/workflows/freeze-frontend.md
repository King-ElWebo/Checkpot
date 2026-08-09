# Freeze Frontend

Description: Verify the Open Design result and create a stable contract for backend integration.

1. Read `docs/PROJECT-SPEC.md`, `docs/DESIGN-SYSTEM.md`, `docs/SEO-SPEC.md`, `OPEN_DESIGN.md`, and `docs/FRONTEND-HANDOFF.md`.
2. Inspect every required public route and reusable presentation component.
3. Run the relevant type check, lint, and production build.
4. Use browser verification at narrow mobile and desktop widths; add tablet or wide-screen checks where layout risk warrants it.
5. Verify navigation, responsiveness, overflow, semantic headings, keyboard operation, focus, contrast, reduced motion, imagery, and metadata.
6. Verify every SEO route row: title, description, canonical, index directive, social image, structured data, sitemap inclusion, robots behavior, and approved redirects.
7. Verify every motion row: trigger, replay, rapid reverse scrolling, small viewport height, touch/mobile fallback, reduced motion, progressive enhancement, layout shift, and dropped frames.
8. Verify relevant loading, empty, validation, error, success, submitting, and disabled states.
9. Compare fixture types with rendered component props.
10. Complete `docs/FRONTEND-HANDOFF.md` with all required reads, mutations, payloads, SEO artifacts, motion implementation, media needs, auth/admin dependencies, and unresolved content.
11. Confirm the exact public output layout and that Open Design preserved `src/db/`, `drizzle/`, `src/lib/auth/`, `src/lib/repositories/`, `src/proxy.ts`, `/login`, `/admin`, and `/api/auth`.
12. Fix frontend defects within the approved direction. Do not connect production services.
13. Set handoff status to `FROZEN_FOR_BACKEND` only when required routes, SEO, motion, and states are complete and visual review passes.
14. Report evidence and any explicitly accepted frontend debt.
