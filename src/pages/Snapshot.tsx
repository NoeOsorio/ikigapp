import { useRef, useCallback, useEffect } from "react";
import html2canvas from "html2canvas";
import { useNavigate } from "react-router-dom";
import { useQueryState } from "nuqs";
import { sessionParser, nameParser, type SnapshotPayload } from "../lib/nuqs";
import { getSnapshotLinkKey } from "../lib/snapshotStorage";
import { saveShareLink } from "../services/participants.service";
import { nameToParticipantId } from "../models/participant.model";
import { workshopUrl } from "../lib/routes";
import SnapshotCard from "../components/SnapshotCard";

interface SnapshotProps {
  payload: SnapshotPayload;
}

export default function Snapshot({ payload }: SnapshotProps) {
  const navigate = useNavigate();
  const [session] = useQueryState("session", sessionParser);
  const [name] = useQueryState("name", nameParser);
  const cardRef = useRef<HTMLDivElement>(null);

  const handleBackToLobby = useCallback(() => {
    navigate(workshopUrl(session ?? "", name ?? "", "lobby"));
  }, [navigate, session, name]);

  useEffect(() => {
    if (typeof window !== "undefined" && session && name) {
      const link = window.location.href;
      try {
        sessionStorage.setItem(getSnapshotLinkKey(session, name), link);
      } catch {
        // ignore
      }
      saveShareLink(session, nameToParticipantId(name), link).catch(() => {});
    }
  }, [session, name]);

  const handleDownload = useCallback(async () => {
    const el = cardRef.current;
    if (!el) return;
    try {
      const canvas = await html2canvas(el, {
        useCORS: true,
        scale: 2,
        backgroundColor: null,
        logging: false,
      });
      const link = document.createElement("a");
      link.download = `ikigai-${payload.name.replace(/\s+/g, "-") || "snapshot"}.png`;
      link.href = canvas.toDataURL("image/png");
      link.click();
    } catch (e) {
      console.error(e);
    }
  }, [payload]);

  const handleCopyLink = useCallback(() => {
    navigator.clipboard.writeText(window.location.href);
  }, []);

  return (
    <div className="w-full flex flex-col items-center gap-8">
      <div className="animate-fade-up">
        <SnapshotCard ref={cardRef} payload={payload} />
      </div>
      <div className="flex flex-wrap gap-3 justify-center animate-[fade-up_0.8s_ease_0.2s_both]">
        <button
          type="button"
          onClick={handleDownload}
          className="flex-1 min-w-[140px] py-3.5 px-4 rounded-xl bg-spring-dark text-white font-display text-sm flex items-center justify-center gap-1.5 hover:bg-spring-accent transition-colors"
        >
          ⬇ Download Image
        </button>
        <button
          type="button"
          onClick={handleCopyLink}
          className="flex-1 min-w-[140px] py-3.5 px-4 rounded-xl bg-white text-spring-dark font-display text-sm border-[1.5px] border-spring-dark/15 flex items-center justify-center gap-1.5 hover:border-spring-accent hover:text-spring-accent transition-colors"
        >
          🔗 Copy Share Link
        </button>
        <button
          type="button"
          onClick={handleBackToLobby}
          className="flex-1 min-w-[140px] py-3.5 px-4 rounded-xl bg-white text-spring-dark font-display text-sm border-[1.5px] border-spring-dark/15 flex items-center justify-center gap-1.5 hover:border-spring-accent hover:text-spring-accent transition-colors"
        >
          Back to lobby
        </button>
      </div>
    </div>
  );
}
