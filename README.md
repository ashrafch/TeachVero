# TeachVero

A locally runnable Italian teaching business MVP. Next.js + PostgreSQL, both in Docker Desktop. This is a clearly labelled demo preview; business content and integrations need owner approval before publishing.

## Start on Windows PowerShell

Open Docker Desktop, wait for its engine to be ready, then:

```powershell
Set-Location "C:\Users\aschouik\OneDrive - Capgemini\Desktop\dev\TeachVero"
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

Try: Packages → ask about a package → submit inquiry → sign in as teacher → find the inquiry and change its review status. Refresh to verify persistence. To see an inquiry in the learner dashboard, submit it using student@teachvero.local.

Admin can create, edit and delete packages and learning resources using labelled content forms. Zod validates every save. Packages referenced by inquiries cannot be deleted. Changes are audited. A seed rerun preserves edits.

## Host development and checks

Node 24+ and npm are required only for host commands. Tested host: Node 26.13.0/npm 11.20.0. Container: Node 24.

```powershell
Copy-Item .env.example .env
npm ci
docker compose up -d postgres
npm run db:generate
npm run db:migrate
npm run db:seed
# Stop the web container first to free port 3000 if using the host dev server.
docker compose stop web
npm run dev
```

```powershell
npm run lint
npm run typecheck
npm test
npm run build
npx playwright install chromium
# Against the running Compose web container:
$env:TEST_BASE_URL = "http://localhost:3000"
npm run test:e2e
Remove-Item Env:TEST_BASE_URL
```

Without TEST_BASE_URL, Playwright starts the host dev server. E2E tests submit identifiable example inquiries/leads and update the demo learner profile in the development database; they do not delete collection data. CRUD tests delete only their own test content. Screenshots and traces go to ignored test-results/; the HTML report goes to playwright-report/.

To run checks in the web container: `docker compose exec web npm test`, `docker compose exec web npm run lint`, `docker compose exec web npm run build`.

## Content and business configuration

Seed content: src/lib/content.ts. Existing records are never overwritten by seed; edit packages/articles in /admin. Brand values: same typed configuration. Tokens: src/app/globals.css. Original downloadable guide: public/conversation-starter.txt. Teacher photo slot currently uses labelled illustration.

Before publishing, supply: teacher name/story/photo permission, qualifications, real contact/social links, package prices/currency/tax, availability, lesson platform, exam coverage, cancellation/refunds/expiry, controller identity, address, VAT/tax data, retention periods and reviewed legal texts.

## Implemented vs pending

Implemented: responsive public routes, original resources and interactive quiz/download, validated inquiry and guide requests, PostgreSQL persistence, secure credential sign-in, server-enforced roles, own-profile/progress and request list, teacher review/statuses, package/article CRUD and audit trail.

Demo: seed accounts, proposed package durations/lesson counts, editorial example content. No invented real biography, prices, reviews or bookings.

Pending: real account onboarding/reset/verification, confirmed scheduling and lesson history, student administration/private notes, real credit ledger/purchases, testimonials CRUD, resource attachments, payment/webhook/calendar/email integrations, external analytics, full localization and approved legal copy. The zero upcoming-lessons/credits states mean those features are inactive; they are not fake live balances.

## Production checklist

Use managed PostgreSQL and backups; deploy Next.js on Node-compatible hosting. Compose is development-only. Set DATABASE_URL, NEXTAUTH_URL, NEXT_PUBLIC_SITE_URL and a strong NEXTAUTH_SECRET. Provision real users securely, never the demo accounts. Run `prisma migrate deploy`. Use HTTPS, trusted proxy rules and shared rate limiting, review retention/access logs, complete business/legal content, test restore and authorization, and configure providers only after policies are approved. Do not deploy the dev command or local secrets.

## GitHub publishing — approval required

Git is initialized locally. No remote, commit, repository creation, push or deployment was performed. GitHub CLI was not installed in the inspected environment.

After installing gh and signing in, confirm the exact owner and private repository name with the owner before running:

```powershell
gh auth status
git status
git add .
git commit -m "Build TeachVero local MVP"
# Only after explicit owner/name/push approval:
gh repo create OWNER/REPOSITORY --private --source=. --remote=origin
git push -u origin HEAD
```

Check that .env, test results and personal data are ignored before staging. See docs/IMPLEMENTATION_STATUS.md and docs/VERIFICATION.md for executed checks.

## Visual previews

See [desktop home](docs/screenshots/home-1440.png), [mobile home](docs/screenshots/home-390.png) and [mobile inquiry](docs/screenshots/contact-390.png). Regenerate with the running stack and installed Chromium using `node scripts/capture.mjs`. PostgreSQL is exposed only on localhost:55432; the web container uses postgres:5432 internally. The final browser suite contains 13 cases; execution batches and limits are recorded in docs/VERIFICATION.md. Repeated full runs share local rate limits; allow the ten-minute window to expire if you deliberately trigger abuse protection.
