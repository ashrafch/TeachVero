import { faqs } from "@/lib/content";
export function FAQ() {
  return (
    <section className="section container faq-layout">
      <div>
        <p className="eyebrow">A FEW GOOD QUESTIONS</p>
        <h2>
          Wondering
          <br />
          about something?
        </h2>
        <p>
          Learning something new comes with questions.
          <br />
          Let’s make the first step feel simple.
        </p>
      </div>
      <div>
        {faqs.map(([q, a]) => (
          <details key={q}>
            <summary>
              {q}
              <span>+</span>
            </summary>
            <p>{a}</p>
          </details>
        ))}
      </div>
    </section>
  );
}
