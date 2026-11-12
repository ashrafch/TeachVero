import { LoginForm } from "@/features/login-form";
export const metadata = {
  title: "Student & teacher sign-in",
  robots: { index: false, follow: false },
};
export default function Page() {
  return (
    <section className="container section contact-layout">
      <div>
        <p className="eyebrow">BENTORNATO · WELCOME BACK</p>
        <h1>
          A little space
          <br />
          for <em>your progress.</em>
        </h1>
        <p>Sign in to see your requests, learning goals and materials.</p>
        {process.env.NODE_ENV !== "production" && (
          <div className="notice">
            <strong>Local DEMO accounts — after seeding</strong>
            <p>
              Teacher: teacher@teachvero.local
              <br />
              <code>TeachVero-demo-2026!</code>
            </p>
            <p>
              Student: student@teachvero.local
              <br />
              <code>LearnItalian-2026!</code>
            </p>
            <small>
              These accounts are rejected in production. Do not use real student
              data in this preview.
            </small>
          </div>
        )}
      </div>
      <LoginForm />
    </section>
  );
}
