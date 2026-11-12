# TeachVero Codex Skills Pack

This package contains **10 original project-specific Codex skills** under `.agents/skills/`. It does **not** bundle or impersonate third-party skills. These locally authored instructions are tailored to TeachVero and are not independently security-audited.

## Setup
1. Back up your repo and extract the zip **into TeachVero's root**, preserving `.agents/skills/...`.
2. Review the new files before using them. Merge rather than overwrite any existing custom `teachvero-ui` skill.
3. In PowerShell, optionally run `./INSTALL_EXTERNAL_SKILLS.ps1` to install additional skills from their original public repositories (review every package first). Select Codex/project scope. Alternatively copy the desired individual lines.
4. Keep `AGENTS.md` in repo root. Append only the minimal routing instructions below.
5. Restart Codex if the new skill names do not appear.

## AGENTS.md snippet
```
For TeachVero tasks, use relevant project skills from `.agents/skills/` rather than loading all skills at once. For UI tasks combine `teachvero-brand-director`, `teachvero-mobile-conversion` with external `frontend-design` and `web-design-guidelines` as appropriate. For learning flows use `teachvero-course-experience`; booking/commerce use `teachvero-booking-commerce`; CRM use `teachvero-educator-crm`; SEO use `teachvero-seo-i18n`; privacy/security use `teachvero-security-privacy`; release use `teachvero-test-release`. Never fabricate testimonials, prices, credentials or functioning integrations. Do not push or deploy without explicit approval.
```

## Review checkpoints
- **Design**: original personal brand, mobile screenshot audit and tested CTA flow.
- **Engineering**: real data persistence and auth, reproducible tests, verified builds.
- **Business**: one clear primary conversion, honest pricing, no invented proof.
- **Privacy**: server-side access control and consent-aware tracking.

## Source repositories (install separately)
- https://github.com/anthropics/skills
- https://github.com/vercel-labs/agent-skills
- https://github.com/nextlevelbuilder/ui-ux-pro-max-skill
- https://github.com/shadcn-ui/ui
- https://github.com/coreyhaines31/marketingskills
- https://github.com/stripe/ai

Notes: external repositories can change. Assess trust, permissions and execution scripts before installing. Installing a skill gives the coding agent instructions; it does not itself test or build any software.
