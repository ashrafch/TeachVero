import type { Metadata } from "next";
import Link from "next/link";
import { lessonTypes } from "@/lib/content";
export const metadata: Metadata = {
  title: "Personal Italian lessons",
  alternates: { canonical: "/lessons" },
};
export default function Page() {
  return (
    <>
      <section className="container page-intro">
        <p className="eyebrow">ONE LANGUAGE. SO MANY POSSIBILITIES.</p>
        <h1>
          Learn it for
          <br />
          <em>your reasons.</em>
        </h1>
        <p>
          Personal online lessons. A proposed 50-minute format.
          <br />
          Level, pace and availability agreed together.
        </p>
      </section>
      <section className="container section top-tight lesson-list">
        {lessonTypes.map(([n, t, tag, d], i) => (
          <article
            id={["beginning", "conversation", "tailored", "exam"][i]}
            key={n}
          >
            <span className="step-number">{n}</span>
            <div>
              <p className="eyebrow">{tag}</p>
              <h2>{t}</h2>
              <p>{d}</p>
            </div>
            <Link
              href={
                "/book?goal=" +
                ["beginner", "conversation", "travel", "exam"][i]
              }
              className="button button-outline"
            >
              Find out more ↗
            </Link>
          </article>
        ))}
      </section>
    </>
  );
}
