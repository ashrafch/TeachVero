import { test, expect } from "@playwright/test";
async function login(page: import("@playwright/test").Page, teacher = false) {
  await page.goto("/login");
  await page
    .getByLabel("Email address", { exact: true })
    .fill(teacher ? "teacher@teachvero.local" : "student@teachvero.local");
  await page
    .getByLabel("Password", { exact: true })
    .fill(teacher ? "TeachVero-demo-2026!" : "LearnItalian-2026!");
  await page.getByRole("button", { name: "Come on in" }).click();
  await expect(page).toHaveURL(teacher ? /admin/ : /dashboard/);
}
test("package to validated inquiry to persisted teacher review", async ({
  page,
}) => {
  const name = "E2E learner " + Date.now();
  await page.goto("/packages");
  await page
    .getByRole("link", { name: "Ask about this package" })
    .first()
    .click();
  await page.getByRole("button", { name: "Send my inquiry" }).click();
  await expect(
    page.getByText("Please enter at least 2 characters."),
  ).toBeVisible();
  await page.getByLabel("Your name", { exact: true }).fill(name);
  await page
    .getByLabel("Email address", { exact: true })
    .fill("e2e@example.test");
  await page
    .getByLabel("Tell me about your Italian")
    .fill("I want to speak Italian when visiting friends.");
  await page.getByLabel("I agree to my details").check();
  await page.getByRole("button", { name: "Send my inquiry" }).click();
  await expect(page.getByRole("heading", { name: /Grazie/ })).toBeVisible();
  await login(page, true);
  const card = page
    .locator(".request-card")
    .filter({ has: page.getByRole("heading", { name, exact: true }) });
  await expect(card).toBeVisible();
  await card.getByRole("combobox").selectOption("REVIEWED");
  await expect(card.getByRole("status")).toHaveText("Saved.");
  await page.reload();
  await expect(card.getByRole("combobox")).toHaveValue("REVIEWED");
});
test("authorization, own profile persistence and no private data leakage", async ({
  page,
  request,
}) => {
  await page.goto("/admin");
  await expect(page).toHaveURL(/login/);
  const denied = await request.post("/api/manage", {
    headers: { origin: "http://localhost:3000" },
    data: { kind: "status", data: { id: "none", status: "CLOSED" } },
  });
  expect(denied.status()).toBe(401);
  await login(page);
  await page.goto("/admin");
  await expect(page).toHaveURL(/dashboard/);
  expect(await page.getByText("e2e@example.test").count()).toBe(0);
  const blocked = await page.request.post("/api/manage", {
    headers: { origin: "http://localhost:3000" },
    data: { kind: "status", data: { id: "none", status: "CLOSED" } },
  });
  expect(blocked.status()).toBe(403);
  await page
    .getByLabel("My Italian goal")
    .fill("Order my first coffee in Italian");
  await page.getByLabel("Introduce myself", { exact: true }).check();
  await page.getByRole("button", { name: "Save my progress" }).click();
  await expect(
    page.getByText("Your profile and progress are saved."),
  ).toBeVisible();
  await page.reload();
  await expect(page.getByLabel("My Italian goal")).toHaveValue(
    "Order my first coffee in Italian",
  );
  await expect(
    page.getByLabel("Introduce myself", { exact: true }),
  ).toBeChecked();
});
test("resource, quiz, lead guide and abuse boundaries", async ({
  page,
  request,
}) => {
  await page.goto("/learn");
  await page
    .getByRole("link", { name: /Your first real Italian conversation/ })
    .click();
  await page.getByRole("button", { name: "Piacere!", exact: true }).click();
  await expect(page.getByRole("status")).toContainText("Esatto");
  await page.goto("/learn");
  await page.getByLabel("Your name", { exact: true }).fill("Guide learner");
  await page
    .getByLabel("Your email", { exact: true })
    .fill("guide@example.test");
  await page.getByLabel("I agree to this guide").check();
  await page.getByRole("button", { name: "Get my free guide" }).click();
  await expect(
    page.getByRole("link", { name: "Download your free guide" }),
  ).toBeVisible();
  expect(
    (
      await request.post("/api/inquiries", {
        headers: { origin: "https://evil.example" },
        data: {},
      })
    ).status(),
  ).toBe(403);
  expect(
    (
      await request.post("/api/inquiries", {
        headers: { origin: "http://localhost:3000" },
        data: { name: "Bad" },
      })
    ).status(),
  ).toBe(400);
});
test("teacher package and article CRUD persist and audit", async ({ page }) => {
  await login(page, true);
  const section = page.locator(".admin-section").filter({
    has: page.getByRole("heading", { name: "Packages", exact: true }),
  });
  await section.getByText("+ Create package", { exact: true }).click();
  const create = section.locator("details").last();
  const id = "test-package-" + Date.now();
  await create.getByLabel("Page identifier").fill(id);
  await create.getByLabel("Package name").fill("E2E package");
  await create.getByRole("button", { name: "Save package" }).click();
  await expect(
    section.getByText("Saved. Public pages use the updated record."),
  ).toBeVisible();
  await page.reload();
  await section.getByText("E2E package", { exact: true }).click();
  const edit = section
    .locator("details")
    .filter({ has: page.getByText("E2E package", { exact: true }) });
  await expect(edit.getByLabel("Page identifier")).toHaveValue(id);
  await edit.getByLabel("Number of lessons").fill("6");
  await edit.getByRole("button", { name: "Save package" }).click();
  await expect(
    section.getByText("Saved. Public pages use the updated record."),
  ).toBeVisible();
  await page.reload();
  await section.getByText("E2E package", { exact: true }).click();
  await expect(edit.getByLabel("Number of lessons")).toHaveValue("6");
  page.once("dialog", (dialog) => dialog.accept());
  await edit.getByRole("button", { name: "Delete", exact: true }).click();
  await expect(section.getByText("Deleted.", { exact: true })).toBeVisible();
  const resources = page.locator(".admin-section").filter({
    has: page.getByRole("heading", {
      name: "Learning resources",
      exact: true,
    }),
  });
  await resources.getByText("+ Create resource", { exact: true }).click();
  const resourceCreate = resources.locator("details").last();
  const resourceId = "test-article-" + Date.now();
  await resourceCreate.getByLabel("Page identifier").fill(resourceId);
  await resourceCreate
    .getByLabel("Article title")
    .fill("Integration test article");
  await resourceCreate.getByRole("button", { name: "Save resource" }).click();
  await expect(
    resources.getByText("Saved. Public pages use the updated record."),
  ).toBeVisible();
  await page.goto("/learn/" + resourceId);
  await expect(
    page.getByRole("heading", { name: "Integration test article" }),
  ).toBeVisible();
  await page.goto("/admin");
  await resources
    .getByText("Integration test article", { exact: true })
    .click();
  page.once("dialog", (dialog) => dialog.accept());
  await resources.getByRole("button", { name: "Delete", exact: true }).click();
  await expect(resources.getByText("Deleted.", { exact: true })).toBeVisible();
});
for (const width of [360, 390, 430, 768, 1024, 1280, 1440])
  test(
    "responsive public and protected screens at " + width,
    async ({ page }) => {
      test.setTimeout(120000);
      await page.setViewportSize({ width, height: 900 });
      for (const route of [
        "/",
        "/about",
        "/lessons",
        "/pricing",
        "/book",
        "/learn",
        "/learn/your-first-conversation",
        "/contact",
        "/ciao",
        "/login",
        "/legal/privacy",
        "/legal/cookies",
        "/legal/terms",
        "/legal/cancellation",
        "/legal/business",
      ]) {
        await page.goto(route);
        await expect(page.locator("h1")).toBeVisible();
        expect(
          await page.evaluate(
            () => document.documentElement.scrollWidth <= window.innerWidth,
          ),
          route + " overflow at " + width,
        ).toBe(true);
        if (route === "/" && width < 800) {
          await page.getByRole("button", { name: "Open menu" }).click();
          await expect(
            page.getByRole("navigation", { name: "Mobile navigation" }),
          ).toBeVisible();
          await page.getByRole("button", { name: "Close menu" }).click();
        }
        if (route === "/" || route === "/contact" || route === "/packages")
          await page.screenshot({
            path:
              "test-results/screenshots/" +
              width +
              "-" +
              (route.slice(1) || "home") +
              ".png",
            fullPage: true,
          });
      }
      await login(page);
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth,
        ),
      ).toBe(true);
      await page.screenshot({
        path: "test-results/screenshots/" + width + "-dashboard.png",
        fullPage: true,
      });
      await page.getByRole("button", { name: "Sign out", exact: true }).click();
      await login(page, true);
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth,
        ),
      ).toBe(true);
      await page.screenshot({
        path: "test-results/screenshots/" + width + "-admin.png",
        fullPage: true,
      });
    },
  );
