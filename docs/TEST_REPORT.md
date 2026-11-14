# Recovery test report — 13 November 2026

## Portal redesign and Git workflow — 14 November 2026

The following is the current delivery evidence. The recovery results below are retained as history.

| Check                                    | Result                                                                                                                                                    |
| ---------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Lint / strict TypeScript                 | Passed after the final goal-provider change                                                                                                               |
| Unit tests                               | 32 passed, 5 files                                                                                                                                        |
| PostgreSQL integration                   | 3 passed in the final rerun                                                                                                                               |
| Full browser regression                  | 29 passed / 2 failed in 12.7 minutes; both failures were outdated navigation assumptions in tests                                                         |
| Focused correction/goal-continuity rerun | 3/3 passed: profile persistence/authorization, package/resource CRUD, interactive goal + mobile/header/main CTA continuity                                |
| Final browser coverage                   | All 31 unique scenarios have passing executions across batches; not a single 31/31 execution                                                              |
| Workspace matrix                         | All 14 teacher/student views at 320, 360, 390, 430, 768, 1024, 1440px; no document overflow                                                               |
| Automated accessibility                  | Public routes and all workspace views at 390/1440px, no tested WCAG A/AA rule violations                                                                  |
| Production build                         | Passed after the final provider/version changes                                                                                                           |
| Git policy                               | Valid branch/PR accepted; malformed branch, vague title, version mismatch and missing changelog rejected; shell-like title treated only as data (6 cases) |
| Screenshots                              | Seven public pages refreshed at 390/1440px; workspace overview/profile/student views captured; home and teacher/student screens visually reviewed         |

The two regression failures searched for profile/content forms on the old combined overview. Tests now navigate to My profile / Website content. Assertions for persistence, ownership, authorization and CRUD were retained. The one article fixture left by the failed run (test-article-1794589783595) was removed by exact ID and verified synthetic title; other records were preserved.

Goal selection uses native radio keyboard controls and a reduced-motion-aware phrase preview. The sticky mobile intro link and public header now share the selected goal with the main CTA. Tests cover both translation directions, lesson-detail navigation and the actual preselected inquiry goal. Workspace checks cover refresh, browser history, current section, unknown-view fallback, student search/no-match/reset and absence of marketing chrome.

Screenshot capture now preserves initial caret styling: Playwright's default caret mutation before hydration caused an artificial development mismatch during the first manual capture. The final goal interaction scenario reports no browser page errors. Next dev can log disconnected response streams during rapid test navigation; no normal-flow failure is inferred from those aborted test connections.

Remote GitHub Actions execution is not yet claimed. Hardware devices, WebKit and manual screen-reader testing were not run. No payment/calendar/email provider was enabled and no production deployment occurred.

Environment: Windows, Node 26.13.1, npm.cmd 11.20.0, locked Next.js 16.4.6, Prisma 6.19.3, PostgreSQL 17 via Docker Desktop 29.9.3, Playwright Chromium 158.

## Executed

| Check                                         | Result                                                                                                                     |
| --------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------- |
| `npm.cmd ci --no-audit --no-fund`             | Passed; exact lockfile restored                                                                                            |
| `npm.cmd run db:generate`                     | Passed                                                                                                                     |
| `npm.cmd run db:migrate`                      | Passed; initial and teaching workflow migrations applied                                                                   |
| `npm.cmd run db:seed`                         | Passed; existing records preserved                                                                                         |
| `npm.cmd run typecheck`                       | Passed                                                                                                                     |
| `npm.cmd run lint`                            | Passed                                                                                                                     |
| `npm.cmd test`                                | 32 passed across 5 files                                                                                                   |
| `npm.cmd run test:integration`                | 3 passed against real PostgreSQL                                                                                           |
| `npm.cmd audit --omit=dev --audit-level=high` | Passed; zero reported production dependency vulnerabilities                                                                |
| Focused CRM Playwright test                   | Passed after correcting form labels/select locator                                                                         |
| New public route responsive Playwright test   | Passed at seven widths, 320–1440px                                                                                         |
| `npm.cmd run build`                           | Passed with the local OG font; final release rerun also covers configured HTTP redirects                                   |
| `node scripts/capture.mjs`                    | Captured seven public pages at 390/1440px; desktop/mobile home visually inspected                                          |
| Full Playwright regression suite              | Initial run: 26 passed / 1 failed in 9.6 minutes; corrected SEO case passed in focused rerun                               |
| SEO focused rerun                             | 2/2 passed after canonical URL normalization and server HTTP redirects                                                     |
| Lead follow-up browser regression             | Passed; public replay preserves private notes/status                                                                       |
| Core public/student/admin UI at 320px         | Passed                                                                                                                     |
| Final browser coverage                        | All 29 current scenarios have passing executions across the full run and focused reruns; not a claim of a single 29/29 run |
| Visual inspection of new workspaces           | Mobile teacher student form and student dashboard captured and inspected                                                   |

## Meaningful database coverage

- Two simultaneous requests for the final credit produce one reservation and one rejection.
- Repeated/concurrent cancellation returns one credit and one ledger return entry.
- Overlaps across allocations fail without consuming credit; adjacent lessons succeed.
- Rescheduling keeps the reserved credit and rejects a conflicting destination.
- Expired allocations cannot reserve future lessons; early completion fails.
- Completion after a lesson's end is idempotent and keeps the credit consumed; cancelled/completed transitions are guarded.
- Integration fixtures use unique IDs in local PostgreSQL and delete only their own records in foreign-key order. Browser workflows leave clearly named example records for inspection.

## Recovery issues and fixes

PowerShell's npm.ps1 wrapper is blocked; npm.cmd works without changing execution policy. Initial sandbox restrictions blocked dependency/Prisma/browser downloads and tsx account lookup; approved runs restored these. The user subsequently enabled unrestricted local access.

First browser attempts exposed an overly verbose password accessible label and a brittle select locator. Labels/locators were corrected and the focused CRM flow passed. The original OG image caused a remote font fetch during build; it now supplies a local licensed WOFF font.

The full suite then exposed two assumptions in the legacy SEO test: Next.js serialized the root canonical without a slash, and a page-level redirect streamed a 200 response with client navigation. The test now compares normalized URLs, and aliases are configured as actual HTTP 307/308 redirects before rendering. Both SEO tests passed after correction. A final lint pass also caught an unescaped apostrophe in newly edited copy; it was corrected.

One attempt to detach the dev server collided with the previous Next child process. The identified project process was stopped and restarted with an explicit port and redirected logs. The final server runs independently in the background; `.data/dev.out.log` and `.data/dev.err.log` are ignored local logs. The database volume was not reset. Only the exact catalog fixture from an earlier test was removed; its allocation/history snapshots were retained.

No real payment provider, calendar provider, email delivery, production deployment or formal legal certification is tested or claimed. Automated accessibility checks complement, rather than replace, manual assistive-technology review.

The existing pinned GitHub Actions workflow now includes integration tests and both main/master branches. It has not been pushed or executed on GitHub; local results do not certify CI execution. Chromium is the verified browser; WebKit and real mobile hardware are not covered in this recovery.
