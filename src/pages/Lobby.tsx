import { Link } from "react-router-dom";
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
  const myParticipant = participants.find((p) => p.id === myParticipantId) ?? null;
  const mySnapshotLink = myParticipant?.shareLink ?? null;

  const joinUrl =
    typeof window !== "undefined" && session
      ? `${window.location.origin}${sessionUrl(session)}`
      : "";
  const startUrl = session && name ? workshopUrl(session, name, "1") : "#";
  const sessionLabel = session ? `Session #${session.slice(0, 8).toUpperCase()}` : "";

  const copyLink = () => {
    if (joinUrl) navigator.clipboard.writeText(joinUrl);
  };

  return (
    <div className="w-full max-w-[1100px] mx-auto px-4 sm:px-10 pt-4 pb-10">
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-9 animate-fade-up">
        <div>
          <p className="text-xs text-spring-muted tracking-[0.1em] uppercase mb-1 font-medium">
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
          participants.map((p) => {
            const isMe = p.id === myParticipantId;
            return (
              <div
                key={p.id}
                className="bg-spring-bg/30 rounded-2xl p-5 sm:p-6 border border-spring-accent/10 border-dashed shadow-sm flex items-center gap-4 animate-fade-up"
              >
                <div className="w-11 h-11 rounded-full flex items-center justify-center shrink-0 font-display text-lg text-spring-accent bg-spring-accent/15">
                  {p.firstName.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-display text-base text-spring-muted mb-1">
                    {isMe ? "You" : participantDisplayName(p)}
                  </p>
                  <p className="text-[0.72rem] text-spring-muted tracking-wide">{stepLabel(p.step)}</p>
                </div>
              </div>
            );
          })
        ) : (
          // Fallback skeleton while Firestore loads
          <div className="bg-spring-bg/30 rounded-2xl p-5 sm:p-6 border border-spring-accent/10 border-dashed shadow-sm flex items-center gap-4 animate-fade-up">
            <div className="w-11 h-11 rounded-full flex items-center justify-center shrink-0 font-display text-lg text-spring-accent bg-spring-accent/15">
              {name?.charAt(0)?.toUpperCase() ?? "?"}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-display text-base text-spring-muted mb-1">You</p>
              <p className="text-[0.72rem] text-spring-muted tracking-wide">In lobby</p>
            </div>
          </div>
        )}
      </div>

      {mySnapshotLink && (
        <p className="mt-4 text-sm text-spring-muted">
          <a href={mySnapshotLink} className="text-spring-accent underline hover:no-underline">
            Your Ikigai snapshot
          </a>
        </p>
      )}

      <div className="mt-6 bg-white rounded-2xl p-7 border border-spring-accent/10 flex flex-col sm:flex-row sm:items-center gap-6 animate-[fade-up_0.8s_ease_0.2s_both]">
        <div className="w-[90px] h-[90px] rounded-xl bg-spring-bg flex items-center justify-center shrink-0 p-2">
          <QRCode value={joinUrl} size={74} />
        </div>
        <div className="flex-1 min-w-0">
          <h2 className="font-display text-base text-spring-dark mb-1">Invite Others</h2>
          <p className="text-[0.78rem] text-spring-muted mb-3 break-all font-body">{joinUrl || "—"}</p>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={copyLink}
              className="py-2 px-3.5 rounded-lg border-[1.5px] border-spring-dark/20 bg-white text-spring-dark font-body text-[0.75rem] hover:border-spring-accent hover:text-spring-accent transition-colors"
            >
              Copy Link
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
