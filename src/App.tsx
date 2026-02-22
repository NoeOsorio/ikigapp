import { useQueryState } from "nuqs";
import { sessionParser, nameParser, stepParser } from "./lib/nuqs";
import Join from "./pages/Join";
import Lobby from "./pages/Lobby";
import CategoryStep from "./pages/CategoryStep";
import ActionStep from "./pages/ActionStep";
import Snapshot from "./pages/Snapshot";

export default function App() {
  const [session] = useQueryState("session", sessionParser);
  const [name] = useQueryState("name", nameParser);
  const [step] = useQueryState("step", stepParser);

  const hasSession = session != null && session !== "";
  const hasName = name != null && name.trim() !== "";
  const effectiveStep = step ?? "lobby";

  // No session → Join
  if (!hasSession) return <Join />;

  // Session but no name → Join (enter name to join)
  if (!hasName) return <Join />;

  // Step 1–4 → Category step
  if (effectiveStep === "1" || effectiveStep === "2" || effectiveStep === "3" || effectiveStep === "4") {
    return <CategoryStep step={effectiveStep} />;
  }

  // Step 5 → Action step
  if (effectiveStep === "5") return <ActionStep />;

  // Step snapshot → Snapshot page
  if (effectiveStep === "snapshot") return <Snapshot />;

  // Lobby (step lobby or default)
  return <Lobby />;
}
