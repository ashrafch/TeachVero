import { existsSync } from "node:fs";
import { PrismaClient } from "@prisma/client";
import { initialPackages, initialResources } from "../src/lib/content";
import { hashPassword } from "../src/server/password";
if (existsSync(".env")) process.loadEnvFile(".env");
const prisma = new PrismaClient();
async function main() {
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
  console.log(
    "Seed complete. Existing records preserved. Demo accounts are development-only.",
  );
}
main().finally(() => prisma.$disconnect());
