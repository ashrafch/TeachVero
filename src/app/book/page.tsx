import { Suspense } from "react";
import Link from "next/link";
import { packages } from "@/server/repository";
import { InquiryForm } from "@/features/forms";
export const dynamic = "force-dynamic";
export const metadata = {
  title: "Request an intro lesson with Veronica",
  description:
    "Share your Italian learning goals with Veronica. Send a real lesson request; availability and price are confirmed personally.",
  alternates: { canonical: "/book" },
};
export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ package?: string }>;
}) {
  const params = await searchParams;
  const items = await packages();
  return (
    <section className="container section booking-layout">
      <div className="booking-intro">
        <p className="eyebrow">YOUR FIRST CONVERSATION STARTS HERE</p>
        <h1>
          Your Italian.
          <br />
          <em>Let’s begin.</em>
        </h1>
        <p>
          Tell Veronica where you’d like Italian to take you. Availability and a
          written price are agreed personally.
        </p>
        <p className="muted">
          A request, not a confirmed booking. No payment collected.
        </p>
        {params.package && !items.some((p) => p.id === params.package) && (
          <p role="status" className="notice">
            That package is no longer listed. You can still send a general
            inquiry.
          </p>
        )}
      </div>
      <div className="booking-request">
        <Suspense fallback={<p role="status">Preparing your request…</p>}>
          <InquiryForm
            packages={items.map(({ id, name, lessons, duration }) => ({
              id,
              name,
              lessons,
              duration,
            }))}
          />
        </Suspense>
      </div>
      <aside className="booking-explainer">
        <h2>What happens next?</h2>
        <ol className="booking-steps">
          <li>
            <strong>Share your goals</strong>
            <span>A short request, right here.</span>
          </li>
          <li>
            <strong>Discuss the details</strong>
            <span>Agree availability, format and a written quote.</span>
          </li>
          <li>
            <strong>Confirm together</strong>
            <span>A lesson is booked only after personal confirmation.</span>
          </li>
        </ol>
        <p className="muted">
          Preview: requests are saved for review. Email delivery and instant
          scheduling are not active.
        </p>
        <Link className="text-link" href="/contact">
          Have a question first? Contact Veronica ↗
        </Link>
        <Link className="text-link" href="/pricing">
          Compare the packages ↗
        </Link>
      </aside>
    </section>
  );
}
