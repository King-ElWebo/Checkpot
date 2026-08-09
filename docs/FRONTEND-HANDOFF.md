# Frontend Handoff

Status: `NOT_READY`

Public frontend implementation is complete for the approved Open Design phase, but the frontend is not frozen. `FROZEN_FOR_BACKEND` remains reserved for the separate frontend-freeze workflow.

This handoff records the implemented public routes, serializable contracts, fixture boundaries, SEO artifacts, motion behavior, and verification status for backend integration planning. No production database, storage, email, analytics, consent, map, or third-party provider integration was added in this phase.

## Implemented Routes

| Route | Page component | Status | Notes |
| --- | --- | --- | --- |
| `/` | `src/app/(public)/page.tsx` | Implemented | Homepage with hero, boutique positioning, service highlights, brand preview, outfit preview, contact entry points, `LocalBusiness` JSON-LD. |
| `/ueber-uns` | `src/app/(public)/ueber-uns/page.tsx` | Implemented | Final about route. Includes breadcrumbs, founder/store story, image-led sections, `BreadcrumbList` JSON-LD. |
| `/mode` | `src/app/(public)/mode/page.tsx` | Implemented | Fashion/advice route with non-ecommerce editorial presentation and internal links to outfits, brands, and contact. |
| `/outfits` | `src/app/(public)/outfits/page.tsx` | Implemented | Outfit inspiration using fixture cards plus empty/unpublished-content state. No product, offer, cart, or checkout behavior. |
| `/marken` | `src/app/(public)/marken/page.tsx` | Implemented | Brand overview with active-brand cards, empty state, and internal route linking. |
| `/marken/[slug]` | `src/app/(public)/marken/[slug]/page.tsx` | Implemented | Static brand detail pages with `generateStaticParams`, breadcrumbs, contact CTA, related brand links when fixture data provides them. |
| `/fair-trade` | `src/app/(public)/fair-trade/page.tsx` | Implemented | Values route focused on personal curation and repair/reuse mindset. No unsupported certifications or availability claims. |
| `/kontakt` | `src/app/(public)/kontakt/page.tsx` | Implemented | Address as visible text, external `Route planen` link, no embedded map provider, frontend-only contact form states, `LocalBusiness` and `BreadcrumbList` JSON-LD. |
| `/impressum` | `src/app/(public)/impressum/page.tsx` | Implemented | `noindex` legal route with approved visible business contact facts and a legal-text completion note. |
| `/datenschutz` | `src/app/(public)/datenschutz/page.tsx` | Implemented | `noindex` privacy route describing the current no-provider public frontend phase. |

## Reusable Components And Contracts

| Component/file | Props/type | Fixture source | Backend dependency |
| --- | --- | --- | --- |
| `src/lib/contracts/public.ts` | `PublicRoute`, `PublicImage`, `PublicLink`, `StoreDetails`, `Brand`, `Outfit`, `CollectionIntro`, `BreadcrumbItem`, `SeoRoute`, `ContactFormPayload`, `ContactFormState` | Type-only public contract layer | None. Serializable contracts only. |
| `src/content/fixtures/checkpot.ts` | Typed fixture exports for store details, nav links, images, brands, outfits, collection intro, SEO route metadata | Approved Checkpot content and provided media assets | Replaceable at route composition boundaries. Never a production failure fallback. |
| `src/components/public/layout/site-header.tsx` | `navigation: PublicLink[]` | `navigationLinks` | None. |
| `src/components/public/layout/site-footer.tsx` | `navigation: PublicLink[]` | `navigationLinks`, `storeDetails` | None. |
| `src/components/public/layout/breadcrumbs.tsx` | `items: BreadcrumbItem[]` | Route-local breadcrumb arrays | None. |
| `src/components/public/sections/section-heading.tsx` | `eyebrow`, `title`, `intro`, `align` | Route copy | None. |
| `src/components/public/sections/image-card.tsx` | `image: PublicImage`, `variant`, `priority`, `className` | `imageLibrary`, outfit/brand fixtures | None. |
| `src/components/ui/cta-link.tsx` | Link-style props with internal/external handling | Route copy | None. |
| `src/components/public/forms/contact-form.tsx` | Client-side `ContactFormPayload` state and UI state machine | Frontend-only fixture behavior | Future form mutation required. |
| `src/components/public/seo/json-ld.tsx` | `data: JsonLdData` | Schema helpers | None. |
| `src/components/public/seo/schema.ts` | `localBusinessJsonLd`, `breadcrumbJsonLd` | Visible page/store facts | None. |
| `src/components/public/seo/metadata.ts` | `metadataFor(route)` | `seoRoutes`, `siteUrl`, `ogImage` | None. |
| `src/components/public/motion/reveal-controller.tsx` | No props | CSS/DOM data attributes | None. Progressive enhancement only. |

