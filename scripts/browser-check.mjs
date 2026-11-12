import { chromium } from "@playwright/test";
const b = await chromium.launch();
try {
  const p = await b.newPage({ reducedMotion: "reduce" });
  p.on("pageerror", (e) => console.log("ERROR", e.message));
  p.on("console", (m) => {
    if (m.type() === "error") console.log("CONSOLE", m.text());
  });
  await p.setViewportSize({ width: 1440, height: 1000 });
  await p.goto("http://localhost:3000/");
  await p.setViewportSize({ width: 390, height: 900 });
  await p.goto("http://localhost:3000/contact");
  await p.getByLabel("Your name", { exact: true }).fill("Check");
  console.log("BUTTONS", await p.getByRole("button").allTextContents());
  const issue = p.getByRole("button", { name: /issue/i }).first();
  if (await issue.count()) {
    await issue.click();
    console.log(
      "ISSUE PANEL",
      await p
        .locator("nextjs-portal")
        .evaluate((el) =>
          Array.from(el.shadowRoot?.children || [])
            .filter((e) => e.tagName !== "STYLE")
            .map((e) => e.textContent)
            .join("\n"),
        )
        .catch(() => "No panel"),
    );
  }
} finally {
  await b.close();
}
