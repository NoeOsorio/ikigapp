import { useQueryState } from "nuqs";
import { sessionParser, nameParser } from "../lib/nuqs";
import QRCode from "../components/QRCode";
import { useState, useEffect } from "react";

const SNAPSHOT_LINK_KEY = "ikigai_snapshot_link";

export default function Lobby() {
  const [session] = useQueryState("session", sessionParser);
  const [name] = useQueryState("name", nameParser);
  const [mySnapshotLink, setMySnapshotLink] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window === "undefined" || !session || !name) return;
    try {
      const key = `${SNAPSHOT_LINK_KEY}_${session}_${encodeURIComponent(name)}`;
      setMySnapshotLink(sessionStorage.getItem(key));
    } catch {
      setMySnapshotLink(null);
    }
  }, [session, name]);

  const joinUrl =
    typeof window !== "undefined" && session
      ? `${window.location.origin}${window.location.pathname}?session=${session}`
      : "";

  return (
    <main className="w-full max-w-lg px-6 py-12">
      <h1 className="text-2xl font-semibold text-[var(--color-ink)] mb-2">
        Session lobby
      </h1>
      <p className="text-[var(--color-ink-muted)] mb-6 text-sm">
        Share the link or QR code so others can join. When you’re ready, start
        your Ikigai flow below.
      </p>
      <div className="mb-8 p-4 bg-[var(--color-surface)] border border-[var(--color-border)] rounded">
        <p className="text-sm text-[var(--color-ink-muted)] mb-2">
          You’re in as <strong className="text-[var(--color-ink)]">{name || "—"}</strong>
        </p>
        <ul className="text-sm text-[var(--color-ink-muted)] mb-4">
          <li>Participants will appear here when real-time sync is enabled.</li>
          <li>Share the link below so others can join.</li>
          {mySnapshotLink && (
            <li>
              <a href={mySnapshotLink} className="text-[var(--color-accent)] underline">
                Your Ikigai snapshot
              </a>
            </li>
          )}
        </ul>
        <QRCode value={joinUrl} />
        <div className="mt-4 flex items-center gap-2">
          <input
            readOnly
            value={joinUrl}
            className="flex-1 py-2 px-3 text-sm border border-[var(--color-border)] bg-white rounded text-[var(--color-ink)]"
          />
          <button
            type="button"
            onClick={() => {
              navigator.clipboard.writeText(joinUrl);
            }}
            className="py-2 px-4 border border-[var(--color-border)] bg-[var(--color-surface)] rounded text-sm hover:bg-[var(--color-bg-subtle)]"
          >
            Copy
          </button>
        </div>
      </div>
      <a
        href={typeof window !== "undefined" ? `${window.location.pathname}?session=${session}&step=1&name=${encodeURIComponent(name ?? "")}` : "#"}
        className="inline-block py-3 px-6 bg-[var(--color-accent)] text-white rounded hover:bg-[var(--color-accent-hover)]"
      >
        Start Ikigai flow
      </a>
    </main>
  );
}
