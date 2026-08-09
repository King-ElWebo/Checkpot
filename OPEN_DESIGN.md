# Open Design Frontend Contract

Use this file when connecting the copied customer project to Open Design.

## Required context

Read these files before generating code:

1. `docs/PROJECT-SPEC.md`
2. `docs/DESIGN-SYSTEM.md`
3. `docs/SEO-SPEC.md`
4. `.agents/rules/frontend.md`
5. `.agents/skills/ui-ux-pro-max/references/motion-principles.md`
6. `.agents/skills/ui-ux-pro-max/references/motion-playbook.md` only for approved advanced scroll, gesture, or orchestration work
7. `.agents/skills/ui-ux-pro-max/SKILL.md` only when the design system is missing or needs material revision

Do not recursively load the entire repository or the bundled UI/UX vendor package. The files above contain the routed context.

Do not begin unless `docs/PROJECT-SPEC.md` is `APPROVED_FOR_DESIGN`, `docs/DESIGN-SYSTEM.md` is `APPROVED_FOR_FRONTEND`, and `docs/SEO-SPEC.md` is `APPROVED_FOR_FRONTEND`.

## Mission

Build the complete public frontend specified by the customer:

- every required route and section, not only the homepage;
- shared navigation, footer, primitives, and reusable sections;
- realistic customer-specific fixtures with stable TypeScript props;
- mobile, tablet, laptop, and wide-desktop behavior;
- loading, empty, validation, error, success, disabled, hover, focus, and reduced-motion states where relevant;
- semantic structure, accessible controls, metadata, and meaningful imagery;
- motion consistent with the approved design system and the routed motion principles.

## Required output layout

Public routes use one route group so they can share customer navigation, footer, tokens, and styles without changing the protected admin shell:

```text
src/
|-- app/
|   |-- (public)/
|   |   |-- layout.tsx
|   |   |-- page.tsx
|   |   |-- public.css
|   |   |-- [approved-route]/page.tsx
|   |   |-- loading.tsx                 when a route needs streaming fallback
|   |   `-- error.tsx                   when a recoverable route error is possible
|   |-- robots.ts
|   |-- sitemap.ts
|   `-- opengraph-image.*               when the approved SEO plan uses a global image
|-- components/
|   |-- public/
|   |   |-- layout/
|   |   |-- sections/
|   |   |-- forms/
|   |   |-- motion/
|   |   `-- seo/
|   `-- ui/
|-- content/
|   `-- fixtures/
|-- lib/
|   `-- contracts/
public/
`-- customer/
```

- Remove the placeholder `src/app/page.tsx` only after `src/app/(public)/page.tsx` exists. Both files cannot resolve to `/`.
- Keep the top-level `src/app/layout.tsx`. Put public navigation and footer in `src/app/(public)/layout.tsx`.
- Import `public.css` from the public layout and scope customer tokens and broad selectors under a `.public-site` wrapper so admin and login styling cannot drift.
- Put route-specific Server Components in their route folders, reusable customer sections in `src/components/public/`, low-level reusable primitives in `src/components/ui/`, realistic frontend-only data in `src/content/fixtures/`, and shared serializable types in `src/lib/contracts/`.
- Put customer-owned static assets below `public/customer/` with descriptive stable names. Do not invent final assets when ownership is unresolved.
- Add another top-level folder only when the approved specification gives it a distinct responsibility.

## SEO contract

- Implement the route matrix in `docs/SEO-SPEC.md` using typed static `metadata` or `generateMetadata` from Server Components.
- Create `src/app/sitemap.ts` and `src/app/robots.ts`; include only canonical indexable public routes in the sitemap.
- Derive absolute canonicals, sitemap URLs, and social URLs from the approved `SITE_URL`.
- Use approved static social images or colocated `opengraph-image.tsx`; never fabricate customer claims in metadata or structured data.
- Render approved JSON-LD from visible approved content and serialize it safely.
- Keep admin, login, preview, and private routes out of public indexing. Robots directives are not authorization.

## Motion and scroll contract

- Implement every row in the section-level motion matrix in `docs/DESIGN-SYSTEM.md`; do not add a generic fade-up to every section.
- Record the purpose, trigger, replay behavior, mobile fallback, reduced-motion fallback, and implementation approach for scroll-linked work.
- Prefer progressive enhancement: essential content must remain visible and usable if JavaScript or observers fail.
- Keep public motion Client Components small and isolated below `src/components/public/motion/`.
- Use the simplest measured implementation that satisfies the approved behavior. Add an animation dependency only when CSS, IntersectionObserver, or the Web Animations API cannot express the approved interaction cleanly.
- Avoid unthrottled scroll state in React, layout thrashing, permanent `will-change`, delayed interaction, and motion that harms LCP, CLS, or responsiveness.
- Verify real mobile behavior and `prefers-reduced-motion`; do not merely disable a CSS class without checking the resulting layout.

## Boundary

Do not connect production databases, CMSs, authentication, storage, email, payments, or external APIs. Do not create migrations. Forms may demonstrate interaction locally but must document their future payload and states.

Preserve the existing backend and admin foundation:

- `src/db/` and `drizzle/`;
- `src/lib/auth/` and `src/lib/repositories/`;
- `src/proxy.ts`;
- `src/app/login/`, `src/app/admin/`, and `src/app/api/auth/`.

Do not restyle or restructure the login and admin areas unless the user explicitly adds them to the approved design scope.

Before finishing, update `docs/FRONTEND-HANDOFF.md` with routes, components, props, reads, mutations, forms, SEO artifacts, implemented motion, media needs, UI states, and unresolved issues. Open Design completes the handoff content but does not set `FROZEN_FOR_BACKEND`; the `/freeze-frontend` workflow owns that approval.
