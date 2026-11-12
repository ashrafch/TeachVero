import { notFound } from "next/navigation";
import Link from "next/link";
import { resources } from "@/server/repository";
import { Quiz } from "@/features/quiz";
export const dynamic = "force-dynamic";
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const r = (await resources()).find((r) => r.id === slug);
  return {
    title: r?.title || "Resource",
    description: r?.excerpt,
    alternates: { canonical: "/learn/" + slug },
  };
}
export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const r = (await resources()).find((r) => r.id === slug);
  if (!r) notFound();
  return (
    <article className="container article">
      <Link className="text-link" href="/learn">
        ← The learning corner
      </Link>
      <p className="eyebrow">
        {r.category} · {r.level}
      </p>
      <h1>{r.title}</h1>
      <p className="article-lead">{r.excerpt}</p>
      <div className="article-body">
        {r.body.split("\n\n").map((p, i) => (
          <p key={i}>{p}</p>
        ))}
      </div>
      <Quiz slug={slug} />
      <aside className="article-next">
        <p className="eyebrow">PUT IT INTO CONVERSATION</p>
        <h2>Try it with Veronica.</h2>
        <p>Bring this lesson and your questions to a personal introduction.</p>
        <Link
          className="button button-primary"
          href={
            "/book?goal=" +
            (slug === "your-first-conversation" ? "beginner" : "conversation")
          }
        >
          Practise together ↗
        </Link>
      </aside>
      <nav className="related-lessons" aria-label="Related lessons">
        <h3>Keep your Italian going</h3>
        {(await resources())
          .filter((a) => a.id !== slug)
          .slice(0, 2)
          .map((a) => (
            <Link className="text-link" key={a.id} href={"/learn/" + a.id}>
              {a.title} ↗
            </Link>
          ))}
      </nav>
      <a
        className="button button-outline"
        href="/conversation-starter.txt"
        download
      >
        Download the conversation starter ↓
      </a>
      <p className="muted">
        Original example learning content · not a proficiency assessment.
      </p>
    </article>
  );
}
