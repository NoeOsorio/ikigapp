import { useQueryState } from "nuqs";
import { useIkigaiForm } from "../context/ikigaiFormContext";
import { setSnapshotPayload } from "../lib/snapshotStorage";
import { stepParser, nameParser } from "../lib/nuqs";

export default function ActionStep() {
  const [, setStep] = useQueryState("step", stepParser);
  const [name] = useQueryState("name", nameParser);
  const { action, setAction, buildPayload } = useIkigaiForm();

  const handleContinue = () => {
    const payload = buildPayload(name ?? "");
    const session = new URLSearchParams(window.location.search).get("session") ?? "";
    setSnapshotPayload(session, name ?? "", payload);
    setStep("snapshot");
  };

  return (
    <div className="w-full max-w-lg flex flex-col items-center">
      <header className="text-center mb-8 animate-fade-up">
        <h1 className="font-display text-2xl text-spring-dark mb-2">Your Ikigai action</h1>
        <p className="text-sm text-spring-muted">
          Write one concrete commitment that ties together your four categories.
        </p>
      </header>
      <div className="w-full bg-white rounded-3xl p-8 shadow-lg border border-spring-accent/10 animate-[fade-up_0.8s_ease_0.1s_both]">
        <textarea
          value={action}
          onChange={(e) => setAction(e.target.value)}
          placeholder="e.g. This month I will..."
          rows={5}
          className="w-full py-3 px-4 rounded-xl border-[1.5px] border-spring-accent/20 bg-spring-bg/30 font-body text-spring-dark placeholder:text-spring-muted outline-none focus:border-spring-accent focus:ring-2 focus:ring-spring-accent/20 focus:ring-offset-0 resize-y"
        />
        <button
          type="button"
          onClick={handleContinue}
          disabled={!action?.trim()}
          className="mt-6 w-full py-4 rounded-xl bg-spring-dark text-white font-display text-base disabled:opacity-50 disabled:cursor-not-allowed hover:bg-spring-accent hover:-translate-y-px transition-all min-h-[44px]"
        >
          See my snapshot
        </button>
      </div>
    </div>
  );
}
