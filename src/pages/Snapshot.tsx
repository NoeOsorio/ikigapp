import { useRef, useCallback, useEffect } from "react";
import html2canvas from "html2canvas";
import { useNavigate } from "react-router-dom";
import { useQueryState } from "nuqs";
import { sessionParser, nameParser } from "../lib/nuqs";
import { getSnapshotLinkKey } from "../lib/snapshotStorage";
import { saveShareLink } from "../services/participants.service";
import { nameToParticipantId, participantDisplayName } from "../models/participant.model";
import { getUserIdentity } from "../lib/userIdentity";
import { useParticipants } from "../hooks/useParticipants";
import { Link } from "react-router-dom";
import { workshopUrl } from "../lib/routes";
import SnapshotCard from "../components/SnapshotCard";
import type { Intersections } from "../models/participant.model";

// Matcha color palette used both for rendering and html2canvas cloning
const MATCHA = {
  dark: "#1e2a1a",
  bg: "#e2ebe0",
  accent: "#6b8c5e",
  muted: "#4d6344",
} as const;

interface SnapshotProps {
  name: string;
  action: string;
  aiIkigai: string | null;
  isLoadingAi: boolean;
  intersections?: Intersections | null;
  ikigai?: string | null;
  actions?: string[] | null;
  sessionId?: string | null;
  showCompleteResumenCta?: boolean;
  completeResumenUrl?: string;
}

