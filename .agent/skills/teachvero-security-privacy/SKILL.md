---
name: teachvero-security-privacy
description: Perform security and GDPR-oriented engineering reviews for TeachVero student data, authentication, analytics and payments. Use for any feature collecting personal data or accessing protected routes.
---

# Security and privacy by design
Treat all user inputs as untrusted. Map data collection, purpose, storage, retention and processors, documenting outstanding legal review rather than claiming compliance.

- Centralize authorization on server functions/routes; protect against horizontal privilege escalation.
- Validate inputs with schemas; apply rate limits to contact and auth endpoints; CAPTCHA or abuse protection when justified.
- Defend against CSRF where relevant, XSS, SQL injection, SSRF, unsafe file uploads and insecure redirects.
- Keep secrets out of repo, browser bundles, logs and sample files; provide `.env.example` with inert placeholders.
- Prefer secure session cookies and supported auth libraries; no homemade password crypto.
- Consent-gate optional tracking; distinguish necessary storage from marketing consent. Respect opt-out.
- Document DPA/vendor assessment needs and privacy/cookie policy review for EU users; consult a qualified professional for legal text.
- Test unauthenticated and cross-account access; scan dependencies and inspect lockfile diffs.

Output: threat model (assets, trust boundaries, abuse cases), risks with severities, fixes, verification and unresolved items.
