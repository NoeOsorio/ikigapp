import { CATEGORIES, type ThemeKind } from "../constants/categories";

type StepForNav = "join" | "lobby" | "1" | "2" | "3" | "4" | "5" | "snapshot";

const STEP_LABELS: { step: StepForNav; label: string }[] = [
  ...CATEGORIES.map((c) => ({ step: c.step as StepForNav, label: c.shortName })),
  { step: "5", label: "Action" },
];

interface NavProps {
  currentStep: StepForNav;
  theme: ThemeKind;
}

export default function Nav({ currentStep, theme }: NavProps) {
  const categoryStepIndex =
    currentStep === "1"
      ? 0
      : currentStep === "2"
        ? 1
        : currentStep === "3"
          ? 2
          : currentStep === "4"
            ? 3
            : currentStep === "5"
              ? 4
              : -1;
  const doneCount =
    categoryStepIndex >= 0
      ? categoryStepIndex
      : currentStep === "snapshot"
        ? 5
        : 0;
  const activeIndex =
    currentStep === "join" || currentStep === "lobby" || currentStep === "snapshot"
      ? -1
      : categoryStepIndex;

  const isHub = theme === "dawn" || theme === "lobby" || theme === "matcha";
  const barBg =
    isHub
      ? "bg-white/80 backdrop-blur-xl border-b " +
        (theme === "dawn" ? "border-dawn-accent/15" : theme === "lobby" ? "border-lobby-accent/15" : "border-matcha-accent/15")
      : theme === "spring"
        ? "bg-spring-bg/80 backdrop-blur-xl border-b border-spring-accent/15"
        : theme === "summer"
          ? "bg-summer-bg/80 backdrop-blur-xl border-b border-summer-accent/15"
          : theme === "autumn"
            ? "bg-autumn-bg/80 backdrop-blur-xl border-b border-autumn-accent/15"
            : "bg-winter-bg/80 backdrop-blur-xl border-b border-winter-accent/15";
  const logoText = isHub
    ? theme === "dawn"
      ? "text-dawn-dark"
      : theme === "lobby"
        ? "text-lobby-dark"
        : "text-matcha-dark"
    : theme === "spring"
      ? "text-spring-dark"
      : theme === "summer"
        ? "text-summer-dark"
        : theme === "autumn"
          ? "text-autumn-dark"
          : "text-winter-dark";
  const logoAccent = isHub
    ? theme === "dawn"
      ? "text-dawn-accent"
      : theme === "lobby"
        ? "text-lobby-accent"
        : "text-matcha-accent"
    : theme === "spring"
      ? "text-spring-accent"
      : theme === "summer"
        ? "text-summer-accent"
        : theme === "autumn"
          ? "text-autumn-accent"
          : "text-winter-accent";
  const stepActive = isHub
    ? theme === "dawn"
      ? "text-dawn-accent font-medium"
      : theme === "lobby"
        ? "text-lobby-accent font-medium"
        : "text-matcha-accent font-medium"
    : theme === "spring"
      ? "text-spring-accent font-medium"
      : theme === "summer"
        ? "text-summer-accent font-medium"
        : theme === "autumn"
          ? "text-autumn-accent font-medium"
          : "text-winter-accent font-medium";
  const stepDone = isHub
    ? theme === "dawn"
      ? "text-dawn-muted"
      : theme === "lobby"
        ? "text-lobby-muted"
        : "text-matcha-muted"
    : theme === "spring"
      ? "text-spring-muted"
      : theme === "summer"
        ? "text-summer-muted"
        : theme === "autumn"
          ? "text-autumn-muted"
          : "text-winter-muted";
  const stepInactive = isHub
    ? theme === "dawn"
      ? "text-dawn-accent/40"
      : theme === "lobby"
        ? "text-lobby-accent/40"
        : "text-matcha-accent/40"
    : theme === "spring"
      ? "text-spring-accent/40"
      : theme === "summer"
        ? "text-summer-accent/40"
        : theme === "autumn"
          ? "text-autumn-accent/40"
          : "text-winter-accent/40";

  return (
    <nav className={`fixed top-0 left-0 right-0 z-100 flex items-center justify-between px-6 py-4 sm:px-10 ${barBg}`}>
      <div className={`font-display text-lg tracking-wide flex items-center gap-2.5 ${logoText}`}>
        <span className={`text-2xl ${logoAccent}`}>生</span>
        <span>Ikigai Sessions</span>
      </div>
      <div className="flex gap-2 sm:gap-3 items-center flex-wrap justify-end max-w-[50%]">
        {STEP_LABELS.map(({ step, label }, i) => {
          const done = i < doneCount;
          const active = activeIndex === i;
          return (
            <span
              key={step}
              className={`text-[0.65rem] sm:text-[0.7rem] tracking-wide uppercase transition-colors duration-300 ${
                active ? stepActive : done ? stepDone : stepInactive
              }`}
              aria-current={active ? "step" : undefined}
            >
              {label}
            </span>
          );
        })}
      </div>
    </nav>
  );
}
