import { siteIndexable } from "@/lib/seo";
import localFont from "next/font/local";
import type { Metadata } from "next";
import { Header } from "@/components/marketing/header";
import { Footer } from "@/components/marketing/footer";
import { PublicChrome } from "@/components/public-chrome";
import { LearningGoalProvider } from "@/components/learning-goal-provider";
import "./globals.css";
const sans = localFont({
  src: [
    { path: "./fonts/sans.woff2", weight: "400", style: "normal" },
    { path: "./fonts/sans-semibold.woff2", weight: "600", style: "normal" },
  ],
  variable: "--font-sans",
  display: "swap",
});
const serif = localFont({
  src: [
    { path: "./fonts/serif.woff2", weight: "400", style: "normal" },
    { path: "./fonts/serif-italic.woff2", weight: "400", style: "italic" },
  ],
  variable: "--font-serif",
  display: "swap",
});
export const metadata: Metadata = {
  robots: { index: siteIndexable, follow: siteIndexable },
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
  ),
  title: {
    default: "TeachVero — Italian for your kind of life",
    template: "%s | TeachVero",
  },
  description:
    "Personal Italian lessons for real conversations. Find your starting point, explore free resources and inquire about learning with TeachVero.",
  openGraph: {
    title: "TeachVero — Italian for your kind of life",
    description: "A little Italian. A lot more you.",
    type: "website",
    images: ["/opengraph-image"],
  },
};
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" data-scroll-behavior="smooth">
      <body className={sans.variable + " " + serif.variable}>
        <LearningGoalProvider>
          <a className="skip-link" href="#main">
            Skip to content
          </a>
          <div className="demo-banner">
            DEMO PREVIEW <span>·</span> Inquiries are saved. Booking, payments
            and email are not active.
          </div>
          <PublicChrome>
            <Header />
          </PublicChrome>
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify({
                "@context": "https://schema.org",
                "@type": "WebSite",
                name: "TeachVero",
                url:
                  process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
                inLanguage: "en",
              }).replace(/</g, "\u003c"),
            }}
          />
          <main id="main">{children}</main>
          <PublicChrome>
            <Footer />
          </PublicChrome>
        </LearningGoalProvider>
      </body>
    </html>
  );
}
