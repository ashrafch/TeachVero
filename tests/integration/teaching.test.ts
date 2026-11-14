import { afterAll, beforeAll, describe, expect, it, vi } from "vitest";
import { randomUUID } from "node:crypto";
vi.mock("server-only", () => ({}));
import { prisma } from "../../src/server/db";
import { manageTeaching } from "../../src/server/teaching";

const token = randomUUID();
const packageId = "integration-" + token;
let userId = "";
const enrollmentIds: string[] = [];
const targetIds: string[] = [];
const actorId = "integration-" + token;
const future = new Date(
  Date.now() + 1000 * 86400000 + Math.random() * 200 * 86400000,
);

beforeAll(async () => {
  const user = await prisma.user.create({
    data: {
      name: "Integration fixture",
      email: token + "@example.test",
      passwordHash: "not-a-login-hash",
      role: "STUDENT",
    },
  });
  userId = user.id;
  await prisma.package.create({
    data: {
      id: packageId,
      data: {
        id: packageId,
        name: "Integration allocation",
        description: "Isolated local integration fixture.",
        tag: "Test only",
        lessons: 1,
        duration: 50,
        features: ["Test"],
      },
    },
  });
});
afterAll(async () => {
  // Delete only fixtures created by this test, in foreign-key order.
  await prisma.$transaction(async (tx) => {
    await tx.auditLog.deleteMany({ where: { actorId } });
    await tx.creditEntry.deleteMany({
      where: { enrollmentId: { in: enrollmentIds } },
    });
    await tx.lesson.deleteMany({
      where: { enrollmentId: { in: enrollmentIds } },
    });
    await tx.enrollment.deleteMany({ where: { id: { in: enrollmentIds } } });
    if (userId) await tx.user.delete({ where: { id: userId } });
    await tx.package.deleteMany({ where: { id: packageId } });
  });
  await prisma.$disconnect();
});
async function allocation(expiresAt?: string) {
  const result = await manageTeaching(actorId, {
    kind: "allocate",
    data: { userId, packageId, reference: randomUUID(), expiresAt },
  });
  enrollmentIds.push(result.id);
  return result.id;
}
async function schedule(
  enrollmentId: string,
  startsAt: Date,
  reference = randomUUID(),
) {
  const result = await manageTeaching(actorId, {
    kind: "schedule",
    data: {
      enrollmentId,
      startsAt: startsAt.toISOString(),
      duration: 50,
      reference,
      studentSummary: "Visible",
      teacherNotes: "Private",
    },
  });
  targetIds.push(result.id);
  return result;
}

describe("PostgreSQL teaching lifecycle", () => {
  it("serializes competing final-credit reservations and returns a cancellation once", async () => {
    const enrollmentId = await allocation();
    const outcomes = await Promise.allSettled([
      schedule(enrollmentId, future),
      schedule(enrollmentId, new Date(+future + 7200000)),
    ]);
    expect(outcomes.filter((o) => o.status === "fulfilled")).toHaveLength(1);
    expect(outcomes.filter((o) => o.status === "rejected")).toHaveLength(1);
    const winner = outcomes.find(
      (o) => o.status === "fulfilled",
    ) as PromiseFulfilledResult<{ id: string }>;
    const cancel = {
      kind: "lesson",
      data: { id: winner.value.id, action: "CANCEL" },
    };
    await Promise.all([
      manageTeaching(actorId, cancel),
      manageTeaching(actorId, cancel),
    ]);
    expect(
      (
        await prisma.enrollment.findUniqueOrThrow({
          where: { id: enrollmentId },
        })
      ).remaining,
    ).toBe(1);
    const entries = await prisma.creditEntry.findMany({
      where: { enrollmentId },
    });
    expect(entries.map((e) => e.delta).sort()).toEqual([-1, 1, 1]);
  });
  it("rejects overlapping lessons across allocations and safely reschedules", async () => {
    const first = await allocation(),
      second = await allocation();
    const start = new Date(+future + 3 * 86400000);
    const booked = await schedule(first, start);
    await expect(
      schedule(second, new Date(+start + 10 * 60000)),
    ).rejects.toThrow("overlaps");
    expect(
      (await prisma.enrollment.findUniqueOrThrow({ where: { id: second } }))
        .remaining,
    ).toBe(1);
    const adjacent = await schedule(second, new Date(+start + 50 * 60000));
    await expect(
      manageTeaching(actorId, {
        kind: "lesson",
        data: {
          id: adjacent.id,
          action: "RESCHEDULE",
          startsAt: start.toISOString(),
        },
      }),
    ).rejects.toThrow("overlaps");
    await manageTeaching(actorId, {
      kind: "lesson",
      data: {
        id: booked.id,
        action: "RESCHEDULE",
        startsAt: new Date(+start + 86400000).toISOString(),
      },
    });
    expect(
      (await prisma.enrollment.findUniqueOrThrow({ where: { id: first } }))
        .remaining,
    ).toBe(0);
  });
  it("keeps completed lessons consumed and prevents expiry or early completion", async () => {
    const enrollmentId = await allocation(
      new Date(Date.now() + 86400000).toISOString(),
    );
    await expect(schedule(enrollmentId, future)).rejects.toThrow("expires");
    const active = await allocation();
    const booked = await schedule(active, new Date(+future + 10 * 86400000));
    const complete = {
      kind: "lesson",
      data: { id: booked.id, action: "COMPLETE" },
    };
    await expect(manageTeaching(actorId, complete)).rejects.toThrow(
      "scheduled end",
    );
    // Move this isolated fixture into the past to exercise completion without waiting.
    await prisma.lesson.update({
      where: { id: booked.id },
      data: {
        startsAt: new Date(Date.now() - 7200000),
        endsAt: new Date(Date.now() - 3600000),
      },
    });
    await manageTeaching(actorId, complete);
    await manageTeaching(actorId, complete);
    await expect(
      manageTeaching(actorId, {
        kind: "lesson",
        data: { id: booked.id, action: "CANCEL" },
      }),
    ).rejects.toThrow("already closed");
    expect(
      (await prisma.enrollment.findUniqueOrThrow({ where: { id: active } }))
        .remaining,
    ).toBe(0);
    expect(
      await prisma.creditEntry.count({ where: { enrollmentId: active } }),
    ).toBe(2);
  });
});
