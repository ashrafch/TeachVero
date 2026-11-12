# Architecture

Next.js 16 App Router, React 19, strict TypeScript, Tailwind v4, Radix/shadcn-style Button, Motion, React Hook Form/Zod and Auth.js (NextAuth v4 credentials/JWT). Locally bundled OFL fonts use next/font/local. Custom inline vector imagery avoids invented teacher portraits.

The requested deployment environment is Docker Desktop: web (Node 24) + PostgreSQL 17, with a persistent named volume. No SQLite or browser persistence fallback is used. Public server components query ingested database content through server-only repository modules. Prisma provides transactions and immutable migrations.

Core persisted entities: User (role, scrypt password hash, profile/progress), Package, Resource, BookingRequest, Lead and AuditLog. Form API routes validate server-side, check same origin and rate limit requests. Admin operations re-read roles from PostgreSQL and log updates within the same transaction. Student requests are filtered by the signed-in account email; profile updates always target the authenticated user ID.

Auth uses CSRF-protected credentials sign-in and HTTP-only JWT sessions. Development demo accounts are rejected in production. Provisioning real accounts, password reset, email verification and distributed rate limiting are pending. Current rate limits use one process and forwarded addresses, suitable only for trusted local development.

Package and Resource payloads are typed JSONB validated with Zod. This simplifies the initial content editor while keeping public pages server-rendered. Business fields belong to src/lib/content.ts and database seed; admin edits are preserved by idempotent seed upserts.

Calendar, Stripe and email adapters explicitly return unavailable; no provider call pretends success. Lesson scheduling, purchases, credit ledger, private teacher notes and testimonials require future implementation. The pure credit rule is tested but is not connected to a balance or payment system. No synthetic payments or lesson history are created.

Production needs a dedicated secret, HTTPS, provisioned non-demo users, approved prices and legal/business content, database backups and distributed abuse protection. The Compose stack is a local development stack, not hardened production hosting.
