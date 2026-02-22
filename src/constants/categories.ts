export type Season = "spring" | "summer" | "autumn" | "winter";

export interface CategoryStepConfig {
  step: "1" | "2" | "3" | "4";
  shortName: string;
  title: string;
  description: string;
  season: Season;
  emoji: string;
}

export const CATEGORIES: CategoryStepConfig[] = [
  {
    step: "1",
    shortName: "Love",
    title: "What do I love doing?",
    description: "Activities and experiences that bring you joy and fulfillment.",
    season: "spring",
    emoji: "🌸",
  },
  {
    step: "2",
    shortName: "Good at",
    title: "What am I good at?",
    description: "Skills and strengths that come naturally to you.",
    season: "summer",
    emoji: "☀️",
  },
  {
    step: "3",
    shortName: "Problem",
    title: "What problem in the world do I want to solve?",
    description: "Issues or causes you feel drawn to contribute to.",
    season: "autumn",
    emoji: "🍂",
  },
  {
    step: "4",
    shortName: "Pay",
    title: "What skills would people pay me for right now?",
    description: "Your current marketable abilities and expertise.",
    season: "winter",
    emoji: "❄️",
  },
];

export function getCategory(step: "1" | "2" | "3" | "4"): CategoryStepConfig | undefined {
  return CATEGORIES.find((c) => c.step === step);
}

/** Tailwind class names per season (no dynamic concatenation for purge). */
export const SEASON_CLASSES: Record<
  Season,
  {
    bg: string;
    text: string;
    muted: string;
    accent: string;
    accentBg: string;
    dark: string;
    mid: string;
    border: string;
    inputBg: string;
    progressGradient: string;
    btnPrimary: string;
    btnPrimaryHover: string;
    inputFocus: string;
    placeholder: string;
  }
> = {
  spring: {
    bg: "bg-spring-bg",
    text: "text-spring-dark",
    muted: "text-spring-muted",
    accent: "text-spring-accent",
    accentBg: "bg-spring-accent",
    dark: "bg-spring-dark",
    mid: "bg-spring-mid",
    border: "border-spring-accent/25",
    inputBg: "bg-spring-bg/50",
    progressGradient: "from-spring-accent to-spring-mid",
    btnPrimary: "bg-spring-dark",
    btnPrimaryHover: "hover:bg-spring-accent",
    inputFocus: "focus:border-spring-accent focus:ring-2 focus:ring-spring-accent/20 focus:ring-offset-0",
    placeholder: "placeholder:text-spring-muted",
  },
  summer: {
    bg: "bg-summer-bg",
    text: "text-summer-dark",
    muted: "text-summer-muted",
    accent: "text-summer-accent",
    accentBg: "bg-summer-accent",
    dark: "bg-summer-dark",
    mid: "bg-summer-mid",
    border: "border-summer-accent/25",
    inputBg: "bg-summer-bg/50",
    progressGradient: "from-summer-accent to-summer-mid",
    btnPrimary: "bg-summer-dark",
    btnPrimaryHover: "hover:bg-summer-accent",
    inputFocus: "focus:border-summer-accent focus:ring-2 focus:ring-summer-accent/20 focus:ring-offset-0",
    placeholder: "placeholder:text-summer-muted",
  },
  autumn: {
    bg: "bg-autumn-bg",
    text: "text-autumn-dark",
    muted: "text-autumn-muted",
    accent: "text-autumn-accent",
    accentBg: "bg-autumn-accent",
    dark: "bg-autumn-dark",
    mid: "bg-autumn-mid",
    border: "border-autumn-accent/25",
    inputBg: "bg-autumn-bg/50",
    progressGradient: "from-autumn-accent to-autumn-mid",
    btnPrimary: "bg-autumn-dark",
    btnPrimaryHover: "hover:bg-autumn-accent",
    inputFocus: "focus:border-autumn-accent focus:ring-2 focus:ring-autumn-accent/20 focus:ring-offset-0",
    placeholder: "placeholder:text-autumn-muted",
  },
  winter: {
    bg: "bg-winter-bg",
    text: "text-winter-dark",
    muted: "text-winter-muted",
    accent: "text-winter-accent",
    accentBg: "bg-winter-accent",
    dark: "bg-winter-dark",
    mid: "bg-winter-mid",
    border: "border-winter-accent/25",
    inputBg: "bg-winter-bg/50",
    progressGradient: "from-winter-accent to-winter-mid",
    btnPrimary: "bg-winter-dark",
    btnPrimaryHover: "hover:bg-winter-accent",
    inputFocus: "focus:border-winter-accent focus:ring-2 focus:ring-winter-accent/20 focus:ring-offset-0",
    placeholder: "placeholder:text-winter-muted",
  },
};

export type HubTheme = "dawn" | "lobby" | "matcha";
export type ThemeKind = Season | HubTheme;

/** Hub screens: background + text only (no particles). */
export const HUB_THEME_CLASSES: Record<
  HubTheme,
  { bg: string; text: string; muted: string; accent: string; dark: string }
> = {
  dawn: {
    bg: "bg-dawn-bg",
    text: "text-dawn-dark",
    muted: "text-dawn-muted",
    accent: "text-dawn-accent",
    dark: "text-dawn-dark",
  },
  lobby: {
    bg: "bg-lobby-bg",
    text: "text-lobby-dark",
    muted: "text-lobby-muted",
    accent: "text-lobby-accent",
    dark: "text-lobby-dark",
  },
  matcha: {
    bg: "bg-matcha-bg",
    text: "text-matcha-dark",
    muted: "text-matcha-muted",
    accent: "text-matcha-accent",
    dark: "text-matcha-dark",
  },
};

export function getThemeClasses(theme: ThemeKind): { bg: string; text: string } {
  if (theme === "dawn" || theme === "lobby" || theme === "matcha") {
    const hub = HUB_THEME_CLASSES[theme];
    return { bg: hub.bg, text: hub.text };
  }
  const season = SEASON_CLASSES[theme];
  return { bg: season.bg, text: season.text };
}

export function isSeasonTheme(theme: ThemeKind): theme is Season {
  return theme === "spring" || theme === "summer" || theme === "autumn" || theme === "winter";
}

const ACTION_STEP_LABEL = "My Action";

/** Next step short name for continue button: step 1→Good at, 2→Problem, 3→Pay, 4→My Action */
export function getContinueLabel(step: "1" | "2" | "3" | "4"): string {
  if (step === "4") return `Continue to ${ACTION_STEP_LABEL} →`;
  const next = getCategory(String(Number(step) + 1) as "1" | "2" | "3" | "4");
  return next ? `Continue to ${next.shortName} →` : "Continue";
}