export default function Snapshot({
  name,
  action,
  aiIkigai,
  isLoadingAi,
  intersections,
  ikigai,
  actions,
  sessionId,
  showCompleteResumenCta,
  completeResumenUrl,
}: SnapshotProps) {
  const navigate = useNavigate();
  const [session] = useQueryState("session", sessionParser);
  const [rawName] = useQueryState("name", nameParser);
  const { data: participants = [] } = useParticipants(session);
  const cardRef = useRef<HTMLDivElement>(null);

  const userIdentity = getUserIdentity();
  const myParticipantId = userIdentity?.participantId ?? (rawName ? nameToParticipantId(rawName) : null);
  const myParticipant = participants.find((p) => p.id === myParticipantId);
  const myActualName = myParticipant ? participantDisplayName(myParticipant) : rawName;

  const handleBackToLobby = useCallback(() => {
    navigate(workshopUrl(session ?? "", myActualName ?? "", "lobby"));
  }, [navigate, session, myActualName]);

  useEffect(() => {
    if (typeof window !== "undefined" && session && rawName) {
      const link = window.location.href;
      try {
        sessionStorage.setItem(getSnapshotLinkKey(session, rawName), link);
      } catch {
        // ignore
      }
      saveShareLink(session, nameToParticipantId(rawName), link).catch(() => {});
    }
  }, [session, rawName]);

  const handleDownload = useCallback(async () => {
    const el = cardRef.current;
    if (!el) return;

    try {
      const canvas = await html2canvas(el, {
        useCORS: true,
        scale: 2,
        backgroundColor: "#ffffff",
        logging: false,
        allowTaint: false,
        imageTimeout: 0,
        onclone: (clonedDoc) => {
          const card = clonedDoc.querySelector<HTMLElement>("[data-snapshot-card]");
          if (!card) return;

          // Force Tailwind CSS-variable-based colors to plain hex/rgba so
          // html2canvas (which doesn't resolve CSS custom properties) renders correctly.
          const bgMap: Record<string, string> = {
            "bg-matcha-dark": MATCHA.dark,
            "bg-matcha-bg": MATCHA.bg,
            "bg-matcha-accent": MATCHA.accent,
            "bg-white": "#ffffff",
          };
          const textMap: Record<string, string> = {
            "text-matcha-dark": MATCHA.dark,
            "text-matcha-accent": MATCHA.accent,
            "text-matcha-muted": MATCHA.muted,
            "text-white": "#ffffff",
          };

          const all = [card, ...Array.from(card.querySelectorAll<HTMLElement>("*"))];
          for (const el of all) {
            for (const cls of Array.from(el.classList)) {
              if (cls in bgMap) el.style.backgroundColor = bgMap[cls];
              if (cls in textMap) el.style.color = textMap[cls];
              if (cls === "ring-black/5") el.style.boxShadow = "0 0 0 1px rgba(0,0,0,0.05)";
              // Opacity-based classes that use CSS vars
              if (cls === "text-white/50") el.style.color = "rgba(255,255,255,0.5)";
              if (cls === "text-white/30") el.style.color = "rgba(255,255,255,0.3)";
              if (cls === "bg-matcha-accent/20") el.style.backgroundColor = "rgba(107,140,94,0.2)";
            }
          }
        },
      });

      const link = document.createElement("a");
      const filename = name
        ? `ikigai-${name.replace(/\s+/g, "-")}.png`
        : "ikigai-snapshot.png";
      link.download = filename;
      link.href = canvas.toDataURL("image/png");
      link.click();
    } catch (e) {
      console.error("Download error:", e);
      alert("No se pudo descargar la imagen. Intenta de nuevo.");
    }
  }, [name]);

  const handleCopyLink = useCallback(() => {
    navigator.clipboard.writeText(window.location.href);
  }, []);

  return (
    <div className="w-full min-h-screen flex flex-col items-center justify-center gap-10 px-4 py-16 relative">
      {/* Background decoration */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_0%,rgba(107,140,94,0.12),transparent)]" />
        <div className="absolute bottom-0 left-0 right-0 h-64 bg-[radial-gradient(ellipse_60%_100%_at_50%_100%,rgba(30,42,26,0.06),transparent)]" />
      </div>

      {/* Legacy CTA: complete new intersections step */}
      {showCompleteResumenCta && completeResumenUrl && (
        <div className="relative z-10 w-full max-w-[500px] mb-4 animate-fade-up">
          <Link
            to={completeResumenUrl}
            className="block rounded-2xl border border-matcha-accent/30 bg-matcha-bg/80 px-5 py-4 text-center text-sm text-matcha-dark hover:border-matcha-accent hover:bg-matcha-accent/10 transition-colors"
          >
            Completa tu resumen con intersecciones e Ikigai →
          </Link>
        </div>
      )}

      {/* Card */}
      <div className="animate-fade-up relative z-10 w-full flex justify-center">
        <SnapshotCard
          ref={cardRef}
          name={name}
          action={action}
          aiIkigai={aiIkigai}
          isLoadingAi={isLoadingAi}
          sessionId={sessionId ?? session}
          intersections={intersections}
          ikigai={ikigai}
          actions={actions}
        />
      </div>

      {/* Action buttons */}
      <div className="relative z-10 w-full max-w-[500px] flex flex-col sm:flex-row gap-3 animate-[fade-up_0.8s_ease_0.25s_both]">
        <button
          type="button"
          onClick={handleDownload}
          className="flex-1 py-3.5 px-5 rounded-2xl bg-matcha-dark text-white font-display text-sm font-medium flex items-center justify-center gap-2 hover:bg-matcha-accent transition-all shadow-lg shadow-matcha-dark/20 hover:shadow-matcha-accent/25 hover:-translate-y-0.5 active:translate-y-0"
        >
          <span aria-hidden>↓</span> Descargar imagen
        </button>
        <button
          type="button"
          onClick={handleCopyLink}
          className="flex-1 py-3.5 px-5 rounded-2xl bg-white text-matcha-dark font-display text-sm font-medium border border-matcha-accent/25 flex items-center justify-center gap-2 hover:border-matcha-accent hover:text-matcha-accent transition-all hover:-translate-y-0.5 active:translate-y-0 shadow-sm"
        >
          <span aria-hidden>🔗</span> Copiar enlace
        </button>
        <button
          type="button"
          onClick={handleBackToLobby}
          className="flex-1 py-3.5 px-5 rounded-2xl bg-white text-matcha-muted font-display text-sm font-medium border border-matcha-accent/15 flex items-center justify-center gap-2 hover:border-matcha-accent/40 transition-all hover:-translate-y-0.5 active:translate-y-0 shadow-sm"
        >
          Volver al lobby
        </button>
      </div>
    </div>
  );
}
