import { useQueryState } from "nuqs";
import { sessionParser, nameParser, stepParser } from "./lib/nuqs";
import { getCategory } from "./constants/categories";
import Layout from "./components/Layout";
import Join from "./pages/Join";
import Lobby from "./pages/Lobby";
import CategoryStep from "./pages/CategoryStep";
import ActionStep from "./pages/ActionStep";
import Snapshot from "./pages/Snapshot";

type StepForNav = "join" | "lobby" | "1" | "2" | "3" | "4" | "5" | "snapshot";

export default function App() {
  const [session] = useQueryState("session", sessionParser);
  const [name] = useQueryState("name", nameParser);
  const [step] = useQueryState("step", stepParser);

  const hasSession = session != null && session !== "";
  const hasName = name != null && name.trim() !== "";
  const effectiveStep = step ?? "lobby";

  const navStep: StepForNav =
    !hasSession || !hasName
      ? "join"
      : effectiveStep === "lobby"
        ? "lobby"
        : effectiveStep === "snapshot"
          ? "snapshot"
          : (effectiveStep as StepForNav);

  const season =
    effectiveStep === "1" || effectiveStep === "2" || effectiveStep === "3" || effectiveStep === "4"
      ? getCategory(effectiveStep)?.season ?? "spring"
      : effectiveStep === "5"
        ? "winter"
        : "spring";

  let content: React.ReactNode;
  if (!hasSession || !hasName) {
    content = <Join />;
  } else if (effectiveStep === "1" || effectiveStep === "2" || effectiveStep === "3" || effectiveStep === "4") {
    content = <CategoryStep step={effectiveStep} />;
  } else if (effectiveStep === "5") {
    content = <ActionStep />;
  } else if (effectiveStep === "snapshot") {
    content = <Snapshot />;
  } else {
    content = <Lobby />;
  }

  return (
    <Layout step={navStep} season={season}>
      {content}
    </Layout>
  );
}
