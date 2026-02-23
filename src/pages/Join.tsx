import { useSearchParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { nanoid } from "nanoid";
import { workshopUrl } from "../lib/routes";
import { useJoinSession } from "../hooks/useParticipant";
import { setUserIdentity, getUserIdentity } from "../lib/userIdentity";
import { nameToParticipantId, participantDisplayName } from "../models/participant.model";
import { getParticipantsBySession } from "../services/analytics.service";

export default function Join() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const sessionIdFromUrl = searchParams.get("session") ?? "";
  const [sessionIdInput, setSessionIdInput] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const joinSession = useJoinSession();

  const handleCreateSession = () => {
    setSearchParams({ session: nanoid(10) });
  };

  const handleJoinWithId = (e: React.FormEvent) => {
    e.preventDefault();
    const id = sessionIdInput.trim();
    if (id) setSearchParams({ session: id });
  };

  const handleEnterSession = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedFirst = firstName.trim();
    const trimmedLast = lastName.trim();
    const name = [trimmedFirst, trimmedLast].filter(Boolean).join(" ");
    if (!name) return;
    const session = sessionIdFromUrl || nanoid(10);

    // Save user identity to sessionStorage using participant ID
    const participantId = nameToParticipantId(name);
    setUserIdentity(session, participantId);

    try {
      await joinSession.mutateAsync({
        sessionId: session,
        hostName: name,
        participant: { firstName: trimmedFirst, lastName: trimmedLast },
      });
      navigate(workshopUrl(session, name, "lobby"));
    } catch (err) {
      console.error("Error al unirse a la sesión:", err);
    }
  };

  const hasSession = sessionIdFromUrl !== "";
  const canEnterSession = hasSession && Boolean(firstName.trim() && lastName.trim());
  const sessionLabel = hasSession ? `Sesión #${sessionIdFromUrl.slice(0, 8).toUpperCase()}` : null;
  const canJoinWithId = sessionIdInput.trim() !== "";

  // Si ya estás en esta sesión (identidad guardada), ir directo al lobby
  useEffect(() => {
    if (!hasSession || !sessionIdFromUrl) return;
    const identity = getUserIdentity();
    if (!identity || identity.session !== sessionIdFromUrl) return;
    let cancelled = false;
    getParticipantsBySession(sessionIdFromUrl)
      .then((participants) => {
        if (cancelled) return;
        const me = participants.find((p) => p.id === identity.participantId);
        if (me) {
          navigate(workshopUrl(sessionIdFromUrl, participantDisplayName(me), "lobby"), {
            replace: true,
          });
        }
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [hasSession, sessionIdFromUrl, navigate]);

  return (
    <div className="w-full max-w-md flex flex-col items-center justify-center gap-0 px-4">
      {/* Large decorative kanji watermark */}
      <div
        className="absolute top-20 left-1/2 -translate-x-1/2 select-none pointer-events-none font-serif text-[7rem] sm:text-[9rem] text-dawn-accent opacity-[0.14] leading-none tracking-tighter"
        aria-hidden
      >
        生き甲斐
      </div>

      <header className="text-center mb-10 sm:mb-14 animate-fade-up relative">
        <p className="text-xs text-dawn-muted tracking-[0.2em] uppercase mb-3 font-medium">
          Encuentra tu propósito
        </p>
        <h1 className="font-display text-4xl sm:text-5xl text-dawn-dark tracking-tight mb-2.5 font-semibold">
          Descubre tu Ikigai
        </h1>
        <p className="text-sm text-dawn-muted tracking-[0.08em] max-w-xs mx-auto">
          Un recorrido guiado por los cuatro círculos: lo que amas, en lo que eres bueno, lo que el mundo necesita y por lo que te pueden pagar.
        </p>
      </header>

      <div className="w-full bg-white rounded-2xl sm:rounded-3xl md:rounded-[28px] p-6 sm:p-8 md:p-10 shadow-xl border border-dawn-accent/15 relative animate-[fade-up_0.9s_ease_0.15s_both] ring-1 ring-black/5">
        {/* Top accent line */}
        <div className="absolute top-0 left-6 right-6 sm:left-8 sm:right-8 h-1 rounded-b-full bg-linear-to-r from-transparent via-dawn-accent/80 to-transparent" />

        {!hasSession ? (
          <div className="flex flex-col gap-5 mb-2">
            <button
              type="button"
              onClick={handleCreateSession}
              className="w-full py-3.5 px-4 rounded-xl border-2 border-dawn-accent/35 bg-dawn-bg/60 text-dawn-dark font-medium hover:bg-dawn-accent/15 hover:border-dawn-accent/50 transition-all duration-200"
            >
              Crear nueva sesión
            </button>
            <div className="relative flex items-center gap-2 before:content-[''] before:flex-1 before:h-px before:bg-dawn-accent/20 after:content-[''] after:flex-1 after:h-px after:bg-dawn-accent/20">
              <span className="text-[0.65rem] tracking-widest uppercase text-dawn-muted font-medium">o</span>
            </div>
            <form onSubmit={handleJoinWithId} className="flex flex-col gap-3">
              <label
                htmlFor="sessionId"
                className="block text-[0.7rem] tracking-[0.12em] uppercase text-dawn-muted mb-1 font-medium"
              >
                ID de sesión
              </label>
              <div className="flex flex-col sm:flex-row gap-2">
                <input
                  id="sessionId"
                  type="text"
                  value={sessionIdInput}
                  onChange={(e) => setSessionIdInput(e.target.value)}
                  placeholder="Pega o escribe el ID de sesión"
                  className="flex-1 py-3.5 px-4 rounded-xl border-2 border-dawn-accent/20 bg-dawn-bg/40 font-body text-sm sm:text-base text-dawn-dark placeholder:text-dawn-muted/70 outline-none transition-all duration-200 focus:border-dawn-accent focus:ring-4 focus:ring-dawn-accent/15"
                  autoComplete="off"
                />
                <button
                  type="submit"
                  disabled={!canJoinWithId}
                  className="w-full sm:w-auto py-3.5 px-5 rounded-xl border-2 border-dawn-accent/35 bg-dawn-bg/60 text-dawn-dark font-medium hover:bg-dawn-accent/15 hover:border-dawn-accent/50 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shrink-0"
                >
                  Unirme
                </button>
              </div>
            </form>
          </div>
        ) : (
          <>
            {sessionLabel && (
              <div className="inline-flex items-center gap-2 bg-dawn-bg/80 border border-dawn-accent/25 rounded-full py-2 px-4 mb-6">
                <span className="w-2 h-2 rounded-full bg-dawn-accent animate-pulse-dot" />
                <span className="text-xs text-dawn-accent tracking-[0.08em] font-medium">
                  {sessionLabel}
                </span>
              </div>
            )}
            <form onSubmit={handleEnterSession} className="flex flex-col gap-6">
              <div className="flex flex-col gap-4">
                <div>
                  <label
                    htmlFor="firstName"
                    className="block text-[0.7rem] tracking-[0.12em] uppercase text-dawn-muted mb-1.5 font-medium"
                  >
                    Nombre
                  </label>
                  <input
                    id="firstName"
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="w-full py-3.5 px-4 rounded-xl border-2 border-dawn-accent/20 bg-dawn-bg/40 font-body text-base text-dawn-dark placeholder:text-dawn-muted/70 outline-none transition-all duration-200 focus:border-dawn-accent focus:ring-4 focus:ring-dawn-accent/15"
                    placeholder="Hana"
                    autoComplete="given-name"
                  />
                </div>
                <div>
                  <label
                    htmlFor="lastName"
                    className="block text-[0.7rem] tracking-[0.12em] uppercase text-dawn-muted mb-1.5 font-medium"
                  >
                    Apellido
                  </label>
                  <input
                    id="lastName"
                    type="text"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className="w-full py-3.5 px-4 rounded-xl border-2 border-dawn-accent/20 bg-dawn-bg/40 font-body text-base text-dawn-dark placeholder:text-dawn-muted/70 outline-none transition-all duration-200 focus:border-dawn-accent focus:ring-4 focus:ring-dawn-accent/15"
                    placeholder="Tanaka"
                    autoComplete="family-name"
                  />
                </div>
              </div>
              {joinSession.isError && (
                <p className="text-sm text-red-600" role="alert">
                  No se pudo unir a la sesión. Revisa tu conexión e inténtalo de nuevo.
                </p>
              )}
              <button
                type="submit"
                disabled={!canEnterSession || joinSession.isPending}
                className="w-full py-4 rounded-xl bg-dawn-dark text-white font-display text-base tracking-wide disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 hover:bg-dawn-accent hover:-translate-y-0.5 active:translate-y-0 min-h-[48px] shadow-lg shadow-dawn-dark/20 hover:shadow-dawn-accent/25"
              >
                {joinSession.isPending ? "Guardando…" : "Entrar a la sesión →"}
              </button>
            </form>
          </>
        )}
      </div>

      <p className="mt-8 text-center text-xs text-dawn-muted/90 max-w-[280px] animate-[fade-up_0.6s_ease_0.3s_both]">
        Tu camino empieza con un paso. Comparte el enlace de la sesión para que otras personas se unan.
      </p>
    </div>
  );
}
