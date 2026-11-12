---
name: teachvero-ui
summary: Design and implement TeachVero's distinct, premium mobile-first tutoring brand and conversion flows without imitating marketplaces.
---

# TeachVero UI / UX & Conversion Skill

## When to use
Use this skill whenever building, reviewing, or modifying TeachVero public pages, components, branding, responsive layout, learning resources, pricing, booking, onboarding, or conversion paths.

## Core principles
1. A **single independent teacher** is the product: highlight Veronica's voice, teaching approach, credentials (only when verified), and relationship with students. Never create marketplace scaffolding, tutor grids or generic listings.
2. Learn from Preply/Superprof information clarity, not their proprietary expression. Do not copy their components or use third-party logos/assets without permission.
3. Social-first mobile conversion: optimize 360/390/430 px before desktop. One obvious action per section, predictable way to book, little typing, fast loading.
4. Authenticity beats simulated social proof: never fabricate reviews, credentials, metrics, urgency, offers, or live booking availability.
5. Design should be original, polished and scalable. Avoid default shadcn-demo appearance: customize tokens, typography, proportions, compositions, interactive states and layouts.

## Distinctive direction
- Brand personality: warm, energetic, credible, bright, personal, contemporary, cultured.
- Suggested palette to iterate (not mandatory hex requirements): warm ivory, coral, deep aubergine, lilac and restrained citrus; accessible contrast for all text and controls.
- Typography: expressive editorial headings + highly readable utility/body font; sound fallback and font loading.
- Imagery: authentic portraits/video of Veronica preferred; if not yet provided, elegant explicit placeholders rather than misleading AI teacher portraits.
- Motion: restrained purposeful transitions; `prefers-reduced-motion` respected.

## Page composition checklist
### Home
- Above the fold communicates *who teaches*, *what result the student can expect*, *who it's for*, and *what to do next*.
- Visible primary booking CTA, short supporting copy, authentic teacher image slot.
- Sections: benefits, method, personalized paths, lesson/package previews, free learning resource, teacher story, genuine testimonials only if provided, questions, closing CTA.
### Pricing
- Transparent session duration, amounts, validity/cancellation terms, what is included, and package CTA.
- Sensible default choice without manipulative badges or invented discounts.
### Booking
- Distinguish inquiry/request from actual confirmed booking.
- Clear selected plan, timezone when relevant, validation, confirmation and fallback contact route.
### Learn
- Content useful enough to learn from even without paying; clear hierarchy and pathways toward paid lessons.
### About
- Distinct personality and verifiable professional credibility; no generic marketing biography.

## QA rubric (score each 1–5)
- Originality and personal brand identity
- Hero clarity and first-screen CTA
- Mobile ergonomics at 360/390/430px
- Conversion flow credibility and friction
- Visual hierarchy and typography
- Accessibility/keyboard/contrast
- Speed, images and motion
- Content honesty and trust
- Functional links, forms and data persistence
A page is not finished with any dimension <4. Record issues and fix before calling it done.

## Engineering guardrails
Respect the repository's `AGENTS.md`, stack and existing API/data model. Use accessible semantic HTML, reusable React components, typed data, server-side validated forms, sensible empty/loading/error states, proper responsive images, low-motion fallback, and truthful SEO metadata. Test primary booking/contact paths and at least three mobile viewport sizes. Avoid introducing dependencies when existing primitives suffice.

## Output protocol
Before changes: short audit + proposed files. During: implement working vertical slices. After: describe implemented pages, screenshots/checks actually performed, tests, remaining placeholders and exact next steps. Never claim to have pushed or deployed without doing so and obtaining approval.
