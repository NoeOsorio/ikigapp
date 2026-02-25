import { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useQueryState } from "nuqs";
import { motion } from "framer-motion";
import { Heart, Globe, Briefcase, Sparkles, ChevronDown, X, Plus, ArrowRight } from "lucide-react";
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

const INTERSECTION_LABELS: { 
  key: keyof Intersections; 
  title: string; 
  subtitle: string;
  bgColor: string;
  borderColor: string;
  Icon: typeof Heart;
}[] = [
  { 
    key: "pasion", 
    title: "Pasión", 
    subtitle: "Lo que amas + En lo que eres bueno",
    bgColor: "bg-rose-100",
    borderColor: "border-rose-300",
    Icon: Heart
  },
  { 
    key: "mision", 
    title: "Misión", 
    subtitle: "Lo que amas + Lo que el mundo necesita",
    bgColor: "bg-sky-100",
    borderColor: "border-sky-300",
    Icon: Globe
  },
  { 
    key: "profesion", 
    title: "Profesión", 
    subtitle: "En lo que eres bueno + Por lo que te pagan",
    bgColor: "bg-emerald-100",
    borderColor: "border-emerald-300",
    Icon: Briefcase
  },
  { 
    key: "vocacion", 
    title: "Vocación", 
    subtitle: "Lo que el mundo necesita + Por lo que te pagan",
    bgColor: "bg-amber-100",
    borderColor: "border-amber-300",
    Icon: Sparkles
  },
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
  const [showScrollIndicator, setShowScrollIndicator] = useState(true);
  const generatingRef = useRef(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 100) {
        setShowScrollIndicator(false);
      } else {
        setShowScrollIndicator(true);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

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
  }, [participant?.answers.ikigai, participant?.answers.actions, ikigai, actions.length]);

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
    <div className="w-full max-w-2xl flex flex-col items-center px-4 py-8 relative">
      <header className="text-center mb-12 animate-fade-up relative z-10">
        <div className="inline-flex items-center gap-2 bg-amber-100 border-2 border-amber-300 rounded-full px-4 py-2 mb-4">
          <span className="text-xl">生</span>
          <span className="text-[0.65rem] tracking-[0.18em] uppercase text-dawn-dark font-semibold">
            Paso final
          </span>
        </div>
        <h1 className="font-display text-3xl sm:text-4xl text-dawn-dark mb-3 tracking-tight font-semibold">
          Tu resumen Ikigai
        </h1>
        <p className="text-sm text-dawn-muted leading-relaxed max-w-md mx-auto">
          Revisa las cuatro intersecciones generadas por IA, escribe tu propósito central y define tus acciones concretas.
        </p>
      </header>

      {/* Scroll indicator - solo visible al inicio */}
      {showScrollIndicator && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 flex flex-col items-center gap-2"
        >
          <span className="text-xs text-dawn-muted/70 font-medium tracking-wide">Desplázate para ver más</span>
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
            className="w-10 h-10 rounded-full bg-white border-2 border-dawn-accent shadow-lg flex items-center justify-center"
          >
            <ChevronDown className="w-5 h-5 text-dawn-accent" strokeWidth={2.5} />
          </motion.div>
        </motion.div>
      )}

      {/* Block 1: Intersections (AI) */}
      <section className="w-full mb-8 animate-[fade-up_0.8s_ease_0.1s_both] relative z-10">
        <div className="flex items-center gap-3 mb-6">
          <div className="flex-1 h-px bg-dawn-accent/30" />
          <h2 className="text-[0.7rem] tracking-[0.2em] uppercase text-dawn-dark font-bold">
            Las cuatro intersecciones
          </h2>
          <div className="flex-1 h-px bg-dawn-accent/30" />
        </div>

        {isLoadingIntersections && (
          <div className="space-y-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-28 bg-dawn-bg rounded-2xl animate-pulse border-2 border-dawn-accent/20" />
            ))}
            <div className="text-center py-4">
              <p className="text-sm text-dawn-muted mb-3 font-medium">Generando con IA...</p>
              <div className="flex items-center justify-center gap-1.5">
                <motion.div
                  animate={{ scale: [1, 1.3, 1] }}
                  transition={{ duration: 0.8, repeat: Infinity, delay: 0 }}
                  className="w-2 h-2 rounded-full bg-dawn-accent"
                />
                <motion.div
                  animate={{ scale: [1, 1.3, 1] }}
                  transition={{ duration: 0.8, repeat: Infinity, delay: 0.2 }}
                  className="w-2 h-2 rounded-full bg-dawn-accent"
                />
                <motion.div
                  animate={{ scale: [1, 1.3, 1] }}
                  transition={{ duration: 0.8, repeat: Infinity, delay: 0.4 }}
                  className="w-2 h-2 rounded-full bg-dawn-accent"
                />
              </div>
            </div>
          </div>
        )}

        {errorIntersections && !isLoadingIntersections && (
          <div className="rounded-2xl bg-red-50 border-2 border-red-300 p-6 text-center space-y-4">
            <p className="text-sm text-red-800 font-medium">No se pudieron generar las intersecciones.</p>
            <button
              type="button"
              onClick={() => fetchIntersections()}
              className="py-3 px-6 rounded-xl bg-red-500 text-white font-medium text-sm hover:bg-red-600 transition-all hover:-translate-y-0.5 active:translate-y-0 shadow-md"
            >
              Reintentar generación
            </button>
          </div>
        )}

        {intersections && !isLoadingIntersections && (
          <div className="grid grid-cols-1 gap-4">
            {INTERSECTION_LABELS.map(({ key, title, subtitle, bgColor, borderColor, Icon }, index) => (
              <motion.div
                key={key}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`group rounded-2xl bg-white border-2 ${borderColor} hover:shadow-lg transition-all duration-300 overflow-hidden`}
              >
                <div className="p-5 sm:p-6">
                  <div className="flex items-start gap-4">
                    <div className={`shrink-0 w-12 h-12 rounded-xl ${bgColor} flex items-center justify-center`}>
                      <Icon className="w-6 h-6 text-dawn-dark" strokeWidth={2} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-base font-display font-bold text-dawn-dark mb-1">
                        {title}
                      </h3>
                      <p className="text-[0.7rem] text-dawn-muted/80 mb-3 tracking-wide">
                        {subtitle}
                      </p>
                      <p className="text-[0.95rem] text-dawn-dark leading-relaxed font-medium">
                        {intersections[key]}
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </section>

      {/* Block 2: Ikigai (user) */}
      <section className="w-full mb-6 animate-[fade-up_0.8s_ease_0.15s_both] relative z-10">
        <div className="rounded-[28px] bg-white border-2 border-indigo-200 p-6 sm:p-8 shadow-lg relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-indigo-400 rounded-t-[28px]" />
          
          <label htmlFor="ikigai-input" className="flex items-center gap-2.5 text-[0.7rem] tracking-[0.18em] uppercase text-dawn-dark font-bold mb-2 mt-1">
            <span className="text-xl">生</span>
            Mi Ikigai
          </label>
          
          <div className="mb-4 p-4 bg-indigo-50 rounded-xl border border-indigo-200">
            <p className="text-sm text-dawn-dark leading-relaxed mb-2">
              <strong className="font-bold text-indigo-700">Este es el momento más importante:</strong> sintetiza las cuatro intersecciones en una sola frase que capture tu propósito de vida.
            </p>
            <p className="text-xs text-dawn-muted/80 leading-relaxed">
              No copies las intersecciones. Escribe <strong>tu propia conclusión</strong> sobre lo que todas estas áreas revelan sobre tu razón de ser.
            </p>
          </div>
          
          <textarea
            id="ikigai-input"
            value={ikigai}
            onChange={(e) => setIkigai(e.target.value)}
            placeholder="Ej: Mi propósito es usar mi creatividad y experiencia para ayudar a las personas a encontrar claridad en su vida profesional..."
            rows={4}
            className="w-full py-4 px-5 rounded-xl border-2 border-indigo-200 bg-white font-display text-base text-dawn-dark placeholder:text-dawn-muted/50 placeholder:text-sm outline-none focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100 transition-all resize-y"
          />
        </div>
      </section>

      {/* Block 3: Actions (array, min 1) */}
      <section className="w-full mb-2 animate-[fade-up_0.8s_ease_0.2s_both] relative z-10">
        <div className="rounded-[28px] bg-white border-2 border-emerald-200 p-6 sm:p-8 shadow-lg relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-emerald-400 rounded-t-[28px]" />
          
          <h2 className="flex items-center gap-2.5 text-[0.7rem] tracking-[0.18em] uppercase text-dawn-dark font-bold mb-2 mt-1">
            <ArrowRight className="w-4 h-4 text-emerald-600" strokeWidth={2.5} />
            Acciones concretas
            <span className="text-[0.65rem] normal-case text-dawn-muted font-normal">(mínimo 1)</span>
          </h2>
          
          <div className="mb-4 p-4 bg-emerald-50 rounded-xl border border-emerald-200">
            <p className="text-sm text-dawn-dark leading-relaxed mb-2">
              <strong className="font-bold text-emerald-700">Convierte tu Ikigai en realidad:</strong> define pasos específicos y alcanzables que puedas comenzar ahora.
            </p>
            <p className="text-xs text-dawn-muted/80 leading-relaxed">
              Sé concreto: "Este mes voy a..." o "La próxima semana haré...". Evita generalidades como "ser mejor" o "trabajar más".
            </p>
          </div>
          
          <div className="flex flex-wrap gap-2.5 min-h-16 rounded-2xl p-4 border-2 border-dashed border-emerald-200 bg-emerald-50/30 mb-4">
            {actions.length === 0 ? (
              <p className="text-sm text-dawn-muted/60 italic w-full text-center py-2">
                Añade al menos una acción concreta para continuar
              </p>
            ) : (
              actions.map((item, i) => (
                <motion.span
                  key={`${item}-${i}`}
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="inline-flex items-center gap-2 rounded-full py-2 px-4 text-sm border-2 border-emerald-300 bg-white shadow-sm text-dawn-dark font-medium"
                >
                  <ArrowRight className="w-3.5 h-3.5 text-emerald-600" strokeWidth={2} />
                  {item}
                  <button
                    type="button"
                    onClick={() => setActions(actions.filter((_, idx) => idx !== i))}
                    className="text-dawn-muted/60 hover:text-red-500 leading-none p-0.5 rounded-full hover:bg-red-50 transition-colors"
                    aria-label={`Eliminar ${item}`}
                  >
                    <X className="w-3.5 h-3.5" strokeWidth={2} />
                  </button>
                </motion.span>
              ))
            )}
          </div>
          
          <div className="flex gap-3">
            <input
              type="text"
              placeholder="Ej: Este mes voy a inscribirme al curso de diseño que encontré..."
              className="flex-1 py-3.5 px-5 rounded-xl border-2 border-emerald-200 bg-white text-dawn-dark placeholder:text-dawn-muted/50 placeholder:text-sm outline-none focus:border-emerald-400 focus:ring-4 focus:ring-emerald-100 transition-all"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  const input = e.currentTarget;
                  const trimmed = input.value.trim();
                  if (trimmed && !actions.includes(trimmed) && actions.length < 10) {
                    setActions([...actions, trimmed]);
                    input.value = "";
                  }
                }
              }}
              aria-label="Agregar acción"
            />
            <button
              type="button"
              onClick={(e) => {
                const input = e.currentTarget.previousElementSibling as HTMLInputElement;
                const trimmed = input.value.trim();
                if (trimmed && !actions.includes(trimmed) && actions.length < 10) {
                  setActions([...actions, trimmed]);
                  input.value = "";
                }
              }}
              className="py-3.5 px-6 rounded-xl bg-emerald-500 text-white font-bold hover:bg-emerald-600 transition-all hover:-translate-y-0.5 active:translate-y-0 shrink-0 min-h-[44px] shadow-md"
            >
              <Plus className="w-5 h-5" strokeWidth={2.5} />
            </button>
          </div>
        </div>
      </section>

      <div className="w-full flex justify-center mt-8 relative z-10">
        <button
          type="button"
          onClick={handleContinue}
          disabled={!canContinue}
          className={`w-full py-5 rounded-2xl font-display text-lg min-h-[56px] transition-all shadow-lg flex items-center justify-center gap-2.5 ${
            canContinue
              ? "bg-dawn-dark text-white hover:bg-dawn-accent hover:shadow-xl hover:-translate-y-1 cursor-pointer"
              : "opacity-40 cursor-not-allowed bg-gray-300 text-gray-500"
          }`}
        >
          Ver mi tarjeta
          {canContinue && <ArrowRight className="w-5 h-5" strokeWidth={2.5} />}
        </button>
      </div>
    </div>
  );
}
