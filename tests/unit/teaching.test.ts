import { describe, it, expect } from "vitest";
import {
  assertBookable,
  lessonEnd,
  teachingCommand,
} from "../../src/lib/teaching";
describe("teaching rules", () => {
  const now = new Date("2026-11-13T12:00:00Z"),
    future = new Date("2026-11-14T12:00:00Z");
  it("rejects exhausted, expired and past reservations", () => {
    expect(() => assertBookable(0, null, future, now)).toThrow();
    expect(() => assertBookable(1, now, future, now)).toThrow();
    expect(() => assertBookable(1, null, now, now)).toThrow();
    expect(() => assertBookable(1, future, future, now)).toThrow();
    expect(() => assertBookable(1, null, future, now)).not.toThrow();
  });
  it("computes end times across midnight", () =>
    expect(lessonEnd(new Date("2026-11-13T23:45:00Z"), 50).toISOString()).toBe(
      "2026-11-14T00:35:00.000Z",
    ));
  it("rejects unbounded durations and forged command types", () => {
    expect(teachingCommand.safeParse({ kind: "paid", data: {} }).success).toBe(
      false,
    );
    expect(
      teachingCommand.safeParse({
        kind: "schedule",
        data: {
          enrollmentId: "x",
          reference: "0",
          startsAt: future.toISOString(),
          duration: -1,
          studentSummary: "",
          teacherNotes: "",
        },
      }).success,
    ).toBe(false);
  });
});
