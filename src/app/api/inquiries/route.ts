import { NextResponse } from "next/server";
import { inquirySchema, leadSchema } from "@/lib/validation";
import { prisma } from "@/server/db";
import { rateLimit, validOrigin } from "@/server/security";
export async function POST(req: Request) {
  if (!validOrigin(req))
    return NextResponse.json(
      { error: "Invalid request origin." },
      { status: 403 },
    );
  if (!rateLimit("inquiry:" + (req.headers.get("x-forwarded-for") || "local")))
    return NextResponse.json(
      { error: "Too many requests. Please try again in ten minutes." },
      { status: 429 },
    );
  try {
    const body = await req.text();
    if (body.length > 12000)
      return NextResponse.json(
        { error: "Request too large." },
        { status: 413 },
      );
    const raw = JSON.parse(body);
    if (raw.kind === "lead") {
      const result = leadSchema.safeParse(raw);
      if (!result.success)
        return NextResponse.json(
          { error: "Check your name, email and consent." },
          { status: 400 },
        );
      const lead = await prisma.lead.upsert({
        where: { email: result.data.email },
        create: { email: result.data.email, data: result.data },
        update: { data: result.data },
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
    if (
      result.data.packageId &&
      !(await prisma.package.findUnique({
        where: { id: result.data.packageId },
      }))
    )
      return NextResponse.json(
        { error: "This package is no longer available. Refresh the page." },
        { status: 400 },
      );
    const inquiry = await prisma.bookingRequest.create({
      data: { email: result.data.email, data: result.data },
    });
    return NextResponse.json(
      {
        id: inquiry.id,
        message:
          "Your inquiry is saved for teacher review. This is not a confirmed booking. No email has been sent.",
      },
      { status: 201 },
    );
  } catch {
    return NextResponse.json(
      { error: "We could not save your request. Please try again." },
      { status: 503 },
    );
  }
}
