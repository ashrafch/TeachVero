# SEO and content audit — 12 November 2026

English is the only implemented locale. No hreflang is emitted for translations that do not exist. This is a local preview, not a ranked public business; no search traffic, ranking or conversion uplift is claimed.

## Route intent
| Route | Learner intent | Primary next step |
| --- | --- | --- |
| / | Find a personal online Italian teacher | Request an introduction |
| /about | Understand Veronica and her approach | Ask a question or request intro |
| /lessons | Match beginner/conversation/travel goals | Goal-prefilled request |
| /pricing | Compare proposed duration/lesson bundles | Selected-package request |
| /book | Share goals and ask about availability/price | Persisted request |
| /learn | Find useful free Italian practice | Topic/search → article |
| /learn/[slug] | Learn a small, explicit skill | Activity and contextual intro |
| /ciao | Continue from a social post | One primary campaign-preserving CTA |
| /contact | Ask Veronica a question | Short persisted message |

Implemented: unique public titles/descriptions, canonical routes, /packages redirect to /pricing, per-article metadata, factual WebSite JSON-LD, local OG image in the current palette. No ratings, reviews, price or unverified qualification schema.

Preview protection: SITE_INDEXABLE defaults false; metadata says noindex/nofollow, robots disallows crawling and sitemap contains no preview URLs. After owner launch review, explicitly set SITE_INDEXABLE=true and the real NEXT_PUBLIC_SITE_URL. Sitemap then derives public canonical routes and current article slugs; protected/legal drafts remain excluded.

Content improvements: 3 seeded lessons now expose objective/prerequisite/sample status, related reading and deterministic feedback. Quiz answers remain session-only and say so. Account confidence checklists are separately saved; no implied proficiency assessment or automatic course completion.

Pending: genuine portrait/video and captions, approved professional biography, verified policy/price information, reviewed learning content, final contact/social links, search-console setup after approved launch, production field/Lighthouse Core Web Vitals. No translation, regional pricing or geo-detection is invented.
