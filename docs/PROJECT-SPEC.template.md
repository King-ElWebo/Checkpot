# Project Specification

Status: `DRAFT`

This file is the customer-specific source of truth. Replace every placeholder, mark unresolved items explicitly, and change the status to `APPROVED_FOR_DESIGN` before Open Design starts.

## 1. Project summary

- Project name:
- Customer:
- Site type:
- Business goal:
- Primary conversion:
- Target audience:
- Launch target:
- Decision makers:

## 2. Confirmed scope

### Required routes

| Route | Purpose | Main sections | Primary CTA | Content status |
| --- | --- | --- | --- | --- |
| `/` |  |  |  |  |

### Explicitly out of scope

- 

## 3. Content and assets

- Copy owner:
- Logo and brand assets:
- Photography/video:
- Allowed image sources:
- Existing content or URL migration:
- Legal-content owner:

## 4. Visual direction

- Brand adjectives:
- Preferred references and reasons:
- Rejected styles:
- Color constraints:
- Typography constraints:
- Imagery direction:
- Motion intensity:
- Priority scroll-storytelling sections:
- Preferred motion references:
- Prohibited motion or effects:
- Required brand rules:

The resolved visual system is recorded in `docs/DESIGN-SYSTEM.md`.

## 5. Functional requirements

| Feature | User | Required behavior | Success state | Failure state |
| --- | --- | --- | --- | --- |
|  |  |  |  |  |

## 6. Content models

| Model | Fields | Relationships | Editable by | Publishing behavior |
| --- | --- | --- | --- | --- |
|  |  |  |  |  |

## 7. Technical decisions

### Fixed template baseline

- Framework: Next.js 16 App Router
- Database: Neon PostgreSQL
- ORM and migrations: Drizzle ORM and versioned SQL under `drizzle/`
- Data-access boundary: server-only business repositories under `src/lib/repositories/`
- Admin bootstrap: one environment-backed administrator with signed `jose` session, protected by `src/proxy.ts` and server-side verification

### Customer-specific decisions

- Deployment target:
- Neon project, region, and branch:
- Storage provider:
- Is the single-admin bootstrap sufficient:
- Required users, roles, MFA, password reset, or session revocation:
- Email provider:
- Payment provider:
- CMS or editorial integration:
- Other integrations:
- Caching/revalidation expectations:
- Backup/restore expectations:

Changing the fixed database, ORM, or auth baseline requires an explicitly approved architectural migration. External services are implemented only when selected in this specification.

## 8. Languages, SEO, analytics, and legal

- Languages and default locale:
- URL locale strategy:
- SEO targets:
- Primary markets and locations:
- Existing domain and migration source:
- Search-intent or keyword research owner:
- Redirect requirements:
- Structured data:
- Analytics:
- Consent management:
- Privacy or data-residency constraints:

Resolve route-level titles, descriptions, canonicals, social images, structured data, index directives, sitemap behavior, and redirects in `docs/SEO-SPEC.md` before `/prepare-open-design`.

## 9. Quality requirements

- Supported browsers/devices:
- Accessibility target:
- Performance target:
- Required responsive widths:
- Monitoring/logging:

## 10. Open decisions

### Blocking before design

- None / list items

### Blocking before backend

- None / list items

### Non-blocking follow-ups

- None / list items

## 11. Acceptance criteria

- [ ] Every required route exists and matches its purpose.
- [ ] Mobile and desktop layouts are approved.
- [ ] All required functions work with real services.
- [ ] Privileged operations are authorized server-side.
- [ ] Forms provide accessible success and error feedback.
- [ ] Every required route has approved SEO metadata and indexing behavior.
- [ ] Every prominent section has an approved motion decision or explicit `none`.
- [ ] Scroll motion has mobile and reduced-motion fallbacks.
- [ ] Type check and production build pass.
- [ ] Critical customer journeys pass browser verification.
- [ ] Metadata, legal pages, analytics, and deployment requirements are complete.
