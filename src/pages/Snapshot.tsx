import { useRef, useCallback, useEffect } from "react";
import html2canvas from "html2canvas";
import { useQueryState } from "nuqs";
import {
  payloadParser,
  decodeSnapshotPayload,
  sessionParser,
  nameParser,
} from "../lib/nuqs";
import SnapshotCard from "../components/SnapshotCard";

const SNAPSHOT_LINK_KEY = "ikigai_snapshot_link";

export default function Snapshot() {
  const [payloadEncoded] = useQueryState("payload", payloadParser);
  const [session] = useQueryState("session", sessionParser);
  const [name] = useQueryState("name", nameParser);
  const cardRef = useRef<HTMLDivElement>(null);
  const payload = decodeSnapshotPayload(payloadEncoded);

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
      <main className="w-full max-w-lg px-6 py-12 text-center">
        <p className="text-[var(--color-ink-muted)] mb-4">
          No snapshot data found. Complete the Ikigai flow first.
        </p>
        <a
          href={`${window.location.pathname}?session=${new URLSearchParams(window.location.search).get("session") || ""}&step=lobby`}
          className="text-[var(--color-accent)] underline"
        >
          Back to lobby
        </a>
      </main>
    );
  }

  return (
    <main className="w-full max-w-lg px-6 py-12 flex flex-col items-center">
      <SnapshotCard ref={cardRef} payload={payload} />
      <div className="mt-8 flex flex-wrap gap-3 justify-center">
        <button
          type="button"
          onClick={handleDownload}
          className="py-3 px-5 bg-[var(--color-accent)] text-white rounded hover:bg-[var(--color-accent-hover)]"
        >
          Download as image
        </button>
        <button
          type="button"
          onClick={handleCopyLink}
          className="py-3 px-5 border border-[var(--color-border)] bg-[var(--color-surface)] rounded hover:bg-[var(--color-bg-subtle)]"
        >
          Copy share link
        </button>
      </div>
      <p className="mt-4 text-sm text-[var(--color-ink-muted)]">
        Share this link so others can view your Ikigai snapshot.
      </p>
    </main>
  );
}
