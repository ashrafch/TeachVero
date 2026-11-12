---
name: teachvero-analytics-experiments
description: Specify privacy-conscious conversion events, funnel dashboards and evidence-driven landing page experiments for TeachVero. Use for analytics, campaign attribution, A/B tests and growth reporting.
---

# Analytics and controlled experimentation
Define one primary conversion: confirmed booking or verified qualified lead; differentiate micro-conversions from revenue.

Suggested events: `landing_viewed`, `offer_viewed`, `trial_cta_clicked`, `lead_submitted`, `booking_requested`, `booking_confirmed`, `checkout_started`, `purchase_confirmed`, `free_lesson_completed`. Include source/campaign only where permissible; never include name, email, phone, message body or lesson notes.

Implement a typed event schema and one analytics adapter so providers can be replaced. Respect consent. Use debug mode locally and opt out of real events in seeded tests.

Build an honest dashboard showing period, source, funnel counts, defined denominators and data completeness. Do not represent mock data as live data.

For experiments, predefine hypothesis, target audience, primary metric, guardrails and stopping rule; avoid meaningless A/B testing on tiny traffic. Prefer usability reviews and interviews when sample size is low.
