import { z } from "zod";
export const inquirySchema = z.object({
  name: z.string().trim().min(2).max(100),
  email: z
    .email()
    .max(254)
    .transform((v) => v.toLowerCase()),
  packageId: z.string().max(100).default(""),
  goal: z.enum(["beginner", "conversation", "travel", "exam", "other"]),
  message: z.string().trim().min(10).max(2000),
  timezone: z.string().trim().min(2).max(100),
  consent: z.literal(true),
  marketing: z.boolean().default(false),
  website: z.string().max(0).default(""),
  campaign: z.string().max(100).default(""),
});
export const leadSchema = z.object({
  name: z.string().trim().min(2).max(100),
  email: z
    .email()
    .max(254)
    .transform((v) => v.toLowerCase()),
  consent: z.literal(true),
  marketing: z.boolean().default(false),
  website: z.string().max(0).default(""),
});
export const packageSchema = z.object({
  id: z
    .string()
    .regex(/^[a-z0-9-]+$/)
    .max(80),
  name: z.string().trim().min(2).max(100),
  description: z.string().trim().min(10).max(500),
  tag: z.string().trim().max(100),
  lessons: z.number().int().min(1).max(100),
  duration: z.number().int().min(15).max(180),
  features: z.array(z.string().min(1).max(150)).min(1).max(8),
});
export const resourceSchema = z.object({
  id: z
    .string()
    .regex(/^[a-z0-9-]+$/)
    .max(80),
  title: z.string().trim().min(3).max(150),
  category: z.string().min(2).max(80),
  level: z.string().min(2).max(50),
  excerpt: z.string().min(10).max(300),
  body: z.string().min(50).max(20000),
  color: z.enum(["mint", "lavender", "peach"]),
});
export const profileSchema = z.object({
  name: z.string().trim().min(2).max(100),
  timezone: z.string().min(2).max(100),
  goal: z.string().max(500),
  progress: z.array(z.enum(["introduce", "order", "conversation"])).max(3),
});
export function remainingCredits(granted: number, used: number) {
  if (
    !Number.isInteger(granted) ||
    !Number.isInteger(used) ||
    granted < 0 ||
    used < 0 ||
    used > granted
  )
    throw new Error("Invalid credit balance");
  return granted - used;
}
