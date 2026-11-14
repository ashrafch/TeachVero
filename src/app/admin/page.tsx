import { redirect } from "next/navigation";
import { currentUser } from "@/server/auth";
import { prisma } from "@/server/db";
import { packages, resources } from "@/server/repository";
import { StatusControl, ContentEditor } from "@/features/admin";
import Link from "next/link";
import { WorkspaceShell, teacherViews } from "@/components/workspace-shell";
import { ArrowRight, CalendarDays } from "lucide-react";
import {
  StudentEditor,
  AllocationForm,
  ScheduleForm,
  LessonEditor,
  LeadEditor,
} from "@/features/teaching";
export const dynamic = "force-dynamic";
export const metadata = {
  title: "Teacher workspace",
  robots: { index: false, follow: false },
};
export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ view?: string; q?: string }>;
}) {
  const params = await searchParams;
  const query =
    typeof params.q === "string" ? params.q.trim().slice(0, 100) : "";
  const view = teacherViews.some((item) => item.id === params.view)
    ? params.view!
    : "overview";
  const user = await currentUser();
  if (!user) redirect("/login");
  if (user.role !== "ADMIN") redirect("/dashboard");
  const [
    requests,
    leads,
    students,
    offers,
    articles,
    audits,
    allocations,
    lessons,
  ] = await Promise.all([
    prisma.bookingRequest.findMany({ orderBy: { createdAt: "desc" } }),
    prisma.lead.findMany({ orderBy: { createdAt: "desc" } }),
    prisma.user.findMany({
      where: { role: "STUDENT" },
      select: {
        id: true,
        name: true,
        email: true,
        profile: true,
        studentRecord: true,
      },
    }),
    packages(),
    resources(),
    prisma.auditLog.findMany({ take: 10, orderBy: { createdAt: "desc" } }),
    prisma.enrollment.findMany({
      include: {
        user: { select: { name: true } },
        entries: { orderBy: { createdAt: "desc" } },
      },
      orderBy: { createdAt: "desc" },
    }),
    prisma.lesson.findMany({
      include: {
        enrollment: { include: { user: { select: { name: true } } } },
      },
      orderBy: { startsAt: "desc" },
    }),
  ]);
  const now = new Date();
  const weekEnd = new Date(now.getTime() + 7 * 86400000);
  const renewalEnd = new Date(now.getTime() + 30 * 86400000);
  const activeAllocations = allocations.filter(
    (a) => !a.expiresAt || a.expiresAt > now,
  );
  const lowBalances = activeAllocations.filter((a) => a.remaining <= 1).length;
  const expiring = activeAllocations.filter(
    (a) => a.expiresAt && a.expiresAt <= renewalEnd,
  ).length;
  return (
    <WorkspaceShell role="teacher" active={view} name={user.name}>
      {view === "overview" && (
        <>
          <div className="overview-stats">
            <Link href="/admin?view=inquiries">
              <span>Awaiting review</span>
              <strong>
                {requests.filter((r) => r.status === "NEW").length}
              </strong>
              <small>Open booking inquiries</small>
            </Link>
            <Link href="/admin?view=lessons">
              <span>This week</span>
              <strong>
                {
                  lessons.filter(
                    (l) =>
                      l.status === "SCHEDULED" &&
                      l.startsAt >= now &&
                      l.startsAt < weekEnd,
                  ).length
                }
              </strong>
              <small>Lessons in the next 7 days</small>
            </Link>
            <Link href="/admin?view=students">
              <span>Your students</span>
              <strong>{students.length}</strong>
              <small>Open teaching plans</small>
            </Link>
            <Link href="/admin?view=allocations">
              <span>Low credit balances</span>
              <strong>{lowBalances}</strong>
              <small>{expiring} packages expire within 30 days</small>
            </Link>
          </div>
          <div className="workspace-overview-grid">
            <section className="workspace-panel">
              <div className="panel-heading">
                <h2>Coming up</h2>
                <Link href="/admin?view=lessons">View schedule</Link>
              </div>
              {lessons
                .filter((l) => l.status === "SCHEDULED" && l.endsAt > now)
                .sort((a, b) => a.startsAt.getTime() - b.startsAt.getTime())
                .slice(0, 4)
                .map((l) => (
                  <Link
                    className="agenda-row"
                    href="/admin?view=lessons"
                    key={l.id}
                  >
                    <span className="date-tile">
                      {l.startsAt.toLocaleDateString("en-GB", {
                        day: "numeric",
                        timeZone: "Europe/Rome",
                      })}
                      <small>
                        {l.startsAt.toLocaleDateString("en-GB", {
                          month: "short",
                          timeZone: "Europe/Rome",
                        })}
                      </small>
                    </span>
                    <span>
                      <strong>{l.enrollment.user.name}</strong>
                      <small>
                        {l.startsAt.toLocaleString("en-GB", {
                          timeZone: "Europe/Rome",
                        })}{" "}
                        · Europe/Rome
                      </small>
                    </span>
                  </Link>
                ))}
              {!lessons.some(
                (l) => l.status === "SCHEDULED" && l.endsAt > now,
              ) && (
                <div className="workspace-empty">
                  <CalendarDays size={32} />
                  <h3>Room for the next conversation.</h3>
                  <p>
                    Agree a time with a student, then add it to your schedule.
                  </p>
                  <Link className="text-link" href="/admin?view=lessons">
                    Schedule a lesson
                  </Link>
                </div>
              )}
            </section>
            <section className="workspace-panel next-actions">
              <h2>Keep things moving</h2>
              <Link href="/admin?view=inquiries">
                <strong>Review new inquiries</strong>
                <span>Read goals and agree the next step.</span>
                <ArrowRight size={18} />
              </Link>
              <Link href="/admin?view=students">
                <strong>Manage your students</strong>
                <span>Teaching plans and private notes.</span>
                <ArrowRight size={18} />
              </Link>
              <Link href="/admin?view=content">
                <strong>Update your website</strong>
                <span>Lesson packages and learning resources.</span>
                <ArrowRight size={18} />
              </Link>
            </section>
          </div>
          <p className="workspace-note">
            Local preview records only. Scheduling is internal; payments,
            calendar invitations and email are not active.
          </p>
        </>
      )}
      {view === "students" && (
        <section className="admin-section" id="students">
          <h2>Students & teaching plans</h2>
          <p>
            Local preview records. Keep real student information out of this
            demo.
          </p>
          <form className="workspace-search" action="/admin">
            <input type="hidden" name="view" value="students" />
            <label htmlFor="student-search">Find a student</label>
            <div>
              <input
                id="student-search"
                type="search"
                name="q"
                defaultValue={query}
                placeholder="Name or email"
              />
              <button className="button button-dark" type="submit">
                Search
              </button>
            </div>
          </form>
          <details className="record-details">
            <summary>Create student</summary>
            <StudentEditor />
          </details>
          {query && (
            <p role="status">
              {
                students.filter((s) =>
                  (s.name + " " + s.email)
                    .toLowerCase()
                    .includes(query.toLowerCase()),
                ).length
              }{" "}
              matching students.{" "}
              <Link className="text-link" href="/admin?view=students">
                Clear search
              </Link>
            </p>
          )}
          {students
            .filter(
              (s) =>
                !query ||
                (s.name + " " + s.email)
                  .toLowerCase()
                  .includes(query.toLowerCase()),
            )
            .map((s) => (
              <details className="record-details" key={s.id}>
                <summary>
                  {s.name} — {s.email}
                </summary>
                <StudentEditor student={s} />
              </details>
            ))}
        </section>
      )}
      {view === "allocations" && (
        <section className="admin-section" id="allocations">
          <h2>Package allocations</h2>
          <details className="record-details">
            <summary>Allocate lesson credits</summary>
            <AllocationForm students={students} offers={offers} />
          </details>
          {!allocations.length && (
            <p>
              No allocations yet. Assign a package to a student to start
              scheduling.
            </p>
          )}
          {allocations.map((a) => (
            <article className="request-card" key={a.id}>
              <h3>
                {a.user.name} — {a.label}
              </h3>
              <p>
                {a.remaining} of {a.credits} credits available · Manual
                allocation
              </p>
              <p>
                {a.expiresAt
                  ? "Expires " + a.expiresAt.toISOString()
                  : "No expiry set"}
              </p>
              <details>
                <summary>Credit history</summary>
                {a.entries.map((e) => (
                  <p key={e.id}>
                    {e.delta > 0 ? "+" : ""}
                    {e.delta} · {e.reason} · {e.createdAt.toISOString()}
                  </p>
                ))}
              </details>
            </article>
          ))}
        </section>
      )}
      {view === "lessons" && (
        <section className="admin-section" id="lessons">
          <h2>Lesson schedule</h2>
          <p>
            Agree the time with the student first. Scheduling reserves one
            credit; cancellation returns it. No calendar invitation or email is
            sent.
          </p>
          <details className="record-details">
            <summary>Schedule a lesson</summary>
            <ScheduleForm
              allocations={allocations.map((a) => ({
                ...a,
                expiresAt: a.expiresAt?.toISOString() || null,
              }))}
            />
          </details>
          {!lessons.length && <p>No lessons scheduled yet.</p>}
          {lessons.map((l) => (
            <LessonEditor
              key={l.id}
              lesson={{
                ...l,
                startsAt: l.startsAt.toISOString(),
                endsAt: l.endsAt.toISOString(),
              }}
            />
          ))}
        </section>
      )}
      {view === "inquiries" && (
        <section className="admin-section" id="inquiries">
          <h2>Booking inquiries</h2>
          <p>
            Accept or decline an inquiry after review. Acceptance does not
            reserve a time: agree it personally and add the lesson in the
            schedule.
          </p>
          {!requests.length && (
            <p>
              No inquiries yet. Submit the public contact form to test the full
              flow.
            </p>
          )}
          {requests.map((r) => {
            const d = r.data as {
              name: string;
              message: string;
              goal: string;
              timezone: string;
              packageId: string;
              marketing: boolean;
              campaign: string;
            };
            return (
              <article className="request-card" key={r.id}>
                <div className="section-heading">
                  <div>
                    <h3>{d.name}</h3>
                    <a href={"mailto:" + r.email}>{r.email}</a>
                  </div>
                  <StatusControl id={r.id} status={r.status} />
                </div>
                <p className="preserve-lines">{d.message}</p>
                <div className="request-meta">
                  <span>{d.goal}</span>
                  <span>{d.timezone}</span>
                  <span>{d.packageId || "No package selected"}</span>
                  <span>{r.createdAt.toISOString()}</span>
                </div>
                <small>
                  Marketing opt-in: {d.marketing ? "Yes" : "No"} · Campaign:{" "}
                  {d.campaign || "None"} · ID: {r.id}
                </small>
              </article>
            );
          })}
        </section>
      )}
      {view === "content" && (
        <section className="admin-section">
          <h2>Packages</h2>
          <ContentEditor kind="package" items={offers} />
        </section>
      )}
      {view === "content" && (
        <section className="admin-section">
          <h2>Learning resources</h2>
          <ContentEditor kind="resource" items={articles} />
        </section>
      )}
      {view === "leads" && (
        <section className="admin-section">
          <h2>Guide requests</h2>
          {leads.length ? (
            leads.map((l) => (
              <article className="request-card" key={l.id}>
                <strong>{(l.data as { name: string }).name}</strong>
                <p>{l.email}</p>
                <small>
                  Marketing:{" "}
                  {(l.data as { marketing: boolean }).marketing
                    ? "Opted in"
                    : "Not opted in"}{" "}
                  · {l.createdAt.toISOString()}
                </small>
                <LeadEditor
                  id={l.id}
                  status={
                    (l.data as { followUpStatus?: string }).followUpStatus ||
                    "NEW"
                  }
                  notes={(l.data as { notes?: string }).notes || ""}
                />
              </article>
            ))
          ) : (
            <p>No guide requests yet.</p>
          )}
        </section>
      )}

      {view === "activity" && (
        <section className="admin-section">
          <h2>Recent admin activity</h2>
          {audits.length ? (
            audits.map((a) => (
              <p className="audit-row" key={a.id}>
                {a.action} · {a.targetId} · {a.createdAt.toISOString()}
              </p>
            ))
          ) : (
            <p>Changes to inquiries and content will be recorded here.</p>
          )}
        </section>
      )}
    </WorkspaceShell>
  );
}
