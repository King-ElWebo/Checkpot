# Checkpot Hietzing — Damenmoden Website

Offizieller Webauftritt für **Checkpot Damenmoden** in Wien-Hietzing (Inhaberin: Christa Hausmair).
Moderne, mehrseitige Boutique-, Marken- und Inspirationswebsite mit dynamischer Verwaltung für Sortiment, Looks, Marken und Geschäftsdaten.

---

## Technical Stack

- **Framework:** Next.js 16 (App Router, Turbopack, React 19)
- **Styling:** Tailwind CSS 4, Framer Motion
- **Language:** TypeScript (strict mode)
- **Database & ORM:** Neon Serverless PostgreSQL & Drizzle ORM
- **Authentication:** Stateless signed JWT sessions (`jose`, HS256) for single-admin CMS
- **Email Delivery:** Resend Server Action (contact form inquiries)
- **Privacy & Consent:** Built-in category-based consent manager (Google Consent Mode v2 Basic Mode, gated Google Maps iframe)
- **Deployment:** Next.js production runtime (hosting migration pending / provider-neutral)

---

## Development Commands

```bash
# Start local development server (Turbopack)
npm run dev

# Run TypeScript typecheck
npm run typecheck

# Run ESLint validation
npm run lint

# Compile production build
npm run build

# Start production server locally
npm start

# Database migrations & studio
npm run db:generate   # Generate Drizzle migration files
npm run db:migrate    # Run migrations against database
npm run db:studio     # Launch Drizzle Studio UI
```

---

## Environment Variables

Configure these variables in `.env.local` for local development. See `.env.example` for details.

| Variable | Required for | Purpose |
|---|---|---|
| `DATABASE_URL` | Build & Runtime | Neon PostgreSQL connection string |
| `SITE_URL` | Runtime | Canonical base URL (`https://checkpot-hietzing.at`) |
| `AUTH_SECRET` | Runtime | 32+ character key for admin JWT session signing |
| `ADMIN_PASSWORD` | Runtime | Passphrase for single-admin `/admin` login |
| `BLOB_READ_WRITE_TOKEN` | Runtime | Token for media upload storage |
| `RESEND_API_KEY` | Runtime | API key for contact form email dispatch |
| `RATE_LIMIT_SECRET` | Runtime (Optional) | HMAC secret for pseudonymized rate-limit hashing |
| `NEXT_PUBLIC_GA_MEASUREMENT_ID` | Client (Optional) | GA4 measurement ID (activated only after consent) |

---

## Project Documentation

Authoritative documentation and project records are located in `docs/`:

- [`docs/CURRENT-STATUS.md`](docs/CURRENT-STATUS.md) — Current technical, editorial, and pre-launch status
- [`docs/PROJECT-SPEC.md`](docs/PROJECT-SPEC.md) — Approved client specification and business requirements
- [`docs/LEGAL-INPUTS-NEEDED.md`](docs/LEGAL-INPUTS-NEEDED.md) — Legal facts checklist & pending owner inputs
- [`docs/BACKEND-ACCEPTANCE.md`](docs/BACKEND-ACCEPTANCE.md) — Backend acceptance audit record
- [`docs/CMS-READINESS.md`](docs/CMS-READINESS.md) — CMS and data integrity report
- [`docs/CONTENT-BACKLOG.md`](docs/CONTENT-BACKLOG.md) — Brand assets and editorial backlog
- [`docs/DESIGN-SYSTEM.md`](docs/DESIGN-SYSTEM.md) — Approved design tokens, typography, and motion rules
- [`docs/SEO-SPEC.md`](docs/SEO-SPEC.md) — Metadata, structured data, and legacy URL redirect mapping

