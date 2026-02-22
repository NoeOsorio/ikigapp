import { CATEGORIES } from "../constants/categories";

type StepForNav = "join" | "lobby" | "1" | "2" | "3" | "4" | "5" | "snapshot";

const STEP_LABELS: { step: StepForNav; label: string }[] = [
  ...CATEGORIES.map((c) => ({ step: c.step as StepForNav, label: c.shortName })),
  { step: "5", label: "Action" },
];

interface NavProps {
  currentStep: StepForNav;
}

export default function Nav({ currentStep }: NavProps) {
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

  return (
    <nav className="fixed top-0 left-0 right-0 z-[100] flex items-center justify-between px-6 py-4 sm:px-10 bg-spring-bg/80 backdrop-blur-xl border-b border-spring-accent/15">
      <div className="font-display text-lg text-spring-dark tracking-wide flex items-center gap-2.5">
        <span className="text-2xl text-spring-accent">生</span>
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
                active
                  ? "text-spring-accent font-medium"
                  : done
                    ? "text-spring-mid"
                    : "text-spring-accent/40"
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
