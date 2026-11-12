# TeachVero professional audit — 12 November 2026

## Scope and baseline
The public redesign is implemented on the existing Next.js/Prisma/PostgreSQL MVP. This audit preserves saved inquiries, learner profiles, teacher content and immutable migrations. No remote publishing or provider activation is authorized. Product baseline: AGENTS.md, MASTER_PROMPT_CODEX.md, PROMPT_CODEX_UI_UX.md and docs/PRODUCT_SPEC.md.

Two coordinated read-only reviews cover security/architecture and learning/conversion/SEO; the primary agent owns implementation and verification. No new dependency is required for accessibility: axe-core 4.14.0 is already installed through the lint toolchain.

## Selective skills
- Creative direction: .agent/skills/teachvero-brand-director, .agent/skills/techvero-ui, .agents/skills/frontend-design.
- Mobile/CRO: .agent/skills/teachvero-mobile-conversion and .agents/skills/copywriting.
- React/Next review: ui-ux-pro-max stack search for server/client boundaries and hydration. Keep server components by default and interactive leaves small.
- Education: teachvero-course-experience for explicit objectives, examples, deterministic feedback and teacher-review status.
- SEO: seo-audit and teachvero-seo-i18n.
- Security and QA: teachvero-security-privacy, teachvero-test-release, web-design-guidelines.
- Discovered but not applied: shadcn registry/preset workflow (no registry component or preset change needed), lead-magnets/content-strategy/site-architecture generators (existing content/funnel, targeted changes instead).
Skill examples under data/skills and tool folders are excluded from application compilation; their files are preserved.

## Prioritized findings before audit changes
1. P1: malformed/oversized API input needs consistent bounded parsing; verify request ownership and abuse boundaries.
2. P1: preview content must not accidentally become indexable; distinct route descriptions, canonical and sitemap checks needed.
3. P1: automate accessibility scans in addition to responsive/keyboard tests; verify contrast, headings, form errors and dock focus.
4. P1: resource metadata lacks explicit outcomes/prerequisites; exercises need grade-boundary tests and honest persistence wording.
5. P2: empty packages need a useful alternative action; unavailable resource/plan routes need real feedback.
6. P2: repeated CSS overrides and duplicate resource reads complicate maintenance.
7. P2: some prose is decorative instead of specific; focus on teacher, learner situation and the actual next action.
8. Launch dependencies: real portrait/video, credentials, price/currency/tax, policies, legal identity, real account provisioning and paid/calendar/email providers. Do not fabricate these.

## Acceptance criteria
- Lint, scoped TypeScript, unit tests, production build pass on final sources.
- Real PostgreSQL inquiry/guide persistence, teacher review, own-profile updates and authorization flows pass.
- Social campaign survives landing → inquiry → teacher view; no marketing consent inferred.
- At 360/390/430/768/1024/1280/1440px: no document overflow; booking name field starts within 850px on small screens; primary controls >=44px.
- Mobile menu works with keyboard/Escape; dock can be dismissed and is absent around forms/social/protected areas.
- Axe WCAG A/AA automated checks on public conversion/learning routes pass; manual visual and keyboard review recorded separately.
- Failure/retry preserves entered text; invalid/retired links recover; no fake booking/payment/email success.
- SEO route titles/descriptions/canonicals, preview robots and sitemap are verified in rendered browser/HTTP responses.
- No schema/data destructive operation; if schema changes become necessary, use a new explicit migration.
- Preserve Docker volume and owner-installed skills. No push/deploy.

## Phases
A. Discovery/acceptance: skills and specifications inspected; initial plan above.
B. Public conversion/design: implemented earlier; final responsive pass outstanding.
C. Audit fixes: in progress.
D. Verification/release report: pending final combined run. Previous partial runs are recorded separately, not represented as full-suite success.
