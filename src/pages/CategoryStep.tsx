import { useQueryState } from "nuqs";
import { getCategory, getContinueLabel, SEASON_CLASSES } from "../constants/categories";
import CategoryInput from "../components/CategoryInput";
import { useIkigaiForm } from "../context/ikigaiFormContextValue";
import { stepParser, sessionParser, nameParser, type StepValue } from "../lib/nuqs";
import { nameToParticipantId } from "../models/participant.model";
import { useUpdateStep, useUpdateAnswers } from "../hooks/useParticipant";
import cherryblossomUrl from "../assets/best_svg_images/cherryblossom-svgrepo-com.svg";
import leafUrl from "../assets/best_svg_images/leaf-svgrepo-com.svg";
import leafMomijiUrl from "../assets/best_svg_images/leaf-momiji-svgrepo-com.svg";
import snowflakeUrl from "../assets/best_svg_images/snowflake-svgrepo-com.svg";

const SEASON_ICON_URLS = {
  spring: cherryblossomUrl,
  summer: leafUrl,
  autumn: leafMomijiUrl,
  winter: snowflakeUrl,
} as const;

export default function CategoryStep({ step }: { step: "1" | "2" | "3" | "4" }) {
  const config = getCategory(step);
  const [, setStep] = useQueryState("step", stepParser);
  const [session] = useQueryState("session", sessionParser);
  const [name] = useQueryState("name", nameParser);
  const { c1, c2, c3, c4, setC1, setC2, setC3, setC4 } = useIkigaiForm();
  const updateStep = useUpdateStep();
  const updateAnswers = useUpdateAnswers();

  const categoryItems = { "1": c1, "2": c2, "3": c3, "4": c4 };
  const categorySetters = { "1": setC1, "2": setC2, "3": setC3, "4": setC4 };
  const items = categoryItems[step];
  const setItems = categorySetters[step];
  const cKey = `c${step}` as "c1" | "c2" | "c3" | "c4";

  if (!config) return null;

  const theme = SEASON_CLASSES[config.season];
  const nextStepNum = Number(step) + 1;
  const nextStep: StepValue =
    nextStepNum <= 4 ? (String(nextStepNum) as "1" | "2" | "3" | "4") : "5";

  const handleContinue = () => {
    if (session && name) {
      const pid = nameToParticipantId(name);
      // Fire-and-forget: sync answers and advance step in Firestore
      updateAnswers.mutate({ sessionId: session, participantId: pid, answers: { [cKey]: items ?? [] } });
      updateStep.mutate({ sessionId: session, participantId: pid, step: nextStep });
    }
    setStep(nextStep);
  };

  return (
    <div className="w-full flex flex-col items-center justify-center px-4 py-8">
      <header className="text-center mb-10 animate-fade-up">
        <span className="block mb-2 animate-float-y">
          <img
            src={SEASON_ICON_URLS[config.season]}
            alt={config.shortName}
            className="w-12 h-12 mx-auto"
          />
        </span>
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
