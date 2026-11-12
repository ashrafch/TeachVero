export class RequestBodyError extends Error {
  constructor(
    message: string,
    public readonly status: 400 | 413 | 415,
  ) {
    super(message);
  }
}
/** Limit bytes while streaming, before parsing or allocating the full request. */
export async function readJsonObject(
  request: Request,
  maxBytes: number,
): Promise<Record<string, unknown>> {
  if (
    request.headers.get("content-type")?.split(";")[0].trim() !==
    "application/json"
  )
    throw new RequestBodyError("Send a JSON request.", 415);
  const declared = Number(request.headers.get("content-length"));
  if (Number.isFinite(declared) && declared > maxBytes)
    throw new RequestBodyError("Request too large.", 413);
  const reader = request.body?.getReader();
  if (!reader) throw new RequestBodyError("A JSON object is required.", 400);
  const decoder = new TextDecoder("utf-8", { fatal: true });
  let text = "";
  let received = 0;
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      received += value.byteLength;
      if (received > maxBytes) {
        await reader.cancel();
        throw new RequestBodyError("Request too large.", 413);
      }
      text += decoder.decode(value, { stream: true });
    }
    text += decoder.decode();
    const parsed: unknown = JSON.parse(text);
    if (parsed === null || typeof parsed !== "object" || Array.isArray(parsed))
      throw new RequestBodyError("A JSON object is required.", 400);
    return parsed as Record<string, unknown>;
  } catch (error) {
    if (error instanceof RequestBodyError) throw error;
    throw new RequestBodyError(
      "Invalid JSON. Check your request and try again.",
      400,
    );
  } finally {
    reader.releaseLock();
  }
}
