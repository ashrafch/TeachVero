import type { FullConfig } from "@playwright/test";
/** Compile development routes before measuring interactive browser flows. No mutations. */
export default async function warmup(config: FullConfig) {
  const base = String(
    config.projects[0].use.baseURL || "http://localhost:3000",
  );
  for (const route of [
    "/",
    "/pricing",
    "/book",
    "/learn",
    "/learn/your-first-conversation",
    "/login",
    "/admin",
    "/dashboard",
    "/api/auth/providers",
    "/api/auth/csrf",
  ]) {
    const response = await fetch(base + route, {
      signal: AbortSignal.timeout(60000),
    });
    if (!response.ok)
      throw new Error("Warmup failed: " + route + " (" + response.status + ")");
    await response.arrayBuffer();
  }
  for (const route of ["/api/manage", "/api/inquiries"]) {
    const response = await fetch(base + route, {
      method: "OPTIONS",
      signal: AbortSignal.timeout(60000),
    });
    if (response.status >= 500) throw new Error("API warmup failed: " + route);
    await response.arrayBuffer();
  }
}
