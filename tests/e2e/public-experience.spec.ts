import { test, expect } from "@playwright/test";

test("pricing carries the selected package into the request and handles retired links", async ({
  page,
}) => {
  await page.goto("/pricing");
  await expect(
    page.getByRole("region", { name: "Lesson package comparison" }),
  ).toBeVisible();
  const first = page
    .getByRole("link", { name: "Ask about this package" })
    .first();
  const href = await first.getAttribute("href");
  await first.click();
  await expect(page).toHaveURL(/\/book\?package=/);
  await expect(page.getByLabel("A package in mind?")).toHaveValue(
    new URL(href!, "http://localhost").searchParams.get("package")!,
  );
  await expect(page.locator(".selected-plan")).toContainText(
    "proposed lessons",
  );
  await page.goto("/book?package=retired-package");
  await expect(page.getByRole("status")).toContainText("no longer listed");
  await expect(page.getByLabel("A package in mind?")).toHaveValue("");
});

test("social intro retains campaign through a real saved request", async ({
  page,
}) => {
  const campaign = "instagram-november-" + Date.now();
  await page.goto("/ciao?utm_campaign=" + campaign);
  await page
    .locator("main")
    .getByRole("link", { name: "Request an intro lesson" })
    .click();
  await expect(page).toHaveURL(new RegExp("utm_campaign=" + campaign));
  await page
    .getByLabel("Your name", { exact: true })
    .fill("Social test learner");
  await page
    .getByLabel("Email address", { exact: true })
    .fill("social@example.test");
  await page
    .getByLabel("Tell me about your Italian")
    .fill("I would love to learn Italian for visiting my friends.");
  await page.getByLabel("I agree to my details").check();
  const saved = page.waitForRequest(
    (r) => r.url().endsWith("/api/inquiries") && r.method() === "POST",
  );
  await page.getByRole("button", { name: "Send my inquiry" }).click();
  expect((await saved).postDataJSON().campaign).toBe(campaign);
  await expect(page.getByRole("heading", { name: /Grazie/ })).toBeVisible();
  await page.goto("/login");
  await page
    .getByLabel("Email address", { exact: true })
    .fill("teacher@teachvero.local");
  await page
    .getByLabel("Password", { exact: true })
    .fill("TeachVero-demo-2026!");
  await page.getByRole("button", { name: "Come on in" }).click();
  await expect(page).toHaveURL(/admin/);
  await expect(
    page.locator(".request-card").filter({ hasText: campaign }),
  ).toContainText("social@example.test");
});

test("short contact form recovers from server failure without losing the message", async ({
  page,
}) => {
  await page.goto("/contact");
  await expect(page.getByRole("combobox")).toHaveCount(0);
  await page
    .getByLabel("Your name", { exact: true })
    .fill("Contact test learner");
  await page
    .getByLabel("Email address", { exact: true })
    .fill("contact@example.test");
  await page
    .getByLabel("Your message", { exact: true })
    .fill("Could we discuss a learning plan for travel?");
  await page.getByLabel("I agree to my details").check();
  await page.route("**/api/inquiries", (route) =>
    route.fulfill({
      status: 503,
      contentType: "application/json",
      body: JSON.stringify({ error: "Please try again shortly." }),
    }),
  );
  await page.getByRole("button", { name: "Send my inquiry" }).click();
  await expect(page.locator("main").getByRole("alert")).toHaveText(
    "Please try again shortly.",
  );
  await expect(page.getByLabel("Your message", { exact: true })).toHaveValue(
    "Could we discuss a learning plan for travel?",
  );
  await page.unroute("**/api/inquiries");
  await page.getByRole("button", { name: "Send my inquiry" }).click();
  await expect(page.getByRole("heading", { name: /Grazie/ })).toBeVisible();
});

test("learning filters, empty reset and article-specific feedback", async ({
  page,
}) => {
  await page.goto("/learn");
  await page.getByLabel("Find a little Italian").fill("zz-no-match");
  await expect(page.getByRole("status")).toHaveText("0 lessons to explore");
  await page.getByRole("button", { name: "Show all lessons" }).click();
  await expect(page.locator(".resource-card")).toHaveCount(3);
  await page.getByLabel("Find a little Italian").fill("coffee");
  await expect(page.locator(".resource-card")).toHaveCount(1);
  await page.locator(".resource-card").click();
  await page.getByRole("button", { name: "Un’acqua", exact: true }).click();
  await expect(page.getByRole("status")).toContainText("Esatto!");
});

test("measurement stays off without consent, persists choice and stops after withdrawal", async ({
  page,
}) => {
  await page.goto("/learn/your-first-conversation");
  await page.evaluate(() => {
    const observed: unknown[] = [];
    (window as unknown as { observed: unknown[] }).observed = observed;
    window.addEventListener("teachvero:event", (e) =>
      observed.push((e as CustomEvent).detail),
    );
  });
  await page.getByRole("button", { name: "Piacere!", exact: true }).click();
  expect(
    await page.evaluate(
      () => (window as unknown as { observed: unknown[] }).observed,
    ),
  ).toEqual([]);
  await page
    .getByRole("button", { name: "Allow optional measurement" })
    .click();
  await page.getByRole("button", { name: "Piacere!", exact: true }).click();
  expect(
    await page.evaluate(
      () => (window as unknown as { observed: unknown[] }).observed,
    ),
  ).toEqual([
    { event: "content_engaged", path: "/learn/your-first-conversation" },
  ]);
  await page.reload();
  await expect(
    page.getByRole("button", { name: "Disable optional measurement" }),
  ).toHaveAttribute("aria-pressed", "true");
  await page
    .getByRole("button", { name: "Disable optional measurement" })
    .click();
  expect(
    await page.evaluate(() => localStorage.getItem("teachvero.analytics")),
  ).toBe("denied");
  await page.evaluate(() => {
    (window as unknown as { observed: unknown[] }).observed = [];
    window.addEventListener("teachvero:event", (e) =>
      (window as unknown as { observed: unknown[] }).observed.push(
        (e as CustomEvent).detail,
      ),
    );
  });
  await page.getByRole("button", { name: "Piacere!", exact: true }).click();
  expect(
    await page.evaluate(
      () => (window as unknown as { observed: unknown[] }).observed,
    ),
  ).toEqual([]);
});

test("mobile booking stays close to the first screen and its shortcut can be dismissed", async ({
  page,
}) => {
  for (const width of [360, 390, 430]) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/book");
    const name = page.getByLabel("Your name", { exact: true });
    await expect(name).toBeEnabled();
    expect((await name.boundingBox())!.y).toBeLessThan(850);
    await page.goto("/");
    const dismiss = page.getByRole("button", {
      name: "Dismiss booking shortcut",
    });
    const box = await dismiss.boundingBox();
    expect(box!.width).toBeGreaterThanOrEqual(44);
    expect(box!.height).toBeGreaterThanOrEqual(44);
    await dismiss.click();
    await expect(page.locator(".mobile-cta")).toHaveCount(0);
    await page.getByRole("button", { name: "Open menu" }).click();
    await page
      .getByRole("navigation", { name: "Mobile navigation" })
      .getByRole("link")
      .first()
      .focus();
    await page.keyboard.press("Escape");
    await expect(page.getByRole("button", { name: "Open menu" })).toBeFocused();
    await expect(
      page.getByRole("navigation", { name: "Mobile navigation" }),
    ).toHaveCount(0);
  }
});
