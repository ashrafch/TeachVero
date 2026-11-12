import Link from "next/link";
import { ArrowUpRight, Check } from "lucide-react";
import type { PackageData, ResourceData } from "@/server/repository";
export function PackageCards({ items }: { items: PackageData[] }) {
  if (!items.length)
    return (
      <div className="notice">
        <h3>Let’s find a format together.</h3>
        <p>
          No lesson packages are listed right now. You can still share your
          goals with Veronica.
        </p>
        <Link className="text-link" href="/book">
          Send a general lesson request ↗
        </Link>
      </div>
    );
  return (
    <div className="grid three">
      {items.map((p, i) => (
        <article
          className={"package-card " + (i === 1 ? "featured" : "")}
          key={p.id}
        >
          <p className="eyebrow">{p.tag}</p>
          <h3>{p.name}</h3>
          <p>{p.description}</p>
          <div className="package-quantity">
            {p.lessons}
            <span>
              personal lessons
              <br />
              {p.duration} minutes each · proposed format
            </span>
          </div>
          <p className="price">
            Price on inquiry <small>Pending owner confirmation</small>
          </p>
          <ul>
            {p.features.map((f) => (
              <li key={f}>
                <Check size={16} />
                {f}
              </li>
            ))}
          </ul>
          <Link
            className={"button " + (i === 1 ? "button-dark" : "button-outline")}
            href={"/book?package=" + p.id}
          >
            Ask about this package <ArrowUpRight size={17} />
          </Link>
        </article>
      ))}
    </div>
  );
}
export function ResourceCards({ items }: { items: ResourceData[] }) {
  return (
    <div className="grid three">
      {items.map((r, i) => (
        <Link className="resource-card" href={"/learn/" + r.id} key={r.id}>
          <div className={"resource-art " + r.color}>
            <span className="resource-word">
              {(
                {
                  "your-first-conversation": "Ciao!",
                  "un-una-and-a-coffee": "un caffè,\nper favore.",
                  "sound-more-italian": "chi · ci",
                } as Record<string, string>
              )[r.id] || "Italiano"}
            </span>
            <span className="art-number">0{i + 1} / UN PO’ DI ITALIANO</span>
            <span className="circle-arrow">↗</span>
          </div>
          <div className="resource-copy">
            <p className="eyebrow">
              {r.category} <span>{r.level}</span>
            </p>
            <h3>{r.title}</h3>
            <p>{r.excerpt}</p>
          </div>
        </Link>
      ))}
    </div>
  );
}
