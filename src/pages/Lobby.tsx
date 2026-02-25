import { Link } from "react-router-dom";
import { useState } from "react";
import { useQueryState } from "nuqs";
import { sessionParser, nameParser } from "../lib/nuqs";
import { sessionUrl, workshopUrl, analyticsSessionUrl } from "../lib/routes";
import { getCategory, type Season } from "../constants/categories";
import { useParticipants } from "../hooks/useParticipants";
import { nameToParticipantId, participantDisplayName } from "../models/participant.model";
import { getUserIdentity } from "../lib/userIdentity";
import type { StepValue } from "../lib/nuqs";
import QRCode from "../components/QRCode";
import BreathingBackground from "../components/BreathingBackground";

function stepLabel(step: StepValue): string {
  if (step === "lobby") return "En el lobby";
  if (step === "snapshot") return "Completado ✓";
  if (step === "5") return "Escribiendo su acción";
  const cat = getCategory(step as "1" | "2" | "3" | "4");
  return cat ? `Paso ${step}: ${cat.shortName}` : `Paso ${step}`;
}

function getStepSeason(step: StepValue): Season | null {
  const cat = getCategory(step as "1" | "2" | "3" | "4");
  return cat?.season ?? null;
}

const SEASON_CARD_STYLES: Record<Season, { 
  bg: string; 
  border: string; 
  ring: string;
  avatar: string;
  avatarBg: string;
  button: string;
  buttonHover: string;
}> = {
  spring: {
    bg: "bg-spring-bg/70 backdrop-blur-sm",
    border: "border-spring-accent/50",
    ring: "ring-spring-accent/30",
    avatar: "text-white bg-spring-accent",
    avatarBg: "text-spring-accent bg-spring-accent/20",
    button: "border-spring-accent/50 bg-spring-accent/10 text-spring-accent hover:bg-spring-accent/20 hover:border-spring-accent/70",
    buttonHover: "hover:bg-spring-accent/15 hover:border-spring-accent/60"
  },
  summer: {
    bg: "bg-summer-bg/70 backdrop-blur-sm",
    border: "border-summer-accent/50",
    ring: "ring-summer-accent/30",
    avatar: "text-white bg-summer-accent",
    avatarBg: "text-summer-accent bg-summer-accent/20",
    button: "border-summer-accent/50 bg-summer-accent/10 text-summer-accent hover:bg-summer-accent/20 hover:border-summer-accent/70",
    buttonHover: "hover:bg-summer-accent/15 hover:border-summer-accent/60"
  },
  autumn: {
    bg: "bg-autumn-bg/70 backdrop-blur-sm",
    border: "border-autumn-accent/50",
    ring: "ring-autumn-accent/30",
    avatar: "text-white bg-autumn-accent",
    avatarBg: "text-autumn-accent bg-autumn-accent/20",
    button: "border-autumn-accent/50 bg-autumn-accent/10 text-autumn-accent hover:bg-autumn-accent/20 hover:border-autumn-accent/70",
    buttonHover: "hover:bg-autumn-accent/15 hover:border-autumn-accent/60"
  },
  winter: {
    bg: "bg-winter-bg/70 backdrop-blur-sm",
    border: "border-winter-accent/50",
    ring: "ring-winter-accent/30",
    avatar: "text-white bg-winter-accent",
    avatarBg: "text-winter-accent bg-winter-accent/20",
    button: "border-winter-accent/50 bg-winter-accent/10 text-winter-accent hover:bg-winter-accent/20 hover:border-winter-accent/70",
    buttonHover: "hover:bg-winter-accent/15 hover:border-winter-accent/60"
  }
};

