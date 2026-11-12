import "server-only";
import { prisma } from "./db";
import { initialPackages, initialResources } from "@/lib/content";
import { hashPassword } from "./password";
import type { z } from "zod";
import { packageSchema, resourceSchema } from "@/lib/validation";
export type PackageData = z.infer<typeof packageSchema>;
export type ResourceData = z.infer<typeof resourceSchema>;
export async function packages(): Promise<PackageData[]> {
  return (await prisma.package.findMany({ orderBy: { id: "asc" } }))
    .map((p) => packageSchema.parse(p.data))
    .sort(
      (a, b) =>
        (initialPackages.findIndex((p) => p.id === a.id) < 0
          ? 99
          : initialPackages.findIndex((p) => p.id === a.id)) -
        (initialPackages.findIndex((p) => p.id === b.id) < 0
          ? 99
          : initialPackages.findIndex((p) => p.id === b.id)),
    );
}
export async function resources(): Promise<ResourceData[]> {
  return (await prisma.resource.findMany({ orderBy: { id: "asc" } }))
    .map((r) => resourceSchema.parse(r.data))
    .sort(
      (a, b) =>
        (initialResources.findIndex((r) => r.id === a.id) < 0
          ? 99
          : initialResources.findIndex((r) => r.id === a.id)) -
        (initialResources.findIndex((r) => r.id === b.id) < 0
          ? 99
          : initialResources.findIndex((r) => r.id === b.id)),
    );
}
export async function seed() {
  await prisma.$transaction(async (tx) => {
    for (const p of initialPackages)
      await tx.package.upsert({
        where: { id: p.id },
        create: { id: p.id, data: p },
        update: {},
      });
    for (const r of initialResources)
      await tx.resource.upsert({
        where: { id: r.id },
        create: { id: r.id, data: r },
        update: {},
      });
    if (process.env.NODE_ENV !== "production")
      for (const [email, name, role, password] of [
        [
          "teacher@teachvero.local",
          "Demo teacher",
          "ADMIN",
          "TeachVero-demo-2026!",
        ],
        [
          "student@teachvero.local",
          "Demo learner",
          "STUDENT",
          "LearnItalian-2026!",
        ],
      ])
        await tx.user.upsert({
          where: { email },
          create: {
            email,
            name,
            role,
            passwordHash: hashPassword(password),
            profile: {
              timezone: "Europe/Rome",
              goal: "Start a conversation",
              progress: [],
            },
          },
          update: {},
        });
  });
}
