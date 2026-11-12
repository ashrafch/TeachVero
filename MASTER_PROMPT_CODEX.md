# TeachVero — Master implementation brief for Codex

You are acting as a senior product engineer, UX/UI designer, conversion strategist, and technical lead. Build a production-oriented, visually outstanding, mobile-first website and extensible teaching business platform named **TeachVero** for an Italian teacher who teaches Italian to international students. She is a self-employed professional who currently teaches at private schools and privately and wants to acquire, teach, and retain students online.

## Local context
Windows project directory: `C:\Users\aschouik\OneDrive - Capgemini\Desktop\dev\TeachVero`. I work in VS Code with Codex in VS Code. Start locally; architect for later public deployment and GitHub hosting. Read and obey `AGENTS.md` in the repository. Inspect existing files first, and preserve any valid work.

## Outcome
Deliver a credible, beautiful, fast, responsive, real business product—not a landing-page mockup. The initial experience must be immediately demonstrable locally without paid services or secrets, while its architecture can later support real booking, payments, students, course content, and admin management.

## Audience and funnel
International learners arriving mainly from Instagram/TikTok on smartphones. Different segments: complete beginners, conversational learners, exam-prep learners, expats, travelers and people with Italian partners/family. Build the funnel social video -> tailored mobile landing page -> free value -> trust -> trial lesson/booking inquiry -> paid package -> returning student.

## Visual direction
Create an original friendly-premium identity. Warm ivory/cream, deep charcoal, vibrant coral and restrained lavender/mint; excellent typography, clear hierarchy, refined cards, subtle microinteractions, tasteful custom illustrations/shapes and authentic photography slots. The brand must feel warm, confident, personal, modern and energetic, never childish or generic. Define design tokens, reusable UI patterns, responsive components, and motion principles. Include a polished mobile menu, clear CTA, touch-friendly forms and mobile package cards. Treat 360–430 px as primary. Also deliver impeccable desktop layouts.

## Public site
1. Home: bold hero, introduction to the teacher, value proposition, lesson formats, how it works, package previews, free learning teaser, testimonials placeholders, FAQ, strong CTA and footer.
2. About: personal teacher story and teaching method with editable truthful placeholders; qualifications, teaching approach and real photo slots.
3. Lessons: 1:1, conversation, beginner, exam preparation, tailored lessons; audience, outcomes, duration and booking CTA.
4. Packages: editable lesson bundles, features, benefits, price placeholders, comparison, FAQ and purchase/booking actions; avoid invented real prices.
5. Learn/free resources: blog-style lessons, grammar/vocabulary/pronunciation guides, interactive quiz examples, downloadable resources with accessible content and SEO-friendly routes.
6. Lead magnet: free mini-lesson or guide signup, optional email consent, thank-you state.
7. Contact and trial lesson inquiry: working validated form saved to database in local mode, confirmation state and admin review.
8. Social campaign landing pages: minimal distractions, mobile-first, unique CTA and trackable campaign parameters without invasive tracking.
9. Legal page placeholders: privacy, cookies, terms, cancellation/refund, VAT/business information to complete before launch.

## Student experience
Secure sign-in, role-based dashboard, upcoming lessons, booking requests, lesson history, package balance/credits, learning materials, progress checklist, personal profile. Where integrations are not active, clearly mark demo data and avoid misleading booking/payment success. Provide polished empty/loading/error states.

## Teacher/admin experience
Secure teacher-only dashboard for managing student profiles, leads, lesson requests, lesson types, packages, resource articles, lesson notes/progress, testimonials and basic funnel metrics. Basic CRUD should be genuinely persisted in PostgreSQL where feasible. Admin actions require server authorization. Never expose private student data on public routes.

## Technical architecture
Next.js App Router + TypeScript strict + Tailwind CSS + shadcn/ui + Motion; PostgreSQL + Prisma; Zod and React Hook Form; Auth.js; tests with Vitest and Playwright. Use Docker Compose for local PostgreSQL if available. Structure folders coherently (app route groups, components/ui, components/marketing, features, lib, server, prisma, tests). Prefer server rendering for SEO pages and server-only data operations. Define entities such as User, StudentProfile, LessonType, Package, PackagePurchase, LessonCreditLedger, BookingRequest, Lesson, Resource, Lead, Testimonial, and AuditLog, but simplify if necessary to deliver reliable MVP. Use transactional and idempotent rules for payments and credits.

