# Frontend and Open Design Rule

Apply this rule to public pages, layouts, presentation components, styles, responsive behavior, accessibility, animations, and frontend review.

## Required inputs

- `@../../docs/PROJECT-SPEC.md`
- `@../../docs/DESIGN-SYSTEM.md`
- `@../../docs/SEO-SPEC.md`
- `@../../OPEN_DESIGN.md`
- `@../skills/ui-ux-pro-max/references/motion-principles.md`

Do not implement if the project specification is not `APPROVED_FOR_DESIGN`, the design system is not `APPROVED_FOR_FRONTEND`, or the SEO specification is not `APPROVED_FOR_FRONTEND`, unless the user explicitly requests an isolated experiment.

## Completion standard

- Build every specified public route, not only a homepage.
- Give each page a clear purpose, hierarchy, primary action, metadata, and responsive layout.
- Use realistic project-specific content and fixtures rather than lorem ipsum or generic AI copy.
- Create reusable primitives and sections when patterns genuinely repeat.
- Centralize project tokens in the documented styling layer.
- Implement relevant loading, empty, validation, error, success, submitting, disabled, hover, focus, touch, and reduced-motion states.
- Use semantic HTML, visible focus, correct labels, meaningful alternative text, sufficient contrast, and keyboard operation.
- Verify narrow mobile, tablet, laptop, and wide desktop layouts in a browser.
- Use the exact public route-group, component, fixture, contract, style, asset, and metadata layout defined in `OPEN_DESIGN.md`.

## SEO

- Implement every approved route in `docs/SEO-SPEC.md` with typed metadata from a Server Component.
- Use absolute canonicals from `SITE_URL`, approved social imagery, and only substantiated structured data.
- Generate `src/app/sitemap.ts` and `src/app/robots.ts`; exclude admin, login, previews, and private routes from indexing.
- Keep metadata content-specific and useful. Do not keyword-stuff, duplicate titles across routes, or invent customer facts.
- Treat robots and noindex as crawler guidance, never as security.

## Motion

- Use the routed motion principles for timing, easing, interruptibility, input behavior, accessibility, and performance.
- Avoid `transition-all` and permanent blanket `will-change`.
- Prefer transform and opacity for frequent motion.
- Do not make hover essential to comprehension or operation.
- Repeated actions should feel immediate; animation must not delay them.
- Implement the section-level motion matrix from `docs/DESIGN-SYSTEM.md`.
- Do not use a generic reveal on every section or hide essential content until JavaScript runs.
- Verify scroll-linked motion under rapid scrolling, small viewport heights, touch input, mobile widths, and reduced motion.

## Frontend-only boundary

During Open Design, do not connect production providers, auth, uploads, email, payments, or migrations. Document future data and mutation needs in `docs/FRONTEND-HANDOFF.md`.

Replace the placeholder root redirect with the approved customer homepage, but preserve the technical foundation under `src/db/`, `drizzle/`, `src/lib/auth/`, `src/lib/repositories/`, `src/proxy.ts`, `src/app/login/`, `src/app/admin/`, and `src/app/api/auth/`. Change those areas only when the user explicitly includes them in the frontend task.
