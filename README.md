# TeachVero

A locally runnable Italian teaching business MVP. Next.js + PostgreSQL, both in Docker Desktop. This is a clearly labelled demo preview; business content and integrations need owner approval before publishing.

Recovery on 13 November 2026: the local app is running at **http://localhost:3000**, with PostgreSQL in Docker and Next.js on the host. The host server is detached with ignored logs in `.data/dev.out.log` and `.data/dev.err.log`. The Compose-only option below remains available; do not start a second web server on the same port. Current feature/test evidence is in [FEATURE_STATUS.md](docs/FEATURE_STATUS.md) and [TEST_REPORT.md](docs/TEST_REPORT.md).

## Start on Windows PowerShell

Open Docker Desktop, wait for its engine to be ready, then:

```powershell
Set-Location -LiteralPath 'C:\Users\ashra\$HOME\Dev\TeachVero'
docker compose up -d --build
docker compose logs -f web
```

Open http://localhost:3000. The web container applies migrations and performs an idempotent seed automatically. Initial build downloads dependencies; first Next.js page compilation takes a moment.

Source files under src/ and public/ are mounted for live development. Changes to dependencies, schema, migrations or scripts require another `docker compose up -d --build`. The named PostgreSQL volume preserves requests/content across restarts.

```powershell
docker compose stop
docker compose start
docker compose ps
```

Do not run `docker compose down -v` unless intentionally deleting the development database. Normal rebuilds do not erase records.

## Demo accounts (development only)

| Role    | Email                   | Password             |
| ------- | ----------------------- | -------------------- |
| Teacher | teacher@teachvero.local | TeachVero-demo-2026! |
| Learner | student@teachvero.local | LearnItalian-2026!   |

Sign in at /login. Teacher goes to /admin, learner to /dashboard. These are demo credentials, deliberately public and refused in production. Never enter real student data in this preview.

The homepage now starts with a learning-goal selector and an interactive Italian phrase. The selected goal follows into the intro request. Teacher and student areas have their own navigation: open **Inquiries** to review requests, **Website content** to edit packages/resources, or **My profile** to update learning goals. Individual views support refresh and direct links, for example `/admin?view=students` and `/dashboard?view=profile`. On phones, use the section arrows or swipe the navigation to reveal more views.

Try: Packages → ask about a package → submit inquiry → sign in as teacher → Inquiries → change its review status. Refresh to verify persistence. To see it in the learner’s My requests view, submit it using student@teachvero.local.

Admin can create/edit student accounts and private teaching records, allocate packages, schedule/reschedule/cancel lessons, save student summaries and private notes, and track lead follow-up. Scheduling reserves one credit; cancelling returns it once. Allocations record no payment. Package/resource editing and inquiry review remain available. All teaching changes are authorized and audited in PostgreSQL. A seed rerun preserves edits.

## Host development and checks

Node 24+ and npm are required only for host commands. Tested host: Node 26.13.0/npm 11.20.0. Container: Node 24.

```powershell
Copy-Item .env.example .env
npm.cmd ci
docker compose up -d postgres
npm.cmd run db:generate
npm.cmd run db:migrate
npm.cmd run db:seed
# Stop the web container first to free port 3000 if using the host dev server.
docker compose stop web
npm.cmd run dev
```

```powershell
npm.cmd run lint
npm.cmd run typecheck
npm.cmd test
npm.cmd run test:integration
npm.cmd run build
npx.cmd playwright install chromium
# Against the running Compose web container:
$env:TEST_BASE_URL = "http://localhost:3000"
npm.cmd run test:e2e
Remove-Item Env:TEST_BASE_URL
```

Without TEST_BASE_URL, Playwright starts the host dev server. E2E tests submit identifiable example inquiries/leads and update the demo learner profile in the development database; they do not delete collection data. CRUD tests delete only their own test content. Screenshots and traces go to ignored test-results/; the HTML report goes to playwright-report/.

To run checks in the web container: `docker compose exec web npm test`, `docker compose exec web npm run lint`, `docker compose exec web npm run build`.

## Content and business configuration

Seed content: src/lib/content.ts. Existing records are never overwritten by seed; edit packages/articles in /admin. Brand values: same typed configuration. Brand tokens: src/app/styles/foundation.css; portal components: src/app/styles/portal.css; editable goal examples: src/lib/learning-goals.ts. Original downloadable guide: public/conversation-starter.txt. Teacher photo slot currently uses labelled illustration.

Before publishing, supply: teacher name/story/photo permission, qualifications, real contact/social links, package prices/currency/tax, availability, lesson platform, exam coverage, cancellation/refunds/expiry, controller identity, address, VAT/tax data, retention periods and reviewed legal texts.

## Implemented vs pending

Implemented: responsive public routes, original resources and interactive quiz/download, validated inquiry and guide requests, PostgreSQL persistence, secure credential sign-in, server-enforced roles, own-profile/progress and request list, teacher review/statuses, package/article CRUD and audit trail.

Demo: seed accounts, proposed package durations/lesson counts, editorial example content. No invented real biography, prices, reviews or bookings.

Pending: secure real account onboarding/reset/verification, purchases and refunds, testimonials CRUD, resource attachments, payment/webhook/calendar/email integrations, external analytics, full localization and approved legal copy. Internal scheduling, history, private notes and transactional credit allocations are implemented. The portal shows actual saved allocations and lessons. All new accounts used for local validation must contain example data only.

## Production checklist

Use managed PostgreSQL and backups; deploy Next.js on Node-compatible hosting. Compose is development-only. Set DATABASE_URL, NEXTAUTH_URL, NEXT_PUBLIC_SITE_URL and a strong NEXTAUTH_SECRET. Provision real users securely, never the demo accounts. Run `prisma migrate deploy`. Use HTTPS, trusted proxy rules and shared rate limiting, review retention/access logs, complete business/legal content, test restore and authorization, and configure providers only after policies are approved. Do not deploy the dev command or local secrets.

## GitHub publishing — approval required

The recovered repository already has two commits on `master` and origin `https://github.com/ashrafch/TeachVero.git`. Recovery has not committed, pushed or deployed anything. GitHub CLI is absent; confirm account and destination before publishing. Do not create a second origin.

After installing gh and signing in, confirm the exact owner and private repository name with the owner before running:

```powershell
gh auth status
git status
git add .
git commit -m "Build TeachVero local MVP"
# Only after explicit owner/name/push approval:
git remote -v
# Confirm the existing origin is the approved destination, then:
git push -u origin HEAD
```

Check that .env, test results and personal data are ignored before staging. See docs/FEATURE_STATUS.md and docs/TEST_REPORT.md for current recovery status and executed checks.

## Visual previews

See [desktop home](docs/screenshots/home-1440.png), [mobile home](docs/screenshots/home-390.png) and [mobile inquiry](docs/screenshots/contact-390.png). Regenerate with the running stack and installed Chromium using `node scripts/capture.mjs`. PostgreSQL is exposed only on localhost:55432; the web container uses postgres:5432 internally. Current browser coverage and results are recorded in docs/TEST_REPORT.md. Repeated full runs share local rate limits; allow the ten-minute window to expire if you deliberately trigger abuse protection.

## Git workflow and versioning

Work on a purpose-named branch, finish a verified slice with a descriptive Conventional Commit, and update the candidate version/changelog when the product milestone changes. Current candidate: **0.2.0**, unreleased. Run `npm.cmd run workflow:check` before delivery. Branch conventions, PR review, version rules and publishing commands are documented in [GIT_WORKFLOW.md](docs/GIT_WORKFLOW.md).
