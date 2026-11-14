import Link from "next/link";
import { notFound } from "next/navigation";
import { lessonTracks } from "@/lib/lesson-tracks";

export function generateStaticParams() {
  return lessonTracks.map(({ slug }) => ({ slug }));
}
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const track = lessonTracks.find((t) => t.slug === slug);
  return {
    title: track?.title || "Lesson not found",
    description: track?.description,
    alternates: { canonical: "/lessons/" + slug },
  };
}
export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const track = lessonTracks.find((t) => t.slug === slug);
  if (!track) notFound();
  return (
    <article className="container article">
      <Link className="text-link" href="/lessons">
        All lesson types
      </Link>
      <h1>{track.title}</h1>
      <p className="article-lead">{track.description}</p>
      <section className="learning-objective">
        <h2>What you could work on</h2>
        <ul>
          {track.outcomes.map((o) => (
            <li key={o}>{o}</li>
          ))}
        </ul>
      </section>
      <div className="article-body">
        <h2>Your starting point shapes the lesson.</h2>
        <p>
          Tell Veronica what you already know, where you want to use Italian and
          what feels difficult. Agree a plan together before starting.
        </p>
        <h2>Format & availability</h2>
        <p>
          The proposed format is a live, one-to-one online lesson of 50 minutes.
          The platform, price, schedule and policies need personal confirmation.
          This preview does not take payments or reserve a slot.
        </p>
      </div>
      <Link className="button button-primary" href={"/book?goal=" + track.goal}>
        Ask about this lesson
      </Link>
    </article>
  );
}
