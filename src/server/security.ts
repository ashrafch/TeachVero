import "server-only";
const hits = new Map<string, { count: number; expires: number }>();
export function rateLimit(key: string, limit = 8) {
  const now = Date.now();
  for (const [k, v] of hits) if (v.expires < now) hits.delete(k);
  const item = hits.get(key) || { count: 0, expires: now + 600000 };
  item.count++;
  hits.set(key, item);
  return item.count <= limit;
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
