# Decisions

- 2026-11-12: Docker Desktop engine was initially unreachable in sandbox, but reachable with approved Docker access. User explicitly requested containers; PostgreSQL is the only persistence mode and web also runs in Compose.
- Keep the MVP narrow enough to execute: real inquiry persistence and protected review, package/resource CRUD, own-profile/progress and learner requests. Do not invent purchases, bookings, biography or testimonials.
- NextAuth v4 credentials provider provides a stable JWT session flow. Scrypt salts are random; production refuses local demo accounts. Real account provisioning is pending.
- JSONB content plus strict schemas supports editable packages/articles without a premature CMS. IDs are explicit; seed never overwrites existing content.
- Local fonts and original vector art keep the preview independent of external image/font services and avoid misleading teacher imagery. Font licenses are retained in src/app/fonts.
- npm audit initially reported transitive deepmerge-ts/minimatch advisories. Scoped overrides select patched releases; subsequent audit reported zero vulnerabilities. Lint, Prisma migration and generation validate compatibility.
- Do not activate payment/calendar/email adapters until real keys and policies exist. No fake webhook or checkout endpoint is provided.

- Windows bind mounts use Webpack polling for development. Forms disable fields until hydration; reduced-motion handling preserves the offscreen skip-link position. Fixed marketing CTAs are hidden on pages containing forms.
