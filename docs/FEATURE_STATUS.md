# Feature status — 13 November 2026

## Personal learning portal refresh

Implemented on top of the recovered MVP: shortened interactive homepage, selected-goal continuity into booking, phrase translation exercise, updated public typography/footer, separate teacher/student shells and focused URL-addressable views. Student search, profile and practice navigation are functional. The portal-specific browser checks cover all 14 views at seven viewport widths and automated accessibility at 390/1440px; passed. See TEST_REPORT.md for the final regression batch.

This is the current recovery status. Older audit/verification documents describe the pre-reset machine and must not be treated as fresh test results.

## Complete and tested

- Locked npm dependencies restored; PostgreSQL 17 Docker service, two reproducible migrations and idempotent demo seed run successfully.
- Public homepage, about, lessons, package comparison, booking inquiry, learning library/articles/quizzes, contact, campaign and legal placeholders retained.
- Lesson detail pages, FAQ, blog listing, free-learning and legal URL aliases. Aliases redirect to a single canonical resource location. New public routes passed responsive checks at 320, 360, 390, 430, 768, 1024 and 1440px.
- Teacher creates/edits student teaching records. Private student notes are stored separately from student profile data.
- Manual package allocations snapshot package credits and label. Scheduling reserves one credit. Cancellation returns it exactly once. Completed lessons keep their credit consumed. No payment is implied.
- PostgreSQL transactions serialize competing credit/schedule mutations. Database constraints protect balances and lesson states. Integration tests cover concurrency, overlap, rescheduling, expiration and completion.
- Student portal shows persisted lessons, available credits, allocations and credit history scoped to the authenticated user; private notes are excluded from the query.
- Browser CRM journey verifies persistence, rejected anonymous/student mutations and private-note isolation.
- Unit tests, PostgreSQL integration tests, lint, strict TypeScript and production build passed. See TEST_REPORT.md for execution batches and corrected test failures.

## Additional verified behavior

- Mobile teacher forms allocate/schedule/cancel against PostgreSQL and restore the displayed balance. Core public and protected pages also pass at 320px.
- Lead follow-up notes/status survive a repeat public request and are omitted from the public response, verified in a separate browser test.
- Existing package/resource CRUD, own profile/progress, inquiry review, consent controls, form error recovery and article activities passed regression tests.
- Teacher overview uses persisted counts for the next seven days, new inquiries, students, low balances and upcoming expirations; detailed balances are in Package credits.
- Offline Open Graph font, current screenshots, true HTTP redirects for aliases and current-machine release documentation.

## Implemented but not separately verified

- The ACCEPTED/REJECTED inquiry labels use the same validated/audited status flow tested with REVIEWED; a distinct end-to-end acceptance-to-scheduling link is not implemented. Teacher scheduling is a separate explicit action.
- The extended GitHub Actions workflow is prepared locally; no remote CI run, push or deployment has occurred.

## Partial / demo only

- Teacher-created accounts are suitable for local demonstration. Verified email, invitations, password recovery and secure production onboarding are not implemented.
- Packages are proposed teaching bundles; real prices, currencies, tax rules, expiry and cancellation terms require owner confirmation.
- Articles are original sample learning content awaiting teacher review. Blog and free-learning routes share the same content, rather than a separate blog CMS.
- Internal lesson scheduling is persisted but does not create a calendar invitation, video meeting or email.
- Analytics are local consent-controlled events and record counts; no external tracking provider.
- Legal texts and teacher portrait/credentials/reviews remain explicit placeholders. No invented testimonials are displayed.

## Not implemented / external integration pending

- Stripe checkout, signed payment webhooks, purchases/refunds, invoicing.
- Cal.com synchronization and transactional email delivery.
- Secure account lifecycle, password recovery, verified email and production shared rate limits.
- Testimonial management, personal resource attachments, full localization and advanced reporting.
- Production hosting, backup restoration exercise, GitHub publishing and approved legal/business content.

See TEST_REPORT.md for executed commands and final results. No commit, push or deployment is part of this recovery.
