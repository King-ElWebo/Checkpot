# Frontend Handoff

Status: `NOT_READY`

Open Design updates this file before backend integration begins.

The frozen frontend connects to the fixed Neon/Drizzle backend through business-intent repositories. Open Design must not add database queries or production provider SDKs to presentation components.

## Implemented routes

| Route | Page component | Status | Notes |
| --- | --- | --- | --- |
|  |  |  |  |

## Reusable components and contracts

| Component | Props/type | Fixture source | Backend dependency |
| --- | --- | --- | --- |
|  |  |  |  |

## Required reads

| Consumer | Repository method | DTO/type | Parameters | Authorization | Empty/error behavior |
| --- | --- | --- | --- | --- | --- |
|  |  |  |  |  |  |

## Required mutations and forms

| Form/action | Execution boundary | Payload | Validation | Success UI | Failure UI | Authorization |
| --- | --- | --- | --- | --- | --- | --- |
|  | Server Action / Route Handler |  |  |  |  |  |

## Data-model mapping

| Frontend contract/model | Drizzle table(s) | Constraints/relations | Migration | Repository |
| --- | --- | --- | --- | --- |
|  |  |  |  |  |

## Authentication and admin

- Is the included single-admin bootstrap sufficient:
- Required roles and ownership rules:
- Required admin modules:
- Session or identity-provider changes:

## SEO implementation

| Route/artifact | Implementation file | Metadata source | Dynamic dependency | Verified |
| --- | --- | --- | --- | --- |
| `/` |  | `docs/SEO-SPEC.md` |  |  |
| Sitemap | `src/app/sitemap.ts` |  |  |  |
| Robots | `src/app/robots.ts` |  |  |  |

## Motion implementation

| Route | Section/element | Component/style | Trigger | Mobile/reduced fallback | Verified |
| --- | --- | --- | --- | --- | --- |
| `/` |  |  |  |  |  |

## Environment and external services

| Variable/service | Purpose | Required phase | Owner | Status |
| --- | --- | --- | --- | --- |
| `DATABASE_URL` | Neon connection | Backend |  |  |
|  |  |  |  |  |

## Media and uploads

- Required media types:
- Maximum display dimensions:
- Alt-text ownership:
- Upload/crop behavior:
- Deletion behavior:

## UI state coverage

- [ ] Loading states
- [ ] Empty states
- [ ] Validation errors
- [ ] External-service/server errors
- [ ] Success confirmation
- [ ] Disabled/submitting states
- [ ] Keyboard and focus states
- [ ] Reduced-motion behavior
- [ ] Approved scroll-motion behavior
- [ ] Metadata, canonicals, social previews, and structured data
- [ ] Sitemap, robots, and index/noindex behavior

## Frontend freeze

- Visual approval:
- Responsive verification:
- Known visual issues:
- Content still awaiting customer approval:
- Changes allowed during backend integration:
- Protected foundation verified unchanged:
- SEO specification verified:
- Motion plan verified:
