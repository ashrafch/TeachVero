# TeachVero — Codex project instructions

## Mission
Build TeachVero, a polished, mobile-first Italian-language teaching business platform for international learners. This is a commercial product, not a generic template. Prioritize trust, warmth, accessibility, conversion, excellent editorial design, and maintainability.

## Working directory and repository
- Project root on Windows: `C:\Users\aschouik\OneDrive - Capgemini\Desktop\dev\TeachVero`.
- Inspect the existing repository before changing files. Preserve useful existing work.
- Initialize Git if needed. Do not overwrite an existing repository or force-push.
- The GitHub account and repository name must be confirmed from `gh auth status` and the owner before creating/pushing. Prefer a private repository initially.
- Do not commit `.env`, credentials, real student information, or payment secrets.

## Stack
- Next.js App Router, TypeScript strict, Tailwind CSS, shadcn/ui, Motion.
- PostgreSQL, Prisma, Zod, React Hook Form.
- Auth.js for authenticated flows; Stripe and Cal.com behind adapters, configured only with valid credentials.
- Vitest/React Testing Library and Playwright; ESLint and Prettier.
- Use stable, mutually compatible releases and record actual versions in package.json; do not invent dependency APIs.

## Product architecture
- Public: home, about, lesson types, packages, free lessons/resources, learning hub, testimonials, FAQ, contact, legal pages.
- Conversion: prominent trial/intro lesson CTA, booking inquiry, package comparison, lead magnet/newsletter consent, social landing pages.
- Student area: dashboard, upcoming lessons, purchased packages/credits, learning resources, progress, profile.
- Teacher admin: dashboard, students, packages, booking requests, lessons, learning content, testimonials, leads, basic analytics.
- All student and admin data must be protected by server-side authorization and role checks. Never trust client-provided role or prices.
- Separate domain logic, UI components, data access, payment and booking adapters.

## Design quality bar
- Create a distinctive, friendly-premium identity: warm cream backgrounds, deep ink text, energetic coral accents, lavender or mint secondary accents; refine for contrast and consistency.
- Use a coherent type scale, spacing scale, component variants, iconography and responsive tokens.
- Build beautiful custom layouts with excellent hierarchy, large human headlines, authentic teacher imagery placeholders, clear benefits, social proof slots, thoughtful empty/loading/error states.
- Avoid stock-template appearance, excessive gradients, random emoji, clutter, and generic AI marketing copy.
- Mobile first at 360/390/430 px; also validate 768, 1024 and 1440 px. No horizontal overflow. Touch targets >=44px, accessible navigation and sticky CTA where appropriate.
- Respect reduced motion; avoid animations that hurt Core Web Vitals or accessibility.
- Use next/image and next/font; supply meaningful alt text and optimized assets.

## Content and localization
- Start with polished English-facing copy for international learners, with a clear future i18n architecture (Italian and other languages later).
- Do not invent the teacher's biography, qualifications, testimonials, reviews, student counts, prices, VAT details or legal information. Keep editable, clearly marked demo placeholders.
- All commercial content (offers, prices, FAQs, teacher bio, links) must be editable from typed config/seed data, and important content from admin/CMS when implemented.
- Content tone: approachable, motivating, credible, culturally inclusive, not childish.

## Business and compliance
- Packages may represent 1:1 lessons, conversation practice, exam preparation and bundles; pricing is configuration-driven.
- A purchase must never be marked paid without verified server-side Stripe webhook processing; use idempotency and signatures.
- Avoid double booking and overselling lesson credits; use database transactions where relevant.
- Contact/newsletter forms require server-side validation, abuse protection and clear privacy consent; never add users to marketing lists without opt-in.
- Provide cookie/privacy controls appropriate to actual tracking integrations, and legal-page placeholders requiring professional review (privacy, cookies, terms, refund/cancellation policy, VAT details).
- Do not enable analytics or marketing cookies before applicable consent.

## Engineering rules
- Plan before implementation; make incremental, reviewable changes.
- Keep components small, semantic and typed; no `any` without explicit justification.
- Prefer server components for static/public content; use client components only for interactions.
- Validate all external inputs on server. Use server-only modules for secrets.
- Implement authentication, authorization, rate limits, input sanitation and safe error handling.
- Never fabricate integrations: if keys are absent, provide a fully usable local demo mode with clearly labeled mock flows; no fake successful payments or real booking confirmations.
- Database migrations and seed data must be reproducible. Supply `.env.example`.
- Add metadata, sitemap, robots, Open Graph, structured data where valid, canonical URLs and accessible semantics.
- Avoid premature microservices and unnecessary dependencies.

## Tests and acceptance
- Run install, lint, typecheck, unit tests, production build, and Playwright smoke tests; fix failures.
- Cover core flows: homepage -> packages -> booking inquiry; resource access; student/admin authorization; package credit rules; webhook validation (when enabled).
- Test responsive behavior, keyboard navigation, forms and empty states.
- Document any skipped tests and blockers honestly; do not claim a test passed if it was not run.
- Include README with Windows PowerShell setup, Docker/Postgres, environment variables, scripts, seed accounts (demo only), deployment checklist, and GitHub publishing instructions.

## Delivery protocol
1. Inspect repo and state assumptions/questions.
2. Propose architecture, sitemap, data model and staged implementation plan.
3. Implement a complete, visually compelling, locally runnable MVP with working navigation, forms, realistic demo content and guarded admin/student routes.
4. Implement optional external integrations only when credentials and product decisions exist; leave safe adapters otherwise.
5. Run checks, summarize what is complete vs demo vs pending, and show exact commands to run and publish.
6. Never push to GitHub or deploy without explicit confirmation of destination and authorization.

## Codex operating instructions
- Treat this AGENTS.md as persistent repository guidance. Read `MASTER_PROMPT_CODEX.md` for the complete product specification before starting.
- Before edits run an inspection of the workspace, git status, lockfiles and available runtimes; never assume the folder is empty.
- Write a short implementation plan, then execute the work in vertical slices rather than repeatedly asking for permission on non-destructive edits.
- Prefer actual file edits, executed tests and reproducible commands over prose-only implementation suggestions.
- Keep a `docs/IMPLEMENTATION_STATUS.md` with done, demo-only, blocked and next items. Update it as features are completed.
- Never print secrets, disable security controls, or change enterprise-managed security policies.
- Do not run destructive git commands, create remotes, push, or deploy without the user's approval.

## Git delivery workflow
- Follow `docs/GIT_WORKFLOW.md` for every completed task. Inspect existing changes, work on a purpose-named branch and preserve unrelated edits.
- After a complete vertical slice passes relevant checks, update status/changelog and create a descriptive Conventional Commit. Report the branch, hash, candidate version and actual validation results.
- Keep package/lockfile versions synchronized. Bump versions for product milestones, not every edit; never tag an unapproved candidate as a release.
- Prepare a concrete PR description using `.github/PULL_REQUEST_TEMPLATE.md`. Publish branches/PRs only within the user's authorized destination and scope; do not infer permission to merge, release or deploy from permission to commit.
- The established default branch is `master`; do not introduce a parallel long-lived development branch or rename remotes as routine setup.

<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
