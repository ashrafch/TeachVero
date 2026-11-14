import { NextResponse } from "next/server";
import { ZodError } from "zod";
import { currentUser } from "@/server/auth";
import { validOrigin, rateLimit } from "@/server/security";
import { readJsonObject, RequestBodyError } from "@/server/request-body";
import { manageTeaching } from "@/server/teaching";
import { TeachingError } from "@/lib/teaching";

export async function POST(request: Request) {
  if (!validOrigin(request))
    return NextResponse.json({ error: "Invalid origin" }, { status: 403 });
  const actor = await currentUser();
  if (!actor)
    return NextResponse.json({ error: "Sign in required" }, { status: 401 });
  if (actor.role !== "ADMIN")
    return NextResponse.json(
      { error: "Teacher access required" },
      { status: 403 },
    );
  if (!rateLimit("teaching:" + actor.id, 200))
    return NextResponse.json(
      { error: "Too many changes. Try again later." },
      { status: 429 },
    );
  try {
    return NextResponse.json(
      await manageTeaching(actor.id, await readJsonObject(request, 16000)),
    );
  } catch (error) {
    if (error instanceof RequestBodyError)
      return NextResponse.json(
        { error: error.message },
        { status: error.status },
      );
    const message =
      error instanceof TeachingError
        ? error.message
        : error instanceof ZodError
          ? "Check the fields and date format."
          : "Could not save. Refresh and try again.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
