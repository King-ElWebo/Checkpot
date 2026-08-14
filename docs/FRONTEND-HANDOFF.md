# Frontend Handoff

Status: `NOT_READY`

This document tracks the completion of the public frontend and its architectural boundaries. It will be completed by the frontend design agent (e.g., Open Design) before the frontend is frozen for backend integration.

## Implemented Routes
- `/` - Home (Static)
- `/ueber-uns` - About (Static)
- `/mode` - Collections (Static)
- `/outfits` - Outfits (Static)
- `/marken` - Brands Overview (Static)
- `/marken/[slug]` - Brand Detail (Dynamic, pre-rendered via `generateStaticParams`)
- `/fair-trade` - Sustainability (Static)
- `/kontakt` - Contact (Static)
- `/impressum` - Legal (Static, noindex)
- `/datenschutz` - Privacy (Static, noindex)

## Reusable Components And Contracts
- `src/lib/contracts/public.ts`: Data types representing business objects (`Brand`, `Outfit`, `StoreDetails`).
- `src/components/ui/`: `Button`, `Card`, `Breadcrumbs` (with embedded JSON-LD).
- `src/components/public/layout/`: `Navbar`, `Footer`.
- `src/components/public/motion/`: `FadeIn`, `StaggeredList` using native `IntersectionObserver`.

## Fixture And Media Usage
- Mock data is isolated in `src/content/fixtures/checkpot.ts`.
- Customer-owned media is read from `public/customer/` and served via `next/image`.
- The final database queries must replace the imports from `src/content/fixtures/checkpot.ts` at the route/page level, without modifying the components or data contracts.

## Future Reads and Mutations
- The Contact form in `/kontakt` is currently a UI-only prototype (static HTML). The backend integration agent must wire it up to Resend or the respective API handler.
- Legal facts in `/impressum` and `/datenschutz` are incomplete and must be verified by the customer.

## SEO Artifacts
- Static routes and active brands are listed in `sitemap.ts`.
- Excluded routes (`/admin`, `/login`, `/api`) are listed in `robots.ts`.
- JSON-LD for `LocalBusiness` is injected in `/` and `/kontakt`.
- JSON-LD for `BreadcrumbList` is injected in all public pages via `<Breadcrumbs>`.
- Redirects from `/team` and `/brands` are active in `next.config.ts`.

## Motion Implementation
- Strictly applied via `IntersectionObserver` avoiding heavy animation libraries.
- Honors `prefers-reduced-motion` at the CSS level and inside the React effect hooks.

## Verification Results
- TypeScript types match strictly.
- Pre-rendering generates static HTML successfully.
- ESLint checks pass.
- Open Design MCP visual critique passes (mock).

## Unresolved Issues
- Legal notices in `/impressum` and `/datenschutz` need final customer copy.
- Real API endpoints need to be connected (Contact form, dynamic content).
