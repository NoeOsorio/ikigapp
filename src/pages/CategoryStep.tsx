import { useQueryState } from "nuqs";
import { getCategory } from "../constants/categories";
import FallingBackground from "../components/FallingBackground";
import CategoryInput from "../components/CategoryInput";
import {
  stepParser,
  categoryArrayParser,
  type StepValue,
} from "../lib/nuqs";

const SEASON_VARS: Record<string, Record<string, string>> = {
  spring: {
    "--color-bg": "var(--season-spring-bg)",
    "--color-surface": "var(--season-spring-surface)",
    "--color-ink": "var(--season-spring-ink)",
    "--color-accent": "var(--season-spring-accent)",
  },
  summer: {
    "--color-bg": "var(--season-summer-bg)",
    "--color-surface": "var(--season-summer-surface)",
    "--color-ink": "var(--season-summer-ink)",
    "--color-accent": "var(--season-summer-accent)",
  },
  autumn: {
    "--color-bg": "var(--season-autumn-bg)",
    "--color-surface": "var(--season-autumn-surface)",
    "--color-ink": "var(--season-autumn-ink)",
    "--color-accent": "var(--season-autumn-accent)",
  },
  winter: {
    "--color-bg": "var(--season-winter-bg)",
    "--color-surface": "var(--season-winter-surface)",
    "--color-ink": "var(--season-winter-ink)",
    "--color-accent": "var(--season-winter-accent)",
  },
};

export default function CategoryStep({ step }: { step: "1" | "2" | "3" | "4" }) {
  const config = getCategory(step);
  const [, setStep] = useQueryState("step", stepParser);
  const [c1, setC1] = useQueryState("c1", categoryArrayParser);
  const [c2, setC2] = useQueryState("c2", categoryArrayParser);
  const [c3, setC3] = useQueryState("c3", categoryArrayParser);
  const [c4, setC4] = useQueryState("c4", categoryArrayParser);
  const items = step === "1" ? c1 : step === "2" ? c2 : step === "3" ? c3 : c4 ?? [];
  const setItems =
    step === "1" ? setC1 : step === "2" ? setC2 : step === "3" ? setC3 : setC4;

  if (!config) return null;

  const seasonVars = SEASON_VARS[config.season] ?? {};
  const nextStepNum = Number(step) + 1;
  const nextStep: StepValue = nextStepNum <= 4 ? String(nextStepNum) as "1" | "2" | "3" | "4" : "5";

  const handleContinue = () => setStep(nextStep);

  return (
    <div
      className="fixed inset-0 min-h-screen flex flex-col items-center justify-center px-4 py-12"
      style={seasonVars as React.CSSProperties}
    >
      <FallingBackground season={config.season} />
      <div className="relative z-10 w-full flex flex-col items-center">
        <p className="text-lg mb-2" style={{ color: "var(--color-ink)" }}>
          {config.emoji} Step {step}
        </p>
        <h1 className="text-2xl font-semibold text-center mb-2" style={{ color: "var(--color-ink)" }}>
          {config.title}
        </h1>
        <p className="text-sm text-center mb-8 opacity-90" style={{ color: "var(--color-ink)" }}>
          {config.description}
        </p>
        <CategoryInput
          items={items ?? []}
          onItemsChange={setItems}
          minItems={4}
          onContinue={handleContinue}
          continueLabel="Continue"
        />
      </div>
    </div>
  );
}
