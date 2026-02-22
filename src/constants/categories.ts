export type Season = "spring" | "summer" | "autumn" | "winter";

export interface CategoryStepConfig {
  step: "1" | "2" | "3" | "4";
  title: string;
  description: string;
  season: Season;
  emoji: string;
}

export const CATEGORIES: CategoryStepConfig[] = [
  {
    step: "1",
    title: "What do I love doing?",
    description: "Activities and experiences that bring you joy and fulfillment.",
    season: "spring",
    emoji: "🌸",
  },
  {
    step: "2",
    title: "What am I good at?",
    description: "Skills and strengths that come naturally to you.",
    season: "summer",
    emoji: "☀️",
  },
  {
    step: "3",
    title: "What problem in the world do I want to solve?",
    description: "Issues or causes you feel drawn to contribute to.",
    season: "autumn",
    emoji: "🍂",
  },
  {
    step: "4",
    title: "What skills would people pay me for right now?",
    description: "Your current marketable abilities and expertise.",
    season: "winter",
    emoji: "❄️",
  },
];

export function getCategory(step: "1" | "2" | "3" | "4"): CategoryStepConfig | undefined {
  return CATEGORIES.find((c) => c.step === step);
}
