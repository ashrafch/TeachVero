# Recovery audit — 13 November 2026

## Subsequent design request

The recovery audit below is historical. On 13 November the owner requested less flat graphics, fewer repeated sections and a professional single-teacher learning portal. The resulting redesign preserves domain behavior and moves the prior stacked admin/student forms into dedicated views. Current design decisions are in design-decisions.md and DESIGN_SYSTEM.md.

## Recovered state

This section records the state at initial inspection, before the recovery changes. For the current state, see FEATURE_STATUS.md and TEST_REPORT.md.

The supplied workspace is the authoritative restored copy. Older documents reference a former Windows user/path. Git is clean on `master`, with commits `1e6e353` and `1deec31`; origin already points to `https://github.com/ashrafch/TeachVero.git`. No reset, remote creation, push or deployment is needed or authorized.

Next.js App Router, strict TypeScript, React 19, Prisma/PostgreSQL, NextAuth credentials, Zod, React Hook Form, Motion, Tailwind and a Radix button are present. A lockfile, initial migration, seed, public pages, local fonts, original illustrations and unit/Playwright suites survived. Dependencies and running containers did not.

Existing functionality: package-to-inquiry persistence, lead consent, editable package/resource content, teacher inquiry review, role guards, student profile/progress and learning quizzes. The visual foundation is already editorial and coherent; preserve it. Prior verification reports describe the old machine and are not evidence for this recovery.

## Gaps and risks

- No persisted student administration, lesson scheduling/history or transactional package allocations/credit ledger.
- Student balance and upcoming lesson cards contain literal zeroes.
- Missing lesson detail, FAQ, blog and requested free-learning/legal entry routes.
- Real onboarding, password recovery, verified email, payments, calendar synchronization and email delivery remain unavailable.
- JSON content must continue to pass Zod validation; private teacher notes must never enter student payloads.
- Scheduling/credit mutations need database transactions, concurrency protection, server role checks and audit records.
- Public/legal/business copy remains demo material awaiting owner/professional review. No fabricated credentials or testimonials were found in the inspected source.
- Existing rate limiter is process-local; production needs shared limits and trusted proxy configuration.
- README falsely says no remote exists and references an obsolete path.

## Environment recovery

Node 26.13.1 and npm.cmd 11.20.0 available. PowerShell blocks npm.ps1: use npm.cmd; do not alter execution policy. Docker Desktop 29.9.3 responds with approved access, but no project containers are running. GitHub CLI, PostgreSQL CLI and Python are absent from PATH. Do not install system software or change managed policies as a shortcut.

## Skills

Read frontend-design and ui-ux-pro-max for existing identity, new workspaces and responsive review. The latter's Python design search could not run because Python is absent; existing documented tokens and skill accessibility/interaction principles apply. A deeper hidden-file inventory corrected the initial discovery: TeachVero-specific skills are present under `.agent/skills/`, including the UI skill in `techvero-ui`. Applied educator-crm, booking-commerce, security-privacy and test-release guidance during final workflow/security/release review; read mobile-conversion and seo-i18n for the public review. No skills were downloaded. The initial claim that these skills were absent was incorrect.

## Priority

Restore dependencies/database; add relational CRM and ledger; connect teacher/student UI; fill route gaps without duplicating content; verify security, persistence, responsive rendering and production build; update release documentation. Preserve existing data and source throughout.
