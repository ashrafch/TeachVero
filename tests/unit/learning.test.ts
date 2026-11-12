import { describe, it, expect } from "vitest";
import { activities, gradeAnswer } from "../../src/lib/learning";
describe("educational feedback", () => {
  it.each(Object.keys(activities))(
    "grades correct and incorrect choices for %s",
    (slug) => {
      const activity = activities[slug];
      expect(gradeAnswer(slug, activity.correct)?.correct).toBe(true);
      for (const option of activity.options.filter(
        (o) => o !== activity.correct,
      ))
        expect(gradeAnswer(slug, option)).toEqual({
          correct: false,
          explanation: activity.explanation,
        });
    },
  );
  it("does not invent a grade for missing lessons or unknown answers", () => {
    expect(gradeAnswer("unknown", "Piacere!")).toBeNull();
    expect(gradeAnswer("your-first-conversation", "<script>")).toBeNull();
  });
});
