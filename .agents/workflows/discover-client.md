# Discover Client

Description: Consolidate raw customer information into the approved project specification before design begins.

1. Read `docs/CLIENT-BRIEF.md` and `docs/PROJECT-SPEC.template.md`.
2. Inspect all customer notes, transcripts, messages, assets, and reference links provided by the user.
3. Extract confirmed facts without changing their meaning.
4. Identify contradictions and missing decisions that affect routes, navigation, brand direction, content models, external integrations, authentication needs, deployment, legal requirements, or acceptance.
5. Ask a short grouped round of customer-friendly questions only for material gaps. Offer clearly labeled defaults for non-critical choices.
6. Separate confirmed decisions, accepted defaults, blocking decisions, and non-blocking follow-ups.
7. Define every route with purpose, main sections, primary CTA, content owner, interactions, and content status.
8. Define functions, forms, integrations, languages, page-level search intent, legacy URLs, analytics, admin, data, storage, auth, and deployment requirements. Record preferred scroll-storytelling sections and motion references. Record whether the fixed Neon/Drizzle and single-admin baseline is sufficient or requires an explicitly approved extension.
9. Write measurable acceptance criteria.
10. Update `docs/PROJECT-SPEC.md` using the template.
11. Use status `APPROVED_FOR_DESIGN` only when no unresolved item could materially change the frontend or core architecture; otherwise keep `DRAFT` and list blockers.
12. Do not write application code. Report whether `/generate-design-system` may run.
