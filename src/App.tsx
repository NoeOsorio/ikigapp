import { useQueryState } from "nuqs";
import { Routes, Route, Navigate } from "react-router-dom";
import { sessionParser, nameParser, stepParser } from "./lib/nuqs";
import { sessionUrl, workshopUrl } from "./lib/routes";
import { getCategory, type ThemeKind } from "./constants/categories";
import { IkigaiFormProvider } from "./context/IkigaiFormContext";
import { useIkigaiFormOptional } from "./context/ikigaiFormContextValue";
import { getSnapshotPayload } from "./lib/snapshotStorage";
import { hasPayloadContent } from "./lib/payload";
import Layout from "./components/Layout";
import Join from "./pages/Join";
import Lobby from "./pages/Lobby";
import CategoryStep from "./pages/CategoryStep";
import ActionStep from "./pages/ActionStep";
import Snapshot from "./pages/Snapshot";

type StepForNav = "join" | "lobby" | "1" | "2" | "3" | "4" | "5" | "snapshot";

function WorkshopView() {
  const [session] = useQueryState("session", sessionParser);
  const [name] = useQueryState("name", nameParser);
  const [step] = useQueryState("step", stepParser);

  const hasSession = session != null && session !== "";
  const hasName = name != null && name.trim() !== "";
  const effectiveStep = step ?? "lobby";

  if (!hasSession || !hasName) {
    return <Navigate to={sessionUrl(session ?? undefined)} replace />;
  }

  const navStep: StepForNav =
    effectiveStep === "lobby"
      ? "lobby"
      : (effectiveStep as StepForNav);

  const theme: ThemeKind =
    effectiveStep === "lobby"
      ? "lobby"
      : effectiveStep === "1" || effectiveStep === "2" || effectiveStep === "3" || effectiveStep === "4"
        ? getCategory(effectiveStep)?.season ?? "spring"
        : "winter";

  let content: React.ReactNode;
  if (effectiveStep === "1" || effectiveStep === "2" || effectiveStep === "3" || effectiveStep === "4") {
    content = <CategoryStep step={effectiveStep} />;
  } else if (effectiveStep === "5") {
    content = <ActionStep />;
  } else {
    content = <Lobby />;
  }

  return (
    <IkigaiFormProvider>
      <Layout step={navStep} theme={theme}>
        {content}
      </Layout>
    </IkigaiFormProvider>
  );
}

function ResultView() {
  return (
    <IkigaiFormProvider>
      <ResultViewInner />
    </IkigaiFormProvider>
  );
}

function ResultViewInner() {
  const [session] = useQueryState("session", sessionParser);
  const [name] = useQueryState("name", nameParser);
  const formOptional = useIkigaiFormOptional();
  const payloadFromContext = formOptional?.buildPayload(name ?? "") ?? null;
  const payloadFromStorage = getSnapshotPayload(session ?? "", name ?? "");
  const payload =
    payloadFromContext && hasPayloadContent(payloadFromContext)
      ? payloadFromContext
      : payloadFromStorage;

  if (!payload) {
    return (
      <Navigate
        to={session && name ? workshopUrl(session, name, "lobby") : sessionUrl()}
        replace
      />
    );
  }

  return (
    <Layout step="snapshot" theme="matcha">
      <Snapshot payload={payload} />
    </Layout>
  );
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/session" replace />} />
      <Route
        path="/session"
        element={
          <Layout step="join" theme="dawn">
            <Join />
          </Layout>
        }
      />
      <Route path="/workshop" element={<WorkshopView />} />
      <Route path="/result" element={<ResultView />} />
    </Routes>
  );
}
