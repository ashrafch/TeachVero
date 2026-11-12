import { Suspense } from "react";
import Link from "next/link";
import { InquiryForm } from "@/features/forms";
export const metadata = {
  title: "Contact Veronica",
  description:
    "A question about learning Italian? Send Veronica a personal message.",
  alternates: { canonical: "/contact" },
};
export default function Page() {
  return (
    <section className="container section contact-layout">
      <div>
        <p className="eyebrow">A CONVERSATION BEFORE THE CONVERSATION</p>
        <h1>
          Let’s find
          <br />
          <em>your Italian.</em>
        </h1>
        <p>
          A question, a particular goal, or simply not sure where to start?
          Leave Veronica a message.
        </p>
        <p>
          Ready to talk about lessons?{" "}
          <Link className="text-link" href="/book">
            Request an introduction ↗
          </Link>
        </p>
        <div className="notice">
          <strong>Preview: messages are saved for review.</strong>
          <p>
            Email delivery is not active yet. This message does not reserve a
            lesson.
          </p>
        </div>
      </div>
      <Suspense fallback={<p role="status">Preparing your message…</p>}>
        <InquiryForm packages={[]} variant="contact" />
      </Suspense>
    </section>
  );
}
