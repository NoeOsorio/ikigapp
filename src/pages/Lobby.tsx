import { Link } from "react-router-dom";
import { useState } from "react";
import { useQueryState } from "nuqs";
import { sessionParser, nameParser } from "../lib/nuqs";
import { sessionUrl, workshopUrl } from "../lib/routes";
import { getCategory } from "../constants/categories";
import { useParticipants } from "../hooks/useParticipants";
import { nameToParticipantId, participantDisplayName } from "../models/participant.model";
import type { StepValue } from "../lib/nuqs";
import QRCode from "../components/QRCode";

function stepLabel(step: StepValue): string {
  if (step === "lobby") return "In lobby";
  if (step === "snapshot") return "Completed ✓";
  if (step === "5") return "Writing their action";
  const cat = getCategory(step as "1" | "2" | "3" | "4");
  return cat ? `Step ${step}: ${cat.shortName}` : `Step ${step}`;
}

export default function Lobby() {
  const [session] = useQueryState("session", sessionParser);
  const [name] = useQueryState("name", nameParser);
  const { data: participants = [] } = useParticipants(session);
  const myParticipantId = name ? nameToParticipantId(name) : null;
  const [isShareExpanded, setIsShareExpanded] = useState(false);

  const joinUrl =
    typeof window !== "undefined" && session
      ? `${window.location.origin}${sessionUrl(session)}`
      : "";
  const startUrl = session && name ? workshopUrl(session, name, "1") : "#";
  const sessionLabel = session ? `Session #${session.slice(0, 8).toUpperCase()}` : "";

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
    <div className="w-full max-w-[1100px] mx-auto px-4 sm:px-10 pt-4 pb-10">
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-9 animate-fade-up">
        <div>
          <p className="text-xs text-spring-muted tracking-widest uppercase mb-1 font-medium">
            {sessionLabel}
          </p>
          <h1 className="font-display text-2xl text-spring-dark">Participants</h1>
        </div>
        <Link
          to={startUrl}
          className="inline-flex items-center gap-2 py-2.5 px-5 rounded-xl border-[1.5px] border-spring-dark/20 bg-white text-spring-dark font-body text-sm hover:border-spring-accent hover:text-spring-accent transition-colors min-h-[44px]"
        >
          Start My Ikigai →
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-[repeat(auto-fill,minmax(300px,1fr))] gap-4">
        {participants.length > 0 ? (
          sortedParticipants.map((p) => {
            const isMe = p.id === myParticipantId;
            const hasCompleted = p.isFinished && p.shareLink;
            return (
              <div
                key={p.id}
                className={`rounded-2xl p-5 sm:p-6 border shadow-sm flex flex-col gap-3 animate-fade-up ${
                  isMe
                    ? "bg-white border-spring-accent/30 border-solid shadow-md ring-1 ring-spring-accent/20"
                    : "bg-spring-bg/30 border-spring-accent/10 border-dashed"
                }`}
              >
                <div className="flex items-center gap-4">
                  <div
                    className={`w-11 h-11 rounded-full flex items-center justify-center shrink-0 font-display text-lg ${
                      isMe
                        ? "text-white bg-spring-accent"
                        : "text-spring-accent bg-spring-accent/15"
                    }`}
                  >
                    {p.firstName.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-display text-base text-spring-dark mb-0.5">
                      {participantDisplayName(p)}
                    </p>
                    <p className={`text-[0.7rem] tracking-wide ${isMe ? "text-spring-accent font-medium" : "text-spring-muted"}`}>
                      {isMe ? "You" : stepLabel(p.step)}
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
                      isMe
                        ? "border-spring-accent/40 bg-spring-accent/5 text-spring-accent hover:bg-spring-accent/15 hover:border-spring-accent/60"
                        : "border-spring-accent/30 bg-white/60 text-spring-accent hover:bg-spring-accent/10 hover:border-spring-accent/50"
                    }`}
                  >
                    View {isMe ? "My" : "Their"} Snapshot →
                  </a>
                )}
              </div>
            );
          })
        ) : (
          <div className="bg-white rounded-2xl p-5 sm:p-6 border border-spring-accent/30 shadow-md ring-1 ring-spring-accent/20 flex items-center gap-4 animate-fade-up">
            <div className="w-11 h-11 rounded-full flex items-center justify-center shrink-0 font-display text-lg text-white bg-spring-accent">
              {name?.charAt(0)?.toUpperCase() ?? "?"}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-display text-base text-spring-dark mb-0.5">{name || "You"}</p>
              <p className="text-[0.7rem] text-spring-accent font-medium tracking-wide">You</p>
              <p className="text-[0.7rem] text-spring-muted tracking-wide mt-0.5">In lobby</p>
            </div>
          </div>
        )}
      </div>

      {isSolo ? (
        // SOLO: Grande y prominente para facilitar compartir
        <div className="mt-8 bg-white rounded-3xl p-8 sm:p-10 border border-spring-accent/15 shadow-lg animate-[fade-up_0.8s_ease_0.2s_both] flex flex-col items-center text-center gap-6">
          <div className="w-[180px] h-[180px] sm:w-[200px] sm:h-[200px] rounded-2xl bg-spring-bg flex items-center justify-center p-4 shadow-inner">
            <QRCode value={joinUrl} size={160} />
          </div>
          <div>
            <h2 className="font-display text-xl sm:text-2xl text-spring-dark mb-2">Invite Others</h2>
            <p className="text-sm text-spring-muted mb-4 max-w-md mx-auto">
              Share this QR code or link so others can join your session
            </p>
            <p className="text-xs text-spring-muted mb-4 break-all font-mono bg-spring-bg/50 py-2 px-3 rounded-lg max-w-md mx-auto">
              {joinUrl || "—"}
            </p>
            <button
              type="button"
              onClick={copyLink}
              className="py-3 px-6 rounded-xl bg-spring-dark text-white font-body text-sm hover:bg-spring-accent transition-colors shadow-lg hover:-translate-y-0.5 active:translate-y-0"
            >
              Copy Link
            </button>
          </div>
        </div>
      ) : (
        // MULTIPLE: Colapsable y compacto
        <div className="mt-8 bg-white rounded-2xl border border-spring-accent/15 shadow-md overflow-hidden transition-all duration-300 animate-[fade-up_0.8s_ease_0.2s_both]">
          <button
            type="button"
            onClick={() => setIsShareExpanded(!isShareExpanded)}
            className="w-full py-4 px-6 flex items-center justify-between text-spring-dark hover:bg-spring-bg/30 transition-colors"
          >
            <span className="font-display text-base">Share Session</span>
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
              <div className="w-[120px] h-[120px] rounded-xl bg-spring-bg flex items-center justify-center p-3 shrink-0 mx-auto sm:mx-0">
                <QRCode value={joinUrl} size={96} />
              </div>
              <div className="flex-1 min-w-0 text-center sm:text-left">
                <h3 className="font-display text-base text-spring-dark mb-2">Invite Others</h3>
                <p className="text-xs text-spring-muted mb-3 break-all font-mono bg-spring-bg/50 py-2 px-3 rounded-lg">
                  {joinUrl || "—"}
                </p>
                <button
                  type="button"
                  onClick={copyLink}
                  className="py-2 px-4 rounded-lg border-[1.5px] border-spring-dark/20 bg-white text-spring-dark font-body text-sm hover:border-spring-accent hover:text-spring-accent transition-colors"
                >
                  Copy Link
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
