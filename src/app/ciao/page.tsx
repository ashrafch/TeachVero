import Link from "next/link";
import { TeacherVisual } from "@/components/marketing/teacher-visual";
export const metadata = {
  title: "From your feed to your first Italian conversation",
  description:
    "Meet Veronica and take your next step in Italian. Try a free mini-lesson or send a personal introduction request.",
  alternates: { canonical: "/ciao" },
};
export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ utm_campaign?: string }>;
}) {
  const q = await searchParams;
  const campaign = (q.utm_campaign || "social-ciao").slice(0, 100);
  return (
    <section className="container social-intro">
      <div>
        <p className="eyebrow">FROM YOUR FEED TO A REAL CONVERSATION</p>
        <h1>
          You’ve found
          <br />
          your next
          <br />
          <em>“ciao”.</em>
        </h1>
        <p className="editorial-lead">
          I’m Veronica. Bring your curiosity, your questions and your reason for
          learning Italian.
        </p>
        <Link
          className="button button-primary"
          href={"/book?utm_campaign=" + encodeURIComponent(campaign)}
        >
          Request an intro lesson ↗
        </Link>
        <p className="muted">
          A request, not a confirmed appointment. No payment required to
          inquire.
        </p>
        <Link className="text-link" href="/learn/your-first-conversation">
          Start with a free five-minute lesson ↗
        </Link>
      </div>
      <TeacherVisual />
    </section>
  );
}
