import "server-only";
const hits = new Map<string, { count: number; expires: number }>();
export function rateLimit(key: string, limit = 8) {
  const now = Date.now();
  for (const [k, v] of hits) if (v.expires < now) hits.delete(k);
  if (!hits.has(key) && hits.size >= 10000) return false;
  const item = hits.get(key) || { count: 0, expires: now + 600000 };
  item.count++;
  hits.set(key, item);
  return item.count <= limit;
}
/** Enable only behind a proxy that replaces, rather than appends untrusted headers. */
export function clientKey(headers: Headers | Record<string, unknown>) {
  if (process.env.TRUST_PROXY_HEADERS !== "true") return "local";
  const value =
    headers instanceof Headers
      ? headers.get("x-forwarded-for")
      : headers["x-forwarded-for"];
  return String(value || "unknown")
    .split(",")[0]
    .trim()
    .slice(0, 64);
}
export function validOrigin(request: Request) {
  const origin = request.headers.get("origin");
  const trusted = process.env.NEXTAUTH_URL || new URL(request.url).origin;
  try {
    return !!origin && origin === new URL(trusted).origin;
  } catch {
    return false;
  }
}
