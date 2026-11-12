import { chromium } from "@playwright/test";
import { mkdir } from "node:fs/promises";
await mkdir("docs/screenshots", { recursive: true });
const browser = await chromium.launch();
try {
  const page = await browser.newPage({ reducedMotion: "reduce" });
  const base = process.env.TEST_BASE_URL || "http://localhost:3000";
  for (const width of [390, 1440]) {
    await page.setViewportSize({ width, height: 1000 });
    for (const route of [
      "/",
      "/about",
      "/pricing",
      "/book",
      "/learn",
      "/ciao",
      "/contact",
    ]) {
      await page.goto(base + route);
      await page.evaluate(() => document.fonts.ready.then(() => {}));
      if (route === "/book" || route === "/contact")
        await page.getByLabel("Your name", { exact: true }).fill("");
      await page.screenshot({
        path:
          "docs/screenshots/" +
          (route.slice(1) || "home") +
          "-" +
          width +
          ".png",
        fullPage: true,
      });
    }
  }
  console.log(
    "Saved seven public pages at 390 and 1440 pixels in docs/screenshots.",
  );
} finally {
  await browser.close();
}
