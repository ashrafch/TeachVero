import { readJsonObject, RequestBodyError } from "@/server/request-body";
import { NextResponse } from "next/server";
import { inquirySchema, leadSchema } from "@/lib/validation";
import { prisma } from "@/server/db";
import { rateLimit, validOrigin, clientKey } from "@/server/security";
export async function POST(req: Request) {
  if (!validOrigin(req))
    return NextResponse.json(
      { error: "Invalid request origin." },
      { status: 403 },
    );
  if (!rateLimit("inquiry:" + clientKey(req.headers)))
    return NextResponse.json(
      { error: "Too many requests. Please try again in ten minutes." },
      { status: 429 },
    );
  try {
    const raw = await readJsonObject(req, 12000);
    if (raw.kind === "lead") {
      const result = leadSchema.safeParse(raw);
      if (!result.success)
        return NextResponse.json(
          { error: "Check your name, email and consent." },
          { status: 400 },
        );
      const lead = await prisma.$transaction(async (tx) => {
        // Preserve teacher follow-up fields when someone requests the guide again.
        // Share the lock with the teacher writer to prevent lost updates.
        await tx.$executeRaw`SELECT pg_advisory_xact_lock(71643001)`;
        const existing = await tx.lead.findUnique({
          where: { email: result.data.email },
        });
        const previous = existing?.data as
          Record<string, string | boolean> | undefined;
        return tx.lead.upsert({
          where: { email: result.data.email },
          create: { email: result.data.email, data: result.data },
          update: { data: { ...previous, ...result.data } },
        });
      });
      return NextResponse.json(
        {
          id: lead.id,
          message:
            "Your request is saved. Your guide is ready below. No email has been sent.",
        },
        { status: 201 },
      );
    }
    const result = inquirySchema.safeParse(raw);
    if (!result.success)
      return NextResponse.json(
        { error: "Please check every required field." },
        { status: 400 },
      );
    const inquiry = await prisma.$transaction(
      async (tx) => {
        if (
          result.data.packageId &&
          !(await tx.package.findUnique({
            where: { id: result.data.packageId },
          }))
        )
          throw new RequestBodyError(
            "This package is no longer available. Refresh the page.",
            400,
          );
        return tx.bookingRequest.create({
          data: { email: result.data.email, data: result.data },
        });
      },
      { isolationLevel: "Serializable" },
    );
    return NextResponse.json(
      {
        id: inquiry.id,
        message:
          "Your inquiry is saved for teacher review. This is not a confirmed booking. No email has been sent.",
      },
      { status: 201 },
    );
  } catch (error) {
    if (error instanceof RequestBodyError)
      return NextResponse.json(
        { error: error.message },
        { status: error.status },
      );
    return NextResponse.json(
      { error: "We could not save your request. Please try again." },
      { status: 503 },
    );
  }
}