## Future Reads

| Consumer | Repository method | DTO/type | Parameters | Authorization | Empty/error behavior |
| --- | --- | --- | --- | --- | --- |
| Public shell/header/footer | `getPublicSiteSettings()` | `StoreDetails`, public nav DTO | None | Public | If unavailable after backend integration, fail closed at build/request boundary; do not silently fall back to fixtures in production. |
| `/` | `getHomepageContent()` | Hero, intro, feature links, selected brand/outfit previews | Locale/site id if introduced | Public | Render approved empty sections only where content is intentionally unpublished. |
| `/mode` | `getFashionEditorialContent()` | Fashion intro blocks, advisory copy, selected images | None | Public | Show curated empty state for unpublished editorial content. |
| `/outfits` | `listPublishedOutfits()` | `Outfit[]` | Optional season/filter | Public | Existing empty-state component handles no published outfits. |
| `/marken` | `listPublishedBrands()` | `Brand[]` | None | Public | Existing empty-state component handles no published brands. |
| `/marken/[slug]` | `getPublishedBrandBySlug(slug)` and `listRelatedBrands(slug)` | `Brand`, `Brand[]` | `slug` | Public | 404 for missing/unpublished slug; do not show unpublished content. |
| `/fair-trade` | `getValuesPageContent()` | Values-page copy/image DTOs | None | Public | Render approved static page structure only when records are published. |
| `/kontakt` | `getPublicContactDetails()` | `StoreDetails`, contact channels | None | Public | Keep address visible and copyable; route link remains external only if configured. |
| `/impressum` | `getLegalNotice()` | Legal notice content DTO | None | Public | Legal route must not publish incomplete required legal copy after backend handoff. |
| `/datenschutz` | `getPrivacyPolicy()` | Privacy policy content DTO | None | Public | Legal route must not publish incomplete required privacy copy after backend handoff. |

## Future Mutations And Forms

| Form/action | Execution boundary | Payload | Validation | Success UI | Failure UI | Authorization |
| --- | --- | --- | --- | --- | --- | --- |
| Contact inquiry | Future Server Action or Route Handler | `ContactFormPayload` (`name`, `surname`, `email`, `message`) | Required name/email/message, email format, message length | Implemented frontend success confirmation | Implemented validation, submitting, disabled, and server-error fixture states | Public with server-side abuse protection/rate limits in backend phase. |
| Admin-managed content publishing | Existing protected admin boundary or future modules | Brand, outfit, page copy, media metadata | Schema-specific validation required | Not part of public frontend | Public pages consume only published records | Protected admin only. |

## Data Model Mapping

| Frontend contract/model | Future storage concept | Constraints/relations | Migration | Repository |
| --- | --- | --- | --- | --- |
| `StoreDetails` | Site settings/contact profile | Singleton per site; visible facts only for schema | Future backend phase | `getPublicSiteSettings`, `getPublicContactDetails` |
| `Brand` | Brand records | Unique slug; active/published flag; related brand slugs must resolve to active records | Future backend phase | `listPublishedBrands`, `getPublishedBrandBySlug`, `listRelatedBrands` |
| `Outfit` | Outfit/editorial inspiration records | Published flag; image metadata; optional season/tone tags | Future backend phase | `listPublishedOutfits` |
| `CollectionIntro` | Page/collection editorial block | Published flag; image metadata | Future backend phase | `getHomepageContent`, `getFashionEditorialContent` |
| `SeoRoute` | Route SEO settings | Canonical path, title, description, index/noindex, social image | Future backend phase or static config | `getPublicSeoSettings` if dynamic SEO is later approved |

## Authentication And Admin

- Included single-admin bootstrap: unchanged and sufficient for the public-frontend phase.
- Required roles and ownership rules: no new roles added.
- Required admin modules: none implemented in this phase.
- Session or identity-provider changes: none.
- Protected foundation verified unchanged: no edits to `src/db`, `drizzle`, `src/lib/auth`, `src/lib/repositories`, `src/proxy.ts`, `src/app/login`, `src/app/admin`, or `src/app/api/auth`.

## SEO Artifacts

