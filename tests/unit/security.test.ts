import { describe, it, expect, vi, afterEach } from "vitest";
vi.mock("server-only", () => ({}));
import { clientKey, validOrigin, rateLimit } from "../../src/server/security";
afterEach(() => {
  vi.unstubAllEnvs();
  vi.useRealTimers();
});
describe("request trust boundaries", () => {
  it("does not let arbitrary forwarding headers bypass local limits", () => {
    vi.stubEnv("TRUST_PROXY_HEADERS", "false");
    expect(
      clientKey(new Headers({ "x-forwarded-for": "attacker-chosen" })),
    ).toBe("local");
  });
  it("uses bounded proxy identity only when explicitly enabled", () => {
    vi.stubEnv("TRUST_PROXY_HEADERS", "true");
    expect(clientKey({ "x-forwarded-for": "192.0.2.1, 10.0.0.1" })).toBe(
      "192.0.2.1",
    );
    expect(clientKey({ "x-forwarded-for": "x".repeat(1000) }).length).toBe(64);
  });
  it("requires the exact configured origin", () => {
    vi.stubEnv("NEXTAUTH_URL", "https://teachvero.example");
    expect(
      validOrigin(
        new Request("http://internal/api", {
          headers: { origin: "https://teachvero.example" },
        }),
      ),
    ).toBe(true);
    for (const origin of [
      "https://teachvero.example.evil.test",
      "null",
      "http://teachvero.example",
    ])
      expect(
        validOrigin(
          new Request("http://internal/api", { headers: { origin } }),
        ),
      ).toBe(false);
    expect(validOrigin(new Request("http://internal/api"))).toBe(false);
  });
  it("denies excess attempts and permits a new expired window", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-11-12T12:00:00Z"));
    const key = "unit-abuse-window";
    expect(rateLimit(key, 2)).toBe(true);
    expect(rateLimit(key, 2)).toBe(true);
    expect(rateLimit(key, 2)).toBe(false);
    vi.advanceTimersByTime(600001);
    expect(rateLimit(key, 2)).toBe(true);
  });
});
