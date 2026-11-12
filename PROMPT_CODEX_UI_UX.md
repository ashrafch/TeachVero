# TeachVero — Codex UI/UX & Conversion Implementation Prompt

You are working in the existing TeachVero repository. Read `AGENTS.md`, `MASTER_PROMPT_CODEX.md`, and `.agents/skills/teachvero-ui/SKILL.md` first (where present). Inspect the current app before editing. Do not replace functioning features blindly.

## Mission
Build a distinctive, premium-quality, mobile-first website for Veronica, an independent professional teacher of Italian as a foreign language. The experience should borrow the *conversion clarity* of Preply and Superprof (teacher credibility, transparent offers, obvious booking path, social proof, clear learning goals) while looking and behaving like an original, single-teacher personal brand, NOT a tutor marketplace. Do not copy layouts, text, assets, logos, icons, or distinctive trade dress from competitors.

## Product positioning
TeachVero is a warm, confident, modern personal learning brand: one expert, a personalized method, and a direct relationship with students. It must feel educational, human, trustworthy, and energizing, never childish, generic SaaS, or like a directory of teachers. Its key audience arrives from mobile Instagram/TikTok social profiles. Primary conversion: request/book an introductory lesson. Secondary conversions: explore packages, take a free mini-lesson or quiz, join an opt-in mailing list, contact Veronica.

## Visual design system
Create and document a cohesive design system using design tokens (CSS variables and Tailwind semantic mappings): warm ivory background, saturated coral primary accent, deep aubergine for typography/high contrast, lavender for supporting surfaces, restrained lime highlights; ensure accessible contrast. Use a strong editorial display font paired with readable body type, with proper loading and fallbacks. Use spacious, disciplined grids, clear content hierarchy, tasteful asymmetry, refined custom illustrations/shapes only where valuable, consistent radii, responsive spacing, polished hover/focus/pressed states, light motion with prefers-reduced-motion support. Avoid excessive gradients, glassmorphism, random decorative blobs, generic stock photos, and emoji-driven UI. No unlicensed imagery. Provide high-quality image placeholders with documented replacement instructions for authentic teacher photos and video.

## Required information architecture
- `/` homepage: short hero proposition and strong teacher visual; primary Book intro lesson CTA; social credibility; distinct benefits; how lessons work in 3 clear steps; package preview; teacher bio teaser; learning content preview; genuine reviews if available; FAQ; strong concluding CTA.
- `/about`: engaging and credible long-form teacher story, professional credentials, methodology, target student profiles, authentic photos/video slots.
- `/lessons`: outcomes-driven lesson tracks (beginner, conversation, travel, exam preparation only if genuinely offered, professional Italian only if genuinely offered), what is included, process, FAQs.
- `/pricing`: clear lesson/session duration and currency, packages and comparison, purchase/booking CTA, transparent policies, no fake scarcity or fake discounts.
- `/book`: mobile-friendly booking/request flow, qualification questions, validation, confirmations, understandable loading/error/empty states. If calendar provider is not configured, offer a REAL inquiry flow persisted server-side; don't present a fake appointment as confirmed.
- `/learn`: meaningful free mini-lessons, organized by topic/level, reading time, practical examples; content templates and real seeded educational content.
- `/learn/[slug]`: polished article or activity format; references to related content; CTA contextual to learning objective.
- `/contact`: short and accessible contact flow with clear expectations.
- Other existing user/admin areas must retain their functional behavior and be visually coherent, but prioritize public conversion pages first.

## Mobile-first requirements
Design and test first at 360, 390, 430 px widths, then tablet 768 px, laptop 1280 px, desktop 1440 px. No horizontal overflow. Thumb-friendly tap targets (aim >=44x44px), concise form flows, accessible mobile navigation, content-first layouts, readable pricing cards, no awkward sticky CTA overlapping content, respect notches/safe areas. Define sensible sticky mobile conversion treatment only if it improves usability, and dismissible UI if needed. Ensure source traffic from social can reach the booking flow in <=2 meaningful steps.

## Conversion and ethical credibility
Use authentic teacher qualifications, prices, reviews, and claims ONLY if supplied/verified. Where missing, store editable content placeholders clearly marked as such in a central content/config file, and keep them off public-facing assertions. Do not fabricate testimonials, lesson counts, ratings, certifications, or availability. No dark patterns. Add useful event instrumentation abstraction for CTA clicks, booking started/submitted, content engaged, and package interest, respecting consent requirements. Explain privacy/cookie configuration and GDPR responsibilities; no automatic third-party tracking without appropriate consent.

## Engineering and integration
Follow current repository conventions, stack, linting, routing, accessibility, TypeScript strict typing, form validation, and server-side data persistence. Don't introduce unnecessary dependencies. All displayed buttons/links must navigate or trigger a real action. Booking/contact forms require input validation, spam protections suitable for MVP, safe storage, and user feedback; no secrets in repo. Implement accessible semantic HTML, keyboard support, reduced-motion, appropriate meta titles/descriptions, open graph, sitemap/robots as suitable, image optimization, and Core Web Vitals-aware decisions. Support progressive enhancement and graceful error states.

## Mandatory workflow
1. Audit repository and current screens. Identify conflicts with existing architecture/content and document assumptions.
2. Produce a short implementation plan and site map, then build the responsive design tokens/components/layout.
3. Implement pages one vertical slice at a time, including working CTA/form/data flow.
4. Run app and capture/test desktop/mobile screens with available browser tooling. If screenshot automation not available, say so and give exact commands for manual checks.
5. Run existing lint, typecheck, unit/integration/E2E tests; add meaningful tests for CTA and booking/contact flows. Fix issues.
6. Deliver a concise implementation report: pages/files changed, behavior implemented, test outcomes, what is still placeholder, required credentials and publishing steps. Don't claim tests or visual reviews were executed unless actually performed.

## Definition of done
Visually coherent original brand, great 390px mobile experience, functioning navigation/CTAs, an honest conversion path, professionally structured content, accessible interactions, no fabricated claims, safe and maintainable implementation, verified build/tests. Do not publish/deploy/push or modify paid integrations without user approval.

Start by reviewing the repository and proposing the shortest viable build sequence, then implement it. Prioritize a strong homepage + pricing + booking experience before polishing peripheral pages.
