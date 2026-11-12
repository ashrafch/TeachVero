import Image from "next/image";
import { teacher } from "@/lib/teacher";
export function TeacherVisual() {
  return (
    <figure className="teacher-visual">
      <div className="portrait-slot">
        <span className="portrait-word" aria-hidden="true">
          V<span>.</span>
        </span>
        <span className="portrait-caption">
          A PLACE FOR VERONICA’S PORTRAIT
          <br />
          Authentic photo coming soon
        </span>
        <div className="portrait-stamp" aria-hidden="true">
          PARLIAMO
          <br />
          <em>italiano.</em>
        </div>
      </div>
      <figcaption>
        <div>
          <strong>{teacher.name}</strong>
          <span>{teacher.role}</span>
        </div>
        <span className="teacher-signature">Piacere!</span>
      </figcaption>
      <Image
        className="postcard-detail"
        src="/italian-scene.svg"
        width={140}
        height={140}
        alt="An illustrated Italian doorway and espresso"
      />
    </figure>
  );
}
