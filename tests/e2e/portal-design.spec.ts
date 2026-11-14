import { test, expect, type Page } from "@playwright/test";
import { createRequire } from "node:module";
import type { AxeResults } from "axe-core";
const require = createRequire(import.meta.url);
const axePath = require.resolve("axe-core/axe.min.js");

test("goal selection, practice preview and intro request stay connected", async ({
  page,
}) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  for (const width of [320, 390, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/");
    await page.getByRole("radio", { name: "Life & travel in Italy" }).check();
    await expect(
      page.getByRole("heading", { name: "Italian for the everyday" }),
    ).toBeVisible();
    await page.getByRole("button", { name: "Show meaning" }).click();
    await expect(page.locator(".phrase-card")).toContainText(
      "A coffee, please.",
    );
    await page.getByRole("button", { name: "Back to Italian" }).click();
    await expect(page.locator(".phrase-card")).toContainText(
      "Un caffè, per favore.",
    );
    await page.getByRole("link", { name: "Explore this lesson" }).click();
    await expect(page).toHaveURL(/lessons\/tailored/);
    await page.goto("/");
    if (width < 800) {
      await page.getByRole("radio", { name: "Life & travel in Italy" }).check();
      await page.locator(".mobile-cta a").click();
      await expect(page.getByLabel("What brings you here?")).toHaveValue(
        "travel",
      );
      await page.goto("/");
    }
    await page.getByRole("radio", { name: "Speak with confidence" }).check();
    await expect(page.locator(".header-cta")).toHaveAttribute(
      "href",
      "/book?goal=conversation",
    );
    await page.locator(".start-action").click();
    await expect(page.getByLabel("What brings you here?")).toHaveValue(
      "conversation",
    );
  }
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  await page.getByRole("radio", { name: "Start from zero" }).focus();
  await page.keyboard.press("ArrowRight");
  await expect(
    page.getByRole("radio", { name: "Speak with confidence" }),
  ).toBeChecked();
  await expect(
    page.getByRole("heading", { name: "Keep the conversation going" }),
  ).toBeVisible();
  expect(errors).toEqual([]);
});

async function signIn(page: Page, teacher: boolean) {
  await page.goto("/login");
  await page
    .getByLabel("Email address", { exact: true })
    .fill(teacher ? "teacher@teachvero.local" : "student@teachvero.local");
  await page
    .getByLabel("Password", { exact: true })
    .fill(teacher ? "TeachVero-demo-2026!" : "LearnItalian-2026!");
  await page.getByRole("button", { name: "Come on in" }).click();
  await expect(page.locator(".workspace-heading h1")).toBeVisible();
}

test("dedicated workspace views support navigation, history, mobile and accessibility", async ({
  page,
}) => {
  test.setTimeout(360000);
  for (const teacher of [false, true]) {
    await signIn(page, teacher);
    const base = teacher ? "/admin" : "/dashboard";
    const sections = teacher
      ? [
          "overview",
          "lessons",
          "students",
          "allocations",
          "inquiries",
          "content",
          "leads",
          "activity",
        ]
      : ["overview", "lessons", "credits", "practice", "profile", "requests"];
    await expect(page.locator(".site-header")).toHaveCount(0);
    await expect(page.locator(".closing")).toHaveCount(0);
    await page
      .getByRole("navigation")
      .getByRole("link", {
        name: teacher ? "Students" : "My profile",
        exact: true,
      })
      .click();
    await expect(page).toHaveURL(teacher ? /view=students/ : /view=profile/);
    await page.reload();
    await expect(
      page.getByRole("navigation").locator('[aria-current="page"]'),
    ).toHaveText(teacher ? "Students" : "My profile");
    await page.goBack();
    await expect(
      page.getByRole("navigation").locator('[aria-current="page"]'),
    ).toHaveText("Overview");
    for (const width of [320, 360, 390, 430, 768, 1024, 1440]) {
      await page.setViewportSize({ width, height: 900 });
      for (const view of sections) {
        await page.goto(base + "?view=" + view);
        await expect(page.locator(".workspace-heading h1")).toBeVisible();
        expect(
          await page.evaluate(
            () => document.documentElement.scrollWidth <= innerWidth,
          ),
          base + "/" + view + " at " + width,
        ).toBe(true);
        if (width === 390 || width === 1440) {
          await page.addScriptTag({ path: axePath });
          const result = await page.evaluate(async () =>
            (
              window as unknown as {
                axe: { run: (options: unknown) => Promise<AxeResults> };
              }
            ).axe.run({
              runOnly: {
                type: "tag",
                values: ["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"],
              },
            }),
          );
          expect(
            result.violations.map((v) => ({
              id: v.id,
              nodes: v.nodes.map((n) => n.target),
            })),
            base + "/" + view,
          ).toEqual([]);
          if (["overview", "profile", "students"].includes(view))
            await page.screenshot({
              path: `docs/screenshots/${teacher ? "admin" : "student"}-${view}-${width}.png`,
              fullPage: true,
              caret: "initial",
            });
        }
      }
    }
    if (teacher) {
      await page.goto("/admin?view=students");
      await page.getByLabel("Find a student").fill("no-match-portal-test");
      await page.getByRole("button", { name: "Search", exact: true }).click();
      await expect(page.getByRole("status")).toContainText(
        "0 matching students",
      );
      await page.getByRole("link", { name: "Clear search" }).click();
      await expect(page.getByLabel("Find a student")).toHaveValue("");
    }
    await page.goto(base + "?view=unknown");
    await expect(
      page.getByRole("navigation").locator('[aria-current="page"]'),
    ).toHaveText("Overview");
    await page.getByRole("button", { name: "Sign out", exact: true }).click();
    await expect(page).toHaveURL("/");
  }
});
