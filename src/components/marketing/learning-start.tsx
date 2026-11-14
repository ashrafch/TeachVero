"use client";
import { useState } from "react";
import Link from "next/link";
import { ArrowRight, BookOpen, Check, RotateCcw, Video } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { learningGoals } from "@/lib/learning-goals";
import { useLearningGoal } from "../learning-goal-provider";

export function LearningStart() {
  const { selected, setSelected } = useLearningGoal();
  const [translated, setTranslated] = useState(false);
  const reduced = useReducedMotion();
  const goal = learningGoals[selected];
  return (
    <section className="container learning-start">
      <div className="start-copy">
        <div className="teacher-chip">
          <span className="avatar-mini" aria-hidden="true">
            V
          </span>
          <span>
            Italian with Veronica{" "}
            <small>Your independent Italian teacher</small>
          </span>
        </div>
        <h1>
          Your Italian.
          <br />A real conversation.
        </h1>
        <p>
          Personal online lessons, built around what you want to say. Start
          where you are. Learn with Veronica.
        </p>
        <fieldset className="goal-picker">
          <legend>What brings you here?</legend>
          <div>
            {learningGoals.map((item, index) => (
              <label
                key={item.id}
                className={selected === index ? "selected" : ""}
              >
                <input
                  type="radio"
                  name="learning-goal"
                  value={item.id}
                  checked={selected === index}
                  onChange={() => {
                    setSelected(index);
                    setTranslated(false);
                  }}
                />
                <span>{item.label}</span>
                <Check size={16} aria-hidden="true" />
              </label>
            ))}
          </div>
        </fieldset>
        <Link
          className="button button-primary start-action"
          href={`/book?goal=${goal.id}`}
        >
          Request an intro lesson <ArrowRight size={19} />
        </Link>
        <p className="start-note">
          One-to-one · Online · Price & time agreed personally
        </p>
      </div>
      <div className="learning-preview">
        <div className="preview-top">
          <span>
            <BookOpen size={17} /> A little Italian, right now
          </span>
          <span className="preview-label">Try it</span>
        </div>
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={goal.id}
            initial={{ opacity: reduced ? 1 : 0, y: reduced ? 0 : 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: reduced ? 1 : 0 }}
            transition={{ duration: reduced ? 0 : 0.18 }}
            className="practice-scene"
          >
            <span className="scene-word" lang="it" aria-hidden="true">
              {goal.word}
            </span>
            <div className="phrase-card">
              <span className="phrase-label">A phrase to try</span>
              <p lang={translated ? "en" : "it"} aria-live="polite">
                {translated ? goal.translation : goal.phrase}
              </p>
              <button
                type="button"
                onClick={() => setTranslated(!translated)}
                aria-pressed={translated}
              >
                <RotateCcw size={16} />
                {translated ? "Back to Italian" : "Show meaning"}
              </button>
            </div>
            <p className="scene-caption">{goal.prompt}</p>
          </motion.div>
        </AnimatePresence>
        <div className="preview-plan" aria-live="polite">
          <span className="plan-icon">
            <Video size={22} />
          </span>
          <div>
            <h2>{goal.title}</h2>
            <p>{goal.detail}</p>
            <Link href={`/lessons/${goal.slug}`}>
              Explore this lesson <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
