"use client";
import { useState } from "react";
import { track } from "@/lib/events";
import { activities, gradeAnswer } from "@/lib/learning";
export function Quiz({ slug = "your-first-conversation" }: { slug?: string }) {
  const [answer, setAnswer] = useState("");
  const activity = activities[slug];
  if (!activity) return null;
  const result = gradeAnswer(slug, answer);
  return (
    <section className="quiz">
      <p className="eyebrow">Your turn</p>
      <h2>A tiny confidence check.</h2>
      <p>{activity.question}</p>
      <div className="quiz-options">
        {activity.options.map((option) => (
          <button
            key={option}
            aria-pressed={answer === option}
            className={
              "button button-outline " + (answer === option ? "selected" : "")
            }
            onClick={() => {
              setAnswer(option);
              track("content_engaged");
            }}
          >
            {option}
          </button>
        ))}
      </div>
      <p role="status">
        {result
          ? (result.correct ? "Esatto! " : "Try again. ") + result.explanation
          : "Choose an answer to see feedback."}
      </p>
      <p className="muted">
        Practice freely. This answer is not saved to your learner profile.
      </p>
    </section>
  );
}
