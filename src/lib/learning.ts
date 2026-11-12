export type LearningActivity = {
  objective: string;
  prerequisite: string;
  question: string;
  options: string[];
  correct: string;
  explanation: string;
};
export const activities: Record<string, LearningActivity> = {
  "your-first-conversation": {
    objective: "Introduce yourself and respond when you meet someone.",
    prerequisite: "No previous Italian needed.",
    question: "You have just met someone. How do you say “nice to meet you”?",
    options: ["Piacere!", "Quanto costa?", "Buonanotte!"],
    correct: "Piacere!",
    explanation:
      "Piacere means nice to meet you. Quanto costa asks the price; buonanotte means good night.",
  },
  "un-una-and-a-coffee": {
    objective: "Choose un, una or un’ when ordering something at a café.",
    prerequisite: "Know that Italian nouns can be masculine or feminine.",
    question: "Which article goes with the feminine noun acqua?",
    options: ["Un’acqua", "Un acqua", "Uno acqua"],
    correct: "Un’acqua",
    explanation:
      "Una loses its a before a feminine noun beginning with a vowel: un’acqua. The apostrophe marks the missing a.",
  },
  "sound-more-italian": {
    objective:
      "Recognize the difference between soft c and hard ch before i or e.",
    prerequisite: "Be comfortable reading short Italian words.",
    question: "Which word has a hard c sound, like k?",
    options: ["Chi", "Cinema", "Cena"],
    correct: "Chi",
    explanation:
      "The h keeps c hard before i or e. In cinema and cena, c has a soft sound.",
  },
};
export function gradeAnswer(slug: string, answer: string) {
  const activity = activities[slug];
  if (!activity || !activity.options.includes(answer)) return null;
  return {
    correct: answer === activity.correct,
    explanation: activity.explanation,
  };
}
