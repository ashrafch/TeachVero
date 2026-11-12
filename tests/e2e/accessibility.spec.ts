import { test, expect } from "@playwright/test";
import { createRequire } from "node:module";
import type { AxeResults } from "axe-core";
const require = createRequire(import.meta.url);
const axePath = require.resolve("axe-core/axe.min.js");
for (const width of [390, 1440]) {
  test(
    "automated WCAG checks on public routes at " + width,
    async ({ page }) => {
      test.setTimeout(180000);
      await page.setViewportSize({ width, height: 900 });
      for (const route of [
        "/",
        "/about",
        "/lessons",
        "/pricing",
        "/book",
        "/contact",
        "/ciao",
        "/learn",
        "/learn/your-first-conversation",
      ]) {
        await page.goto(route);
        await expect(page.locator("h1")).toBeVisible();
        await page.addScriptTag({ path: axePath });
        const results = await page.evaluate(async () => {
          const engine = (
            window as unknown as {
              axe: { run: (options: unknown) => Promise<AxeResults> };
            }
          ).axe;
          return engine.run({
            runOnly: {
              type: "tag",
              values: ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"],
            },
          });
        });
        expect(
          results.violations.map((v) => ({
            id: v.id,
            impact: v.impact,
            nodes: v.nodes.map((n) => ({
              target: n.target,
              summary: n.failureSummary,
            })),
          })),
          route,
        ).toEqual([]);
      }
    },
  );
}
