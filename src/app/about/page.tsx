import Link from "next/link";
import { TeacherVisual } from "@/components/marketing/teacher-visual";
import { teacher, method } from "@/lib/teacher";
export const metadata = {
  title: "Meet Veronica — your Italian teacher",
  description:
    "Meet Veronica, an independent Italian teacher. Explore a personal approach to learning Italian.",
  alternates: { canonical: "/about" },
};
export default function Page() {
  return (
    <>
      <section className="container personal-intro">
        <div>
          <p className="eyebrow">THE PERSON BEHIND TEACHVERO</p>
          <h1>
            Ciao, I’m
            <br />
            <em>Veronica.</em>
          </h1>
          <p className="editorial-lead">{teacher.intro}</p>
          <p>{teacher.story}</p>
          <Link className="button button-primary" href="/book">
            Request an intro lesson ↗
          </Link>
        </div>
        <TeacherVisual />
      </section>
      <section className="container section method-section">
        <div>
          <p className="eyebrow">A PERSONAL WAY INTO ITALIAN</p>
          <h2>
            Your life is
            <br />
            the <em>starting point.</em>
          </h2>
          <p className="section-aside">
            A proposed learning approach to discuss together at your
            introduction.
          </p>
        </div>
        <div>
          {method.map((m, i) => (
            <article className="method-row" key={m.title}>
              <span>0{i + 1}</span>
              <div>
                <h3>{m.title}</h3>
                <p>{m.text}</p>
              </div>
            </article>
          ))}
        </div>
      </section>
      <section className="container profile-details">
        <div>
          <p className="eyebrow">GOOD TO KNOW</p>
          <h2>
            A direct relationship.
            <br />
            Room to be yourself.
          </h2>
          <p>
            Speak to Veronica about your experience, the situations you find
            difficult and how you like to learn. Starting from zero is a
            perfectly good starting point.
          </p>
        </div>
        <div className="profile-facts">
          <h3>Before we start</h3>
          <dl>
            <dt>Teaching format</dt>
            <dd>Personal online lessons; details agreed together.</dd>
            <dt>Learning goals</dt>
            <dd>
              Beginnings, everyday conversation, life and travel in Italy.
            </dd>
            <dt>Specialist requests</dt>
            <dd>
              Exam and professional Italian coverage must be confirmed
              individually.
            </dd>
            <dt>Professional profile</dt>
            <dd>
              Detailed biography and qualifications awaiting verification.
            </dd>
            <dt>Meet Veronica on video</dt>
            <dd>Introduction video awaiting upload.</dd>
          </dl>
        </div>
      </section>
      <section className="container section">
        <p className="eyebrow">TRUST, BUILT IN CONVERSATION</p>
        <h2>Your questions belong here.</h2>
        <p className="editorial-lead">
          There are no published student reviews yet. Have a conversation with
          Veronica to decide whether the approach feels right for you.
        </p>
        <Link className="text-link" href="/contact">
          Ask Veronica a question ↗
        </Link>
      </section>
    </>
  );
}