| Route/artifact | Implementation file | Metadata source | Dynamic dependency | Verified |
| --- | --- | --- | --- | --- |
| `/` | `src/app/(public)/page.tsx`, `src/components/public/seo/metadata.ts` | `docs/SEO-SPEC.md`, `seoRoutes` | Fixture SEO only | Type/lint verified; browser metadata verification blocked locally. |
| Public subpages | Route-level `metadata` exports via `metadataFor(route)` | `docs/SEO-SPEC.md`, `seoRoutes` | Fixture SEO only | Type/lint verified; browser metadata verification blocked locally. |
| `/marken/[slug]` | `generateMetadata` in `src/app/(public)/marken/[slug]/page.tsx` | Brand fixture title/description | Static fixture brand list | Type/lint verified. |
| `LocalBusiness` | `src/components/public/seo/schema.ts` | Visible store facts | `storeDetails` fixture | Present on `/` and `/kontakt`; no reviews, ratings, geo, social URLs, or ecommerce data. |
| `BreadcrumbList` | `src/components/public/seo/schema.ts` | Visible breadcrumbs | Route-local breadcrumb arrays | Present on public subpages. |
| Sitemap | `src/app/sitemap.ts` | `seoRoutes`, active brand fixtures | Fixture brand list | Type/lint verified; runtime route verification blocked locally. |
| Robots | `src/app/robots.ts` | `siteUrl` | None | Type/lint verified; runtime route verification blocked locally. |
| Redirects | `next.config.ts` | Approved SEO redirect list | None | Only `/team -> /ueber-uns` and `/brands -> /marken` implemented as permanent redirects; runtime verification blocked locally. |
| Icons | `src/app/favicon.ico`, `src/app/icon.png`, `src/app/apple-icon.png` | Provided Checkpot favicon/logo assets | None | Files present. |
| Social image | `public/customer/og-image.jpg` | Provided Checkpot image asset | None | File present; final crop/customer approval still recommended. |

## Internal Linking

- Homepage links to `/marken`, `/outfits`, `/ueber-uns`, and `/kontakt`.
- Footer links to `/kontakt`, `/impressum`, and `/datenschutz`.
- Public subpages include visible breadcrumbs.
- Brand overview links to each active brand detail route.
- Each brand detail route links back to `/marken`.
- Each brand detail route links to `/kontakt`.
- Each brand detail route links to related brands where fixture data provides active related slugs.
- Contact and content pages avoid map embeds and external provider loading.

## Motion Implementation

| Route | Section/element | Component/style | Trigger | Mobile/reduced fallback | Verified |
| --- | --- | --- | --- | --- | --- |
| All public routes | Buttons and text links | `src/app/(public)/public.css` | Hover/focus/active | Reduced motion keeps color/focus feedback without spatial movement | CSS/type/lint verified; browser verification blocked locally. |
| All public routes | Image cards | `ImageCard`, `public.css` | Hover/focus-within | Reduced motion removes scale/transform | CSS/type/lint verified; browser verification blocked locally. |
| Approved reveal sections | Elements with `data-reveal` | `RevealController`, `public.css` | IntersectionObserver progressive enhancement | Content visible without JS; reduced motion disables reveal movement and hides nothing | CSS/type/lint verified; browser verification blocked locally. |
| Homepage hero | Hero image/content | `public.css` | Initial CSS animation only | Reduced motion removes transform/animation | CSS/type/lint verified; browser verification blocked locally. |

No generic fade-up was applied to every section. No parallax, scroll hijacking, pinned storytelling, autoplay spectacle, bouncing UI, neon/glow effects, or content-obscuring animation was added.

## Environment And External Services

| Variable/service | Purpose | Required phase | Owner | Status |
| --- | --- | --- | --- | --- |
| `DATABASE_URL` | Neon connection | Backend | Backend integration | Not used by public presentation components. |
| Resend/email provider | Contact inquiry delivery | Backend | Backend integration | Not connected. Frontend-only form states implemented. |
| Vercel Blob/storage | Media storage | Backend/admin | Backend integration | Not connected. Local public assets used for frontend phase only. |
| Analytics/tag manager | Measurement | Release or later if approved | Customer/implementation | Not connected. |
| Map provider | Embedded maps | Not approved for this phase | N/A | Not connected. Contact page uses external route-planning link only. |
| Consent provider | Consent management | Release or later if approved | Customer/implementation | Not connected. |

## Media And Uploads

- Required media types: store/founder photography, outfit/fashion photography, brand-support imagery, favicon/icon/social image.
- Current frontend assets: copied to `public/customer/` from approved existing project media.
- Maximum display dimensions: responsive CSS and `next/image` sizes are implemented per page layout; source files remain replaceable.
- Alt-text ownership: frontend fixture owns current alt text; future CMS/admin media records should store alt text per image.
- Upload/crop behavior: not implemented in this phase.
- Deletion behavior: not implemented in this phase.
- Remaining media requirement: customer should approve final hero/social-image crop and any final brand imagery before frontend freeze.