export default function Lobby() {
  const [session] = useQueryState("session", sessionParser);
  const [name] = useQueryState("name", nameParser);
  const { data: participants = [] } = useParticipants(session);
  const [isShareExpanded, setIsShareExpanded] = useState(false);
  const [isQRModalOpen, setIsQRModalOpen] = useState(false);

  // Get the actual logged-in user's identity from sessionStorage
  const userIdentity = getUserIdentity();
  const myParticipantId = userIdentity?.participantId ?? (name ? nameToParticipantId(name) : null);
  
  // Find my participant data to get the actual name for URLs
  const myParticipant = participants.find((p) => p.id === myParticipantId);
  const myActualName = myParticipant ? participantDisplayName(myParticipant) : name;

  const joinUrl =
    typeof window !== "undefined" && session
      ? `${window.location.origin}${sessionUrl(session)}`
      : "";
  const startUrl = session && myActualName ? workshopUrl(session, myActualName, "1") : "#";
  const sessionLabel = session ? `Sesión #${session.slice(0, 8).toUpperCase()}` : "";

  const copyLink = () => {
    if (joinUrl) navigator.clipboard.writeText(joinUrl);
  };

  // Sort participants: "You" first, then others
  const sortedParticipants = [...participants].sort((a, b) => {
    const aIsMe = a.id === myParticipantId;
    const bIsMe = b.id === myParticipantId;
    if (aIsMe) return -1;
    if (bIsMe) return 1;
    return 0;
  });

  const isSolo = participants.length <= 1;

  return (
    <>
      <BreathingBackground />
      <div className="relative w-full max-w-[1100px] mx-auto px-4 sm:px-10 pt-4 pb-10" style={{ zIndex: 1 }}>
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-9 animate-fade-up">
        <div>
          <p className="text-xs text-spring-muted tracking-widest uppercase mb-1 font-medium">
            {sessionLabel}
          </p>
          <h1 className="font-display text-2xl text-spring-dark">Participantes</h1>
        </div>
        <div className="flex items-center gap-2">
          {session && (
            <Link
              to={analyticsSessionUrl(session)}
              className="inline-flex items-center gap-2 py-2.5 px-5 rounded-xl border-[1.5px] border-spring-dark/20 bg-white/80 backdrop-blur-sm text-spring-dark font-body text-sm hover:border-spring-accent hover:text-spring-accent transition-colors min-h-[44px]"
            >
              Estadísticas de la sesión
            </Link>
          )}
          <Link
            to={startUrl}
            className="inline-flex items-center gap-2 py-2.5 px-5 rounded-xl border-[1.5px] border-spring-dark/20 bg-white text-spring-dark font-body text-sm hover:border-spring-accent hover:text-spring-accent transition-colors min-h-[44px]"
          >
            Empezar mi Ikigai →
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-[repeat(auto-fill,minmax(300px,1fr))] gap-4">
        {participants.length > 0 ? (
          sortedParticipants.map((p) => {
            const isMe = p.id === myParticipantId;
            const hasCompleted = p.isFinished && p.shareLink;
            const season = getStepSeason(p.step);
            const seasonStyles = season ? SEASON_CARD_STYLES[season] : null;
            
            // For "my" card, always show spring color when in lobby
            const effectiveStyles = seasonStyles || (isMe ? SEASON_CARD_STYLES.spring : null);
            
            return (
              <div
                key={p.id}
                className={`rounded-2xl p-5 sm:p-6 border shadow-sm flex flex-col gap-3 animate-fade-up transition-all duration-500 ${
                  effectiveStyles
                    ? `${effectiveStyles.bg} ${effectiveStyles.border} ${isMe ? 'border-solid shadow-md ring-1' : 'border-solid'} ${isMe ? effectiveStyles.ring : ''}`
                    : "bg-white/50 border-gray-200 border-dashed"
                }`}
              >
                <div className="flex items-center gap-4">
                  <div
                    className={`w-11 h-11 rounded-full flex items-center justify-center shrink-0 font-display text-lg ${
                      effectiveStyles
                        ? isMe
                          ? effectiveStyles.avatar
                          : effectiveStyles.avatarBg
                        : "text-gray-500 bg-gray-100"
                    }`}
                  >
                    {p.firstName.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={`font-display text-base mb-0.5 ${
                      effectiveStyles ? 'text-spring-dark' : 'text-gray-700'
                    }`}>
                      {participantDisplayName(p)}
                    </p>
                    <p className={`text-[0.7rem] tracking-wide ${
                      isMe 
                        ? effectiveStyles 
                          ? "text-spring-accent font-medium"
                          : "text-gray-500 font-medium" 
                        : effectiveStyles
                        ? "text-spring-muted"
                        : "text-gray-400"
                    }`}>
                      {isMe ? "Tú" : stepLabel(p.step)}
                    </p>
                    {isMe && (
                      <p className="text-[0.7rem] text-spring-muted tracking-wide mt-0.5">
                        {stepLabel(p.step)}
                      </p>
                    )}
                  </div>
                </div>
                {hasCompleted && p.shareLink && (
                  <a
                    href={p.shareLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`w-full py-2 px-4 rounded-lg border text-xs font-medium transition-all duration-200 text-center ${
                      effectiveStyles
                        ? isMe
                          ? effectiveStyles.button
                          : `border ${effectiveStyles.border} bg-white/60 ${effectiveStyles.buttonHover}`
                        : "border-gray-300 bg-white text-gray-600 hover:bg-gray-50"
                    }`}
                  >
                    Ver {isMe ? "mi" : "su"} tarjeta →
                  </a>
                )}
              </div>
            );
          })
        ) : (
          <div className="bg-white rounded-2xl p-5 sm:p-6 border border-spring-accent/30 shadow-md ring-1 ring-spring-accent/20 flex items-center gap-4 animate-fade-up">
            <div className="w-11 h-11 rounded-full flex items-center justify-center shrink-0 font-display text-lg text-white bg-spring-accent">
              {myActualName?.charAt(0)?.toUpperCase() ?? "?"}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-display text-base text-spring-dark mb-0.5">{myActualName || "Tú"}</p>
              <p className="text-[0.7rem] text-spring-accent font-medium tracking-wide">Tú</p>
              <p className="text-[0.7rem] text-spring-muted tracking-wide mt-0.5">En el lobby</p>
            </div>
          </div>
        )}
      </div>

      {isSolo ? (
        // SOLO: Grande y prominente para facilitar compartir
        <div className="mt-8 bg-white/80 backdrop-blur-sm rounded-3xl p-8 sm:p-10 border border-spring-accent/15 shadow-lg animate-[fade-up_0.8s_ease_0.2s_both] flex flex-col items-center text-center gap-6">
          <button
            type="button"
            onClick={() => setIsQRModalOpen(true)}
            className="w-[180px] h-[180px] sm:w-[200px] sm:h-[200px] rounded-2xl bg-spring-bg flex items-center justify-center p-4 shadow-inner hover:bg-spring-accent/10 hover:shadow-md transition-all cursor-pointer group"
            aria-label="Ver el código QR en tamaño completo"
          >
            <QRCode value={joinUrl} size={160} />
            <span className="absolute inset-0 flex items-center justify-center bg-spring-dark/0 group-hover:bg-spring-dark/5 rounded-2xl transition-all">
              <span className="opacity-0 group-hover:opacity-100 text-spring-accent text-xs font-medium transition-opacity">
                Clic para ampliar
              </span>
            </span>
          </button>
          <div>
            <h2 className="font-display text-xl sm:text-2xl text-spring-dark mb-2">Invita a otras personas</h2>
            <p className="text-sm text-spring-muted mb-4 max-w-md mx-auto">
              Comparte este código QR o enlace para que otras personas se unan a tu sesión
            </p>
            <p className="text-xs text-spring-muted mb-4 break-all font-mono bg-spring-bg/50 py-2 px-3 rounded-lg max-w-md mx-auto">
              {joinUrl || "—"}
            </p>
            <button
              type="button"
              onClick={copyLink}
              className="py-3 px-6 rounded-xl bg-spring-dark text-white font-body text-sm hover:bg-spring-accent transition-colors shadow-lg hover:-translate-y-0.5 active:translate-y-0"
            >
              Copiar enlace
            </button>
          </div>
        </div>
      ) : (
        // MULTIPLE: Colapsable y compacto
        <div className="mt-8 bg-white/80 backdrop-blur-sm rounded-2xl border border-spring-accent/15 shadow-md overflow-hidden transition-all duration-300 animate-[fade-up_0.8s_ease_0.2s_both]">
          <button
            type="button"
            onClick={() => setIsShareExpanded(!isShareExpanded)}
            className="w-full py-4 px-6 flex items-center justify-between text-spring-dark hover:bg-spring-bg/30 transition-colors"
          >
            <span className="font-display text-base">Compartir sesión</span>
            <span
              className={`text-spring-accent text-xl transition-transform duration-300 ${isShareExpanded ? "rotate-180" : ""}`}
            >
              ▼
            </span>
          </button>
          <div
            className={`transition-all duration-300 ease-in-out ${isShareExpanded ? "max-h-[400px] opacity-100" : "max-h-0 opacity-0"} overflow-hidden`}
          >
            <div className="p-6 border-t border-spring-accent/10 flex flex-col sm:flex-row sm:items-center gap-6">
              <button
                type="button"
                onClick={() => setIsQRModalOpen(true)}
                className="w-[120px] h-[120px] rounded-xl bg-spring-bg flex items-center justify-center p-3 shrink-0 mx-auto sm:mx-0 hover:bg-spring-accent/10 hover:shadow-md transition-all cursor-pointer group relative"
                aria-label="Ver el código QR en tamaño completo"
              >
                <QRCode value={joinUrl} size={96} />
                <span className="absolute inset-0 flex items-center justify-center bg-spring-dark/0 group-hover:bg-spring-dark/5 rounded-xl transition-all">
                  <span className="opacity-0 group-hover:opacity-100 text-spring-accent text-[0.65rem] font-medium transition-opacity">
                    Ampliar
                  </span>
                </span>
              </button>
              <div className="flex-1 min-w-0 text-center sm:text-left">
                <h3 className="font-display text-base text-spring-dark mb-2">Invita a otras personas</h3>
                <p className="text-xs text-spring-muted mb-3 break-all font-mono bg-spring-bg/50 py-2 px-3 rounded-lg">
                  {joinUrl || "—"}
                </p>
                <button
                  type="button"
                  onClick={copyLink}
                  className="py-2 px-4 rounded-lg border-[1.5px] border-spring-dark/20 bg-white text-spring-dark font-body text-sm hover:border-spring-accent hover:text-spring-accent transition-colors"
                >
                  Copiar enlace
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* QR Code Modal */}
      {isQRModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-md animate-fade-in"
          onClick={() => setIsQRModalOpen(false)}
        >
          <div
            className="bg-white/95 backdrop-blur-sm rounded-3xl p-8 sm:p-12 shadow-2xl max-w-md w-full animate-scale-in"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-start mb-6">
              <div>
                <h3 className="font-display text-xl text-spring-dark mb-1">Escanea para unirte</h3>
                <p className="text-xs text-spring-muted tracking-widest uppercase">
                  {sessionLabel}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsQRModalOpen(false)}
                className="text-spring-muted hover:text-spring-accent transition-colors text-2xl leading-none"
                aria-label="Cerrar"
              >
                ×
              </button>
            </div>
            <div className="bg-spring-bg rounded-2xl p-8 flex items-center justify-center mb-6">
              <QRCode value={joinUrl} size={280} />
            </div>
            <p className="text-xs text-spring-muted mb-4 break-all font-mono bg-spring-bg/50 py-3 px-4 rounded-lg text-center">
              {joinUrl || "—"}
            </p>
            <button
              type="button"
              onClick={copyLink}
              className="w-full py-3 px-6 rounded-xl bg-spring-dark text-white font-body text-sm hover:bg-spring-accent transition-all duration-200 shadow-lg hover:-translate-y-0.5 active:translate-y-0"
            >
              Copiar enlace
            </button>
          </div>
        </div>
      )}
    </div>
    </>
  );
}
