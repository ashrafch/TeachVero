/** Editable learning examples, not course promises. */
export const learningGoals = [
  {
    id: "beginner",
    label: "Start from zero",
    title: "Your first conversation",
    phrase: "Ciao, mi chiamo…",
    translation: "Hi, my name is…",
    prompt: "A few words can start something good.",
    detail: "Build the foundations and practise useful phrases with Veronica.",
    slug: "beginning",
    word: "Ciao!",
  },
  {
    id: "conversation",
    label: "Speak with confidence",
    title: "Keep the conversation going",
    phrase: "E tu, cosa ne pensi?",
    translation: "And you, what do you think?",
    prompt: "Make room for your own point of view.",
    detail:
      "Bring your interests into a conversation and practise expressing your ideas.",
    slug: "conversation",
    word: "Parliamo.",
  },
  {
    id: "travel",
    label: "Life & travel in Italy",
    title: "Italian for the everyday",
    phrase: "Un caffè, per favore.",
    translation: "A coffee, please.",
    prompt: "Take your Italian out into the world.",
    detail:
      "Rehearse the situations you expect to meet, from a café to a new neighbourhood.",
    slug: "tailored",
    word: "Andiamo!",
  },
  {
    id: "exam",
    label: "Prepare for an exam",
    title: "A goal to work towards",
    phrase: "Il mio obiettivo è…",
    translation: "My goal is…",
    prompt: "Start by sharing the exam and level.",
    detail:
      "Discuss your target and timeline. Veronica will confirm whether preparation is available.",
    slug: "exam",
    word: "Pronti?",
  },
] as const;
