---
name: teachvero-educator-crm
description: Develop Veronica admin back-office for leads, students, inquiries, lessons, materials and follow-ups with privacy-first workflows.
---

# Educator operations and CRM
Provide a focused back office for one teacher, not an enterprise CRM.

Entities: lead (source and opt-in evidence), student, lesson, booking, package, credit ledger, note, resource, follow-up, consent, audit record.

Workflow: inquiry -> reply -> evaluation call -> package/lesson -> scheduling -> teaching -> follow-up -> renewal. Each state requires clear actions and ownership. Avoid fake calendar integration.

Admin dashboard must answer: pending replies, lessons today/this week, credits nearing zero, upcoming renewals, recent conversion sources (only if tracking is configured). Actions must have success and failure states.

Protect student data: role-based checks on the server, limited retention, avoid storing unnecessary sensitive notes, export/delete workflows where appropriate, explicit permission for messaging. Never expose PII in frontend public caches or analytics.

Tests: forbidden access, concurrent edits, stale updates, validation, export completeness and timezone behavior. Include a small realistic seed dataset with synthetic students only.
