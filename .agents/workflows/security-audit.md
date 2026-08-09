# Security Audit

Description: Audit and harden the completed application before release.

1. Read `docs/PROJECT-SPEC.md` and `.agents/rules/security.md`.
2. Inspect actual auth, `src/proxy.ts`, privileged layouts, handlers/actions, Drizzle schemas, repositories, storage, uploads, environment use, dependencies, and deployment configuration.
3. Test whether sessions can be forged, algorithm-confused, replayed, accepted by presence alone, or used beyond expiry; confirm issuer, audience, signature, and role checks.
4. Verify server-side authorization for every privileged read and mutation independently of Proxy and layouts.
5. Review login throttling, cookie flags, logout, CSRF, roles, ownership checks, and whether the single-admin bootstrap still matches the approved specification.
6. Review every request boundary for strict bounded validation, safe output, and mass-assignment risk.
7. Review uploads for content verification, limits, UUID naming, authorized deletion, and deployment-compatible storage.
8. Review Drizzle constraints, transactions, cascades, destructive actions, migration SQL, the intended Neon target, and data-loss risk.
9. Review secret handling, logs, debug paths, remote origins, redirects, CORS, dependencies, and security headers.
10. Confirm production errors never fall back to fixtures or false success.
11. Classify findings as Critical, High, Medium, or Low and cite file and line.
12. Fix in-scope Critical and High findings, plus safe Medium findings directly related to touched code.
13. Run relevant checks after fixes.
14. Do not declare release readiness while Critical or High findings remain unless the user explicitly accepts them in writing.
15. Return a findings table, changes, verification evidence, and residual risks.
