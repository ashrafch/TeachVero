"use client";
import { useState } from "react";
import { track } from "@/lib/events";
const activities: Record<
  string,
  { question: string; options: string[]; correct: string; explanation: string }
> = {
  "your-first-conversation": {
    question: "You have just met someone. How do you say “nice to meet you”?",
    options: ["Piacere!", "Quanto costa?", "Buonanotte!"],
    correct: "Piacere!",
    explanation:
      "Piacere means nice to meet you. Quanto costa asks the price; buonanotte means good night.",
  },
  "un-una-and-a-coffee": {
    question: "Which article goes with the feminine noun acqua?",
    options: ["Un’acqua", "Un acqua", "Uno acqua"],
    correct: "Un’acqua",
    explanation:
      "Una loses its a before a feminine noun beginning with a vowel: un’acqua.",
  },
  "sound-more-italian": {
    question: "Which word has a hard c sound, like k?",
    options: ["Chi", "Cinema", "Cena"],
    correct: "Chi",
    explanation:
      "The h keeps c hard before i or e. In cinema and cena, c has a soft sound.",
  },
};
export function Quiz({ slug = "your-first-conversation" }: { slug?: string }) {
  const [answer, setAnswer] = useState("");
  const q = activities[slug];
  if (!q) return null;
  return (
    <section className="quiz">
      <p className="eyebrow">YOUR TURN</p>
      <h2>A tiny confidence check.</h2>
      <p>{q.question}</p>
      <div className="quiz-options">
        {q.options.map((a) => (
          <button
            key={a}
            aria-pressed={answer === a}
            className={
              "button button-outline " + (answer === a ? "selected" : "")
            }
            onClick={() => {
              setAnswer(a);
              track("content_engaged");
            }}
          >
            {a}
          </button>
        ))}
      </div>
      <p role="status">
        {answer
          ? (answer === q.correct ? "Esatto! " : "Try again. ") + q.explanation
          : "Choose an answer to see feedback."}
      </p>
    </section>
  );
}
