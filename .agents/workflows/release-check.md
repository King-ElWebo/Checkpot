# Release Check

Description: Verify the complete customer journey and issue an evidence-based release verdict.

1. Read `docs/PROJECT-SPEC.md`, `docs/DESIGN-SYSTEM.md`, `docs/SEO-SPEC.md`, and `docs/FRONTEND-HANDOFF.md`.
2. Begin read-only. Do not fix findings unless the user asks.
3. Run TypeScript checking, lint, the production build, and configured automated tests.
4. Open every required public route at mobile and desktop sizes.
5. Verify navigation, forms, validation, loading, empty, error, success, keyboard, approved scroll/motion behavior, and reduced-motion behavior.
6. Verify the primary conversion journey end to end.
7. Verify wrong and correct login credentials, unauthenticated and authenticated admin behavior, logout, cookie deletion, session expiry, and privileged API rejection.
8. Verify real persistence, uploads, deletion, email, payments, and integrations included in scope.
9. Check each SEO matrix row, metadata, canonical URLs, social previews, structured data, robots/sitemap, noindex routes, legal pages, analytics, consent, and redirects required by the specification.
10. Check environment documentation, Neon provisioning, pending Drizzle migrations, external-provider setup, deployment constraints, and absence of production fixture fallback.
11. Map every acceptance criterion to concrete evidence.
12. Return `PASS`, `PASS WITH ACCEPTED RISKS`, or `FAIL` with failures, severity, reproduction, and the smallest corrective action.
