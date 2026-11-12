import Link from "next/link";
import { packages } from "@/server/repository";
import { PackageCards } from "@/components/marketing/cards";
import { FAQ } from "@/components/marketing/faq";
export const dynamic = "force-dynamic";
export const metadata = {
  title: "Lesson packages & pricing",
  description:
    "Compare personal Italian lesson formats, duration and what is included. Request a quote from Veronica before committing.",
  alternates: { canonical: "/pricing" },
};
export default async function Page() {
  const items = await packages();
  return (
    <>
      <section className="container page-intro pricing-intro">
        <p className="eyebrow">A LITTLE STRUCTURE. YOUR OWN PACE.</p>
        <h1>
          Invest in your
          <br />
          <em>Italian everyday.</em>
        </h1>
        <p>
          One teacher. Personal lessons. A plan you understand before you
          commit.
        </p>
        <div className="pricing-disclosure">
          <strong>Let’s be clear about pricing.</strong>
          <p>
            Amounts and currency have not been approved yet. These are proposed
            formats, not offers for sale. Request a written quote covering the
            total, currency, taxes and policies before agreeing to lessons.
          </p>
        </div>
      </section>
      <section className="container section top-tight">
        <PackageCards items={items} />
      </section>
      <section className="container comparison-section">
        <p className="eyebrow">THE DETAILS, SIDE BY SIDE</p>
        <h2>Find your rhythm.</h2>
        <div
          className="comparison-scroll"
          tabIndex={0}
          role="region"
          aria-label="Lesson package comparison"
        >
          <table>
            <caption>
              Proposed package formats — price and availability on inquiry
            </caption>
            <thead>
              <tr>
                <th scope="col">What’s included</th>
                {items.map((p) => (
                  <th scope="col" key={p.id}>
                    {p.name}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr>
                <th scope="row">Personal lessons</th>
                {items.map((p) => (
                  <td key={p.id}>{p.lessons}</td>
                ))}
              </tr>
              <tr>
                <th scope="row">Session length</th>
                {items.map((p) => (
                  <td key={p.id}>{p.duration} minutes</td>
                ))}
              </tr>
              <tr>
                <th scope="row">Price & currency</th>
                {items.map((p) => (
                  <td key={p.id}>Quote required</td>
                ))}
              </tr>
              <tr>
                <th scope="row">Expiry & cancellation</th>
                {items.map((p) => (
                  <td key={p.id}>Agree before booking</td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
        <div className="policy-grid">
          <article>
            <h3>Before you commit</h3>
            <p>
              Veronica confirms fit, availability and a written price. Sending
              an inquiry carries no payment obligation.
            </p>
          </article>
          <article>
            <h3>If plans change</h3>
            <p>
              Cancellation, rescheduling and package validity are pending
              approval. Agree these terms before purchasing.
            </p>
            <Link className="text-link" href="/legal/cancellation">
              Policy status ↗
            </Link>
          </article>
        </div>
      </section>
      <FAQ />
    </>
  );
}
