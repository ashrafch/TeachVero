import { describe, it, expect } from "vitest";
import { readJsonObject } from "../../src/server/request-body";
const req = (body: string, headers: Record<string, string> = {}) =>
  new Request("http://localhost/api/inquiries", {
    method: "POST",
    headers: { "content-type": "application/json", ...headers },
    body,
  });
describe("bounded JSON requests", () => {
  it("reads a valid object", async () =>
    expect(await readJsonObject(req('{"name":"Alex"}'), 50)).toEqual({
      name: "Alex",
    }));
  it.each(["null", "[]", '"string"', "{bad", ""])(
    "rejects non-object/malformed input: %s",
    async (body) =>
      expect(readJsonObject(req(body), 50)).rejects.toMatchObject({
        status: 400,
      }),
  );
  it("rejects oversized actual UTF-8 bytes despite a small declared size", async () =>
    expect(
      readJsonObject(
        req('{"message":"' + "è".repeat(20) + '"}', { "content-length": "1" }),
        40,
      ),
    ).rejects.toMatchObject({ status: 413 }));
  it("rejects oversized declared length before consuming", async () =>
    expect(
      readJsonObject(req("{}", { "content-length": "100" }), 40),
    ).rejects.toMatchObject({ status: 413 }));
  it("rejects unsupported content type", async () =>
    expect(
      readJsonObject(req("{}", { "content-type": "text/plain" }), 40),
    ).rejects.toMatchObject({ status: 415 }));
});
