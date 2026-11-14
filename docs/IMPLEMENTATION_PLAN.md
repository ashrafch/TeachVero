# Recovery implementation plan

## Current milestone: personal learning portal redesign

User requested a more dynamic, simpler interface after the recovery milestone. Preserve completed CRM/auth/credit work. Delivered a shorter interactive homepage, consistent sans-led public UI, dedicated teacher/student navigation, focused server-rendered views and student search. Validation completed: all 31 browser scenarios have passing executions across the full run and focused reruns. Git workflow delivery is included in the v0.2.0 candidate; see docs/GIT_WORKFLOW.md. See design-decisions.md and TEST_REPORT.md.

1. Restore the locked npm environment and PostgreSQL development service; run baseline checks.
2. Extend the existing architecture with StudentRecord, Enrollment, Lesson and CreditEntry. User remains the authentication identity; StudentRecord stores private teaching notes separately. Enrollment snapshots package credits and label. A scheduled lesson reserves one credit; cancellation returns it; completion consumes the reservation. Serialize booking changes and enforce no overlaps for this single-teacher business.
3. Add teacher forms for students, package allocation, scheduling/rescheduling/cancellation/completion and lead follow-up. Persist changes and audit them atomically. Keep manual allocation distinct from payment.
4. Query current-user enrollments/lessons in the student portal; show actual balances and history, with no private notes. Preserve profile, quizzes and inquiries.
5. Add lesson detail pages, FAQ, blog and compatible free-learning/legal entry points. Reuse the learning content system and established palette/type/spacing.
6. Run lint, strict types, unit tests, migrations, build and browser flows including concurrent credit protection, roles, mobile menus and widths 320–1440. Record actual results and blockers.

Architecture remains one Next.js app, server-only Prisma operations, authenticated same-origin APIs, typed Zod boundaries and PostgreSQL transactions. External provider adapters stay unavailable until configured. No publish/push is included.

Acceptance: teacher creates a student, assigns a non-paid package allocation, schedules a lesson and sees a persisted balance; cancellation restores the credit exactly once; overlapping lessons fail; student sees only their own records. Public package/inquiry and learning journeys continue to work.

## Milestone outcome

Steps 1–6 are implemented and verified for the local demo. The main CRM journey, mobile forms, transactional invariants, student isolation and existing public journeys pass. Current-machine evidence and limitations are in TEST_REPORT.md. No completed public work was restarted.

Next production milestone: secure verified onboarding/account recovery, owner-approved offers/legal content, then separately configured provider integrations. Current manual allocations and internal schedule remain a usable local demo while these decisions are pending.
