import { useRef, useCallback, useEffect } from "react";
import html2canvas from "html2canvas";
import { useNavigate } from "react-router-dom";
import { useQueryState } from "nuqs";
import { sessionParser, nameParser, type SnapshotPayload } from "../lib/nuqs";
import { getSnapshotLinkKey } from "../lib/snapshotStorage";
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
      try {
        sessionStorage.setItem(getSnapshotLinkKey(session, name), window.location.href);
      } catch {
        // ignore
      }
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
    <div className="w-full min-h-screen flex flex-col items-center justify-center gap-8 px-4 relative">
      {/* Subtle radial gradient overlay */}
      <div className="fixed inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_top,var(--color-matcha-accent)_0%,transparent_50%)] opacity-[0.08]" />
      
      <div className="animate-fade-up relative z-10">
        <SnapshotCard ref={cardRef} payload={payload} />
      </div>
      <div className="flex flex-wrap gap-3 justify-center animate-[fade-up_0.8s_ease_0.2s_both] relative z-10">
        <button
          type="button"
          onClick={handleDownload}
          className="flex-1 min-w-[140px] py-3.5 px-4 rounded-xl bg-matcha-dark text-white font-display text-sm flex items-center justify-center gap-1.5 hover:bg-matcha-accent transition-colors shadow-lg hover:shadow-matcha-accent/25 hover:-translate-y-0.5 active:translate-y-0"
        >
          ⬇ Download Image
        </button>
        <button
          type="button"
          onClick={handleCopyLink}
          className="flex-1 min-w-[140px] py-3.5 px-4 rounded-xl bg-white text-matcha-dark font-display text-sm border-[1.5px] border-matcha-accent/20 flex items-center justify-center gap-1.5 hover:border-matcha-accent hover:text-matcha-accent transition-colors hover:-translate-y-0.5 active:translate-y-0"
        >
          🔗 Copy Share Link
        </button>
        <button
          type="button"
          onClick={handleBackToLobby}
          className="flex-1 min-w-[140px] py-3.5 px-4 rounded-xl bg-white text-matcha-dark font-display text-sm border-[1.5px] border-matcha-accent/20 flex items-center justify-center gap-1.5 hover:border-matcha-accent hover:text-matcha-accent transition-colors hover:-translate-y-0.5 active:translate-y-0"
        >
          Back to lobby
        </button>
      </div>
    </div>
  );
}
