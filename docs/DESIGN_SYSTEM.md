# TeachVero design system

Updated 13 November 2026 for the requested personal learning portal redesign. The new direction replaces the long editorial homepage and stacked workspaces while preserving the brand palette and functional domain layer.

## Tokens and typography

Brand colors remain in src/app/styles/foundation.css: paper #faf6ef, ink #352137, muted #6b606c, coral #b83d2d, hover #963022, line #ded5dc, citrus #e8edbb, lavender #ece4f2, peach #f3ddd0. The portal layer in src/app/styles/portal.css adds white surfaces, a soft workspace background, 20px panel radius, a single layered practice-card shadow and 180ms interaction timing. No new dependencies or remote font requests.

Local DM Sans now leads page headings, navigation and body text. DM Serif Display is reserved for the Italian practice examples and the explicit teacher monogram placeholder. Public headings are 40–72px; workspace headings 28–32px. Avoid additional color systems.

## Information architecture

- Homepage: Veronica and goal selector, a working phrase/translation preview, three practical next steps, concise teacher profile/package entry, and free learning links. The FAQ and package details have dedicated pages instead of being repeated on the homepage. No repeated closing campaign on every page.
- Goal choices use native radio controls, visible selection and keyboard arrows. Meaning is shown on demand; changing goal resets the phrase. The chosen goal is carried into /book. Motion answers this selection and respects reduced motion.
- Public typography, spacing, header and footer are harmonized with the portal. Existing content and public routes remain available.
- Teacher: overview, lessons, students, package credits, inquiries, website content, guide requests, activity. Student search has query persistence, match count and reset.
- Student: overview, lessons, credits, practice, profile, requests. Overview prioritizes the next real lesson, actual credit balance and next practice action. Profile is a dedicated screen.
- Shared workspace shell replaces public marketing chrome inside /admin and /dashboard. Query views render on the server after existing role checks. Unknown views fall back to overview. Navigation persists across refresh and browser history.
- Desktop sidebar becomes a horizontal mobile menu with explicit previous/more controls; the current view is scrolled into view. No essential navigation relies only on a swipe gesture.

## Interaction and truthfulness

Keep targets at least 44px, visible focus, labelled forms, semantic disclosure controls, server-validated mutations and status feedback. Avoid continuous animation, fabricated urgency, reviews, progress or availability. A missing teacher portrait stays visibly pending. Proposed packages remain provisional; nothing represents a paid transaction or live calendar integration.

Widths: 320, 360, 390, 430, 768, 1024 and 1440. Automated accessibility checks supplement screenshot review; they do not replace manual assistive-technology testing. Python search in ui-ux-pro-max remains unavailable on this Windows host; its local static accessibility/interaction guidance was reviewed instead.

See design-decisions.md for the brief, alternatives and historical direction. See TEST_REPORT.md for actual checks and docs/screenshots for visual evidence.
