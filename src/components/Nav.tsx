type StepForDots = "join" | "lobby" | "1" | "2" | "3" | "4" | "5" | "snapshot";

interface NavProps {
  currentStep: StepForDots;
}

export default function Nav({ currentStep }: NavProps) {
  const stepIndex =
    currentStep === "join"
      ? 0
      : currentStep === "lobby"
        ? 1
        : currentStep === "1"
          ? 2
          : currentStep === "2"
            ? 3
            : currentStep === "3"
              ? 4
              : currentStep === "4"
                ? 4
                : currentStep === "5"
                  ? 4
                  : currentStep === "snapshot"
                    ? 5
                    : 0;
  const doneCount = stepIndex;
  const activeIndex =
    currentStep === "join" || currentStep === "lobby" || currentStep === "snapshot"
      ? -1
      : Math.min(stepIndex, 4);

  return (
    <nav className="fixed top-0 left-0 right-0 z-[100] flex items-center justify-between px-6 py-4 sm:px-10 bg-spring-bg/80 backdrop-blur-xl border-b border-spring-accent/15">
      <div className="font-display text-lg text-spring-dark tracking-wide flex items-center gap-2.5">
        <span className="text-2xl text-spring-accent">生</span>
        <span>Ikigai Sessions</span>
      </div>
      <div className="flex gap-1.5 items-center">
        {[0, 1, 2, 3, 4].map((i) => {
          const done = i < doneCount;
          const active = activeIndex === i;
          return (
            <div
              key={i}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                active
                  ? "bg-spring-accent scale-125"
                  : done
                    ? "bg-spring-mid"
                    : "bg-spring-accent/25"
              }`}
              aria-hidden
            />
          );
        })}
      </div>
    </nav>
  );
}
