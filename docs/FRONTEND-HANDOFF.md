# Frontend Handoff

Status: `NOT_READY`

The approved public frontend is implemented and has received a focused customer-facing revision. This document is not a freeze approval. `FROZEN_FOR_BACKEND` remains reserved for the separate frontend-freeze workflow.

No production database, storage, email, analytics, consent, map, or third-party provider integration was added. Fixtures remain replaceable at the documented composition boundaries and must not become production failure fallbacks.

## Implemented Routes

| Route | Page component | Presentation status |
| --- | --- | --- |
| `/` | `src/app/(public)/page.tsx` | Personal boutique homepage with compact hero, current outfits, typographic brand preview, visit information, and `LocalBusiness` JSON-LD. |
| `/ueber-uns` | `src/app/(public)/ueber-uns/page.tsx` | Christa-focused about page with corrected portrait focal point, store gallery, breadcrumbs, and `BreadcrumbList` JSON-LD. |
| `/mode` | `src/app/(public)/mode/page.tsx` | Seasonal editorial overview anchored by current collection imagery and links to outfits, brands, and contact. |
| `/outfits` | `src/app/(public)/outfits/page.tsx` | Image-led lookbook with varied proportions, styling notes, conditional empty state, breadcrumbs, and internal links. |
| `/marken` | `src/app/(public)/marken/page.tsx` | Compact editorial brand index using typographic cards instead of misleading generic brand photos. |
| `/marken/[slug]` | `src/app/(public)/marken/[slug]/page.tsx` | Static brand detail pages with `generateStaticParams`, verified image use only where supported, related-brand links, contact CTA, and breadcrumbs. |
| `/fair-trade` | `src/app/(public)/fair-trade/page.tsx` | Evidence-aware principles page with authentic store/textile imagery and restrained editorial hierarchy. |
| `/kontakt` | `src/app/(public)/kontakt/page.tsx` | Visit-focused contact page with copyable address, phone, email, WhatsApp, external route-planning link, store image, frontend-only form states, `LocalBusiness`, and `BreadcrumbList`. |
| `/impressum` | `src/app/(public)/impressum/page.tsx` | `noindex` legal route with visible business contact facts and concise legal completion notice. |
| `/datenschutz` | `src/app/(public)/datenschutz/page.tsx` | `noindex` privacy route with factual completion notice and no internal implementation language. |

## Reusable Components And Contracts

| File | Current public contract |
| --- | --- |
| `src/lib/contracts/public.ts` | Serializable public types: `PublicRoute`, `PublicImage`, `PublicLink`, `StoreDetails`, `Brand`, `Outfit`, `CollectionIntro`, `BreadcrumbItem`, `SeoRoute`, `ContactFormPayload`, `ContactFormState`. `PublicImage` includes optional `objectPosition` for verified focal points. |
| `src/content/fixtures/checkpot.ts` | Approved Checkpot fixture source for store facts, navigation, imagery, outfits, brands, current collection, SEO routes, and focal points. |
| `src/components/public/layout/site-header.tsx` | Compact responsive navigation with logo, accessible menu button, `aria-expanded`, Escape close, route-change close, visible focus, and mobile/tablet height reduction. |
| `src/components/public/layout/site-footer.tsx` | Compact footer with address, opening hours, phone, email, route-planning access, and legal/contact links. |
| `src/components/public/sections/image-card.tsx` | `image`, optional `title`, `text`, `ratio`, `reveal`, `sizes`, and `preload`. Uses `next/image`, stable aspect containers, focal points, and non-misleading fallback text. |
| `src/components/public/forms/contact-form.tsx` | Frontend-only contact form with natural German labels, validation, submitting, success, server-error fixture state, and disabled controls while submitting. |
| `src/components/public/motion/reveal-controller.tsx` | Progressive reveal enhancement only for explicit `data-reveal` elements. Content is visible by default, rescanned after client navigation, supports newly mounted nodes, and shows all content immediately for reduced motion or missing observer support. |
| `src/components/public/seo/*` | Metadata, `LocalBusiness`, and `BreadcrumbList` helpers using visible approved facts only. |
| `src/components/ui/cta-link.tsx` | Internal/external CTA link component with safe external-link behavior. |

## Fixture And Media Usage

Current fixture media is customer-owned project media under `public/customer/`. The focused revision added only two curated assets copied from the provided legacy/customer media folders:

- `public/customer/store-sustainable-shelf.jpg`
- `public/customer/textile-sorgenfri-detail.jpg`

Media behavior:

- Store, founder, outfit, textile, and social images use meaningful alt text where informative.
- Brand overview and most brand detail pages use typographic brand treatments unless verified brand-specific imagery exists.
- Sorgenfri detail uses the verified textile detail image; other brands do not reuse unrelated outfit/store photos as brand-specific proof.
- Image focal points are recorded through `PublicImage.objectPosition`.
- Above-the-fold homepage and logo imagery is prioritized; gallery images are lazy-loaded with layout-specific `sizes`.
- Fallbacks say `Bild folgt` and do not misrepresent missing customer media.

