import { test, expect, type Page } from "@playwright/test";
async function login(page: Page, email: string, password: string) {
  await page.goto("/login");
  await page.getByLabel("Email address", { exact: true }).fill(email);
  await page.getByLabel("Password", { exact: true }).fill(password);
  await page.getByRole("button", { name: "Come on in" }).click();
  await expect(page).toHaveURL(
    email === "teacher@teachvero.local" ? /admin/ : /dashboard/,
  );
}

test("teacher CRM, concurrent reservations, cancellation and student isolation", async ({
  page,
  browser,
  request,
}) => {
  test.setTimeout(120000);
  expect(
    (
      await request.post("/api/teaching", {
        headers: { origin: "http://localhost:3000" },
        data: {},
      })
    ).status(),
  ).toBe(401);
  await login(page, "teacher@teachvero.local", "TeachVero-demo-2026!");
  const token = Date.now(),
    name = "Workflow learner " + token,
    email = `workflow-${token}@example.test`;
  await page.getByRole("link", { name: "Students", exact: true }).click();
  const create = page.locator("details").filter({
    has: page.locator("summary").getByText("Create student", { exact: true }),
  });
  await create.locator("summary").click();
  await create.getByLabel("Student name", { exact: true }).fill(name);
  await create.getByLabel("Student email", { exact: true }).fill(email);
  await create
    .getByLabel("Initial password", { exact: true })
    .fill("Workflow-demo-2026!");
  await create
    .getByLabel("Private student notes", { exact: true })
    .fill("CONFIDENTIAL-" + token);
  await create
    .getByRole("button", { name: "Create student", exact: true })
    .click();
  await expect(create.getByRole("status")).toHaveText("Saved.");
  await page.reload();
  await expect(
    page.locator("#students summary").filter({ hasText: email }),
  ).toBeVisible();
  await page
    .getByRole("link", { name: "Package credits", exact: true })
    .click();
  const allocation = page.locator("#allocations details").first();
  await allocation.locator("summary").click();
  const studentSelect = allocation.getByRole("combobox", {
    name: "Student",
    exact: true,
  });
  await studentSelect.selectOption({ label: `${name} — ${email}` });
  const userId = await studentSelect.inputValue();
  const packageId = "workflow-package-" + token;
  const savedPackage = await page.request.post("/api/manage", {
    headers: { origin: "http://localhost:3000" },
    data: {
      kind: "package",
      data: {
        id: packageId,
        name: "Workflow single credit",
        description: "One lesson credit for workflow verification.",
        tag: "Test only",
        lessons: 1,
        duration: 50,
        features: ["Test allocation"],
      },
    },
  });
  expect(savedPackage.ok()).toBe(true);
  const reference = crypto.randomUUID();
  const grant = { kind: "allocate", data: { userId, packageId, reference } };
  const post = (data: unknown) =>
    page.request.post("/api/teaching", {
      headers: { origin: "http://localhost:3000" },
      data,
    });
  const allocated = await post(grant);
  expect(allocated.ok()).toBe(true);
  const { id: enrollmentId } = await allocated.json();
  expect((await (await post(grant)).json()).id).toBe(enrollmentId);
  const startsAt = new Date(
    Date.now() + 365 * 86400000 + (token % 10000) * 3600000,
  ).toISOString();
  const studentSummary = "Practise introductions " + token;
  const lesson = {
    enrollmentId,
    startsAt,
    duration: 50,
    studentSummary,
    teacherNotes: "PRIVATE-LESSON-" + token,
  };
  const responses = await Promise.all([
    post({
      kind: "schedule",
      data: { ...lesson, reference: crypto.randomUUID() },
    }),
    post({
      kind: "schedule",
      data: {
        ...lesson,
        startsAt: new Date(
          new Date(startsAt).getTime() + 7200000,
        ).toISOString(),
        reference: crypto.randomUUID(),
      },
    }),
  ]);
  expect(responses.map((r) => r.status()).sort()).toEqual([200, 400]);
  const winner = responses.find((r) => r.ok())!;
  const { id: lessonId } = await winner.json();
  await page.reload();
  await expect(
    page.locator("#allocations .request-card").filter({ hasText: name }),
  ).toContainText("0 of 1 credits available");
  const studentContext = await browser.newContext({
    baseURL: "http://localhost:3000",
  });
  const student = await studentContext.newPage();
  await login(student, email, "Workflow-demo-2026!");
  await expect(
    student.getByText(studentSummary, { exact: true }),
  ).toBeVisible();
  expect(await student.content()).not.toContain("CONFIDENTIAL-" + token);
  expect(await student.content()).not.toContain("PRIVATE-LESSON-" + token);
  expect(
    (
      await student.request.post("/api/teaching", {
        headers: { origin: "http://localhost:3000" },
        data: grant,
      })
    ).status(),
  ).toBe(403);
  const otherContext = await browser.newContext({
    baseURL: "http://localhost:3000",
  });
  const otherStudent = await otherContext.newPage();
  await login(otherStudent, "student@teachvero.local", "LearnItalian-2026!");
  expect(await otherStudent.content()).not.toContain(studentSummary);
  expect(await otherStudent.content()).not.toContain(email);
  await otherContext.close();
  await student.goto("/admin");
  await expect(student).toHaveURL(/dashboard/);
  await login(page, "teacher@teachvero.local", "TeachVero-demo-2026!");
  const cancel = { kind: "lesson", data: { id: lessonId, action: "CANCEL" } };
  expect((await post(cancel)).ok()).toBe(true);
  expect((await post(cancel)).ok()).toBe(true);
  await student.goto("/dashboard?view=credits");
  await expect(
    student.getByText("1 of 1 credits unreserved", { exact: false }),
  ).toBeVisible();
  await student.getByRole("link", { name: "My lessons", exact: true }).click();
  await expect(student.getByText("CANCELLED", { exact: true })).toBeVisible();
  await student.setViewportSize({ width: 390, height: 900 });
  await student.screenshot({
    path: "docs/screenshots/dashboard-390.png",
    fullPage: true,
    caret: "initial",
  });
  await page.request.post("/api/manage", {
    headers: { origin: "http://localhost:3000" },
    data: {
      kind: "package",
      remove: true,
      data: {
        id: packageId,
        name: "Workflow single credit",
        description: "One lesson credit for workflow verification.",
        tag: "Test only",
        lessons: 1,
        duration: 50,
        features: ["Test allocation"],
      },
    },
  });
  await studentContext.close();
});

