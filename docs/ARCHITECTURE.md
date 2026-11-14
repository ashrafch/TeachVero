# Architecture

## Recovery extension — 13 November 2026

User remains the login identity. StudentRecord separates teacher-only level/status/preferences/notes from the editable student profile. Enrollment snapshots a manually allocated package and its credit balance/expiry. Lesson belongs to Enrollment and separates studentSummary from teacherNotes. CreditEntry is the append-only application ledger; allocation, reservation and cancellation have unique references.

The `/api/teaching` boundary checks same-origin, current database role, rate limit, request size and Zod input before entering a transaction. All teaching writers take the same PostgreSQL transaction advisory lock, serializing this single-teacher schedule and balance changes. Student queries scope by current user ID and explicitly omit private columns. Content/booking APIs retain their existing checks.

Canonical `/learn/[slug]` articles also serve blog and free-learning entry aliases; the lesson catalog has individual `/lessons/[slug]` pages. No duplicate article CMS is introduced. PostgreSQL integration tests complement browser journeys. See FEATURE_STATUS.md for current limitations; the original design notes below are historical where superseded.

Next.js 16 App Router, React 19, strict TypeScript, Tailwind v4, Radix/shadcn-style Button, Motion, React Hook Form/Zod and Auth.js (NextAuth v4 credentials/JWT). Locally bundled OFL fonts use next/font/local. Custom inline vector imagery avoids invented teacher portraits.

The requested deployment environment is Docker Desktop: web (Node 24) + PostgreSQL 17, with a persistent named volume. No SQLite or browser persistence fallback is used. Public server components query ingested database content through server-only repository modules. Prisma provides transactions and immutable migrations.

Core persisted entities: User (role, scrypt password hash, profile/progress), Package, Resource, BookingRequest, Lead and AuditLog. Form API routes validate server-side, check same origin and rate limit requests. Admin operations re-read roles from PostgreSQL and log updates within the same transaction. Student requests are filtered by the signed-in account email; profile updates always target the authenticated user ID.

Auth uses CSRF-protected credentials sign-in and HTTP-only JWT sessions. Development demo accounts are rejected in production. Provisioning real accounts, password reset, email verification and distributed rate limiting are pending. Current rate limits use one process and forwarded addresses, suitable only for trusted local development.

Package and Resource payloads are typed JSONB validated with Zod. This simplifies the initial content editor while keeping public pages server-rendered. Business fields belong to src/lib/content.ts and database seed; admin edits are preserved by idempotent seed upserts.

Calendar, Stripe and email adapters explicitly return unavailable; no provider call pretends success. Lesson scheduling, purchases, credit ledger, private teacher notes and testimonials require future implementation. The pure credit rule is tested but is not connected to a balance or payment system. No synthetic payments or lesson history are created.

Production needs a dedicated secret, HTTPS, provisioned non-demo users, approved prices and legal/business content, database backups and distributed abuse protection. The Compose stack is a local development stack, not hardened production hosting.