## UI State Coverage

- [x] Loading states: route-level `src/app/(public)/loading.tsx` plus form submitting state.
- [x] Empty states: brand/outfit empty-state sections for unpublished or absent fixture data.
- [x] Validation errors: contact form required fields, email format, message length.
- [x] External-service/server errors: contact form server-error fixture state without external service connection.
- [x] Success confirmation: contact form success state.
- [x] Disabled/submitting states: contact form submit button and fields.
- [x] Hover/focus/active states: links, CTA links, image cards, nav, form fields.
- [x] Keyboard and focus states: semantic links/buttons/inputs, skip link, visible focus styling.
- [x] Reduced-motion behavior: CSS media query and `RevealController` gate.
- [x] Approved scroll-motion behavior: only explicit reveal hooks, progressive enhancement.
- [x] Metadata, canonicals, social previews, and structured data: implemented in route metadata and JSON-LD helpers.
- [x] Sitemap, robots, and index/noindex behavior: implemented through Next metadata routes and route metadata.

## Responsive And Accessibility Verification

Target widths required by the approved contracts:

- 390px
- 768px
- 1024px
- 1440px
- Representative wide screen: 1920px

Implementation includes semantic landmarks, skip link, visible focus states, accessible labels and validation feedback, copyable address text, external-route link labeling, meaningful alt text for informative images, decorative-empty alt usage where applicable, sufficient contrast tokens, and touch-friendly controls.

Local browser verification is blocked in this environment:

- `npm run dev -- --hostname=127.0.0.1 --port=3000` fails during Next startup with `Error: spawn EPERM`.
- `npm run build` compiles the application but fails at Next's internal "Running TypeScript ..." worker/process step with `spawn EPERM`.
- The browser connector reports no browser is available.
- Playwright packages are not installed in `node_modules`.
- No local Chrome or Edge executable was discoverable from the shell.

Manual source-level checks and repository checks completed where possible; full viewport/browser verification must be repeated in an environment that allows Next to spawn its worker processes and provides a browser.

## Verification Results

| Check | Command/width | Result |
| --- | --- | --- |
| Public forbidden imports | `rg "@/db|@/lib/auth|@/lib/repositories|@neondatabase|drizzle" -- "src/app/(public)" "src/components/public" "src/content/fixtures" "src/lib/contracts"` | Passed: no matches. |
| Protected foundation diff | `git diff --name-only -- src/db drizzle src/lib/auth src/lib/repositories src/proxy.ts src/app/login src/app/admin src/app/api/auth` | Passed: no protected foundation changes. |
| Type check | `npm run typecheck` | Passed after regenerating/removing stale generated Next dev validator state. |
| Lint | `npm run lint` | Passed. |
| Production build | `npm run build` | Blocked: app compiles, then Next fails at internal TypeScript worker/process step with `spawn EPERM`. |
| Dev server | `npm run dev -- --hostname=127.0.0.1 --port=3000` | Blocked: Next dev startup fails with `spawn EPERM`. |
| Browser widths | 390, 768, 1024, 1440, 1920 | Blocked locally because no usable browser/dev server was available. |
| Redirect runtime | `/team`, `/brands` | Implemented in `next.config.ts`; runtime verification blocked locally. |
| Sitemap/robots runtime | `/sitemap.xml`, `/robots.txt` | Implemented; runtime verification blocked locally. |

## Frontend Freeze Readiness

- Visual approval: pending customer/frontend-freeze workflow.
- Responsive verification: implementation complete; real-browser verification blocked locally by `spawn EPERM` and unavailable browser.
- Known visual issues: none found through source review; browser pass still required.
- Content still awaiting customer approval: final legal notice/privacy copy, final social-image crop, final media selection/crops, optional full legacy URL migration inventory.
- Changes allowed during backend integration: replace fixtures with repository DTOs at route composition boundaries only; preserve public presentation component props and serializable contracts unless freeze workflow approves a contract change.
- Protected foundation verified unchanged: yes.
- SEO specification verified: implemented for approved current routes and explicit redirects only.
- Motion plan verified: implemented source-level; browser verification still required.

## Unresolved Issues

- Local environment blocks full production build completion and dev-server/browser verification with `spawn EPERM`.
- Full real-browser verification at 390px, 768px, 1024px, 1440px, and 1920px still needs to run in an environment with a working browser.
- Final legal text for `/impressum` and `/datenschutz` should be customer/legal approved before freeze.
- Final social-image/hero imagery should be customer approved before freeze.
- Complete legacy URL inventory remains a downstream SEO migration task; only `/team` and `/brands` redirects were implemented in this phase.
