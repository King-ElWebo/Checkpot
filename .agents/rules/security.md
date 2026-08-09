# Security Rule

Apply this rule to authentication, authorization, privileged routes, validation, uploads, secrets, destructive actions, dependencies, and deployment review.

## Authentication and authorization

- Required secrets have no production fallback.
- Use a unique high-entropy `AUTH_SECRET` and admin credential for every copied customer project; production values belong in the deployment secret manager.
- Database-stored passwords use strong password hashing. The environment-backed single-admin credential is a bootstrap secret, not a multi-user identity system.
- Authentication attempts require deployment-compatible rate limiting before public release.
- Sessions are signed or encrypted, algorithm-pinned, issuer- and audience-bound, time-limited, validated server-side, and invalidated according to the chosen design.
- Cookie presence or a hardcoded token is never authentication.
- Cookies use `HttpOnly`, `Secure` in production, an appropriate `SameSite` policy, and explicit expiry.
- `proxy.ts` is an optimistic early filter, never the only authorization boundary.
- A protected layout controls rendered UI but does not authorize Route Handlers, Server Actions, or repository mutations.
- Every privileged Server Action, Route Handler, and server mutation calls the central verifier and checks required role or ownership.
- Cookie-authenticated mutations use a deliberate CSRF defense.

The included stateless single-admin session is suitable only when the approved specification accepts one shared administrator without immediate server-side revocation. Multi-user accounts, granular roles, password reset, MFA, or per-session revocation require a database-backed session or an approved authentication provider.

## Validation and exposure

- Validate and bound every untrusted payload before business logic.
- Reject unexpected fields when mass assignment is dangerous.
- Treat every Route Handler and exported Server Action as a public entry point.
- Never expose stack traces, SQL details, internal paths, external-provider responses, secrets, or unnecessary personal data.
- Log useful structured context without credentials, session material, or excessive personal data.

## Uploads

- Enforce request size, file size, allowed content, and image dimension limits.
- Verify signatures or decode and re-encode; do not trust MIME type or extension.
- Name stored files with `crypto.randomUUID()` and a verified extension.
- Never preserve user-controlled path segments.
- Authorize upload and deletion and verify record ownership.
- Use deployment-compatible persistent storage.

## Destructive and deployment controls

- Require explicit confirmation and authorization for destructive bulk operations.
- Review migrations for data loss and define backup or rollback expectations.
- Restrict image, callback, redirect, and CORS origins to allowlists.
- Configure appropriate security headers and a practical Content Security Policy where possible.
- Keep agent permissions bounded to the project; do not enable unrestricted machine access for routine work.

Critical and high-severity findings block release unless explicitly accepted in writing.
