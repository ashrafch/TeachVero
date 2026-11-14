import Link from "next/link";
import { resources } from "@/server/repository";
export const dynamic = "force-dynamic";
export const metadata = {
  title: "Notes on learning Italian",
  description:
    "Practical reading on Italian sounds, everyday language and your first conversations.",
  alternates: { canonical: "/blog" },
};
export default async function Page() {
  const articles = await resources();
  return (
    <>
      <section className="container page-intro">
        <h1>A few words about Italian.</h1>
        <p>
          Short reads to bring the language into your day. Original sample
          articles, awaiting teacher review.
        </p>
      </section>
      <section className="container section top-tight">
        <div className="grid three">
          {articles.map((a) => (
            <article className="request-card" key={a.id}>
              <p>{a.category}</p>
              <h2>{a.title}</h2>
              <p>{a.excerpt}</p>
              <Link className="text-link" href={"/blog/" + a.id}>
                Read the article
              </Link>
            </article>
          ))}
        </div>
      </section>
    </>
  );
}
