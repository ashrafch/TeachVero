import { redirect } from "next/navigation";
import { currentUser } from "@/server/auth";
import { prisma } from "@/server/db";
import { packages, resources } from "@/server/repository";
import { StatusControl, ContentEditor } from "@/features/admin";
import { SignOut } from "@/features/account";
export const dynamic = "force-dynamic";
export const metadata = {
  title: "Teacher workspace",
  robots: { index: false, follow: false },
};
export default async function Page() {
  const user = await currentUser();
  if (!user) redirect("/login");
  if (user.role !== "ADMIN") redirect("/dashboard");
  const [requests, leads, students, offers, articles, audits] =
    await Promise.all([
      prisma.bookingRequest.findMany({ orderBy: { createdAt: "desc" } }),
      prisma.lead.findMany({ orderBy: { createdAt: "desc" } }),
      prisma.user.findMany({
        where: { role: "STUDENT" },
        select: { id: true, name: true, email: true, profile: true },
      }),
      packages(),
      resources(),
      prisma.auditLog.findMany({ take: 10, orderBy: { createdAt: "desc" } }),
    ]);
  return (
    <section className="container section">
      <div className="section-heading">
        <div>
          <p className="eyebrow">TEACHER WORKSPACE · PRIVATE</p>
          <h1>
            A little order.
            <br />
            <em>More connection.</em>
          </h1>
        </div>
        <SignOut />
      </div>
      <div className="grid three dashboard-stats">
        <div className="stat-card">
          <p>Inquiries</p>
          <strong>{requests.length}</strong>
          <small>
            {requests.filter((r) => r.status === "NEW").length} awaiting review
          </small>
        </div>
        <div className="stat-card">
          <p>Guide requests</p>
          <strong>{leads.length}</strong>
          <small>Marketing consent stored separately</small>
        </div>
        <div className="stat-card">
          <p>Student accounts</p>
          <strong>{students.length}</strong>
          <small>Demo accounts are labelled by local email</small>
        </div>
      </div>
      <p className="notice">
        No analytics trackers are installed. Counts below come from saved
        records, not estimated conversion rates. Booking calendars, payments and
        email are not active.
      </p>
      <section className="admin-section">
        <h2>Booking inquiries</h2>
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
      <section className="admin-section">
        <h2>Packages</h2>
        <ContentEditor kind="package" items={offers} />
      </section>
      <section className="admin-section">
        <h2>Learning resources</h2>
        <ContentEditor kind="resource" items={articles} />
      </section>
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
            </article>
          ))
        ) : (
          <p>No guide requests yet.</p>
        )}
      </section>
      <section className="admin-section">
        <h2>Student directory</h2>
        {students.map((s) => (
          <article className="request-card" key={s.id}>
            <h3>{s.name}</h3>
            <p>{s.email}</p>
            <p>Goal: {(s.profile as { goal?: string }).goal || "Not set"}</p>
            <small>
              Teacher editing of student records and private lesson notes is
              pending.
            </small>
          </article>
        ))}
      </section>
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
    </section>
  );
}
