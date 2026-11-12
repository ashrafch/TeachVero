# Public experience redesign — 12 November 2026

Audit: existing PostgreSQL inquiries, authentication, CRUD and learning articles work. The previous public site lacked Veronica's identity, /pricing and /book, topic discovery, comparison and a direct campaign-to-request path. Preserve those working backend operations and stored content.

Plan: (1) original single-teacher identity and central verified content; (2) pricing → selected-plan booking → existing persisted inquiry; (3) organized learning, social attribution and consent-aware event abstraction; (4) lint/type/build/browser and visual review.

Skill resolved from the requested missing .agents/skills/teachvero-ui/SKILL.md to the existing .agent/skills/techvero-ui/SKILL.md. No copy was created in a second location.

References inspected: https://preply.com/ and https://www.superprof.com/. Only functional principles: put teacher identity and learning goals early, make offer details scannable, and provide an obvious next step. No competitor assets, wording or layouts used.

Sitemap: /, /about, /lessons, /pricing, /book, /learn, /learn/[slug], /contact, /ciao, legal pages. Existing /packages remains compatible.

Visual system: ivory #faf6ef, aubergine #352137, coral #b83d2d, lilac #ece4f2, citrus #e8edbb. Local DM Serif Display and DM Sans, editorial asymmetric layouts, a monogram portrait placeholder (never a synthetic likeness), numbered methodology, scannable comparisons. Existing responsive foundation retained. Semantic Tailwind tokens map to CSS variables. 44px controls, visible focus and reduced-motion support.

Owner inputs: real portrait and intro video, approved long-form biography and qualifications, amounts/currency/taxes, scheduling and cancellation/expiry policies, genuine permissioned reviews. Central record: src/lib/teacher.ts. Replace TeacherVisual's monogram with next/image only after an authorized photo is supplied; provide descriptive alt and retain fixed dimensions. Never infer qualifications from occupation.

Measurement: default off. Optional explicit local preference enables sanitized CustomEvents (event and pathname only). No provider, cookies, network sends or PII. Future analytics adapter must honor consent and update legal disclosures.
