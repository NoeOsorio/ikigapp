import { useQueryState } from "nuqs";
import { getCategory, getContinueLabel, SEASON_CLASSES } from "../constants/categories";
import CategoryInput from "../components/CategoryInput";
import { useIkigaiForm } from "../context/ikigaiFormContextValue";
import { stepParser, type StepValue } from "../lib/nuqs";

export default function CategoryStep({ step }: { step: "1" | "2" | "3" | "4" }) {
  const config = getCategory(step);
  const [, setStep] = useQueryState("step", stepParser);
  const { c1, c2, c3, c4, setC1, setC2, setC3, setC4 } = useIkigaiForm();
  const items = step === "1" ? c1 : step === "2" ? c2 : step === "3" ? c3 : c4;
  const setItems =
    step === "1" ? setC1 : step === "2" ? setC2 : step === "3" ? setC3 : setC4;

  if (!config) return null;

  const theme = SEASON_CLASSES[config.season];
  const nextStepNum = Number(step) + 1;
  const nextStep: StepValue =
    nextStepNum <= 4 ? (String(nextStepNum) as "1" | "2" | "3" | "4") : "5";

  const handleContinue = () => setStep(nextStep);

  return (
    <div className="w-full flex flex-col items-center justify-center px-4 py-8">
      <header className="text-center mb-10 animate-fade-up">
        <span className="text-4xl block mb-2 animate-float-y">{config.emoji}</span>
        <p className={`text-[0.72rem] tracking-[0.14em] uppercase ${theme.muted} mb-2`}>
          {config.shortName} · {step} of 4
        </p>
        <h1 className={`font-display text-2xl sm:text-[2.2rem] ${theme.text} mb-3 leading-tight`}>
          {config.title}
        </h1>
        <p className={`text-sm ${theme.muted} max-w-[400px] mx-auto leading-relaxed`}>
          {config.description}
        </p>
      </header>

      <div className="w-full max-w-[560px] bg-white rounded-[28px] p-8 sm:p-9 shadow-lg border border-spring-accent/10 animate-[fade-up_0.8s_ease_0.1s_both]">
        <CategoryInput
          items={items ?? []}
          onItemsChange={setItems}
          minItems={4}
          onContinue={handleContinue}
          continueLabel={getContinueLabel(step)}
          season={config.season}
        />
      </div>
    </div>
  );
}
