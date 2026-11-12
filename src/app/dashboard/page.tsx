import { redirect } from "next/navigation";
import Link from "next/link";
import { currentUser } from "@/server/auth";
import { prisma } from "@/server/db";
import { ProfileForm, SignOut } from "@/features/account";
export const dynamic = "force-dynamic";
export const metadata = {
  title: "Your learning space",
  robots: { index: false, follow: false },
};
export default async function Page() {
  const user = await currentUser();
  if (!user) redirect("/login");
  if (user.role === "ADMIN") redirect("/admin");
  const requests = await prisma.bookingRequest.findMany({
    where: { email: user.email },
    orderBy: { createdAt: "desc" },
  });
  const profile = user.profile as {
    timezone?: string;
    goal?: string;
    progress?: string[];
  };
  return (
    <section className="container section">
      <div className="section-heading">
        <div>
          <p className="eyebrow">YOUR LEARNING SPACE</p>
          <h1>
            Ciao, <em>{user.name}.</em>
          </h1>
        </div>
        <SignOut />
      </div>
      <div className="grid three dashboard-stats">
        <div className="stat-card">
          <p>Upcoming lessons</p>
          <strong>0</strong>
          <small>No confirmed lessons yet.</small>
        </div>
        <div className="stat-card">
          <p>Lesson credits</p>
          <strong>0</strong>
          <small>No purchases or credit allocations.</small>
        </div>
        <div className="stat-card">
          <p>My inquiries</p>
          <strong>{requests.length}</strong>
          <small>Requests are not confirmed bookings.</small>
        </div>
      </div>
      <div className="dashboard-layout">
        <ProfileForm name={user.name} profile={profile} />
        <div>
          <h2>Your next step.</h2>
          <p>
            There are no scheduled or past lessons yet. Share your goals to
            discuss availability.
          </p>
          <Link className="button button-primary" href="/contact">
            Request a lesson ↗
          </Link>
          <h3 className="spaced">My requests</h3>
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
          <h3 className="spaced">A little practice between lessons</h3>
          <p>
            Start with the free lesson library. Personal teacher materials and
            lesson history will appear once lessons are managed.
          </p>
          <Link className="text-link" href="/learn">
            Open learning resources ↗
          </Link>
        </div>
      </div>
    </section>
  );
}
