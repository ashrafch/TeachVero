import Link from "next/link";
import {
  ArrowRight,
  MessageCircle,
  CalendarDays,
  BookOpen,
} from "lucide-react";
import { LearningStart } from "@/components/marketing/learning-start";
import { resources } from "@/server/repository";
import { teacher } from "@/lib/teacher";
export const metadata = { alternates: { canonical: "/" } };
export const dynamic = "force-dynamic";
export default async function Home() {
  const articles = await resources();
  return (
    <div className="portal-home">
      <LearningStart />
      <section className="container start-steps" aria-label="How to start">
        <div>
          <MessageCircle size={22} />
          <span>
            <strong>Tell Veronica your goal</strong>
            <small>A short introduction, in your own words.</small>
          </span>
        </div>
        <div>
          <CalendarDays size={22} />
          <span>
            <strong>Agree a plan together</strong>
            <small>Discuss format, price and a time that works.</small>
          </span>
        </div>
        <div>
          <BookOpen size={22} />
          <span>
            <strong>Keep your learning in one place</strong>
            <small>Lessons, credits and practice in your space.</small>
          </span>
        </div>
      </section>
      <section className="container personal-section">
        <div className="personal-profile">
          <div
            className="profile-monogram"
            aria-label="Veronica portrait placeholder"
          >
            V<span>Portrait coming soon</span>
          </div>
          <div>
            <p className="section-kicker">Meet your teacher</p>
            <h2>
              One teacher. <br />
              Your own way forward.
            </h2>
            <p>{teacher.story}</p>
            <Link className="text-link" href="/about">
              Meet Veronica <ArrowRight size={18} />
            </Link>
          </div>
        </div>
        <aside className="format-panel">
          <span className="format-mark" aria-hidden="true">
            1:1
          </span>
          <h3>
            A little structure. <br />
            Room for you.
          </h3>
          <p>
            Explore the proposed lesson packages, then talk through the right
            format for your goals.
          </p>
          <p className="muted">Demo formats. Prices confirmed personally.</p>
          <Link className="button button-dark" href="/pricing">
            Explore lesson packages <ArrowRight size={18} />
          </Link>
          <Link className="text-link" href="/faq">
            Questions before you start?
          </Link>
        </aside>
      </section>
      <section className="container home-practice">
        <div className="section-heading">
          <div>
            <p className="section-kicker">Your learning starts here</p>
            <h2>Try a little Italian.</h2>
          </div>
          <Link className="text-link" href="/learn">
            All free resources <ArrowRight size={18} />
          </Link>
        </div>
        <div className="practice-links">
          {articles.slice(0, 3).map((article, i) => (
            <Link
              className="practice-link"
              key={article.id}
              href={"/learn/" + article.id}
            >
              <span className={"practice-tile tile-" + i} aria-hidden="true">
                {["Ciao!", "un / una", "chi · ci"][i]}
              </span>
              <span>
                <small>
                  {article.category} · {article.level}
                </small>
                <h3>{article.title}</h3>
              </span>
              <ArrowRight size={20} />
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