Remaining media requirements:

- Customer approval of final hero and social-image crops.
- Brand-specific photography if Checkpot wants photographic brand detail pages for more labels.
- Final legal/privacy content approved by the responsible party before freeze.

## Route-Specific Revision Notes

- Homepage: hero proportions reduced on mobile, current outfits and brands now form a concise visit story, and repeated shop-negation copy was removed.
- `/mode`: changed from a repeated gallery into a seasonal editorial overview with restrained collage imagery.
- `/outfits`: made the route the primary lookbook; empty state now renders only when the outfit collection is actually empty.
- `/marken`: changed to a compact brand index with clearer differentiation and no misleading generic images.
- `/marken/[slug]`: removed fixture/implementation language and uses verified imagery only where appropriate.
- `/fair-trade`: replaced large generic cards with concise principles and one authentic store/textile image treatment.
- `/ueber-uns`: strengthened Christa as the focus, corrected portrait focal point, and removed relaunch wording.
- `/kontakt`: rewritten as an invitation to visit, with visible copyable address and no map embed or delivery-provider language.
- Footer: now includes address, hours, phone, email, and route planning without becoming a large sitemap.

## Future Reads

| Consumer | Future repository method | DTO/type | Empty/error behavior |
| --- | --- | --- | --- |
| Public shell/header/footer | `getPublicSiteSettings()` | `StoreDetails`, public nav DTO | Fail closed at backend boundary; do not silently fall back to fixtures in production. |
| `/` | `getHomepageContent()` | Hero, intro, selected brand/outfit previews | Render only approved empty states where content is intentionally unpublished. |
| `/mode` | `getFashionEditorialContent()` | Seasonal editorial copy/images | Show curated unpublished/empty state only if approved. |
| `/outfits` | `listPublishedOutfits()` | `Outfit[]` | Existing empty state handles no published outfits. |
| `/marken` | `listPublishedBrands()` | `Brand[]` | Existing empty state handles no published brands. |
| `/marken/[slug]` | `getPublishedBrandBySlug(slug)`, `listRelatedBrands(slug)` | `Brand`, `Brand[]` | 404 for missing/unpublished slug. |
| `/fair-trade` | `getValuesPageContent()` | Values-page copy/image DTOs | Publish only evidence-backed wording. |
| `/kontakt` | `getPublicContactDetails()` | `StoreDetails`, contact channels | Keep address visible and copyable; route link remains external only if configured. |
| `/impressum` | `getLegalNotice()` | Legal notice content DTO | Do not freeze with incomplete required legal copy. |
| `/datenschutz` | `getPrivacyPolicy()` | Privacy policy content DTO | Do not freeze with incomplete required privacy copy. |

## Future Mutations And Revalidation

| Area | Future boundary | Notes |
| --- | --- | --- |
| Contact inquiry | Future Server Action or Route Handler using `ContactFormPayload` | Server-side validation, rate limiting, abuse protection, and email delivery still required. Current UI states are frontend-only. |
| Brands | Protected admin/content module | Revalidate `/marken`, changed `/marken/[slug]`, sitemap, and any linked homepage preview. |
| Outfits/lookbook | Protected admin/content module | Revalidate `/outfits`, `/mode`, `/`, sitemap if route presence changes. |
| Store settings/contact | Protected admin/content module | Revalidate `/`, `/kontakt`, footer-bearing routes if rendered statically, `LocalBusiness`, sitemap/robots if applicable. |
| Legal pages | Protected admin/content module | Revalidate `/impressum` or `/datenschutz` only. |

No blanket full-site revalidation is implemented or recommended for isolated future content changes.

## SEO Artifacts

- Public metadata uses `metadataBase` and the approved title template `%s | Checkpot Hietzing`.
- Homepage metadata comes from `metadataFor("/")` and does not contain `Admin Platform`.
- Canonical URLs, robots directives, social image contract, noindex legal pages, sitemap, and robots behavior are implemented through the existing public SEO helpers/routes.
- `LocalBusiness` JSON-LD is present on `/` and `/kontakt` using only visible store facts.
- `BreadcrumbList` JSON-LD matches visible breadcrumbs on public subpages.
- No `Product`, `Offer`, cart, checkout, review, rating, geo-coordinate, social-profile, or unsupported certification structured data is emitted.
- `next.config.ts` contains only the approved 301 redirects: `/team -> /ueber-uns` and `/brands -> /marken`.

## Motion Implementation

- Content is visible without JavaScript.
- Reveal motion is opt-in through explicit `data-reveal` only; no generic animation is applied to every section.
- The revised controller rescans after client-side navigation and observes newly mounted elements.
- Elements are never left hidden if the observer does not run; a timeout fallback reveals pending items.
- `prefers-reduced-motion` removes spatial movement and scroll reveal behavior while preserving functional feedback.
- No parallax, scroll hijacking, pinned scenes, bouncing UI, neon/glow effects, or autoplay spectacle was added.

