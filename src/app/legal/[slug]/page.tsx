import { notFound } from "next/navigation";
const sections: Record<string, { title: string; paragraphs: string[] }> = {
  privacy: {
    title: "Privacy notice — draft",
    paragraphs: [
      "This local preview stores inquiry names, email addresses, learning goals, time zones, message text and optional campaign labels in the project PostgreSQL database. Guide requests store name, email and consent choices. Account profiles and administrative changes are also stored.",
      "Inquiry processing consent and optional marketing consent are separate. No advertising trackers or external analytics providers are installed. Optional measurement, controlled in the footer, emits local page/event names only after consent; no measurement data leaves this site. No email provider is connected. Essential authentication cookies support sign-in.",
      "Before publication, the owner must provide controller identity and contact, lawful bases, retention periods, processors, international transfer details, data-subject rights and the supervisory authority. Do not enter real student data until this notice has been reviewed.",
    ],
  },
  cookies: {
    title: "Cookies — draft",
    paragraphs: [
      "Only essential authentication and CSRF cookies are used for signing in. No optional analytics or advertising cookies are installed, so this preview has no optional-cookie consent banner.",
      "The footer measurement preference is stored in localStorage (teachvero.analytics) until changed or browser storage is cleared. It can be withdrawn at any time. Any future tracking integration must wait for applicable consent and include a way to withdraw it. Cookie durations and provider details must be reviewed before launch.",
    ],
  },
  terms: {
    title: "Terms of service — draft",
    paragraphs: [
      "This preview accepts inquiries, not binding bookings or purchases. Prices, lesson availability, delivery platforms and commercial terms must be agreed personally.",
      "Owner identity, governing terms, consumer information and dispute procedures require professional review before the site accepts real business.",
    ],
  },
  cancellation: {
    title: "Cancellation & refunds — pending",
    paragraphs: [
      "No cancellation window, refund promise or rescheduling policy has been approved. No payment is collected on this site.",
      "The owner must supply lesson cancellation deadlines, package expiry rules, refund eligibility and applicable consumer rights before any paid booking.",
    ],
  },
  business: {
    title: "Business information — pending",
    paragraphs: [
      "Legal business name, registered address, contact email, VAT or tax identification and any required professional disclosures are pending owner input.",
      "Do not publish this preview as a complete commercial service until these fields are approved.",
    ],
  },
};
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  return {
    title: sections[(await params).slug]?.title || "Legal",
    robots: { index: false, follow: false },
  };
}
export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const s = sections[(await params).slug];
  if (!s) notFound();
  return (
    <article className="container article">
      <p className="eyebrow">DEMO · PROFESSIONAL REVIEW REQUIRED</p>
      <h1>{s.title}</h1>
      {s.paragraphs.map((p) => (
        <p key={p}>{p}</p>
      ))}
      <div className="notice">
        This page is an explicit placeholder, not approved legal advice or final
        policy.
      </div>
    </article>
  );
}