test("keyboard skip link and mobile navigation touch targets", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  await page.keyboard.press("Tab");
  await expect(
    page.getByRole("link", { name: "Skip to content" }),
  ).toBeFocused();
  const button = page.getByRole("button", { name: "Open menu" });
  const box = await button.boundingBox();
  expect(box?.width).toBeGreaterThanOrEqual(44);
  expect(box?.height).toBeGreaterThanOrEqual(44);
});
test("fixed mobile CTA stays clear of forms and protected workspaces", async ({
  page,
}) => {
  for (const width of [360, 390, 430]) {
    await page.setViewportSize({ width, height: 900 });
    for (const route of ["/", "/packages"]) {
      await page.goto(route);
      await expect(page.locator(".mobile-cta")).toBeVisible();
    }
    for (const route of ["/contact", "/book", "/learn", "/login"]) {
      await page.goto(route);
      await expect(page.locator(".mobile-cta")).toBeHidden();
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth,
        ),
      ).toBe(true);
      if (route === "/contact")
        await page.screenshot({
          path: "test-results/screenshots/" + width + "-contact-no-overlap.png",
          fullPage: true,
        });
    }
  }
  await login(page);
  await expect(page.locator(".mobile-cta")).toBeHidden();
  await page.getByRole("button", { name: "Sign out", exact: true }).click();
  await login(page, true);
  await expect(page.locator(".mobile-cta")).toBeHidden();
});
test("reduced motion keeps the skip link offscreen until keyboard focus", async ({
  page,
}) => {
  const errors: string[] = [];
  page.on("pageerror", (e) => errors.push(e.message));
  await page.emulateMedia({ reducedMotion: "reduce" });
  for (const width of [390, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/");
    const skip = page.getByRole("link", { name: "Skip to content" });
    await expect(skip).not.toBeInViewport();
    await page.keyboard.press("Tab");
    await expect(skip).toBeFocused();
    await expect(skip).toBeInViewport();
  }
  await page.goto("/contact");
  await expect(page.getByLabel("Your name", { exact: true })).toBeEnabled();
  expect(errors).toEqual([]);
});
