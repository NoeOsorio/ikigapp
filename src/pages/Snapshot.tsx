import { useRef, useCallback, useEffect } from "react";
import html2canvas from "html2canvas";
import { useQueryState } from "nuqs";
import {
  payloadParser,
  decodeSnapshotPayload,
  sessionParser,
  nameParser,
  stepParser,
} from "../lib/nuqs";
import SnapshotCard from "../components/SnapshotCard";

const SNAPSHOT_LINK_KEY = "ikigai_snapshot_link";

export default function Snapshot() {
  const [payloadEncoded] = useQueryState("payload", payloadParser);
  const [session] = useQueryState("session", sessionParser);
  const [name] = useQueryState("name", nameParser);
  const [, setStep] = useQueryState("step", stepParser);
  const cardRef = useRef<HTMLDivElement>(null);
  const payload = decodeSnapshotPayload(payloadEncoded);

  const handleBackToLobby = useCallback(() => {
    setStep("lobby");
  }, [setStep]);

  useEffect(() => {
    if (payload && typeof window !== "undefined") {
      try {
        const key = `${SNAPSHOT_LINK_KEY}_${session ?? ""}_${encodeURIComponent(name ?? "")}`;
        sessionStorage.setItem(key, window.location.href);
      } catch (_) {}
    }
  }, [payload, session, name]);

  const handleDownload = useCallback(async () => {
    const el = cardRef.current;
    if (!el || !payload) return;
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

  if (!payload) {
    return (
      <div className="w-full max-w-lg px-6 py-12 text-center">
        <p className="text-spring-muted mb-4">No snapshot data found. Complete the Ikigai flow first.</p>
        <a
          href={`${window.location.pathname}?session=${new URLSearchParams(window.location.search).get("session") || ""}&step=lobby`}
          className="text-spring-accent underline hover:no-underline"
        >
          Back to lobby
        </a>
      </div>
    );
  }

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
