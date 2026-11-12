export const brand = {
  name: "TeachVero",
  tagline: "A little Italian. A lot more you.",
  email: null,
  teacherBio:
    "Veronica is an independent Italian teacher. Detailed biography and qualifications pending owner approval.",
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
};
export const initialPackages = [
  {
    id: "first-steps",
    name: "First steps",
    tag: "START SOMETHING GOOD",
    description: "Build your foundations, one useful conversation at a time.",
    lessons: 4,
    duration: 50,
    features: [
      "A plan built around your starting point",
      "Everyday vocabulary that stays with you",
      "Personal practice between lessons",
    ],
  },
  {
    id: "find-your-flow",
    name: "Find your flow",
    tag: "MAKE IT A HABIT",
    description: "Turn ‘I know the words’ into ‘I can say it’.",
    lessons: 8,
    duration: 50,
    features: [
      "Regular, guided conversation",
      "Feedback you can actually use",
      "A shared space for notes and progress",
    ],
  },
  {
    id: "your-italian",
    name: "Your Italian",
    tag: "A GOAL WITH YOUR NAME ON IT",
    description: "Work towards the moments that matter to you.",
    lessons: 12,
    duration: 50,
    features: [
      "Tailored learning goals",
      "Flexible topics and focused practice",
      "Regular progress check-ins",
    ],
  },
];
export const initialResources = [
  {
    id: "your-first-conversation",
    title: "Your first real Italian conversation",
    category: "EVERYDAY ITALIAN",
    level: "A1 · 5 min",
    excerpt: "Five small phrases that open a whole new world.",
    body: "Start with Ciao! This informal greeting works with friends and people your age. In a formal setting, choose Buongiorno (good morning or good day).\n\nTo introduce yourself, say Mi chiamo… (my name is…). Then ask Come ti chiami? (what is your name?). The formal version is Come si chiama?\n\nPiacere means nice to meet you. It is a complete, useful response after an introduction.\n\nTry this short exchange aloud: Ciao, mi chiamo Alex. Come ti chiami? — Mi chiamo Giulia. — Piacere!\n\nWhen you need time, say Puoi ripetere, per favore? (can you repeat, please?). Asking for repetition is part of communicating, not a failure.",
    color: "mint",
  },
  {
    id: "un-una-and-a-coffee",
    title: "Un, una… and a very good coffee",
    category: "GRAMMAR, SIMPLIFIED",
    level: "A1 · 4 min",
    excerpt: "Meet Italian articles at the café, not in a wall of rules.",
    body: "Italian nouns have grammatical gender. Un caffè means a coffee. Una spremuta means a freshly squeezed juice. Learn the article with each new noun.\n\nBefore a feminine noun starting with a vowel, una becomes un’: un’acqua. There is no apostrophe in un espresso, because espresso is masculine.\n\nSome masculine nouns use uno: uno studente, uno zaino. The pattern includes s plus a consonant and z.\n\nAt the counter, try: Un caffè, per favore. Then: Quanto costa? (how much does it cost?).\n\nPractice by making a short list: un cappuccino, una pizza, un’acqua. Say each phrase as one unit.",
    color: "lavender",
  },
  {
    id: "sound-more-italian",
    title: "Small sounds. Big difference.",
    category: "PRONUNCIATION",
    level: "A1–A2 · 6 min",
    excerpt: "A practical guide to c, ch and the beauty of double consonants.",
    body: "Before e or i, c usually sounds like the ch in chair: cena, cinema. Before a, o or u, it is a hard k sound: casa, cosa, cucina.\n\nAdding h keeps the hard sound before e and i: che, chi. Compare ci (soft) and chi (hard) slowly.\n\nDouble consonants last longer. Pala means shovel; palla means ball. Pause slightly on the double l.\n\nListen to a trusted dictionary recording, repeat slowly, then put the word into a sentence. Accuracy grows from noticing differences, not rushing.\n\nPractice: Chi cucina? (Who is cooking?). Then try: Ciao, cerco un caffè. Record yourself and notice where you can make the sounds clearer.",
    color: "peach",
  },
];
export const lessonTypes = [
  [
    "01",
    "Italian from the beginning",
    "A friendly place to start",
    "Build a useful foundation in everyday words, pronunciation and simple conversations. No previous Italian needed.",
  ],
  [
    "02",
    "Conversation, with confidence",
    "For the words you already know",
    "Make room to speak, make mistakes and find your rhythm. Topics connect to your interests and real life.",
  ],
  [
    "03",
    "Italian for your next chapter",
    "Life, travel & connection",
    "Prepare for a trip, life in Italy or conversations with the people you love. Your context shapes the lesson.",
  ],
  [
    "04",
    "A focused learning goal",
    "Tell us about a specific goal",
    "Discuss your target exam, level and timeline first. Exam coverage and availability are confirmed individually.",
  ],
];
export const faqs = [
  [
    "Do I need to speak Italian already?",
    "No. You can start with the very first words. Tell us your experience in the inquiry so your learning plan can start in the right place.",
  ],
  [
    "How do online lessons work?",
    "The proposed format is live one-to-one online teaching with guided practice. Platform, availability and meeting details are agreed personally before any lesson is confirmed.",
  ],
  [
    "Can I book and pay here?",
    "You can send an inquiry here. Online payments and instant scheduling are not active. An inquiry does not reserve a lesson or create a purchase.",
  ],
  [
    "What does a package cost?",
    "Prices are pending owner confirmation. Ask about the package that fits your goals; no payment is collected on this demo site.",
  ],
  [
    "What if my plans change?",
    "Cancellation and rescheduling policies are pending owner approval and must be agreed before a paid booking.",
  ],
];
