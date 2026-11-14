# Deployment preparation

This recovery is local only. Do not deploy the demo Compose configuration or demo account flow.

1. Confirm the owner, GitHub destination and hosting destination. Origin is already configured; inspect before changing anything. No remote write is authorized by this document.
2. Use maintained Node hosting and managed PostgreSQL with encrypted backups and tested restores. Resolve the locked runtime's support/security status before launch; dependency upgrades require compatibility checks.
3. Set DATABASE_URL, HTTPS NEXTAUTH_URL/NEXT_PUBLIC_SITE_URL, and a random NEXTAUTH_SECRET of at least 32 characters. Never use local Compose credentials. Keep SITE_INDEXABLE=false until launch review.
4. Run `npm.cmd ci`, `npm.cmd run db:generate`, `npm.cmd run db:migrate`, and `npm.cmd run build`. Deploy immutable migration files; do not use schema push. Do not seed demo users into production.
5. Provision real accounts with verified email, password recovery and an approved secure onboarding process. Review permissions, privacy, retention and deletion procedures. Review shared rate limits and trusted proxy configuration.
6. Supply owner-approved biography/photo, qualifications, offers/prices/taxes, availability, contact/VAT details and professionally reviewed privacy/terms/cancellation texts. Internal credit allocations are manual grants, not payments.
7. Keep Stripe, calendar and email adapters disabled until configured. Real payments require signed idempotent webhooks; external bookings require conflict reconciliation with the internal schedule. No fake provider successes.
8. Repeat all workflow/authorization/mobile tests in staging. Test backup restoration, session revocation, database failure and migration rollback strategy. Never drop production data as a rollback shortcut.

Teaching writes serialize with a PostgreSQL transaction advisory lock to protect this single-teacher schedule and balances. Every application writer must retain that lock; direct SQL/imports must use the same invariant. See [PostgreSQL locking documentation](https://www.postgresql.org/docs/17/explicit-locking.html). Database checks also prevent invalid balances, durations and lesson states.

Privacy operations: search the student's account ID and normalized email across User, StudentRecord, Enrollment, Lesson, CreditEntry, BookingRequest and Lead; export only through an authorized administrative process. Review financial retention obligations before deletion; foreign-key restrictions deliberately prevent accidental history loss. Private notes never belong in public exports or logs.
