import { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useQueryState } from "nuqs";
import { sessionParser, nameParser } from "../lib/nuqs";
import { resultUrl } from "../lib/routes";
import { setSnapshotPayload } from "../lib/snapshotStorage";
import { nameToParticipantId } from "../models/participant.model";
import type { Intersections } from "../models/participant.model";
import { useIkigaiForm } from "../context/ikigaiFormContextValue";
import { useParticipant, useUpdateStep, useUpdateAnswers, useSaveShareLink } from "../hooks/useParticipant";
import { generateIntersectionsFromAnswers } from "../services/intersectionsAi.service";
import { HUB_THEME_CLASSES } from "../constants/categories";

const theme = HUB_THEME_CLASSES.dawn;

function ActionsInput({
  actions,
  onActionsChange,
  theme: t,
}: {
  actions: string[];
  onActionsChange: (items: string[]) => void;
  theme: typeof HUB_THEME_CLASSES.dawn;
}) {
  const [inputValue, setInputValue] = useState("");
  const addItem = () => {
    const trimmed = inputValue.trim();
    if (trimmed && !actions.includes(trimmed) && actions.length < 10) {
      onActionsChange([...actions, trimmed]);
      setInputValue("");
    }
  };
  const removeItem = (index: number) => onActionsChange(actions.filter((_, i) => i !== index));
  return (
    <section
      className={`w-full rounded-3xl p-6 sm:p-8 border border-dawn-accent/20 ${t.bg} shadow-lg mb-2 animate-[fade-up_0.8s_ease_0.2s_both]`}
    >
      <h2 className={`text-[0.65rem] tracking-[0.2em] uppercase ${t.muted} font-semibold mb-3`}>
        Acciones concretas (mínimo 1)
      </h2>
      <div
        className={`flex flex-wrap gap-2.5 min-h-16 rounded-2xl p-4 border border-dashed border-dawn-accent/25 bg-white/50 mb-4`}
      >
        {actions.map((item, i) => (
          <span
            key={`${item}-${i}`}
            className="inline-flex items-center gap-1.5 rounded-full py-1.5 px-3.5 text-sm border border-dawn-accent/25 bg-white/80 text-dawn-dark"
          >
            {item}
            <button
              type="button"
              onClick={() => removeItem(i)}
              className="text-xs text-dawn-accent leading-none p-0.5 hover:opacity-80"
              aria-label={`Eliminar ${item}`}
            >
              ✕
            </button>
          </span>
        ))}
      </div>
      <div className="flex gap-2.5">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addItem())}
          placeholder="p. ej. Este mes voy a..."
          className={`flex-1 py-3 px-4 rounded-xl border-[1.5px] border-dawn-accent/25 bg-white/60 text-dawn-dark placeholder:text-dawn-muted/70 outline-none focus:border-dawn-accent focus:ring-2 focus:ring-dawn-accent/20`}
          aria-label="Agregar acción"
        />
        <button
          type="button"
          onClick={addItem}
          className="py-3 px-5 rounded-xl bg-dawn-accent text-white text-lg font-medium hover:opacity-90 shrink-0 min-h-[44px]"
        >
          +
        </button>
      </div>
    </section>
  );
}

const INTERSECTION_LABELS: { key: keyof Intersections; title: string }[] = [
  { key: "pasion", title: "Pasión" },
  { key: "mision", title: "Misión" },
  { key: "profesion", title: "Profesión" },
  { key: "vocacion", title: "Vocación" },
];

