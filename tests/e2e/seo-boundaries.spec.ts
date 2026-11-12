import { test, expect } from "@playwright/test";
test("preview metadata, canonical routes and sitemap boundaries", async ({
  page,
  request,
}) => {
  const titles = new Set<string>();
  const descriptions = new Set<string>();
  for (const route of [
    "/",
    "/about",
    "/lessons",
    "/pricing",
    "/book",
    "/learn",
    "/contact",
    "/ciao",
  ]) {
    await page.goto(route);
    const title = await page.title();
    expect(titles.has(title), route + " title").toBe(false);
    titles.add(title);
    const description = await page
      .locator('meta[name="description"]')
      .getAttribute("content");
    expect(description!.length).toBeGreaterThan(40);
    expect(descriptions.has(description!), route + " description").toBe(false);
    descriptions.add(description!);
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute(
      "content",
      /noindex/,
    );
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
      "href",
      "http://localhost:3000" + (route === "/" ? "/" : route),
    );
    expect(await page.locator("h1").count()).toBe(1);
  }
  const robot = await request.get("/robots.txt");
  expect(await robot.text()).toContain("Disallow: /");
  const sitemap = await request.get("/sitemap.xml");
  expect(sitemap.ok()).toBe(true);
  expect(await sitemap.text()).not.toMatch(
    /\/admin|\/dashboard|\/login|\/packages/,
  );
  const legacy = await request.get("/packages", { maxRedirects: 0 });
  expect(legacy.status()).toBe(307);
  expect(legacy.headers().location).toBe("/pricing");
  await page.goto("/learn/a-missing-article");
  await expect(page.locator("main")).toContainText("find");
});
test("malformed and oversized inquiry requests fail without storing a request", async ({
  request,
}) => {
  const headers = {
    origin: "http://localhost:3000",
    "content-type": "application/json",
  };
  expect(
    (await request.post("/api/inquiries", { headers, data: "null" })).status(),
  ).toBe(400);
  expect(
    (
      await request.post("/api/inquiries", {
        headers,
        data: JSON.stringify({ message: "x".repeat(13000) }),
      })
    ).status(),
  ).toBe(413);
});
