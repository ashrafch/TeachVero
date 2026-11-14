import { test, expect } from "@playwright/test";
import { PrismaClient } from "@prisma/client";
import { loadEnvFile } from "node:process";
if (!process.env.DATABASE_URL) loadEnvFile();

test("repeat guide requests preserve teacher notes and keep them private", async ({
  page,
  request,
}) => {
  const token = Date.now();
  const email = `followup-${token}@example.test`;
  const headers = { origin: "http://localhost:3000" };
  const data = {
    kind: "lead",
    name: "Follow-up learner",
    email,
    consent: true,
    marketing: false,
    website: "",
  };
  // Seed only this test's original request; public creation is covered by flows.spec.ts.
  // One public replay keeps the full suite within the real local abuse limit.
  const db = new PrismaClient();
  const { id } = await db.lead.create({ data: { email, data } });
  await db.$disconnect();
  await page.goto("/login");
  await page
    .getByLabel("Email address", { exact: true })
    .fill("teacher@teachvero.local");
  await page
    .getByLabel("Password", { exact: true })
    .fill("TeachVero-demo-2026!");
  await page.getByRole("button", { name: "Come on in" }).click();
  await expect(page).toHaveURL(/admin/);
  const notes = "Private follow-up " + token;
  const saved = await page.request.post("/api/teaching", {
    headers,
    data: { kind: "lead", data: { id, status: "FOLLOW_UP", notes } },
  });
  expect(saved.status()).toBe(200);
  const replay = await request.post("/api/inquiries", {
    headers,
    data: {
      ...data,
      name: "Follow-up updated",
      notes: "attempted overwrite",
      followUpStatus: "CLOSED",
    },
  });
  expect(replay.status()).toBe(201);
  expect(await replay.text()).not.toContain(notes);
  await page.goto("/admin?view=leads");
  const row = page.locator(".request-card").filter({ hasText: email });
  await expect(row.getByLabel("Private follow-up notes")).toHaveValue(notes);
  await expect(
    row.getByRole("combobox", { name: "Follow-up status" }),
  ).toHaveValue("FOLLOW_UP");
});