export default function IntersectionsStep() {
  const navigate = useNavigate();
  const [session] = useQueryState("session", sessionParser);
  const [name] = useQueryState("name", nameParser);
  const { c1, c2, c3, c4, buildPayload } = useIkigaiForm();
  const participantId = name ? nameToParticipantId(name) : null;
  const { data: participant, isLoading: isLoadingParticipant } = useParticipant(session, participantId);
  const updateStep = useUpdateStep();
  const updateAnswers = useUpdateAnswers();
  const saveShareLink = useSaveShareLink();

  const [intersections, setIntersections] = useState<Intersections | null>(null);
  const [ikigai, setIkigai] = useState("");
  const [actions, setActions] = useState<string[]>([]);
  const [isLoadingIntersections, setIsLoadingIntersections] = useState(true);
  const [errorIntersections, setErrorIntersections] = useState<Error | null>(null);
  const generatingRef = useRef(false);

  const fetchIntersections = useCallback(async () => {
    if (!participant || !session || !participantId) return;
    const existing = participant.answers.intersections;
    if (
      existing &&
      [existing.pasion, existing.mision, existing.profesion, existing.vocacion].every((s) => s?.trim() !== "")
    ) {
      setIntersections(existing);
      setIsLoadingIntersections(false);
      setErrorIntersections(null);
      return;
    }
    if (generatingRef.current) return;
    generatingRef.current = true;
    setIsLoadingIntersections(true);
    setErrorIntersections(null);
    const answers = {
      c1: participant.answers.c1.length > 0 ? participant.answers.c1 : c1,
      c2: participant.answers.c2.length > 0 ? participant.answers.c2 : c2,
      c3: participant.answers.c3.length > 0 ? participant.answers.c3 : c3,
      c4: participant.answers.c4.length > 0 ? participant.answers.c4 : c4,
    };
    try {
      const result = await generateIntersectionsFromAnswers(answers);
      setIntersections(result);
      await updateAnswers.mutateAsync({
        sessionId: session,
        participantId,
        answers: { intersections: result },
      });
    } catch (err) {
      setErrorIntersections(err instanceof Error ? err : new Error(String(err)));
    } finally {
      setIsLoadingIntersections(false);
      generatingRef.current = false;
    }
  }, [participant, session, participantId, c1, c2, c3, c4, updateAnswers]);

  useEffect(() => {
    if (!participant) {
      if (!isLoadingParticipant) setIsLoadingIntersections(false);
      return;
    }
    const existing = participant.answers.intersections;
    if (
      existing &&
      [existing.pasion, existing.mision, existing.profesion, existing.vocacion].every((s) => s?.trim() !== "")
    ) {
      setIntersections(existing);
      setIsLoadingIntersections(false);
      setErrorIntersections(null);
      return;
    }
    fetchIntersections();
  }, [participant?.id, participant?.answers.intersections]); // eslint-disable-line react-hooks/exhaustive-deps

  // Hydrate ikigai/actions from participant when available
  useEffect(() => {
    if (participant?.answers.ikigai != null && ikigai === "") setIkigai(participant.answers.ikigai);
    if (participant?.answers.actions != null && participant.answers.actions.length > 0 && actions.length === 0)
      setActions(participant.answers.actions);
  }, [participant?.answers.ikigai, participant?.answers.actions]);

  const handleContinue = () => {
    if (!session || !name || !participantId || !intersections) return;
    const payload = {
      ...buildPayload(name),
      intersections,
      ikigai: ikigai.trim(),
      actions,
    };
    updateAnswers.mutate({ sessionId: session, participantId, answers: { ikigai: ikigai.trim(), actions } });
    updateStep.mutate({ sessionId: session, participantId, step: "snapshot" });
    const link =
      typeof window !== "undefined"
        ? `${window.location.origin}${resultUrl(session, name)}`
        : resultUrl(session, name);
    saveShareLink.mutate({ sessionId: session, participantId, shareLink: link });
    setSnapshotPayload(session, name, payload);
    navigate(resultUrl(session, name));
  };

  const canContinue =
    intersections != null && ikigai.trim() !== "" && actions.length >= 1;

  if (isLoadingParticipant) {
    return (
      <div className="w-full max-w-lg flex flex-col items-center justify-center py-16">
        <p className={`text-sm ${theme.muted} animate-pulse`}>Cargando…</p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-lg flex flex-col items-center px-4 py-8">
      <header className="text-center mb-8 animate-fade-up">
        <h1 className={`font-display text-2xl ${theme.text} mb-2`}>Tu resumen Ikigai</h1>
        <p className={`text-sm ${theme.muted}`}>
          Revisa las intersecciones, escribe tu Ikigai y al menos una acción concreta.
        </p>
      </header>

      {/* Block 1: Intersections (AI) */}
      <section
        className={`w-full rounded-3xl p-6 sm:p-8 border border-dawn-accent/20 ${theme.bg} shadow-lg mb-6 animate-[fade-up_0.8s_ease_0.1s_both]`}
      >
        <h2 className={`text-[0.65rem] tracking-[0.2em] uppercase ${theme.muted} font-semibold mb-4`}>
          Las cuatro intersecciones
        </h2>
        {isLoadingIntersections && (
          <div className="space-y-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-14 bg-dawn-accent/10 rounded-xl animate-pulse" />
            ))}
            <p className={`text-xs ${theme.muted} mt-3`}>Generando con IA…</p>
          </div>
        )}
        {errorIntersections && !isLoadingIntersections && (
          <div className="space-y-3">
            <p className={`text-sm ${theme.text}`}>No se pudieron generar las intersecciones.</p>
            <button
              type="button"
              onClick={() => fetchIntersections()}
              className={`py-2.5 px-4 rounded-xl border-2 border-dawn-accent/40 ${theme.bg} ${theme.text} font-medium text-sm hover:bg-dawn-accent/10 transition-colors`}
            >
              Reintentar
            </button>
          </div>
        )}
        {intersections && !isLoadingIntersections && (
          <div className="space-y-4">
            {INTERSECTION_LABELS.map(({ key, title }) => (
              <div key={key} className="rounded-xl bg-white/60 border border-dawn-accent/15 px-4 py-3">
                <p className={`text-[0.65rem] tracking-wider uppercase ${theme.muted} font-semibold mb-1`}>
                  {title}
                </p>
                <p className={`text-sm ${theme.text} leading-relaxed`}>{intersections[key]}</p>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Block 2: Ikigai (user) */}
      <section
        className={`w-full rounded-3xl p-6 sm:p-8 border border-dawn-accent/20 ${theme.bg} shadow-lg mb-6 animate-[fade-up_0.8s_ease_0.15s_both]`}
      >
        <label htmlFor="ikigai-input" className={`text-[0.65rem] tracking-[0.2em] uppercase ${theme.muted} font-semibold block mb-3`}>
          Mi Ikigai
        </label>
        <textarea
          id="ikigai-input"
          value={ikigai}
          onChange={(e) => setIkigai(e.target.value)}
          placeholder="Una frase que una tus cuatro áreas..."
          rows={3}
          className={`w-full py-3 px-4 rounded-xl border-[1.5px] border-dawn-accent/25 bg-white/60 font-body ${theme.text} placeholder:text-dawn-muted/70 outline-none focus:border-dawn-accent focus:ring-2 focus:ring-dawn-accent/20 focus:ring-offset-0 resize-y`}
        />
      </section>

      {/* Block 3: Actions (array, min 1) */}
      <ActionsInput
        actions={actions}
        onActionsChange={setActions}
        theme={theme}
      />

      <div className="w-full max-w-[560px] flex justify-center mt-6">
        <button
          type="button"
          onClick={handleContinue}
          disabled={!canContinue}
          className={`w-full py-4 rounded-xl font-display text-base min-h-[48px] transition-all ${
            canContinue
              ? "bg-dawn-dark text-white hover:bg-dawn-accent hover:-translate-y-px cursor-pointer"
              : "opacity-40 cursor-not-allowed bg-black/10 text-dawn-muted"
          }`}
        >
          Ver mi tarjeta
        </button>
      </div>
    </div>
  );
}
