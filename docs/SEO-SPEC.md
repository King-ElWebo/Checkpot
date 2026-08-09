# SEO Specification

Status: `NOT_READY`

This file is the customer-specific SEO contract for Open Design, backend integration, and release verification. Set the status to `APPROVED_FOR_FRONTEND` only after every required public route has an approved search intent and metadata plan.

## Inputs

- Project specification:
- Approved domain:
- Primary market and locations:
- Languages and default locale:
- Existing website and migration source:
- Keyword or search-intent research:
- Legal and compliance constraints:

## Global settings

- Production origin (`SITE_URL`):
- Site/organization name:
- Default title template:
- Default description:
- Default social image and alt text:
- Twitter/X card:
- Indexing default:
- Canonical policy:
- Trailing-slash policy:
- Search-console owner:

`SITE_URL` must be an absolute production origin without a path. Preview domains must not become production canonicals.

## Route SEO matrix

| Route | Search intent | Primary topic | Title | Description | Canonical | OG image | Structured data | Index/follow |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `/` |  |  |  |  |  |  |  |  |

Every required route in `docs/PROJECT-SPEC.md` must appear here. Dynamic route families may use one row when their metadata is generated from a documented content model.

## Content and internal linking

| Route | H1 | Required supporting topics | Primary internal links | Content owner | Status |
| --- | --- | --- | --- | --- | --- |
| `/` |  |  |  |  |  |

- Use one clear page purpose and one meaningful H1.
- Write for the approved user intent; do not keyword-stuff or invent unsupported claims.
- Use descriptive link text and connect related pages deliberately.
- Document image-alt ownership. Alt text describes the image's purpose, not a list of keywords.

## Structured data

| Route/type | Schema.org type | Required source fields | Validation owner | Status |
| --- | --- | --- | --- | --- |
|  |  |  |  |  |

Only emit structured data supported by visible, approved content. Never fabricate ratings, reviews, prices, addresses, authors, availability, or business facts.

## Technical SEO artifacts

| Artifact | Required implementation |
| --- | --- |
| Page metadata | Static `metadata` or typed `generateMetadata` in Server Components |
| Canonicals | Absolute URLs derived from the approved `SITE_URL` |
| Sitemap | `src/app/sitemap.ts`; include only canonical indexable public URLs |
| Robots | `src/app/robots.ts`; reference the sitemap and exclude non-public areas |
| Social image | Approved static image or route-level `opengraph-image.tsx` |
| Icons | Approved favicon and app icons using Next.js metadata file conventions |
| Structured data | Server-rendered JSON-LD with safe serialization |
| Redirects | Implement the approved redirect map without chains |

`robots.txt`, `noindex`, and hidden navigation are not access control. `/admin`, `/login`, and private APIs remain protected by authentication and authorization.

## Redirect and migration map

| Old URL | New URL | Status code | Reason | Verified |
| --- | --- | --- | --- | --- |
|  |  | 301 / 308 |  |  |

## Localization

- Locale URL strategy:
- Default-locale behavior:
- `hreflang` mapping:
- Translated metadata owner:
- Localized sitemap behavior:

## Approval gate

- [ ] Every required public route is represented.
- [ ] Titles, descriptions, canonicals, and index directives are approved.
- [ ] Social-image ownership and alt text are known.
- [ ] Structured-data fields come from visible approved content.
- [ ] Redirects and legacy URLs are recorded.
- [ ] Sitemap, robots, icons, and `SITE_URL` behavior are defined.
- [ ] Admin, login, preview, and private routes cannot be indexed accidentally.

Set status to `APPROVED_FOR_FRONTEND` only when no unresolved item can materially change routing, page content, metadata, or structured data.
