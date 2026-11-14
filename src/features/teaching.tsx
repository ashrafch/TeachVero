"use client";
import { useId, useState, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { FormReady } from "@/components/ui/form-ready";

export type StudentOption = {
  id: string;
  name: string;
  email: string;
  studentRecord: {
    level: string;
    status: string;
    preferences: string;
    notes: string;
  } | null;
};
export type AllocationOption = {
  id: string;
  label: string;
  remaining: number;
  credits: number;
  user: { name: string };
  expiresAt: string | null;
};
export type LessonOption = {
  id: string;
  startsAt: string;
  endsAt: string;
  status: string;
  studentSummary: string;
  teacherNotes: string;
  enrollment: { user: { name: string } };
};

function ActionForm({
  kind,
  children,
  build,
  label,
}: {
  kind: string;
  children: ReactNode;
  build: (form: FormData, reference: string) => unknown;
  label: string;
}) {
  const [pending, setPending] = useState(false),
    [message, setMessage] = useState("");
  const [reference, setReference] = useState("");
  const router = useRouter();
  return (
    <form
      className="content-form teaching-form"
      onSubmit={async (e) => {
        e.preventDefault();
        setPending(true);
        setMessage("");
        const form = e.currentTarget;
        const key = reference || crypto.randomUUID();
        setReference(key);
        try {
          const response = await fetch("/api/teaching", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              kind,
              data: build(new FormData(form), key),
            }),
          });
          const result = await response.json();
          if (!response.ok) throw new Error(result.error);
          setMessage("Saved.");
          setReference("");
          router.refresh();
          if (
            kind === "allocate" ||
            kind === "schedule" ||
            (kind === "student" && form.elements.namedItem("password"))
          )
            form.reset();
        } catch (error) {
          setMessage(
            error instanceof Error
              ? error.message
              : "Could not save. Try again.",
          );
        } finally {
          setPending(false);
        }
      }}
    >
      <FormReady pending={pending}>
        {children}
        <button className="button button-dark">
          {pending ? "Saving…" : label}
        </button>
      </FormReady>
      <p role="status">{message}</p>
    </form>
  );
}
const text = (f: FormData, key: string) => String(f.get(key) || "");
function DateField({
  name = "startsAt",
  label = "Lesson time",
  required = true,
}: {
  name?: string;
  label?: string;
  required?: boolean;
}) {
  const id = useId();
  return (
    <div className="date-field">
      <label htmlFor={id}>
        {label}
        <input
          id={id}
          aria-describedby={id + "-hint"}
          name={name}
          type="datetime-local"
          required={required}
        />
      </label>
      <small id={id + "-hint"}>
        Uses the time zone of this device. The saved time is shown in UTC below.
      </small>
    </div>
  );
}
export function StudentEditor({ student }: { student?: StudentOption }) {
  return (
    <ActionForm
      kind="student"
      label={student ? "Save student" : "Create student"}
      build={(f) => ({
        id: student?.id,
        name: text(f, "name"),
        email: text(f, "email"),
        ...(!student ? { password: text(f, "password") } : {}),
        level: text(f, "level"),
        status: text(f, "status"),
        preferences: text(f, "preferences"),
        notes: text(f, "notes"),
      })}
    >
      <label>
        Student name
        <input
          name="name"
          defaultValue={student?.name}
          required
          minLength={2}
          maxLength={100}
          autoComplete="name"
        />
      </label>
      <label>
        Student email
        <input
          name="email"
          type="email"
          defaultValue={student?.email}
          readOnly={!!student}
          required
          autoComplete="email"
        />
      </label>
      {!student && (
        <label>
          Initial password
          <input
            aria-label="Initial password"
            name="password"
            type="password"
            minLength={12}
            maxLength={200}
            required
            autoComplete="new-password"
          />
          <small>
            Local preview accounts only. Secure onboarding and password recovery
            are required before launch.
          </small>
        </label>
      )}
      <div className="form-row">
        <label>
          Italian level
          <select
            name="level"
            defaultValue={student?.studentRecord?.level || "Not assessed"}
          >
            {["Not assessed", "A1", "A2", "B1", "B2", "C1", "C2"].map((v) => (
              <option key={v}>{v}</option>
            ))}
          </select>
        </label>
        <label>
          Enrollment status
          <select
            name="status"
            defaultValue={student?.studentRecord?.status || "ACTIVE"}
          >
            {["ACTIVE", "PAUSED", "ARCHIVED"].map((v) => (
              <option key={v}>{v}</option>
            ))}
          </select>
        </label>
      </div>
      <label>
        Teaching preferences
        <textarea
          name="preferences"
          defaultValue={student?.studentRecord?.preferences}
          maxLength={1000}
        />
      </label>
      <label>
        Private student notes
        <textarea
          aria-label="Private student notes"
          name="notes"
          defaultValue={student?.studentRecord?.notes}
          maxLength={4000}
        />
        <small>Visible only in the teacher workspace.</small>
      </label>
    </ActionForm>
  );
}
export function AllocationForm({
  students,
  offers,
}: {
  students: StudentOption[];
  offers: { id: string; name: string; lessons: number }[];
}) {
  return (
    <ActionForm
      kind="allocate"
      label="Allocate package"
      build={(f, reference) => ({
        userId: text(f, "userId"),
        packageId: text(f, "packageId"),
        reference,
        ...(text(f, "expiresAt")
          ? { expiresAt: new Date(text(f, "expiresAt")).toISOString() }
          : {}),
      })}
    >
      <p className="notice">
        Manual teaching credit allocation. This records no payment or purchase.
      </p>
      <label>
        Student
        <select name="userId" required>
          <option value="">Choose a student</option>
          {students.map((s) => (
            <option key={s.id} value={s.id}>
              {s.name} — {s.email}
            </option>
          ))}
        </select>
      </label>
      <label>
        Package
        <select name="packageId" required>
          <option value="">Choose a package</option>
          {offers.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name} — {p.lessons} credits
            </option>
          ))}
        </select>
      </label>
      <DateField
        name="expiresAt"
        label="Allocation expiry (optional)"
        required={false}
      />
    </ActionForm>
  );
}
export function ScheduleForm({
  allocations,
}: {
  allocations: AllocationOption[];
}) {
  return (
    <ActionForm
      kind="schedule"
      label="Schedule lesson"
      build={(f, reference) => ({
        enrollmentId: text(f, "enrollmentId"),
        reference,
        startsAt: new Date(text(f, "startsAt")).toISOString(),
        duration: Number(f.get("duration")),
        studentSummary: text(f, "studentSummary"),
        teacherNotes: text(f, "teacherNotes"),
      })}
    >
      <label>
        Credit allocation
        <select name="enrollmentId" required>
          <option value="">Choose an allocation</option>
          {allocations
            .filter((a) => a.remaining > 0)
            .map((a) => (
              <option key={a.id} value={a.id}>
                {a.user.name} — {a.label} ({a.remaining} left)
              </option>
            ))}
        </select>
      </label>
      <DateField />
      <label>
        Duration in minutes
        <input
          name="duration"
          type="number"
          min={15}
          max={180}
          defaultValue={50}
          required
        />
      </label>
      <label>
        Student lesson summary
        <textarea name="studentSummary" maxLength={2000} />
      </label>
      <label>
        Private lesson notes
        <textarea name="teacherNotes" maxLength={4000} />
      </label>
    </ActionForm>
  );
}
export function LessonEditor({ lesson }: { lesson: LessonOption }) {
  return (
    <details className="record-details">
      <summary>
        {lesson.enrollment.user.name} —{" "}
        {new Date(lesson.startsAt).toLocaleString("en-GB", { timeZone: "UTC" })}{" "}
        UTC · {lesson.status}
      </summary>
      <ActionForm
        kind="lesson"
        label="Update lesson"
        build={(f) => ({
          id: lesson.id,
          action: text(f, "action"),
          ...(text(f, "startsAt")
            ? { startsAt: new Date(text(f, "startsAt")).toISOString() }
            : {}),
          studentSummary: text(f, "studentSummary"),
          teacherNotes: text(f, "teacherNotes"),
        })}
      >
        <label>
          Lesson action
          <select name="action">
            <option value="NOTES">Save notes</option>
            {lesson.status === "SCHEDULED" && (
              <>
                <option value="RESCHEDULE">Reschedule</option>
                <option value="COMPLETE">Mark completed</option>
                <option value="CANCEL">Cancel and return credit</option>
              </>
            )}
          </select>
        </label>
        <DateField label="New time (for rescheduling)" required={false} />
        <label>
          Student lesson summary
          <textarea
            name="studentSummary"
            defaultValue={lesson.studentSummary}
            maxLength={2000}
          />
        </label>
        <label>
          Private lesson notes
          <textarea
            name="teacherNotes"
            defaultValue={lesson.teacherNotes}
            maxLength={4000}
          />
        </label>
      </ActionForm>
    </details>
  );
}
export function LeadEditor({
  id,
  status,
  notes,
}: {
  id: string;
  status: string;
  notes: string;
}) {
  return (
    <ActionForm
      kind="lead"
      label="Save follow-up"
      build={(f) => ({
        id,
        status: text(f, "status"),
        notes: text(f, "notes"),
      })}
    >
      <label>
        Follow-up status
        <select name="status" defaultValue={status}>
          {["NEW", "FOLLOW_UP", "CONVERTED", "CLOSED"].map((v) => (
            <option key={v}>{v}</option>
          ))}
        </select>
      </label>
      <label>
        Private follow-up notes
        <textarea name="notes" maxLength={2000} defaultValue={notes} />
      </label>
    </ActionForm>
  );
}
