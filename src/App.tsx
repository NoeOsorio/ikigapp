import { useQueryState } from "nuqs";
import { Routes, Route, Navigate } from "react-router-dom";
import { sessionParser, nameParser, stepParser } from "./lib/nuqs";
import { sessionUrl, workshopUrl } from "./lib/routes";
import { getCategory, isCategoryStep, type ThemeKind } from "./constants/categories";
import { IkigaiFormProvider } from "./context/IkigaiFormContext";
import { useIkigaiFormOptional } from "./context/ikigaiFormContextValue";
import { getSnapshotPayload } from "./lib/snapshotStorage";
import { hasPayloadContent } from "./lib/payload";
import { useParticipant } from "./hooks/useParticipant";
import { useAiIkigai } from "./hooks/useAiIkigai";
import { nameToParticipantId, participantDisplayName } from "./models/participant.model";
import type { SnapshotPayload } from "./lib/nuqs";
import Layout from "./components/Layout";
import Join from "./pages/Join";
import Lobby from "./pages/Lobby";
import CategoryStep from "./pages/CategoryStep";
import ActionStep from "./pages/ActionStep";
import Snapshot from "./pages/Snapshot";
import Analytics from "./pages/Analytics";
import AnalyticsBySession from "./pages/AnalyticsBySession";
import About from "./pages/About";

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

  const theme: ThemeKind =
    effectiveStep === "lobby"
      ? "lobby"
      : isCategoryStep(effectiveStep)
        ? getCategory(effectiveStep)?.season ?? "spring"
        : "winter";

  let content: React.ReactNode;
  if (isCategoryStep(effectiveStep)) {
    content = <CategoryStep step={effectiveStep} />;
  } else if (effectiveStep === "5") {
    content = <ActionStep />;
  } else {
    content = <Lobby />;
  }

  return (
    <IkigaiFormProvider>
      <Layout theme={theme}>
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

  // Fast path: payload already in memory (same session) or sessionStorage (same device)
  const payloadFromContext = formOptional?.buildPayload(name ?? "") ?? null;
  const payloadFromStorage = getSnapshotPayload(session ?? "", name ?? "");
  const localPayload: SnapshotPayload | null =
    payloadFromContext && hasPayloadContent(payloadFromContext)
      ? payloadFromContext
      : payloadFromStorage;

  // Always fetch participant so we can read/trigger aiIkigai
  const participantId = name ? nameToParticipantId(name) : null;
  const { data: participant, isLoading } = useParticipant(session, participantId);

  // Trigger AI generation (no-op if aiIkigai already stored)
  const { aiIkigai, isLoading: isLoadingAi } = useAiIkigai(
    session,
    participantId,
    participant,
  );

  const firestorePayload: SnapshotPayload | null = participant
    ? {
        name: participantDisplayName(participant),
        c1: participant.answers.c1,
        c2: participant.answers.c2,
        c3: participant.answers.c3,
        c4: participant.answers.c4,
        action: participant.answers.action,
      }
    : null;

  const payload = localPayload ?? firestorePayload;

  // Wait for Firestore before deciding to redirect (only needed when no local data)
  if (!localPayload && isLoading) {
    return (
      <Layout theme="matcha">
        <div className="text-matcha-muted text-sm animate-pulse">Cargando tarjeta…</div>
      </Layout>
    );
  }

  if (!payload) {
    return (
      <Navigate
        to={session && name ? workshopUrl(session, name, "lobby") : sessionUrl()}
        replace
      />
    );
  }

  const displayName = payload.name;
  const action = payload.action;

  return (
    <Layout theme="matcha">
      <Snapshot
        name={displayName}
        action={action}
        aiIkigai={aiIkigai}
        isLoadingAi={isLoadingAi}
      />
    </Layout>
  );
}

export default function App() {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <Layout theme="dawn">
            <About />
          </Layout>
        }
      />
      <Route
        path="/session"
        element={
          <Layout theme="dawn">
            <Join />
          </Layout>
        }
      />
      <Route path="/workshop" element={<WorkshopView />} />
      <Route path="/result" element={<ResultView />} />
      <Route
        path="/analytics"
        element={
          <Layout theme="matcha">
            <Analytics />
          </Layout>
        }
      />
      <Route
        path="/analytics/:sessionId"
        element={
          <Layout theme="matcha">
            <AnalyticsBySession />
          </Layout>
        }
      />
    </Routes>
  );
}
