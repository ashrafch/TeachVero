import Link from "next/link";
import { FAQ } from "@/components/marketing/faq";
export const metadata = {
  title: "Italian lesson questions",
  description:
    "How online lessons, inquiries, packages and scheduling work at TeachVero.",
  alternates: { canonical: "/faq" },
};
export default function Page() {
  return (
    <>
      <section className="container page-intro">
        <h1>A little clarity before you begin.</h1>
        <p>Find out how to start and which details to agree with Veronica.</p>
      </section>
      <FAQ />
      <section className="container section top-tight">
        <p>
          Package expiry, cancellation and refund terms require owner approval
          and must be agreed before a paid booking.
        </p>
        <Link href="/contact" className="button button-primary">
          Ask another question
        </Link>
      </section>
    </>
  );
}
