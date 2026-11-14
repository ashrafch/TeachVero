# Implementation status — recovery on 13 November 2026

## Design refresh — 13 November 2026

Implemented: goal-driven homepage with phrase preview; independent teacher/student app shell; URL-backed workspace views; searchable student directory; dedicated student profile and practice views; responsive navigation controls. Core domain/API behavior retained. Static checks, production build, 32 unit tests, 3 PostgreSQL integration tests and 2 focused portal browser scenarios passed. All 31 browser scenarios now have passing executions across batches; final evidence is recorded in TEST_REPORT.md. The selected goal also follows header and mobile shortcut CTAs. Missing authentic portrait, prices and external integrations remain demo-only/pending.

Current authoritative status: [FEATURE_STATUS.md](FEATURE_STATUS.md). Executed recovery checks: [TEST_REPORT.md](TEST_REPORT.md).

The restored app now includes persisted student administration, private teaching notes, manual package allocations, transactional credit ledger, internal scheduling/rescheduling/cancellation/completion, and actual student lesson/balance/history views. Public lesson details, FAQ, blog and canonical aliases are added. PostgreSQL and the host dev server are running for local validation at http://localhost:3000.

Recovery verification: 32 unit tests, 3 real PostgreSQL integration tests, 29 browser scenarios with passing full/focused executions, lint, strict types and production build. Screenshots were inspected for public desktop/mobile home, the mobile student dashboard and teacher student forms. Exact execution batches and repaired failures are in TEST_REPORT.md.

External payments/calendar/email, secure production onboarding, real business content and legal approval remain pending. No remote write or deployment was performed. The recovered repository already has origin `https://github.com/ashrafch/TeachVero.git`.

## Historical status — 12 November 2026 (superseded)

The notes below are retained as pre-recovery history. In particular their missing scheduling/credit features, remote information and test totals no longer describe the current workspace.

## Implemented

- Next.js App Router/strict TypeScript application with Tailwind design tokens, local OFL fonts, Motion with reduced-motion support, original Italian illustration and Radix/shadcn-style controls.
- Public home, about, lesson types, packages, resource listing/detail, inquiry, campaign and five legal-placeholder routes; metadata, canonical links, OG image, live-content sitemap, robots and WebSite structured data.
- Three original Italian articles, interactive quiz and downloadable conversation starter.
- React Hook Form/Zod inquiry and guide forms with consent, optional marketing opt-in, honeypot, request size checks, same-origin protection and process-local rate limits.
- Real PostgreSQL persistence through Prisma. Immutable initial migration, repeatable seed preserving existing records, Docker Desktop stack with web and database.
- Auth.js credential sign-in with salted scrypt hashes and HTTP-only JWT sessions. Server-side role/ownership checks; local demo accounts rejected in production.
- Student profile, goal and progress checklist editing; own inquiry history; honest empty lesson/credit states.
- Teacher inquiry review/status changes, guide leads, student directory, package and resource CRUD through labelled forms, atomic audit logging and stored-record counts.
- Server error/loading/empty states, responsive menu, keyboard skip link, persistent mobile CTA and hydration guards protecting forms before handlers attach.
- Windows/container setup, publishing procedure and owner-launch checklist in README. Git initialized locally; no remote, push or deployment.

## Verification

Passed: lint, typecheck, 12 unit tests and production build on Windows. Container lint, all 12 unit tests and a production build in a disposable container also passed. The main Playwright suite passed 11/11 against the real Docker backend, including 96 page/width combinations. After two visual-only corrections, both additional CTA/reduced-motion tests passed (2/2). The suite now contains 13 cases; the final two were executed as a focused batch. No provider operations or production deployment were tested.

Screenshots were captured and inspected for desktop/mobile home and mobile contact. Exact checks, corrected failures and limits are in VERIFICATION.md.

## Demo only

Seed teacher/student accounts; proposed lesson bundles/durations; example learning content and illustrated portrait slot. No approved price, biography, certification, testimonial, student count or booking claim. Example E2E inquiries/leads remain visibly identifiable in the local database.

## Pending / not implemented

- Real student onboarding, email verification, password reset and account lifecycle.
- Confirmed lesson scheduling, upcoming/history records, teacher notes, student administration and attachments.
- Package purchases, transactional credit ledger, verified payment webhook and cancellation/refunds. The pure credit rule is tested but not connected to purchases.
- Stripe, Cal.com/calendar and email delivery. Adapters explicitly report unavailable; no successful provider operation is simulated.
- Testimonials management, full localization, social links, resource search/filtering and external CMS.
- Distributed rate limiting/production proxy hardening, comprehensive accessibility and real Core Web Vitals measurement.
- Owner-approved identity, biography, qualifications, photo, prices, time slots, commercial policies, VAT/contact details and professionally reviewed legal documents.

## Environment and decisions

Node 26.13.0/npm 11.20.0 on Windows; Node 24 in the web image, PostgreSQL 17 container. Initial sandbox could not reach Docker; approved access confirmed Docker Desktop 29.9.2 was running. PostgreSQL host binding is 55432 to avoid a 5432 conflict; container networking still uses 5432. Web is localhost:3000. Windows bind mounts use Webpack polling because Turbopack did not observe source updates reliably.

No SQLite fallback is used, following the owner’s explicit container preference. GitHub CLI was unavailable; authentication, owner/name confirmation and any remote publishing remain pending.
