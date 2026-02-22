import { useQueryState, useQueryStates } from "nuqs";
import {
  stepParser,
  actionParser,
  nameParser,
  categoryArrayParser,
  payloadParser,
  encodeSnapshotPayload,
  type SnapshotPayload,
} from "../lib/nuqs";

export default function ActionStep() {
  const [, setStepAndPayload] = useQueryStates(
    { step: stepParser, payload: payloadParser },
    { shallow: false }
  );
  const [action, setAction] = useQueryState("action", actionParser);
  const [name] = useQueryState("name", nameParser);
  const [c1] = useQueryState("c1", categoryArrayParser);
  const [c2] = useQueryState("c2", categoryArrayParser);
  const [c3] = useQueryState("c3", categoryArrayParser);
  const [c4] = useQueryState("c4", categoryArrayParser);

  const handleContinue = () => {
    const payload: SnapshotPayload = {
      name: name ?? "",
      c1: c1 ?? [],
      c2: c2 ?? [],
      c3: c3 ?? [],
      c4: c4 ?? [],
      action: action ?? "",
    };
    const encoded = encodeSnapshotPayload(payload);
    setStepAndPayload({ step: "snapshot", payload: encoded });
  };

  return (
    <main className="w-full max-w-lg px-6 py-12">
      <h1 className="text-2xl font-semibold text-[var(--color-ink)] mb-2">
        Your Ikigai action
      </h1>
      <p className="text-[var(--color-ink-muted)] mb-6 text-sm">
        Write one concrete commitment that ties together your four categories.
      </p>
      <textarea
        value={action ?? ""}
        onChange={(e) => setAction(e.target.value)}
        placeholder="e.g. This month I will..."
        rows={5}
        className="w-full py-3 px-4 border border-[var(--color-border)] bg-[var(--color-surface)] rounded text-[var(--color-ink)] placeholder:text-[var(--color-ink-muted)] resize-y"
      />
      <button
        type="button"
        onClick={handleContinue}
        disabled={!action?.trim()}
        className="mt-6 w-full py-3 px-4 bg-[var(--color-accent)] text-white rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[var(--color-accent-hover)]"
      >
        See my snapshot
      </button>
    </main>
  );
}
