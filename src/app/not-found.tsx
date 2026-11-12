import Link from "next/link";
export default function NotFound() {
  return (
    <div className="container section">
      <p className="eyebrow">404 · A LITTLE DETOUR</p>
      <h1>
        Let’s find
        <br />
        our way back.
      </h1>
      <Link className="button button-primary" href="/">
        Back to TeachVero ↗
      </Link>
    </div>
  );
}
