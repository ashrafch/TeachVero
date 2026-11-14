import { lessonTypes } from "./content";

const details = [
  {
    slug: "beginning",
    goal: "beginner",
    outcomes: [
      "Introduce yourself and ask simple questions",
      "Practise useful sounds and everyday phrases",
      "Build short exchanges at a pace that suits you",
    ],
  },
  {
    slug: "conversation",
    goal: "conversation",
    outcomes: [
      "Practise talking about your interests",
      "Notice patterns in your spoken Italian",
      "Develop ways to keep a conversation going",
    ],
  },
  {
    slug: "tailored",
    goal: "travel",
    outcomes: [
      "Rehearse situations you expect to meet",
      "Build vocabulary around your own context",
      "Practise asking for help and clarifying meaning",
    ],
  },
  {
    slug: "exam",
    goal: "exam",
    outcomes: [
      "Discuss the specific exam and target level",
      "Identify the skills and timeline to work on",
      "Confirm whether preparation is available before booking",
    ],
  },
];
export const lessonTracks = details.map((d, i) => ({
  ...d,
  title: lessonTypes[i][1],
  description: lessonTypes[i][3],
}));
