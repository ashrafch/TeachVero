export const metadata = { alternates: { canonical: "/" } };
import Link from "next/link";
import { ArrowUpRight, Globe, MessageCircle, Heart } from "lucide-react";
import { TeacherVisual } from "@/components/marketing/teacher-visual";
import { ResourceCards, PackageCards } from "@/components/marketing/cards";
import { FAQ } from "@/components/marketing/faq";
import { Reveal } from "@/components/marketing/reveal";
import { packages, resources } from "@/server/repository";
export const dynamic = "force-dynamic";
export default async function Home() {
  const [offers, articles] = await Promise.all([packages(), resources()]);
  return (
    <>
      <section className="container hero">
        <div className="hero-copy">
          <p className="eyebrow">
            <span className="tiny-sun">✳</span> ITALIAN, PERSONALLY. WITH
            VERONICA.
          </p>
          <h1>
            Italian for
            <br />
            your kind
            <br />
            of <em>life.</em>
            <span className="handwritten">La vita, in italiano.</span>
          </h1>
          <p className="hero-description">
            Personal online Italian lessons with Veronica.
            <br className="desktop-break" /> Practise the conversations you want
            to have: meeting someone, ordering a coffee or finding your way in
            Italy.
          </p>
          <div className="hero-buttons">
            <Link className="button button-primary" href="/book">
              Request an intro lesson <ArrowUpRight size={19} />
            </Link>
            <Link className="text-link" href="/learn">
              Try a little, for free <ArrowUpRight size={17} />
            </Link>
          </div>
          <p className="hero-note">
            <span /> One-to-one. Online. At your pace.
          </p>
        </div>
        <TeacherVisual />
      </section>
      <div className="value-strip">
        <div className="container">
          <span>
            <MessageCircle size={19} /> Real-life conversations
          </span>
          <i>✳</i>
          <span>
            <Heart size={19} /> A plan that feels like you
          </span>
          <i>✳</i>
          <span>
            <Globe size={19} /> Your world, a little more Italian
          </span>
        </div>
      </div>
      <Reveal>
        <section className="section container intro-layout">
          <div>
            <p className="eyebrow">NOT JUST A LANGUAGE. A WAY IN.</p>
            <h2>
              Less textbook.
              <br />
              More <em>“I’ve got this.”</em>
            </h2>
          </div>
          <div className="intro-copy">
            <p>
              Maybe Italy is your next adventure. Maybe it’s home, family, or a
              conversation you’ve been wanting to have.
            </p>
            <p>
              Whatever brought you here, your Italian should connect to your
              life. Personal lessons, useful practice, and space to be a
              beginner.
            </p>
            <Link className="text-link" href="/about">
              Meet Veronica and her approach <ArrowUpRight size={17} />
            </Link>
          </div>
        </section>
      </Reveal>
      <section className="section lesson-section">
        <div className="container">
          <div className="section-heading">
            <div>
              <p className="eyebrow">THERE’S MORE THAN ONE WAY TO BEGIN</p>
              <h2>
                Where will your
                <br />
                Italian take you?
              </h2>
            </div>
            <Link className="text-link" href="/lessons">
              Explore the lessons <ArrowUpRight size={18} />
            </Link>
          </div>
          <div className="grid three">
            <Link href="/lessons#beginning" className="path-card mint">
              <span className="path-icon">Aa</span>
              <p className="eyebrow">THE FIRST CIAO</p>
              <h3>
                Start from
                <br />
                the beginning.
              </h3>
              <p>
                Small steps. Solid foundations.
                <br />A whole new world of words.
              </p>
              <span className="circle-arrow">↗</span>
            </Link>
            <Link href="/lessons#conversation" className="path-card lavender">
              <span className="path-icon speech">“ ”</span>
              <p className="eyebrow">FIND YOUR WORDS</p>
              <h3>
                Speak a little.
                <br />
                Connect a lot.
              </h3>
              <p>
                Bring what you know to life
                <br />
                in real conversations.
              </p>
              <span className="circle-arrow">↗</span>
            </Link>
            <Link href="/lessons#tailored" className="path-card peach">
              <span className="path-icon">↗</span>
              <p className="eyebrow">MAKE IT PERSONAL</p>
              <h3>
                Your goals.
                <br />
                Your Italian.
              </h3>
              <p>
                Life in Italy, travel, connection.
                <br />
                Let’s work towards your next chapter.
              </p>
              <span className="circle-arrow">↗</span>
            </Link>
          </div>
        </div>
      </section>
      <section className="section container">
        <div className="section-heading">
          <div>
            <p className="eyebrow">FROM “ONE DAY” TO DAY ONE</p>
            <h2>
              A simple start.
              <br />A personal journey.
            </h2>
          </div>
          <p className="section-aside">
            You don’t need all the answers.
            <br />
            Just a little curiosity.
          </p>
        </div>
        <div className="grid three steps">
          {[
            [
              "01",
              "Tell me your why.",
              "Share your goals, your starting point and what you’d love to do in Italian.",
            ],
            [
              "02",
              "Find your way in.",
              "Discuss a lesson plan and availability with your teacher. No automatic booking.",
            ],
            [
              "03",
              "Make room for Italian.",
              "Learn, try it in your life, and build on it. One conversation at a time.",
            ],
          ].map(([n, t, d]) => (
            <div key={n}>
              <span className="step-number">{n}</span>
              <h3>{t}</h3>
              <p>{d}</p>
            </div>
          ))}
        </div>
      </section>
      <section className="section packages-section">
        <div className="container">
          <div className="section-heading">
            <div>
              <p className="eyebrow">A LITTLE STRUCTURE. ROOM TO GROW.</p>
              <h2>
                Good things start
                <br />
                with a small commitment.
              </h2>
            </div>
            <p className="section-aside">
              Demo package formats.
              <br />
              Prices and availability confirmed personally.
            </p>
          </div>
          <PackageCards items={offers} />
        </div>
      </section>
      <section className="section container">
        <div className="section-heading">
          <div>
            <p className="eyebrow">UN PO’ DI ITALIANO</p>
            <h2>
              A little Italian.
              <br />
              On the house.
            </h2>
          </div>
          <Link href="/learn" className="text-link">
            Explore the learning corner <ArrowUpRight size={18} />
          </Link>
        </div>
        <ResourceCards items={articles.slice(0, 3)} />
      </section>
      <section className="container teacher-note">
        <span className="giant-quote">“</span>
        <p>
          You don’t have to sound perfect.
          <br />
          You just have to <em>start.</em>
        </p>
        <small>
          THE TEACHVERO APPROACH · REAL STUDENT STORIES COMING WITH PERMISSION
        </small>
      </section>
      <FAQ />
    </>
  );
}
