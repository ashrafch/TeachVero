import { defineConfig } from "@playwright/test";
export default defineConfig({
  testDir: "tests/e2e",
  fullyParallel: false,
  workers: 1,
  timeout: 60000,
  expect: { timeout: 12000 },
  use: {
    baseURL: process.env.TEST_BASE_URL || "http://localhost:3000",
    trace: "retain-on-failure",
  },
  reporter: [["list"], ["html", { open: "never" }]],
  webServer: process.env.TEST_BASE_URL
    ? undefined
    : {
        command: "npm run dev",
        url: "http://localhost:3000",
        reuseExistingServer: !process.env.CI,
        timeout: 120000,
      },
});