## Responsive Navigation

- Closed mobile header target is compact at roughly 64-88px.
- Tablet no longer uses a large sticky multi-row navigation.
- Mobile menu button exposes an accessible name, `aria-expanded`, and menu relationship.
- Menu can be opened/closed by keyboard, closes on Escape, and closes after internal navigation.
- Desktop navigation remains calm and visible.
- Primary visit CTA remains available without dominating the smallest viewport.

## UI State Coverage

- Default, hover, focus, active states: links, CTA links, nav, menu button, image cards, form controls.
- Loading states: public route `loading.tsx` plus contact form submitting state.
- Empty states: brands and outfits render only when the corresponding collection is actually empty.
- Validation errors: contact form required fields, email format, and message length.
- Server-error fixture: contact form message containing the error trigger displays a natural fallback message.
- Success state: contact form confirmation.
- Disabled/submitting state: form fields and submit button.
- Unavailable/unpublished content: represented through empty states only where fixture collections are absent.

## Verification Results

| Check | Command/width | Result |
| --- | --- | --- |
| Public implementation wording scan | `rg "Frontend|Backend|Fixture|fixture|Admin-System|Resend|Relaunch|Frontend-Bestätigung|simuliert|implement|Phase" "src/app/(public)" "src/components/public"` | Passed for visible public page/component copy. Remaining fixture word only appears in private import paths if scanning fixture files. |
| Shop-mechanic wording scan | `rg "Warenkorb|Online-Shop|Bestellung|nicht shop|Preis|Lager|Verfügbarkeit" "src/app/(public)" "src/components/public" "src/content/fixtures"` | Passed for targeted visible copy after revision. |
| Public forbidden imports | `rg "@/db|@/lib/auth|@/lib/repositories|@neondatabase|drizzle" -- "src/app/(public)" "src/components/public" "src/content/fixtures" "src/lib/contracts"` | Passed: no matches. |
| Protected foundation diff | `git diff --name-only -- src/db drizzle src/lib/auth src/lib/repositories src/proxy.ts src/app/login src/app/admin src/app/api/auth` | Passed: no protected foundation changes. |
| Type check | `npm run typecheck` | Passed. |
| Lint | `npm run lint` | Passed. |
| Production build | `npm run build` | Blocked by environment after successful compilation: Next reaches `Running TypeScript ...`, then fails with `spawn EPERM`. Standalone `npm run typecheck` passes. |
| Dev server | `npm run dev -- --hostname=127.0.0.1 --port=3000` | Blocked by environment: Next dev startup fails with `spawn EPERM`. |
| Browser widths | 390, 768, 1024, 1440, 1920 | Not run locally because the dev server cannot start and no usable browser surface is available. |
| Direct URLs and client navigation | All public routes | Not run locally because browser verification is blocked. |
| Redirect runtime | `/team`, `/brands` | Implemented in `next.config.ts`; runtime verification blocked locally. |
| Sitemap/robots runtime | `/sitemap.xml`, `/robots.txt` | Implemented; runtime verification blocked locally. |

## Browser Verification Checklist For Freeze Environment

Run on every public route at 390px, 768px, 1024px, 1440px, and 1920px:

- Direct URL load.
- Client-side navigation from another public route.
- Cards visible after internal navigation.
- No element permanently `opacity: 0`.
- No hydration mismatch, React error, Next overlay, or console runtime error.
- No unexplained blank images; visible images complete successfully.
- No horizontal overflow.
- Mobile menu open, close, Escape close, and visible focus.
- Keyboard navigation and touch target checks.
- Reduced-motion behavior.
- Correct heading hierarchy.
- Correct homepage title and route metadata.
- Visible breadcrumbs and matching `BreadcrumbList`.
- Contact form validation, submitting, success, server-error, and disabled states.
- Populated and empty collection behavior.
- Redirects, sitemap, and robots.

## Frontend Freeze Readiness

- Visual/customer approval: pending.
- Real-browser viewport verification: pending unless a browser-capable environment can run it.
- Known source-level visual issues: none identified after the focused revision.
- Content still awaiting customer approval: final legal notice, final privacy policy, final social-image crop, final media/crop selection.
- Changes allowed during backend integration: replace fixtures with repository DTOs at route composition boundaries only; preserve public presentation props unless the freeze workflow approves a contract change.
- Protected foundation verified unchanged: yes.

## Unresolved Issues

- Full real-browser verification at 390px, 768px, 1024px, 1440px, and 1920px still must run before frontend freeze.
- If the local `spawn EPERM` process restriction persists, production build completion and dev-server/browser verification must be repeated in an environment that permits Next worker processes.
- Final legal and privacy copy still need responsible customer/legal approval.
- Additional verified brand-specific imagery is still required if photographic brand detail pages are desired for more brands.
- Complete legacy URL inventory remains a downstream SEO migration task; only `/team` and `/brands` redirects are in scope here.
