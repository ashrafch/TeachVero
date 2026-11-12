import { MobileCTA } from "./mobile-cta";
import { PrivacyControls } from "./privacy-controls";
import Link from "next/link";
export function Footer() {
  return (
    <>
      <section className="closing">
        <div className="container closing-inner">
          <div>
            <p className="eyebrow">YOUR NEXT CHAPTER STARTS WITH CIAO</p>
            <h2>
              Make Italian part
              <br />
              of your everyday.
            </h2>
          </div>
          <Link className="button button-primary" href="/book">
            Find your starting point <span>↗</span>
          </Link>
        </div>
      </section>
      <footer className="container footer">
        <div>
          <Link href="/" className="wordmark">
            teach<span>vero</span>
            <i>✳</i>
          </Link>
          <p>Real conversations. Your kind of Italian.</p>
          <small>DEMO · Business details pending owner review.</small>
        </div>
        <div className="footer-links">
          <Link href="/about">Meet your teacher</Link>
          <Link href="/learn">A little Italian, free</Link>
          <Link href="/contact">Get in touch</Link>
          <Link href="/login">Student & teacher space</Link>
        </div>
        <div className="footer-links">
          {["privacy", "cookies", "terms", "cancellation", "business"].map(
            (p) => (
              <Link key={p} href={"/legal/" + p}>
                {p.charAt(0).toUpperCase() + p.slice(1)}
              </Link>
            ),
          )}
        </div>
        <PrivacyControls />
        <p className="footer-bottom">
          © {new Date().getFullYear()} TeachVero · Made for a world of
          conversations.
        </p>
      </footer>
      <MobileCTA />
    </>
  );
}
