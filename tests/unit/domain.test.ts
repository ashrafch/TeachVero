import { describe, it, expect } from "vitest";
import {
  inquirySchema,
  leadSchema,
  packageSchema,
  remainingCredits,
  profileSchema,
} from "../../src/lib/validation";
import { hashPassword, verifyPassword } from "../../src/server/password";
const valid = {
  name: "Alex Learner",
  email: "ALEX@example.com",
  goal: "beginner",
  message: "I would like to learn Italian.",
  timezone: "Europe/Rome",
  consent: true,
};
describe("inquiry boundaries", () => {
  it("normalizes email and never opts into marketing by default", () => {
    const d = inquirySchema.parse(valid);
    expect(d.email).toBe("alex@example.com");
    expect(d.marketing).toBe(false);
  });
  it.each([
    { ...valid, consent: false },
    { ...valid, message: "short" },
    { ...valid, email: "bad" },
    { ...valid, website: "spam" },
    { ...valid, goal: "admin" },
    { ...valid, message: "x".repeat(2001) },
  ])("rejects invalid submission", (data) =>
    expect(inquirySchema.safeParse(data).success).toBe(false),
  );
  it("requires guide consent separately", () =>
    expect(
      leadSchema.safeParse({ name: "Alex", email: "a@b.com", consent: false })
        .success,
    ).toBe(false));
  it("rejects invalid package units and unsafe IDs", () => {
    const p = {
      id: "valid",
      name: "Test",
      tag: "",
      description: "A useful package description",
      lessons: 4,
      duration: 50,
      features: ["Practice"],
    };
    expect(packageSchema.safeParse(p).success).toBe(true);
    expect(packageSchema.safeParse({ ...p, lessons: -1 }).success).toBe(false);
    expect(packageSchema.safeParse({ ...p, id: "../unsafe" }).success).toBe(
      false,
    );
  });
  it("rejects fabricated progress keys", () =>
    expect(
      profileSchema.safeParse({
        name: "Alex",
        timezone: "Rome",
        goal: "",
        progress: ["paid"],
      }).success,
    ).toBe(false));
});
describe("passwords and credits", () => {
  it("uses unique salts and rejects wrong passwords", () => {
    const a = hashPassword("long-password");
    expect(a).not.toBe(hashPassword("long-password"));
    expect(verifyPassword("long-password", a)).toBe(true);
    expect(verifyPassword("wrong", a)).toBe(false);
    expect(verifyPassword("wrong", "bad")).toBe(false);
  });
  it("cannot overspend or fractionalize lesson credits", () => {
    expect(remainingCredits(8, 3)).toBe(5);
    for (const [a, b] of [
      [1, 2],
      [-1, 0],
      [2, 0.5],
    ])
      expect(() => remainingCredits(a, b)).toThrow();
  });
});
