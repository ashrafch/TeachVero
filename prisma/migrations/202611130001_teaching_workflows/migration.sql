CREATE TABLE "StudentRecord" (
 "userId" TEXT PRIMARY KEY REFERENCES "User"("id") ON DELETE RESTRICT,
 "level" TEXT NOT NULL DEFAULT 'Not assessed', "status" TEXT NOT NULL DEFAULT 'ACTIVE',
 "preferences" TEXT NOT NULL DEFAULT '', "notes" TEXT NOT NULL DEFAULT '', "updatedAt" TIMESTAMP(3) NOT NULL
);
CREATE TABLE "Enrollment" (
 "id" TEXT PRIMARY KEY, "userId" TEXT NOT NULL REFERENCES "User"("id") ON DELETE RESTRICT,
 "packageId" TEXT NOT NULL, "label" TEXT NOT NULL, "credits" INTEGER NOT NULL,
 "remaining" INTEGER NOT NULL, "expiresAt" TIMESTAMP(3), "reference" TEXT NOT NULL UNIQUE,
 "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
 CONSTRAINT "Enrollment_balance" CHECK ("credits" > 0 AND "remaining" >= 0 AND "remaining" <= "credits")
);
CREATE INDEX "Enrollment_userId_idx" ON "Enrollment"("userId");
CREATE TABLE "Lesson" (
 "id" TEXT PRIMARY KEY, "enrollmentId" TEXT NOT NULL REFERENCES "Enrollment"("id") ON DELETE RESTRICT,
 "startsAt" TIMESTAMP(3) NOT NULL, "endsAt" TIMESTAMP(3) NOT NULL,
 "status" TEXT NOT NULL DEFAULT 'SCHEDULED', "studentSummary" TEXT NOT NULL DEFAULT '',
 "teacherNotes" TEXT NOT NULL DEFAULT '', "reference" TEXT NOT NULL UNIQUE,
 "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
 CONSTRAINT "Lesson_duration" CHECK ("endsAt" > "startsAt"),
 CONSTRAINT "Lesson_status" CHECK ("status" IN ('SCHEDULED', 'COMPLETED', 'CANCELLED'))
);
CREATE INDEX "Lesson_startsAt_endsAt_idx" ON "Lesson"("startsAt", "endsAt");
CREATE TABLE "CreditEntry" (
 "id" TEXT PRIMARY KEY, "enrollmentId" TEXT NOT NULL REFERENCES "Enrollment"("id") ON DELETE RESTRICT,
 "delta" INTEGER NOT NULL, "reason" TEXT NOT NULL, "reference" TEXT NOT NULL UNIQUE,
 "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX "CreditEntry_enrollmentId_idx" ON "CreditEntry"("enrollmentId");
