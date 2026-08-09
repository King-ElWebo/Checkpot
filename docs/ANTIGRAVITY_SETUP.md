# Antigravity Workspace Setup

This project uses Antigravity's official workspace customization layout. A root folder named `antigravity/` is not required.

## Recognized structure

```text
.agents/
├── rules/                         Persistent or conditionally activated guidance
├── workflows/                     Slash-command workflows
└── skills/
    └── ui-ux-pro-max/
        ├── SKILL.md               Discoverable design-intelligence skill
        └── references/            Loaded only when needed
```

Official references:

- Rules: https://antigravity.google/docs/ide/rules
- Workflows: https://antigravity.google/docs/ide/workflows?app=antigravity-ide
- Skills: https://antigravity.google/docs/skills

## First-time Antigravity setup

1. Open the copied repository as the workspace or add it to an Antigravity Project.
2. Open **Customizations -> Rules** and confirm the workspace rules under `.agents/rules/` are discovered.
3. Configure `core.md` as **Always On**.
4. Configure `frontend.md`, `backend.md`, and `security.md` as **Model Decision**. Use manual activation instead if you prefer strict control.
5. Confirm the UI/UX Pro Max skill appears in the workspace skill list.
6. Confirm the slash workflows below are available.
7. Keep project permissions bounded to the copied repository. Do not use unrestricted machine access for ordinary website work.

Rule and workflow files must remain below Antigravity's 12,000-character limit.

## Daily workflow

1. `/discover-client`
2. `/generate-design-system`
3. Complete `docs/SEO-SPEC.md`, then `/prepare-open-design`
4. Connect Open Design with the returned prompt
5. Review changes with `docs/OPEN-DESIGN-PROMPTS.md`, then `/freeze-frontend`
6. `/connect-backend`
7. `/security-audit`
8. `/release-check`

Before `/connect-backend`, create the customer Neon project, copy `.env.example` to `.env.local`, set the intended `DATABASE_URL`, and verify the target before running `npm run db:migrate`. Use unique `AUTH_SECRET` and `ADMIN_PASSWORD` values for every copied project and never paste them into Markdown files or agent prompts.

## About the local UI/UX package

The large vendor package remains under `.ai-agents/ui-ux-pro-max-skill/` and is intentionally excluded from Git. The project-specific Antigravity skill is small and versioned. Because this master repository is copied as a folder, the local vendor package travels with the copy. If you distribute the template through Git instead, provide a separate install/bootstrap step for that package.

## Optional `antigravity/` folder

Create a visible root `antigravity/` folder only if you want to store project-generated reports or custom scripts there. Antigravity does not require it for rules, workflows, or skills, and it must not duplicate `.agents/`.
