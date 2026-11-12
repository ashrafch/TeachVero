# Security and privacy engineering audit — 12 November 2026

Scope: local MVP; not a penetration-test certification or legal compliance opinion. Sources reviewed: auth, password hashing, origin/rate controls, inquiry/manage routes, repository, Prisma schema, account/admin UI and Compose. No real credentials or personal records were printed.

## Data and trust boundaries
| Data | Purpose / storage | Access boundary | Outstanding launch decision |
| --- | --- | --- | --- |
| Inquiry name/email/message/goals/timezone/campaign | PostgreSQL BookingRequest; personal response | Public validated creation; authenticated teacher review; learner requests filtered by session email | Retention, verified account ownership and privacy basis |
| Guide name/email/consent choices | PostgreSQL Lead; requested guide/optional future updates | Teacher only | Verify subscriptions before activating marketing; no email provider active |
| Account/profile/checklist | PostgreSQL User; sign-in and learner progress | Profile mutations always use current server user ID | Provisioning, email verification/reset, account deletion |
| Content and audit log | PostgreSQL Package/Resource/AuditLog | Admin role re-read server-side; atomic update/log | Editorial approval workflow and content revisions |
| Optional measurement preference | Browser localStorage | Explicit toggle, default off; withdraw anytime | Provider/DPA assessment if later connected |
| Measurement events | Local CustomEvent, event name + pathname | No network provider, no typed form values/query string | No conversion metrics can be claimed from these hooks |

## Findings and fixes
- P1, request-body parsing: previously buffered arbitrary input before checking size; malformed JSON/null could look like service failure. Shared reader limits actual UTF-8 bytes as chunks arrive; rejects invalid object/JSON with 400, excessive size with 413, wrong media type with 415. Schemas remain server-enforced.
- P1, forwarding-header spoofing: arbitrary x-forwarded-for could create fresh process-local limiter buckets. Headers now ignored unless TRUST_PROXY_HEADERS=true; explicit opt-in requires a proxy that replaces untrusted headers. Limiter key length and bucket count bounded.
- P1, local signing secret in production: known local secrets and short secrets no longer configure production authentication. Demo accounts remain rejected.
- P2, destructive payload ambiguity: manage envelope now validates kind, boolean remove and object data. Unknown/truthy string remove flags cannot silently request deletion.
- P2, package deletion/inquiry race: related read/create and protected deletion use PostgreSQL serializable transactions. Normal persistence flows tested; no concurrent stress claim.
- No raw HTML rendering of article/user text. Prisma queries are parameterized. No user-controlled outbound URL fetching, uploads, payment/webhook success paths or provider secrets.
- npm audit --omit=dev: zero known vulnerabilities observed during this audit.

## Explicit residual risks before real business
- Process-local limits are not distributed; without trusted proxy identity local mode shares a limiter. Production needs edge/shared abuse controls and proxy validation.
- Request history is associated by email; no production email-verification/account recovery lifecycle exists yet.
- Public lead submissions are unverified interest, not evidence of a verified mailing-list subscription. Do not activate email marketing on these records without a consent/verification design.
- Passwords use Node's salted scrypt + timingSafeEqual; synchronous hashing is suitable for this small demo, but production load and enumeration resistance need review.
- Legal controller/retention/DPA/rights procedures, TLS hosting, backup restore, CSP and operational monitoring need launch review.
- Package snapshots, purchases, payment idempotency, credit ledger and confirmed scheduling are not implemented; current requests never imply reservation or payment.

## Data preservation / rollback
No schema or migration changes in this audit. No database reset or volume removal. Seed uses create-only upserts and preserves existing rows. Tests only delete uniquely named packages/articles they created; example inquiries remain identifiable. Roll back application files/image using a reviewed snapshot; retain the PostgreSQL volume and take a database backup before any future schema release.