test("teacher allocates, schedules and cancels through mobile forms", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 900 });
  await login(page, "teacher@teachvero.local", "TeachVero-demo-2026!");
  const token = Date.now(),
    name = "Mobile learner " + token,
    email = `mobile-${token}@example.test`;
  const created = await page.request.post("/api/teaching", {
    headers: { origin: "http://localhost:3000" },
    data: {
      kind: "student",
      data: {
        name,
        email,
        password: "Mobile-demo-2026!",
        level: "A1",
        status: "ACTIVE",
        preferences: "Conversation",
        notes: "Example only",
      },
    },
  });
  expect(created.ok()).toBe(true);
  await page.reload();
  await page
    .getByRole("link", { name: "Package credits", exact: true })
    .click();
  const allocation = page.locator("#allocations > details").first();
  await allocation.locator("summary").click();
  await allocation
    .getByRole("combobox", { name: "Student", exact: true })
    .selectOption({ label: `${name} — ${email}` });
  await allocation
    .getByRole("combobox", { name: "Package", exact: true })
    .selectOption("first-steps");
  await allocation.getByRole("button", { name: "Allocate package" }).click();
  await expect(allocation.getByRole("status")).toHaveText("Saved.");
  await page.getByRole("link", { name: "Lessons", exact: true }).click();
  const schedule = page.locator("#lessons > details").first();
  await schedule.locator("summary").click();
  await schedule
    .getByRole("combobox", { name: "Credit allocation" })
    .selectOption({ label: `${name} — First steps (4 left)` });
  const day = new Date(
    Date.now() + 1500 * 86400000 + (token % 1000) * 86400000,
  );
  await schedule
    .getByLabel("Lesson time", { exact: true })
    .fill(day.toISOString().slice(0, 16));
  await schedule
    .getByLabel("Student lesson summary")
    .fill("Your first conversation practice");
  await schedule
    .getByRole("button", { name: "Schedule lesson", exact: true })
    .click();
  await expect(schedule.getByRole("status")).toHaveText("Saved.");
  await page.reload();
  const record = page
    .locator("#lessons > details")
    .filter({ has: page.locator("summary").filter({ hasText: name }) });
  await record.locator("summary").click();
  await record
    .getByRole("combobox", { name: "Lesson action" })
    .selectOption("CANCEL");
  await record.getByRole("button", { name: "Update lesson" }).click();
  await expect(record.getByRole("status")).toHaveText("Saved.");
  await expect(record.locator("summary")).toContainText("CANCELLED");
  await page
    .getByRole("link", { name: "Package credits", exact: true })
    .click();
  await expect(
    page.locator("#allocations .request-card").filter({ hasText: name }),
  ).toContainText("4 of 4 credits available");
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
  await page.getByRole("link", { name: "Students", exact: true }).click();
  await page.locator("#students > details").first().locator("summary").click();
  await page
    .locator("#students")
    .screenshot({ path: "docs/screenshots/admin-students-390.png" });
});

test("new public entry points, lesson detail and narrow layouts", async ({
  page,
}) => {
  test.setTimeout(180000);
  for (const width of [320, 360, 390, 430, 768, 1024, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    for (const route of [
      "/faq",
      "/blog",
      "/lessons/beginning",
      "/free-learning",
      "/privacy",
      "/cookies",
      "/terms",
    ]) {
      await page.goto(route);
      await expect(page.locator("h1")).toBeVisible();
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth,
        ),
        `${route} at ${width}`,
      ).toBe(true);
    }
  }
  await page.goto("/lessons/missing-track");
  await expect(
    page.getByRole("heading", { name: /lost|find|page/i }).first(),
  ).toBeVisible();
});

test("core public and protected screens remain usable at 320px", async ({
  page,
}) => {
  test.setTimeout(90000);
  await page.setViewportSize({ width: 320, height: 800 });
  for (const route of [
    "/",
    "/pricing",
    "/book",
    "/contact",
    "/learn",
    "/login",
  ]) {
    await page.goto(route);
    await expect(page.locator("h1")).toBeVisible();
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
      route,
    ).toBe(true);
  }
  await login(page, "student@teachvero.local", "LearnItalian-2026!");
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
  await page.getByRole("button", { name: "Sign out", exact: true }).click();
  await login(page, "teacher@teachvero.local", "TeachVero-demo-2026!");
  await page.getByRole("link", { name: "Students", exact: true }).click();
  await page.locator("#students > details").first().locator("summary").click();
  await expect(
    page.getByLabel("Initial password", { exact: true }),
  ).toBeVisible();
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
});
