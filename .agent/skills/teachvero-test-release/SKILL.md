---
name: teachvero-test-release
description: Run end-to-end release readiness for TeachVero across code quality, browser responsiveness, accessibility, integration flows, CI and deployment. Use before launches and after significant UI or backend changes.
---

# Release readiness
1. Inspect package scripts, environment requirements and deployment target. Do not assume commands exist.
2. Run formatting/lint, `tsc --noEmit`, unit and integration tests, production build; document failures and fix them.
3. Execute Playwright journeys in at least Chromium mobile + desktop. Where supported add WebKit. Test: landing -> package -> lead form, user auth, lesson exercise, student dashboard, admin restrictions.
4. Verify 360, 390, 768, 1024 and 1440 widths, dark/light if supported, reduced motion, slow network, keyboard navigation.
5. Run automated a11y scans and manual checks for headings, tab order, labels, errors, contrasts, dialog behavior.
6. Audit route caching, SEO metadata, no client bundle secrets, image optimization, error states, and empty content.
7. Define CI with reproducible install and tests; protect against committing `.env`, PII and credentials.
8. Create release report: pass/fail evidence, screenshots, blockers, rollback plan, configuration and deployment checklist.

Never claim a test passed unless command executed and result was observed. No deployment or public GitHub push without explicit approval.
