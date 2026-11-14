import "server-only";
import { prisma } from "./db";
import { hashPassword } from "./password";
import {
  teachingCommand,
  assertBookable,
  lessonEnd,
  TeachingError,
} from "@/lib/teaching";
import { packageSchema } from "@/lib/validation";

/** All single-teacher schedule/credit writers take the same transaction lock. */
export async function manageTeaching(actorId: string, input: unknown) {
  const command = teachingCommand.parse(input);
  return prisma.$transaction(
    async (tx) => {
      await tx.$executeRaw`SELECT pg_advisory_xact_lock(71643001)`;
      let targetId = "";
      if (command.kind === "student") {
        const d = command.data;
        if (d.id) {
          const student = await tx.user.findUnique({ where: { id: d.id } });
          if (!student || student.role !== "STUDENT")
            throw new TeachingError("Student not found.");
          // Email is the current inquiry/session identity; change it only through a future verified-email workflow.
          if (student.email !== d.email)
            throw new TeachingError("Account email cannot be changed here.");
          await tx.user.update({ where: { id: d.id }, data: { name: d.name } });
          targetId = d.id;
        } else {
          if (!d.password)
            throw new TeachingError(
              "Set an initial password of at least 12 characters.",
            );
          if (await tx.user.findUnique({ where: { email: d.email } }))
            throw new TeachingError("An account already uses this email.");
          const student = await tx.user.create({
            data: {
              name: d.name,
              email: d.email,
              role: "STUDENT",
              passwordHash: hashPassword(d.password),
              profile: { timezone: "Europe/Rome", goal: "", progress: [] },
            },
          });
          targetId = student.id;
        }
        await tx.studentRecord.upsert({
          where: { userId: targetId },
          create: {
            userId: targetId,
            level: d.level,
            status: d.status,
            preferences: d.preferences,
            notes: d.notes,
          },
          update: {
            level: d.level,
            status: d.status,
            preferences: d.preferences,
            notes: d.notes,
          },
        });
      } else if (command.kind === "allocate") {
        const d = command.data;
        const existing = await tx.enrollment.findUnique({
          where: { reference: d.reference },
        });
        if (existing) {
          if (
            existing.userId !== d.userId ||
            existing.packageId !== d.packageId ||
            existing.expiresAt?.toISOString() !== d.expiresAt
          )
            throw new TeachingError(
              "This request was already saved with different details. Refresh before making another allocation.",
            );
          return { id: existing.id };
        }
        const student = await tx.user.findUnique({
          where: { id: d.userId },
          include: { studentRecord: true },
        });
        const offer = await tx.package.findUnique({
          where: { id: d.packageId },
        });
        if (
          !student ||
          student.role !== "STUDENT" ||
          student.studentRecord?.status === "ARCHIVED" ||
          !offer
        )
          throw new TeachingError(
            "Choose an active student and an existing package.",
          );
        if (d.expiresAt && new Date(d.expiresAt) <= new Date())
          throw new TeachingError("Expiry must be in the future.");
        const p = packageSchema.parse(offer.data);
        const enrollment = await tx.enrollment.create({
          data: {
            userId: d.userId,
            packageId: offer.id,
            label: p.name,
            credits: p.lessons,
            remaining: p.lessons,
            expiresAt: d.expiresAt ? new Date(d.expiresAt) : null,
            reference: d.reference,
          },
        });
        targetId = enrollment.id;
        await tx.creditEntry.create({
          data: {
            enrollmentId: targetId,
            delta: p.lessons,
            reason: "Manual allocation; no payment recorded",
            reference: "grant:" + targetId,
          },
        });
      } else if (command.kind === "schedule") {
        const d = command.data;
        const existing = await tx.lesson.findUnique({
          where: { reference: d.reference },
        });
        if (existing) {
          if (
            existing.enrollmentId !== d.enrollmentId ||
            existing.startsAt.getTime() !== new Date(d.startsAt).getTime()
          )
            throw new TeachingError(
              "This request was already saved with different details. Refresh before scheduling again.",
            );
          return { id: existing.id };
        }
        const enrollment = await tx.enrollment.findUnique({
          where: { id: d.enrollmentId },
          include: { user: { include: { studentRecord: true } } },
        });
        if (!enrollment || enrollment.user.studentRecord?.status === "ARCHIVED")
          throw new TeachingError("Choose an active allocation.");
        const startsAt = new Date(d.startsAt),
          endsAt = lessonEnd(startsAt, d.duration);
        assertBookable(enrollment.remaining, enrollment.expiresAt, startsAt);
        if (enrollment.expiresAt && endsAt > enrollment.expiresAt)
          throw new TeachingError("The lesson must end before expiry.");
        if (
          await tx.lesson.count({
            where: {
              status: { not: "CANCELLED" },
              startsAt: { lt: endsAt },
              endsAt: { gt: startsAt },
            },
          })
        )
          throw new TeachingError(
            "This time overlaps another lesson. Choose a different time.",
          );
        const lesson = await tx.lesson.create({
          data: {
            enrollmentId: enrollment.id,
            startsAt,
            endsAt,
            reference: d.reference,
            studentSummary: d.studentSummary,
            teacherNotes: d.teacherNotes,
          },
        });
        targetId = lesson.id;
        await tx.enrollment.update({
          where: { id: enrollment.id },
          data: { remaining: { decrement: 1 } },
        });
        await tx.creditEntry.create({
          data: {
            enrollmentId: enrollment.id,
            delta: -1,
            reason: "Lesson reserved",
            reference: "reserve:" + lesson.id,
          },
        });
      } else if (command.kind === "lesson") {
        const d = command.data;
        const lesson = await tx.lesson.findUnique({
          where: { id: d.id },
          include: { enrollment: true },
        });
        if (!lesson) throw new TeachingError("Lesson not found.");
        targetId = lesson.id;
        if (d.action === "NOTES") {
          await tx.lesson.update({
            where: { id: d.id },
            data: {
              studentSummary: d.studentSummary,
              teacherNotes: d.teacherNotes,
            },
          });
        } else if (d.action === "RESCHEDULE") {
          if (lesson.status !== "SCHEDULED" || !d.startsAt)
            throw new TeachingError("Only scheduled lessons can be moved.");
          const startsAt = new Date(d.startsAt),
            endsAt = new Date(
              startsAt.getTime() +
                lesson.endsAt.getTime() -
                lesson.startsAt.getTime(),
            );
          assertBookable(1, lesson.enrollment.expiresAt, startsAt);
          if (
            lesson.enrollment.expiresAt &&
            endsAt > lesson.enrollment.expiresAt
          )
            throw new TeachingError("The lesson must end before expiry.");
          if (
            await tx.lesson.count({
              where: {
                id: { not: lesson.id },
                status: { not: "CANCELLED" },
                startsAt: { lt: endsAt },
                endsAt: { gt: startsAt },
              },
            })
          )
            throw new TeachingError("This time overlaps another lesson.");
          await tx.lesson.update({
            where: { id: lesson.id },
            data: { startsAt, endsAt },
          });
        } else {
          const status = d.action === "CANCEL" ? "CANCELLED" : "COMPLETED";
          if (lesson.status === status) return { id: lesson.id };
          if (lesson.status !== "SCHEDULED")
            throw new TeachingError("This lesson is already closed.");
          if (status === "COMPLETED" && lesson.endsAt > new Date())
            throw new TeachingError(
              "Complete the lesson after its scheduled end.",
            );
          await tx.lesson.update({
            where: { id: lesson.id },
            data: { status },
          });
          if (status === "CANCELLED") {
            await tx.enrollment.update({
              where: { id: lesson.enrollmentId },
              data: { remaining: { increment: 1 } },
            });
            await tx.creditEntry.create({
              data: {
                enrollmentId: lesson.enrollmentId,
                delta: 1,
                reason: "Cancelled lesson returned",
                reference: "cancel:" + lesson.id,
              },
            });
          }
        }
      } else {
        const lead = await tx.lead.findUnique({
          where: { id: command.data.id },
        });
        if (!lead) throw new TeachingError("Lead not found.");
        const previous = lead.data as Record<string, string | boolean>;
        await tx.lead.update({
          where: { id: lead.id },
          data: {
            data: {
              ...previous,
              followUpStatus: command.data.status,
              notes: command.data.notes,
            },
          },
        });
        targetId = lead.id;
      }
      await tx.auditLog.create({
        data: {
          actorId,
          action:
            "teaching:" +
            command.kind +
            (command.kind === "lesson" ? ":" + command.data.action : ""),
          targetId,
        },
      });
      return { id: targetId };
    },
    { maxWait: 10000, timeout: 15000 },
  );
}
