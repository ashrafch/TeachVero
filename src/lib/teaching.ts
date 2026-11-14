import { z } from "zod";

export class TeachingError extends Error {}

const id = z.string().min(1).max(100);
const reference = z.string().uuid();
export const teachingCommand = z.discriminatedUnion("kind", [
  z.object({
    kind: z.literal("student"),
    data: z.object({
      id: z.string().max(100).optional(),
      name: z.string().trim().min(2).max(100),
      email: z
        .email()
        .max(254)
        .transform((v) => v.toLowerCase()),
      password: z.string().min(12).max(200).optional(),
      level: z.enum(["Not assessed", "A1", "A2", "B1", "B2", "C1", "C2"]),
      status: z.enum(["ACTIVE", "PAUSED", "ARCHIVED"]),
      preferences: z.string().max(1000),
      notes: z.string().max(4000),
    }),
  }),
  z.object({
    kind: z.literal("allocate"),
    data: z.object({
      userId: id,
      packageId: id,
      reference,
      expiresAt: z.iso.datetime().optional(),
    }),
  }),
  z.object({
    kind: z.literal("schedule"),
    data: z.object({
      enrollmentId: id,
      reference,
      startsAt: z.iso.datetime(),
      duration: z.number().int().min(15).max(180),
      studentSummary: z.string().max(2000),
      teacherNotes: z.string().max(4000),
    }),
  }),
  z.object({
    kind: z.literal("lesson"),
    data: z.object({
      id,
      action: z.enum(["CANCEL", "COMPLETE", "RESCHEDULE", "NOTES"]),
      startsAt: z.iso.datetime().optional(),
      studentSummary: z.string().max(2000).optional(),
      teacherNotes: z.string().max(4000).optional(),
    }),
  }),
  z.object({
    kind: z.literal("lead"),
    data: z.object({
      id,
      status: z.enum(["NEW", "FOLLOW_UP", "CONVERTED", "CLOSED"]),
      notes: z.string().max(2000),
    }),
  }),
]);

export function assertBookable(
  remaining: number,
  expiresAt: Date | null,
  startsAt: Date,
  now = new Date(),
) {
  if (startsAt <= now) throw new TeachingError("Choose a future lesson time.");
  if (remaining < 1)
    throw new TeachingError("This allocation has no available credits.");
  if (expiresAt && (expiresAt <= now || startsAt >= expiresAt))
    throw new TeachingError(
      "The lesson must take place before the allocation expires.",
    );
}

export function lessonEnd(startsAt: Date, duration: number) {
  return new Date(startsAt.getTime() + duration * 60000);
}

export function safeTimeZone(value?: string) {
  try {
    new Intl.DateTimeFormat("en", { timeZone: value || "Europe/Rome" });
    return value || "Europe/Rome";
  } catch {
    return "Europe/Rome";
  }
}
