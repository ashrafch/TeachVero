import { readJsonObject, RequestBodyError } from "@/server/request-body";
import { NextResponse } from "next/server";
import { currentUser } from "@/server/auth";
import { prisma } from "@/server/db";
import { validOrigin } from "@/server/security";
import { packageSchema, resourceSchema, profileSchema } from "@/lib/validation";
import { z } from "zod";
export async function POST(req: Request) {
  if (!validOrigin(req))
    return NextResponse.json({ error: "Invalid origin" }, { status: 403 });
  const user = await currentUser();
  if (!user)
    return NextResponse.json({ error: "Sign in required" }, { status: 401 });
  try {
    const body = z
      .object({
        kind: z.enum(["profile", "package", "resource", "status"]),
        remove: z.boolean().optional(),
        data: z.record(z.string(), z.unknown()),
      })
      .parse(await readJsonObject(req, 30000));
    if (body.kind === "profile") {
      const data = profileSchema.parse(body.data);
      await prisma.user.update({
        where: { id: user.id },
        data: { name: data.name, profile: data },
      });
      return NextResponse.json({ ok: true });
    }
    if (user.role !== "ADMIN")
      return NextResponse.json(
        { error: "Teacher access required" },
        { status: 403 },
      );
    await prisma.$transaction(
      async (tx) => {
        if (body.kind === "package") {
          const data = packageSchema.parse(body.data);
          if (body.remove) {
            if (
              await tx.bookingRequest.count({
                where: { data: { path: ["packageId"], equals: data.id } },
              })
            )
              throw new Error("Package has inquiries; edit it instead.");
            await tx.package.delete({ where: { id: data.id } });
          } else
            await tx.package.upsert({
              where: { id: data.id },
              create: { id: data.id, data },
              update: { data },
            });
        } else if (body.kind === "resource") {
          const data = resourceSchema.parse(body.data);
          if (body.remove) await tx.resource.delete({ where: { id: data.id } });
          else
            await tx.resource.upsert({
              where: { id: data.id },
              create: { id: data.id, data },
              update: { data },
            });
        } else if (body.kind === "status") {
          const data = z
            .object({
              id: z.string(),
              status: z.enum([
                "NEW",
                "REVIEWED",
                "CONTACTED",
                "ACCEPTED",
                "REJECTED",
                "CLOSED",
              ]),
            })
            .parse(body.data);
          await tx.bookingRequest.update({
            where: { id: data.id },
            data: { status: data.status },
          });
        } else throw new Error("Unknown operation");
        await tx.auditLog.create({
          data: {
            actorId: user.id,
            action: body.kind + (body.remove ? ":delete" : ":save"),
            targetId: z.string().parse(body.data.id),
          },
        });
      },
      { isolationLevel: "Serializable" },
    );
    return NextResponse.json({ ok: true });
  } catch (error) {
    if (error instanceof RequestBodyError)
      return NextResponse.json(
        { error: error.message },
        { status: error.status },
      );
    return NextResponse.json(
      {
        error:
          "Could not save. Check all fields. Packages with inquiries cannot be removed.",
      },
      { status: 400 },
    );
  }
}
