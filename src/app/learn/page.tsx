import type { Metadata } from "next";
import { resources } from "@/server/repository";
import { ResourceLibrary } from "@/features/resource-library";
import { LeadForm } from "@/features/forms";
export const metadata: Metadata = {
  title: "Free Italian learning corner",
  description:
    "Practise greetings, café vocabulary and Italian pronunciation with free mini-lessons, worked examples and interactive quizzes.",
  alternates: { canonical: "/learn" },
};
export const dynamic = "force-dynamic";
export default async function Page() {
  return (
    <>
      <section className="container page-intro">
        <p className="eyebrow">THE LEARNING CORNER</p>
        <h1>
          Small lessons.
          <br />
          <em>Lovely discoveries.</em>
        </h1>
        <p>
          A few useful words. A rule that finally clicks.
          <br />
          Make a little room for Italian today.
        </p>
      </section>
      <section className="section container top-tight">
        <ResourceLibrary items={await resources()} />
      </section>
      <section className="container lead-section" id="guide">
        <div>
          <p className="eyebrow">YOUR FIRST FIVE MINUTES IN ITALIAN</p>
          <h2>
            Take a little
            <br />
            Italian with you.
          </h2>
          <p>
            Get the printable conversation starter.
            <br />
            The guide opens here after signup; no email is sent.
          </p>
        </div>
        <LeadForm />
      </section>
    </>
  );
}
