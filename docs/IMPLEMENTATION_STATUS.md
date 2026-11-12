# Implementation status — 12 November 2026

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
