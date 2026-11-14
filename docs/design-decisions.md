# Learning portal redesign — 13 November 2026

## Brief and decision

International adults need to understand who teaches, choose a learning goal and request an introduction. Existing functionality is retained; the long promotional homepage and all-in-one workspaces are replaced with focused entry points.

Personality: personal, capable, energetic. Promise: one teacher, a plan shaped around the learner. Visual metaphor: a conversation notebook that becomes a usable learning desk. DM Sans leads navigation and headings; DM Serif Display is reserved for Italian language examples. Authentic teacher photography is still missing: use an explicit monogram placeholder, never a synthetic portrait.

Two routes considered:

- Editorial studio: large portrait, long narrative, serif headings. Strong personal identity, but perpetuates the current scrolling and content hierarchy problems.
- Personal learning desk (selected): compact sans-serif hierarchy, interactive goal selection, an Italian practice card, and separate workspace navigation. Less storytelling; teacher identity remains visible in the first screen and a concise profile section.

Preply and Superprof were inspected for task clarity, not copied. italki could not be fetched. No marketplace search, tutor listings, fabricated availability, reviews, or prices.

## Tokens and layout

Cream #faf6ef; ink #352137; accessible coral #b83d2d; lavender #ece4f2; citrus #e8edbb; white #ffffff. Existing foundation tokens remain authoritative. Sans headings 36–64px public / 28–36px workspace; body 15–17px. Cards 20px radius, controls 12px, workspace rows 12px. Spacing 8/16/24/32/48/64px. Only the learning demonstration uses a layered shadow. User-triggered transitions 180–240ms, disabled for reduced motion.

Public: compact navigation → teacher and goal selector / practice preview → three-step start → concise teacher + package entry → free practice → compact footer. Left aligned, no duplicated manifesto or quote sections.

Teacher: persistent navigation → overview / lessons / students / credits / inquiries / content / leads / activity. Student: overview / lessons / credits / practice / profile / requests. URL query views preserve refresh, deep links and browser history; server-side authorization remains in each page. Public marketing chrome is absent from authenticated workspaces.

## Implementation and acceptance plan

1. Build goal selector and condensed homepage using existing typed content and genuine resource links.
2. Add shared workspace shell and split existing forms into dedicated server-rendered views; retain all domain/API checks.
3. Harmonize public navigation, typography and footer; support 320–1440px.
4. Update browser journeys to use the navigation, add checks for goal continuity, workspace history, keyboard and accessibility, inspect screenshots, run lint/types/unit/integration/build.

## Historical direction (superseded by the explicit redesign request)

# TeachVero creative direction

Audience: adults discovering an Italian teacher from Instagram/TikTok, often on a small phone. Promise: a direct conversation with Veronica about learning Italian for their own life. Personality: warm, clear, cultured.

Two routes considered:

1. Personal correspondence: an editorial introduction, Veronica's monogram until her real portrait is supplied, conversational examples and a clear invitation to write.
2. Learner's notebook: lesson-led split panels with exercises dominating the hero, teacher story secondary.

Keep route 1: the user buys a relationship with one teacher. Use route 2 only inside educational articles, where worked examples help learning. The existing ivory/aubergine/coral palette and serif/sans pair follow the explicit project brief, even though external design guidance warns against using them as unrelated defaults.

Tokens: ivory #faf6ef; aubergine #352137; coral #b83d2d; lilac #ece4f2; citrus #e8edbb; muted ink #6b606c. DM Serif Display headlines, local DM Sans body. Left alignment for reading and forms; controlled asymmetry in hero/profile, comparison where options genuinely differ.

Photo direction: a natural portrait of Veronica with room for cropping, no synthetic likeness or stock tutor. The monogram is explicitly a placeholder. Video needs a real introduction with captions/transcript before activation.

Restraint: numbered steps only express a process; no invented ratings/discounts/counters, competitor logos, carousels, auto-playing media or new font services. Proposed lesson formats remain clearly provisional. Copy diagnosis B: the current personal voice is useful; tighten vague supporting sentences while preserving the teacher-led premise.

Architecture: server-render public content, client components for the menu, forms, filters, quiz and consent. Central theme tokens; inherited dashboard styles retained. Browser screenshots and audit evidence live in docs/VERIFICATION.md.

## Visual review notes

The desktop homepage is roughly one third of the previous scrolling length. Screenshots exposed a missing word-space when mobile hides a line break; corrected in both teacher and package headings. Mobile workspace navigation now has explicit scroll controls and keeps the selected section visible on navigation. Initial automated screenshots modified input caret styles before hydration; capture scripts now use caret: initial, avoiding this test-induced hydration mismatch.

Subjective design review (1–5): originality 4, first-screen clarity 4, mobile ergonomics 4, conversion credibility 5, typography/hierarchy 4, accessibility 4, performance/motion restraint 4, honesty 5, functional navigation 4. Authentic portrait and final commercial content remain outstanding; no synthetic substitutes were introduced.
