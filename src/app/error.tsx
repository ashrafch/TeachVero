"use client";
export default function ErrorPage({ reset }: { reset: () => void }) {
  return (
    <div className="container section">
      <p className="eyebrow">LET’S TRY THAT AGAIN</p>
      <h1>A small pause.</h1>
      <p>
        We couldn’t load this page. Check that the database container is
        running, then try again.
      </p>
      <button className="button button-primary" onClick={reset}>
        Try again
      </button>
    </div>
  );
}
