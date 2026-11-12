---
name: teachvero-booking-commerce
description: Plan and implement teacher session booking, lesson packages, credit ledgers, payment readiness and student lifecycle. Use for booking, packages, pricing, checkout, credit accounting.
---

# Booking and lesson packages
Map business rules before schema: product type, session duration, time zone, available slots, buffer, expiry, reschedule policy, no-show, cancellation and refund policy. Unspecified values are configurable placeholders requiring business approval.

## Invariants
- Time is stored in UTC and displayed with timezone; handle daylight-saving changes.
- Never double-book; use transactional locking / unique constraint as appropriate.
- A paid package produces a durable credit ledger (purchase, redemption, refund/adjustment), not an editable balance alone.
- Payments: server-side checkout, verified Stripe webhook signatures, idempotency, clear order states, no client-trusted prices. Use Stripe official docs/skills for actual API integration.
- Credentials go in environment variables; no live tokens or personally identifiable data in git.
- Confirmation emails and reminders must be sent through a provider or explicit mocked dev adapter, not pretend to send.
- Admin authorization must be enforced server side; students only see their own records.

## Deliverables
Document state machines and edge cases. Build representative integration tests (duplicate webhook, concurrent bookings, cancellation, partial refund, wrong timezone). Separate dev demo flows from production integrations, label unfinished items truthfully.
