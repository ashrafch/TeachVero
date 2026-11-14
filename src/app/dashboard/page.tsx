import { redirect } from "next/navigation";
import Link from "next/link";
import { currentUser } from "@/server/auth";
import { prisma } from "@/server/db";
import { ProfileForm } from "@/features/account";
import { WorkspaceShell, studentViews } from "@/components/workspace-shell";
import { BookOpen, CalendarDays, ArrowRight } from "lucide-react";
import { resources } from "@/server/repository";
import { ResourceCards } from "@/components/marketing/cards";
import { safeTimeZone } from "@/lib/teaching";
export const dynamic = "force-dynamic";
export const metadata = {
  title: "Your learning space",
  robots: { index: false, follow: false },
};
export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ view?: string }>;
}) {
  const params = await searchParams;
  const view = studentViews.some((item) => item.id === params.view)
    ? params.view!
    : "overview";
  const user = await currentUser();
  if (!user) redirect("/login");
  if (user.role === "ADMIN") redirect("/admin");
  const requests = await prisma.bookingRequest.findMany({
    where: { email: user.email },
    orderBy: { createdAt: "desc" },
  });
  const allocations = await prisma.enrollment.findMany({
    where: { userId: user.id },
    select: {
      id: true,
      label: true,
      credits: true,
      remaining: true,
      expiresAt: true,
      entries: {
        select: { id: true, delta: true, reason: true, createdAt: true },
        orderBy: { createdAt: "desc" },
      },
      lessons: {
        select: {
          id: true,
          startsAt: true,
          endsAt: true,
          status: true,
          studentSummary: true,
        },
        orderBy: { startsAt: "asc" },
      },
    },
  });
  const lessons = allocations
    .flatMap((a) => a.lessons)
    .sort((a, b) => a.startsAt.getTime() - b.startsAt.getTime());
  const upcoming = lessons.filter(
    (l) => l.status === "SCHEDULED" && l.endsAt > new Date(),
  );
  const available = allocations
    .filter((a) => !a.expiresAt || a.expiresAt > new Date())
    .reduce((sum, a) => sum + a.remaining, 0);
  const profile = user.profile as {
    timezone?: string;
    goal?: string;
    progress?: string[];
  };
  profile.timezone = safeTimeZone(profile.timezone);
  return (
    <WorkspaceShell role="student" active={view} name={user.name}>
      {view === "overview" && (
        <>
          <div className="overview-stats student-stats">
            <Link href="/dashboard?view=lessons">
              <span>Upcoming lessons</span>
              <strong>{upcoming.length}</strong>
              <small>
                {upcoming.length
                  ? "Agreed with your teacher."
                  : "No confirmed lessons yet."}
              </small>
            </Link>
            <Link href="/dashboard?view=credits">
              <span>Lesson credits</span>
              <strong>{available}</strong>
              <small>Available after reservations</small>
            </Link>
            <Link href="/dashboard?view=requests">
              <span>My inquiries</span>
              <strong>{requests.length}</strong>
              <small>Track your lesson requests</small>
            </Link>
          </div>
          <div className="workspace-overview-grid">
            <section className="workspace-panel">
              <div className="panel-heading">
                <h2>Your next lesson</h2>
                <Link href="/dashboard?view=lessons">All lessons</Link>
              </div>
              {upcoming[0] ? (
                <div className="next-lesson">
                  <span className="badge">With Veronica</span>
                  <h3>
                    {upcoming[0].startsAt.toLocaleDateString("en-GB", {
                      weekday: "long",
                      day: "numeric",
                      month: "long",
                      timeZone: profile.timezone,
                    })}
                  </h3>
                  <p>
                    {upcoming[0].startsAt.toLocaleTimeString("en-GB", {
                      hour: "2-digit",
                      minute: "2-digit",
                      timeZone: profile.timezone,
                    })}{" "}
                    · {profile.timezone}
                  </p>
                  <p>
                    {upcoming[0].studentSummary ||
                      "Your teacher’s lesson notes will appear here."}
                  </p>
                  <Link className="text-link" href="/dashboard?view=lessons">
                    View lesson details <ArrowRight size={17} />
                  </Link>
                </div>
              ) : (
                <div className="workspace-empty">
                  <CalendarDays size={32} />
                  <h3>Your first conversation is ahead.</h3>
                  <p>
                    Share your goals with Veronica and agree a time for your
                    lesson.
                  </p>
                  <Link className="button button-primary" href="/book">
                    Request an intro lesson
                  </Link>
                </div>
              )}
            </section>
            <section className="workspace-panel practice-prompt">
              <BookOpen size={28} />
              <p className="section-kicker">Between conversations</p>
              <h2>Keep your Italian moving.</h2>
              <p>
                Try a short activity and bring your questions to your next
                lesson.
              </p>
              <Link
                className="button button-dark"
                href="/dashboard?view=practice"
              >
                Find something to practise <ArrowRight size={18} />
              </Link>
            </section>
          </div>
          <section className="goal-summary">
            <div>
              <h2>Your learning goal</h2>
              <p>
                {profile.goal ||
                  "What would you love to do in Italian? Give your learning a direction."}
              </p>
            </div>
            <Link className="text-link" href="/dashboard?view=profile">
              Edit my profile <ArrowRight size={17} />
            </Link>
          </section>
        </>
      )}
      {view === "lessons" && (
        <section className="admin-section">
          <h2>Your lessons</h2>
          {!lessons.length && (
            <p>
              No scheduled or past lessons yet. Ask your teacher to agree a
              time.
            </p>
          )}
          {lessons.map((l) => (
            <article className="request-card" key={l.id}>
              <span className="badge">{l.status}</span>
              <h3>
                {l.startsAt.toLocaleString("en-GB", {
                  timeZone: profile.timezone || "Europe/Rome",
                })}
              </h3>
              <p>
                {profile.timezone || "Europe/Rome"} ·{" "}
                {Math.round(
                  (l.endsAt.getTime() - l.startsAt.getTime()) / 60000,
                )}{" "}
                minutes
              </p>
              {l.studentSummary && (
                <p className="preserve-lines">{l.studentSummary}</p>
              )}
            </article>
          ))}
        </section>
      )}
      {view === "credits" && (
        <section className="admin-section">
          <h2>Your packages</h2>
          {!allocations.length && <p>No lesson credits allocated yet.</p>}
          {allocations.map((a) => (
            <article className="request-card" key={a.id}>
              <h3>{a.label}</h3>
              <p>
                {a.remaining} of {a.credits} credits unreserved · Manual
                allocation
              </p>
              <p>
                {a.expiresAt
                  ? "Expires " +
                    a.expiresAt.toLocaleDateString("en-GB", { timeZone: "UTC" })
                  : "No expiry set"}
              </p>
              <details>
                <summary>Credit history</summary>
                {a.entries.map((e) => (
                  <p key={e.id}>
                    {e.delta > 0 ? "+" : ""}
                    {e.delta} · {e.reason} ·{" "}
                    {e.createdAt.toLocaleDateString("en-GB", {
                      timeZone: "UTC",
                    })}
                  </p>
                ))}
              </details>
            </article>
          ))}
        </section>
      )}
      {view === "profile" && (
        <div className="profile-workspace">
          <div className="profile-summary">
            <span className="profile-avatar" aria-hidden="true">
              {user.name.charAt(0)}
            </span>
            <h2>{user.name}</h2>
            <p>{user.email}</p>
            <small>Student · Learning with Veronica</small>
            <p>
              Your goal, time zone and confidence checklist help you keep track
              of your learning.
            </p>
          </div>
          <ProfileForm name={user.name} profile={profile} />
        </div>
      )}
      {view === "requests" && (
        <section className="workspace-panel">
          <h2>My requests</h2>
          <p>
            Requests are not confirmed bookings. Your teacher will agree
            availability with you.
          </p>{" "}
          {requests.length ? (
            requests.map((r) => (
              <article className="request-card" key={r.id}>
                <span className="badge">{r.status}</span>
                <p>{(r.data as { message: string }).message}</p>
                <small>
                  {r.createdAt.toLocaleDateString("en-GB", {
                    timeZone: "Europe/Rome",
                  })}{" "}
                  · Inquiry only
                </small>
              </article>
            ))
          ) : (
            <p className="notice">
              Your submitted requests will appear here when they use your
              account email.
            </p>
          )}
        </section>
      )}
      {view === "practice" && (
        <section className="practice-workspace">
          <p className="workspace-note">
            Short activities to explore at your own pace. Your lesson notes stay
            in My lessons.
          </p>
          <ResourceCards items={await resources()} />
          <Link className="text-link" href="/learn">
            Explore the full learning library <ArrowRight size={17} />
          </Link>
        </section>
      )}
    </WorkspaceShell>
  );
}