## Integrations
Stripe checkout + verified webhook architecture, but only activate when credentials and commercial policies are supplied. Cal.com or another calendar provider via adapter; keep functional local booking inquiries in the meantime. Email provider via adapter with development-safe logging; never claim a message was sent when not configured. Provide consent-aware analytics hooks and optional future CMS integration. Do not require external credentials to run the MVP.

## SEO, performance, accessibility, compliance
Semantic markup, metadata, OG previews, sitemap, robots, canonical URLs, appropriate structured data, image optimization, loading strategies, fast page transitions and good Core Web Vitals. WCAG 2.2 AA-oriented contrast, keyboard access, focus, labels and reduced motion. Privacy-by-design, input validation, rate limiting, CSRF-safe auth patterns, secret management, consent handling, and professional-review placeholders for legal texts. No invented testimonials, certifications, reviews, prices or biography.

## Work plan
**Phase A — discovery and design:** inspect repository, summarize existing files, propose sitemap, user journeys, data model, architecture, design system and staged delivery. Ask only truly blocking questions; use editable placeholders for non-blocking missing business details.
**Phase B — visual foundation:** create a premium responsive design system, layout, header/footer, home, about, lessons, packages, learn, contact, social landing page and custom visual assets as appropriate.
**Phase C — working MVP:** database, seed, inquiry forms, content listing/details, authentication, student and admin areas with real persisted flows. Demo mode must be explicitly marked.
**Phase D — quality:** responsive Playwright checks at mobile/tablet/desktop widths, keyboard/accessibility smoke tests, unit tests for critical business rules, lint, typecheck, build; fix failures.
**Phase E — handoff:** README, `.env.example`, Windows PowerShell commands, Docker setup, local run, seed data, screenshots if practical, production deployment checklist and GitHub repo setup.

## Definition of done
- A user can browse all core pages on phone and desktop with professional design and clear CTA.
- A visitor can submit a booking inquiry or contact form and the teacher can view it in admin.
- Free lesson content is actually browsable; at least several original example resources exist.
- Authenticated routes enforce roles server-side; student and admin dashboards are usable with clearly labeled demo data.
- Package information is editable; no fake real payment or booking confirmations.
- Local setup and tests are documented and reproducible; build passes or exact blockers are documented.
- A private GitHub repository is prepared only after verifying `gh` authentication and getting my confirmation for repository owner/name and push.

## How to respond and execute
Do not stop at planning or generate only a static homepage. Work in meaningful increments, run the application and tests where supported, fix defects, and provide concise progress checkpoints with files changed, commands executed, and known limitations. Make pragmatic decisions without asking for every color or sentence. When something needs a real business decision or secret, mark it as pending rather than inventing it. Deliver the strongest fully runnable local MVP possible before optional integrations.

## Codex execution order and expected artifacts
- First read `AGENTS.md`, inspect existing repository files, and check `git status`, Node/package manager availability and Docker availability.
- Produce `docs/PRODUCT_SPEC.md`, `docs/ARCHITECTURE.md`, and `docs/IMPLEMENTATION_STATUS.md` and maintain them as features ship.
- Implement a working vertical slice early: navigation -> package page -> validated inquiry -> persisted record -> admin view. Do not claim this is complete without running it.
- Next deliver free learning resources, international-ready marketing pages and fully responsive navigation; then auth, dashboard and CRUD.
- At each milestone use the actual available scripts to run lint/typecheck/tests/build; fix failures and record environmental blockers.
- If the local machine lacks PostgreSQL/Docker, provide a clearly labeled fallback development mode that is independently testable, and document its limitations; never silently fake persistence.
- Provide a demo content configuration, actual seed data and explicit business fields the owner must fill in before publishing.
- Prepare `.gitignore` and a clear `gh` publishing procedure. Do not publish to remote without approval.
- Audit all mobile screens at 360, 390, 430, 768, 1024, and 1440 CSS pixels, including navigation, forms, package cards, and fixed CTAs.
- In the final status report distinguish implemented/tested from scaffolded, conceptual, and dependent on external keys.
